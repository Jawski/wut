/* ============================================
   Cars page — interactive horizontal timeline.
   Klikalne renderowane bolidy, panel z detalami pod spodem.
   ============================================ */

import { CARS } from './cars-data.js';

// Statyczny render bolidu (z Blendera) — ten sam dla wszystkich generacji,
// starsze są subtelnie tonowane filtrem CSS wg koloru danego bolidu.
const BOLID_RENDER = 'assets/bolid-render.png';

// Filtr CSS tonujący render na kolor danej generacji.
// WUT6 (czerwony, #e10600) → bez zmian. Starsze → lekki hue-shift.
function tintFilter(color) {
    if (!color || color.toLowerCase() === '#e10600') return 'none';
    // przelicz hex → odcień, policz przesunięcie względem czerwieni (0deg)
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    const d = max - min;
    if (d !== 0) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
    }
    // render jest czerwony (~0deg) — przesuń ku docelowemu odcieniowi
    return `hue-rotate(${Math.round(h)}deg) saturate(0.85)`;
}

let activeId = CARS[0].id;

function renderTimeline() {
    const track = document.getElementById('cars-timeline-track');
    // Order: oldest → newest (left → right)
    const ordered = [...CARS].sort((a, b) => a.year - b.year);
    track.innerHTML = ordered.map((c) => `
        <button class="timeline-car ${c.id === activeId ? 'is-active' : ''}" data-id="${c.id}" aria-label="Wybierz ${c.name}">
            <div class="timeline-dot"></div>
            <div class="timeline-car-graphic">
                <img src="${BOLID_RENDER}" alt="${c.name}" loading="lazy"
                     style="filter: ${tintFilter(c.color)};">
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
    const stub = Object.entries(car.specs).flatMap(([_g, rows]) => Object.entries(rows)).slice(0, 6);

    panel.innerHTML = `
        <div class="active-car-inner">
            <div class="active-car-grid">
                <div class="active-car-visual reveal">
                    <span class="year-tag">${car.year} · Gen. ${car.gen}</span>
                    <div class="active-car-render">
                        <img src="${BOLID_RENDER}" alt="${car.name}"
                             style="filter: ${tintFilter(car.color)};">
                    </div>
                </div>
                <div class="active-car-info reveal" data-delay="2">
                    <span class="eyebrow">${car.hero.kicker}</span>
                    <h2 class="h-1" style="margin-top: 8px;">${car.name}</h2>
                    <p class="lead" style="margin: 16px 0 28px;">${car.tagline}</p>

                    <div class="active-car-specs">
                        ${stub.map(([k, v]) => `
                            <div class="ac-spec">
                                <div class="lbl">${k}</div>
                                <div class="val">${v}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="cta-actions" style="margin-top: 32px;">
                        <a href="bolid.html?id=${car.id}" class="btn btn-primary btn-arrow">Pełna prezentacja</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Re-init reveal
    panel.querySelectorAll('.reveal').forEach(el => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        io.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    activeId = CARS[0].id; // CARS już zaczyna od najnowszego (WUT6)
    renderTimeline();
    renderActive();
});
