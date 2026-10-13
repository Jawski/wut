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
