const SOCIAL = [
    { key: 'ig', url: 'https://www.instagram.com/wut.racing/', label: 'Instagram' },
    { key: 'fb', url: 'https://www.facebook.com/WUTRacing', label: 'Facebook' },
    { key: 'in', url: 'https://pl.linkedin.com/company/wutracing', label: 'LinkedIn' },
    { key: 'yt', url: 'https://www.youtube.com/@WUTRacingTeam', label: 'YouTube' },
    { key: 'tt', url: 'https://www.tiktok.com/@wut.racing', label: 'TikTok' },
];

// dwie wersje ikony: biala na spoczynku, kolorowa po najechaniu
const socialLinks = (cls) => SOCIAL.map(s =>
    `<a class="soc ${cls}" href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}" title="${s.label}">
        <img class="soc-off" src="assets/icons/${s.key}.png" alt="" aria-hidden="true">
        <img class="soc-on" src="assets/icons/${s.key}-on.png" alt="" aria-hidden="true">
    </a>`).join('');

const NAV_HTML = `
<nav class="nav is-top" id="nav">
    <div class="nav-inner">
        <button class="menu-btn" aria-label="Menu" aria-expanded="false" id="menu-btn">
            <span class="menu-bars"><i></i><i></i><i></i></span>
        </button>
        <a href="index.html" class="brand" aria-label="WUT Racing">
            <img src="assets/logo-main.png" alt="WUT Racing" class="brand-logo">
        </a>
        <div class="nav-right">
            <div class="nav-social">${socialLinks('nav-soc')}</div>
            <div class="lang-switch" id="lang-switch" role="group" aria-label="Język / Language">
                <button type="button" data-lang="pl" class="active">PL</button>
                <button type="button" data-lang="en">EN</button>
            </div>
        </div>
    </div>
</nav>

<div class="menu-overlay" id="menu-overlay" hidden>
    <div class="menu-overlay-top">
        <button class="menu-close" aria-label="Zamknij menu" id="menu-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M5 5l14 14M19 5L5 19"/>
            </svg>
        </button>
        <img src="assets/logo-main.png" alt="WUT Racing" class="menu-logo">
    </div>
    <nav class="menu-links">
        <a href="index.html" data-page="home" data-i18n="nav.home">Start</a>
        <a href="o-nas.html" data-page="about" data-i18n="nav.about">O nas</a>
        <a href="zespol.html" data-page="team" data-i18n="nav.team">Zespół</a>
        <a href="bolidy.html" data-page="cars" data-i18n="nav.cars">Bolidy</a>
        <a href="sponsorzy.html" data-page="sponsors" data-i18n="nav.sponsors">Sponsorzy</a>
    </nav>
    <div class="menu-social">${socialLinks('menu-soc')}</div>
</div>
<div class="scroll-progress" id="scroll-progress"></div>
`;

const FOOTER_HTML = `
<footer class="footer">
    <div class="footer-inner">
        <div class="footer-grid">
            <div class="footer-col">
                <div class="brand footer-brands">
                    <img src="assets/logo.png" alt="WUT Racing" class="brand-logo brand-logo-footer">
                    <a href="https://www.pw.edu.pl/" target="_blank" rel="noopener"
                       class="pw-link" aria-label="Politechnika Warszawska">
                        <img src="assets/pw-logo.png" alt="Politechnika Warszawska" class="pw-logo"
                             onerror="this.parentElement.remove();">
                    </a>
                </div>
                <p style="margin-top: 18px; max-width: 340px; line-height: 1.6;" data-i18n="footer.about">
                    Koło Naukowe WUT Racing przy Politechnice Warszawskiej. Projektujemy
                    i budujemy bolidy klasy Formula Student.
                </p>
            </div>
            <div class="footer-col">
                <h4 data-i18n="footer.site">Strona</h4>
                <ul>
                    <li><a href="index.html" data-i18n="nav.home">Start</a></li>
                    <li><a href="o-nas.html" data-i18n="nav.about">O nas</a></li>
                    <li><a href="zespol.html" data-i18n="nav.team">Zespół</a></li>
                    <li><a href="bolidy.html" data-i18n="nav.cars">Bolidy</a></li>
                    <li><a href="sponsorzy.html" data-i18n="nav.sponsors">Sponsorzy</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4 data-i18n="footer.contact">Kontakt</h4>
                <ul>
                    <li><a href="mailto:zarzad@wutracing.pl">zarzad@wutracing.pl</a></li>
                    <li>Politechnika Warszawska<br>Wydział Mechaniczny Energetyki i Lotnictwa<br>ul. Nowowiejska 24<br>00-665 Warszawa</li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Social</h4>
                <div class="footer-social">${socialLinks('footer-soc')}</div>
            </div>
        </div>
        <div class="footer-bottom">
            <span>© 2026 WUT Racing · Politechnika Warszawska</span>
            <a class="footer-designed" href="https://pl.linkedin.com/in/jan-oziemski-b3126333b" target="_blank" rel="noopener">
                <img src="assets/javski-logo.png" alt="" class="footer-shield">
                <span class="footer-designed-text">
                    <span class="fd-label">Designed by</span>
                    <span class="fd-name">JAVSKI</span>
                </span>
            </a>
        </div>
    </div>
</footer>
`;

function initNav(activePage) {
    document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
    document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

    const nav = document.getElementById('nav');

    if (activePage) {
        document.querySelectorAll('.menu-links a').forEach(a => {
            if (a.dataset.page === activePage) a.classList.add('active');
        });
    }

    const progress = document.getElementById('scroll-progress');

    // pasek chowa sie przy przewijaniu w dol i wraca przy przewijaniu w gore
    const PROG = 8;          // ile trzeba przewinac, zeby uznac kierunek za zmieniony
    const GORA = 80;         // przy samej gorze pasek jest zawsze widoczny
    let lastY = window.scrollY;
    let schowany = false;

    function pokazPasek(czy) {
        if (schowany === !czy) return;
        schowany = !czy;
        nav.classList.toggle('is-hidden', schowany);
        if (progress) progress.classList.toggle('is-hidden', schowany);
    }

    function onScroll() {
        const y = window.scrollY;
        if (y < 40) nav.classList.add('is-top');
        else nav.classList.remove('is-top');
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (y / max) * 100 : 0;
        if (progress) progress.style.width = pct + '%';

        // lastY przesuwamy dopiero po przekroczeniu progu - inaczej powolne
        // przewijanie nigdy by go nie uzbieralo i pasek by nie reagowal
        const roznica = y - lastY;
        if (y <= GORA) { pokazPasek(true); lastY = y; }
        else if (roznica > PROG) { pokazPasek(false); lastY = y; }
        else if (roznica < -PROG) { pokazPasek(true); lastY = y; }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // schowany pasek nadal da sie zlapac tabulatorem - wtedy musi wrocic na ekran
    nav.addEventListener('focusin', () => pokazPasek(true));

    // pelnoekranowe menu
    const menuBtn = document.getElementById('menu-btn');
    const overlay = document.getElementById('menu-overlay');
    const closeBtn = document.getElementById('menu-close');

    function openMenu() {
        overlay.hidden = false;
        // wymuszone przeliczenie ukladu, zeby przegladarka zdazyla zobaczyc stan
        // zamkniety; bez tego obie wartosci wpadaja w jedna klatke i menu pojawia
        // sie skokiem, bez przenikania i bez wjazdu pozycji
        void overlay.offsetHeight;
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        menuBtn.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        menuBtn.setAttribute('aria-expanded', 'false');
        setTimeout(() => { if (!overlay.classList.contains('is-open')) overlay.hidden = true; }, 500);
    }
    if (menuBtn && overlay) {
        menuBtn.addEventListener('click', openMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        overlay.querySelectorAll('.menu-links a').forEach(a => a.addEventListener('click', closeMenu));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeMenu();
        });
    }

    // przelacznik jezyka
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch && typeof window.WUT_applyLang === 'function') {
        langSwitch.querySelectorAll('button').forEach(b => {
            b.addEventListener('click', () => window.WUT_applyLang(b.dataset.lang));
        });
        window.WUT_applyLang();
    }
}

function initRevealOnScroll() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        els.forEach(e => e.classList.add('is-in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            // data-hold odsuwa pojawienie sie w czasie - napis nad filmem ma
            // wejsc dopiero po chwili, zeby najpierw bylo widac sam obraz
            const zwloka = parseInt(e.target.dataset.hold || '0', 10);
            if (zwloka > 0) setTimeout(() => e.target.classList.add('is-in'), zwloka);
            else e.target.classList.add('is-in');
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    els.forEach(e => io.observe(e));
}

function animateCount(el, target, duration = 1500, suffix = '') {
    const start = performance.now();
    const startVal = parseFloat(el.textContent) || 0;
    function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const val = startVal + (target - startVal) * ease;
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const target = parseFloat(e.target.dataset.count);
                const suffix = e.target.dataset.suffix || '';
                animateCount(e.target, target, 1600, suffix);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => io.observe(c));
}

// Chrome na Windowsie nie ma glifow flag w foncie emoji - zamiast nich
// rysujemy je wprost, wiec wygladaja tak samo w kazdej przegladarce
const FLAGI = {
    pl: '<svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<rect width="3" height="2" fill="#fff"/><rect y="1" width="3" height="1" fill="#dc143c"/></svg>',
    cz: '<svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<rect width="3" height="1" fill="#fff"/><rect y="1" width="3" height="1" fill="#d7141a"/>' +
        '<path d="M0 0 1.5 1 0 2z" fill="#11457e"/></svg>',
    at: '<svg viewBox="0 0 3 2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<rect width="3" height="2" fill="#ed2939"/><rect y=".667" width="3" height=".666" fill="#fff"/></svg>',
};

/* kalendarz startow — minione zostaja na osi, domyslnie zaznaczony
   najblizszy nadchodzacy. start = poczatek odliczania, end = koniec imprezy */
const WUT_EVENTS = [
    {
        start: '2026-07-09T18:00:00', end: '2026-07-09T22:00:00',
        flag: 'pl', photo: 'assets/wut7-rollout.jpg',
        name: 'Roll-out WUT7', loc: 'Politechnika Warszawska',
        datePl: '9 lipca 2026 · 18:00', dateEn: '9 July 2026 · 18:00',
    },
    {
        start: '2026-07-19T08:00:00', end: '2026-07-24T20:00:00',
        flag: 'cz', photo: 'assets/media/track-most.jpg',
        name: 'Formula Student Czech', loc: 'Autodrom Most',
        datePl: '19–24 lipca 2026', dateEn: '19–24 July 2026',
    },
    {
        start: '2026-07-26T08:00:00', end: '2026-07-30T20:00:00',
        flag: 'at', photo: 'assets/media/track-redbullring.jpg',
        name: 'Formula Student Austria', loc: 'Red Bull Ring, Spielberg',
        datePl: '26–30 lipca 2026', dateEn: '26–30 July 2026',
    },
    {
        start: '2026-08-25T08:00:00', end: '2026-08-29T20:00:00',
        flag: 'pl', photo: 'assets/media/track-slomczyn.jpg',
        name: 'Formula Student Poland', loc: 'Autodrom Słomczyn',
        datePl: '25–29 sierpnia 2026', dateEn: '25–29 August 2026',
    },
];

function initEventsCalendar() {
    const wrap = document.getElementById('events-races');
    const img = document.getElementById('event-banner-img');
    const title = document.getElementById('event-banner-title');
    const meta = document.getElementById('event-banner-meta');
    const cdBox = document.getElementById('rollout-countdown');
    const elapsedBox = document.getElementById('event-elapsed');
    if (!wrap || !img || !title || !meta || !cdBox || !elapsedBox) return;

    const fields = {
        days:  cdBox.querySelector('[data-cd="days"]'),
        hours: cdBox.querySelector('[data-cd="hours"]'),
        mins:  cdBox.querySelector('[data-cd="mins"]'),
        secs:  cdBox.querySelector('[data-cd="secs"]'),
    };
    const elVal = document.getElementById('event-elapsed-val');
    const elLbl = document.getElementById('event-elapsed-lbl');

    const events = WUT_EVENTS.map(e => ({
        ...e,
        startMs: new Date(e.start).getTime(),
        endMs: new Date(e.end).getTime(),
    })).sort((a, b) => a.startMs - b.startMs);

    const isPast = e => Date.now() > e.endMs;
    const t = (key, fb) => (window.WUT_t ? window.WUT_t(key) : null) || fb;
    const pad = n => String(n).padStart(2, '0');

    // polska odmiana: 1 dzien / 2-4 dni / 5+ dni
    function daysLabel(n) {
        if ((window.WUT_LANG || 'pl') === 'en') return n === 1 ? 'day ago' : 'days ago';
        return n === 1 ? 'dzień temu' : 'dni temu';
    }

    let activeIdx = 0;
    let timer = null;

    function dateText(e) {
        return (window.WUT_LANG || 'pl') === 'en' ? e.dateEn : e.datePl;
    }

    function renderCards() {
        wrap.innerHTML = events.map((e, i) => `
            <button class="race-card${isPast(e) ? ' is-past' : ''}${i === activeIdx ? ' is-active' : ''}"
                    type="button" data-idx="${i}">
                <div class="race-flag">${FLAGI[e.flag] || ''}</div>
                <div class="race-body">
                    <div class="race-date">${dateText(e)}</div>
                    <div class="race-name">${e.name}</div>
                    <div class="race-loc">${e.loc}</div>
                </div>
            </button>
        `).join('');
    }

    function tick() {
        const e = events[activeIdx];
        if (!e) return;

        if (isPast(e)) {
            cdBox.hidden = true;
            elapsedBox.hidden = false;
            const days = Math.max(0, Math.floor((Date.now() - e.endMs) / 86400000));
            elVal.textContent = days;
            elLbl.textContent = daysLabel(days);
            return;
        }

        cdBox.hidden = false;
        elapsedBox.hidden = true;
        const diff = e.startMs - Date.now();
        if (diff <= 0) {
            // trwa wlasnie teraz
            fields.days.textContent = '00';
            fields.hours.textContent = '00';
            fields.mins.textContent = '00';
            fields.secs.textContent = '00';
            return;
        }
        const s = Math.floor(diff / 1000);
        fields.days.textContent  = pad(Math.floor(s / 86400));
        fields.hours.textContent = pad(Math.floor((s % 86400) / 3600));
        fields.mins.textContent  = pad(Math.floor((s % 3600) / 60));
        fields.secs.textContent  = pad(s % 60);
    }

    function select(i, scroll) {
        activeIdx = i;
        const e = events[i];

        wrap.querySelectorAll('.race-card').forEach(c => {
            c.classList.toggle('is-active', Number(c.dataset.idx) === i);
        });

        title.textContent = e.name;
        meta.textContent = `${dateText(e)} · ${e.loc}`;
        tick();

        if (img.getAttribute('src') !== e.photo) {
            img.style.opacity = '0';
            const pre = new Image();
            pre.onload = () => {
                img.src = e.photo;
                requestAnimationFrame(() => { img.style.opacity = '1'; });
            };
            pre.onerror = () => { img.style.opacity = '1'; };
            pre.src = e.photo;
        }

        if (scroll) {
            const card = wrap.querySelector(`.race-card[data-idx="${i}"]`);
            if (card) scrollRailTo(card.offsetLeft - 2);
        }
    }

    wrap.addEventListener('click', (ev) => {
        const card = ev.target.closest('.race-card');
        if (card) select(Number(card.dataset.idx), false);
    });

    // przewijanie osi strzalkami
    // wlasny tween — Chrome ignoruje behavior:'smooth' na kontenerach ze scroll-snap
    const prev = document.getElementById('rail-prev');
    const next = document.getElementById('rail-next');
    let railAnim = null;

    function scrollRailTo(target) {
        const max = wrap.scrollWidth - wrap.clientWidth;
        const to = Math.max(0, Math.min(max, target));
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            wrap.scrollLeft = to;
            syncNav();
            return;
        }
        const from = wrap.scrollLeft;
        const dist = to - from;
        if (Math.abs(dist) < 1) return;
        const dur = 420;
        const t0 = performance.now();
        if (railAnim) cancelAnimationFrame(railAnim);
        (function step(now) {
            const p = Math.min(1, (now - t0) / dur);
            const e = 1 - Math.pow(1 - p, 3);
            wrap.scrollLeft = from + dist * e;
            if (p < 1) railAnim = requestAnimationFrame(step);
            else { railAnim = null; syncNav(); }
        })(t0);
    }

    function scrollRail(dir) {
        const card = wrap.querySelector('.race-card');
        const step = card ? card.getBoundingClientRect().width : 280;
        scrollRailTo(wrap.scrollLeft + dir * step);
    }
    function syncNav() {
        if (!prev || !next) return;
        const max = wrap.scrollWidth - wrap.clientWidth;
        const hasOverflow = max > 4;
        prev.hidden = !hasOverflow;
        next.hidden = !hasOverflow;
        if (hasOverflow) {
            prev.disabled = wrap.scrollLeft <= 2;
            next.disabled = wrap.scrollLeft >= max - 2;
        }
    }
    if (prev) prev.addEventListener('click', () => scrollRail(-1));
    if (next) next.addEventListener('click', () => scrollRail(1));
    wrap.addEventListener('scroll', syncNav, { passive: true });
    window.addEventListener('resize', syncNav);

    // domyslnie najblizszy nadchodzacy; jesli wszystkie minely — ostatni
    const upcoming = events.findIndex(e => !isPast(e));
    activeIdx = upcoming === -1 ? events.length - 1 : upcoming;

    renderCards();
    select(activeIdx, false);
    // dosun os do zaznaczonego bez animacji
    const activeCard = wrap.querySelector(`.race-card[data-idx="${activeIdx}"]`);
    if (activeCard) {
        const max = wrap.scrollWidth - wrap.clientWidth;
        wrap.scrollLeft = Math.max(0, Math.min(max, activeCard.offsetLeft - 2));
    }
    syncNav();

    timer = setInterval(tick, 1000);

    // po zmianie jezyka przerenderuj teksty
    window.WUT_refreshCountdown = function () {
        renderCards();
        select(activeIdx, false);
        syncNav();
    };
}

function initHeroCarousel() {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    if (slides.length < 2) return;

    let idx = 0;
    let timer = null;
    const INTERVAL = 6500;

    function go(n) {
        idx = (n + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
        dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    }
    function next() { go(idx + 1); }
    function start() { stop(); timer = setInterval(next, INTERVAL); }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    dots.forEach((d) => {
        d.addEventListener('click', () => {
            go(parseInt(d.dataset.go, 10));
            start();
        });
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop(); else start();
    });
    start();
}

// rozwijane opisy konkurencji formula student
function initRaceAccordion() {
    const heads = document.querySelectorAll('.fs-race-head');
    if (!heads.length) return;

    heads.forEach(btn => {
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel) return;

        let zegar = null;

        // po animacji rozwiniety panel wraca na "auto", zeby urosl przy zmianie
        // szerokosci okna; zwiniety znika z ukladu
        function posprzataj() {
            clearTimeout(zegar);
            if (btn.getAttribute('aria-expanded') === 'true') {
                panel.style.height = 'auto';
            } else {
                panel.hidden = true;
                panel.style.height = '';
            }
        }

        btn.addEventListener('click', () => {
            const otwarty = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!otwarty));

            // Obie wysokosci trzeba rozdzielic wymuszonym przeliczeniem ukladu.
            // Bez tego przegladarka widzi w jednej klatce tylko wartosc koncowa,
            // a przy zwijaniu nie ma nawet z czego animowac, bo panel stoi na "auto".
            if (otwarty) {
                panel.style.height = panel.scrollHeight + 'px';
                void panel.offsetHeight;
                panel.style.height = '0px';
            } else {
                panel.hidden = false;
                panel.style.height = '0px';
                void panel.offsetHeight;
                panel.style.height = panel.scrollHeight + 'px';
            }

            // transitionend nie przychodzi, gdy karta jest w tle albo przejscie
            // zostanie przerwane - bez tego panel zostalby w polowicznym stanie
            clearTimeout(zegar);
            zegar = setTimeout(posprzataj, 620);
        });

        panel.addEventListener('transitionend', (e) => {
            if (e.propertyName !== 'height' || e.target !== panel) return;
            posprzataj();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    initNav(page);
    initRevealOnScroll();
    initCounters();
    initEventsCalendar();
    initHeroCarousel();
    initRaceAccordion();
});
