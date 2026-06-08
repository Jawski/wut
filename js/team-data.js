// dane czlonkow zespolu wedlug dzialow

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
    { slug: 'kuba-pacocha',          name: 'Jakub Pacocha',          dept: 'zarzad', role: 'Prezes' },
    { slug: 'bartek-pietrzak',       name: 'Bartosz Pietrzak',       dept: 'zarzad', role: 'Wiceprezes ds. operacyjno-finansowych' },
    { slug: 'grzes-radzikowski',     name: 'Grzegorz Radzikowski',   dept: 'zarzad', role: 'Wiceprezes ds. technicznych' },

    // AERODYNAMIKA
    { slug: 'iga-gamska',            name: 'Iga Damska',             dept: 'aero', role: 'Koordynator' },
    { slug: 'benek-jez',             name: 'Benedykt Jeż',           dept: 'aero', role: 'Zastępca koordynatora' },
    { slug: 'mateusz-krajewski',     name: 'Jakub Krajewski',        dept: 'aero', role: 'Zastępca koordynatora' },
    { slug: 'magda-sienska',         name: 'Magdalena Sieńska',      dept: 'aero' },
    { slug: 'milosz-niedziela',      name: 'Miłosz Niedziela',       dept: 'aero' },
    { slug: 'ola-bres',              name: 'Aleksandra Bereś',       dept: 'aero' },
    { slug: 'kamil-grabowski',       name: 'Kamil Grabowski',        dept: 'aero' },
    { slug: 'stefan-jozefowicz-okonkwo', name: 'Stefan Józefowicz-Okonkwo', dept: 'aero' },
    { slug: 'szymon-rosinski',       name: 'Szymon Rosiński',        dept: 'aero' },
    { slug: 'oliwier-jurczak',       name: 'Oliwier Jurczak',        dept: 'aero' },
    { slug: 'lena-kaliszewska',      name: 'Lena Kaliszewska',       dept: 'aero' },
    { slug: 'franciszek-knecht',     name: 'Franciszek Knecht',      dept: 'aero' },
    { slug: 'mikolaj-konicki',       name: 'Mikołaj Konicki',        dept: 'aero' },
    { slug: 'pawel-kruk',            name: 'Paweł Kruk',             dept: 'aero' },
    { slug: 'malwina-kudlak',        name: 'Malwina Kudlak',         dept: 'aero' },
    { slug: 'mikolaj-magnuski',      name: 'Mikołaj Magnuski',       dept: 'aero' },
    { slug: 'marta-mnich',           name: 'Marta Mnich',            dept: 'aero' },
    { slug: 'wiktor-mikolajczyk',    name: 'Wiktor Mikołajczyk',     dept: 'aero' },
    { slug: 'jan-oziemski',          name: 'Jan Oziemski',           dept: 'aero' },
    { slug: 'patryk-pietrzykowski',  name: 'Patryk Pietrzykowski',   dept: 'aero' },
    { slug: 'nikodem-wera',          name: 'Nikodem Wera',           dept: 'aero' },

    // CHASSIS
    { slug: 'grzes-spruch',          name: 'Grzegorz Spruch',        dept: 'chassis', role: 'Koordynator' },
    { slug: 'mikolaj-cieslak',       name: 'Mikołaj Cieślak',        dept: 'chassis', role: 'Zastępca koordynatora' },
    { slug: 'aleksander-abramowicz', name: 'Aleksander Abramowicz',  dept: 'chassis' },
    { slug: 'bartlomiej-misurski',   name: 'Bartłomiej Misiurski',   dept: 'chassis' },
    { slug: 'michal-morawski',       name: 'Michał Morawski',        dept: 'chassis' },
    { slug: 'aleksy-dorota',         name: 'Aleksy Dorota',          dept: 'chassis' },
    { slug: 'marcin-gruszczynski',   name: 'Marcin Gruszczyński',    dept: 'chassis' },
    { slug: 'piotr-kilianczyk',      name: 'Piotr Kiliańczyk',       dept: 'chassis' },
    { slug: 'piotr-piwowarski',      name: 'Piotr Piwowarski',       dept: 'chassis' },

    // ZAWIESZENIE
    { slug: 'tomasz-zaleski',        name: 'Tomasz Zaleski',         dept: 'suspension', role: 'Koordynator' },
    { slug: 'ian-gjelleboll',        name: 'Ian Gjellebol',          dept: 'suspension', role: 'Zastępca koordynatora' },
    { slug: 'maks-wozniak',          name: 'Maksymilian Woźniak',    dept: 'suspension', role: 'Zastępca koordynatora' },
    { slug: 'tomek-kolakowski',      name: 'Tomasz Kołakowski',      dept: 'suspension' },
    { slug: 'grzes-siedlecki',       name: 'Grzegorz Siedlecki',     dept: 'suspension' },
    { slug: 'damian-czerwiec',       name: 'Damian Czerwiec',        dept: 'suspension' },
    { slug: 'tamara-saganek',        name: 'Tamara Saganek',         dept: 'suspension' },
    { slug: 'dominik-werpachowski',  name: 'Dominik Werpachowski',   dept: 'suspension' },
    { slug: 'mateusz-jozwiak',       name: 'Mateusz Jóźwiak',        dept: 'suspension' },
    { slug: 'bartlomiej-kolacz',     name: 'Bartłomiej Kołacz',      dept: 'suspension' },
    { slug: 'leon-koslarz',          name: 'Leonard Kosiacz',        dept: 'suspension' },
    { slug: 'paulina-macek',         name: 'Paulina Macek',          dept: 'suspension' },
    { slug: 'jan-rode',              name: 'Jan Rode',               dept: 'suspension' },
    { slug: 'adam-tumidajewicz',     name: 'Adam Tumidajewicz',      dept: 'suspension' },
    { slug: 'tomasz-wrobel',         name: 'Tomasz Wróbel',          dept: 'suspension' },

    // ELEKTRONIKA
    { slug: 'michal-zielinski',      name: 'Michał Zieliński',       dept: 'electronics', role: 'Koordynator' },
    { slug: 'blazej-molas',          name: 'Błażej Molas',           dept: 'electronics', role: 'Zastępca koordynatora' },
    { slug: 'kacper-kowalski',       name: 'Kacper Kowalski',        dept: 'electronics' },
    { slug: 'mateusz-drabarek',      name: 'Mateusz Drabarek',       dept: 'electronics' },
    { slug: 'patrycja-wozniak',      name: 'Patrycja Woźniak',       dept: 'electronics' },
    { slug: 'kasia-matejuk',         name: 'Katarzyna Matejuk',      dept: 'electronics' },
    { slug: 'tymoteusz-celmer',      name: 'Tymoteusz Celmer',       dept: 'electronics' },
    { slug: 'robert-gruszczynski',   name: 'Robert Gruszczyński',    dept: 'electronics' },
    { slug: 'jan-maciag',            name: 'Jan Maciąg',             dept: 'electronics' },

    // SILNIK
    { slug: 'mateusz-makarewicz',    name: 'Mateusz Makarewicz',     dept: 'engine', role: 'Koordynator' },
    { slug: 'kuba-czarzasty',        name: 'Jakub Czarzasty',        dept: 'engine', role: 'Zastępca koordynatora' },
    { slug: 'franek-kajdzik',        name: 'Franciszek Kajdzik',     dept: 'engine' },
    { slug: 'michal-milaniuk',       name: 'Michał Milaniuk',        dept: 'engine' },
    { slug: 'jakub-dzikowski',       name: 'Jakub Dzikowski',        dept: 'engine' },
    { slug: 'mikolaj-klonowski',     name: 'Mikołaj Klonowski',      dept: 'engine' },
    { slug: 'igor-syska',            name: 'Igor Syska',             dept: 'engine' },
    { slug: 'kacper-karpinski',      name: 'Kacper Karpiński',       dept: 'engine' },
    { slug: 'michal-mazur',          name: 'Michał Mazur',           dept: 'engine' },
    { slug: 'franciszek-grezbiela',  name: 'Franciszek Grzebiela',   dept: 'engine' },
    { slug: 'krzysztof-gut',         name: 'Krzysztof Gut',          dept: 'engine' },
    { slug: 'albert-kwasniewski',    name: 'Albert Kwaśniewski',     dept: 'engine' },
    { slug: 'kazik-michalec',        name: 'Kazimierz Michalec',     dept: 'engine' },
    { slug: 'michal-szczawinski',    name: 'Michał Szczawiński',     dept: 'engine' },
    { slug: 'antoni-wojcik',         name: 'Antoni Wójcik',          dept: 'engine' },

    // PR
    { slug: 'kuba-kotowicz',         name: 'Jakub Kotowicz',         dept: 'pr', role: 'Koordynator' },
    { slug: 'dagmara-legien',        name: 'Dagmara Legień',         dept: 'pr', role: 'Zastępca koordynatora' },
    { slug: 'michal-wisniewski',     name: 'Michał Wiśniewski',      dept: 'pr', role: 'Fotograf' },
    { slug: 'patrycja-wojcik',       name: 'Patrycja Wójcik',        dept: 'pr' },
    { slug: 'monika-bajura',         name: 'Monika Bajora',          dept: 'pr' },
    { slug: 'szymon-frelik',         name: 'Szymon Frelik',          dept: 'pr' },
    { slug: 'marcelina-hyzy',        name: 'Marcelina Hyży',         dept: 'pr' },
    { slug: 'inka-junko',            name: 'Ina Junko',              dept: 'pr' },
    { slug: 'zofia-kosmala',         name: 'Zofia Kosmala',          dept: 'pr' },
    { slug: 'kacper-kozak',          name: 'Kacper Kozak',           dept: 'pr' },
    { slug: 'karolina-zawadzka',     name: 'Karolina Zawadzka',      dept: 'pr' },
    { slug: 'marcin-malczewski',     name: 'Marcin Malczewski',      dept: 'pr' },

    // LOGISTYKA
    { slug: 'antek-starczynowski',   name: 'Antoni Starczynowski',   dept: 'logistics', role: 'Koordynator' },
    { slug: 'dagmara-kucharczyk',    name: 'Dagmara Kucharczyk',     dept: 'logistics' },
    { slug: 'jakub-michalec',        name: 'Jakub Michalec',         dept: 'logistics' },
    { slug: 'zofia-ladunkin',        name: 'Zofia Ładunkin',         dept: 'logistics' },
    { slug: 'olena-stakhiv',         name: 'Olena Stakhiv',          dept: 'logistics' },
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
