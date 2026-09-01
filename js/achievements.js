// osiagniecia na zawodach - przesuwana taśma kart, wysunieta karta pokazuje wyniki
// dane pochodza wprost od zespolu

const OSIAGNIECIA = [
    {
        id: 'fsp26', event: 'FS Poland', year: 2026, photo: 'assets/ach/fsp26.jpg',
        overall: { place: 2, name: 'Overall' },
        results: [
            { place: 1, name: 'AutoX' },
            { place: 3, name: 'Endurance' },
            { place: 2, name: 'BPP' },
            { place: 3, name: 'E. Design' },
        ],
        // trofea wyjezdzaja z bokow karty po najechaniu myszka
        trophies: ['assets/ach/trofeum1.png', 'assets/ach/trofeum2.png'],
    },
    {
        id: 'fscz26', event: 'FS Czech', year: 2026, photo: 'assets/ach/fscz26.jpg',
        results: [{ place: 3, name: 'AutoX' }],
    },
    {
        id: 'fsp25', event: 'FS Poland', year: 2025, photo: 'assets/ach/fsp25.jpg',
        results: [
            { place: 3, name: 'AutoX' },
            { place: 4, name: 'Cost & Manufacturing' },
            { place: 4, name: 'Engineering Design' },
            { place: 4, name: 'Acceleration' },
        ],
    },
    {
        id: 'fscz25', event: 'FS Czech', year: 2025, photo: 'assets/ach/fscz25.jpg',
        results: [{ place: 3, name: 'Engineering Design' }],
    },
    {
        id: 'fse24', event: 'FS East', year: 2024, photo: 'assets/ach/fse24.jpg',
        results: [{ place: 2, name: 'Endurance' }],
    },
    {
        id: 'fsp24', event: 'FS Poland', year: 2024, photo: 'assets/ach/fsp24.jpg',
        results: [{ place: 3, name: 'Acceleration' }],
    },
    {
        id: 'fsp23', event: 'FS Poland', year: 2023, photo: 'assets/ach/fsp23.jpg',
        results: [{ place: 1, name: 'BPP' }],
    },
];

function initAchievements() {
    const rail  = document.getElementById('ach-rail');
    const track = document.getElementById('ach-track');
    if (!rail || !track) return;

    const romb = (p) => `<span class="ach-dia ach-p${p > 3 ? 'x' : p}"><i>${p}</i></span>`;

    // Tasma jest sklejona z trzech kopii listy. Dzieki temu po bokach zawsze
    // stoja sasiednie karty, zamiast pustego czerwonego pasa na koncach.
    const ILE = OSIAGNIECIA.length;
    const potrojone = [...OSIAGNIECIA, ...OSIAGNIECIA, ...OSIAGNIECIA];

    track.innerHTML = potrojone.map((o, i) => `
        <div class="ach-card" data-i="${i % ILE}">
            ${(o.trophies || []).map((t, n) => `
                <img class="ach-trophy ach-trophy-${n === 0 ? 'l' : 'r'}" src="${t}"
                     alt="" aria-hidden="true" draggable="false">`).join('')}
            <div class="ach-photo">
                <img src="${o.photo}" alt="${o.event} ${o.year}" loading="lazy" draggable="false">
            </div>
            <div class="ach-panel">
                <div class="ach-panel-in">
                    <div class="ach-event">${o.event}</div>
                    <div class="ach-year">${o.year}</div>
                    ${o.overall ? `<div class="ach-overall">${romb(o.overall.place)}<span>${o.overall.name}</span></div>` : ''}
                    <ul class="ach-list${o.results.some(r => r.name.length > 11) ? ' is-single' : ''}">
                        ${o.results.map(r => `<li>${romb(r.place)}<span>${r.name}</span></li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>`).join('');

    const karty = [...track.querySelectorAll('.ach-card')];
    let aktywna = ILE;              // zaczynamy w srodkowej kopii
    let przesuniecie = 0;

    // Kazdy panel ma inna liczbe wynikow, wiec jego docelowa wysokosc mierzymy
    // raz i zapisujemy na karcie. Dzieki temu rozwiniecie to zwykle przejscie
    // CSS miedzy zerem a konkretna wartoscia - bez kombinowania w JS.
    function zmierzPanele() {
        rail.classList.remove('is-ready');
        karty.forEach(k => {
            const p = k.querySelector('.ach-panel');
            p.style.height = 'auto';
            k.style.setProperty('--panel-h', p.offsetHeight + 'px');
            p.style.height = '';
        });
        rail.classList.add('is-ready');
    }

    function wysrodkuj(animuj = true) {
        const k = karty[aktywna];
        przesuniecie = rail.clientWidth / 2 - (k.offsetLeft + k.offsetWidth / 2);
        if (animuj) {
            track.style.transition = '';
            track.style.transform = `translateX(${przesuniecie}px)`;
            return;
        }
        // skok bez animacji: bez wymuszonego przeliczenia przegladarka zdazy
        // przywrocic przejscie i zamiast przeskoku widac przejazd tasmy
        track.style.transition = 'none';
        track.style.transform = `translateX(${przesuniecie}px)`;
        void track.offsetWidth;
        track.style.transition = '';
    }

    function ustaw(i, animuj = true) {
        aktywna = Math.max(0, Math.min(karty.length - 1, i));
        karty.forEach((k, n) => k.classList.toggle('is-active', n === aktywna));
        wysrodkuj(animuj);
        if (animuj) zaplanujPrzeskok();
    }

    // Gdy wyjedziemy poza srodkowa kopie, po zakonczeniu animacji przeskakujemy
    // na blizniacza karte w srodkowej - bez animacji, wiec nie widac szwu.
    let zegarSzwu = null;
    function przeskocz() {
        clearTimeout(zegarSzwu);
        let cel = aktywna;
        if (aktywna < ILE) cel = aktywna + ILE;
        else if (aktywna >= 2 * ILE) cel = aktywna - ILE;
        if (cel === aktywna) return;
        aktywna = cel;
        karty.forEach((k, n) => k.classList.toggle('is-active', n === aktywna));
        wysrodkuj(false);
    }
    function zaplanujPrzeskok() {
        clearTimeout(zegarSzwu);
        // transitionend nie przyjdzie, gdy tasma juz stoi tam, gdzie ma stac
        zegarSzwu = setTimeout(przeskocz, 700);
    }
    track.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'transform' && e.target === track) przeskocz();
    });

    // --- przeciaganie ---
    let ciagne = false, startX = 0, bazowe = 0, droga = 0;

    rail.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        ciagne = true; droga = 0;
        startX = e.clientX;
        bazowe = przesuniecie;
        track.style.transition = 'none';
        rail.setPointerCapture(e.pointerId);
    });

    rail.addEventListener('pointermove', (e) => {
        if (!ciagne) return;
        const d = e.clientX - startX;
        droga = Math.max(droga, Math.abs(d));
        track.style.transform = `translateX(${bazowe + d}px)`;
    });

    function koniecCiagniecia() {
        if (!ciagne) return;
        ciagne = false;
        track.style.transition = '';
        // po puszczeniu zatrzymujemy sie na karcie najblizszej srodka
        const srodek = rail.getBoundingClientRect().left + rail.clientWidth / 2;
        let naj = 0, najOdl = Infinity;
        karty.forEach((k, n) => {
            const r = k.getBoundingClientRect();
            const odl = Math.abs(r.left + r.width / 2 - srodek);
            if (odl < najOdl) { najOdl = odl; naj = n; }
        });
        ustaw(naj);
    }
    rail.addEventListener('pointerup', koniecCiagniecia);
    rail.addEventListener('pointercancel', koniecCiagniecia);

    // klikniecie w bok wysrodkowuje karte, ale nie po przeciagnieciu
    karty.forEach((k, n) => {
        k.addEventListener('click', () => { if (droga < 6) ustaw(n); });
    });

    rail.tabIndex = 0;
    rail.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); ustaw(aktywna + 1); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); ustaw(aktywna - 1); }
    });

    let zegar = null;
    window.addEventListener('resize', () => {
        clearTimeout(zegar);
        zegar = setTimeout(() => { zmierzPanele(); wysrodkuj(false); }, 150);
    });

    zmierzPanele();
    ustaw(ILE, false);
    // zdjecia dochodza po chwili i moga zmienic wysokosci - ustawiamy sie ponownie
    window.addEventListener('load', () => { zmierzPanele(); wysrodkuj(false); });
}

document.addEventListener('DOMContentLoaded', initAchievements);
