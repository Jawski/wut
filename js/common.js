/* ============================================
   WUT Racing — common JS
   nav inject, scroll progress, reveal-on-scroll
   ============================================ */

const NAV_HTML = `
<nav class="nav is-top" id="nav">
    <div class="nav-inner">
        <a href="index.html" class="brand" aria-label="WUT Racing — home">
            <img src="assets/logo.png" alt="WUT Racing" class="brand-logo">
            <span class="brand-text brand-text-sub">
                <span class="b2">PW · FORMULA STUDENT</span>
            </span>
        </a>
        <ul class="nav-links">
            <li><a href="index.html" data-page="home">Start</a></li>
            <li><a href="o-nas.html" data-page="about">O nas</a></li>
            <li><a href="zespol.html" data-page="team">Zespół</a></li>
            <li><a href="bolidy.html" data-page="cars">Bolidy</a></li>
            <li><a href="wydarzenia.html" data-page="events">Zawody</a></li>
            <li><a href="sponsorzy.html" data-page="sponsors">Sponsorzy</a></li>
        </ul>
        <a href="sponsorzy.html#kontakt" class="nav-cta">Wesprzyj nas</a>
        <button class="menu-btn" aria-label="Otwórz menu" id="menu-btn">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 5h12M3 9h12M3 13h12"/>
            </svg>
        </button>
    </div>
</nav>
<div class="scroll-progress" id="scroll-progress"></div>
`;

const FOOTER_HTML = `
<footer class="footer">
    <div class="footer-inner">
        <div class="footer-grid">
            <div class="footer-col">
                <div class="brand">
                    <span class="brand-mark">W</span>
                    <span class="brand-text">
                        <span class="b1">WUT RACING</span>
                        <span class="b2">PW · FORMULA STUDENT</span>
                    </span>
                </div>
                <p style="margin-top: 18px; max-width: 320px; line-height: 1.6;">
                    Koło Naukowe Pojazdów Wyścigowych przy Politechnice Warszawskiej.
                    Projektujemy i budujemy bolidy klasy Formula Student.
                </p>
            </div>
            <div class="footer-col">
                <h4>Strona</h4>
                <ul>
                    <li><a href="index.html">Start</a></li>
                    <li><a href="o-nas.html">O nas</a></li>
                    <li><a href="zespol.html">Zespół</a></li>
                    <li><a href="bolidy.html">Bolidy</a></li>
                    <li><a href="wydarzenia.html">Zawody</a></li>
                    <li><a href="sponsorzy.html">Sponsorzy</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Kontakt</h4>
                <ul>
                    <li><a href="mailto:kontakt@wutracing.pl">kontakt@wutracing.pl</a></li>
                    <li><a href="#">+48 22 234 78 88</a></li>
                    <li>Wydział SiMR<br>Narbutta 84, Warszawa</li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Social</h4>
                <ul>
                    <li><a href="#">Instagram</a></li>
                    <li><a href="#">Facebook</a></li>
                    <li><a href="#">LinkedIn</a></li>
                    <li><a href="#">YouTube</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <span>© 2026 WUT Racing · Politechnika Warszawska</span>
            <span class="mono">v6.0 · WUT6</span>
        </div>
    </div>
</footer>
`;

function initNav(activePage) {
    document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
    document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

    const nav = document.getElementById('nav');
    const links = document.querySelectorAll('.nav-links a');

    if (activePage) {
        links.forEach(a => {
            if (a.dataset.page === activePage) a.classList.add('active');
        });
    }

    // Nav state on scroll
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

    // Mobile menu
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => nav.classList.toggle('is-open'));
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.addEventListener('click', () => nav.classList.remove('is-open'));
        });
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

// Tiny counter animation (used in stats)
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

// Countdown timer — odlicza do daty z data-target (ISO)
function initCountdown() {
    const el = document.getElementById('rollout-countdown');
    if (!el) return;
    const targetTime = new Date(el.dataset.target).getTime();
    if (isNaN(targetTime)) return;

    const fields = {
        days:  el.querySelector('[data-cd="days"]'),
        hours: el.querySelector('[data-cd="hours"]'),
        mins:  el.querySelector('[data-cd="mins"]'),
        secs:  el.querySelector('[data-cd="secs"]'),
    };

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        const diff = targetTime - Date.now();
        if (diff <= 0) {
            fields.days.textContent = '00';
            fields.hours.textContent = '00';
            fields.mins.textContent = '00';
            fields.secs.textContent = '00';
            clearInterval(timer);
            return;
        }
        const s = Math.floor(diff / 1000);
        fields.days.textContent  = pad(Math.floor(s / 86400));
        fields.hours.textContent = pad(Math.floor((s % 86400) / 3600));
        fields.mins.textContent  = pad(Math.floor((s % 3600) / 60));
        fields.secs.textContent  = pad(s % 60);
    }
    tick();
    const timer = setInterval(tick, 1000);
}

// Hero carousel — używane na stronie głównej i "O nas"
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
    initCountdown();
    initHeroCarousel();
});
