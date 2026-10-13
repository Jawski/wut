<?php
declare(strict_types=1);

/**
 * Operacje na skladzie zespolu - wspolne dla listy (sklad.php) i formularza
 * jednej osoby (osoba.php).
 *
 * Biezacy sezon siedzi w dane/zespol.json pod kluczem "sklad" i niesie pelne
 * karty z opisem. Sezony archiwalne leza w dane/zespol-archiwum.json i maja
 * tylko to, co widac na karcie z tylu strony: imie, dzial i funkcje.
 */

/**
 * Funkcje, ktore strona zna: tlumaczy je na angielski i ustawia wedlug nich
 * kolejnosc w stosikach dzialow. Musi zgadzac sie z ROLE_EN i RANGI w js/team.js.
 */
const ZNANE_FUNKCJE = [
    'Prezes'                                  => 0,
    'Wiceprezes ds. technicznych'             => 1,
    'Wiceprezes ds. operacyjno-finansowych'   => 1,
    'Wiceprezes ds. organizacyjnych'          => 1,
    'Wiceprezes ds. finansowych'              => 1,
    'Lider działu technicznego'               => 1,
    'Koordynator'                             => 2,
    'Koordynator · Lider działu operacyjnego' => 2,
    'Zastępca koordynatora'                   => 3,
    'Fotograf'                                => 4,
    'Członek zarządu'                         => 5,
];

/* ------------------------------------------------------------------ sezony */

function idSezonuBiezacego(array $zespol): string
{
    $sezony = $zespol['sezony'] ?? [];
    foreach ($sezony as $s) {
        if (!empty($s['current'])) {
            return (string) $s['id'];
        }
    }
    return $sezony ? (string) $sezony[count($sezony) - 1]['id'] : '';
}

function wSezonach(array $sezony, string $id): bool
{
    foreach ($sezony as $s) {
        if ((string) ($s['id'] ?? '') === $id) {
            return true;
        }
    }
    return false;
}

function etykietaSezonu(array $sezony, string $id): string
{
    foreach ($sezony as $s) {
        if ((string) ($s['id'] ?? '') === $id) {
            return (string) ($s['label'] ?? $id);
        }
    }
    return $id;
}

/**
 * Identyfikator sezonu z jego nazwy. Trzymamy sie zapisu, ktory juz jest w
 * danych: "2026/2027" daje "2026-27", bo tak nazywaja sie katalogi ze zdjeciami.
 */
function idZEtykiety(string $etykieta): string
{
    $e = trim($etykieta);
    if (preg_match('~^(\d{4})\s*/\s*(\d{4})$~', $e, $m)) {
        return $m[1] . '-' . substr($m[2], 2);
    }
    if (preg_match('~^(\d{4})\s*/\s*(\d{2})$~', $e, $m)) {
        return $m[1] . '-' . $m[2];
    }
    return zrobSlug($e);
}

/**
 * Czy karty tego sezonu maja rewers z opisem. Ustawienie siedzi przy sezonie,
 * bo dwa najstarsze sklady spisane sa bez opisow i nie ma ich skad wziac.
 */
function obrotKart(array $sezony, string $id): bool
{
    foreach ($sezony as $s) {
        if ((string) ($s['id'] ?? '') === $id) {
            return !empty($s['obrot']);
        }
    }
    return false;
}

/** Czy ta osoba ma cokolwiek, co pokazuje rewers karty. */
function maOpis(array $osoba): bool
{
    foreach (['since', 'studies', 'bio', 'achievements', 'projects'] as $pole) {
        if (!empty($osoba[$pole])) {
            return true;
        }
    }
    return false;
}

/**
 * Kopiuje zdjecia skladu z jednego sezonu do drugiego. Zdjecia biezacego sezonu
 * leza wprost w assets/team, pozostalych - w podkatalogu nazwanym sezonem.
 */
function skopiujZdjeciaMiedzySezonami(
    array $sklad,
    string $zSezonu,
    bool $zBiezacego,
    string $doSezonu,
    bool $doBiezacego
): ?string {
    $skad = katalogZdjec($zSezonu, $zBiezacego);
    $dokad = katalogZdjec($doSezonu, $doBiezacego);
    if ($skad === $dokad) {
        return null;
    }
    if (!is_dir($dokad) && !@mkdir($dokad, 0755, true)) {
        return 'Nie udało się utworzyć katalogu na zdjęcia sezonu.';
    }
    foreach ($sklad as $os) {
        $slug = (string) ($os['slug'] ?? '');
        $zrodlo = $skad . '/' . $slug . '.jpg';
        if ($slug !== '' && is_file($zrodlo) && !@copy($zrodlo, $dokad . '/' . $slug . '.jpg')) {
            return 'Nie udało się skopiować zdjęcia ' . $slug . '.jpg.';
        }
    }
    return null;
}

/** Kopia zdjec biezacego skladu do katalogu zamykanego sezonu. */
function skopiujZdjeciaSezonu(array $sklad, string $sezon): ?string
{
    // oryginaly zostaja na miejscu - nowy sezon zwykle zaczyna sie od tych
    // samych osob, a kopia w katalogu sezonu utrwala stan na jego koniec
    return skopiujZdjeciaMiedzySezonami($sklad, '', true, $sezon, false);
}

/**
 * Odwrotnosc powyzszego: sezon wraca na pozycje biezacego, wiec jego zdjecia
 * musza znalezc sie tam, gdzie strona szuka ich dla biezacego skladu.
 */
function przywrocZdjeciaSezonu(array $sklad, string $sezon): ?string
{
    $katalog = KATALOG_ZDJEC . '/' . $sezon;
    foreach ($sklad as $os) {
        $slug = (string) ($os['slug'] ?? '');
        $zrodlo = $katalog . '/' . $slug . '.jpg';
        if ($slug === '' || !is_file($zrodlo)) {
            continue;
        }
        if (!@copy($zrodlo, KATALOG_ZDJEC . '/' . $slug . '.jpg')) {
            return 'Nie udało się przenieść zdjęcia ' . $slug . '.jpg z katalogu sezonu.';
        }
        @unlink($zrodlo);
    }
    // katalog sezonu znika tylko wtedy, gdy wszystko z niego wrocilo - gdyby
    // zostalo w nim czyjes zdjecie spoza skladu, lepiej go nie ruszac
    @rmdir($katalog);
    return null;
}

/* ------------------------------------------------------------------- sklad */

function wczytajSklad(array $zespol, string $sezon, bool $biezacy): array
{
    if ($biezacy) {
        return $zespol['sklad'] ?? [];
    }
    $archiwum = czytajTresc('zespol-archiwum') ?? [];
    return $archiwum[$sezon] ?? [];
}

function zapiszSklad(array $zespol, string $sezon, bool $biezacy, array $lista): ?string
{
    if ($biezacy) {
        $zespol['sklad'] = array_values($lista);
        // lista "bez zdjecia" steruje miniaturami dzialow; liczymy ja z plikow,
        // zeby nie trzeba bylo o niej pamietac przy kazdej zmianie
        $zespol['bezZdjecia'] = przeliczBezZdjecia($zespol['sklad']);
        return zapiszTresc('zespol', $zespol);
    }
    $archiwum = czytajTresc('zespol-archiwum') ?? [];
    $archiwum[$sezon] = array_values($lista);
    return zapiszTresc('zespol-archiwum', $archiwum, true);
}

function przeliczBezZdjecia(array $sklad): array
{
    $brak = [];
    foreach ($sklad as $os) {
        $slug = (string) ($os['slug'] ?? '');
        if ($slug !== '' && !is_file(KATALOG_ZDJEC . '/' . $slug . '.jpg')) {
            $brak[] = $slug;
        }
    }
    return $brak;
}

function znajdzOsobe(array $lista, string $slug): ?int
{
    foreach ($lista as $i => $os) {
        if ((string) ($os['slug'] ?? '') === $slug) {
            return $i;
        }
    }
    return null;
}

function usunOsobe(array $zespol, string $sezon, bool $biezacy, string $slug): ?string
{
    $lista = wczytajSklad($zespol, $sezon, $biezacy);
    $i = znajdzOsobe($lista, $slug);
    if ($i === null) {
        return 'Nie znaleziono takiej osoby w składzie.';
    }
    array_splice($lista, $i, 1);
    return zapiszSklad($zespol, $sezon, $biezacy, $lista);
}

/* ------------------------------------------------------------------ zdjecia */

/** Sciezka do zdjecia widziana z katalogu panelu. */
function sciezkaZdjecia(string $sezon, bool $biezacy, string $slug): string
{
    return $biezacy
        ? '../assets/team/' . rawurlencode($slug) . '.jpg'
        : '../assets/team/' . rawurlencode($sezon) . '/' . rawurlencode($slug) . '.jpg';
}

function plikZdjecia(string $sezon, bool $biezacy, string $slug): string
{
    return katalogZdjec($sezon, $biezacy) . '/' . $slug . '.jpg';
}

/* ------------------------------------------------------------------- opisy */

function opisFunkcji(array $zespol, array $os): string
{
    if (!empty($os['role'])) {
        return (string) $os['role'];
    }
    $dept = (string) ($os['dept'] ?? '');
    return (string) ($zespol['dzialyOpis'][$dept]['defaultRole'] ?? 'Członek zespołu');
}

function opisDodatkowychDzialow(array $zespol, array $os): string
{
    $nazwy = [];
    foreach ($os['also'] ?? [] as $a) {
        $id = (string) ($a['dept'] ?? '');
        $nazwy[] = (string) ($zespol['dzialyOpis'][$id]['label'] ?? $id);
    }
    return implode(', ', $nazwy);
}
