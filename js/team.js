/* ============================================
   Team grid + filters.
   Dane są w js/team-data.js (window.WUT_TEAM).
   Karty linkują do czlonek.html?id=<slug>.
   ============================================ */

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

    grid.innerHTML = list.map((m, i) => `
        <a class="member-card reveal" href="czlonek.html?id=${m.slug}" data-delay="${(i % 4) + 1}">
            <div class="member-photo">
                <span class="role-tag">${window.WUT_getDeptLabel(m)}</span>
                <img src="assets/team/${m.slug}.jpg" alt="${m.name}" loading="lazy">
                <span class="arrow">→</span>
            </div>
            <div class="member-info">
                <div class="member-name">${m.name}</div>
                <div class="member-role">${window.WUT_getRole(m)}</div>
            </div>
        </a>
    `).join('');

    document.querySelectorAll('#team-grid .reveal').forEach(el => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
            });
        }, { threshold: 0.1 });
        io.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderFilters();
    renderGrid('all');
    const total = document.getElementById('team-total');
    if (total) total.textContent = window.WUT_TEAM.length;
});
