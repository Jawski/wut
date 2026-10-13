<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';
require __DIR__ . '/sponsorzy-dane.php';
require __DIR__ . '/uklad.php';

wymusHttps();
startSesji();
wymagajLogowania();

$kategorie = czytajTresc('sponsorzy');
if ($kategorie === null) {
    otworzStrone('Sponsor');
    echo '<p class="komunikat komunikat-zle">Nie znaleziono pliku dane/sponsorzy.json.</p>';
    zamknijStrone();
    exit;
}

$idKat = (string) ($_GET['kat'] ?? ($kategorie[0]['id'] ?? ''));
$iKat  = znajdzKategorie($kategorie, $idKat);
if ($iKat === null) {
    ustawKomunikat('Nie znaleziono takiej kategorii.', 'zle');
    header('Location: sponsorzy.php');
    exit;
}

$nowy = isset($_GET['nowy']) || !isset($_GET['nr']);
$nr   = $nowy ? null : (int) $_GET['nr'];
if (!$nowy && !isset($kategorie[$iKat]['logotypy'][$nr])) {
    ustawKomunikat('Nie znaleziono takiego logotypu.', 'zle');
    header('Location: sponsorzy.php');
    exit;
}

$logo = $nowy ? ['nazwa' => '', 'plik' => '', 'url' => ''] : $kategorie[$iKat]['logotypy'][$nr];
$blad = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!sprawdzToken()) {
        $blad = 'Formularz stracił ważność. Otwórz go jeszcze raz.';
    } elseif (($_POST['co'] ?? '') === 'usun') {
        array_splice($kategorie[$iKat]['logotypy'], $nr, 1);
        $blad = zapiszTresc('sponsorzy', $kategorie);
        if ($blad === null) {
            ustawKomunikat('Logotyp usunięty. Plik zostaje na serwerze.');
            header('Location: sponsorzy.php');
            exit;
        }
    } else {
        [$blad, $logo] = zapiszLogotyp($kategorie, $iKat, $nr);
        if ($blad === null) {
            ustawKomunikat('Zapisano: ' . $logo['nazwa'] . '.');
            header('Location: sponsorzy.php');
            exit;
        }
    }
}

/**
 * Zbiera dane z formularza i zapisuje logotyp. Rozmiar kafelka liczy sam z
 * proporcji obrazka - recznie nikt tego nie trafi, a od tego zalezy, czy
 * logotyp bedzie na scianie rowny z pozostalymi.
 */
function zapiszLogotyp(array $kategorie, int $iKat, ?int $nr): array
{
    $stary = $nr === null ? [] : $kategorie[$iKat]['logotypy'][$nr];

    $nazwa = trim((string) ($_POST['nazwa'] ?? ''));
    $url   = trim((string) ($_POST['url'] ?? ''));
    $wpis  = [
        'nazwa' => $nazwa,
        'plik'  => (string) ($stary['plik'] ?? ''),
        'url'   => $url,
        'lw'    => $stary['lw'] ?? 1.2,
        'lh'    => $stary['lh'] ?? 1.2,
    ];

    if ($nazwa === '') {
        return ['Podaj nazwę sponsora.', $wpis];
    }
    if ($url !== '' && !preg_match('~^https?://~i', $url)) {
        return ['Adres strony musi zaczynać się od http:// albo https://', $wpis];
    }

    $docelowa = znajdzKategorie($kategorie, (string) ($_POST['kategoria'] ?? ''));
    if ($docelowa === null) {
        return ['Wybierz kategorię.', $wpis];
    }

    /* --- plik --- */

    $przeslano = ($_FILES['logo']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
    if ($nr === null && !$przeslano) {
        return ['Wybierz plik z logotypem.', $wpis];
    }
    if ($przeslano) {
        $plik = $wpis['plik'] !== ''
            ? $wpis['plik']                                   // podmiana w miejscu
            : wolnaNazwaPliku($kategorie, $nazwa);
        $wymiary = null;
        $bladPliku = zapiszLogo($_FILES['logo'], KATALOG_LOGO . '/' . $plik, $wymiary);
        if ($bladPliku !== null) {
            return [$bladPliku, $wpis];
        }
        $kafelek = policzKafelek($wymiary['w'], $wymiary['h']);
        // kolejnosc pol taka sama, jak maja wpisy juz w pliku
        $wpis = [
            'nazwa' => $nazwa,
            'plik'  => $plik,
            'url'   => $url,
            'lw'    => $kafelek['lw'],
            'lh'    => $kafelek['lh'],
        ];
    }

    /* --- zapis --- */

    if ($nr !== null && $docelowa === $iKat) {
        // ta sama kategoria - podmiana w miejscu, zeby sciana nie zmienila kolejnosci
        $kategorie[$iKat]['logotypy'][$nr] = $wpis;
    } else {
        if ($nr !== null) {
            array_splice($kategorie[$iKat]['logotypy'], $nr, 1);
        }
        $kategorie[$docelowa]['logotypy'][] = $wpis;
        $kategorie[$docelowa]['logotypy'] = array_values($kategorie[$docelowa]['logotypy']);
    }

    return [zapiszTresc('sponsorzy', $kategorie), $wpis];
}

/* ------------------------------------------------------------------- widok */

$plik = ($logo['plik'] ?? '') !== '' ? KATALOG_LOGO . '/' . $logo['plik'] : '';
$maPlik = $plik !== '' && is_file($plik);

otworzStrone($nowy ? 'Nowy logotyp' : (string) $logo['nazwa'], 'sponsorzy.php');
?>

<h1><?= $nowy ? 'Nowy logotyp' : e((string) $logo['nazwa']) ?></h1>

<?php if ($blad): ?>
    <p class="komunikat komunikat-zle" role="alert"><?= e($blad) ?></p>
<?php endif; ?>

<form method="post" enctype="multipart/form-data" class="formularz waski">
    <input type="hidden" name="token" value="<?= e(token()) ?>">

    <label>
        <span>Nazwa</span>
        <input type="text" name="nazwa" required value="<?= e((string) $logo['nazwa']) ?>">
    </label>

    <label>
        <span>Kategoria</span>
        <select name="kategoria">
            <?php foreach ($kategorie as $k): ?>
                <option value="<?= e((string) $k['id']) ?>" <?= (string) $k['id'] === $idKat ? 'selected' : '' ?>>
                    <?= e((string) $k['nazwa']) ?>
                </option>
            <?php endforeach; ?>
        </select>
    </label>

    <label>
        <span>Adres strony</span>
        <input type="url" name="url" value="<?= e((string) ($logo['url'] ?? '')) ?>" placeholder="https://">
    </label>

    <fieldset class="logo-pole">
        <legend>Logotyp</legend>
        <div class="logo-podglad">
            <?php if ($maPlik): ?>
                <img src="../assets/sponsors/<?= e((string) $logo['plik']) ?>?v=<?= filemtime($plik) ?>" alt="">
            <?php else: ?>
                <span class="brak">brak pliku</span>
            <?php endif; ?>
        </div>
        <input type="file" name="logo" accept="image/png,image/jpeg,image/webp" <?= $nowy ? 'required' : '' ?>>
    </fieldset>

    <div class="pod-formularzem">
        <button type="submit" class="przycisk glowny">Zapisz</button>
        <a class="przycisk pusty" href="sponsorzy.php">Anuluj</a>
    </div>
</form>

<?php if (!$nowy): ?>
    <form method="post" class="osobno"
          onsubmit="return confirm('Usunąć <?= e(addslashes((string) $logo['nazwa'])) ?> ze ściany sponsorów?');">
        <input type="hidden" name="token" value="<?= e(token()) ?>">
        <input type="hidden" name="co" value="usun">
        <button type="submit" class="usun">Usuń logotyp</button>
    </form>
<?php endif; ?>

<?php zamknijStrone(); ?>
