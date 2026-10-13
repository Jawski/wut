<?php
declare(strict_types=1);
require __DIR__ . '/wspolne.php';
require __DIR__ . '/uklad.php';

wymusHttps();
startSesji();
wymagajLogowania();

$osiagniecia = czytajTresc('osiagniecia');
if ($osiagniecia === null) {
    otworzStrone('Osiągnięcia');
    echo '<p class="komunikat komunikat-zle">Nie znaleziono pliku dane/osiagniecia.json.</p>';
    zamknijStrone();
    exit;
}

$blad = null;

// kolejnosc na karuzeli jest taka, jak w pliku - z roku nie da sie jej wyliczyc,
// bo w jednym sezonie bywa kilka startow i liczy sie miesiac, ktorego tu nie ma
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['co'] ?? '') === 'przesun') {
    if (!sprawdzToken()) {
        $blad = 'Formularz stracił ważność. Otwórz go jeszcze raz.';
    } else {
        $i = null;
        foreach ($osiagniecia as $n => $o) {
            if ((string) $o['id'] === (string) ($_POST['id'] ?? '')) {
                $i = $n;
            }
        }
        $j = $i === null ? null : $i + (((string) ($_POST['kierunek'] ?? '')) === 'gora' ? -1 : 1);
        if ($i !== null && $j >= 0 && $j < count($osiagniecia)) {
            [$osiagniecia[$i], $osiagniecia[$j]] = [$osiagniecia[$j], $osiagniecia[$i]];
            $blad = zapiszTresc('osiagniecia', $osiagniecia);
        }
        if ($blad === null) {
            header('Location: osiagniecia.php');
            exit;
        }
    }
}

otworzStrone('Osiągnięcia', 'pulpit.php');
?>

<?php if ($blad): ?>
    <p class="komunikat komunikat-zle" role="alert"><?= e($blad) ?></p>
<?php endif; ?>

<h1>Osiągnięcia</h1>

<div class="paski-narzedzi">
    <div class="narzedzia-prawo">
        <a class="przycisk" href="osiagniecie.php?nowe=1">+ Dodaj wynik</a>
    </div>
</div>

<ul class="osiagniecia">
    <?php foreach ($osiagniecia as $i => $o):
        $plik = __DIR__ . '/../' . ($o['photo'] ?? '');
        $ma = ($o['photo'] ?? '') !== '' && is_file($plik); ?>
        <li>
            <a href="osiagniecie.php?id=<?= urlencode((string) $o['id']) ?>">
                <?php if ($ma): ?>
                    <img src="../<?= e((string) $o['photo']) ?>?v=<?= filemtime($plik) ?>" alt="">
                <?php else: ?>
                    <span class="brak">brak zdjęcia</span>
                <?php endif; ?>
                <span class="osiagniecie-opis">
                    <span class="osiagniecie-nazwa"><?= e((string) $o['event']) ?> <?= e((string) $o['year']) ?></span>
                    <?php if (!empty($o['overall'])): ?>
                        <span class="osiagniecie-ogolem"><?= (int) $o['overall']['place'] ?>. <?= e((string) $o['overall']['name']) ?></span>
                    <?php endif; ?>
                    <span class="osiagniecie-wyniki">
                        <?php foreach ($o['results'] ?? [] as $w): ?>
                            <span><?= (int) $w['place'] ?>. <?= e((string) $w['name']) ?></span>
                        <?php endforeach; ?>
                    </span>
                    <?php if (!empty($o['trophies'])): ?>
                        <span class="osiagniecie-trofea"><?= count($o['trophies']) ?> × trofeum</span>
                    <?php endif; ?>
                </span>
            </a>
            <span class="strzalki">
                <?php foreach ([['gora', '↑', $i > 0], ['dol', '↓', $i < count($osiagniecia) - 1]] as [$kier, $znak, $mozna]): ?>
                    <form method="post" class="strzalka">
                        <input type="hidden" name="token" value="<?= e(token()) ?>">
                        <input type="hidden" name="co" value="przesun">
                        <input type="hidden" name="id" value="<?= e((string) $o['id']) ?>">
                        <input type="hidden" name="kierunek" value="<?= $kier ?>">
                        <button type="submit" <?= $mozna ? '' : 'disabled' ?>><?= $znak ?></button>
                    </form>
                <?php endforeach; ?>
            </span>
        </li>
    <?php endforeach; ?>
</ul>

<?php zamknijStrone(); ?>
