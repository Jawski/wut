<?php
declare(strict_types=1);

/**
 * Sciana sponsorow - wspolne dla listy kategorii (sponsorzy.php) i formularza
 * jednego logotypu (sponsor.php).
 *
 * Kategorie z kodu niosa "klucz" z tlumaczeniem nazwy na angielski. Kategorie
 * dolozone w panelu zadnego klucza nie maja, wiec angielska nazwe trzymaja
 * przy sobie, w polu "nazwaEn".
 */

/** Wielkosci kafelkow - klasy, ktore zna arkusz stylow strony. */
const POZIOMY = [
    'tier-1' => 'jak partner główny (największe)',
    'tier-2' => 'jak partnerzy strategiczni',
    'tier-8' => 'jak granty zewnętrzne',
    'tier-3' => 'jak partnerzy platynowi',
    'tier-4' => 'jak partnerzy diamentowi',
    'tier-5' => 'jak partnerzy złoci',
    'tier-6' => 'jak partnerzy srebrni',
    'tier-7' => 'jak partnerzy brązowi (najmniejsze)',
];

/** Angielskie nazwy kategorii, ktore siedza w js/i18n.js - tylko do podejrzenia. */
const ANGIELSKIE = [
    'sponsors.main'      => 'Main partner',
    'sponsors.strategic' => 'Strategic partners',
    'sponsors.grants'    => 'External grants',
    'sponsors.platinum'  => 'Platinum partners',
    'sponsors.diamond'   => 'Diamond partners',
    'sponsors.gold'      => 'Gold partners',
    'sponsors.silver'    => 'Silver partners',
    'sponsors.bronze'    => 'Bronze partners',
];

function angielskaZKlucza(string $klucz): string
{
    return ANGIELSKIE[$klucz] ?? '';
}

function znajdzKategorie(array $kategorie, string $id): ?int
{
    foreach ($kategorie as $i => $k) {
        if ((string) ($k['id'] ?? '') === $id) {
            return $i;
        }
    }
    return null;
}

function poprawnyKolor(string $kolor): string
{
    return preg_match('/^#[0-9a-fA-F]{6}$/', $kolor) ? strtolower($kolor) : '#9aa3ad';
}

function poprawnaKlasa(string $klasa): string
{
    return array_key_exists($klasa, POZIOMY) ? $klasa : 'tier-6';
}

/** Nazwa pliku logotypu z nazwy sponsora, bez wchodzenia na cudzy plik. */
function wolnaNazwaPliku(array $kategorie, string $nazwa, string $pomin = ''): string
{
    $baza = zrobSlug($nazwa);
    if ($baza === '') {
        $baza = 'logo';
    }
    $zajete = [];
    foreach ($kategorie as $k) {
        foreach ($k['logotypy'] ?? [] as $l) {
            $plik = (string) ($l['plik'] ?? '');
            if ($plik !== $pomin) {
                $zajete[strtolower($plik)] = true;
            }
        }
    }
    $plik = $baza . '.png';
    $n = 2;
    while (isset($zajete[$plik]) || (is_file(KATALOG_LOGO . '/' . $plik) && $plik !== $pomin)) {
        $plik = $baza . '-' . $n . '.png';
        $n++;
    }
    return $plik;
}
