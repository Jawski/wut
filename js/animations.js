(function () {
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initPageEnter() {
        document.documentElement.classList.add('page-loading');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.documentElement.classList.remove('page-loading');
                document.documentElement.classList.add('page-loaded');
            });
        });
    }

    // delikatny parallax na mediach w tle sekcji dzialow
    function initParallaxMedia() {
        if (prefersReduce) return;
        const strips = Array.from(document.querySelectorAll('.dept-strip'));
        if (!strips.length) return;

        const items = strips.map(s => ({
            el: s,
            media: s.querySelector('.dept-strip-bg img, .dept-strip-bg video'),
        })).filter(i => i.media);

        let ticking = false;
        function update() {
            ticking = false;
            const vh = window.innerHeight;
            items.forEach(({ el, media }) => {
                const r = el.getBoundingClientRect();
                if (r.bottom < 0 || r.top > vh) return;
                // -1..1 wzgledem srodka viewportu
                const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
                media.style.transform = `translateY(${(-p * 5).toFixed(2)}%)`;
            });
        }
        function onScroll() {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    }

    function initParallax() {
        if (prefersReduce) return;
        const targets = document.querySelectorAll('[data-parallax]');
        if (!targets.length) return;
        function onScroll() {
            const y = window.scrollY;
            targets.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.3;
                el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initIntroSplash() {
        if (prefersReduce) return;
        try {
            if (sessionStorage.getItem('wut_intro_shown') === '1') return;
            sessionStorage.setItem('wut_intro_shown', '1');
        } catch (e) {}

        const overlay = document.createElement('div');
        overlay.className = 'intro-splash';
        overlay.innerHTML = `
            <img src="assets/logo.png" alt="WUT Racing" class="intro-logo">
            <div class="intro-line"></div>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => overlay.classList.add('intro-show'));
        setTimeout(() => overlay.classList.add('intro-dim'), 1700);
        setTimeout(() => overlay.classList.add('intro-out'), 2200);
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 3050);

        overlay.addEventListener('click', () => {
            overlay.classList.add('intro-out');
            setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 600);
        });
    }

    function init() {
        initIntroSplash();
        initPageEnter();
        initParallaxMedia();
        initParallax();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
