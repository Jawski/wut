import { CARS } from './cars-data.js';

function t(key, fallback) {
    return (window.WUT_t ? window.WUT_t(key) : null) || fallback;
}

let activeId = CARS[0].id;

// kolejnosc widoczna na osi decyduje o kierunku przesuwania
const poRoku = () => [...CARS].sort((a, b) => a.year - b.year);
const idxNaOsi = (id) => poRoku().findIndex(c => c.id === id);
const bezAnimacji = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// rosnie przy kazdym przelaczeniu - opozniona podmiana sprawdza, czy nadal jest aktualna
let pokolenie = 0;

function renderTimeline() {
    const track = document.getElementById('cars-timeline-track');
    const ordered = [...CARS].sort((a, b) => a.year - b.year);
    track.innerHTML = ordered.map((c) => `
        <button class="timeline-car ${c.id === activeId ? 'is-active' : ''}" data-id="${c.id}" aria-label="${c.name}">
            <div class="timeline-dot-row"><span class="timeline-dot"></span></div>
            <div class="timeline-car-graphic">
                <img src="${c.photo}" alt="${c.name}" loading="lazy">
            </div>
            <div class="timeline-year">${c.year}</div>
            <div class="timeline-name">${c.name}</div>
        </button>
    `).join('');

    track.querySelectorAll('.timeline-car').forEach(b => {
        b.addEventListener('click', () => {
            if (b.dataset.id === activeId) return;
            // dodatni = wybrano bolid dalej w prawo, wiec tresc jedzie w lewo
            const kierunek = Math.sign(idxNaOsi(b.dataset.id) - idxNaOsi(activeId));
            activeId = b.dataset.id;
            track.querySelectorAll('.timeline-car').forEach(x => x.classList.toggle('is-active', x.dataset.id === activeId));
            renderActive(kierunek);
        });
    });
}

function budujPanel(car) {
    const rows = [
        { lbl: t('cars.power', 'Moc silnika'), val: car.specs.power },
        { lbl: t('cars.vmax', 'Prędkość maks.'), val: car.specs.vmax },
        { lbl: t('cars.accel', '0 – 100 km/h'), val: car.specs.accel },
        { lbl: t('cars.mass', 'Masa'), val: car.specs.mass },
    ];

    return `
        <div class="car-show-inner">
            <div class="car-show-photo">
                <img src="${car.photo}" alt="${car.name}">
            </div>
            <div class="car-show-data">
                <span class="car-show-year">${car.year}</span>
                <h2 class="car-show-name">${car.name}</h2>
                <div class="car-show-specs">
                    ${rows.map(r => `
                        <div class="car-spec">
                            <div class="lbl">${r.lbl}</div>
                            <div class="val">${r.val}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderActive(kierunek = 0) {
    const moje = ++pokolenie;
    const car = CARS.find(c => c.id === activeId) || CARS[0];
    const panel = document.getElementById('active-car-panel');
    const stary = panel.querySelector('.car-show-inner');
    const html = budujPanel(car);

    if (!stary || !kierunek || bezAnimacji) {
        panel.innerHTML = html;
        panel.style.minHeight = '';
        return;
    }

    // wysokosc panelu zalezy od proporcji zdjecia - blokujemy ja na czas
    // podmiany, zeby sekcja nie skakala w polowie animacji
    panel.style.minHeight = panel.offsetHeight + 'px';

    stary.classList.add(kierunek > 0 ? 'is-out-left' : 'is-out-right');

    setTimeout(() => {
        // w miedzyczasie mogl paść kolejny klik - wtedy ta podmiana jest juz nieaktualna
        if (moje !== pokolenie) return;
        panel.innerHTML = html;
        const nowy = panel.querySelector('.car-show-inner');
        nowy.classList.add(kierunek > 0 ? 'is-in-right' : 'is-in-left');
        void nowy.offsetWidth;                 // wymus wyliczenie stanu poczatkowego
        nowy.classList.remove('is-in-right', 'is-in-left');
        setTimeout(() => { if (moje === pokolenie) panel.style.minHeight = ''; }, 450);
    }, 240);
}

function boot() {
    activeId = CARS[0].id;
    renderTimeline();
    renderActive();
}

window.WUT_renderCars = boot;
document.addEventListener('DOMContentLoaded', boot);
