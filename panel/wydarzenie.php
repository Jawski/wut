<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';
require __DIR__ . '/kalendarz-dane.php';
require __DIR__ . '/uklad.php';

wymusHttps();
startSesji();
wymagajLogowania();

$wydarzenia = czytajTresc('wydarzenia');
if ($wydarzenia === null) {
    otworzStrone('Start');
    echo '<p class="komunikat komunikat-zle">Nie znaleziono pliku dane/wydarzenia.json.</p>';
    zamknijStrone();
    exit;
}

$nowe = isset($_GET['nowe']) || !isset($_GET['nr']);
$nr   = $nowe ? null : (int) $_GET['nr'];
if (!$nowe && !isset($wydarzenia[$nr])) {
    ustawKomunikat('Nie znaleziono takiego startu.', 'zle');
    header('Location: kalendarz.php');
    exit;
}

$w = $nowe
    ? ['name' => '', 'loc' => '', 'flag' => 'pl', 'photo' => '', 'start' => '', 'end' => '']
    : $wydarzenia[$nr];
$blad = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!sprawdzToken()) {
        $blad = 'Formularz stracił ważność. Otwórz go jeszcze raz.';
    } elseif (($_POST['co'] ?? '') === 'usun') {
        array_splice($wydarzenia, $nr, 1);
        $blad = zapiszTresc('wydarzenia', $wydarzenia);
        if ($blad === null) {
            ustawKomunikat('Start usunięty. Zdjęcie zostaje na serwerze.');
            header('Location: kalendarz.php');
            exit;
        }
    } else {
        [$blad, $w] = zapiszWydarzenie($wydarzenia, $nr);
        if ($blad === null) {
            ustawKomunikat('Zapisano: ' . $w['name'] . '.');
            header('Location: kalendarz.php');
            exit;
        }
    }
}

function zapiszWydarzenie(array $wydarzenia, ?int $nr): array
{
    $stare = $nr === null ? [] : $wydarzenia[$nr];

    $name  = trim((string) ($_POST['name'] ?? ''));
    $loc   = trim((string) ($_POST['loc'] ?? ''));
    $flaga = (string) ($_POST['flag'] ?? '');
    $start = naDateIso((string) ($_POST['start'] ?? ''));
    $koniec = naDateIso((string) ($_POST['end'] ?? ''));

    // kolejnosc pol taka sama, jak maja wpisy juz w pliku
    $wpis = [
        'start'  => $start ?? (string) ($stare['start'] ?? ''),
        'end'    => $koniec ?? (string) ($stare['end'] ?? ''),
        'flag'   => array_key_exists($flaga, FLAGI) ? $flaga : '',
        'photo'  => (string) ($stare['photo'] ?? ''),
        'name'   => $name,
        'loc'    => $loc,
        'datePl' => '',
        'dateEn' => '',
    ];

    if ($name === '') {
        return ['Podaj nazwę startu.', $wpis];
    }
    if ($start === null || $koniec === null) {
        return ['Podaj datę początku i końca.', $wpis];
    }
    if (strtotime($koniec) < strtotime($start)) {
        return ['Koniec wypada przed początkiem.', $wpis];
    }
    $wpis['datePl'] = napisDaty($start, $koniec, false);
    $wpis['dateEn'] = napisDaty($start, $koniec, true);

    $przeslano = ($_FILES['zdjecie']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
    if ($nr === null && !$przeslano) {
        return ['Wybierz zdjęcie.', $wpis];
    }
    if ($przeslano) {
        $nazwaPliku = zrobSlug($name) ?: 'start';
        $bladPliku = zapiszZdjecieJpg(
            $_FILES['zdjecie'],
            KATALOG_WYDARZEN . '/' . $nazwaPliku . '.jpg',
            WYDARZENIE_SZER
        );
        if ($bladPliku !== null) {
            return [$bladPliku, $wpis];
        }
        $wpis['photo'] = 'assets/media/' . $nazwaPliku . '.jpg';
    }

    if ($nr === null) {
        $wydarzenia[] = $wpis;
    } else {
        $wydarzenia[$nr] = $wpis;
    }
    return [zapiszTresc('wydarzenia', $wydarzenia), $wpis];
}

/* ------------------------------------------------------------------- widok */

$plik = ($w['photo'] ?? '') !== '' ? __DIR__ . '/../' . $w['photo'] : '';
$maPlik = $plik !== '' && is_file($plik);

otworzStrone($nowe ? 'Nowy start' : (string) $w['name'], 'kalendarz.php');
?>

<h1><?= $nowe ? 'Nowy start' : e((string) $w['name']) ?></h1>

<?php if ($blad): ?>
    <p class="komunikat komunikat-zle" role="alert"><?= e($blad) ?></p>
<?php endif; ?>

<form method="post" enctype="multipart/form-data" class="formularz waski">
    <input type="hidden" name="token" value="<?= e(token()) ?>">

    <label>
        <span>Nazwa</span>
        <input type="text" name="name" required value="<?= e((string) $w['name']) ?>">
    </label>

    <label>
        <span>Miejsce</span>
        <input type="text" name="loc" value="<?= e((string) $w['loc']) ?>">
    </label>

    <label>
        <span>Flaga</span>
        <select name="flag">
            <option value="">bez flagi</option>
            <?php foreach (FLAGI as $kod => $kraj): ?>
                <option value="<?= e($kod) ?>" <?= ($w['flag'] ?? '') === $kod ? 'selected' : '' ?>><?= e($kraj) ?></option>
            <?php endforeach; ?>
        </select>
    </label>

    <label>
        <span>Początek</span>
        <input type="datetime-local" name="start" required
               value="<?= e(($w['start'] ?? '') !== '' ? naPoleDaty((string) $w['start']) : '') ?>">
    </label>

    <label>
        <span>Koniec</span>
        <input type="datetime-local" name="end" required
               value="<?= e(($w['end'] ?? '') !== '' ? naPoleDaty((string) $w['end']) : '') ?>">
    </label>

    <?php if (!$nowe): ?>
        <label class="w-linii">
            <span>Data na karcie</span>
            <span class="stale"><?= e((string) $w['datePl']) ?> / <?= e((string) $w['dateEn']) ?></span>
        </label>
    <?php endif; ?>

    <fieldset class="logo-pole">
        <legend>Zdjęcie</legend>
        <div class="bolid-podglad">
            <?php if ($maPlik): ?>
                <img src="../<?= e((string) $w['photo']) ?>?v=<?= filemtime($plik) ?>" alt="">
            <?php else: ?>
                <span class="brak">brak zdjęcia</span>
            <?php endif; ?>
        </div>
        <input type="file" name="zdjecie" accept="image/jpeg,image/png,image/webp" <?= $nowe ? 'required' : '' ?>>
    </fieldset>

    <div class="pod-formularzem">
        <button type="submit" class="przycisk glowny">Zapisz</button>
        <a class="przycisk pusty" href="kalendarz.php">Anuluj</a>
    </div>
</form>

<?php if (!$nowe): ?>
    <form method="post" class="osobno"
          onsubmit="return confirm('Usunąć <?= e(addslashes((string) $w['name'])) ?> z kalendarza?');">
        <input type="hidden" name="token" value="<?= e(token()) ?>">
        <input type="hidden" name="co" value="usun">
        <button type="submit" class="usun">Usuń start</button>
    </form>
<?php endif; ?>

<?php zamknijStrone(); ?>
