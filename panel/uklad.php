<?php
declare(strict_types=1);

/**
 * Wspolna rama kolejnych ekranow panelu: pasek na gorze, miejsce na komunikat
 * po zapisie i stopka. Dzieki temu kazdy nowy ekran to juz tylko sama tresc.
 */

function otworzStrone(string $tytul, string $powrot = ''): void
{
    $komunikat = odbierzKomunikat();
    ?>
<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= e($tytul) ?> — panel administratora WUT Racing</title>
<link rel="stylesheet" href="styl.css">
</head>
<body>

<header class="pasek">
    <a class="znak-link" href="pulpit.php"><img class="znak" src="../assets/logo-main.png" alt="WUT Racing"></a>
    <span class="pasek-tytul">Panel administratora</span>
    <span class="pasek-prawo">
        <span class="kto"><?= e((string) ($_SESSION['login'] ?? '')) ?></span>
        <a class="wyloguj" href="wyloguj.php">Wyloguj</a>
    </span>
</header>

<main class="tresc">
    <?php if ($powrot !== ''): ?>
        <a class="powrot" href="<?= e($powrot) ?>">← Wróć</a>
    <?php endif; ?>

    <?php if ($komunikat): ?>
        <p class="komunikat <?= $komunikat['rodzaj'] === 'ok' ? 'komunikat-ok' : 'komunikat-zle' ?>" role="status">
            <?= e($komunikat['tekst']) ?>
        </p>
    <?php endif; ?>
<?php
}

function zamknijStrone(): void
{
    ?>
</main>

</body>
</html>
<?php
}
