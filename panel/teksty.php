<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';
require __DIR__ . '/teksty-dane.php';
require __DIR__ . '/uklad.php';

wymusHttps();
startSesji();
wymagajLogowania();

$katalog = katalogTekstow();
$blad = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!sprawdzToken()) {
        $blad = 'Formularz stracił ważność. Otwórz go jeszcze raz.';
    } else {
        $nadpisane = ['pl' => [], 'en' => []];
        $zmienionych = 0;
        foreach ($katalog as $wpisy) {
            foreach ($wpisy as $klucz => $oryginal) {
                foreach (['pl', 'en'] as $jezyk) {
                    $nowy = trim((string) ($_POST[$jezyk][$klucz] ?? ''));
                    // zapisujemy tylko to, co rozni sie od tekstu z kodu - dzieki
                    // temu wpisanie z powrotem oryginalu kasuje zmiane
                    if ($nowy !== '' && $nowy !== trim((string) $oryginal[$jezyk])) {
                        $nadpisane[$jezyk][$klucz] = $nowy;
                        $zmienionych++;
                    }
                }
            }
        }
        $blad = zapiszNadpisane($nadpisane);
        if ($blad === null) {
            ustawKomunikat($zmienionych === 0
                ? 'Wszystkie teksty wróciły do wersji z kodu.'
                : 'Zapisano. Zmienionych tekstów: ' . $zmienionych . '.');
            header('Location: teksty.php');
            exit;
        }
    }
}

$nadpisane = czytajNadpisane();

otworzStrone('Teksty na stronie', 'pulpit.php');
?>

<h1>Teksty na stronie</h1>

<?php if ($blad): ?>
    <p class="komunikat komunikat-zle" role="alert"><?= e($blad) ?></p>
<?php endif; ?>

<div class="paski-narzedzi">
    <input type="search" id="szukaj-tekst" placeholder="Szukaj w tekstach…" autocomplete="off">
    <div class="narzedzia-prawo">
        <label class="ptaszek">
            <input type="checkbox" id="tylko-zmienione">
            <span>tylko zmienione</span>
        </label>
    </div>
</div>

<form method="post" class="teksty-form">
    <input type="hidden" name="token" value="<?= e(token()) ?>">

    <?php foreach ($katalog as $grupa => $wpisy): ?>
        <details class="grupa-tekstow" open>
            <summary><?= e($grupa) ?> <span class="ile"><?= count($wpisy) ?></span></summary>

            <?php foreach ($wpisy as $klucz => $oryginal):
                $pl = $nadpisane['pl'][$klucz] ?? $oryginal['pl'];
                $en = $nadpisane['en'][$klucz] ?? $oryginal['en'];
                $zmieniony = isset($nadpisane['pl'][$klucz]) || isset($nadpisane['en'][$klucz]); ?>
                <div class="tekst <?= $zmieniony ? 'zmieniony' : '' ?>"
                     data-szukaj="<?= e(mb_strtolower($klucz . ' ' . strip_tags($pl) . ' ' . strip_tags($en), 'UTF-8')) ?>">
                    <div class="tekst-klucz">
                        <span class="jednolity"><?= e($klucz) ?></span>
                        <?php if ($zmieniony): ?><span class="znacznik-szary">zmieniony</span><?php endif; ?>
                    </div>
                    <label>
                        <span>Polski</span>
                        <textarea name="pl[<?= e($klucz) ?>]" rows="<?= dobierzWysokosc($pl) ?>"><?= e($pl) ?></textarea>
                    </label>
                    <label>
                        <span>Angielski</span>
                        <textarea name="en[<?= e($klucz) ?>]" rows="<?= dobierzWysokosc($en) ?>"><?= e($en) ?></textarea>
                    </label>
                </div>
            <?php endforeach; ?>
        </details>
    <?php endforeach; ?>

    <div class="pod-formularzem przyklejony">
        <button type="submit" class="przycisk glowny">Zapisz teksty</button>
    </div>
</form>

<?php
function dobierzWysokosc(string $tekst): int
{
    return max(1, min(8, (int) ceil(mb_strlen($tekst) / 70)));
}
?>

<script>
// filtr po tresci i po kluczu; grupa bez widocznych pozycji chowa sie cala
(function () {
    const pole = document.getElementById('szukaj-tekst');
    const tylkoZmienione = document.getElementById('tylko-zmienione');

    function odswiez() {
        const fraza = pole.value.trim().toLowerCase();
        document.querySelectorAll('.tekst').forEach(function (t) {
            const pasuje = fraza === '' || t.dataset.szukaj.indexOf(fraza) !== -1;
            const zmieniony = !tylkoZmienione.checked || t.classList.contains('zmieniony');
            t.hidden = !(pasuje && zmieniony);
        });
        document.querySelectorAll('.grupa-tekstow').forEach(function (g) {
            g.hidden = !g.querySelector('.tekst:not([hidden])');
        });
    }
    pole.addEventListener('input', odswiez);
    tylkoZmienione.addEventListener('change', odswiez);
})();
</script>

<?php zamknijStrone(); ?>
