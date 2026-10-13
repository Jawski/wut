<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';
require __DIR__ . '/sklad-dane.php';
require __DIR__ . '/uklad.php';

wymusHttps();
startSesji();
wymagajLogowania();

$zespol = czytajTresc('zespol');
if ($zespol === null) {
    otworzStrone('Sezony');
    echo '<p class="komunikat komunikat-zle">Nie znaleziono pliku dane/zespol.json.</p>';
    zamknijStrone();
    exit;
}

$blad = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!sprawdzToken()) {
        $blad = 'Formularz stracił ważność. Otwórz go jeszcze raz.';
    } else {
        $blad = match ((string) ($_POST['co'] ?? '')) {
            'dodaj'  => dodajSezon($zespol),
            'zapisz' => zapiszSezon($zespol),
            'usun'   => usunSezon($zespol),
            default  => 'Nieznana operacja.',
        };
        if ($blad === null) {
            header('Location: sezony.php');
            exit;
        }
    }
}

/**
 * Nowy sezon. Archiwalny dochodzi obok biezacego, nowy biezacy domyka
 * poprzedni: jego sklad idzie do archiwum w calosci, razem z kopia zdjec.
 * Skladu na start mozna nie brac znikad albo przepisac go z innego sezonu.
 */
function dodajSezon(array $zespol): ?string
{
    $etykieta = trim((string) ($_POST['etykieta'] ?? ''));
    if ($etykieta === '') {
        return 'Podaj nazwę sezonu, np. 2026/2027.';
    }
    $id = trim((string) ($_POST['id'] ?? ''));
    $id = $id === '' ? idZEtykiety($etykieta) : zrobSlug($id);
    if ($id === '') {
        return 'Z tej nazwy nie da się zrobić identyfikatora — wpisz go ręcznie.';
    }
    $sezony = $zespol['sezony'] ?? [];
    if (wSezonach($sezony, $id)) {
        return 'Sezon o identyfikatorze „' . $id . '” już istnieje.';
    }

    $biezacy   = ((string) ($_POST['rodzaj'] ?? 'archiwalny')) === 'biezacy';
    $obrot     = !empty($_POST['obrot']);
    $zrodlo    = (string) ($_POST['zrodlo'] ?? '');
    $idStarego = idSezonuBiezacego($zespol);

    if ($zrodlo !== '' && !wSezonach($sezony, $zrodlo)) {
        return 'Nie znaleziono sezonu, z którego skład miał zostać przepisany.';
    }
    $kopia = $zrodlo === ''
        ? []
        : array_values(wczytajSklad($zespol, $zrodlo, $zrodlo === $idStarego));

    /* --- sezon archiwalny: dochodzi obok, biezacy zostaje bez zmian --- */

    if (!$biezacy) {
        if ($kopia) {
            $bladZdjec = skopiujZdjeciaMiedzySezonami(
                $kopia, $zrodlo, $zrodlo === $idStarego, $id, false
            );
            if ($bladZdjec !== null) {
                return $bladZdjec;
            }
            $archiwum = czytajTresc('zespol-archiwum') ?? [];
            $archiwum[$id] = $kopia;
            $bladArchiwum = zapiszTresc('zespol-archiwum', $archiwum, true);
            if ($bladArchiwum !== null) {
                return $bladArchiwum;
            }
        }
        $sezony[] = ['id' => $id, 'label' => $etykieta, 'obrot' => $obrot];
        $zespol['sezony'] = poKolei($sezony);
        return zapiszTresc('zespol', $zespol);
    }

    /* --- nowy biezacy: poprzedni schodzi do archiwum --- */

    $starySklad = $zespol['sklad'] ?? [];
    if ($idStarego !== '' && $starySklad) {
        $bladZdjec = skopiujZdjeciaSezonu($starySklad, $idStarego);
        if ($bladZdjec !== null) {
            return $bladZdjec;
        }
        $archiwum = czytajTresc('zespol-archiwum') ?? [];
        $archiwum[$idStarego] = array_values($starySklad);
        $bladArchiwum = zapiszTresc('zespol-archiwum', $archiwum, true);
        if ($bladArchiwum !== null) {
            return 'Sezon nie został zamknięty: ' . $bladArchiwum;
        }
    }

    // sklad przepisany ze starszego sezonu potrzebuje zdjec tam, gdzie strona
    // szuka ich dla biezacego; przy kopii z sezonu wlasnie zamknietego juz tam sa
    if ($kopia && $zrodlo !== $idStarego) {
        $bladZdjec = skopiujZdjeciaMiedzySezonami($kopia, $zrodlo, false, $id, true);
        if ($bladZdjec !== null) {
            return $bladZdjec;
        }
    }

    foreach ($sezony as $i => $s) {
        unset($sezony[$i]['current']);
    }
    $sezony[] = ['id' => $id, 'label' => $etykieta, 'obrot' => $obrot, 'current' => true];

    $zespol['sezony']     = poKolei($sezony);
    $zespol['sklad']      = $kopia;
    $zespol['bezZdjecia'] = przeliczBezZdjecia($kopia);
    return zapiszTresc('zespol', $zespol);
}

function zapiszSezon(array $zespol): ?string
{
    $id = (string) ($_POST['id'] ?? '');
    $etykieta = trim((string) ($_POST['etykieta'] ?? ''));
    if ($etykieta === '') {
        return 'Nazwa sezonu nie może być pusta.';
    }
    $znaleziony = false;
    foreach ($zespol['sezony'] ?? [] as $i => $s) {
        if ((string) ($s['id'] ?? '') === $id) {
            $zespol['sezony'][$i]['label'] = $etykieta;
            $zespol['sezony'][$i]['obrot'] = !empty($_POST['obrot']);
            $znaleziony = true;
        }
    }
    if (!$znaleziony) {
        return 'Nie znaleziono takiego sezonu.';
    }
    return zapiszTresc('zespol', $zespol);
}

/**
 * Usuwa sezon razem z jego skladem. Gdy znika sezon biezacy, jego role przejmuje
 * najnowszy z pozostalych: sklad wraca z archiwum na miejsce biezacego, a zdjecia
 * z katalogu sezonu tam, gdzie strona szuka ich dla biezacego.
 */
function usunSezon(array $zespol): ?string
{
    $id = (string) ($_POST['id'] ?? '');
    $sezony = $zespol['sezony'] ?? [];
    if (!wSezonach($sezony, $id)) {
        return 'Nie znaleziono takiego sezonu.';
    }
    if (count($sezony) < 2) {
        return 'To jedyny sezon — nie ma co po nim zostawić. Najpierw załóż nowy.';
    }

    $toBiezacy = ($id === idSezonuBiezacego($zespol));
    $archiwum  = czytajTresc('zespol-archiwum') ?? [];

    $sezony = poKolei(array_filter($sezony, fn($s) => (string) ($s['id'] ?? '') !== $id));

    if ($toBiezacy) {
        $ostatni = count($sezony) - 1;
        $nowyId  = (string) $sezony[$ostatni]['id'];
        foreach ($sezony as $i => $s) {
            unset($sezony[$i]['current']);
        }
        $sezony[$ostatni]['current'] = true;

        $nowySklad = $archiwum[$nowyId] ?? [];
        $bladZdjec = przywrocZdjeciaSezonu($nowySklad, $nowyId);
        if ($bladZdjec !== null) {
            return $bladZdjec;
        }
        unset($archiwum[$nowyId]);
        $zespol['sklad'] = array_values($nowySklad);
    } else {
        unset($archiwum[$id]);
    }

    $zespol['sezony']     = $sezony;
    $zespol['bezZdjecia'] = przeliczBezZdjecia($zespol['sklad'] ?? []);

    $bladArchiwum = zapiszTresc('zespol-archiwum', $archiwum, true);
    if ($bladArchiwum !== null) {
        return $bladArchiwum;
    }
    return zapiszTresc('zespol', $zespol);
}

/** Sezony po kolei, od najstarszego - taka jest kolejnosc zakladek na stronie. */
function poKolei(array $sezony): array
{
    $sezony = array_values($sezony);
    usort($sezony, fn($a, $b) => strcmp((string) ($a['id'] ?? ''), (string) ($b['id'] ?? '')));
    return $sezony;
}

/* ------------------------------------------------------------------- widok */

$sezony    = $zespol['sezony'] ?? [];
$idBiezacy = idSezonuBiezacego($zespol);
$archiwum  = czytajTresc('zespol-archiwum') ?? [];

$ileOsob = function (string $id) use ($zespol, $idBiezacy, $archiwum): int {
    return $id === $idBiezacy ? count($zespol['sklad'] ?? []) : count($archiwum[$id] ?? []);
};

$edytowany = null;
if (isset($_GET['edytuj'])) {
    foreach ($sezony as $s) {
        if ((string) ($s['id'] ?? '') === (string) $_GET['edytuj']) {
            $edytowany = $s;
        }
    }
}

otworzStrone($edytowany ? (string) $edytowany['label'] : 'Sezony',
             $edytowany ? 'sezony.php' : 'sklad.php');
?>

<?php if ($blad): ?>
    <p class="komunikat komunikat-zle" role="alert"><?= e($blad) ?></p>
<?php endif; ?>

<?php if ($edytowany):
    $id = (string) $edytowany['id'];
    $to = $id === $idBiezacy; ?>

    <h1><?= e((string) $edytowany['label']) ?> <?php if ($to): ?><span class="znacznik">bieżący</span><?php endif; ?></h1>

    <form method="post" class="formularz waski">
        <input type="hidden" name="token" value="<?= e(token()) ?>">
        <input type="hidden" name="co" value="zapisz">
        <input type="hidden" name="id" value="<?= e($id) ?>">

        <label>
            <span>Nazwa</span>
            <input type="text" name="etykieta" required value="<?= e((string) $edytowany['label']) ?>">
        </label>

        <label class="w-linii">
            <span>Identyfikator</span>
            <span class="jednolity stale"><?= e($id) ?></span>
        </label>

        <label class="w-linii">
            <span>Osób w składzie</span>
            <a href="sklad.php?sezon=<?= urlencode($id) ?>"><?= $ileOsob($id) ?></a>
        </label>

        <label class="ptaszek">
            <input type="checkbox" name="obrot" value="1" <?= !empty($edytowany['obrot']) ? 'checked' : '' ?>>
            <span>Obracanie kart</span>
        </label>

        <div class="pod-formularzem">
            <button type="submit" class="przycisk glowny">Zapisz</button>
            <a class="przycisk pusty" href="sezony.php">Anuluj</a>
        </div>
    </form>

    <?php if (count($sezony) > 1):
        $pozostale = array_values(array_filter($sezony, fn($x) => (string) $x['id'] !== $id));
        $nastepca  = (string) ($pozostale[count($pozostale) - 1]['label'] ?? '');
        $pytanie   = 'Usunąć sezon ' . $edytowany['label'] . ' razem ze składem ' . $ileOsob($id) . ' osób?'
            . ($to ? ' Bieżącym stanie się wtedy ' . $nastepca . ' i wróci jego skład.' : ''); ?>
        <form method="post" class="osobno" onsubmit="return confirm('<?= e(addslashes($pytanie)) ?>');">
            <input type="hidden" name="token" value="<?= e(token()) ?>">
            <input type="hidden" name="co" value="usun">
            <input type="hidden" name="id" value="<?= e($id) ?>">
            <button type="submit" class="usun">Usuń sezon</button>
        </form>
    <?php endif; ?>

<?php else: ?>

    <h1>Sezony</h1>

    <table class="sezony-lista">
        <tr>
            <th>Sezon</th>
            <th>Identyfikator</th>
            <th>Osób</th>
            <th>Karty</th>
        </tr>
        <?php foreach ($sezony as $s):
            $id = (string) ($s['id'] ?? '');
            $to = $id === $idBiezacy; ?>
            <tr>
                <td>
                    <a class="sezon-nazwa" href="sezony.php?edytuj=<?= urlencode($id) ?>">
                        <?= e((string) ($s['label'] ?? '')) ?>
                    </a>
                    <?php if ($to): ?><span class="znacznik">bieżący</span><?php endif; ?>
                </td>
                <td class="jednolity"><?= e($id) ?></td>
                <td><a href="sklad.php?sezon=<?= urlencode($id) ?>"><?= $ileOsob($id) ?></a></td>
                <td><?= !empty($s['obrot']) ? 'obracane' : 'jednostronne' ?></td>
            </tr>
        <?php endforeach; ?>
    </table>

    <h2>Nowy sezon</h2>

    <form method="post" class="formularz nowy-sezon">
        <input type="hidden" name="token" value="<?= e(token()) ?>">
        <input type="hidden" name="co" value="dodaj">

        <div class="kolumny">
            <div class="kolumna">
                <label>
                    <span>Nazwa</span>
                    <input type="text" name="etykieta" id="pole-etykieta" required placeholder="2026/2027">
                </label>
                <label>
                    <span>Identyfikator</span>
                    <input type="text" name="id" id="pole-id" pattern="[a-z0-9\-]+" placeholder="2026-27">
                </label>
                <label>
                    <span>Skład na start</span>
                    <select name="zrodlo" id="pole-zrodlo">
                        <option value="">pusty</option>
                        <?php foreach (array_reverse($sezony) as $s): ?>
                            <option value="<?= e((string) $s['id']) ?>" <?= (string) $s['id'] === $idBiezacy ? 'selected' : '' ?>>
                                kopia z <?= e((string) $s['label']) ?> (<?= $ileOsob((string) $s['id']) ?> os.)
                            </option>
                        <?php endforeach; ?>
                    </select>
                </label>
            </div>
            <div class="kolumna">
                <fieldset>
                    <legend>Rodzaj</legend>
                    <label class="ptaszek">
                        <input type="radio" name="rodzaj" value="archiwalny" checked>
                        <span>Archiwalny</span>
                    </label>
                    <label class="ptaszek">
                        <input type="radio" name="rodzaj" value="biezacy" id="pole-biezacy">
                        <span>Nowy bieżący</span>
                    </label>
                    <label class="ptaszek">
                        <input type="checkbox" name="obrot" value="1" checked>
                        <span>Obracanie kart</span>
                    </label>

                    <p id="opis-biezacy" class="ostrzezenie" hidden>
                        <?= e(etykietaSezonu($sezony, $idBiezacy)) ?>
                        (<?= $ileOsob($idBiezacy) ?> os.) przejdzie do archiwum.
                    </p>
                </fieldset>
            </div>
        </div>

        <div class="pod-formularzem">
            <button type="submit" class="przycisk glowny">Dodaj sezon</button>
        </div>
    </form>

    <script>
    // identyfikator podpowiadamy z nazwy: "2026/2027" to katalog "2026-27"
    (function () {
        const nazwa = document.getElementById('pole-etykieta');
        const id = document.getElementById('pole-id');
        id.addEventListener('input', function () { id.dataset.wlasny = '1'; });
        nazwa.addEventListener('input', function () {
            if (id.dataset.wlasny) return;
            const m = nazwa.value.trim().match(/^(\d{4})\s*\/\s*(\d{4}|\d{2})$/);
            id.value = m
                ? m[1] + '-' + m[2].slice(-2)
                : nazwa.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        });
    })();

    document.querySelectorAll('input[name=rodzaj]').forEach(function (r) {
        r.addEventListener('change', function () {
            document.getElementById('opis-biezacy').hidden = !document.getElementById('pole-biezacy').checked;
        });
    });
    </script>

<?php endif; ?>

<?php zamknijStrone(); ?>
