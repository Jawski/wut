import { CARS } from './cars-data.js';

function t(key, fallback) {
    return (window.WUT_t ? window.WUT_t(key) : null) || fallback;
}

let activeId = CARS[0].id;

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
            activeId = b.dataset.id;
            track.querySelectorAll('.timeline-car').forEach(x => x.classList.toggle('is-active', x.dataset.id === activeId));
            renderActive();
        });
    });
}

function renderActive() {
    const car = CARS.find(c => c.id === activeId) || CARS[0];
    const panel = document.getElementById('active-car-panel');

    const rows = [
        { lbl: t('cars.power', 'Moc silnika'), val: car.specs.power },
        { lbl: t('cars.vmax', 'Prędkość maks.'), val: car.specs.vmax },
        { lbl: t('cars.accel', '0 – 100 km/h'), val: car.specs.accel },
        { lbl: t('cars.mass', 'Masa'), val: car.specs.mass },
    ];

    panel.innerHTML = `
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

function boot() {
    activeId = CARS[0].id;
    renderTimeline();
    renderActive();
}

window.WUT_renderCars = boot;
document.addEventListener('DOMContentLoaded', boot);
