// dane czlonkow zespolu wedlug dzialow
// imiona zgodne z podpisami pod zdjeciami (nazwy plikow w assets/team)
// opisy/zawody/projekty z ankiety; brak danych -> "brak"

window.WUT_DEPT_FILTERS = [
    { id: 'all',          label: 'Wszyscy' },
    { id: 'zarzad',       label: 'Zarząd' },
    { id: 'aero',         label: 'Aerodynamika' },
    { id: 'chassis',      label: 'Chassis' },
    { id: 'suspension',   label: 'Zawieszenie' },
    { id: 'electronics',  label: 'Elektronika' },
    { id: 'engine',       label: 'Silnik' },
    { id: 'pr',           label: 'PR' },
    { id: 'logistics',    label: 'Logistyka' },
];

window.WUT_DEPT_INFO = {
    zarzad:      { label: 'Zarząd',       defaultRole: 'Członek zarządu' },
    aero:        { label: 'Aerodynamika', defaultRole: 'Inżynier aerodynamiki' },
    chassis:     { label: 'Chassis',      defaultRole: 'Inżynier nadwozia' },
    suspension:  { label: 'Zawieszenie',  defaultRole: 'Inżynier zawieszenia' },
    electronics: { label: 'Elektronika',  defaultRole: 'Inżynier elektroniki' },
    engine:      { label: 'Silnik',       defaultRole: 'Inżynier silnika' },
    pr:          { label: 'PR',           defaultRole: 'Dział PR' },
    logistics:   { label: 'Logistyka',    defaultRole: 'Dział logistyki' },
};

window.WUT_TEAM = [

    // ZARZĄD
    { slug: 'kuba-pacocha',          name: 'Kuba Pacocha',          dept: 'zarzad', role: 'Prezes' },
    { slug: 'bartek-pietrzak',       name: 'Bartek Pietrzak',       dept: 'zarzad', role: 'Wiceprezes ds. operacyjno-finansowych' },
    { slug: 'grzes-radzikowski',     name: 'Grzegorz Radzikowski',  dept: 'zarzad', role: 'Wiceprezes ds. technicznych' },

    // AERODYNAMIKA
    { slug: 'iga-gamska',            name: 'Iga Gamska',            dept: 'aero', role: 'Koordynator' },
    {
        slug: 'benek-jez', name: 'Benek Jeż', dept: 'aero', role: 'Zastępca koordynatora',
        bio: 'W zespole głównie zajmuję się prowadzeniem projektu aerodynamiki i obliczeniami CFD, ale lubię też prace warsztatowe przy wytwarzaniu elementów kompozytowych. Po godzinach gram w kosza, wspinam się, żegluję albo jeżdżę na nartach.',
        achievements: [{ year: 2025, text: 'FS Austria 2025' }],
        projects: ['Sidepody i kanały chłodzenia WUT-6', 'Złożenia aero i sprinty CFD WUT-7'],
    },
    {
        slug: 'mateusz-krajewski', name: 'Mateusz Krajewski', dept: 'aero', role: 'Zastępca koordynatora',
        bio: 'Kompozyty i aero. Ręczna obróbka CNC: cięcie i wiele innych. Starszy Dremlowy.',
        achievements: [{ year: 2025, text: 'FS Austria 2025' }, { year: 2025, text: 'FS Czechy 2025' }],
        projects: ['Nakładki aero na koła', 'Endplate tylnego skrzydła'],
    },
    { slug: 'magda-sienska',         name: 'Magda Sieńska',         dept: 'aero' },
    { slug: 'milosz-niedziela',      name: 'Miłosz Niedziela',      dept: 'aero' },
    { slug: 'ola-bres',              name: 'Ola Breś',              dept: 'aero' },
    { slug: 'kamil-grabowski',       name: 'Kamil Grabowski',       dept: 'aero' },
    { slug: 'stefan-jozefowicz-okonkwo', name: 'Stefan Józefowicz-Okonkwo', dept: 'aero' },
    {
        slug: 'szymon-rosinski', name: 'Szymon Rosiński', dept: 'aero',
        bio: 'Studiuję Mechanikę i Projektowanie Maszyn na MEiL. Projektuję kompozytowe elementy pakietu aerodynamicznego i optymalizuję ich geometrię w CFD. Tworzę wizualizacje wyników, a na zawodach fotografuję nasz bolid. Jachtowy Sternik Morski.',
        achievements: [{ year: 2025, text: 'FS Poland 2025' }],
        projects: ['Druk 3D foremników pakietu aero WUT-6', 'Kanały chłodzące tarcze hamulcowe WUT-7', 'Dokumentacja i estymacja masowa kompozytów'],
    },
    {
        slug: 'oliwier-jurczak', name: 'Oliwier Jurczak', dept: 'aero',
        bio: 'Od zawsze fascynowała mnie Formuła 1. Prowadziłem proces badawczy chemicznego wygładzania form z ABS-u pod elementy kompozytowe. Obecnie skupiam się na aerodynamice teoretycznej i symulacjach CFD; w pracy dyplomowej analizuję porpoising w bolidach F1 z 2022 roku.',
        projects: ['Badania obróbki ABS', 'Wdrożenie do środowiska CFD', 'Optymalizacja modeli CAD'],
    },
    { slug: 'lena-kaliszewska',      name: 'Lena Kaliszewska',      dept: 'aero' },
    { slug: 'franciszek-knecht',     name: 'Franciszek Knecht',     dept: 'aero' },
    { slug: 'mikolaj-konicki',       name: 'Mikołaj Konicki',       dept: 'aero' },
    { slug: 'pawel-kruk',            name: 'Paweł Kruk',            dept: 'aero' },
    { slug: 'malwina-kudlak',        name: 'Malwina Kudlak',        dept: 'aero' },
    {
        slug: 'mikolaj-magnuski', name: 'Mikołaj Magnuski', dept: 'aero',
        bio: 'Moje główne zainteresowania to materiały kompozytowe — dlatego bardzo lubię tworzyć elementy aero z włókna węglowego. To bardzo interesujący proces, który daje mi dużo satysfakcji.',
    },
    { slug: 'marta-mnich',           name: 'Marta Mnich',           dept: 'aero' },
    { slug: 'wiktor-mikolajczyk',    name: 'Wiktor Mikołajczyk',    dept: 'aero' },
    {
        slug: 'jan-oziemski', name: 'Jan Oziemski', dept: 'aero',
        bio: 'Jako członek działu aerodynamiki zajmuję się projektowaniem i wykonaniem pakietu aerodynamicznego dla naszych najnowszych konstrukcji. Sporą część wolnego czasu spędzam na warsztacie, laminując kolejne profile i przygotowując nowe foremniki.',
        projects: ['Faza wykonawcza WUT-7'],
    },
    {
        slug: 'patryk-pietrzykowski', name: 'Patryk Pietrzykowski', dept: 'aero',
        bio: 'Interesuję się wyścigami samochodowymi F1, GT3, sim-racingiem oraz strategią wyścigową. W wolnym czasie programuję aplikacje i skrypty, uczę się mechaniki eksperymentując na swoim samochodzie.',
    },
    {
        slug: 'nikodem-wera', name: 'Nikodem Wera', dept: 'aero',
        bio: 'Studiuję Mechanikę i Projektowanie Maszyn. Interesuję się motoryzacją, sportami motorowymi, lotnictwem oraz astronomią.',
        projects: ['Przygotowanie WUT-6 do zawodów'],
    },

    // CHASSIS
    { slug: 'grzes-spruch',          name: 'Grzegorz Spruch',       dept: 'chassis', role: 'Koordynator' },
    { slug: 'mikolaj-cieslak',       name: 'Mikołaj Cieślak',       dept: 'chassis', role: 'Zastępca koordynatora' },
    {
        slug: 'aleksander-abramowicz', name: 'Aleksander Abramowicz', dept: 'chassis',
        bio: 'Moja przygoda w WUT Racing kręci się wokół działu Chassis. Odpowiadam za to, aby konstrukcja nośna bolidu była lekka i wytrzymała. Przeprowadziłem wiele analiz MES. Prywatnie jestem wielkim fanem Formuły 1.',
        achievements: [{ year: 2024, text: 'FS Poland 2024' }, { year: 2025, text: 'FS Poland 2025' }],
        projects: ['Stanowisko spawania ramy WUT-7', 'Badanie sztywności skrętnej', 'Analiza MES ramy WUT-7', 'Analiza MES monocoque WUT-6'],
    },
    {
        slug: 'bartlomiej-misurski', name: 'Bartłomiej Misurski', dept: 'chassis',
        bio: 'Zajmuję się projektowaniem i wykonaniem monocoque\'u, jego obliczeniami strukturalnymi oraz zgodnością konstrukcji z regulaminem Formula Student. Interesują mnie materiały kompozytowe, szczególnie w motorsporcie i lekkich konstrukcjach.',
        achievements: [{ year: 2025, text: 'FS Poland 2025' }],
        projects: ['Kompozytowe wykroje foremników monocoque', 'Aluminiowe inserty', 'Wykonanie monocoque WUT-7', 'Push bar'],
    },
    { slug: 'michal-morawski',       name: 'Michał Morawski',       dept: 'chassis' },
    { slug: 'aleksy-dorota',         name: 'Aleksy Dorota',         dept: 'chassis' },
    { slug: 'marcin-gruszczynski',   name: 'Marcin Gruszczyński',   dept: 'chassis' },
    { slug: 'piotr-kilianczyk',      name: 'Piotr Kiliańczyk',      dept: 'chassis' },
    { slug: 'piotr-piwowarski',      name: 'Piotr Piwowarski',      dept: 'chassis' },

    // ZAWIESZENIE
    { slug: 'tomasz-zaleski',        name: 'Tomasz Zaleski',        dept: 'suspension', role: 'Koordynator' },
    { slug: 'ian-gjelleboll',        name: 'Ian Gjelleboll',        dept: 'suspension', role: 'Zastępca koordynatora' },
    { slug: 'maks-wozniak',          name: 'Maks Woźniak',          dept: 'suspension', role: 'Zastępca koordynatora' },
    { slug: 'tomek-kolakowski',      name: 'Tomek Kołakowski',      dept: 'suspension' },
    { slug: 'grzes-siedlecki',       name: 'Grzegorz Siedlecki',    dept: 'suspension' },
    {
        slug: 'damian-czerwiec', name: 'Damian Czerwiec', dept: 'suspension',
        bio: 'Na co dzień zajmuję się wieloma kwestiami związanymi z układem zawieszenia — organizacją, kontaktem ze sponsorami, projektem własnych elementów. Wykonałem oklejenie bolidu WUT-6 oraz WUT-7. W wolnym czasie jeżdżę w profesjonalnym drifcie w simracingu i współtworzę narzędzie treningowe PROXIMITER.',
        achievements: [{ year: 2025, text: 'FS Austria 2025' }],
        projects: ['Układ kierowniczy WUT-7', 'Mocowania wahaczy WUT-7', 'Stanowisko spawania mocowań WUT-6/7', 'Rockery zawieszenia WUT-6'],
    },
    {
        slug: 'tamara-saganek', name: 'Tamara Saganek', dept: 'suspension',
        bio: 'W kole zajmuję się pracą warsztatową, projektowaniem, analizą wytrzymałościową oraz optymalizacją topologiczną elementów zawieszenia.',
        achievements: [{ year: 2025, text: 'FS Czechy 2025' }, { year: 2025, text: 'FS Poland 2025' }],
        projects: ['Mocowania wahaczy', 'Pedał gazu', 'Przewody hamulcowe'],
    },
    {
        slug: 'dominik-werpachowski', name: 'Dominik Werpachowski', dept: 'suspension',
        bio: 'Uczestniczę w całym procesie powstawania bolidu. Poszerzam wiedzę z dynamiki pojazdu, projektuję w CAD, poznaję analizy MES i dobór parametrów zawieszenia. Prywatnie modyfikuję i jeżdżę torowo Mazdą MX-5 NB.',
        projects: ['Helper Spring', 'Łącznik ARB', 'Mocowanie amortyzatora'],
    },
    { slug: 'mateusz-jozwiak',       name: 'Mateusz Jóźwiak',       dept: 'suspension' },
    { slug: 'bartlomiej-kolacz',     name: 'Bartłomiej Kołacz',     dept: 'suspension' },
    { slug: 'leon-koslarz',          name: 'Leon Koślarz',          dept: 'suspension' },
    { slug: 'paulina-macek',         name: 'Paulina Macek',         dept: 'suspension' },
    { slug: 'jan-rode',              name: 'Jan Rode',              dept: 'suspension' },
    { slug: 'adam-tumidajewicz',     name: 'Adam Tumidajewicz',     dept: 'suspension' },
    { slug: 'tomasz-wrobel',         name: 'Tomasz Wróbel',         dept: 'suspension' },

    // ELEKTRONIKA
    { slug: 'michal-zielinski',      name: 'Michał Zieliński',      dept: 'electronics', role: 'Koordynator' },
    { slug: 'blazej-molas',          name: 'Błażej Molas',          dept: 'electronics', role: 'Zastępca koordynatora' },
    { slug: 'kacper-kowalski',       name: 'Kacper Kowalski',       dept: 'electronics' },
    {
        slug: 'mateusz-drabarek', name: 'Mateusz Drabarek', dept: 'electronics',
        bio: 'W zespole zajmuję się elektroniką pojazdu, jestem kierowcą, spawam, dobrze się bawię.',
        achievements: [
            { year: 2022, text: 'FS Czechy 2022' },
            { year: 2023, text: 'FS Węgry · Niemcy · Polska 2023' },
            { year: 2024, text: 'FS Węgry · Chorwacja · Polska 2024' },
            { year: 2025, text: 'FS Austria · Polska 2025' },
        ],
        projects: ['Sprzęgło elektryczne', 'Wiązka elektryczna', 'Płytki PCB', 'Systemy bezpieczeństwa kierowcy'],
    },
    { slug: 'patrycja-wozniak',      name: 'Patrycja Woźniak',      dept: 'electronics' },
    {
        slug: 'kasia-matejuk', name: 'Katarzyna Matejuk', dept: 'electronics',
        bio: 'Tu tu du du.',
        achievements: [{ year: 2025, text: 'FS Poland 2025' }],
        projects: ['LVMS'],
    },
    { slug: 'tymoteusz-celmer',      name: 'Tymoteusz Celmer',      dept: 'electronics' },
    { slug: 'robert-gruszczynski',   name: 'Robert Gruszczyński',   dept: 'electronics' },
    {
        slug: 'jan-maciag', name: 'Jan Maciąg', dept: 'electronics',
        bio: 'Dołączyłem do działu elektroniki, żeby poszerzać wiedzę. Bardziej interesuje mnie informatyka od strony sprzętowej. Lubię realizować praktyczne zadania, które mają rzeczywiste zastosowanie.',
        projects: ['Aplikacja do telemetrii', 'PCB do obsługi LED-ów'],
    },

    // SILNIK
    {
        slug: 'mateusz-makarewicz', name: 'Mateusz Makarewicz', dept: 'engine', role: 'Koordynator',
        bio: 'Interesuję się motorsportem, zwłaszcza nieszablonowymi rozwiązaniami technicznymi i rozwojem jednostek napędowych. Lubię motoryzację z lat 90-tych.',
        achievements: [{ year: 2024, text: 'FS Poland 2024' }, { year: 2025, text: 'FS Czechy 2025' }, { year: 2025, text: 'FS Poland 2025' }],
        projects: ['Układ przeniesienia napędu', 'Mocowania dyferencjału', 'Układ turbodoładowania'],
    },
    {
        slug: 'kuba-czarzasty', name: 'Kuba Czarzasty', dept: 'engine', role: 'Zastępca koordynatora',
        bio: 'Od listopada 2024 roku należę do zespołu. Wykorzystuję wiedzę ze studiów w projektowaniu samochodów. Poza studiami lubię rower i narty.',
        achievements: [{ year: 2025, text: 'FS Czechy 2025' }],
        projects: ['Planowanie wydatków działu 2025/26', 'KNTI Turbo', 'Mocowania dyferencjału WUT-7', 'Mocowania silnika WUT-7'],
    },
    { slug: 'franek-kajdzik',        name: 'Franek Kajdzik',        dept: 'engine' },
    { slug: 'michal-milaniuk',       name: 'Michał Milaniuk',       dept: 'engine' },
    { slug: 'jakub-dzikowski',       name: 'Jakub Dzikowski',       dept: 'engine' },
    { slug: 'mikolaj-klonowski',     name: 'Mikołaj Klonowski',     dept: 'engine' },
    {
        slug: 'igor-syska', name: 'Igor Syska', dept: 'engine',
        bio: 'Student trzeciego roku Mechaniki i Budowy Maszyn. Od 2023 roku w dziale silnika. Zajmuję się technologicznością elementów i zaawansowanymi technikami, np. ulepszaniem cieplnym. Interesują mnie symulacje MES/CFD/1D, mechanika płynów i materiałoznawstwo.',
        achievements: [{ year: 2023, text: 'FS Austria 2023' }],
        projects: ['Układ turbodoładowania silnika', 'Symulacje silnika 1D', 'Dwukomorowy drukowany catch-tank', 'Obróbka cieplna wydruków AlSi10Mg'],
    },
    { slug: 'kacper-karpinski',      name: 'Kacper Karpiński',      dept: 'engine' },
    { slug: 'michal-mazur',          name: 'Michał Mazur',          dept: 'engine' },
    { slug: 'franciszek-grezbiela',  name: 'Franciszek Grzebiela',  dept: 'engine' },
    { slug: 'krzysztof-gut',         name: 'Krzysztof Gut',         dept: 'engine' },
    { slug: 'albert-kwasniewski',    name: 'Albert Kwaśniewski',    dept: 'engine' },
    {
        slug: 'kazik-michalec', name: 'Kazimierz Michalec', dept: 'engine',
        bio: 'Członek działu silnika — projektuję i wykonuję elementy układu paliwowego bolidu.',
        projects: ['Elementy układu paliwowego'],
    },
    { slug: 'michal-szczawinski',    name: 'Michał Szczawiński',    dept: 'engine' },
    {
        slug: 'antoni-wojcik', name: 'Antoni Wójcik', dept: 'engine',
        bio: 'Interesuję się motoryzacją, sportem i majsterkowaniem.',
        projects: ['Model stanowiska spawalniczego do wydechu', 'Tylna zębatka', 'Łapka sprzęgła i jej mocowanie'],
    },

    // PR
    { slug: 'kuba-kotowicz',         name: 'Kuba Kotowicz',         dept: 'pr', role: 'Koordynator' },
    { slug: 'dagmara-legien',        name: 'Dagmara Legień',        dept: 'pr', role: 'Zastępca koordynatora' },
    { slug: 'michal-wisniewski',     name: 'Michał Wiśniewski',     dept: 'pr', role: 'Fotograf' },
    { slug: 'patrycja-wojcik',       name: 'Patrycja Wójcik',       dept: 'pr' },
    { slug: 'monika-bajura',         name: 'Monika Bajura',         dept: 'pr' },
    { slug: 'szymon-frelik',         name: 'Szymon Frelik',         dept: 'pr' },
    { slug: 'marcelina-hyzy',        name: 'Marcelina Hyży',        dept: 'pr' },
    { slug: 'inka-junko',            name: 'Inka Junko',            dept: 'pr' },
    { slug: 'zofia-kosmala',         name: 'Zofia Kosmala',         dept: 'pr' },
    { slug: 'kacper-kozak',          name: 'Kacper Kozak',          dept: 'pr' },
    { slug: 'karolina-zawadzka',     name: 'Karolina Zawadzka',     dept: 'pr' },
    { slug: 'marcin-malczewski',     name: 'Marcin Malczewski',     dept: 'pr' },

    // LOGISTYKA
    {
        slug: 'antek-starczynowski', name: 'Antek Starczynowski', dept: 'logistics', role: 'Koordynator',
        bio: 'W kole staram się zapewnić utrzymanie operacyjności oraz statusu najaktywniejszego koła naukowego PW. Prywatnie jestem trenerem piłkarskim dzieciaków, lubię gotować. Książki, futbol, windsurfing.',
        achievements: [{ year: 2025, text: 'FS Czechy 2025' }],
        projects: ['Business Plan Presentation \'26', 'Akcelerator Kół Naukowych \'25', 'Wszystkie targi'],
    },
    { slug: 'dagmara-kucharczyk',    name: 'Dagmara Kucharczyk',    dept: 'logistics' },
    { slug: 'jakub-michalec',        name: 'Jakub Michalec',        dept: 'logistics' },
    { slug: 'zofia-ladunkin',        name: 'Zofia Ładunkin',        dept: 'logistics' },
    { slug: 'olena-stakhiv',         name: 'Olena Stakhiv',         dept: 'logistics' },
];

window.WUT_getRole = function(m) {
    if (m.role) return m.role;
    return window.WUT_DEPT_INFO[m.dept] ? window.WUT_DEPT_INFO[m.dept].defaultRole : 'Członek zespołu';
};

window.WUT_getDeptLabel = function(m) {
    return window.WUT_DEPT_INFO[m.dept] ? window.WUT_DEPT_INFO[m.dept].label : '—';
};

// imie.nazwisko@wutracing.pl z polskimi znakami zamienionymi na ascii
window.WUT_getEmail = function(m) {
    const map = { 'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ż':'z','ź':'z' };
    const ascii = m.name.toLowerCase().replace(/[ąćęłńóśżź]/g, ch => map[ch] || ch);
    const parts = ascii.split(/\s+/);
    const first = parts.shift();
    const rest = parts.join('.');
    return `${first}.${rest}@wutracing.pl`;
};
