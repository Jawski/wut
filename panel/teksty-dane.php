<?php
declare(strict_types=1);

/**
 * Katalog tekstow ze strony.
 *
 * Polska wersja kazdego napisu stoi wprost w pliku .html, przy znaczniku
 * data-i18n; angielska w slowniku w js/i18n.js. Panel czyta oba zrodla przy
 * kazdym wejsciu, wiec katalog nie moze sie rozjechac z kodem, a zapisuje
 * tylko to, co ktos faktycznie zmienil - do dane/teksty.js, ktory strona
 * wczytuje przed slownikiem i ktory ma nad nim pierwszenstwo.
 */

const PLIK_TEKSTOW = __DIR__ . '/../dane/teksty.js';
const PLIK_SLOWNIKA = __DIR__ . '/../js/i18n.js';

const STRONY = [
    'index.html'     => 'Strona główna',
    'o-nas.html'     => 'O nas',
    'zespol.html'    => 'Zespół',
    'bolidy.html'    => 'Bolidy',
    'sponsorzy.html' => 'Sponsorzy',
];

/**
 * Oryginalne teksty: polskie z HTML, angielskie ze slownika. Oddaje liste
 * grup, a w kazdej klucze z para pl/en.
 */
function katalogTekstow(): array
{
    $slownik = czytajSlownik();
    $grupy = [];
    $zHtml = [];

    foreach (STRONY as $plik => $tytul) {
        $sciezka = __DIR__ . '/../' . $plik;
        if (!is_file($sciezka)) {
            continue;
        }
        $wpisy = [];
        foreach (tekstyZeStrony($sciezka) as $klucz => $pl) {
            if (isset($zHtml[$klucz])) {
                continue;                       // ten sam napis bywa na kilku stronach
            }
            $zHtml[$klucz] = true;
            $wpisy[$klucz] = ['pl' => $pl, 'en' => $slownik['en'][$klucz] ?? ''];
        }
        if ($wpisy) {
            $grupy[$tytul] = $wpisy;
        }
    }

    // napisy, ktore wstawiaja skrypty - nie ma ich w zadnym pliku .html
    $zKodu = [];
    foreach ($slownik['en'] as $klucz => $en) {
        if (!isset($zHtml[$klucz])) {
            $zKodu[$klucz] = ['pl' => $slownik['pl'][$klucz] ?? '', 'en' => $en];
        }
    }
    if ($zKodu) {
        $grupy['Napisy wstawiane przez stronę'] = $zKodu;
    }
    return $grupy;
}

/** Wyciaga z pliku .html zawartosc kazdego znacznika z data-i18n. */
function tekstyZeStrony(string $sciezka): array
{
    $html = (string) file_get_contents($sciezka);
    $dok = new DOMDocument();
    $poprzednie = libxml_use_internal_errors(true);
    // bez tego wskazania DOMDocument czyta plik jako latin1 i psuje polskie znaki
    $dok->loadHTML('<?xml encoding="UTF-8">' . $html);
    libxml_clear_errors();
    libxml_use_internal_errors($poprzednie);

    $out = [];
    foreach ((new DOMXPath($dok))->query('//*[@data-i18n]') as $el) {
        $klucz = $el->getAttribute('data-i18n');
        $srodek = '';
        foreach ($el->childNodes as $dziecko) {
            $srodek .= $dok->saveHTML($dziecko);
        }
        $out[$klucz] = trim($srodek);
    }
    return $out;
}

/** Slownik z js/i18n.js - sam go czytamy, zeby nie trzymac drugiej kopii. */
function czytajSlownik(): array
{
    $js = (string) @file_get_contents(PLIK_SLOWNIKA);
    $out = ['pl' => [], 'en' => []];
    foreach (['pl', 'en'] as $jezyk) {
        if (!preg_match('/\b' . $jezyk . ':\s*\{(.*?)\n\s*\},?\s*\n/s', $js, $blok)) {
            continue;
        }
        preg_match_all("/'([A-Za-z0-9._]+)':\s*'((?:[^'\\\\]|\\\\.)*)'/", $blok[1], $pary, PREG_SET_ORDER);
        foreach ($pary as $p) {
            $out[$jezyk][$p[1]] = str_replace(["\\'", '\\\\'], ["'", '\\'], $p[2]);
        }
    }
    return $out;
}

/** Zmiany zapisane wczesniej w panelu. */
function czytajNadpisane(): array
{
    $tresc = @file_get_contents(PLIK_TEKSTOW);
    if ($tresc === false || !preg_match('/\{.*\}/s', $tresc, $m)) {
        return ['pl' => [], 'en' => []];
    }
    $dane = json_decode($m[0], true);
    return [
        'pl' => is_array($dane['pl'] ?? null) ? $dane['pl'] : [],
        'en' => is_array($dane['en'] ?? null) ? $dane['en'] : [],
    ];
}

function zapiszNadpisane(array $nadpisane): ?string
{
    ksort($nadpisane['pl']);
    ksort($nadpisane['en']);
    // rzutowanie na obiekt, bo pusta tablica PHP zapisalaby sie jako [] zamiast {}
    $json = json_encode(
        ['pl' => (object) $nadpisane['pl'], 'en' => (object) $nadpisane['en']],
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG
    );
    if ($json === false) {
        return 'Nie udało się przygotować tekstów do zapisu: ' . json_last_error_msg() . '.';
    }

    if (is_file(PLIK_TEKSTOW)) {
        if (!is_dir(KATALOG_KOPII) && !@mkdir(KATALOG_KOPII, 0750, true)) {
            return 'Nie udało się odłożyć kopii zapasowej.';
        }
        @copy(PLIK_TEKSTOW, KATALOG_KOPII . '/teksty-' . date('Y-m-d_His') . '.js');
        $stare = glob(KATALOG_KOPII . '/teksty-*.js') ?: [];
        sort($stare);
        foreach (array_slice($stare, 0, max(0, count($stare) - ILE_KOPII)) as $s) {
            @unlink($s);
        }
    }

    $tmp = PLIK_TEKSTOW . '.tmp';
    if (@file_put_contents($tmp, 'window.WUT_TEKSTY = ' . $json . ";\n", LOCK_EX) === false) {
        return 'Brak prawa zapisu w katalogu dane/ na serwerze.';
    }
    return @rename($tmp, PLIK_TEKSTOW) ? null : 'Nie udało się podmienić pliku dane/teksty.js.';
}
