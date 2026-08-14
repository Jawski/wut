const SOCIAL = [
    { key: 'ig', url: 'https://www.instagram.com/wut.racing/', label: 'Instagram',
      d: 'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .48 1.4.9.4.4.7.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 5.4a4.4 4.4 0 100 8.8 4.4 4.4 0 000-8.8zm0 7.2a2.8 2.8 0 110-5.6 2.8 2.8 0 010 5.6zm5.6-7.4a1 1 0 11-2 0 1 1 0 012 0z' },
    { key: 'fb', url: 'https://www.facebook.com/WUTRacing', label: 'Facebook',
      d: 'M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z' },
    { key: 'in', url: 'https://pl.linkedin.com/company/wutracing', label: 'LinkedIn',
      d: 'M20.4 3H3.6C3.3 3 3 3.3 3 3.6v16.8c0 .3.3.6.6.6h16.8c.3 0 .6-.3.6-.6V3.6c0-.3-.3-.6-.6-.6zM8.3 18.3H5.6V9.7h2.7v8.6zM7 8.6a1.6 1.6 0 110-3.2 1.6 1.6 0 010 3.2zm11.3 9.7h-2.7v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3h-2.7V9.7h2.6v1.2h.04c.4-.7 1.3-1.4 2.6-1.4 2.7 0 3.2 1.8 3.2 4.1v4.7z' },
    { key: 'yt', url: 'https://www.youtube.com/@WUTRacingTeam', label: 'YouTube',
      d: 'M21.6 7.2s-.2-1.4-.8-2c-.75-.8-1.6-.8-2-.85C16 4.2 12 4.2 12 4.2h-.01s-4 0-6.8.2c-.4.05-1.25.05-2 .85-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.5v1.6c0 1.6.2 3.3.2 3.3s.2 1.4.8 2c.75.8 1.75.8 2.2.9 1.6.15 6.8.2 6.8.2s4 0 6.8-.2c.4-.06 1.25-.06 2-.86.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.6c0-1.6-.2-3.3-.2-3.3zM9.9 14.2V8.9l5.2 2.7-5.2 2.6z' },
];

const socialLinks = (cls) => SOCIAL.map(s =>
    `<a class="${cls}" href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label}" title="${s.label}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${s.d}"/></svg>
    </a>`).join('');

const NAV_HTML = `
<nav class="nav is-top" id="nav">
    <div class="nav-inner">
        <button class="menu-btn" aria-label="Menu" aria-expanded="false" id="menu-btn">
            <span class="menu-bars"><i></i><i></i><i></i></span>
        </button>
        <a href="index.html" class="brand" aria-label="WUT Racing">
            <img src="assets/logo.png" alt="WUT Racing" class="brand-logo">
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
        <img src="assets/logo.png" alt="WUT Racing" class="menu-logo">
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
                    <img src="assets/pw-logo.png" alt="Politechnika Warszawska" class="pw-logo"
                         onerror="this.remove();">
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
                <ul>
                    <li><a href="https://www.instagram.com/wut.racing/" target="_blank" rel="noopener">Instagram</a></li>
                    <li><a href="https://www.facebook.com/WUTRacing" target="_blank" rel="noopener">Facebook</a></li>
                    <li><a href="https://pl.linkedin.com/company/wutracing" target="_blank" rel="noopener">LinkedIn</a></li>
                    <li><a href="https://www.youtube.com/@WUTRacingTeam" target="_blank" rel="noopener">YouTube</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <span>© 2026 WUT Racing · Politechnika Warszawska</span>
            <a class="footer-designed" href="https://www.instagram.com/janoziemski/" target="_blank" rel="noopener">
                <img src="assets/wut-shield.png" alt="" class="footer-shield">
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

    let lastY = window.scrollY;
    function onScroll() {
        const y = window.scrollY;
        if (y < 40) nav.classList.add('is-top');
        else nav.classList.remove('is-top');
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (y / max) * 100 : 0;
        const progress = document.getElementById('scroll-progress');
        if (progress) progress.style.width = pct + '%';
        lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // pelnoekranowe menu
    const menuBtn = document.getElementById('menu-btn');
    const overlay = document.getElementById('menu-overlay');
    const closeBtn = document.getElementById('menu-close');

    function openMenu() {
        overlay.hidden = false;
        requestAnimationFrame(() => overlay.classList.add('is-open'));
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
            if (e.isIntersecting) {
                e.target.classList.add('is-in');
                io.unobserve(e.target);
            }
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

/* kalendarz startow — minione zostaja na osi, domyslnie zaznaczony
   najblizszy nadchodzacy. start = poczatek odliczania, end = koniec imprezy */
const WUT_EVENTS = [
    {
        start: '2026-07-09T18:00:00', end: '2026-07-09T22:00:00',
        flag: '🇵🇱', photo: 'assets/wut7-rollout.jpg',
        name: 'Roll-out WUT7', loc: 'Politechnika Warszawska',
        datePl: '9 lipca 2026 · 18:00', dateEn: '9 July 2026 · 18:00',
    },
    {
        start: '2026-07-19T08:00:00', end: '2026-07-24T20:00:00',
        flag: '🇨🇿', photo: 'assets/media/track-most.jpg',
        name: 'Formula Student Czech', loc: 'Autodrom Most',
        datePl: '19–24 lipca 2026', dateEn: '19–24 July 2026',
    },
    {
        start: '2026-07-26T08:00:00', end: '2026-07-30T20:00:00',
        flag: '🇦🇹', photo: 'assets/media/track-redbullring.jpg',
        name: 'Formula Student Austria', loc: 'Red Bull Ring, Spielberg',
        datePl: '26–30 lipca 2026', dateEn: '26–30 July 2026',
    },
    {
        start: '2026-08-25T08:00:00', end: '2026-08-29T20:00:00',
        flag: '🇵🇱', photo: 'assets/media/track-slomczyn.jpg',
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
                <div class="race-flag">${e.flag}</div>
                <div class="race-body">
                    <div class="race-date">${dateText(e)}</div>
                    <div class="race-name">${e.name}</div>
                    <div class="race-loc">${e.loc}</div>
                </div>
                ${isPast(e) ? `<span class="race-badge">${t('home.done', 'Odbyło się')}</span>` : ''}
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
        const step = card ? card.getBoundingClientRect().width + 2 : 280;
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

document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    initNav(page);
    initRevealOnScroll();
    initCounters();
    initEventsCalendar();
    initHeroCarousel();
});
