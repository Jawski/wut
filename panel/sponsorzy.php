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
    otworzStrone('Sponsorzy');
    echo '<p class="komunikat komunikat-zle">Nie znaleziono pliku dane/sponsorzy.json.</p>';
    zamknijStrone();
    exit;
}

$blad = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!sprawdzToken()) {
        $blad = 'Formularz stracił ważność. Otwórz go jeszcze raz.';
    } else {
        $blad = match ((string) ($_POST['co'] ?? '')) {
            'dodaj'   => dodajKategorie($kategorie),
            'zapisz'  => zapiszKategorie($kategorie),
            'przesun' => przesunKategorie($kategorie),
            'usun'    => usunKategorie($kategorie),
            default   => 'Nieznana operacja.',
        };
        if ($blad === null) {
            header('Location: sponsorzy.php');
            exit;
        }
    }
}

function dodajKategorie(array $kategorie): ?string
{
    $nazwa = trim((string) ($_POST['nazwa'] ?? ''));
    if ($nazwa === '') {
        return 'Podaj nazwę kategorii.';
    }
    $id = zrobSlug($nazwa);
    if ($id === '' || znajdzKategorie($kategorie, $id) !== null) {
        return 'Kategoria o takiej nazwie już istnieje.';
    }
    $kategorie[] = [
        'id'      => $id,
        'kolor'   => poprawnyKolor((string) ($_POST['kolor'] ?? '')),
        'klasa'   => poprawnaKlasa((string) ($_POST['klasa'] ?? '')),
        'nazwa'   => $nazwa,
        'nazwaEn' => trim((string) ($_POST['nazwaEn'] ?? '')),
        'logotypy' => [],
    ];
    return zapiszTresc('sponsorzy', $kategorie);
}

function zapiszKategorie(array $kategorie): ?string
{
    $i = znajdzKategorie($kategorie, (string) ($_POST['id'] ?? ''));
    if ($i === null) {
        return 'Nie znaleziono takiej kategorii.';
    }
    $nazwa = trim((string) ($_POST['nazwa'] ?? ''));
    if ($nazwa === '') {
        return 'Nazwa kategorii nie może być pusta.';
    }
    $kategorie[$i]['nazwa'] = $nazwa;
    $kategorie[$i]['kolor'] = poprawnyKolor((string) ($_POST['kolor'] ?? ''));
    $kategorie[$i]['klasa'] = poprawnaKlasa((string) ($_POST['klasa'] ?? ''));

    $en = trim((string) ($_POST['nazwaEn'] ?? ''));
    if ($en !== '') {
        $kategorie[$i]['nazwaEn'] = $en;
    } else {
        unset($kategorie[$i]['nazwaEn']);
    }
    return zapiszTresc('sponsorzy', $kategorie);
}

function przesunKategorie(array $kategorie): ?string
{
    $i = znajdzKategorie($kategorie, (string) ($_POST['id'] ?? ''));
    if ($i === null) {
        return 'Nie znaleziono takiej kategorii.';
    }
    $j = $i + (((string) ($_POST['kierunek'] ?? '')) === 'gora' ? -1 : 1);
    if ($j < 0 || $j >= count($kategorie)) {
        return null;                       // juz na brzegu, nie ma co robic
    }
    [$kategorie[$i], $kategorie[$j]] = [$kategorie[$j], $kategorie[$i]];
    return zapiszTresc('sponsorzy', $kategorie);
}

function usunKategorie(array $kategorie): ?string
{
    $i = znajdzKategorie($kategorie, (string) ($_POST['id'] ?? ''));
    if ($i === null) {
        return 'Nie znaleziono takiej kategorii.';
    }
    array_splice($kategorie, $i, 1);
    return zapiszTresc('sponsorzy', $kategorie);
}

/* ------------------------------------------------------------------- widok */

$edytowana = null;
if (isset($_GET['edytuj'])) {
    $i = znajdzKategorie($kategorie, (string) $_GET['edytuj']);
    if ($i !== null) {
        $edytowana = $kategorie[$i];
    }
}
$nowa = isset($_GET['nowa']);

otworzStrone($edytowana ? (string) $edytowana['nazwa'] : 'Sponsorzy',
             ($edytowana || $nowa) ? 'sponsorzy.php' : 'pulpit.php');
?>

<?php if ($blad): ?>
    <p class="komunikat komunikat-zle" role="alert"><?= e($blad) ?></p>
<?php endif; ?>

<?php if ($edytowana || $nowa):
    $k = $edytowana ?? ['id' => '', 'nazwa' => '', 'nazwaEn' => '', 'kolor' => '#9aa3ad', 'klasa' => 'tier-6', 'logotypy' => []];
    $klasa = (string) ($k['klasa'] ?? $k['id'] ?? 'tier-6'); ?>

    <h1><?= $edytowana ? e((string) $k['nazwa']) : 'Nowa kategoria' ?></h1>

    <form method="post" class="formularz waski">
        <input type="hidden" name="token" value="<?= e(token()) ?>">
        <input type="hidden" name="co" value="<?= $edytowana ? 'zapisz' : 'dodaj' ?>">
        <?php if ($edytowana): ?>
            <input type="hidden" name="id" value="<?= e((string) $k['id']) ?>">
        <?php endif; ?>

        <label>
            <span>Nazwa</span>
            <input type="text" name="nazwa" required value="<?= e((string) $k['nazwa']) ?>">
        </label>

        <label>
            <span>Nazwa po angielsku</span>
            <input type="text" name="nazwaEn" value="<?= e((string) ($k['nazwaEn'] ?? '')) ?>"
                   placeholder="<?= e(angielskaZKlucza((string) ($k['klucz'] ?? ''))) ?>">
        </label>

        <label class="w-linii">
            <span>Kolor kreski pod nazwą</span>
            <input type="color" name="kolor" value="<?= e(poprawnyKolor((string) ($k['kolor'] ?? ''))) ?>">
        </label>

        <label>
            <span>Wielkość logotypów</span>
            <select name="klasa">
                <?php foreach (POZIOMY as $id => $opis): ?>
                    <option value="<?= e($id) ?>" <?= $klasa === $id ? 'selected' : '' ?>><?= e($opis) ?></option>
                <?php endforeach; ?>
            </select>
        </label>

        <div class="pod-formularzem">
            <button type="submit" class="przycisk glowny"><?= $edytowana ? 'Zapisz' : 'Dodaj kategorię' ?></button>
            <a class="przycisk pusty" href="sponsorzy.php">Anuluj</a>
        </div>
    </form>

    <?php if ($edytowana):
        $ile = count($k['logotypy'] ?? []);
        $pytanie = 'Usunąć kategorię ' . $k['nazwa'] . ($ile ? ' razem z ' . $ile . ' logotypami?' : '?'); ?>
        <form method="post" class="osobno" onsubmit="return confirm('<?= e(addslashes($pytanie)) ?>');">
            <input type="hidden" name="token" value="<?= e(token()) ?>">
            <input type="hidden" name="co" value="usun">
            <input type="hidden" name="id" value="<?= e((string) $k['id']) ?>">
            <button type="submit" class="usun">Usuń kategorię</button>
        </form>
    <?php endif; ?>

<?php else: ?>

    <h1>Sponsorzy</h1>

    <div class="paski-narzedzi">
        <div class="narzedzia-prawo">
            <a class="przycisk pusty" href="sponsorzy.php?nowa=1">+ Kategoria</a>
        </div>
    </div>

    <?php foreach ($kategorie as $i => $k):
        $id = (string) $k['id']; ?>
        <section class="kategoria">
            <div class="kategoria-pasek">
                <span class="kreska" style="background: <?= e(poprawnyKolor((string) ($k['kolor'] ?? ''))) ?>"></span>
                <a class="kategoria-nazwa" href="sponsorzy.php?edytuj=<?= urlencode($id) ?>">
                    <?= e((string) $k['nazwa']) ?>
                </a>
                <span class="ile"><?= count($k['logotypy'] ?? []) ?></span>

                <span class="kategoria-prawo">
                    <?php foreach ([['gora', '↑', $i > 0], ['dol', '↓', $i < count($kategorie) - 1]] as [$kier, $znak, $mozna]): ?>
                        <form method="post" class="strzalka">
                            <input type="hidden" name="token" value="<?= e(token()) ?>">
                            <input type="hidden" name="co" value="przesun">
                            <input type="hidden" name="id" value="<?= e($id) ?>">
                            <input type="hidden" name="kierunek" value="<?= $kier ?>">
                            <button type="submit" <?= $mozna ? '' : 'disabled' ?>><?= $znak ?></button>
                        </form>
                    <?php endforeach; ?>
                    <a class="przycisk maly" href="sponsor.php?kat=<?= urlencode($id) ?>&amp;nowy=1">+ Logo</a>
                </span>
            </div>

            <ul class="logotypy">
                <?php foreach ($k['logotypy'] ?? [] as $n => $l):
                    $plik = KATALOG_LOGO . '/' . $l['plik']; ?>
                    <li>
                        <a href="sponsor.php?kat=<?= urlencode($id) ?>&amp;nr=<?= $n ?>" title="<?= e((string) $l['nazwa']) ?>">
                            <?php if (is_file($plik)): ?>
                                <img src="../assets/sponsors/<?= e((string) $l['plik']) ?>?v=<?= filemtime($plik) ?>" alt="">
                            <?php else: ?>
                                <span class="brak">brak pliku</span>
                            <?php endif; ?>
                            <span class="logo-nazwa"><?= e((string) $l['nazwa']) ?></span>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </section>
    <?php endforeach; ?>

<?php endif; ?>

<?php zamknijStrone(); ?>
