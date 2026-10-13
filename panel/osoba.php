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
    otworzStrone('Osoba');
    echo '<p class="komunikat komunikat-zle">Nie znaleziono pliku dane/zespol.json.</p>';
    zamknijStrone();
    exit;
}

$sezony    = $zespol['sezony'] ?? [];
$idBiezacy = idSezonuBiezacego($zespol);
$sezon     = (string) ($_GET['sezon'] ?? $idBiezacy);
if (!wSezonach($sezony, $sezon)) {
    $sezon = $idBiezacy;
}
$toBiezacy = ($sezon === $idBiezacy);
$powrot    = 'sklad.php?sezon=' . urlencode($sezon);

$dzialy = array_values(array_filter($zespol['dzialy'] ?? [], fn($d) => ($d['id'] ?? '') !== 'all'));
$idDzialow = array_map(fn($d) => (string) $d['id'], $dzialy);

$lista   = wczytajSklad($zespol, $sezon, $toBiezacy);
$slug    = (string) ($_GET['slug'] ?? '');
$nowa    = $slug === '' || isset($_GET['nowa']);
$pozycja = $nowa ? null : znajdzOsobe($lista, $slug);

if (!$nowa && $pozycja === null) {
    ustawKomunikat('Nie znaleziono takiej osoby w składzie.', 'zle');
    header('Location: ' . $powrot);
    exit;
}

$osoba = $nowa ? ['slug' => '', 'name' => '', 'dept' => $idDzialow[0] ?? ''] : $lista[$pozycja];
$blad  = null;

// pelna karta - z opisem, zawodami i projektami - gdy sezon ma wlaczone obracanie
// kart. Pokazujemy ja takze komus, kto te dane juz ma, zeby wylaczenie obracania
// nie schowalo przed panelem tego, co siedzi w pliku
$pelne = obrotKart($sezony, $sezon) || maOpis($osoba);

/* ------------------------------------------------------------------- zapis */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!sprawdzToken()) {
        $blad = 'Formularz stracił ważność. Otwórz go jeszcze raz.';
    } else {
        [$blad, $osoba] = zapiszFormularz($zespol, $sezon, $toBiezacy, $pelne, $lista, $pozycja, $idDzialow);
        if ($blad === null) {
            ustawKomunikat('Zapisano: ' . $osoba['name'] . '.');
            header('Location: ' . $powrot);
            exit;
        }
    }
}

/**
 * Zbiera dane z formularza, sprawdza je i zapisuje. Oddaje blad (albo null)
 * oraz osobe w takiej postaci, w jakiej przyszla - zeby po bledzie formularz
 * nie byl pusty.
 */
function zapiszFormularz(array $zespol, string $sezon, bool $biezacy, bool $pelne, array $lista, ?int $pozycja, array $idDzialow): array
{
    $staryslug = $pozycja === null ? '' : (string) $lista[$pozycja]['slug'];

    $name = trim((string) ($_POST['name'] ?? ''));
    $slug = zrobSlug((string) ($_POST['slug'] ?? '') !== '' ? (string) $_POST['slug'] : $name);
    $dept = (string) ($_POST['dept'] ?? '');

    $funkcja = (string) ($_POST['role'] ?? '');
    if ($funkcja === '__inna') {
        $funkcja = trim((string) ($_POST['role_inna'] ?? ''));
    }

    $also = [];
    foreach ((array) ($_POST['also'] ?? []) as $id) {
        $id = (string) $id;
        if ($id !== $dept && in_array($id, $idDzialow, true)) {
            $wpis = ['dept' => $id];
            $roleDodatkowe = is_array($_POST['also_role'] ?? null) ? $_POST['also_role'] : [];
            $rola = trim((string) ($roleDodatkowe[$id] ?? ''));
            if ($rola !== '') {
                $wpis['role'] = $rola;
            }
            $also[] = $wpis;
        }
    }

    $osiagniecia = [];
    $lata   = (array) ($_POST['osiagniecie_rok'] ?? []);
    $teksty = (array) ($_POST['osiagniecie_tekst'] ?? []);
    foreach ($teksty as $i => $tekst) {
        $tekst = trim((string) $tekst);
        $rok   = (int) ($lata[$i] ?? 0);
        if ($tekst !== '' && $rok > 1990) {
            $osiagniecia[] = ['year' => $rok, 'text' => $tekst];
        }
    }

    $projekty = [];
    foreach (podzielNaWiersze((string) ($_POST['projects'] ?? '')) as $linia) {
        $linia = trim($linia);
        if ($linia !== '') {
            $projekty[] = $linia;
        }
    }

    // osobe skladamy w stalej kolejnosci pol - taka sama maja wpisy juz w pliku
    $wpis = ['slug' => $slug, 'name' => $name, 'dept' => $dept];
    if ($funkcja !== '') {
        $wpis['role'] = $funkcja;
    }
    if (!$biezacy && !$pelne) {
        // sklady spisane skrotowo niosa range wprost, tak jak dwa najstarsze
        $ranga = ZNANE_FUNKCJE[$funkcja] ?? ($pozycja !== null ? ($lista[$pozycja]['rank'] ?? null) : null);
        if ($ranga !== null) {
            $wpis['rank'] = (int) $ranga;
        }
    }
    if ($also) {
        $wpis['also'] = $also;
    }
    if (!empty($_POST['f'])) {
        $wpis['f'] = 1;
    }
    // znacznik miniatury dzialu nie ma juz pola w formularzu, ale jesli ktos go
    // w pliku ma, to zostaje - zapis karty nie moze go po cichu skasowac
    if ($pozycja !== null && !empty($lista[$pozycja]['thumb'])) {
        $wpis['thumb'] = 1;
    }
    if ($pelne) {
        $since = (int) ($_POST['since'] ?? 0);
        if ($since > 1990) {
            $wpis['since'] = $since;
        }
        $studia = trim((string) ($_POST['studies'] ?? ''));
        if ($studia !== '') {
            $wpis['studies'] = $studia;
        }
        $bio = trim((string) ($_POST['bio'] ?? ''));
        if ($bio !== '') {
            $wpis['bio'] = $bio;
        }
        if ($osiagniecia) {
            $wpis['achievements'] = $osiagniecia;
        }
        if ($projekty) {
            $wpis['projects'] = $projekty;
        }
    }

    /* --- sprawdzenia --- */

    if ($name === '') {
        return ['Podaj imię i nazwisko.', $wpis];
    }
    if ($slug === '') {
        return ['Identyfikator nie może być pusty.', $wpis];
    }
    if (!in_array($dept, $idDzialow, true)) {
        return ['Wybierz dział.', $wpis];
    }
    $zajety = znajdzOsobe($lista, $slug);
    if ($zajety !== null && $zajety !== $pozycja) {
        return ['Ktoś w tym sezonie ma już identyfikator „' . $slug . '”. Zmień go ręcznie.', $wpis];
    }

    /* --- zdjecie --- */

    $plikStary = $staryslug === '' ? '' : plikZdjecia($sezon, $biezacy, $staryslug);
    $plikNowy  = plikZdjecia($sezon, $biezacy, $slug);

    // zmiana identyfikatora musi przeniesc tez zdjecie, inaczej karta zostaje pusta
    $przeniesione = false;
    if ($plikStary !== '' && $plikStary !== $plikNowy && is_file($plikStary)) {
        if (!@rename($plikStary, $plikNowy)) {
            return ['Nie udało się przenieść zdjęcia pod nową nazwę — sprawdź prawa zapisu w assets/team/.', $wpis];
        }
        $przeniesione = true;
    }

    $zdjeciePowstalo = false;
    if (!empty($_POST['usun_zdjecie']) && is_file($plikNowy)) {
        @unlink($plikNowy);
    } elseif (($_FILES['zdjecie']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
        $bylo = is_file($plikNowy);
        $bladZdjecia = zapiszZdjecie($_FILES['zdjecie'], $plikNowy, (string) ($_POST['kadr'] ?? 'gora'));
        if ($bladZdjecia !== null) {
            if ($przeniesione) {
                @rename($plikNowy, $plikStary);
            }
            return [$bladZdjecia, $wpis];
        }
        $zdjeciePowstalo = !$bylo;
    }

    /* --- zapis --- */

    if ($pozycja === null) {
        $lista[] = $wpis;
    } else {
        $lista[$pozycja] = $wpis;
    }
    $bladZapisu = zapiszSklad($zespol, $sezon, $biezacy, $lista);

    // gdy zapis nie przeszedl, cofamy tez to, co zdazylismy zrobic ze zdjeciem -
    // inaczej po bledzie zostaje plik, do ktorego nikt juz nie trafi
    if ($bladZapisu !== null) {
        if ($zdjeciePowstalo) {
            @unlink($plikNowy);
        } elseif ($przeniesione) {
            @rename($plikNowy, $plikStary);
        }
    }
    return [$bladZapisu, $wpis];
}

/* ------------------------------------------------------------------- widok */

$plik = $osoba['slug'] !== '' ? plikZdjecia($sezon, $toBiezacy, (string) $osoba['slug']) : '';
$maZdjecie = $plik !== '' && is_file($plik);
$funkcja = (string) ($osoba['role'] ?? '');
$funkcjaZnana = $funkcja === '' || array_key_exists($funkcja, ZNANE_FUNKCJE);
$alsoDepts = array_map(fn($a) => (string) ($a['dept'] ?? ''), $osoba['also'] ?? []);
$alsoRole  = [];
foreach ($osoba['also'] ?? [] as $a) {
    $alsoRole[(string) $a['dept']] = (string) ($a['role'] ?? '');
}

otworzStrone($nowa ? 'Nowa osoba' : (string) $osoba['name'], $powrot);
?>

<h1><?= $nowa ? 'Nowa osoba' : e((string) $osoba['name']) ?></h1>

<?php if ($blad): ?>
    <p class="komunikat komunikat-zle" role="alert"><?= e($blad) ?></p>
<?php endif; ?>

<form method="post" enctype="multipart/form-data" class="formularz">
<input type="hidden" name="token" value="<?= e(token()) ?>">

<div class="kolumny">
<div class="kolumna">

    <label>
        <span>Imię i nazwisko</span>
        <input type="text" name="name" id="pole-imie" required value="<?= e((string) $osoba['name']) ?>">
    </label>

    <label>
        <span>Identyfikator</span>
        <input type="text" name="slug" id="pole-slug" value="<?= e((string) $osoba['slug']) ?>"
               pattern="[a-z0-9\-]+" <?= $nowa ? 'data-auto="1"' : '' ?>>
    </label>

    <label>
        <span>Dział</span>
        <select name="dept" required>
            <?php foreach ($dzialy as $d): ?>
                <option value="<?= e((string) $d['id']) ?>" <?= ($osoba['dept'] ?? '') === $d['id'] ? 'selected' : '' ?>>
                    <?= e((string) $d['label']) ?>
                </option>
            <?php endforeach; ?>
        </select>
    </label>

    <label>
        <span>Funkcja</span>
        <select name="role" id="pole-funkcja">
            <option value="">domyślna</option>
            <?php foreach (array_keys(ZNANE_FUNKCJE) as $f): ?>
                <option value="<?= e($f) ?>" <?= $funkcja === $f ? 'selected' : '' ?>><?= e($f) ?></option>
            <?php endforeach; ?>
            <option value="__inna" <?= $funkcjaZnana ? '' : 'selected' ?>>inna</option>
        </select>
    </label>

    <label id="pole-funkcja-inna" <?= $funkcjaZnana ? 'hidden' : '' ?>>
        <span>Funkcja własna</span>
        <input type="text" name="role_inna" value="<?= $funkcjaZnana ? '' : e($funkcja) ?>">
    </label>

    <fieldset class="dodatkowe">
        <legend>Dodatkowe działy</legend>
        <?php foreach ($dzialy as $d):
            $id = (string) $d['id'];
            $zazn = in_array($id, $alsoDepts, true); ?>
            <div class="dodatkowy">
                <label class="ptaszek">
                    <input type="checkbox" name="also[]" value="<?= e($id) ?>" <?= $zazn ? 'checked' : '' ?>>
                    <span><?= e((string) $d['label']) ?></span>
                </label>
                <input type="text" name="also_role[<?= e($id) ?>]" placeholder="funkcja (opcjonalnie)"
                       value="<?= e($alsoRole[$id] ?? '') ?>" <?= $zazn ? '' : 'hidden' ?>>
            </div>
        <?php endforeach; ?>
    </fieldset>

</div>
<div class="kolumna">

    <fieldset class="zdjecie-pole">
        <legend>Zdjęcie</legend>
        <div class="zdjecie-podglad">
            <?php if ($maZdjecie): ?>
                <img src="<?= e(sciezkaZdjecia($sezon, $toBiezacy, (string) $osoba['slug'])) ?>?v=<?= filemtime($plik) ?>" alt="">
            <?php else: ?>
                <span class="brak">bez zdjęcia</span>
            <?php endif; ?>
        </div>
        <input type="file" name="zdjecie" accept="image/jpeg,image/png,image/webp">
        <label>
            <span>Kadr</span>
            <select name="kadr">
                <option value="gora">od góry</option>
                <option value="srodek">środek</option>
                <option value="dol">od dołu</option>
            </select>
        </label>
        <?php if ($maZdjecie): ?>
            <label class="ptaszek">
                <input type="checkbox" name="usun_zdjecie" value="1">
                <span>Usuń obecne zdjęcie</span>
            </label>
        <?php endif; ?>
        <label class="ptaszek">
            <input type="checkbox" name="f" value="1" <?= !empty($osoba['f']) ? 'checked' : '' ?>>
            <span>Zastępcza sylwetka: kobieta</span>
        </label>
    </fieldset>

<?php if ($pelne): ?>

    <label class="w-linii">
        <span>W zespole od</span>
        <input type="number" name="since" min="1990" max="2100" value="<?= e((string) ($osoba['since'] ?? '')) ?>">
    </label>

    <label>
        <span>Studia</span>
        <input type="text" name="studies" value="<?= e((string) ($osoba['studies'] ?? '')) ?>"
               placeholder="PW — MEiL">
    </label>

    <label>
        <span>O mnie</span>
        <textarea name="bio" rows="5"><?= e((string) ($osoba['bio'] ?? '')) ?></textarea>
    </label>

<?php endif; ?>

</div>
</div>

<?php if ($pelne): ?>

    <fieldset class="lista-pol">
        <legend>Osiągnięcia</legend>
        <div id="osiagniecia">
            <?php foreach (($osoba['achievements'] ?? [['year' => '', 'text' => '']]) as $o): ?>
                <div class="wiersz">
                    <input type="number" name="osiagniecie_rok[]" min="1990" max="2100" placeholder="rok"
                           value="<?= e((string) ($o['year'] ?? '')) ?>">
                    <input type="text" name="osiagniecie_tekst[]" placeholder="np. FS Poland"
                           value="<?= e((string) ($o['text'] ?? '')) ?>">
                    <button type="button" class="usun-wiersz" title="Usuń">×</button>
                </div>
            <?php endforeach; ?>
        </div>
        <button type="button" class="przycisk maly" id="dodaj-osiagniecie">+ Dodaj wiersz</button>
    </fieldset>

    <label>
        <span>Projekty</span>
        <textarea name="projects" rows="4"><?= e(implode("\n", $osoba['projects'] ?? [])) ?></textarea>
    </label>

<?php endif; ?>

<div class="pod-formularzem">
    <button type="submit" class="przycisk glowny">Zapisz</button>
    <a class="przycisk pusty" href="<?= e($powrot) ?>">Anuluj</a>
</div>

</form>

<script>
// identyfikator podpowiadamy z imienia tylko przy nowej osobie i tylko dopoki
// nikt go sam nie poprawil - zmiana przy istniejacej osobie rusza plik zdjecia
(function () {
    const imie = document.getElementById('pole-imie');
    const slug = document.getElementById('pole-slug');
    if (!imie || !slug || !slug.dataset.auto) return;
    slug.addEventListener('input', function () { delete slug.dataset.auto; });
    imie.addEventListener('input', function () {
        if (!slug.dataset.auto) return;
        const mapa = { 'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ż':'z','ź':'z','ø':'o' };
        slug.value = imie.value.toLowerCase()
            .replace(/[ąćęłńóśżźø]/g, function (z) { return mapa[z]; })
            .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    });
})();

// pole na wlasna funkcje tylko wtedy, gdy wybrano "inna"
(function () {
    const wybor = document.getElementById('pole-funkcja');
    const inne = document.getElementById('pole-funkcja-inna');
    if (!wybor || !inne) return;
    wybor.addEventListener('change', function () {
        inne.hidden = wybor.value !== '__inna';
        if (!inne.hidden) inne.querySelector('input').focus();
    });
})();

// pole na funkcje w dodatkowym dziale pokazujemy razem z zaznaczeniem dzialu
document.querySelectorAll('.dodatkowy input[type=checkbox]').forEach(function (p) {
    p.addEventListener('change', function () {
        p.closest('.dodatkowy').querySelector('input[type=text]').hidden = !p.checked;
    });
});

// osiagniecia: dokladanie i kasowanie wierszy
(function () {
    const lista = document.getElementById('osiagniecia');
    const dodaj = document.getElementById('dodaj-osiagniecie');
    if (!lista || !dodaj) return;
    dodaj.addEventListener('click', function () {
        const wiersz = lista.firstElementChild.cloneNode(true);
        wiersz.querySelectorAll('input').forEach(function (i) { i.value = ''; });
        lista.appendChild(wiersz);
        wiersz.querySelector('input').focus();
    });
    lista.addEventListener('click', function (e) {
        if (!e.target.classList.contains('usun-wiersz')) return;
        if (lista.children.length > 1) e.target.closest('.wiersz').remove();
        else e.target.closest('.wiersz').querySelectorAll('input').forEach(function (i) { i.value = ''; });
    });
})();
</script>

<?php zamknijStrone(); ?>
