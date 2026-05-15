/* ============================================
   Team data — shared by zespol.html and czlonek.html.
   Edytuj `dept`, `role`, `since`, `studies`, `bio`,
   `achievements`, `projects`, `events` per osobie.
   ============================================ */

window.WUT_DEPT_FILTERS = [
    { id: 'all',         label: 'Wszyscy' },
    { id: 'zarzad',      label: 'Zarząd' },
    { id: 'aero',        label: 'Aero' },
    { id: 'powertrain',  label: 'Powertrain' },
    { id: 'electronics', label: 'Elektronika' },
    { id: 'chassis',     label: 'Chassis' },
    { id: 'composites',  label: 'Kompozyty' },
    { id: 'business',    label: 'Business' },
    { id: 'driver',      label: 'Kierowcy' },
];

window.WUT_DEPT_INFO = {
    zarzad:      { label: 'Zarząd',      defaultRole: 'Zarząd',                       projectExamples: ['Strategia sezonu', 'Plan budżetu', 'Negocjacje z partnerami'] },
    aero:        { label: 'Aero',        defaultRole: 'Inżynier aerodynamiki',         projectExamples: ['Symulacje CFD podwozia', 'Projekt skrzydła przedniego', 'Badania w tunelu aerodynamicznym'] },
    powertrain:  { label: 'Powertrain',  defaultRole: 'Inżynier powertrain',           projectExamples: ['Mapy paliwowe ECU', 'Układ wydechowy 4-1', 'Stanowisko hamowniane silnika'] },
    electronics: { label: 'Elektronika', defaultRole: 'Inżynier elektroniki',          projectExamples: ['Projekt PCB VCU', 'Szyna CAN bus', 'Telemetria 1 kHz'] },
    chassis:     { label: 'Chassis',     defaultRole: 'Inżynier nadwozia i zawieszenia', projectExamples: ['Geometria zawieszenia', 'Spawanie ramy 25CrMo4', 'Mocowania silnika'] },
    composites:  { label: 'Kompozyty',   defaultRole: 'Inżynier kompozytów',           projectExamples: ['Laminowanie monokoku', 'Karbonowe panele aero', 'Wyklejanie form'] },
    business:    { label: 'Business',    defaultRole: 'Business & Marketing',          projectExamples: ['Pozyskanie sponsora głównego', 'Cost Report na zawodach', 'Social media zasięg +200%'] },
    driver:      { label: 'Kierowcy',    defaultRole: 'Kierowca',                       projectExamples: ['Sesje testowe bolidu', 'Setup samochodu', 'Analiza danych telemetrycznych'] },
};

window.WUT_TEAM = [
    { slug: 'aleksy-dorota',         name: 'Aleksy Dorota',         dept: 'electronics' },
    { slug: 'antek-starczynowski',   name: 'Antek Starczynowski',   dept: 'powertrain'  },
    { slug: 'antoni-wojcik',         name: 'Antoni Wójcik',         dept: 'chassis'     },
    { slug: 'bartek-pietrzak',       name: 'Bartek Pietrzak',       dept: 'aero'        },
    { slug: 'bartlomiej-kolacz',     name: 'Bartłomiej Kołacz',     dept: 'composites'  },
    { slug: 'bartlomiej-misurski',   name: 'Bartłomiej Misurski',   dept: 'electronics' },
    { slug: 'blazej-molas',          name: 'Błażej Molas',          dept: 'chassis'     },
    { slug: 'dagmara-kucharczyk',    name: 'Dagmara Kucharczyk',    dept: 'business'    },
    { slug: 'damian-czerwiec',       name: 'Damian Czerwiec',       dept: 'powertrain'  },
    { slug: 'franciszek-grezbiela',  name: 'Franciszek Grzebiela',  dept: 'aero'        },
    { slug: 'franek-kajdzik',        name: 'Franek Kajdzik',        dept: 'electronics' },
    { slug: 'grzes-radzikowski',     name: 'Grzegorz Radzikowski',  dept: 'chassis'     },
    { slug: 'grzes-siedlecki',       name: 'Grzegorz Siedlecki',    dept: 'powertrain'  },
    { slug: 'grzes-spruch',          name: 'Grzegorz Spruch',       dept: 'composites'  },
    { slug: 'ian-gjelleboll',        name: 'Ian Gjelleboll',        dept: 'aero'        },
    { slug: 'iga-gamska',            name: 'Iga Gamska',            dept: 'business'    },
    { slug: 'igor-syska',            name: 'Igor Syska',            dept: 'electronics' },
    { slug: 'inka-junko',            name: 'Inka Junko',            dept: 'business'    },
    { slug: 'jakub-michalec',        name: 'Jakub Michalec',        dept: 'chassis'     },
    { slug: 'jan-maciag',            name: 'Jan Maciąg',            dept: 'powertrain'  },
    { slug: 'jan-oziemski',          name: 'Jan Oziemski',          dept: 'aero'        },
    { slug: 'jan-rode',              name: 'Jan Rode',              dept: 'composites'  },
    { slug: 'kacper-karpinski',      name: 'Kacper Karpiński',      dept: 'electronics' },
    { slug: 'kacper-kozak',          name: 'Kacper Kozak',          dept: 'driver'      },
    { slug: 'kamil-grabowski',       name: 'Kamil Grabowski',       dept: 'chassis'     },
    { slug: 'karolina-zawadzka',     name: 'Karolina Zawadzka',     dept: 'business'    },
    { slug: 'kasia-matejuk',         name: 'Katarzyna Matejuk',     dept: 'aero'        },
    { slug: 'kazik-michalec',        name: 'Kazimierz Michalec',    dept: 'powertrain'  },
    { slug: 'krzysztof-gut',         name: 'Krzysztof Gut',         dept: 'zarzad',     role: 'Team Captain' },
    { slug: 'kuba-czarzasty',        name: 'Kuba Czarzasty',        dept: 'composites'  },
    { slug: 'kuba-kotowicz',         name: 'Kuba Kotowicz',         dept: 'electronics' },
    { slug: 'kuba-kraj',             name: 'Kuba Kraj',             dept: 'chassis'     },
    { slug: 'kuba-pacocha',          name: 'Kuba Pacocha',          dept: 'powertrain'  },
    { slug: 'lena-kaliszewska',      name: 'Lena Kaliszewska',      dept: 'business'    },
    { slug: 'leon-koslarz',          name: 'Leon Koślarz',          dept: 'aero'        },
    { slug: 'magda-sienska',         name: 'Magda Sieńska',         dept: 'composites'  },
    { slug: 'maks-wozniak',          name: 'Maks Woźniak',          dept: 'driver'      },
    { slug: 'malwina-kudlak',        name: 'Malwina Kudlak',        dept: 'business'    },
    { slug: 'marcelina-hyzy',        name: 'Marcelina Hyży',        dept: 'electronics' },
    { slug: 'mateusz-drabarek',      name: 'Mateusz Drabarek',      dept: 'chassis'     },
    { slug: 'mateusz-jozwiak',       name: 'Mateusz Jóźwiak',       dept: 'powertrain'  },
    { slug: 'mateusz-krajewski',     name: 'Mateusz Krajewski',     dept: 'aero'        },
    { slug: 'mateusz-makarewicz',    name: 'Mateusz Makarewicz',    dept: 'composites'  },
    { slug: 'michal-mazur',          name: 'Michał Mazur',          dept: 'electronics' },
    { slug: 'michal-milaniuk',       name: 'Michał Milaniuk',       dept: 'chassis'     },
    { slug: 'michal-morawski',       name: 'Michał Morawski',       dept: 'aero',       role: 'Aerodynamics Lead' },
    { slug: 'michal-wisniewski',     name: 'Michał Wiśniewski',     dept: 'zarzad',     role: 'Chief Engineer' },
    { slug: 'michal-zielinski',      name: 'Michał Zieliński',      dept: 'powertrain', role: 'Powertrain Lead' },
    { slug: 'mikolaj-cieslak',       name: 'Mikołaj Cieślak',       dept: 'composites'  },
    { slug: 'mikolaj-klonowski',     name: 'Mikołaj Klonowski',     dept: 'electronics', role: 'Electronics Lead' },
    { slug: 'mikolaj-magnuski',      name: 'Mikołaj Magnuski',      dept: 'chassis'     },
    { slug: 'monika-bajura',         name: 'Monika Bajura',         dept: 'business',   role: 'Business Lead' },
    { slug: 'nikodem-wera',          name: 'Nikodem Wera',          dept: 'aero'        },
    { slug: 'ola-bres',              name: 'Ola Breś',              dept: 'composites', role: 'Composites Lead' },
    { slug: 'oliwier-jurczak',       name: 'Oliwier Jurczak',       dept: 'electronics' },
    { slug: 'patryk-pietrzykowski',  name: 'Patryk Pietrzykowski',  dept: 'driver'      },
    { slug: 'paulina-macek',         name: 'Paulina Macek',         dept: 'business'    },
    { slug: 'pawel-kruk',            name: 'Paweł Kruk',            dept: 'chassis',    role: 'Chassis Lead' },
    { slug: 'piotr-kilianczyk',      name: 'Piotr Kiliańczyk',      dept: 'powertrain'  },
    { slug: 'piotr-piwowarski',      name: 'Piotr Piwowarski',      dept: 'aero'        },
    { slug: 'robert-gruszczynski',   name: 'Robert Gruszczyński',   dept: 'electronics' },
    { slug: 'szymon-frelik',         name: 'Szymon Frelik',         dept: 'powertrain'  },
    { slug: 'szymon-rosinski',       name: 'Szymon Rosiński',       dept: 'composites'  },
    { slug: 'tamara-saganek',        name: 'Tamara Saganek',        dept: 'business'    },
    { slug: 'tomasz-wrobel',         name: 'Tomasz Wróbel',         dept: 'driver'      },
    { slug: 'tomek-kolakowski',      name: 'Tomek Kołakowski',      dept: 'aero'        },
    { slug: 'wiktor-mikolajczyk',    name: 'Wiktor Mikołajczyk',    dept: 'chassis'     },
    { slug: 'zofia-kosmala',         name: 'Zofia Kosmala',         dept: 'aero'        },
    { slug: 'zofia-ladunkin',        name: 'Zofia Ładunkin',        dept: 'composites'  },
];

// Wspólne helpery
window.WUT_getRole = function(m) {
    if (m.role) return m.role;
    return window.WUT_DEPT_INFO[m.dept] ? window.WUT_DEPT_INFO[m.dept].defaultRole : 'Członek zespołu';
};

window.WUT_getDeptLabel = function(m) {
    return window.WUT_DEPT_INFO[m.dept] ? window.WUT_DEPT_INFO[m.dept].label : '—';
};
