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
            'nazwa'  => zmienNazwe($zespol),
            'obrot'  => przelaczObrot($zespol),
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
 * Nowy sezon. Archiwalny tylko dopisuje sie do listy - sklad uzupelnia sie
 * potem recznie. Biezacy domyka poprzedni: jego sklad idzie do archiwum w
 * calosci, razem z opisami i kopia zdjec, a nowy zaczyna albo od tych samych
 * osob, albo od zera.
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
    if (wSezonach($zespol['sezony'] ?? [], $id)) {
        return 'Sezon o identyfikatorze „' . $id . '” już istnieje.';
    }

    $biezacy = ((string) ($_POST['rodzaj'] ?? 'archiwalny')) === 'biezacy';
    $obrot   = !empty($_POST['obrot']);
    $sezony  = $zespol['sezony'] ?? [];

    if (!$biezacy) {
        $sezony[] = ['id' => $id, 'label' => $etykieta, 'obrot' => $obrot];
        $zespol['sezony'] = poKolei($sezony);
        return zapiszTresc('zespol', $zespol);
    }

    $stary = idSezonuBiezacego($zespol);
    $starySklad = $zespol['sklad'] ?? [];

    if ($stary !== '' && $starySklad) {
        $bladZdjec = skopiujZdjeciaSezonu($starySklad, $stary);
        if ($bladZdjec !== null) {
            return $bladZdjec;
        }
        // sklad idzie do archiwum taki, jaki byl - z opisami, projektami i
        // zawodami, zeby zamkniety sezon dalej mial po stronie co pokazac
        $archiwum = czytajTresc('zespol-archiwum') ?? [];
        $archiwum[$stary] = array_values($starySklad);
        $bladArchiwum = zapiszTresc('zespol-archiwum', $archiwum);
        if ($bladArchiwum !== null) {
            return 'Sezon nie został zamknięty: ' . $bladArchiwum;
        }
    }

    foreach ($sezony as $i => $s) {
        unset($sezony[$i]['current']);
    }
    $sezony[] = ['id' => $id, 'label' => $etykieta, 'obrot' => $obrot, 'current' => true];

    $zespol['sezony'] = poKolei($sezony);
    $zespol['sklad']  = empty($_POST['kopiuj']) ? [] : array_values($starySklad);
    $zespol['bezZdjecia'] = przeliczBezZdjecia($zespol['sklad']);
    return zapiszTresc('zespol', $zespol);
}

function zmienNazwe(array $zespol): ?string
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
            $znaleziony = true;
        }
    }
    if (!$znaleziony) {
        return 'Nie znaleziono takiego sezonu.';
    }
    return zapiszTresc('zespol', $zespol);
}

function przelaczObrot(array $zespol): ?string
{
    $id = (string) ($_POST['id'] ?? '');
    $znaleziony = false;
    foreach ($zespol['sezony'] ?? [] as $i => $s) {
        if ((string) ($s['id'] ?? '') === $id) {
            $zespol['sezony'][$i]['obrot'] = !empty($_POST['wlaczone']);
            $znaleziony = true;
        }
    }
    if (!$znaleziony) {
        return 'Nie znaleziono takiego sezonu.';
    }
    return zapiszTresc('zespol', $zespol);
}

function usunSezon(array $zespol): ?string
{
    $id = (string) ($_POST['id'] ?? '');
    if ($id === idSezonuBiezacego($zespol)) {
        return 'Nie można usunąć bieżącego sezonu — najpierw załóż nowy bieżący.';
    }
    $sezony = array_values(array_filter(
        $zespol['sezony'] ?? [],
        fn($s) => (string) ($s['id'] ?? '') !== $id
    ));
    if (count($sezony) === count($zespol['sezony'] ?? [])) {
        return 'Nie znaleziono takiego sezonu.';
    }
    $zespol['sezony'] = $sezony;

    $archiwum = czytajTresc('zespol-archiwum') ?? [];
    if (array_key_exists($id, $archiwum)) {
        unset($archiwum[$id]);
        $bladArchiwum = zapiszTresc('zespol-archiwum', $archiwum);
        if ($bladArchiwum !== null) {
            return $bladArchiwum;
        }
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

otworzStrone('Sezony', 'sklad.php');
?>

<h1>Sezony</h1>
<p class="wstep">
    Bieżący sezon to ten, który strona pokazuje jako domyślny. Obracanie kart
    ustawiasz osobno dla każdego sezonu: włączone znaczy, że karta ma rewers
    z opisem, projektami i zawodami. Przy dwóch najstarszych składach jest
    wyłączone, bo spisane są bez opisów.
</p>

<?php if ($blad): ?>
    <p class="komunikat komunikat-zle" role="alert"><?= e($blad) ?></p>
<?php endif; ?>

<table class="sezony-lista">
    <tr>
        <th>Sezon</th>
        <th>Identyfikator</th>
        <th>Osób</th>
        <th>Obracanie kart</th>
        <th></th>
    </tr>
    <?php foreach ($sezony as $s):
        $id = (string) ($s['id'] ?? '');
        $to = $id === $idBiezacy;
        $ile = $to ? count($zespol['sklad'] ?? []) : count($archiwum[$id] ?? []); ?>
        <tr>
            <td>
                <form method="post" class="w-linii nazwa-form">
                    <input type="hidden" name="token" value="<?= e(token()) ?>">
                    <input type="hidden" name="co" value="nazwa">
                    <input type="hidden" name="id" value="<?= e($id) ?>">
                    <input type="text" name="etykieta" value="<?= e((string) ($s['label'] ?? '')) ?>">
                    <button type="submit" class="przycisk maly">Zmień nazwę</button>
                </form>
                <?php if ($to): ?><span class="znacznik">bieżący</span><?php endif; ?>
            </td>
            <td class="jednolity"><?= e($id) ?></td>
            <td><a href="sklad.php?sezon=<?= urlencode($id) ?>"><?= $ile ?></a></td>
            <td>
                <form method="post" class="obrot-form">
                    <input type="hidden" name="token" value="<?= e(token()) ?>">
                    <input type="hidden" name="co" value="obrot">
                    <input type="hidden" name="id" value="<?= e($id) ?>">
                    <label class="ptaszek">
                        <input type="checkbox" name="wlaczone" value="1"
                               <?= obrotKart($sezony, $id) ? 'checked' : '' ?>
                               onchange="this.form.submit()">
                        <span><?= obrotKart($sezony, $id) ? 'z opisami' : 'same nazwiska' ?></span>
                    </label>
                </form>
            </td>
            <td class="do-prawej">
                <?php if (!$to): ?>
                    <form method="post"
                          onsubmit="return confirm('Usunąć sezon <?= e(addslashes((string) ($s['label'] ?? ''))) ?> razem ze składem <?= $ile ?> osób? Zdjęcia zostaną na serwerze.');">
                        <input type="hidden" name="token" value="<?= e(token()) ?>">
                        <input type="hidden" name="co" value="usun">
                        <input type="hidden" name="id" value="<?= e($id) ?>">
                        <button type="submit" class="usun">Usuń sezon</button>
                    </form>
                <?php endif; ?>
            </td>
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
                <span>Nazwa sezonu</span>
                <input type="text" name="etykieta" id="pole-etykieta" required placeholder="2026/2027">
            </label>
            <label>
                <span>Identyfikator <small>— tak nazywa się katalog ze zdjęciami</small></span>
                <input type="text" name="id" id="pole-id" pattern="[a-z0-9\-]+" placeholder="2026-27">
                <small class="podpowiedz">Zostaw puste, a panel ułoży go z nazwy. Później już się go nie zmienia.</small>
            </label>
        </div>
        <div class="kolumna">
            <fieldset>
                <legend>Rodzaj</legend>
                <label class="ptaszek">
                    <input type="radio" name="rodzaj" value="archiwalny" checked>
                    <span>Archiwalny — dochodzi pusty, skład uzupełnisz ręcznie</span>
                </label>
                <label class="ptaszek">
                    <input type="radio" name="rodzaj" value="biezacy" id="pole-biezacy">
                    <span>Nowy bieżący — zamyka obecny sezon</span>
                </label>

                <label class="ptaszek obrot-wybor">
                    <input type="checkbox" name="obrot" value="1" checked>
                    <span>Karty można obracać — z opisami, projektami i zawodami</span>
                </label>

                <div id="opis-biezacy" hidden>
                    <p class="podpowiedz">
                        Obecny sezon <strong><?= e(etykietaSezonu($sezony, $idBiezacy)) ?></strong>
                        (<?= count($zespol['sklad'] ?? []) ?> os.) przejdzie do archiwum
                        w całości — z opisami, projektami i zawodami — a zdjęcia skopiują się
                        do katalogu <span class="jednolity">assets/team/<?= e($idBiezacy) ?>/</span>.
                        Nic z niego nie znika ze strony.
                    </p>
                    <label class="ptaszek">
                        <input type="checkbox" name="kopiuj" value="1" checked>
                        <span>Zacznij od kopii obecnego składu</span>
                    </label>
                </div>
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

// ostrzezenie o zamknieciu sezonu pokazujemy tylko wtedy, gdy o to chodzi
document.querySelectorAll('input[name=rodzaj]').forEach(function (r) {
    r.addEventListener('change', function () {
        document.getElementById('opis-biezacy').hidden = !document.getElementById('pole-biezacy').checked;
    });
});
</script>

<?php zamknijStrone(); ?>
