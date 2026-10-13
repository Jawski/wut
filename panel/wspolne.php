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

const KATALOG_LOGO = __DIR__ . '/../assets/sponsors';
const KATALOG_BOLIDOW = __DIR__ . '/../assets/cars';
const LOGO_BOK = 800;               // dluzszy bok logotypu po zmniejszeniu
const BOLID_BOK = 1600;             // zdjecia bolidow stoja na pol ekranu
const LOGO_POLE = 1.43;             // pole kafelka - takie samo dla kazdego logo
const LOGO_MAX_PROPORCJA = 5.6;     // powyzej tego logo rozpychaloby rzad

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

function zapiszTresc(string $nazwa, array $dane, bool $obiektGdyPusty = false): ?string
{
    $plik = KATALOG_TRESCI . '/' . $nazwa . '.json';
    // pusta tablica PHP zapisuje sie jako [], a pliki trzymane pod kluczami
    // maja byc obiektem {} nawet wtedy, gdy nic w nich nie zostalo
    $doZapisu = ($obiektGdyPusty && $dane === []) ? new stdClass() : $dane;
    $json = json_encode($doZapisu, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        // bez powodu i bez wskazania pola taki blad jest nie do odgadniecia
        return 'Nie udało się przygotować danych do zapisu: ' . json_last_error_msg()
            . '.' . zepsutyFragment($dane);
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

/** Szuka pola, ktore nie jest poprawnym UTF-8 - inaczej blad zapisu nic nie mowi. */
function zepsutyFragment(array $dane, string $sciezka = ''): string
{
    foreach ($dane as $k => $v) {
        $p = $sciezka === '' ? (string) $k : $sciezka . '.' . $k;
        if (is_array($v)) {
            $gdzie = zepsutyFragment($v, $p);
            if ($gdzie !== '') {
                return $gdzie;
            }
        } elseif (is_string($v) && !mb_check_encoding($v, 'UTF-8')) {
            return ' Pole: ' . $p . ' (' . bin2hex(substr($v, 0, 40)) . ')';
        }
    }
    return '';
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

/**
 * Logotyp sponsora: obcinamy przezroczysty margines i zostawiamy proporcje -
 * to one decyduja potem o wielkosci kafelka na scianie sponsorow.
 */
function zapiszLogo(array $plik, string $cel, ?array &$wymiary = null): ?string
{
    return zapiszPrzezroczysty($plik, $cel, LOGO_BOK, true, $wymiary);
}

/**
 * Zdjecie bolidu: tak samo PNG z przezroczystoscia, ale bez obcinania - kadr
 * jest czescia zdjecia i wszystkie bolidy maja stac na stronie tak samo.
 */
function zapiszZdjecieBolidu(array $plik, string $cel): ?string
{
    $x = null;
    return zapiszPrzezroczysty($plik, $cel, BOLID_BOK, false, $x);
}

/**
 * Obrazek z przezroczystoscia. Zapisujemy zawsze jako PNG, zeby przezroczystosc
 * przetrwala, i zmniejszamy do rozsadnego rozmiaru - nie ma po co trzymac na
 * serwerze pliku wiekszego, niz kiedykolwiek pokaze sie na stronie.
 */
function zapiszPrzezroczysty(array $plik, string $cel, int $bok, bool $obetnij, ?array &$wymiary): ?string
{
    if (($plik['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_INI_SIZE
        || ($plik['error'] ?? 0) === UPLOAD_ERR_FORM_SIZE) {
        return 'Plik jest za duży — serwer przyjmuje do ' . ini_get('upload_max_filesize') . 'B.';
    }
    if (($plik['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($plik['tmp_name'])) {
        return 'Nie udało się wczytać przesłanego pliku.';
    }
    if (!extension_loaded('gd')) {
        return 'Serwer nie ma rozszerzenia GD — panel nie przygotuje logotypu.';
    }

    $info = @getimagesize($plik['tmp_name']);
    if (!$info) {
        return 'To nie jest obrazek (obsługujemy PNG, JPG i WEBP).';
    }
    $obraz = match ($info[2]) {
        IMAGETYPE_PNG  => @imagecreatefrompng($plik['tmp_name']),
        IMAGETYPE_JPEG => @imagecreatefromjpeg($plik['tmp_name']),
        IMAGETYPE_WEBP => @imagecreatefromwebp($plik['tmp_name']),
        default        => false,
    };
    if (!$obraz) {
        return 'Nieobsługiwany format — zapisz logotyp jako PNG, JPG albo WEBP.';
    }
    imagepalettetotruecolor($obraz);
    imagealphablending($obraz, false);
    imagesavealpha($obraz, true);

    $obraz = zmniejszDo($obraz, $bok);
    if ($obetnij) {
        $obraz = obetnijPrzezroczystyMargines($obraz);
    }

    $katalog = dirname($cel);
    if (!is_dir($katalog) && !@mkdir($katalog, 0755, true)) {
        imagedestroy($obraz);
        return 'Nie udało się utworzyć katalogu na logotypy.';
    }
    $ok = @imagepng($obraz, $cel, 8);
    $wymiary = ['w' => imagesx($obraz), 'h' => imagesy($obraz)];
    imagedestroy($obraz);

    return $ok ? null : 'Brak prawa zapisu w katalogu assets/sponsors/ na serwerze.';
}

function zmniejszDo(\GdImage $obraz, int $bok): \GdImage
{
    $w = imagesx($obraz);
    $h = imagesy($obraz);
    if (max($w, $h) <= $bok) {
        return $obraz;
    }
    $skala = $bok / max($w, $h);
    $nowy = przezroczystePlotno((int) round($w * $skala), (int) round($h * $skala));
    imagecopyresampled($nowy, $obraz, 0, 0, 0, 0, imagesx($nowy), imagesy($nowy), $w, $h);
    imagedestroy($obraz);
    return $nowy;
}

/**
 * Szuka pierwszego i ostatniego niepustego wiersza oraz kolumny. Bez tego
 * logotyp z szerokim przezroczystym marginesem dostalby kafelek liczony razem
 * z pustka dookola i wygladalby na mniejszy od pozostalych.
 */
function obetnijPrzezroczystyMargines(\GdImage $obraz): \GdImage
{
    $w = imagesx($obraz);
    $h = imagesy($obraz);
    $lewo = $w; $prawo = -1; $gora = $h; $dol = -1;

    for ($y = 0; $y < $h; $y++) {
        for ($x = 0; $x < $w; $x++) {
            // alfa siedzi w bitach 24-30; 127 to pelna przezroczystosc
            if ((imagecolorat($obraz, $x, $y) >> 24 & 0x7F) < 120) {
                if ($x < $lewo) { $lewo = $x; }
                if ($x > $prawo) { $prawo = $x; }
                if ($y < $gora) { $gora = $y; }
                if ($y > $dol) { $dol = $y; }
            }
        }
    }
    if ($prawo < 0 || ($lewo === 0 && $gora === 0 && $prawo === $w - 1 && $dol === $h - 1)) {
        return $obraz;                       // caly pusty albo i tak przyciety
    }
    $nowy = przezroczystePlotno($prawo - $lewo + 1, $dol - $gora + 1);
    imagecopy($nowy, $obraz, 0, 0, $lewo, $gora, imagesx($nowy), imagesy($nowy));
    imagedestroy($obraz);
    return $nowy;
}

function przezroczystePlotno(int $w, int $h): \GdImage
{
    $p = imagecreatetruecolor(max(1, $w), max(1, $h));
    imagealphablending($p, false);
    imagesavealpha($p, true);
    imagefill($p, 0, 0, imagecolorallocatealpha($p, 0, 0, 0, 127));
    return $p;
}

/**
 * Rozmiar kafelka logotypu. Kazdy ma zajmowac podobne pole, zeby szerokie
 * logotypy nie przytlaczaly kwadratowych - stad pierwiastki. Bardzo rozciagniete
 * logotypy przycinamy do granicy, inaczej rozpychalyby caly rzad.
 */
function policzKafelek(int $w, int $h): array
{
    $proporcja = max(0.18, min(LOGO_MAX_PROPORCJA, $w / max(1, $h)));
    return [
        'lw' => round(sqrt(LOGO_POLE * $proporcja), 2),
        'lh' => round(sqrt(LOGO_POLE / $proporcja), 2),
    ];
}

/* ----------------------------------------------------------------- drobiazgi */

/**
 * Linie z pola wielowierszowego. Celowo bez wyrazenia regularnego: \R poza
 * trybem unicode uznaje za koniec wiersza takze bajt 0x85, a ten siedzi w
 * srodku litery "ą" (C4 85) - tekst rozpadal sie wtedy w polowie znaku.
 */
function podzielNaWiersze(string $tekst): array
{
    $tekst = str_replace("\r\n", "\n", $tekst);
    $tekst = str_replace("\r", "\n", $tekst);
    return explode("\n", $tekst);
}

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
