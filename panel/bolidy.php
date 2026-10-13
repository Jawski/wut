<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';
require __DIR__ . '/uklad.php';

wymusHttps();
startSesji();
wymagajLogowania();

$bolidy = czytajTresc('bolidy');
if ($bolidy === null) {
    otworzStrone('Bolidy');
    echo '<p class="komunikat komunikat-zle">Nie znaleziono pliku dane/bolidy.json.</p>';
    zamknijStrone();
    exit;
}

// strona ustawia bolidy na osi czasu wedlug roku, wiec i tu pokazujemy je tak samo
usort($bolidy, fn($a, $b) => ((int) ($a['year'] ?? 0)) <=> ((int) ($b['year'] ?? 0)));

otworzStrone('Bolidy', 'pulpit.php');
?>

<h1>Bolidy</h1>

<div class="paski-narzedzi">
    <div class="narzedzia-prawo">
        <a class="przycisk" href="bolid.php?nowy=1">+ Dodaj bolid</a>
    </div>
</div>

<ul class="bolidy">
    <?php foreach ($bolidy as $b):
        $plik = __DIR__ . '/../' . ($b['photo'] ?? '');
        $ma = ($b['photo'] ?? '') !== '' && is_file($plik); ?>
        <li>
            <a href="bolid.php?id=<?= urlencode((string) $b['id']) ?>">
                <?php if ($ma): ?>
                    <img src="../<?= e((string) $b['photo']) ?>?v=<?= filemtime($plik) ?>" alt="">
                <?php else: ?>
                    <span class="brak">brak zdjęcia</span>
                <?php endif; ?>
                <span class="bolid-opis">
                    <span class="bolid-nazwa"><?= e((string) $b['name']) ?></span>
                    <span class="bolid-rok"><?= e((string) ($b['year'] ?? '')) ?></span>
                </span>
            </a>
        </li>
    <?php endforeach; ?>
</ul>

<?php zamknijStrone(); ?>
