// opis fallback per dzial (uzywany na rewersie karty), zalezny od jezyka
function deptStory(m) {
    const name = m.name.split(' ')[0];
    const lang = window.WUT_LANG || 'pl';
    const pl = {
        zarzad:      `${name} wchodzi w skład zarządu WUT Racing, koordynując pracę zespołu, budżet oraz plan startów w sezonie.`,
        aero:        `${name} działa w dziale aerodynamiki — projektuje i optymalizuje elementy nadwozia, prowadzi symulacje CFD i wytwarza komponenty z kompozytów.`,
        chassis:     `${name} działa w dziale chassis — projektuje i buduje monocoque oraz ramę, prowadzi analizy wytrzymałościowe MES i wytwarza elementy kompozytowe.`,
        suspension:  `${name} działa w dziale zawieszenia — prowadzi obliczenia, symulacje i testy, projektuje części w CAD oraz dobiera parametry układu jezdnego.`,
        electronics: `${name} działa w dziale elektroniki — projektuje systemy elektryczne i elektroniczne, sterowanie pracą silnika oraz akwizycję danych z bolidu.`,
        engine:      `${name} działa w dziale silnika — projektuje i modyfikuje układy napędowe, zajmuje się mapowaniem silnika i optymalizacją zużycia paliwa.`,
        pr:          `${name} działa w dziale PR — kreuje wizerunek WUT Racing, koordynuje działania medialne i promocję wydarzeń, w których bierze udział team.`,
        logistics:   `${name} działa w dziale logistyki — organizuje wyjazdy zagraniczne koła, transport bolidu i zespołu oraz obecność na targach i eventach.`,
    };
    const en = {
        zarzad:      `${name} is a member of the WUT Racing board, coordinating the team's work, budget and competition schedule.`,
        aero:        `${name} works in the aerodynamics department — designs and optimises bodywork, runs CFD simulations and manufactures composite parts.`,
        chassis:     `${name} works in the chassis department — designs and builds the monocoque and frame, runs FEA strength analysis and manufactures composite parts.`,
        suspension:  `${name} works in the suspension department — runs calculations, simulations and tests, designs parts in CAD and tunes the running gear.`,
        electronics: `${name} works in the electronics department — designs electrical and electronic systems, engine control and data acquisition from the car.`,
        engine:      `${name} works in the engine department — designs and modifies powertrain systems, handles engine mapping and fuel-consumption optimisation.`,
        pr:          `${name} works in the PR department — shapes the image of WUT Racing and coordinates media activities and event promotion.`,
        logistics:   `${name} works in the logistics department — organises the team's trips abroad, transport of the car and presence at fairs and events.`,
    };
    const tpls = lang === 'en' ? en : pl;
    return tpls[m.dept] || `${name} — WUT Racing.`;
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

function firstSentence(text) {
    const m = text.match(/^[^.!?]+[.!?]/);
    if (m) return m[0].trim();
    const words = text.split(/\s+/);
    return words.length <= 16 ? text : words.slice(0, 16).join(' ') + '...';
}

function t(key, fallback) {
    return (window.WUT_t ? window.WUT_t(key) : null) || fallback;
}

function renderFilters() {
    const wrap = document.getElementById('team-filter');
    const counts = {};
    window.WUT_TEAM.forEach(m => { counts[m.dept] = (counts[m.dept] || 0) + 1; });
    const visible = window.WUT_DEPT_FILTERS.filter(f => f.id === 'all' || counts[f.id] > 0);

    wrap.innerHTML = visible.map(f => {
        const n = f.id === 'all' ? window.WUT_TEAM.length : (counts[f.id] || 0);
        const label = f.id === 'all' ? t('team.all', f.label) : t('dept.' + f.id, f.label);
        return `<button data-filter="${f.id}" ${f.id === 'all' ? 'class="active"' : ''}>${label} <span style="opacity:0.5;margin-left:6px;">${n}</span></button>`;
    }).join('');

    wrap.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        wrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGrid(btn.dataset.filter);
    });
}

function renderGrid(filter = 'all') {
    const grid = document.getElementById('team-grid');
    const list = filter === 'all' ? window.WUT_TEAM : window.WUT_TEAM.filter(m => m.dept === filter);
    const moreLabel = t('team.more', 'Pokaż więcej');
    const lessLabel = t('team.less', 'Pokaż mniej');
    const emailLabel = t('team.email', 'Pokaż e-mail');
    const closeHint = t('team.closeHint', 'kliknij aby zamknąć');

    grid.innerHTML = list.map((m, i) => {
        const dept = deptLabel(m);
        const role = roleLabel(m);
        const bio = deptStory(m);
        const email = window.WUT_getEmail(m);

        return `
        <div class="member-card reveal" data-slug="${m.slug}" data-delay="${(i % 4) + 1}" role="button" tabindex="0" aria-label="${m.name}">
            <div class="member-card-inner">

                <div class="member-face member-face-front">
                    <div class="member-photo">
                        <span class="role-tag glass-tag">${dept}</span>
                        <img src="assets/team/${m.slug}.jpg"
                             onerror="this.onerror=null;this.src='assets/team/_placeholder.jpg';this.classList.add('is-placeholder');"
                             alt="${m.name}" loading="lazy">
                        <span class="arrow" aria-hidden="true">↻</span>
                    </div>
                    <div class="member-info">
                        <div class="member-name">${m.name}</div>
                        <div class="member-role">${role}</div>
                    </div>
                </div>

                <div class="member-face member-face-back">
                    <div class="member-back-top">
                        <span class="role-tag glass-tag">${dept}</span>
                        <h3 class="member-back-name">${m.name}</h3>
                        <div class="member-back-role">${role}</div>
                    </div>

                    <div class="member-back-compact">
                        <p class="member-back-bio member-back-bio-short">${firstSentence(bio)}</p>
                        <div class="member-back-actions">
                            <button class="member-back-more glass-btn" type="button" data-action="expand">${moreLabel}</button>
                            <button class="member-back-email glass-btn" type="button">${emailLabel}</button>
                        </div>
                        <a class="member-back-mail" href="mailto:${email}">${email}</a>
                    </div>

                    <div class="member-back-full">
                        <p class="member-back-bio">${bio}</p>
                        <div class="member-back-actions">
                            <button class="member-back-more glass-btn" type="button" data-action="collapse">${lessLabel}</button>
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
            const moreBtn = e.target.closest('.member-back-more');
            if (moreBtn) {
                const back = card.querySelector('.member-face-back');
                if (back) back.classList.toggle('bio-expanded');
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
    const activeFilter = document.querySelector('#team-filter button.active');
    renderFilters();
    renderGrid(activeFilter ? activeFilter.dataset.filter : 'all');
    const total = document.getElementById('team-total');
    if (total) total.textContent = window.WUT_TEAM.length;
};

document.addEventListener('DOMContentLoaded', () => {
    renderFilters();
    renderGrid('all');
    const total = document.getElementById('team-total');
    if (total) total.textContent = window.WUT_TEAM.length;
});
