<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';
require __DIR__ . '/sklad-dane.php';
require __DIR__ . '/uklad.php';

wymusHttps();
startSesji();
wymagajLogowania();

$zespol = czytajTresc('zespol');
if ($zespol === null) {
    otworzStrone('Skład zespołu');
    echo '<h1>Skład zespołu</h1><p class="komunikat komunikat-zle">Nie znaleziono pliku dane/zespol.json.</p>';
    zamknijStrone();
    exit;
}

$sezony  = $zespol['sezony'] ?? [];
$biezacy = idSezonuBiezacego($zespol);
$sezon   = (string) ($_GET['sezon'] ?? $biezacy);
if (!wSezonach($sezony, $sezon)) {
    $sezon = $biezacy;
}
$toBiezacy = ($sezon === $biezacy);

/* ----------------------------------------------------------------- usuwanie */

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['co'] ?? '') === 'usun') {
    if (!sprawdzToken()) {
        ustawKomunikat('Formularz stracił ważność. Spróbuj jeszcze raz.', 'zle');
    } else {
        $slug = (string) ($_POST['slug'] ?? '');
        $blad = usunOsobe($zespol, $sezon, $toBiezacy, $slug);
        ustawKomunikat($blad ?? 'Osoba usunięta ze składu. Zdjęcie zostaje na serwerze.', $blad ? 'zle' : 'ok');
    }
    header('Location: sklad.php?sezon=' . urlencode($sezon));
    exit;
}

$lista  = wczytajSklad($zespol, $sezon, $toBiezacy);
$dzialy = array_values(array_filter($zespol['dzialy'] ?? [], fn($d) => ($d['id'] ?? '') !== 'all'));

// osoby w kilku dzialach pokazujemy tylko raz, w dziale glownym
$wDzialach = [];
foreach ($dzialy as $d) {
    $wDzialach[$d['id']] = [];
}
$poza = [];
foreach ($lista as $i => $os) {
    $klucz = (string) ($os['dept'] ?? '');
    if (isset($wDzialach[$klucz])) {
        $wDzialach[$klucz][] = $i;
    } else {
        $poza[] = $i;
    }
}

otworzStrone('Skład zespołu', 'pulpit.php');
?>

<h1>Skład zespołu</h1>
<p class="wstep">
    Sezon <?= e(etykietaSezonu($sezony, $sezon)) ?> — <?= count($lista) ?> os.
    <?= $toBiezacy ? 'To skład widoczny na stronie jako bieżący.' : 'Sezon archiwalny.' ?>
    <?= obrotKart($sezony, $sezon)
        ? 'Karty się obracają — mają rewers z opisem, projektami i zawodami.'
        : 'Karty się nie obracają — zostaje imię, dział i funkcja.' ?>
    <a href="sezony.php">Zmień</a>
</p>

<div class="paski-narzedzi">
    <div class="sezony">
        <?php foreach ($sezony as $s): ?>
            <a class="sezon <?= ($s['id'] ?? '') === $sezon ? 'wybrany' : '' ?>"
               href="sklad.php?sezon=<?= urlencode((string) $s['id']) ?>"><?= e((string) $s['label']) ?></a>
        <?php endforeach; ?>
    </div>
    <div class="narzedzia-prawo">
        <input type="search" id="szukaj" placeholder="Szukaj po nazwisku…" autocomplete="off">
        <a class="przycisk pusty" href="sezony.php">Sezony</a>
        <a class="przycisk" href="osoba.php?sezon=<?= urlencode($sezon) ?>&amp;nowa=1">+ Dodaj osobę</a>
    </div>
</div>

<?php if (!$lista): ?>
    <p class="pusto">W tym sezonie nie ma jeszcze nikogo.</p>
<?php endif; ?>

<?php foreach ($dzialy as $d):
    $idx = $wDzialach[$d['id']] ?? [];
    if (!$idx) continue; ?>
    <section class="dzial-grupa">
        <h2><?= e((string) $d['label']) ?> <span class="ile"><?= count($idx) ?></span></h2>
        <ul class="osoby">
            <?php foreach ($idx as $i):
                $os = $lista[$i];
                $plik = katalogZdjec($sezon, $toBiezacy) . '/' . $os['slug'] . '.jpg';
                $ma = is_file($plik); ?>
                <li class="osoba" data-szukaj="<?= e(mb_strtolower((string) $os['name'], 'UTF-8')) ?>">
                    <a class="osoba-link" href="osoba.php?sezon=<?= urlencode($sezon) ?>&amp;slug=<?= urlencode((string) $os['slug']) ?>">
                        <?php if ($ma): ?>
                            <img class="miniatura" src="<?= e(sciezkaZdjecia($sezon, $toBiezacy, (string) $os['slug'])) ?>?v=<?= filemtime($plik) ?>" alt="">
                        <?php else: ?>
                            <span class="miniatura brak">bez zdjęcia</span>
                        <?php endif; ?>
                        <span class="osoba-opis">
                            <span class="osoba-imie"><?= e((string) $os['name']) ?></span>
                            <span class="osoba-rola"><?= e(opisFunkcji($zespol, $os)) ?></span>
                            <?php if (!empty($os['also'])): ?>
                                <span class="osoba-takze">także: <?= e(opisDodatkowychDzialow($zespol, $os)) ?></span>
                            <?php endif; ?>
                        </span>
                    </a>
                    <form method="post" class="usun-form"
                          onsubmit="return confirm('Usunąć <?= e(addslashes((string) $os['name'])) ?> ze składu?');">
                        <input type="hidden" name="token" value="<?= e(token()) ?>">
                        <input type="hidden" name="co" value="usun">
                        <input type="hidden" name="slug" value="<?= e((string) $os['slug']) ?>">
                        <button type="submit" class="usun" title="Usuń ze składu">Usuń</button>
                    </form>
                </li>
            <?php endforeach; ?>
        </ul>
    </section>
<?php endforeach; ?>

<?php if ($poza): ?>
    <section class="dzial-grupa">
        <h2>Nieznany dział <span class="ile"><?= count($poza) ?></span></h2>
        <ul class="osoby">
            <?php foreach ($poza as $i): $os = $lista[$i]; ?>
                <li class="osoba" data-szukaj="<?= e(mb_strtolower((string) $os['name'], 'UTF-8')) ?>">
                    <a class="osoba-link" href="osoba.php?sezon=<?= urlencode($sezon) ?>&amp;slug=<?= urlencode((string) $os['slug']) ?>">
                        <span class="miniatura brak">?</span>
                        <span class="osoba-opis">
                            <span class="osoba-imie"><?= e((string) $os['name']) ?></span>
                            <span class="osoba-rola">dział „<?= e((string) ($os['dept'] ?? '')) ?>” nie istnieje</span>
                        </span>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </section>
<?php endif; ?>

<script>
// filtrowanie listy po nazwisku - bez przeladowania strony
document.getElementById('szukaj').addEventListener('input', function () {
    const fraza = this.value.trim().toLowerCase();
    document.querySelectorAll('.osoba').forEach(function (li) {
        li.hidden = fraza !== '' && li.dataset.szukaj.indexOf(fraza) === -1;
    });
    // dzial bez widocznych osob chowamy razem z naglowkiem
    document.querySelectorAll('.dzial-grupa').forEach(function (sek) {
        sek.hidden = !sek.querySelector('.osoba:not([hidden])');
    });
});
</script>

<?php zamknijStrone(); ?>
