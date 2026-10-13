<?php
declare(strict_types=1);

/**
 * Kalendarz startow. Daty na kartach strona bierze z gotowych napisow (datePl,
 * dateEn), a nie sklada ich sama - panel pisze je wiec za nas z dat poczatku i
 * konca, zeby nie trzeba bylo pilnowac dwoch jezykow i polskiej odmiany miesiecy.
 */

const MIESIACE_PL = [
    1 => 'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

const MIESIACE_EN = [
    1 => 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

/** Flagi, ktore zna js/common.js - innych strona nie narysuje. */
const FLAGI = [
    'pl' => 'Polska',
    'cz' => 'Czechy',
    'at' => 'Austria',
];

const KATALOG_WYDARZEN = __DIR__ . '/../assets/media';
const WYDARZENIE_SZER = 2048;

/**
 * Napis z data. Jeden dzien dostaje godzine rozpoczecia, kilka dni - zakres.
 * Myslnik jest polpauza, tak jak w datach juz zapisanych.
 */
function napisDaty(string $start, string $koniec, bool $angielski): string
{
    $od = new DateTimeImmutable($start);
    $do = new DateTimeImmutable($koniec);
    $miesiace = $angielski ? MIESIACE_EN : MIESIACE_PL;

    $dzien = fn(DateTimeImmutable $d) => (int) $d->format('j');
    $msc   = fn(DateTimeImmutable $d) => $miesiace[(int) $d->format('n')];
    $rok   = fn(DateTimeImmutable $d) => $d->format('Y');

    if ($od->format('Y-m-d') === $do->format('Y-m-d')) {
        $napis = $dzien($od) . ' ' . $msc($od) . ' ' . $rok($od);
        return $od->format('H:i') === '00:00' ? $napis : $napis . ' · ' . $od->format('H:i');
    }
    if ($od->format('Y-m') === $do->format('Y-m')) {
        return $dzien($od) . '–' . $dzien($do) . ' ' . $msc($do) . ' ' . $rok($do);
    }
    if ($od->format('Y') === $do->format('Y')) {
        return $dzien($od) . ' ' . $msc($od) . ' – ' . $dzien($do) . ' ' . $msc($do) . ' ' . $rok($do);
    }
    return $dzien($od) . ' ' . $msc($od) . ' ' . $rok($od)
         . ' – ' . $dzien($do) . ' ' . $msc($do) . ' ' . $rok($do);
}

/** Data z formularza (datetime-local) na postac, ktora siedzi w pliku. */
function naDateIso(string $zPola): ?string
{
    $zPola = trim($zPola);
    if ($zPola === '') {
        return null;
    }
    $d = DateTimeImmutable::createFromFormat('Y-m-d\TH:i', $zPola)
        ?: DateTimeImmutable::createFromFormat('Y-m-d\TH:i:s', $zPola);
    return $d ? $d->format('Y-m-d\TH:i:s') : null;
}

/** I z powrotem - pole datetime-local nie przyjmuje sekund. */
function naPoleDaty(string $iso): string
{
    $d = date_create($iso);
    return $d ? $d->format('Y-m-d\TH:i') : '';
}
