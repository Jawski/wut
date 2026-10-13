<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';

wymusHttps();
startSesji();

$blad = null;
$etap = kontoIstnieje() ? 'logowanie' : 'zakladanie';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!sprawdzToken()) {
        $blad = 'Formularz stracił ważność. Spróbuj jeszcze raz.';
    } elseif ($etap === 'zakladanie') {
        $login   = trim((string) ($_POST['login'] ?? ''));
        $haslo   = (string) ($_POST['haslo'] ?? '');
        $powtorz = (string) ($_POST['powtorz'] ?? '');
        if ($haslo !== $powtorz) {
            $blad = 'Hasła nie są takie same.';
        } else {
            $blad = zalozKonto($login, $haslo);
            if ($blad === null) {
                session_regenerate_id(true);
                $_SESSION['zalogowany'] = true;
                $_SESSION['login'] = $login;
                header('Location: pulpit.php');
                exit;
            }
        }
    } else {
        $do = zablokowanyDo();
        if ($do > 0) {
            $blad = 'Za dużo nieudanych prób. Spróbuj za ' . (int) ceil(($do - time()) / 60) . ' min.';
        } elseif (sprawdzLogowanie((string) ($_POST['login'] ?? ''), (string) ($_POST['haslo'] ?? ''))) {
            wyczyscProby();
            session_regenerate_id(true);          // nowy identyfikator sesji po zalogowaniu
            $_SESSION['zalogowany'] = true;
            $_SESSION['login'] = trim((string) ($_POST['login'] ?? ''));
            header('Location: pulpit.php');
            exit;
        } else {
            zapiszNieudanaProbe();
            // celowo nie mowimy, czy zly byl login, czy haslo
            $blad = 'Nieprawidłowy login lub hasło.';
        }
    }
}

if (zalogowany()) {
    header('Location: pulpit.php');
    exit;
}

$zablokowanyDo = zablokowanyDo();
?>
<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= $etap === 'zakladanie' ? 'Pierwsze uruchomienie' : 'Logowanie' ?> — panel administratora WUT Racing</title>
<link rel="stylesheet" href="styl.css">
</head>
<body class="ekran-logowania">

<main class="karta">
    <img class="znak" src="../assets/logo-main.png" alt="WUT Racing">
    <h1><?= $etap === 'zakladanie' ? 'Pierwsze uruchomienie' : 'Panel administratora' ?></h1>

    <?php if ($etap === 'zakladanie'): ?>
    <?php endif; ?>

    <?php if ($blad): ?>
        <p class="blad" role="alert"><?= e($blad) ?></p>
    <?php endif; ?>

    <?php if ($zablokowanyDo > 0 && $etap === 'logowanie'): ?>
        <p class="blad" role="alert">
            Logowanie chwilowo zablokowane po kilku nieudanych próbach.
            Spróbuj za <?= (int) ceil(($zablokowanyDo - time()) / 60) ?> min.
        </p>
    <?php else: ?>
        <form method="post" autocomplete="off">
            <input type="hidden" name="token" value="<?= e(token()) ?>">

            <label>
                <span>Nazwa użytkownika</span>
                <input type="text" name="login" required autofocus
                       value="<?= e((string) ($_POST['login'] ?? '')) ?>">
            </label>

            <label>
                <span>Hasło</span>
                <input type="password" name="haslo" required
                       <?= $etap === 'zakladanie' ? 'minlength="' . MIN_DLUGOSC_HASLA . '"' : '' ?>>
            </label>

            <?php if ($etap === 'zakladanie'): ?>
                <label>
                    <span>Powtórz hasło</span>
                    <input type="password" name="powtorz" required minlength="<?= MIN_DLUGOSC_HASLA ?>">
                </label>
            <?php endif; ?>

            <button type="submit"><?= $etap === 'zakladanie' ? 'Załóż konto' : 'Zaloguj' ?></button>
        </form>
    <?php endif; ?>
</main>

</body>
</html>
