// Prosty system tlumaczen PL/EN. PL = zrodlo w HTML, EN = slownik ponizej.
(function () {
    const DICT = {
        pl: {
            'team.all': 'Wszyscy',
            'team.more': 'Pokaż więcej',
            'team.less': 'Pokaż mniej',
            'team.email': 'Pokaż e-mail',
            'team.none': 'brak',
            'team.competitions': 'Zawody',
            'team.projects': 'Projekty',
            'home.done': 'Odbyło się',
            'cars.power': 'Moc silnika',
            'cars.vmax': 'Prędkość maks.',
            'cars.accel': '0 – 100 km/h',
            'cars.mass': 'Masa',
        },
        en: {
            // nav / footer
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.team': 'Team',
            'nav.cars': 'Cars',
            'nav.sponsors': 'Sponsors',
            'nav.support': 'Support us',
            'footer.about': 'WUT Racing student association at the Warsaw University of Technology. We design and build Formula Student class cars.',
            'footer.site': 'Site',
            'footer.contact': 'Contact',
            'common.scroll': 'SCROLL',
            'common.dept': 'Department',

            // home hero
            'home.hero1': 'A car like<br>no other',
            'home.hero1Cta': 'Get to know us',
            'home.hero2': 'Built<br>from scratch',
            'home.hero2Cta': 'See the cars',
            'home.hero3': 'The track is<br>our exam',
            'home.hero3Cta': 'Meet the team',

            // home who
            'home.whoTitle': 'Who are we?',
            'home.who1': 'Fasten your seatbelts and join WUT Racing on an exciting journey! Our story began in 2011 at the Faculty of Power and Aeronautical Engineering. Since then, united by a passion for motorsport, we have pursued one common goal — to build a race car ready to take on the challenges of the international Formula Student competitions.',
            'home.who2': 'We are a unique team of talented students from the top Warsaw universities, whose main goal is to triumph in the prestigious FS competitions. How do we intend to do it? Our road to success is teamwork built on determination and passion, aimed at creating a competitive race car together.',
            'home.who3': 'Through our commitment and shared effort, we create not only a machine of metal and technology, but also a one-of-a-kind community in which everyone contributes to a common goal. For us it is more than just a race — it is a journey towards fulfilling dreams and earning recognition in student motorsport.',

            // home calendar
            'home.calendar': 'Calendar',
            'home.upcoming': 'Upcoming <span class="text-accent">events</span>.',
            'home.done': 'Completed',
            'cd.days': 'days',
            'cd.hours': 'hrs',
            'cd.mins': 'min',
            'cd.secs': 'sec',

            // departments
            'dept.zarzad': 'Management',
            'dept.aero': 'Aerodynamics',
            'dept.chassis': 'Chassis',
            'dept.suspension': 'Suspension',
            'dept.electronics': 'Electronics',
            'dept.engine': 'Engine',
            'dept.pr': 'PR',
            'dept.logistics': 'Logistics',

            // home dept bodies
            'home.aeroBody': 'The aerodynamics department of WUT Racing carries out the necessary calculations, simulations and optimisation of the bodywork. By implementing new solutions, they check their impact on the whole project and pick the best ones. Department members are also responsible for manufacturing the aerodynamic parts from composite materials.',
            'home.chassisBody': 'The chassis department of WUT Racing designs and builds the monocoque, as well as the frame and the impact attenuator. It performs FEA strength analysis. It manufactures the composite parts of the car and tests their samples.',
            'home.suspensionBody': 'The suspension department of WUT Racing carries out calculations, simulations and tests. It designs parts in a CAD environment, prepares technical documentation and helps with production. Members handle the quasi-dynamics of the vehicle, i.e. the damping and stabilisation system.',
            'home.electronicsBody': 'The electronics department of WUT Racing designs the electrical and electronic systems whose task is to tie the components of the construction together. The engineers create subsystems responsible for controlling the engine and drivetrain, as well as for the correct and reliable operation of driver-assist systems. The department also handles data acquisition, later used to make the most of the car\'s potential.',
            'home.engineBody': 'The engine department of WUT Racing designs and modifies the individual systems and their components. It handles engine mapping for the various events, as well as fuel-consumption optimisation. The members\' tasks also include developing the engine dyno stand.',
            'home.prBody': 'The PR department of WUT Racing is the showcase of the organisation. It shapes the image of WUT Racing. It coordinates media activities and the promotion of all the events the team takes part in.',
            'home.logisticsBody': 'The logistics department of WUT Racing handles the logistical aspects of trade fairs and events, as well as the team\'s trips abroad. Its duties also include optimising the transport of members and the construction.',

            'home.ctaTitle': 'Let\'s build <span class="text-accent">WUT-8</span> together.',
            'home.becomeSponsor': 'Become a sponsor',
            'home.meetTeam': 'Meet the team',

            // about
            'about.hero1': 'Engineering<br>in motion',
            'about.hero2': 'One<br>team',
            'about.hero3': 'On track<br>since 2011',
            'about.heroCta': 'Discover our story',
            'about.historyEyebrow': 'Our history',
            'about.historyTitle': 'Since 2011.',
            'about.history.p1': 'The WUT Racing student association was founded almost a decade ago so that students of the Warsaw University of Technology could pursue their talents and show them to the world. The following year saw the debut of the first car, WUT-1, which became a ticket to the best race tracks, where Formula Student competitions have been held for years. As the organisation grew, we increasingly made our mark among international student racing teams.',
            'about.history.p2': 'In a short time the second-generation car was built, with which we achieved arguably the greatest successes in our history so far.',
            'about.history.p3': 'Over time WUT Racing was significantly expanded with the best students from other Warsaw universities. Among our ranks we also have people studying at, among others, the SGH Warsaw School of Economics, who specialise in the operational side of the team — logistics, communication and fundraising. Meanwhile, the technical side of the team is still led mainly by representatives of the Warsaw University of Technology.',
            'about.timelineEyebrow': 'Timeline',
            'about.timelineTitle': 'Our <span class="text-accent">history</span>.',
            'about.tl.2011.t': 'Founding',
            'about.tl.2011.d': 'The WUT Racing Student Association, operating at the Faculty of Power and Aeronautical Engineering of the Warsaw University of Technology, was founded in 2011.',
            'about.tl.wut1.d': 'The first car built from scratch.',
            'about.tl.wut2.d': 'The second generation of the car saw the light of day.',
            'about.ctaTitle': 'Meet our <span class="text-accent">team</span>.',

            // cars
            'cars.hero1': 'Six generations<br>one DNA',
            'cars.heroCta': 'See the timeline',
            'cars.hero2': 'Engineering<br>in detail',
            'cars.heroCta2': 'Pick a car',
            'cars.timelineEyebrow': 'Timeline',
            'cars.timelineTitle': 'Pick a <span class="text-accent">generation</span>.',
            'cars.power': 'Engine power',
            'cars.vmax': 'Top speed',
            'cars.accel': '0 – 100 km/h',
            'cars.mass': 'Weight',

            // team
            'team.hero1': 'The faces<br>behind the car',
            'team.heroCta': 'Meet the crew',
            'team.hero2': 'Everyone has<br>their role',
            'team.heroCta2': 'Filter by department',
            'team.hero3': 'One<br>goal',
            'team.all': 'All',
            'team.more': 'Show more',
            'team.less': 'Show less',
            'team.email': 'Show e-mail',
            'team.none': 'none',
            'team.competitions': 'Competitions',
            'team.projects': 'Projects',

            // sponsors
            'sponsors.eyebrow': 'Sponsors & Partners',
            'sponsors.title': 'Faster together<span class="text-accent">.</span>',
            'sponsors.lead': 'WUT Racing exists thanks to companies that invest in Polish student engineering. Every generation of the car is created in cooperation with our partners.',
            'sponsors.strategic': 'Strategic partners',
            'sponsors.platinum': 'Platinum partners',
            'sponsors.diamond': 'Diamond partners',
            'sponsors.gold': 'Gold partners',
            'sponsors.silver': 'Silver partners',
            'sponsors.bronze': 'Bronze partners',
            'sponsors.becomeTitle': 'Become a <span class="text-accent">partner</span>.',
            'sponsors.becomeText': 'A partnership with WUT Racing is an investment in a real engineering project, brand exposure at international competitions and direct access to the best students of Warsaw universities.',
            'sponsors.write': 'Write to us',
        },
    };

    let lang = 'pl';
    try { lang = localStorage.getItem('wut_lang') || 'pl'; } catch (e) {}
    if (lang !== 'pl' && lang !== 'en') lang = 'pl';
    window.WUT_LANG = lang;

    window.WUT_t = function (key) {
        const d = DICT[window.WUT_LANG];
        return (d && d[key] != null) ? d[key] : null;
    };

    function applyDom() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (el.dataset._pl == null) el.dataset._pl = el.innerHTML;
            if (window.WUT_LANG === 'en' && DICT.en[key] != null) {
                el.innerHTML = DICT.en[key];
            } else {
                el.innerHTML = el.dataset._pl;
            }
        });
    }

    window.WUT_applyLang = function (next) {
        if (next) {
            window.WUT_LANG = (next === 'en') ? 'en' : 'pl';
            try { localStorage.setItem('wut_lang', window.WUT_LANG); } catch (e) {}
        }
        document.documentElement.lang = window.WUT_LANG;
        applyDom();
        document.querySelectorAll('.lang-switch button').forEach(b => {
            b.classList.toggle('active', b.dataset.lang === window.WUT_LANG);
        });
        // przerysuj dynamiczne sekcje
        if (typeof window.WUT_renderTeam === 'function') window.WUT_renderTeam();
        if (typeof window.WUT_renderCars === 'function') window.WUT_renderCars();
        if (typeof window.WUT_refreshCountdown === 'function') window.WUT_refreshCountdown();
    };
})();
