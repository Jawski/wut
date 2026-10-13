<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';
require __DIR__ . '/uklad.php';

wymusHttps();
startSesji();
wymagajLogowania();

// stan srodowiska - przyda sie przy kolejnych etapach i od razu potwierdza,
// czy podniesienie wersji PHP faktycznie weszlo w zycie
$tresciZapis = is_dir(KATALOG_TRESCI) && is_writable(KATALOG_TRESCI);
$zdjeciaZapis = is_dir(KATALOG_ZDJEC) && is_writable(KATALOG_ZDJEC);
$panelZapis  = is_writable(dirname(PLIK_KONTA));
$pliki = [];
foreach (['zespol', 'zespol-archiwum', 'bolidy', 'osiagniecia', 'wydarzenia', 'sponsorzy'] as $n) {
    $p = KATALOG_TRESCI . '/' . $n . '.json';
    $pliki[$n] = is_file($p) ? count((array) json_decode((string) file_get_contents($p), true), COUNT_RECURSIVE) : null;
}

otworzStrone('Pulpit');
?>

<h1>Pulpit</h1>
<p class="wstep">
    Zmiany zapisują się od razu na stronie. Przed każdym zapisem panel odkłada
    kopię poprzedniej wersji, więc pomyłkę da się cofnąć.
</p>

<section class="kafle">
    <a class="kafel" href="sklad.php">
        <span class="kafel-nazwa">Skład zespołu</span>
        <span class="kafel-opis">Dodawanie i usuwanie osób, funkcje, opisy, zdjęcia</span>
        <span class="kafel-stan">gotowe</span>
    </a>
    <a class="kafel wylaczony" aria-disabled="true">
        <span class="kafel-nazwa">Sponsorzy</span>
        <span class="kafel-opis">Logotypy, kategorie, adresy stron</span>
        <span class="kafel-stan">w przygotowaniu</span>
    </a>
    <a class="kafel wylaczony" aria-disabled="true">
        <span class="kafel-nazwa">Bolidy</span>
        <span class="kafel-opis">Dane techniczne i zdjęcia</span>
        <span class="kafel-stan">w przygotowaniu</span>
    </a>
    <a class="kafel wylaczony" aria-disabled="true">
        <span class="kafel-nazwa">Osiągnięcia</span>
        <span class="kafel-opis">Wyniki z zawodów</span>
        <span class="kafel-stan">w przygotowaniu</span>
    </a>
    <a class="kafel wylaczony" aria-disabled="true">
        <span class="kafel-nazwa">Kalendarz</span>
        <span class="kafel-opis">Nadchodzące i minione starty</span>
        <span class="kafel-stan">w przygotowaniu</span>
    </a>
    <a class="kafel wylaczony" aria-disabled="true">
        <span class="kafel-nazwa">Teksty na stronie</span>
        <span class="kafel-opis">Opisy działów, historia, konkurencje</span>
        <span class="kafel-stan">w przygotowaniu</span>
    </a>
</section>

<section class="stan">
    <h2>Stan serwera</h2>
    <table>
        <tr>
            <td>Wersja PHP</td>
            <td class="<?= version_compare(PHP_VERSION, '8.0', '>=') ? 'ok' : 'zle' ?>">
                <?= e(PHP_VERSION) ?>
            </td>
        </tr>
        <tr>
            <td>Zapis treści strony</td>
            <td class="<?= $tresciZapis ? 'ok' : 'zle' ?>">
                <?= $tresciZapis ? 'możliwy' : 'BRAK — panel nie zapisze zmian' ?>
            </td>
        </tr>
        <tr>
            <td>Zapis zdjęć zespołu</td>
            <td class="<?= $zdjeciaZapis ? 'ok' : 'zle' ?>">
                <?= $zdjeciaZapis ? 'możliwy' : 'BRAK — panel nie wgra zdjęć' ?>
            </td>
        </tr>
        <tr>
            <td>Zapis danych panelu</td>
            <td class="<?= $panelZapis ? 'ok' : 'zle' ?>">
                <?= $panelZapis ? 'możliwy' : 'BRAK' ?>
            </td>
        </tr>
        <tr>
            <td>Obróbka zdjęć</td>
            <td class="<?= extension_loaded('gd') ? 'ok' : 'zle' ?>">
                <?= extension_loaded('gd') ? 'GD — kadrowanie po stronie serwera' : 'BRAK' ?>
            </td>
        </tr>
        <tr>
            <td>Największe zdjęcie do wgrania</td>
            <td class="ok"><?= e((string) ini_get('upload_max_filesize')) ?>B</td>
        </tr>
        <tr>
            <td>Połączenie</td>
            <td class="<?= czyHttps() ? 'ok' : 'zle' ?>">
                <?= czyHttps() ? 'szyfrowane (https)' : 'NIESZYFROWANE' ?>
            </td>
        </tr>
    </table>

    <h2>Pliki z treścią</h2>
    <table>
        <?php foreach ($pliki as $nazwa => $ile): ?>
        <tr>
            <td><?= e($nazwa) ?>.json</td>
            <td class="<?= $ile === null ? 'zle' : 'ok' ?>">
                <?= $ile === null ? 'nie znaleziono' : 'wczytany' ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
</section>

<?php zamknijStrone(); ?>
