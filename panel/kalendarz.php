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
    otworzStrone('Kalendarz');
    echo '<p class="komunikat komunikat-zle">Nie znaleziono pliku dane/wydarzenia.json.</p>';
    zamknijStrone();
    exit;
}

// strona układa karty po dacie rozpoczęcia, więc i tu pokazujemy je tak samo
$kolejnosc = $wydarzenia;
uasort($kolejnosc, fn($a, $b) => strcmp((string) $a['start'], (string) $b['start']));

otworzStrone('Kalendarz', 'pulpit.php');
?>

<h1>Kalendarz</h1>

<div class="paski-narzedzi">
    <div class="narzedzia-prawo">
        <a class="przycisk" href="wydarzenie.php?nowe=1">+ Dodaj start</a>
    </div>
</div>

<ul class="wydarzenia">
    <?php foreach ($kolejnosc as $nr => $w):
        $plik = __DIR__ . '/../' . ($w['photo'] ?? '');
        $ma = ($w['photo'] ?? '') !== '' && is_file($plik);
        $minelo = strtotime((string) $w['end']) < time(); ?>
        <li class="<?= $minelo ? 'minelo' : '' ?>">
            <a href="wydarzenie.php?nr=<?= $nr ?>">
                <?php if ($ma): ?>
                    <img src="../<?= e((string) $w['photo']) ?>?v=<?= filemtime($plik) ?>" alt="">
                <?php else: ?>
                    <span class="brak">brak zdjęcia</span>
                <?php endif; ?>
                <span class="wydarzenie-opis">
                    <span class="wydarzenie-nazwa"><?= e((string) $w['name']) ?></span>
                    <span class="wydarzenie-data"><?= e((string) $w['datePl']) ?></span>
                    <span class="wydarzenie-loc"><?= e((string) $w['loc']) ?></span>
                    <?php if ($minelo): ?><span class="znacznik-szary">minęło</span><?php endif; ?>
                </span>
            </a>
        </li>
    <?php endforeach; ?>
</ul>

<?php zamknijStrone(); ?>
