function t(key, fallback) {
    return (window.WUT_t ? window.WUT_t(key) : null) || fallback;
}

function firstSentence(text) {
    const m = text.match(/^[^.!?]+[.!?]/);
    if (m) return m[0].trim();
    const words = text.split(/\s+/);
    return words.length <= 16 ? text : words.slice(0, 16).join(' ') + '...';
}

const ROLE_EN = {
    'Prezes': 'President',
    'Wiceprezes ds. operacyjno-finansowych': 'VP Operations & Finance',
    'Wiceprezes ds. technicznych': 'VP Engineering',
    'Wiceprezes ds. organizacyjnych': 'VP Organisation',
    'Wiceprezes ds. finansowych': 'VP Finance',
    'Lider działu technicznego': 'Head of engineering',
    'Koordynator': 'Coordinator',
    'Koordynator · Lider działu operacyjnego': 'Coordinator · Head of operations',
    'Zastępca koordynatora': 'Deputy coordinator',
    'Fotograf': 'Photographer',
    'Członek zarządu': 'Board member',
    'Dział aerodynamiki': 'Aerodynamics',
    'Dział nadwozia': 'Chassis',
    'Dział zawieszenia': 'Suspension',
    'Dział elektroniki': 'Electronics',
    'Dział silnika': 'Engine',
    'Dział PR': 'PR',
    'Dział logistyki': 'Logistics',
    'Dział fundraisingu': 'Fundraising',
};
function roleLabel(m) {
    const pl = window.WUT_getRole(m);
    return (window.WUT_LANG === 'en' && ROLE_EN[pl]) ? ROLE_EN[pl] : pl;
}

// im nizsza liczba, tym wyzej w hierarchii - decyduje o kolejnosci w stosiku
const RANGI = {
    'Prezes': 0,
    'Wiceprezes ds. technicznych': 1,
    'Wiceprezes ds. operacyjno-finansowych': 1,
    'Koordynator': 2,
    'Zastępca koordynatora': 3,
    'Fotograf': 4,
};
function ranga(m) {
    if (typeof m.rank === 'number') return m.rank;   // sklady archiwalne niosa range wprost
    const r = RANGI[m.role];
    return r === undefined ? 5 : r;
}

/* ------------------------------------------------------------------ sezony */

const SEZONY = window.WUT_SEASONS || [{ id: 'now', label: '', current: true }];
const SEZON_BIEZACY = (SEZONY.find(s => s.current) || SEZONY[SEZONY.length - 1]).id;
let sezon = SEZON_BIEZACY;

function biezacy() { return sezon === SEZON_BIEZACY; }

function sklad() {
    if (biezacy()) return window.WUT_TEAM || [];
    return (window.WUT_TEAM_ARCHIVE || {})[sezon] || [];
}

// zdjecia archiwalnych sezonow leza w podfolderach, biezacy zostaje na miejscu
function zdjecie(m) {
    return biezacy() ? `assets/team/${m.slug}.jpg` : `assets/team/${sezon}/${m.slug}.jpg`;
}

function zastepcze(m) {
    return `assets/team/${m.f ? '_placeholder_f' : '_placeholder'}.jpg`;
}

function wDziale(dept) {
    return window.WUT_deptMembers(sklad(), dept);
}

function renderSeasons() {
    const wrap = document.getElementById('season-switch');
    if (!wrap || SEZONY.length < 2) return;

    wrap.innerHTML = SEZONY.map(s => `
        <button class="season-tab ${s.id === sezon ? 'is-active' : ''}" type="button"
                data-season="${s.id}" aria-pressed="${s.id === sezon}">
            <span>${s.label}</span>
        </button>`).join('');

    wrap.querySelectorAll('.season-tab').forEach(b => {
        b.addEventListener('click', () => zmienSezon(b.dataset.season));
    });
}

function zmienSezon(id) {
    if (id === sezon) return;
    sezon = id;
    renderSeasons();
    renderDeptRows();

    // otwarty dzial zostawiamy, o ile w nowym sezonie w ogole istnieje
    const widok = document.getElementById('team-open');
    if (widok && !widok.hidden) {
        if (widok.dataset.dept && wDziale(widok.dataset.dept).length) renderGrid(widok.dataset.dept);
        else zamknijDzial();
    }
    odswiezLicznik();
}

function odswiezLicznik() {
    const total = document.getElementById('team-total');
    if (total) total.textContent = sklad().length;
}

/* ------------------------------------------------------- rzedy i siatka */

// rzedy dzialow: zwiniete pokazuja stosik kart, po najechaniu rozkladaja sie
function renderDeptRows() {
    const wrap = document.getElementById('dept-rows');
    if (!wrap) return;

    const depts = window.WUT_DEPT_FILTERS.filter(f => f.id !== 'all' && wDziale(f.id).length > 0);

    wrap.innerHTML = depts.map(f => {
        const label = t('dept.' + f.id, f.label);
        // do stosiku tylko osoby, ktore maja wlasne zdjecie - placeholder
        // w miniaturze wyglada zle; gdyby takich nie bylo, bierzemy kogokolwiek
        const brakZdjecia = biezacy() ? (window.WUT_NO_PHOTO || []) : [];
        const ludzie = wDziale(f.id);
        const zeZdjeciem = ludzie.filter(m => brakZdjecia.indexOf(m.slug) === -1);
        const pula = zeZdjeciem.length ? zeZdjeciem : ludzie;

        // najwyzej postawiony na wierzchu; przy rownej randze wpierw oznaczeni "thumb"
        const kolejnosc = pula
            .map((m, idx) => ({ m, idx }))
            .sort((a, b) =>
                ranga(a.m) - ranga(b.m) ||
                (b.m.thumb ? 1 : 0) - (a.m.thumb ? 1 : 0) ||
                a.idx - b.idx)
            .map(x => x.m);

        const karty = kolejnosc.slice(0, 3).map((m, i) => `
            <span class="dept-card" style="--i:${i}">
                <img src="${zdjecie(m)}" alt=""
                     onerror="this.onerror=null;this.src='${zastepcze(m)}';"
                     loading="lazy">
                <span class="dept-card-name">${m.name}</span>
            </span>`).join('');

        return `
        <button class="dept-row" type="button" data-dept="${f.id}" aria-label="${label}">
            <span class="dept-row-panel" aria-hidden="true"></span>
            <span class="dept-row-name">${label}</span>
            <span class="dept-row-cards">${karty}</span>
            <span class="dept-row-go" aria-hidden="true"><span class="dept-row-arrow"></span></span>
        </button>`;
    }).join('');

    wrap.querySelectorAll('.dept-row').forEach(row => {
        row.addEventListener('click', () => otworzDzial(row.dataset.dept));
    });
}

function otworzDzial(dept) {
    const widok = document.getElementById('team-open');
    const tytul = document.getElementById('team-open-title');
    if (!widok) return;
    const f = window.WUT_DEPT_FILTERS.find(x => x.id === dept);
    if (tytul && f) tytul.textContent = t('dept.' + dept, f.label);
    widok.hidden = false;
    widok.dataset.dept = dept;
    renderGrid(dept);
    widok.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function zamknijDzial() {
    const widok = document.getElementById('team-open');
    if (!widok) return;
    const rows = document.getElementById('dept-rows');
    widok.hidden = true;
    if (rows) rows.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderGrid(filter = 'all') {
    const grid = document.getElementById('team-grid');
    const wybrani = filter === 'all' ? sklad() : wDziale(filter);

    // najpierw koordynator, potem zastepca, dalej czlonkowie w kolejnosci z danych
    const list = wybrani
        .map((m, idx) => ({ m, idx }))
        .sort((a, b) => ranga(a.m) - ranga(b.m) || a.idx - b.idx)
        .map(x => x.m);
    const moreLabel = t('team.more', 'Pokaż więcej');
    const lessLabel = t('team.less', 'Pokaż mniej');
    const emailLabel = t('team.email', 'Pokaż e-mail');
    const noneLabel = t('team.none', 'brak');
    const compLabel = t('team.competitions', 'Zawody');
    const projLabel = t('team.projects', 'Projekty');

    // opisy, zawody i maile mamy tylko dla obecnego skladu - archiwalne karty
    // sa jednostronne, bo poza nazwiskiem i funkcja nie ma o nich zadnych danych
    const zRewersem = biezacy();
    grid.classList.toggle('is-archive', !zRewersem);

    grid.innerHTML = list.map((m, i) => {
        const role = roleLabel(m);

        const front = `
                <div class="member-face member-face-front">
                    <div class="member-photo">
                        <img src="${zdjecie(m)}"
                             onerror="this.onerror=null;this.src='${zastepcze(m)}';this.classList.add('is-placeholder');"
                             alt="${m.name}" loading="lazy">
                        ${zRewersem ? '<span class="arrow" aria-hidden="true">↻</span>' : ''}
                    </div>
                    <div class="member-info">
                        <div class="member-name">${m.name}</div>
                        <div class="member-role">${role}</div>
                    </div>
                </div>`;

        if (!zRewersem) {
            return `
        <div class="member-card member-card-flat reveal" data-slug="${m.slug}" data-delay="${(i % 4) + 1}">
            <div class="member-card-inner">${front}</div>
        </div>`;
        }

        const email = window.WUT_getEmail(m);
        const hasBio = !!m.bio;
        const ach = m.achievements || [];
        const proj = m.projects || [];

        // przy krotkim opisie pierwsze zdanie to caly opis - przycisk nie ma czego pokazac
        const opisSkrocony = hasBio ? firstSentence(m.bio) : '';
        const opisDluzszy = hasBio && opisSkrocony.trim() !== m.bio.trim();

        const bioBlock = !hasBio
            ? `<p class="member-back-bio member-back-none">${noneLabel}</p>`
            : (opisDluzszy ? `
            <p class="member-back-bio member-bio-short">${opisSkrocony}</p>
            <p class="member-back-bio member-bio-full">${m.bio}</p>
            <button class="member-back-more glass-btn" type="button">${moreLabel}</button>
        ` : `<p class="member-back-bio">${m.bio}</p>`);

        // przy dluzszej liscie zawodow karta sie rozpychala - widac dwa, reszta pod przyciskiem
        const achPozycja = (a, extra) =>
            `<li${extra ? ' class="ach-extra"' : ''}><span class="year">${a.year}</span><span>${a.text}</span></li>`;
        const achBlock = ach.length ? `
            <div class="member-back-section">
                <div class="member-back-title">${compLabel}</div>
                <ul class="member-back-list">
                    ${ach.slice(0, 2).map(a => achPozycja(a, false)).join('')}
                    ${ach.slice(2).map(a => achPozycja(a, true)).join('')}
                </ul>
                ${ach.length > 2
                    ? `<button class="member-back-more-ach glass-btn" type="button">${moreLabel}</button>`
                    : ''}
            </div>` : '';

        const projBlock = proj.length ? `
            <div class="member-back-section">
                <div class="member-back-title">${projLabel}</div>
                <ul class="member-back-list member-back-projects">
                    ${proj.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>` : '';

        return `
        <div class="member-card reveal" data-slug="${m.slug}" data-delay="${(i % 4) + 1}" role="button" tabindex="0" aria-label="${m.name}">
            <div class="member-card-inner">
${front}
                <div class="member-face member-face-back">
                    <div class="member-back-scroll">
                        <div class="member-back-top">
                            <h3 class="member-back-name">${m.name}</h3>
                            <div class="member-back-role">${role}</div>
                        </div>

                        ${bioBlock}
                        ${achBlock}
                        ${projBlock}

                        <div class="member-back-actions">
                            <button class="member-back-email glass-btn" type="button">${emailLabel}</button>
                        </div>
                        <a class="member-back-mail" href="mailto:${email}">${email}</a>
                    </div>
                    <span class="arrow arrow-back" aria-hidden="true">↻</span>
                </div>

            </div>
        </div>`;
    }).join('');

    document.querySelectorAll('#team-grid .reveal').forEach(el => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.1 });
        io.observe(el);
    });

    if (!zRewersem) return;

    grid.querySelectorAll('.member-card').forEach(card => {
        const handleToggle = (e) => {
            e.stopPropagation();

            if (e.target.closest('.member-back-email')) {
                card.querySelector('.member-face-back').classList.toggle('mail-shown');
                return;
            }
            if (e.target.closest('.member-back-more-ach')) {
                const back = card.querySelector('.member-face-back');
                const btn = card.querySelector('.member-back-more-ach');
                back.classList.toggle('ach-expanded');
                btn.textContent = back.classList.contains('ach-expanded') ? lessLabel : moreLabel;
                return;
            }
            if (e.target.closest('.member-back-more')) {
                const back = card.querySelector('.member-face-back');
                const btn = card.querySelector('.member-back-more');
                back.classList.toggle('bio-expanded');
                btn.textContent = back.classList.contains('bio-expanded') ? lessLabel : moreLabel;
                return;
            }
            if (e.target.closest('.member-back-mail')) return;

            if (card.classList.contains('is-flipped')) {
                unflipCard(card);
            } else {
                flipCard(card);
            }
        };
        card.addEventListener('click', handleToggle);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle(e);
            }
        });
    });
}

function flipCard(card) {
    if (card.classList.contains('is-flipped')) return;
    document.querySelectorAll('.member-card.is-flipped').forEach(c => unflipCard(c));
    card.classList.add('is-flipped');
    const inner = card.querySelector('.member-card-inner');
    if (inner) inner.classList.add('flipped');
}

function unflipCard(card) {
    card.classList.remove('is-flipped');
    const inner = card.querySelector('.member-card-inner');
    if (inner) inner.classList.remove('flipped');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const flipped = document.querySelector('.member-card.is-flipped');
        if (flipped) unflipCard(flipped);
    }
});

document.addEventListener('click', (e) => {
    const flipped = document.querySelector('.member-card.is-flipped');
    if (flipped && !flipped.contains(e.target)) {
        unflipCard(flipped);
    }
});

window.WUT_renderTeam = function () {
    const widok = document.getElementById('team-open');
    renderSeasons();
    renderDeptRows();
    if (widok && !widok.hidden && widok.dataset.dept) {
        const f = window.WUT_DEPT_FILTERS.find(x => x.id === widok.dataset.dept);
        const tytul = document.getElementById('team-open-title');
        if (tytul && f) tytul.textContent = t('dept.' + widok.dataset.dept, f.label);
        renderGrid(widok.dataset.dept);
    }
    odswiezLicznik();
};

document.addEventListener('DOMContentLoaded', () => {
    renderSeasons();
    renderDeptRows();
    const back = document.getElementById('team-open-back');
    if (back) back.addEventListener('click', zamknijDzial);
    odswiezLicznik();
});
