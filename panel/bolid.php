<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';
require __DIR__ . '/uklad.php';

wymusHttps();
startSesji();
wymagajLogowania();

/** Dane techniczne pokazywane na karcie bolidu - te same, co w js/cars.js. */
const DANE_TECHNICZNE = [
    'power' => 'Moc silnika',
    'vmax'  => 'Prędkość maks.',
    'accel' => '0 – 100 km/h',
    'mass'  => 'Masa',
];

$bolidy = czytajTresc('bolidy');
if ($bolidy === null) {
    otworzStrone('Bolid');
    echo '<p class="komunikat komunikat-zle">Nie znaleziono pliku dane/bolidy.json.</p>';
    zamknijStrone();
    exit;
}

$id    = (string) ($_GET['id'] ?? '');
$nowy  = $id === '' || isset($_GET['nowy']);
$nr    = $nowy ? null : znajdzBolid($bolidy, $id);

if (!$nowy && $nr === null) {
    ustawKomunikat('Nie znaleziono takiego bolidu.', 'zle');
    header('Location: bolidy.php');
    exit;
}

$bolid = $nowy
    ? ['id' => '', 'name' => '', 'year' => '', 'photo' => '', 'specs' => []]
    : $bolidy[$nr];
$blad = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!sprawdzToken()) {
        $blad = 'Formularz stracił ważność. Otwórz go jeszcze raz.';
    } elseif (($_POST['co'] ?? '') === 'usun') {
        array_splice($bolidy, $nr, 1);
        $blad = zapiszTresc('bolidy', $bolidy);
        if ($blad === null) {
            ustawKomunikat('Bolid usunięty. Zdjęcie zostaje na serwerze.');
            header('Location: bolidy.php');
            exit;
        }
    } else {
        [$blad, $bolid] = zapiszBolid($bolidy, $nr);
        if ($blad === null) {
            ustawKomunikat('Zapisano: ' . $bolid['name'] . '.');
            header('Location: bolidy.php');
            exit;
        }
    }
}

function znajdzBolid(array $bolidy, string $id): ?int
{
    foreach ($bolidy as $i => $b) {
        if ((string) ($b['id'] ?? '') === $id) {
            return $i;
        }
    }
    return null;
}

function zapiszBolid(array $bolidy, ?int $nr): array
{
    $stary = $nr === null ? [] : $bolidy[$nr];

    $name = trim((string) ($_POST['name'] ?? ''));
    $rok  = (int) ($_POST['year'] ?? 0);
    $id   = $nr === null ? zrobSlug($name) : (string) $stary['id'];

    $specs = [];
    foreach (DANE_TECHNICZNE as $klucz => $etykieta) {
        $specs[$klucz] = trim((string) ($_POST['spec_' . $klucz] ?? ''));
    }

    // kolejnosc pol taka sama, jak maja wpisy juz w pliku
    $wpis = [
        'id'    => $id,
        'name'  => $name,
        'year'  => $rok,
        'photo' => (string) ($stary['photo'] ?? ''),
        'specs' => $specs,
    ];

    if ($name === '') {
        return ['Podaj nazwę bolidu.', $wpis];
    }
    if ($id === '') {
        return ['Z tej nazwy nie da się zrobić identyfikatora.', $wpis];
    }
    if ($rok < 2000 || $rok > 2100) {
        return ['Podaj rok bolidu.', $wpis];
    }
    $zajety = znajdzBolid($bolidy, $id);
    if ($zajety !== null && $zajety !== $nr) {
        return ['Bolid o identyfikatorze „' . $id . '” już istnieje.', $wpis];
    }

    $przeslano = ($_FILES['zdjecie']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
    if ($nr === null && !$przeslano) {
        return ['Wybierz zdjęcie bolidu.', $wpis];
    }
    if ($przeslano) {
        $sciezka = 'assets/cars/' . $id . '.png';
        $bladPliku = zapiszZdjecieBolidu($_FILES['zdjecie'], KATALOG_BOLIDOW . '/' . $id . '.png');
        if ($bladPliku !== null) {
            return [$bladPliku, $wpis];
        }
        $wpis['photo'] = $sciezka;
    }

    if ($nr === null) {
        $bolidy[] = $wpis;
    } else {
        $bolidy[$nr] = $wpis;
    }
    return [zapiszTresc('bolidy', $bolidy), $wpis];
}

/* ------------------------------------------------------------------- widok */

$plik = ($bolid['photo'] ?? '') !== '' ? __DIR__ . '/../' . $bolid['photo'] : '';
$maPlik = $plik !== '' && is_file($plik);

otworzStrone($nowy ? 'Nowy bolid' : (string) $bolid['name'], 'bolidy.php');
?>

<h1><?= $nowy ? 'Nowy bolid' : e((string) $bolid['name']) ?></h1>

<?php if ($blad): ?>
    <p class="komunikat komunikat-zle" role="alert"><?= e($blad) ?></p>
<?php endif; ?>

<form method="post" enctype="multipart/form-data" class="formularz waski">
    <input type="hidden" name="token" value="<?= e(token()) ?>">

    <label>
        <span>Nazwa</span>
        <input type="text" name="name" required value="<?= e((string) $bolid['name']) ?>" placeholder="WUT-8">
    </label>

    <label class="w-linii">
        <span>Rok</span>
        <input type="number" name="year" min="2000" max="2100" required
               value="<?= e((string) ($bolid['year'] ?? '')) ?>">
    </label>

    <?php if (!$nowy): ?>
        <label class="w-linii">
            <span>Identyfikator</span>
            <span class="jednolity stale"><?= e((string) $bolid['id']) ?></span>
        </label>
    <?php endif; ?>

    <fieldset>
        <legend>Dane techniczne</legend>
        <?php foreach (DANE_TECHNICZNE as $klucz => $etykieta): ?>
            <label>
                <span><?= e($etykieta) ?></span>
                <input type="text" name="spec_<?= e($klucz) ?>"
                       value="<?= e((string) ($bolid['specs'][$klucz] ?? '')) ?>">
            </label>
        <?php endforeach; ?>
    </fieldset>

    <fieldset class="logo-pole">
        <legend>Zdjęcie</legend>
        <div class="bolid-podglad">
            <?php if ($maPlik): ?>
                <img src="../<?= e((string) $bolid['photo']) ?>?v=<?= filemtime($plik) ?>" alt="">
            <?php else: ?>
                <span class="brak">brak zdjęcia</span>
            <?php endif; ?>
        </div>
        <input type="file" name="zdjecie" accept="image/png,image/jpeg,image/webp" <?= $nowy ? 'required' : '' ?>>
    </fieldset>

    <div class="pod-formularzem">
        <button type="submit" class="przycisk glowny">Zapisz</button>
        <a class="przycisk pusty" href="bolidy.php">Anuluj</a>
    </div>
</form>

<?php if (!$nowy): ?>
    <form method="post" class="osobno"
          onsubmit="return confirm('Usunąć <?= e(addslashes((string) $bolid['name'])) ?> z osi czasu?');">
        <input type="hidden" name="token" value="<?= e(token()) ?>">
        <input type="hidden" name="co" value="usun">
        <button type="submit" class="usun">Usuń bolid</button>
    </form>
<?php endif; ?>

<?php zamknijStrone(); ?>
