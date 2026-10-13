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
 * Zamyka biezacy sezon: przepisuje jego sklad do archiwum i odklada kopie zdjec
 * w katalogu sezonu. Karta archiwalna niesie mniej niz biezaca - zostaje imie,
 * dzial, funkcja i ranga, bo tylko to widac na stronie w starszych sezonach.
 */
function doArchiwum(array $osoba): array
{
    $w = [
        'slug' => (string) ($osoba['slug'] ?? ''),
        'name' => (string) ($osoba['name'] ?? ''),
        'dept' => (string) ($osoba['dept'] ?? ''),
    ];
    $funkcja = (string) ($osoba['role'] ?? '');
    if ($funkcja !== '') {
        $w['role'] = $funkcja;
        $ranga = ZNANE_FUNKCJE[$funkcja] ?? null;
        if ($ranga !== null) {
            $w['rank'] = (int) $ranga;
        }
    }
    if (!empty($osoba['also'])) {
        $w['also'] = $osoba['also'];
    }
    return $w;
}

/** Kopiuje zdjecia biezacego skladu do katalogu zamykanego sezonu. */
function skopiujZdjeciaSezonu(array $sklad, string $sezon): ?string
{
    $katalog = KATALOG_ZDJEC . '/' . $sezon;
    if (!is_dir($katalog) && !@mkdir($katalog, 0755, true)) {
        return 'Nie udało się utworzyć katalogu assets/team/' . $sezon . '/.';
    }
    foreach ($sklad as $os) {
        $slug = (string) ($os['slug'] ?? '');
        $zrodlo = KATALOG_ZDJEC . '/' . $slug . '.jpg';
        $cel    = $katalog . '/' . $slug . '.jpg';
        // zdjecia zostaja tez na swoim miejscu - nowy sezon zwykle zaczyna sie
        // od tych samych osob, a kopia w katalogu sezonu utrwala stan na koniec
        if ($slug !== '' && is_file($zrodlo) && !is_file($cel) && !@copy($zrodlo, $cel)) {
            return 'Nie udało się skopiować zdjęcia ' . $slug . '.jpg do katalogu sezonu.';
        }
    }
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
    return zapiszTresc('zespol-archiwum', $archiwum);
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
