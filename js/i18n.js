// Prosty system tlumaczen PL/EN. PL = zrodlo w HTML, EN = slownik ponizej.
(function () {
    const DICT = {
        pl: {
            'team.all': 'Wszyscy',
            'team.backToDepts': 'Wszystkie działy',
            'team.more': 'Pokaż więcej',
            'team.less': 'Pokaż mniej',
            'team.email': 'Pokaż e-mail',
            'team.none': 'brak',
            'team.competitions': 'Zawody',
            'team.projects': 'Projekty',
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
            'dept.fundraising': 'Fundraising',

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
            'about.history.p1': 'The WUT Racing student association was founded over a decade ago so that students of the Warsaw University of Technology could pursue their talents and show them to the world. Not long after, the first car, WUT-1, made its debut, which became a ticket to the best race tracks, where Formula Student competitions have been held for years. As the organisation grew, we increasingly made our mark among international student racing teams.',
            'about.history.p2': 'In a short time the second-generation car was built, with which we achieved arguably the greatest successes in our history so far.',
            'about.history.p3': 'Over time WUT Racing was significantly expanded with the best students from other Warsaw universities. Among our ranks we also have people studying at, among others, the SGH Warsaw School of Economics, who specialise in the operational side of the team — logistics, communication and fundraising. Meanwhile, the technical side of the team is still led mainly by representatives of the Warsaw University of Technology.',
            'about.timelineEyebrow': 'Timeline',
            'about.timelineTitle': 'Our <span class="text-accent">history</span>.',
            'about.tl.2011.t': 'Founding',
            'about.tl.2011.d': 'The WUT Racing Student Association, operating at the Faculty of Power and Aeronautical Engineering of the Warsaw University of Technology, was founded in 2011.',
            'about.tl.wut1.d': 'The first car built from scratch.',
            'about.tl.wut2.d': 'The second generation of the car saw the light of day.',
            'about.ctaTitle': 'Meet our <span class="text-accent">team</span>.',

            // formula student
            'fs.whatTitle': 'What is Formula Student?',
            'fs.whatText': 'Formula Student – an international series of competitions for university engineering teams, held every year by the Society of Automotive Engineers, an organisation active since 1905). For a whole year, students from the best universities and technical universities in the world design, engineer and build a race car, so that after a testing phase they can race on the biggest and most famous circuits in the world, such as Britain’s Silverstone.',
            'fs.histTitle': 'History',
            'fs.histText': 'Formula Student began with the first SAE Mini-Indy competition in 1979. Today the events are held on several continents, in classes for combustion-engined and electric vehicles, the Driverless class – an autonomous car with no driver – and virtual projects for teams that are only just starting out or that, for various reasons, are unable to physically build a car in time for the competition.',
            'fs.racesTitle': 'Competition events',

            'fs.bpp.n': 'Business plan presentation',
            'fs.bpp.p': '75 points',
            'fs.bpp.d': 'A presentation in which the team simulates founding a company that manufactures and sells race cars. The people giving the 10-minute presentation to the panel of judges play the part of a team seeking financial backing for their new venture from wealthy investors.',
            'fs.cost.n': 'Cost estimate',
            'fs.cost.p': '100 points',
            'fs.cost.d': 'An event in which the team’s representatives present the cost estimate for the entire car, broken down into its smallest parts. The idea behind Cost is to simulate implementing optimised car production in a factory. It therefore accounts for the manufacture of each of the several hundred components of the car, starting from a cube of raw material (or another commercial form of the material used, available and listed in the annexes to the rules), through the machining applied in the real production process, all the way to the standardised cost of fitting the part during assembly of the car.',
            'fs.design.n': 'Design',
            'fs.design.p': '150 points',
            'fs.design.d': 'The highest-scoring of the static events. It also comes down to a contest between team members and a panel of judges who are specialists in individual areas of the design, such as: suspension, drivetrain, electronics, aerodynamics, load-bearing structure, vehicle kinematics and engine. It is an examination of the team members’ engineering knowledge and skill, during which they must prove to the judges that the solutions they used in the car are of a high standard, or surpass the other teams in value and ingenuity.',
            'fs.skidpad.n': 'Figure-of-eight course',
            'fs.skidpad.p': '75 points',
            'fs.skidpad.d': 'The driver has to complete 2 laps on each loop of the figure of eight in the shortest possible time and cross the exit finish line. Each team may enter a maximum of 2 drivers in the event, and each driver is entitled to 2 runs. The team’s best time counts towards the classification. The event is designed to test the performance delivered by the suspension and aerodynamics while the car is subjected to relatively high lateral loads.',
            'fs.accel.n': 'Acceleration',
            'fs.accel.p': '75 points',
            'fs.accel.d': 'The event consists of covering a distance of 75 metres as quickly as possible, accelerating from 0 km/h at the start line. Each team may enter a maximum of 2 drivers in the event, and each driver is entitled to 2 runs. The team’s best time counts towards the classification.',
            'fs.autocross.n': 'Sprint',
            'fs.autocross.p': '100 points',
            'fs.autocross.d': 'In this discipline what matters is completing 1 lap from the start line to the finish line in the shortest possible time. Each team may enter a maximum of 2 drivers in the event, and each driver is entitled to 2 runs. The team’s best time counts towards the classification.',
            'fs.endurance.n': 'Main race',
            'fs.endurance.p': '325 points',
            'fs.endurance.d': 'The most important event, both for the excitement, as a test for the car and for the points on offer. The race is made up of 23 laps, with the first driver covering 11 and the second driving through to the finish of the last one. The race itself is the climax of a Formula Student event. The starting order is the reverse of the sprint results, so the fastest cars go last. Five cars may be on track at the same time, which is an exception to the rest of the competition, where throughout all the other events, as well as under the rules for using the warm-up area, only 1 car may run at a time. The track is only wide enough to prevent 2 cars running side by side or overtaking. That means the main race demands double the care from the drivers, sound management of the situation on track and of keeping it clear.',
            'fs.efficiency.n': 'Efficiency',
            'fs.efficiency.p': '100 points',
            'fs.efficiency.d': 'For this category the judges assess the amount of fuel or electricity the car used during the dynamic events. The designs that use the least energy score the most points.',

            // cars
            'cars.hero1': 'Seven generations<br>one DNA',
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

            // cytaty
            'quote.ferrari': 'If you ask any child to draw a car,<br>they&rsquo;ll draw a red one.',
            'quote.ford': 'Coming together is a beginning, staying together is progress,<br>working together is success.',
            'quote.porsche': 'In the beginning I looked around and could not find the car<br>I had been dreaming of. So I decided to build it myself.',
            'quote.chapman': 'Adding power makes you faster on the straights;<br>subtracting weight makes you faster everywhere.',
            'team.backToDepts': 'All departments',
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
            'sponsors.main': 'Main partner',
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
