/* ============================================
   WUT Racing — animacje UI.
   Pluginujemy wszystko w common.js po DOMContentLoaded.
   Każda animacja jest opt-in (nie wpływa na elementy które nie pasują).
   ============================================ */

(function () {
    const isTouch = window.matchMedia('(hover: none)').matches;
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================
    // 1. 3D TILT NA KARTACH
    // ============================================
    function initTilt() {
        if (isTouch || prefersReduce) return;
        const SELECTOR = '.bolid-card, .race-card, .sponsor-card, ' +
                         '.value-card, .project-card, .event-card, .event-stat, ' +
                         '.timeline-item, .related-card, .quick-stat';
        const MAX_TILT = 7;       // stopnie maks. nachylenia
        const SCALE = 1.015;      // delikatne zbliżenie

        document.querySelectorAll(SELECTOR).forEach(card => {
            let rafId = null;
            let tx = 0, ty = 0, ts = 1;
            let cx = 0, cy = 0;
            const orig = card.style.transition;
            card.style.transformStyle = 'preserve-3d';
            card.style.willChange = 'transform';

            function onMove(e) {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;  // -1..+1
                const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
                cx = -y * MAX_TILT;   // rotateX
                cy =  x * MAX_TILT;   // rotateY
                if (!rafId) rafId = requestAnimationFrame(apply);
            }
            function apply() {
                rafId = null;
                tx += (cx - tx) * 0.18;
                ty += (cy - ty) * 0.18;
                ts += (SCALE - ts) * 0.18;
                card.style.transform =
                    `perspective(900px) rotateX(${tx.toFixed(2)}deg) rotateY(${ty.toFixed(2)}deg) scale(${ts.toFixed(3)})`;
                if (Math.abs(cx - tx) > 0.1 || Math.abs(cy - ty) > 0.1 || Math.abs(SCALE - ts) > 0.001) {
                    rafId = requestAnimationFrame(apply);
                }
            }
            function reset() {
                cx = 0; cy = 0;
                // smooth return to flat
                card.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
                card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
                setTimeout(() => { card.style.transition = orig || ''; tx = 0; ty = 0; ts = 1; }, 600);
            }

            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', reset);
        });
    }

    // ============================================
    // 2. MAGNETIC BUTTONS — przycisk lekko ciąży ku kursorowi
    // ============================================
    function initMagnetic() {
        if (isTouch || prefersReduce) return;
        const SELECTOR = '.btn, .hero-discover, .nav-cta';
        const RANGE = 28;          // px maks. odchylenia
        const RADIUS = 110;        // px aktywności wokół przycisku

        document.querySelectorAll(SELECTOR).forEach(btn => {
            let rafId = null;
            let tx = 0, ty = 0, cx = 0, cy = 0;
            btn.style.willChange = 'transform';

            function onMove(e) {
                const r = btn.getBoundingClientRect();
                const bx = r.left + r.width / 2;
                const by = r.top + r.height / 2;
                const dx = e.clientX - bx;
                const dy = e.clientY - by;
                const dist = Math.hypot(dx, dy);
                if (dist < RADIUS + r.width / 2) {
                    const pull = 1 - Math.min(1, dist / (RADIUS + r.width / 2));
                    cx = (dx / dist) * RANGE * pull;
                    cy = (dy / dist) * RANGE * pull;
                } else {
                    cx = 0; cy = 0;
                }
                if (!rafId) rafId = requestAnimationFrame(apply);
            }
            function apply() {
                rafId = null;
                tx += (cx - tx) * 0.18;
                ty += (cy - ty) * 0.18;
                btn.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
                if (Math.abs(cx - tx) > 0.1 || Math.abs(cy - ty) > 0.1) {
                    rafId = requestAnimationFrame(apply);
                }
            }
            window.addEventListener('mousemove', onMove, { passive: true });
        });
    }

    // ============================================
    // 3. STAGGER WORD REVEAL na nagłówkach
    // Każde słowo dostaje opóźnienie i wjeżdża z dołu po wejściu w viewport
    // ============================================
    function initSplitHeadings() {
        if (prefersReduce) return;
        const SELECTOR = '.h-display, .h-1, .hero-photo-headline';

        document.querySelectorAll(SELECTOR).forEach(h => {
            if (h.dataset.split === 'done') return;
            h.dataset.split = 'done';

            // zachowaj inner HTML: zamień każde słowo w tekście na span,
            // ale uważaj na elementy zagnieżdżone (np. <span class="text-accent">).
            const wrapText = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    const frag = document.createDocumentFragment();
                    const parts = text.split(/(\s+)/);  // zachowaj białe znaki
                    parts.forEach(part => {
                        if (/^\s+$/.test(part)) {
                            frag.appendChild(document.createTextNode(part));
                        } else if (part.length > 0) {
                            const w = document.createElement('span');
                            w.className = 'word-anim';
                            w.textContent = part;
                            frag.appendChild(w);
                        }
                    });
                    node.parentNode.replaceChild(frag, node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    Array.from(node.childNodes).forEach(wrapText);
                }
            };
            wrapText(h);

            // ustaw delay per słowo
            h.querySelectorAll('.word-anim').forEach((w, i) => {
                w.style.transitionDelay = `${i * 70}ms`;
            });

            // obserwator wejścia
            const io = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add('words-in');
                        io.unobserve(e.target);
                    }
                });
            }, { threshold: 0.15 });
            io.observe(h);
        });
    }

    // ============================================
    // 4. PAGE FADE-IN na load
    // ============================================
    function initPageEnter() {
        document.documentElement.classList.add('page-loading');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.documentElement.classList.remove('page-loading');
                document.documentElement.classList.add('page-loaded');
            });
        });
    }

    // ============================================
    // 5. CURSOR GLOW — subtelna czerwona poświata podążająca za myszą
    // ============================================
    function initCursorGlow() {
        if (isTouch || prefersReduce) return;
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
        let cx = tx, cy = ty;

        window.addEventListener('mousemove', (e) => {
            cx = e.clientX; cy = e.clientY;
        }, { passive: true });

        function tick() {
            tx += (cx - tx) * 0.08;
            ty += (cy - ty) * 0.08;
            glow.style.transform = `translate(${tx - 200}px, ${ty - 200}px)`;
            requestAnimationFrame(tick);
        }
        tick();
    }

    // ============================================
    // 6. PARALLAX na zdjęciach hero (na podstronach z .page-hero)
    // ============================================
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

    // ============================================
    // 7. INTRO SPLASH — efekt WOW przy pierwszym wejściu na sesję
    // Czarny full-screen overlay → reveal „WUT RACING" → red sweep → uciekanie w górę
    // ============================================
    function initIntroSplash() {
        if (prefersReduce) return;
        // pokazuj tylko raz na sesję
        try {
            if (sessionStorage.getItem('wut_intro_shown') === '1') return;
            sessionStorage.setItem('wut_intro_shown', '1');
        } catch (e) { /* ignoruj jeśli sessionStorage zablokowane */ }

        const overlay = document.createElement('div');
        overlay.className = 'intro-splash';
        overlay.innerHTML = `
            <div class="intro-mark">
                <img src="assets/logo.png" alt="WUT Racing" class="intro-logo">
            </div>
            <div class="intro-sub">Politechnika Warszawska · Formula Student</div>
            <div class="intro-sweep"></div>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // sekwencja czasowa
        requestAnimationFrame(() => overlay.classList.add('intro-show'));
        setTimeout(() => overlay.classList.add('intro-sweep-go'), 1700);
        setTimeout(() => overlay.classList.add('intro-out'), 2400);
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 3300);

        // skip na klik
        overlay.addEventListener('click', () => {
            overlay.classList.add('intro-out');
            setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 600);
        });
    }

    // ============================================
    // 8. FILM GRAIN — subtelne ziarno filmowe nałożone na całą stronę
    // ============================================
    function initFilmGrain() {
        if (prefersReduce) return;
        const grain = document.createElement('div');
        grain.className = 'film-grain';
        document.body.appendChild(grain);
    }

    // ============================================
    // INIT
    // ============================================
    function init() {
        initIntroSplash();
        initFilmGrain();
        initPageEnter();
        initSplitHeadings();
        initTilt();
        initMagnetic();
        initCursorGlow();
        initParallax();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
