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
const KATALOG_KOPII    = __DIR__ . '/dane-panelu/kopie';
const KATALOG_TRESCI   = __DIR__ . '/../dane';
const KATALOG_ZDJEC    = __DIR__ . '/../assets/team';

const ZDJECIE_SZER = 800;           // wszystkie zdjecia skladu maja ten sam rozmiar
const ZDJECIE_WYS  = 1067;
const ILE_KOPII    = 30;

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

/* ------------------------------------------------------------ tresc strony */

/**
 * Pliki w dane/ czyta i zapisuje sama strona, wiec trzymamy dokladnie ten sam
 * format zapisu - inaczej kazdy zapis z panelu robilby wielka roznice w repo.
 */
function czytajTresc(string $nazwa): ?array
{
    $plik = KATALOG_TRESCI . '/' . $nazwa . '.json';
    if (!is_file($plik)) {
        return null;
    }
    $dane = json_decode((string) file_get_contents($plik), true);
    return is_array($dane) ? $dane : null;
}

function zapiszTresc(string $nazwa, array $dane): ?string
{
    $plik = KATALOG_TRESCI . '/' . $nazwa . '.json';
    $json = json_encode($dane, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        return 'Nie udało się przygotować danych do zapisu.';
    }
    kopiaZapasowa($nazwa);

    $tmp = $plik . '.tmp';
    if (@file_put_contents($tmp, $json . "\n", LOCK_EX) === false) {
        return 'Brak prawa zapisu w katalogu dane/ na serwerze.';
    }
    if (!@rename($tmp, $plik)) {
        @unlink($tmp);
        return 'Nie udało się podmienić pliku ' . $nazwa . '.json.';
    }
    return null;
}

/** Kopia sprzed zmiany - bez tego pomylka w panelu byla nie do cofniecia. */
function kopiaZapasowa(string $nazwa): void
{
    $plik = KATALOG_TRESCI . '/' . $nazwa . '.json';
    if (!is_file($plik)) {
        return;
    }
    if (!is_dir(KATALOG_KOPII) && !@mkdir(KATALOG_KOPII, 0750, true)) {
        return;
    }
    @copy($plik, KATALOG_KOPII . '/' . $nazwa . '-' . date('Y-m-d_His') . '.json');

    // zostawiamy ostatnie ILE_KOPII, reszta tylko zajmuje miejsce na hostingu
    $stare = glob(KATALOG_KOPII . '/' . $nazwa . '-*.json') ?: [];
    sort($stare);
    foreach (array_slice($stare, 0, max(0, count($stare) - ILE_KOPII)) as $s) {
        @unlink($s);
    }
}

/* ------------------------------------------------------------------ zdjecia */

function katalogZdjec(string $sezon, bool $biezacy): string
{
    return $biezacy ? KATALOG_ZDJEC : KATALOG_ZDJEC . '/' . $sezon;
}

/**
 * Przycina i skaluje przeslane zdjecie do rozmiaru, jaki maja wszystkie karty.
 * Zdjecia z telefonu potrafia byc obrocone tylko znacznikiem EXIF, wiec najpierw
 * prostujemy je naprawde - inaczej na stronie wisialyby bokiem.
 */
function zapiszZdjecie(array $plik, string $cel, string $kotwica = 'gora'): ?string
{
    if (($plik['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_INI_SIZE
        || ($plik['error'] ?? 0) === UPLOAD_ERR_FORM_SIZE) {
        return 'Zdjęcie jest za duże — serwer przyjmuje do ' . ini_get('upload_max_filesize') . 'B.';
    }
    if (($plik['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($plik['tmp_name'])) {
        return 'Nie udało się wczytać przesłanego pliku.';
    }
    if (!extension_loaded('gd')) {
        return 'Serwer nie ma rozszerzenia GD — panel nie przytnie zdjęcia.';
    }

    $info = @getimagesize($plik['tmp_name']);
    if (!$info) {
        return 'To nie jest zdjęcie (obsługujemy JPG, PNG i WEBP).';
    }
    $obraz = match ($info[2]) {
        IMAGETYPE_JPEG => @imagecreatefromjpeg($plik['tmp_name']),
        IMAGETYPE_PNG  => @imagecreatefrompng($plik['tmp_name']),
        IMAGETYPE_WEBP => @imagecreatefromwebp($plik['tmp_name']),
        default        => false,
    };
    if (!$obraz) {
        return 'Nieobsługiwany format zdjęcia — zapisz je jako JPG, PNG albo WEBP.';
    }

    if ($info[2] === IMAGETYPE_JPEG && function_exists('exif_read_data')) {
        $exif = @exif_read_data($plik['tmp_name']);
        $obrot = match ((int) ($exif['Orientation'] ?? 1)) {
            3 => 180,
            6 => -90,
            8 => 90,
            default => 0,
        };
        if ($obrot !== 0) {
            $obrocony = @imagerotate($obraz, $obrot, 0);
            if ($obrocony) {
                imagedestroy($obraz);
                $obraz = $obrocony;
            }
        }
    }

    $w = imagesx($obraz);
    $h = imagesy($obraz);
    $docelowy = ZDJECIE_SZER / ZDJECIE_WYS;

    if ($w / $h > $docelowy) {           // za szerokie - obcinamy boki po rowno
        $nw = (int) round($h * $docelowy);
        $nh = $h;
        $x = (int) round(($w - $nw) / 2);
        $y = 0;
    } else {                              // za wysokie - decyduje wybrana kotwica
        $nw = $w;
        $nh = (int) round($w / $docelowy);
        $x = 0;
        $y = match ($kotwica) {
            'srodek' => (int) round(($h - $nh) / 2),
            'dol'    => $h - $nh,
            default  => 0,
        };
    }

    $wynik = imagecreatetruecolor(ZDJECIE_SZER, ZDJECIE_WYS);
    imagecopyresampled($wynik, $obraz, 0, 0, $x, $y, ZDJECIE_SZER, ZDJECIE_WYS, $nw, $nh);
    imagedestroy($obraz);

    $katalog = dirname($cel);
    if (!is_dir($katalog) && !@mkdir($katalog, 0755, true)) {
        imagedestroy($wynik);
        return 'Nie udało się utworzyć katalogu na zdjęcia.';
    }
    $ok = @imagejpeg($wynik, $cel, 86);
    imagedestroy($wynik);

    return $ok ? null : 'Brak prawa zapisu w katalogu assets/team/ na serwerze.';
}

/* ----------------------------------------------------------------- drobiazgi */

/** Identyfikator z imienia i nazwiska - tak samo jak nazywaja sie pliki zdjec. */
function zrobSlug(string $tekst): string
{
    $mapa = ['ą'=>'a','ć'=>'c','ę'=>'e','ł'=>'l','ń'=>'n','ó'=>'o','ś'=>'s','ż'=>'z','ź'=>'z',
             'Ą'=>'a','Ć'=>'c','Ę'=>'e','Ł'=>'l','Ń'=>'n','Ó'=>'o','Ś'=>'s','Ż'=>'z','Ź'=>'z',
             'ø'=>'o','Ø'=>'o','ö'=>'o','ä'=>'a','ü'=>'u','é'=>'e','è'=>'e','á'=>'a','í'=>'i'];
    $t = strtr($tekst, $mapa);
    $t = mb_strtolower($t, 'UTF-8');
    $t = preg_replace('/[^a-z0-9]+/', '-', $t) ?? '';
    return trim($t, '-');
}

/** Komunikat przenoszony przez przekierowanie po zapisie. */
function ustawKomunikat(string $tekst, string $rodzaj = 'ok'): void
{
    $_SESSION['komunikat'] = ['tekst' => $tekst, 'rodzaj' => $rodzaj];
}

function odbierzKomunikat(): ?array
{
    $k = $_SESSION['komunikat'] ?? null;
    unset($_SESSION['komunikat']);
    return $k;
}

/* -------------------------------------------------------------------- widok */

function e(?string $t): string
{
    return htmlspecialchars((string) $t, ENT_QUOTES, 'UTF-8');
}
