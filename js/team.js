/* ============================================
   Team grid — karty z flip-on-click + grow-to-center.
   Front = zdjęcie + nazwisko + rola.
   Back = pełne info (bio, osiągnięcia, projekty, dział).
   ============================================ */

// ---- helpery: domyślna treść back face per dział ----
function deptStory(m) {
    if (m.bio) return m.bio;
    const name = m.name.split(' ')[0];
    const yr = m.since || (2022 + (m.slug.charCodeAt(0) % 4));
    const tpls = {
        zarzad:      `Po kilku sezonach w działach inżynierskich ${name} przejmuje stery zespołu w roli lidera, koordynując pracę ~120 osób, budżet i plan startów.`,
        aero:        `${name} dołączył(a) do działu Aerodynamiki w sezonie ${yr}. Spędził(a) setki godzin nad symulacjami CFD bolidu i wyklejaniem skrzydeł z karbonu w autoklawie.`,
        chassis:     `Bez ramy i monokoku nie ma bolidu — ${name} buduje je od podstaw. Spawanie 25CrMo4 TIG, laminowanie karbonu, montaż paneli i piast.`,
        suspension:  `${name} odpowiada za zawieszenie — geometria push-rod, dobór amortyzatorów i sesje testowe na torze, które decydują o tym jak bolid prowadzi się w zakrętach.`,
        electronics: `${name} jest jednym z mózgów elektroniki. Projektuje PCB, programuje STM32 i pracuje nad telemetrią CAN bus. Sezon ${yr} to wejście w stack embedded.`,
        engine:      `Dział Silnikowy to "twarda" inżynieria — silnik, układ wydechowy, skrzynia. ${name} odpowiada za optymalizację jednostki KTM 690 LC4.`,
        pr:          `${name} buduje wizerunek WUT Racing — social media, materiały promocyjne, kontakt z mediami i obsługa eventów dla sponsorów.`,
        logistics:   `${name} odpowiada za logistykę: transport bolidu i zespołu na zawody, koordynację wyjazdów, organizację eventów na uczelni.`,
        fundraising: `Bez budżetu nie ma bolidu. ${name} odpowiada za pozyskiwanie sponsorów, przygotowanie pakietów sponsorskich i Cost Report na zawodach.`,
    };
    return tpls[m.dept] || `${name} jest aktywnym członkiem WUT Racing od sezonu ${yr}.`;
}

function deptAchievements(m) {
    if (m.achievements) return m.achievements;
    const yr = m.since || 2024;
    const what = {
        aero: 'CFD', chassis: 'monokok', suspension: 'zawieszenie', electronics: 'PCB',
        engine: 'silnik', pr: 'kampania', logistics: 'wyjazd', fundraising: 'sponsor', zarzad: 'zespół',
    }[m.dept] || 'WUT';
    return [
        { year: 2026, text: `Aktywny udział w pracach nad WUT6 (${what}).` },
        { year: 2025, text: `Reprezentował(a) WUT Racing na zawodach FS.` },
        { year: yr,   text: `Dołączenie do zespołu, dział ${window.WUT_getDeptLabel(m)}.` },
    ];
}

function deptProjects(m) {
    if (m.projects) return m.projects;
    return window.WUT_DEPT_INFO[m.dept] ? window.WUT_DEPT_INFO[m.dept].projectExamples : [];
}

// pierwsze zdanie z biografii (do . ! lub ?), z fallbackiem na pierwsze ~16 słów
function firstSentence(text) {
    const m = text.match(/^[^.!?]+[.!?]/);
    if (m) return m[0].trim();
    const words = text.split(/\s+/);
    return words.length <= 16 ? text : words.slice(0, 16).join(' ') + '…';
}

// ============================================
// FILTRY
// ============================================
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

// ============================================
// GRID z kart front+back
// ============================================
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
        <div class="member-card reveal" data-slug="${m.slug}" data-delay="${(i % 4) + 1}" role="button" tabindex="0" aria-label="${m.name} — kliknij aby zobaczyć profil">
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
                        <button class="member-back-more" type="button" data-action="expand">Pokaż więcej →</button>

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
                        <button class="member-back-more" type="button" data-action="collapse">← Pokaż mniej</button>
                    </div>

                    <span class="arrow arrow-back" aria-hidden="true">↻</span>
                </div>

            </div>
        </div>`;
    }).join('');

    // reveal observer
    document.querySelectorAll('#team-grid .reveal').forEach(el => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.1 });
        io.observe(el);
    });

    // flip handlery — klik toggluje stronę karty
    grid.querySelectorAll('.member-card').forEach(card => {
        const handleToggle = (e) => {
            e.stopPropagation();

            // klik na "Pokaż więcej/mniej" → toggle bio expand, nie zamykaj karty
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
        // keyboard a11y — Enter / Space toggluje
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle(e);
            }
        });
    });
}

// ============================================
// FLIP CARD — w miejscu, bez powiększania.
// Klik = karta obraca się 180° w tym samym rozmiarze co przód.
// ============================================
function flipCard(card) {
    if (card.classList.contains('is-flipped')) return;
    // zamknij inne otwarte karty
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

// zamknięcie Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const flipped = document.querySelector('.member-card.is-flipped');
        if (flipped) unflipCard(flipped);
    }
});

// zamknięcie klikiem poza otwartą kartą
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
