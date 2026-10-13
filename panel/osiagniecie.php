<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';
require __DIR__ . '/uklad.php';

wymusHttps();
startSesji();
wymagajLogowania();

$osiagniecia = czytajTresc('osiagniecia');
if ($osiagniecia === null) {
    otworzStrone('Wynik');
    echo '<p class="komunikat komunikat-zle">Nie znaleziono pliku dane/osiagniecia.json.</p>';
    zamknijStrone();
    exit;
}

$id   = (string) ($_GET['id'] ?? '');
$nowe = $id === '' || isset($_GET['nowe']);
$nr   = $nowe ? null : znajdzWynik($osiagniecia, $id);

if (!$nowe && $nr === null) {
    ustawKomunikat('Nie znaleziono takiego wyniku.', 'zle');
    header('Location: osiagniecia.php');
    exit;
}

$wynik = $nowe
    ? ['id' => '', 'event' => '', 'year' => '', 'photo' => '', 'results' => []]
    : $osiagniecia[$nr];
$blad = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!sprawdzToken()) {
        $blad = 'Formularz stracił ważność. Otwórz go jeszcze raz.';
    } elseif (($_POST['co'] ?? '') === 'usun') {
        array_splice($osiagniecia, $nr, 1);
        $blad = zapiszTresc('osiagniecia', $osiagniecia);
        if ($blad === null) {
            ustawKomunikat('Wynik usunięty. Zdjęcie zostaje na serwerze.');
            header('Location: osiagniecia.php');
            exit;
        }
    } else {
        [$blad, $wynik] = zapiszWynik($osiagniecia, $nr);
        if ($blad === null) {
            ustawKomunikat('Zapisano: ' . $wynik['event'] . ' ' . $wynik['year'] . '.');
            header('Location: osiagniecia.php');
            exit;
        }
    }
}

function znajdzWynik(array $lista, string $id): ?int
{
    foreach ($lista as $i => $o) {
        if ((string) ($o['id'] ?? '') === $id) {
            return $i;
        }
    }
    return null;
}

function zapiszWynik(array $osiagniecia, ?int $nr): array
{
    $stary = $nr === null ? [] : $osiagniecia[$nr];

    $event = trim((string) ($_POST['event'] ?? ''));
    $rok   = (int) ($_POST['year'] ?? 0);
    $id    = $nr === null ? zrobSlug($event . '-' . $rok) : (string) $stary['id'];

    $wyniki = [];
    $miejsca = (array) ($_POST['miejsce'] ?? []);
    $nazwy   = (array) ($_POST['konkurencja'] ?? []);
    foreach ($nazwy as $i => $nazwa) {
        $nazwa = trim((string) $nazwa);
        $m = (int) ($miejsca[$i] ?? 0);
        if ($nazwa !== '' && $m > 0) {
            $wyniki[] = ['place' => $m, 'name' => $nazwa];
        }
    }

    // kolejnosc pol taka sama, jak maja wpisy juz w pliku
    $wpis = ['id' => $id, 'event' => $event, 'year' => $rok, 'photo' => (string) ($stary['photo'] ?? '')];

    $ogolem = (int) ($_POST['overall_place'] ?? 0);
    if ($ogolem > 0) {
        $wpis['overall'] = [
            'place' => $ogolem,
            'name'  => trim((string) ($_POST['overall_name'] ?? '')) ?: 'Overall',
        ];
    }
    $wpis['results'] = $wyniki;

    // trofea wyjezdzajace zza karty zostaja takie, jakie byly - podmienia je
    // sie rzadko i nie ma po co trzymac na to osobnego pola w formularzu
    if (!empty($stary['trophies'])) {
        $wpis['trophies'] = $stary['trophies'];
    }

    if ($event === '') {
        return ['Podaj nazwę zawodów.', $wpis];
    }
    if ($rok < 2000 || $rok > 2100) {
        return ['Podaj rok.', $wpis];
    }
    if (!$wyniki) {
        return ['Dodaj przynajmniej jeden wynik.', $wpis];
    }
    $zajety = znajdzWynik($osiagniecia, $id);
    if ($zajety !== null && $zajety !== $nr) {
        return ['Wynik o identyfikatorze „' . $id . '” już istnieje.', $wpis];
    }

    $przeslano = ($_FILES['zdjecie']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
    if ($nr === null && !$przeslano) {
        return ['Wybierz zdjęcie z zawodów.', $wpis];
    }
    if ($przeslano) {
        $bladPliku = zapiszZdjecieJpg($_FILES['zdjecie'], KATALOG_OSIAGNIEC . '/' . $id . '.jpg', OSIAGNIECIE_SZER);
        if ($bladPliku !== null) {
            return [$bladPliku, $wpis];
        }
        $wpis['photo'] = 'assets/ach/' . $id . '.jpg';
    }

    if ($nr === null) {
        array_unshift($osiagniecia, $wpis);      // najnowszy start staje na poczatku
    } else {
        $osiagniecia[$nr] = $wpis;
    }
    return [zapiszTresc('osiagniecia', $osiagniecia), $wpis];
}

/* ------------------------------------------------------------------- widok */

$plik = ($wynik['photo'] ?? '') !== '' ? __DIR__ . '/../' . $wynik['photo'] : '';
$maPlik = $plik !== '' && is_file($plik);
$wyniki = $wynik['results'] ?: [['place' => '', 'name' => '']];

otworzStrone($nowe ? 'Nowy wynik' : $wynik['event'] . ' ' . $wynik['year'], 'osiagniecia.php');
?>

<h1><?= $nowe ? 'Nowy wynik' : e((string) $wynik['event'] . ' ' . $wynik['year']) ?></h1>

<?php if ($blad): ?>
    <p class="komunikat komunikat-zle" role="alert"><?= e($blad) ?></p>
<?php endif; ?>

<form method="post" enctype="multipart/form-data" class="formularz waski">
    <input type="hidden" name="token" value="<?= e(token()) ?>">

    <label>
        <span>Zawody</span>
        <input type="text" name="event" required value="<?= e((string) $wynik['event']) ?>" placeholder="FS Poland">
    </label>

    <label class="w-linii">
        <span>Rok</span>
        <input type="number" name="year" min="2000" max="2100" required
               value="<?= e((string) ($wynik['year'] ?? '')) ?>">
    </label>

    <fieldset>
        <legend>Klasyfikacja generalna</legend>
        <div class="wiersz">
            <input type="number" name="overall_place" min="1" max="99" placeholder="miejsce"
                   value="<?= e((string) ($wynik['overall']['place'] ?? '')) ?>">
            <input type="text" name="overall_name" placeholder="Overall"
                   value="<?= e((string) ($wynik['overall']['name'] ?? '')) ?>">
        </div>
    </fieldset>

    <fieldset class="lista-pol">
        <legend>Konkurencje</legend>
        <div id="wyniki">
            <?php foreach ($wyniki as $w): ?>
                <div class="wiersz">
                    <input type="number" name="miejsce[]" min="1" max="99" placeholder="miejsce"
                           value="<?= e((string) ($w['place'] ?? '')) ?>">
                    <input type="text" name="konkurencja[]" placeholder="AutoX"
                           value="<?= e((string) ($w['name'] ?? '')) ?>">
                    <button type="button" class="usun-wiersz" title="Usuń">×</button>
                </div>
            <?php endforeach; ?>
        </div>
        <button type="button" class="przycisk maly" id="dodaj-wynik">+ Dodaj wiersz</button>
    </fieldset>

    <fieldset class="logo-pole">
        <legend>Zdjęcie</legend>
        <div class="bolid-podglad">
            <?php if ($maPlik): ?>
                <img src="../<?= e((string) $wynik['photo']) ?>?v=<?= filemtime($plik) ?>" alt="">
            <?php else: ?>
                <span class="brak">brak zdjęcia</span>
            <?php endif; ?>
        </div>
        <input type="file" name="zdjecie" accept="image/jpeg,image/png,image/webp" <?= $nowe ? 'required' : '' ?>>
    </fieldset>

    <div class="pod-formularzem">
        <button type="submit" class="przycisk glowny">Zapisz</button>
        <a class="przycisk pusty" href="osiagniecia.php">Anuluj</a>
    </div>
</form>

<?php if (!$nowe): ?>
    <form method="post" class="osobno"
          onsubmit="return confirm('Usunąć <?= e(addslashes((string) $wynik['event'] . ' ' . $wynik['year'])) ?>?');">
        <input type="hidden" name="token" value="<?= e(token()) ?>">
        <input type="hidden" name="co" value="usun">
        <button type="submit" class="usun">Usuń wynik</button>
    </form>
<?php endif; ?>

<script>
(function () {
    const lista = document.getElementById('wyniki');
    document.getElementById('dodaj-wynik').addEventListener('click', function () {
        const w = lista.firstElementChild.cloneNode(true);
        w.querySelectorAll('input').forEach(function (i) { i.value = ''; });
        lista.appendChild(w);
        w.querySelector('input').focus();
    });
    lista.addEventListener('click', function (e) {
        if (!e.target.classList.contains('usun-wiersz')) return;
        if (lista.children.length > 1) e.target.closest('.wiersz').remove();
        else e.target.closest('.wiersz').querySelectorAll('input').forEach(function (i) { i.value = ''; });
    });
})();
</script>

<?php zamknijStrone(); ?>
