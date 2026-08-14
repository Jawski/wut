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

    // filmy pod "Kim jestesmy" leca po sobie w petli
    function initIntroVideos() {
        const bg = document.getElementById('intro-bg');
        if (!bg) return;
        const clips = Array.from(bg.querySelectorAll('.intro-video'));
        if (!clips.length) return;

        let idx = 0;
        function show(i) {
            idx = (i + clips.length) % clips.length;
            clips.forEach((v, n) => {
                v.classList.toggle('is-active', n === idx);
                if (n !== idx) { try { v.pause(); } catch (e) {} }
            });
            const cur = clips[idx];
            cur.currentTime = 0;
            cur.play().catch(() => {});
        }
        clips.forEach(v => v.addEventListener('ended', () => show(idx + 1)));

        // odtwarzaj tylko gdy sekcja jest widoczna
        const strip = bg.closest('.intro-strip');
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) clips[idx].play().catch(() => {});
                else clips.forEach(v => { try { v.pause(); } catch (er) {} });
            });
        }, { threshold: 0.15 });
        io.observe(strip);

        show(0);
    }

    // delikatny parallax na mediach w tle sekcji dzialow
    function initParallaxMedia() {
        if (prefersReduce) return;
        const strips = Array.from(document.querySelectorAll('.dept-strip'));
        if (!strips.length) return;

        const items = strips.map(s => ({
            el: s,
            media: s.querySelector('.dept-media img, .dept-strip-bg img, .dept-strip-bg video'),
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

    // Sekcje, ktore maja zostawac w miejscu. Gdy sekcja jest wyzsza od ekranu,
    // "top: 0" przykleiloby ja od razu i jej dolu nigdy nie dalo sie zobaczyc -
    // dlatego przesuwamy punkt przyklejenia o nadmiar wysokosci w gore.
    function initStickyOffsets() {
        const els = document.querySelectorAll('.scroll-stack .events-strip, .scroll-stack .intro-strip');
        if (!els.length) return;

        function apply() {
            els.forEach(el => {
                if (getComputedStyle(el).position !== 'sticky') { el.style.top = ''; return; }
                const over = el.offsetHeight - window.innerHeight;
                el.style.top = over > 0 ? -over + 'px' : '0px';
            });
        }
        apply();
        window.addEventListener('resize', apply);
    }

    // film "Kim jestesmy" zostaje w miejscu, a tekst na nim gasnie,
    // zanim najada na niego sekcje dzialow
    function initIntroFade() {
        const strip = document.querySelector('.intro-strip');
        if (!strip) return;

        // przyklejony element zwraca pozycje po przyklejeniu, wiec postep
        // liczymy z sekcji, ktora na niego najezdza
        const next = strip.nextElementSibling;
        if (!next) return;

        let ticking = false;
        function update() {
            ticking = false;
            const h = strip.offsetHeight;
            if (!h) return;
            // 0 gdy film dopiero sie przykleil, 1 gdy jest juz calkiem zakryty
            const covered = 1 - Math.min(1, Math.max(0, next.getBoundingClientRect().top / h));
            const p = Math.min(1, covered / 0.45);
            strip.style.setProperty('--intro-fade', (1 - p).toFixed(3));
        }
        function onScroll() {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    }

    // cytat odslaniany kregiem swiatla przy kursorze
    function initQuoteSpotlight() {
        const strip = document.querySelector('.quote-strip');
        if (!strip) return;
        // na dotyku maska jest wylaczona w css, wiec nie ma czego sledzic
        if (!window.matchMedia('(hover: hover)').matches || prefersReduce) return;

        // maska siedzi na .quote-body, wiec liczymy wzgledem niego, nie wzgledem sekcji
        const body = strip.querySelector('.quote-body');
        if (!body) return;

        let raf = null, px = 0, py = 0;

        function apply() {
            raf = null;
            strip.style.setProperty('--qx', px + 'px');
            strip.style.setProperty('--qy', py + 'px');
        }

        strip.addEventListener('pointermove', (e) => {
            const r = body.getBoundingClientRect();
            px = e.clientX - r.left;
            py = e.clientY - r.top;
            if (!raf) raf = requestAnimationFrame(apply);
        }, { passive: true });

        strip.addEventListener('pointerenter', () => strip.classList.add('is-lit'));
        strip.addEventListener('pointerleave', () => {
            strip.classList.remove('is-lit');
            if (raf) { cancelAnimationFrame(raf); raf = null; }
        });
    }

    function init() {
        initIntroSplash();
        initPageEnter();
        initIntroVideos();
        initParallaxMedia();
        initParallax();
        initStickyOffsets();
        initIntroFade();
        initQuoteSpotlight();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
