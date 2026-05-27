function param(key) {
    return new URLSearchParams(location.search).get(key);
}

function deptStory(m) {
    const dept = m.dept;
    const name = m.name.split(' ')[0];
    const yr = m.since || (2022 + (m.slug.charCodeAt(0) % 4));
    const tpls = {
        zarzad:      `Po kilku sezonach w działach inżynierskich ${name} przejmuje stery zespołu w roli lidera, koordynując pracę ~120 osób, budżet i plan startów. Łączy doświadczenie projektowe z umiejętnościami menedżerskimi i kontaktem z partnerami przemysłowymi.`,
        aero:        `${name} dołączył(a) do działu Aero w WUT Racing w sezonie ${yr}. Spędził(a) setki godzin nad symulacjami CFD bolidu i wyklejaniem skrzydeł z karbonu w autoklawie sponsora. Najbardziej dumny(a) jest z udziału w projekcie trzyelementowego splittera WUT6.`,
        powertrain:  `Dział Powertrain to "twarda" inżynieria — silnik, układ wydechowy, skrzynia. ${name} odpowiada za optymalizację jednostki napędowej KTM 690 LC4: kalibracje map ECU, modyfikacje wlotu i konstrukcję układu wydechowego ze stali nierdzewnej.`,
        electronics: `${name} jest jednym z mózgów elektroniki WUT Racing. Projektuje PCB, programuje mikrokontrolery STM32 i pracuje nad systemem telemetrii w czasie rzeczywistym po szynie CAN bus. Sezon ${yr} to pełne wejście w stack embedded.`,
        chassis:     `Bez ramy nie ma bolidu — ${name} buduje go od podstaw w dziale Chassis. Spawanie 25CrMo4 metodą TIG, optymalizacja geometrii zawieszenia push-rod, montaż piast 7075-T6 — to codzienność w sezonie ${yr}.`,
        composites:  `${name} pracuje w dziale Kompozyty — laminuje karbonowe elementy aero i panele kokpitu w autoklawie. Każdy gram redukcji masy to ułamek sekundy szybciej na okrążeniu. Pasja do materiałów zaawansowanych.`,
        business:    `Bez budżetu nie ma bolidu. ${name} odpowiada w dziale Business za pozyskiwanie sponsorów, Cost Report na zawodach i komunikację z partnerami. W sezonie ${yr} przyczynił(a) się do wzrostu budżetu zespołu o dwucyfrowy procent.`,
        driver:      `${name} jest jednym z kierowców WUT Racing. Setki kilometrów testowych na torze, sesje analizy danych z każdej rundy, ścisła współpraca z inżynierami nad setupem. Walczy o czasy z najlepszymi zespołami Europy.`,
    };
    return tpls[dept] || `${name} jest aktywnym członkiem WUT Racing od sezonu ${yr}.`;
}

function deptAchievements(m) {
    if (m.achievements) return m.achievements;
    // Generic per-dept achievements
    const yr = m.since || 2024;
    const by = { aero: 'CFD', powertrain: 'silnik', electronics: 'PCB', chassis: 'rama', composites: 'kompozyty', business: 'kontrakty', driver: 'tor', zarzad: 'zespół' }[m.dept] || 'WUT';
    return [
        { year: 2026, text: `Aktywny udział w pracach nad bolidem WUT6 (${by}).` },
        { year: 2025, text: `Reprezentował(a) WUT Racing na zawodach Formula Student.` },
        { year: yr, text: `Dołączenie do zespołu WUT Racing — dział ${window.WUT_getDeptLabel(m)}.` },
    ];
}

function deptProjects(m) {
    if (m.projects) return m.projects;
    return window.WUT_DEPT_INFO[m.dept] ? window.WUT_DEPT_INFO[m.dept].projectExamples : [];
}

function deptEvents(m) {
    if (m.events) return m.events;
    // generic recent events
    return [
        { year: 2025, name: 'Formula Student Czech', loc: 'Most', flag: '🇨🇿' },
        { year: 2025, name: 'Formula Student East',  loc: 'Hungaroring', flag: '🇭🇺' },
        { year: 2024, name: 'Formula Student Germany', loc: 'Hockenheimring', flag: '🇩🇪' },
    ];
}

function render(m) {
    document.title = `${m.name} — WUT Racing`;
    const role = window.WUT_getRole(m);
    const deptLbl = window.WUT_getDeptLabel(m);
    const firstname = m.name.split(' ')[0];

    document.getElementById('prof-img').src = `assets/team/${m.slug}.jpg`;
    document.getElementById('prof-img').alt = m.name;
    document.getElementById('prof-dept-tag').textContent = deptLbl;
    document.getElementById('prof-role-eyebrow').textContent = role;
    document.getElementById('prof-name').textContent = m.name;
    document.getElementById('prof-firstname').textContent = firstname;
    document.getElementById('prof-summary').textContent = `${role} w zespole WUT Racing. Student${m.name.endsWith('a') ? 'ka' : ''} Politechniki Warszawskiej.`;

    document.getElementById('prof-dept').textContent = deptLbl;
    document.getElementById('prof-since').textContent = m.since || '2023+';
    document.getElementById('prof-studies').textContent = m.studies || 'PW · SiMR';

    document.getElementById('prof-bio-text').textContent = m.bio || deptStory(m);

    // Achievements
    const achList = deptAchievements(m);
    document.getElementById('prof-achievements').innerHTML = achList.map(a =>
        `<li><span class="year">${a.year}</span><span>${a.text}</span></li>`
    ).join('');

    // Projects
    const projs = deptProjects(m);
    document.getElementById('prof-projects').innerHTML = projs.map((p, i) => `
        <div class="project-card reveal" data-delay="${(i % 3) + 1}">
            <div class="project-num">/ ${String(i + 1).padStart(2, '0')}</div>
            <div class="project-title">${p}</div>
        </div>
    `).join('');

    // Events
    const evs = deptEvents(m);
    document.getElementById('prof-events').innerHTML = evs.map((e, i) => `
        <div class="event-card reveal" data-delay="${(i % 3) + 1}">
            <div class="event-year">${e.year}</div>
            <div class="event-body">
                <h3>${e.name}</h3>
                <div class="event-meta">${e.loc}</div>
            </div>
            <div class="event-flag">${e.flag}</div>
        </div>
    `).join('');

    // Related members (same dept, exclude current, max 4)
    const related = window.WUT_TEAM.filter(x => x.dept === m.dept && x.slug !== m.slug).slice(0, 6);
    document.getElementById('prof-related').innerHTML = related.map((r, i) => `
        <a href="czlonek.html?id=${r.slug}" class="related-card reveal" data-delay="${(i % 3) + 1}">
            <img src="assets/team/${r.slug}.jpg" alt="${r.name}" loading="lazy">
            <div class="related-info">
                <div class="related-name">${r.name}</div>
                <div class="related-role">${window.WUT_getRole(r)}</div>
            </div>
        </a>
    `).join('');

    // Activate reveal observer for newly inserted nodes
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.classList.contains('is-in')) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.1 });
        io.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const id = param('id');
    const m = (window.WUT_TEAM || []).find(x => x.slug === id);
    if (!m) {
        document.querySelector('.profile-hero').innerHTML = `
            <div class="profile-hero-inner" style="text-align: center; padding: 80px 0;">
                <h1 class="h-2">Nie znaleziono członka.</h1>
                <p class="lead" style="margin: 24px auto 32px;">Profil <code>${id || ''}</code> nie istnieje.</p>
                <a href="zespol.html" class="btn btn-primary btn-arrow">Wróć do zespołu</a>
            </div>
        `;
        return;
    }
    render(m);
});
