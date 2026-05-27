const EVENTS = [
    // 2026
    { year: 2026, name: 'Formula Student Czech', loc: 'Most', country: 'CZ', flag: '🇨🇿', date: 'Sierpień 2026', result: 'Sezon w toku.', car: 'WUT6' },
    { year: 2026, name: 'Formula Student East', loc: 'Hungaroring', country: 'HU', flag: '🇭🇺', date: 'Lipiec 2026', result: 'Sezon w toku.', car: 'WUT6' },
    { year: 2026, name: 'Formula Student Germany', loc: 'Hockenheimring', country: 'DE', flag: '🇩🇪', date: 'Sierpień 2026', result: 'Sezon w toku.', car: 'WUT6' },

    // 2025
    { year: 2025, name: 'Formula Student Czech', loc: 'Most', country: 'CZ', flag: '🇨🇿', date: 'Sierpień 2025', result: '18. miejsce generalne, 5. w Cost Report.', car: 'WUT5' },
    { year: 2025, name: 'Formula Student East', loc: 'Hungaroring', country: 'HU', flag: '🇭🇺', date: 'Lipiec 2025', result: '22. miejsce generalne, najlepszy Autocross w historii koła.', car: 'WUT5' },
    { year: 2025, name: 'Formula Student Alpe Adria', loc: 'Grobnik', country: 'HR', flag: '🇭🇷', date: 'Czerwiec 2025', result: 'Ukończenie Endurance bez awarii.', car: 'WUT5' },

    // 2024
    { year: 2024, name: 'Formula Student Germany', loc: 'Hockenheimring', country: 'DE', flag: '🇩🇪', date: 'Sierpień 2024', result: 'Debiut WUT5 na FSG, 34. miejsce.', car: 'WUT5' },
    { year: 2024, name: 'Formula Student East', loc: 'Hungaroring', country: 'HU', flag: '🇭🇺', date: 'Lipiec 2024', result: '28. miejsce, wyróżnienie za design.', car: 'WUT5' },
    { year: 2024, name: 'Formula Student Czech', loc: 'Most', country: 'CZ', flag: '🇨🇿', date: 'Sierpień 2024', result: '25. miejsce generalne.', car: 'WUT5' },

    // 2023
    { year: 2023, name: 'Formula Student Czech', loc: 'Most', country: 'CZ', flag: '🇨🇿', date: 'Sierpień 2023', result: '21. miejsce, najszybszy Autocross w historii koła.', car: 'WUT5' },
    { year: 2023, name: 'Formula Student East', loc: 'Hungaroring', country: 'HU', flag: '🇭🇺', date: 'Lipiec 2023', result: '26. miejsce generalne, debiut WUT5.', car: 'WUT5' },

    // 2022
    { year: 2022, name: 'Formula Student East', loc: 'Hungaroring', country: 'HU', flag: '🇭🇺', date: 'Lipiec 2022', result: 'Test publiczny WUT5, brak rejestracji generalnej.', car: 'WUT5' },

    // 2021
    { year: 2021, name: 'Formula Student Czech', loc: 'Most', country: 'CZ', flag: '🇨🇿', date: 'Sierpień 2021', result: 'Powrót po pandemii, 30. miejsce.', car: 'WUT4' },

    // 2020 - pandemia, brak zawodów
    { year: 2020, name: 'Sezon anulowany', loc: 'COVID-19', country: '—', flag: '⚠️', date: '2020', result: 'Wszystkie zawody Formula Student odwołane lub przeniesione online.', car: 'WUT4' },

    // 2019
    { year: 2019, name: 'Formula Student Germany', loc: 'Hockenheimring', country: 'DE', flag: '🇩🇪', date: 'Sierpień 2019', result: '38. miejsce generalne, debiut WUT4.', car: 'WUT4' },
    { year: 2019, name: 'Formula Student Czech', loc: 'Most', country: 'CZ', flag: '🇨🇿', date: 'Sierpień 2019', result: '24. miejsce generalne, ukończenie wszystkich konkurencji dynamicznych.', car: 'WUT4' },

    // 2018
    { year: 2018, name: 'Formula Student East', loc: 'Hungaroring', country: 'HU', flag: '🇭🇺', date: 'Lipiec 2018', result: '🏆 3. miejsce w Cost & Manufacturing — pierwsze podium w historii koła!', car: 'WUT3' },
    { year: 2018, name: 'Formula Student Czech', loc: 'Most', country: 'CZ', flag: '🇨🇿', date: 'Sierpień 2018', result: '20. miejsce, wyróżnienie za Manufacturing.', car: 'WUT3' },

    // 2017
    { year: 2017, name: 'Formula Student Germany', loc: 'Hockenheimring', country: 'DE', flag: '🇩🇪', date: 'Sierpień 2017', result: '42. miejsce, debiut WUT3 i pierwszych karbonowych skrzydeł.', car: 'WUT3' },
    { year: 2017, name: 'Formula Student East', loc: 'Hungaroring', country: 'HU', flag: '🇭🇺', date: 'Lipiec 2017', result: '29. miejsce generalne.', car: 'WUT3' },

    // 2016
    { year: 2016, name: 'Formula Student Czech', loc: 'Most', country: 'CZ', flag: '🇨🇿', date: 'Sierpień 2016', result: 'Pierwsze w historii koła ukończenie Endurance!', car: 'WUT2' },
    { year: 2016, name: 'Formula Student East', loc: 'Hungaroring', country: 'HU', flag: '🇭🇺', date: 'Lipiec 2016', result: '34. miejsce generalne.', car: 'WUT2' },

    // 2015
    { year: 2015, name: 'Formula Student Germany', loc: 'Hockenheimring', country: 'DE', flag: '🇩🇪', date: 'Sierpień 2015', result: 'Debiut Hondy CBR — silnik 4-cyl, 45. miejsce.', car: 'WUT2' },
    { year: 2015, name: 'Formula Student Czech', loc: 'Most', country: 'CZ', flag: '🇨🇿', date: 'Sierpień 2015', result: '30. miejsce, ukończenie Autocross.', car: 'WUT2' },

    // 2014
    { year: 2014, name: 'Formula Student Germany', loc: 'Hockenheimring', country: 'DE', flag: '🇩🇪', date: 'Sierpień 2014', result: 'Drugi sezon, 51. miejsce generalne.', car: 'WUT1' },
    { year: 2014, name: 'Formula Student East', loc: 'Hungaroring', country: 'HU', flag: '🇭🇺', date: 'Lipiec 2014', result: '38. miejsce, pierwsze ukończenie Acceleration.', car: 'WUT1' },

    // 2013 - DEBIUT
    { year: 2013, name: 'Formula Student Germany', loc: 'Hockenheimring', country: 'DE', flag: '🇩🇪', date: 'Sierpień 2013', result: '🎖️ Historyczny debiut WUT Racing na arenie międzynarodowej.', car: 'WUT1' },
];

const COUNTRIES = [
    { id: 'all', label: 'Wszystkie' },
    { id: 'DE', label: '🇩🇪 Niemcy' },
    { id: 'HU', label: '🇭🇺 Węgry' },
    { id: 'CZ', label: '🇨🇿 Czechy' },
    { id: 'HR', label: '🇭🇷 Chorwacja' },
];

function renderFilter() {
    const wrap = document.getElementById('events-filter');
    wrap.innerHTML = COUNTRIES.map(c =>
        `<button data-filter="${c.id}" ${c.id === 'all' ? 'class="active"' : ''}>${c.label}</button>`
    ).join('');
    wrap.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        wrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderEvents(btn.dataset.filter);
    });
}

function renderEvents(filter = 'all') {
    const grid = document.getElementById('events-grid');
    const list = filter === 'all' ? EVENTS : EVENTS.filter(e => e.country === filter);

    grid.innerHTML = list.map((e, i) => `
        <div class="event-card reveal" data-delay="${i % 4}">
            <div class="event-year">${e.year}</div>
            <div class="event-body">
                <h3>${e.name}</h3>
                <div class="event-meta">${e.loc} · ${e.date} · ${e.car}</div>
                <div class="event-result">${e.result}</div>
            </div>
            <div class="event-flag">${e.flag}</div>
        </div>
    `).join('');

    // Reveal observer
    document.querySelectorAll('#events-grid .reveal').forEach(el => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.1 });
        io.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderFilter();
    renderEvents('all');
});
