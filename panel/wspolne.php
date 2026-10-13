<?php
declare(strict_types=1);

/**
 * Panel WUT Racing - czesc wspolna: sesja, konto, zabezpieczenia.
 *
 * Haslo nie jest tu zapisane i nigdy nie trafia do repozytorium. Przy pierwszym
 * wejsciu panel prosi o jego ustawienie i zapisuje odcisk (nie samo haslo) do
 * pliku obok. Pliki z danymi panelu maja rozszerzenie .php i zaczynaja sie od
 * instrukcji konczacej wykonanie - gdyby ktos trafil na nie wprost z przegladarki,
 * serwer odda pusta strone zamiast ich zawartosci.
 */

const KATALOG_PANELU   = __DIR__;
const PLIK_KONTA       = __DIR__ . '/dane-panelu/konto.php';
const PLIK_PROB        = __DIR__ . '/dane-panelu/proby.php';
const KATALOG_TRESCI   = __DIR__ . '/../dane';

const MIN_DLUGOSC_HASLA = 10;
const LIMIT_PROB        = 5;        // tyle nieudanych logowan
const BLOKADA_SEKUND    = 900;      // i panel milczy przez kwadrans

/* ------------------------------------------------------------ pliki danych */

function straznik(): string
{
    return "<?php http_response_code(404); exit; ?>\n";
}

function czytajDane(string $plik): array
{
    if (!is_file($plik)) {
        return [];
    }
    $tresc = (string) file_get_contents($plik);
    $nl = strpos($tresc, "\n");
    if ($nl === false) {
        return [];
    }
    $dane = json_decode(substr($tresc, $nl + 1), true);
    return is_array($dane) ? $dane : [];
}

function zapiszDane(string $plik, array $dane): bool
{
    $katalog = dirname($plik);
    if (!is_dir($katalog) && !@mkdir($katalog, 0750, true)) {
        return false;
    }
    $tresc = straznik() . json_encode($dane, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    // zapis przez plik tymczasowy, zeby przerwany zapis nie zostawil polowy
    $tmp = $plik . '.tmp';
    if (@file_put_contents($tmp, $tresc, LOCK_EX) === false) {
        return false;
    }
    return @rename($tmp, $plik);
}

/* ----------------------------------------------------------------- sesja */

function startSesji(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/panel/',
        'httponly' => true,                 // ciasteczka nie widzi zaden skrypt strony
        'secure'   => czyHttps(),
        'samesite' => 'Strict',             // nie wychodzi przy wejsciu z obcej strony
    ]);
    session_name('wutpanel');
    session_start();
}

function czyHttps(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
        || (($_SERVER['SERVER_PORT'] ?? '') === '443');
}

function czyLokalnie(): bool
{
    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
    $host = explode(':', $host)[0];
    return in_array($host, ['localhost', '127.0.0.1', '::1'], true);
}

function wymusHttps(): void
{
    // na serwerze testowym nie ma certyfikatu, wiec przekierowanie zapetliloby sie
    if (czyHttps() || czyLokalnie() || PHP_SAPI === 'cli') {
        return;
    }
    // bez tego haslo poszloby przez siec otwartym tekstem
    $cel = 'https://' . ($_SERVER['HTTP_HOST'] ?? '') . ($_SERVER['REQUEST_URI'] ?? '/panel/');
    header('Location: ' . $cel, true, 301);
    exit;
}

function zalogowany(): bool
{
    return !empty($_SESSION['zalogowany']);
}

function wymagajLogowania(): void
{
    if (!zalogowany()) {
        header('Location: index.php');
        exit;
    }
}

/* ------------------------------------------------- zabezpieczenie formularzy */

function token(): string
{
    if (empty($_SESSION['token'])) {
        $_SESSION['token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['token'];
}

function sprawdzToken(): bool
{
    // chroni przed wyslaniem formularza z obcej strony w imieniu zalogowanego
    return !empty($_SESSION['token'])
        && !empty($_POST['token'])
        && hash_equals($_SESSION['token'], (string) $_POST['token']);
}

/* ------------------------------------------------------- limit prob logowania */

function kluczProby(): string
{
    return hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'nieznany'));
}

function zablokowanyDo(): int
{
    $proby = czytajDane(PLIK_PROB);
    $wpis = $proby[kluczProby()] ?? null;
    if (!$wpis || ($wpis['ile'] ?? 0) < LIMIT_PROB) {
        return 0;
    }
    $do = (int) ($wpis['ostatnia'] ?? 0) + BLOKADA_SEKUND;
    return $do > time() ? $do : 0;
}

function zapiszNieudanaProbe(): void
{
    $proby = czytajDane(PLIK_PROB);
    $k = kluczProby();
    $wpis = $proby[$k] ?? ['ile' => 0, 'ostatnia' => 0];
    // po odczekaniu blokady licznik startuje od nowa
    if (time() - (int) $wpis['ostatnia'] > BLOKADA_SEKUND) {
        $wpis['ile'] = 0;
    }
    $wpis['ile']      = (int) $wpis['ile'] + 1;
    $wpis['ostatnia'] = time();
    $proby[$k] = $wpis;

    // nie trzymamy w nieskonczonosc wpisow, ktore juz nic nie znacza
    foreach ($proby as $klucz => $w) {
        if (time() - (int) ($w['ostatnia'] ?? 0) > 7 * 24 * 3600) {
            unset($proby[$klucz]);
        }
    }
    zapiszDane(PLIK_PROB, $proby);
}

function wyczyscProby(): void
{
    $proby = czytajDane(PLIK_PROB);
    unset($proby[kluczProby()]);
    zapiszDane(PLIK_PROB, $proby);
}

/* --------------------------------------------------------------------- konto */

function kontoIstnieje(): bool
{
    $k = czytajDane(PLIK_KONTA);
    return !empty($k['odcisk']);
}

function zalozKonto(string $login, string $haslo): ?string
{
    $login = trim($login);
    if ($login === '') {
        return 'Podaj nazwę użytkownika.';
    }
    if (mb_strlen($haslo) < MIN_DLUGOSC_HASLA) {
        return 'Hasło musi mieć co najmniej ' . MIN_DLUGOSC_HASLA . ' znaków.';
    }
    $ok = zapiszDane(PLIK_KONTA, [
        'login'     => $login,
        'odcisk'    => password_hash($haslo, PASSWORD_DEFAULT),
        'utworzono' => date('c'),
    ]);
    return $ok ? null : 'Nie udało się zapisać konta — serwer nie pozwala na zapis w katalogu panelu.';
}

function sprawdzLogowanie(string $login, string $haslo): bool
{
    $k = czytajDane(PLIK_KONTA);
    if (empty($k['odcisk'])) {
        return false;
    }
    // oba sprawdzenia zawsze, zeby czas odpowiedzi nie zdradzal, co bylo zle
    $loginOk = hash_equals((string) ($k['login'] ?? ''), trim($login));
    $hasloOk = password_verify($haslo, (string) $k['odcisk']);
    return $loginOk && $hasloOk;
}

/* -------------------------------------------------------------------- widok */

function e(?string $t): string
{
    return htmlspecialchars((string) $t, ENT_QUOTES, 'UTF-8');
}
