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
    'Koordynator': 'Coordinator',
    'Zastępca koordynatora': 'Deputy coordinator',
    'Fotograf': 'Photographer',
    'Członek zarządu': 'Board member',
    'Inżynier aerodynamiki': 'Aerodynamics engineer',
    'Inżynier nadwozia': 'Chassis engineer',
    'Inżynier zawieszenia': 'Suspension engineer',
    'Inżynier elektroniki': 'Electronics engineer',
    'Inżynier silnika': 'Engine engineer',
    'Dział PR': 'PR',
    'Dział logistyki': 'Logistics',
};
function roleLabel(m) {
    const pl = window.WUT_getRole(m);
    return (window.WUT_LANG === 'en' && ROLE_EN[pl]) ? ROLE_EN[pl] : pl;
}
function deptLabel(m) {
    return t('dept.' + m.dept, window.WUT_getDeptLabel(m));
}

// rzedy dzialow: zwiniete pokazuja stosik kart, po najechaniu rozkladaja sie
function renderDeptRows() {
    const wrap = document.getElementById('dept-rows');
    if (!wrap) return;

    const counts = {};
    window.WUT_TEAM.forEach(m => { counts[m.dept] = (counts[m.dept] || 0) + 1; });
    const depts = window.WUT_DEPT_FILTERS.filter(f => f.id !== 'all' && counts[f.id] > 0);

    wrap.innerHTML = depts.map(f => {
        const label = t('dept.' + f.id, f.label);
        // do stosiku bierzemy pierwsze osoby z dzialu
        const karty = window.WUT_TEAM.filter(m => m.dept === f.id).slice(0, 3).map((m, i) => `
            <span class="dept-card" style="--i:${i}">
                <img src="assets/team/${m.slug}.jpg" alt=""
                     onerror="this.onerror=null;this.src='assets/team/${m.f ? '_placeholder_f' : '_placeholder'}.jpg';"
                     loading="lazy">
                <span class="dept-card-name">${m.name}</span>
            </span>`).join('');

        return `
        <button class="dept-row" type="button" data-dept="${f.id}" aria-label="${label}">
            <span class="dept-row-panel" aria-hidden="true"></span>
            <span class="dept-row-name">${label}</span>
            <span class="dept-row-cards">${karty}</span>
            <span class="dept-row-go" aria-hidden="true"><span class="dept-row-arrow"></span></span>
            <span class="dept-row-count">${counts[f.id]}</span>
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
    const list = filter === 'all' ? window.WUT_TEAM : window.WUT_TEAM.filter(m => m.dept === filter);
    const moreLabel = t('team.more', 'Pokaż więcej');
    const lessLabel = t('team.less', 'Pokaż mniej');
    const emailLabel = t('team.email', 'Pokaż e-mail');
    const noneLabel = t('team.none', 'brak');
    const compLabel = t('team.competitions', 'Zawody');
    const projLabel = t('team.projects', 'Projekty');

    grid.innerHTML = list.map((m, i) => {
        const dept = deptLabel(m);
        const role = roleLabel(m);
        const email = window.WUT_getEmail(m);
        const hasBio = !!m.bio;
        const ach = m.achievements || [];
        const proj = m.projects || [];

        const bioBlock = hasBio ? `
            <p class="member-back-bio member-bio-short">${firstSentence(m.bio)}</p>
            <p class="member-back-bio member-bio-full">${m.bio}</p>
            <button class="member-back-more glass-btn" type="button">${moreLabel}</button>
        ` : `<p class="member-back-bio member-back-none">${noneLabel}</p>`;

        const achBlock = ach.length ? `
            <div class="member-back-section">
                <div class="member-back-title">${compLabel}</div>
                <ul class="member-back-list">
                    ${ach.map(a => `<li><span class="year">${a.year}</span><span>${a.text}</span></li>`).join('')}
                </ul>
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

                <div class="member-face member-face-front">
                    <div class="member-photo">
                        <img src="assets/team/${m.slug}.jpg"
                             onerror="this.onerror=null;this.src='assets/team/${m.f ? '_placeholder_f' : '_placeholder'}.jpg';this.classList.add('is-placeholder');"
                             alt="${m.name}" loading="lazy">
                        <span class="arrow" aria-hidden="true">↻</span>
                    </div>
                    <div class="member-info">
                        <div class="member-name">${m.name}</div>
                        <div class="member-role">${role}</div>
                    </div>
                </div>

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

    grid.querySelectorAll('.member-card').forEach(card => {
        const handleToggle = (e) => {
            e.stopPropagation();

            if (e.target.closest('.member-back-email')) {
                card.querySelector('.member-face-back').classList.toggle('mail-shown');
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
    renderDeptRows();
    if (widok && !widok.hidden && widok.dataset.dept) {
        const f = window.WUT_DEPT_FILTERS.find(x => x.id === widok.dataset.dept);
        const tytul = document.getElementById('team-open-title');
        if (tytul && f) tytul.textContent = t('dept.' + widok.dataset.dept, f.label);
        renderGrid(widok.dataset.dept);
    }
    const total = document.getElementById('team-total');
    if (total) total.textContent = window.WUT_TEAM.length;
};

document.addEventListener('DOMContentLoaded', () => {
    renderDeptRows();
    const back = document.getElementById('team-open-back');
    if (back) back.addEventListener('click', zamknijDzial);
    const total = document.getElementById('team-total');
    if (total) total.textContent = window.WUT_TEAM.length;
});
