<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';

startSesji();
$_SESSION = [];

// kasujemy tez samo ciasteczko sesji, nie tylko jej zawartosc
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}
session_destroy();

header('Location: index.php');
exit;
