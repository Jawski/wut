// fallbackowy opis kiedy ktos nie wypelnil bio
function deptStory(m) {
    if (m.bio) return m.bio;
    const name = m.name.split(' ')[0];
    const yr = m.since || (2022 + (m.slug.charCodeAt(0) % 4));
    const tpls = {
        zarzad:      `Po kilku sezonach w dzialach inzynierskich ${name} przejmuje stery zespolu w roli lidera, koordynujac prace ~120 osob, budzet i plan startow.`,
        aero:        `${name} dolaczyl(a) do dzialu Aerodynamiki w sezonie ${yr}. Spedzil(a) setki godzin nad symulacjami CFD bolidu i wyklejaniem skrzydel z karbonu w autoklawie.`,
        chassis:     `Bez ramy i monokoku nie ma bolidu. ${name} buduje je od podstaw. Spawanie 25CrMo4 TIG, laminowanie karbonu, montaz paneli i piast.`,
        suspension:  `${name} odpowiada za zawieszenie. Geometria push-rod, dobor amortyzatorow i sesje testowe na torze, ktore decyduja o tym jak bolid prowadzi sie w zakretach.`,
        electronics: `${name} jest jednym z mozgow elektroniki. Projektuje PCB, programuje STM32 i pracuje nad telemetria CAN bus. Sezon ${yr} to wejscie w stack embedded.`,
        engine:      `Dzial Silnikowy to twarda inzynieria. Silnik, uklad wydechowy, skrzynia. ${name} odpowiada za optymalizacje jednostki KTM 690 LC4.`,
        pr:          `${name} buduje wizerunek WUT Racing. Social media, materialy promocyjne, kontakt z mediami i obsluga eventow dla sponsorow.`,
        logistics:   `${name} odpowiada za logistyke: transport bolidu i zespolu na zawody, koordynacje wyjazdow, organizacje eventow na uczelni.`,
        fundraising: `Bez budzetu nie ma bolidu. ${name} odpowiada za pozyskiwanie sponsorow, przygotowanie pakietow sponsorskich i Cost Report na zawodach.`,
    };
    return tpls[m.dept] || `${name} jest aktywnym czlonkiem WUT Racing od sezonu ${yr}.`;
}

function deptAchievements(m) {
    if (m.achievements) return m.achievements;
    const yr = m.since || 2024;
    const what = {
        aero: 'CFD', chassis: 'monokok', suspension: 'zawieszenie', electronics: 'PCB',
        engine: 'silnik', pr: 'kampania', logistics: 'wyjazd', fundraising: 'sponsor', zarzad: 'zespol',
    }[m.dept] || 'WUT';
    return [
        { year: 2026, text: `Aktywny udzial w pracach nad WUT6 (${what}).` },
        { year: 2025, text: `Reprezentowal(a) WUT Racing na zawodach FS.` },
        { year: yr,   text: `Dolaczenie do zespolu, dzial ${window.WUT_getDeptLabel(m)}.` },
    ];
}

function deptProjects(m) {
    if (m.projects) return m.projects;
    return window.WUT_DEPT_INFO[m.dept] ? window.WUT_DEPT_INFO[m.dept].projectExamples : [];
}

function firstSentence(text) {
    const m = text.match(/^[^.!?]+[.!?]/);
    if (m) return m[0].trim();
    const words = text.split(/\s+/);
    return words.length <= 16 ? text : words.slice(0, 16).join(' ') + '...';
}

function renderFilters() {
    const wrap = document.getElementById('team-filter');
    const counts = {};
    window.WUT_TEAM.forEach(m => { counts[m.dept] = (counts[m.dept] || 0) + 1; });
    const visible = window.WUT_DEPT_FILTERS.filter(f => f.id === 'all' || counts[f.id] > 0);

    wrap.innerHTML = visible.map(f => {
        const n = f.id === 'all' ? window.WUT_TEAM.length : (counts[f.id] || 0);
        return `<button data-filter="${f.id}" ${f.id === 'all' ? 'class="active"' : ''}>${f.label} <span style="opacity:0.5;margin-left:6px;">${n}</span></button>`;
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

    grid.innerHTML = list.map((m, i) => {
        const dept = window.WUT_getDeptLabel(m);
        const role = window.WUT_getRole(m);
        const bio = deptStory(m);
        const achievements = deptAchievements(m).slice(0, 3);
        const projects = deptProjects(m).slice(0, 2);
        const since = m.since || '2023+';
        const studies = m.studies || 'PW · SiMR';

        return `
        <div class="member-card reveal" data-slug="${m.slug}" data-delay="${(i % 4) + 1}" role="button" tabindex="0" aria-label="${m.name}">
            <div class="member-card-inner">

                <div class="member-face member-face-front">
                    <div class="member-photo">
                        <span class="role-tag">${dept}</span>
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
                        <span class="role-tag">${dept}</span>
                        <h3 class="member-back-name">${m.name}</h3>
                        <div class="member-back-role">${role}</div>
                    </div>

                    <div class="member-back-compact">
                        <div class="member-back-meta">
                            <div><span class="lbl">Od</span><span class="val">${since}</span></div>
                            <div><span class="lbl">Studia</span><span class="val">${studies}</span></div>
                        </div>

                        <p class="member-back-bio member-back-bio-short">${firstSentence(bio)}</p>
                        <button class="member-back-more" type="button" data-action="expand">Pokaz wiecej</button>

                        ${achievements.length ? `
                        <div class="member-back-section">
                            <div class="member-back-title">Zawody</div>
                            <ul class="member-back-list">
                                ${achievements.map(a => `<li><span class="year">${a.year}</span><span>${a.text}</span></li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}

                        ${projects.length ? `
                        <div class="member-back-section">
                            <div class="member-back-title">Projekty</div>
                            <ul class="member-back-list member-back-projects">
                                ${projects.map(p => `<li>${p}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>

                    <div class="member-back-full">
                        <p class="member-back-bio">${bio}</p>
                        <button class="member-back-more" type="button" data-action="collapse">Pokaz mniej</button>
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

            const moreBtn = e.target.closest('.member-back-more');
            if (moreBtn) {
                const back = card.querySelector('.member-face-back');
                if (back) back.classList.toggle('bio-expanded');
                return;
            }

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

document.addEventListener('DOMContentLoaded', () => {
    renderFilters();
    renderGrid('all');
    const total = document.getElementById('team-total');
    if (total) total.textContent = window.WUT_TEAM.length;
});
