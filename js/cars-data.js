export const CARS = [
    {
        id: 'wut6',
        gen: 'VI',
        year: 2026,
        name: 'WUT6',
        sub: 'Generacja obecna · Sezon 2026',
        tagline: 'Trzyelementowe skrzydła, własna jednostka sterująca, najszybszy bolid w historii koła.',
        color: '#e10600',
        hero: {
            chip: 'Sezon 2026 · Formula Student Combustion',
            kicker: 'Szósta generacja',
            description: 'Trzyelementowe aero, jednocylindrowy KTM 690 i pierwszy w historii koła własny moduł sterujący silnikiem.',
        },
        story: [
            {
                kicker: '01 · Silnik',
                title: 'Jednocylindrowy <span class="text-accent">KTM 690</span>.',
                p1: 'KTM 690 LC4 — najpopularniejszy jednostka napędowa w klasie Formula Student Combustion. 690 cm³, suchy ciężar 47 kg, doskonały stosunek mocy do masy.',
                p2: 'Custom intake z dolnym wlotem, własny układ wydechowy 4-1 ze stali nierdzewnej i przyspawane przez nas pierwotne kolektory.',
                stats: [
                    { val: 58, unit: 'kW', lbl: 'Moc szczytowa' },
                    { val: 75, unit: 'Nm', lbl: 'Moment maks.' },
                ],
            },
            {
                kicker: '02 · Aerodynamika',
                title: 'Trzy elementy. <span class="text-accent">120 kg docisku</span>.',
                p1: 'Trzyelementowy przedni splitter, dyfuzor z wewnętrznymi strake&apos;ami i tylne skrzydło z aktywną klapą DRS — wszystkie elementy laminowane w autoklawie z karbonu T700.',
                p2: 'Symulacje CFD w ANSYS Fluent na siatce 80M komórek, walidacja w tunelu aerodynamicznym Politechniki Warszawskiej.',
            },
            {
                kicker: '03 · Podwozie',
                title: 'Spawana <span class="text-accent">rama 25CrMo4</span>.',
                p1: 'Stalowa rama spawana TIG z rur 25CrMo4. Push-rod z amortyzatorami Öhlins, wahacze własnej konstrukcji z 7075-T6.',
                p2: 'Blokowany dyferencjał Drexlera, własne piasty z 7075, 10-calowe magnezowe felgi OZ Racing.',
            },
            {
                kicker: '04 · Elektronika',
                title: 'Własne <span class="text-accent">ECU</span>.',
                p1: 'Pierwsza w historii koła własna jednostka sterująca silnikiem (ECU) oparta o STM32H7. Mapy paliwowe i zapłonowe kalibrowane na hamowni.',
                p2: 'Pełna telemetria 1 kHz po szynie CAN, dashboard AiM, system DRS z paddle shifter na kierownicy.',
            },
            {
                kicker: '05 · Osiągi',
                title: 'Sprint do setki w <span class="text-accent">3.8 s</span>.',
                p1: 'Lekki, mocny, z dużym dociskiem. WUT6 to nasza odpowiedź na rosnące wymagania w klasie FS Combustion — sprint, hamowanie i pewność prowadzenia w slalomie.',
                stats: [
                    { val: 3.8, unit: 's', lbl: '0 → 100 km/h' },
                    { val: 215, unit: 'kg', lbl: 'Masa bolidu' },
                ],
            },
        ],
        specs: {
            'Wymiary i masa': {
                'Długość': '2840 mm',
                'Szerokość': '1450 mm',
                'Rozstaw osi': '1535 mm',
                'Masa': '215 kg',
            },
            'Silnik': {
                'Konfiguracja': 'KTM 690 LC4, 1-cyl',
                'Pojemność': '690 cm³',
                'Moc szczyt.': '58 kW (79 HP)',
                'Moment maks.': '75 Nm',
            },
            'Napęd': {
                'Skrzynia': '6-bieg. sekwencyjna',
                'Przeniesienie': 'Łańcuch + LSD Drexler',
                'Mapy ECU': '4 (Sprint / Endurance / Wet / Eco)',
            },
            'Osiągi': {
                '0 – 100 km/h': '3.8 s',
                'V max': '130 km/h',
                'Downforce @ 60': '120 kg',
                'Akceleracja boczna': '1.9 g',
            },
            'Konstrukcja': {
                'Rama': 'Spawana 25CrMo4',
                'Zawieszenie': 'Push-rod, podwójne wahacze',
                'Hamulce': 'AP Racing CP4226 4-tłoczkowe',
                'Felgi': 'Magnez OZ Racing, 10"',
            },
        },
        achievements: [
            '2026 — Sezon w toku',
        ],
    },

    {
        id: 'wut5',
        gen: 'V',
        year: 2022,
        name: 'WUT5',
        sub: 'Sezon 2022–2023',
        tagline: 'Pierwszy bolid koła z dyferencjałem Drexlera i 10-calowymi magnezowymi felgami.',
        color: '#a30400',
        hero: {
            chip: 'Sezon 2022 · Formula Student Combustion',
            kicker: 'Piąta generacja',
            description: 'Nowy układ wydechowy, dyferencjał Drexler LSD, magnezowe felgi OZ.',
        },
        story: [
            {
                kicker: '01 · Silnik',
                title: 'KTM 690 LC4 z <span class="text-accent">własnym wydechem</span>.',
                p1: 'KTM 690 LC4 Enduro. Pierwszy nasz silnik z indywidualnie wykonanym układem wydechowym, kalibrowanym pod krzywą momentu Endurance.',
                p2: 'Mokra masa silnika 52 kg, suchy filtr powietrza z wlotem przez owiewkę cockpitu.',
                stats: [
                    { val: 56, unit: 'kW', lbl: 'Moc szczytowa' },
                    { val: 72, unit: 'Nm', lbl: 'Moment maks.' },
                ],
            },
            {
                kicker: '02 · Aero',
                title: '<span class="text-accent">Dwuelementowe</span> skrzydła.',
                p1: 'Pełny zestaw karbonowych aero: dwuelementowe skrzydło przednie i tylne, krótki dyfuzor.',
                p2: '95 kg docisku przy 60 km/h — wyraźny wzrost względem poprzedniej generacji.',
            },
            {
                kicker: '03 · Podwozie',
                title: '<span class="text-accent">Drexler LSD</span> + magnez.',
                p1: 'Najlepszy w klasie Formula Student blokowany dyferencjał Drexlera. Pierwsze magnezowe felgi w historii koła.',
                p2: 'Hamulce Wilwood, 10-calowe slicki Hoosier R25B.',
            },
            {
                kicker: '04 · Osiągi',
                title: 'Najszybszy w slalomie.',
                p1: 'Krótki rozstaw kół i agresywny setup zawieszenia czynią z WUT5 narzędzie do slalomów — najlepsze wyniki w Autocross w historii koła.',
                stats: [
                    { val: 4.1, unit: 's', lbl: '0 → 100 km/h' },
                    { val: 200, unit: 'kg', lbl: 'Masa bolidu' },
                ],
            },
        ],
        specs: {
            'Wymiary i masa': {
                'Długość': '2810 mm',
                'Szerokość': '1430 mm',
                'Rozstaw osi': '1525 mm',
                'Masa': '200 kg',
            },
            'Silnik': {
                'Konfiguracja': 'KTM 690 LC4 Enduro',
                'Pojemność': '690 cm³',
                'Moc szczyt.': '56 kW (76 HP)',
                'Moment maks.': '72 Nm',
            },
            'Napęd': {
                'Skrzynia': '6-bieg. sekwencyjna',
                'Przeniesienie': 'Łańcuch + LSD Drexler',
            },
            'Osiągi': {
                '0 – 100 km/h': '4.1 s',
                'V max': '128 km/h',
                'Downforce @ 60': '95 kg',
            },
            'Konstrukcja': {
                'Rama': 'Spawana stal',
                'Zawieszenie': 'Push-rod',
                'Hamulce': 'Wilwood Dynalite',
                'Felgi': 'Magnez OZ, 10"',
            },
        },
        achievements: [
            '2023 — Najszybsze okrążenie Autocross FS Czech',
            '2022 — Debiut WUT5 na FS East',
        ],
    },

    {
        id: 'wut4',
        gen: 'IV',
        year: 2019,
        name: 'WUT4',
        sub: 'Sezon 2019–2020',
        tagline: 'Pełny karbonowy zestaw aero i push-rod od podstaw.',
        color: '#c9302c',
        hero: {
            chip: 'Sezon 2019 · Formula Student Combustion',
            kicker: 'Czwarta generacja',
            description: 'Pierwsze w pełni karbonowe aero koła i nowa kinematyka zawieszenia push-rod.',
        },
        story: [
            {
                kicker: '01 · Silnik',
                title: '<span class="text-accent">KTM 690</span> — kontynuacja.',
                p1: 'Sprawdzony jednocylindrowy KTM 690 LC4 z optymalizowanym wlotem powietrza i zoptymalizowaną krzywą mocy.',
                stats: [
                    { val: 55, unit: 'kW', lbl: 'Moc szczytowa' },
                ],
            },
            {
                kicker: '02 · Aero',
                title: 'Wszystko z <span class="text-accent">karbonu</span>.',
                p1: 'Pierwszy bolid koła z pełnym, w pełni karbonowym zestawem aero. Wszystkie skrzydła i panele dyfuzora laminowane w autoklawie sponsora.',
                p2: 'Nieduży docisk względem nowszych generacji, ale 8x lżejszy niż starsza aluminiowa wersja.',
            },
            {
                kicker: '03 · Podwozie',
                title: '<span class="text-accent">Push-rod</span> od podstaw.',
                p1: 'Nowy układ zawieszenia push-rod z wahaczami z 7075. Lepsze prowadzenie w slalomach, większa odporność na klimat tunelu.',
            },
        ],
        specs: {
            'Wymiary i masa': {
                'Długość': '2790 mm',
                'Szerokość': '1420 mm',
                'Rozstaw osi': '1515 mm',
                'Masa': '205 kg',
            },
            'Silnik': {
                'Konfiguracja': 'KTM 690 LC4',
                'Pojemność': '690 cm³',
                'Moc szczyt.': '55 kW (75 HP)',
            },
            'Osiągi': {
                '0 – 100 km/h': '4.3 s',
                'V max': '125 km/h',
                'Downforce @ 60': '78 kg',
            },
            'Konstrukcja': {
                'Rama': 'Spawana stal',
                'Zawieszenie': 'Push-rod (NEW)',
                'Hamulce': 'Brembo',
                'Felgi': 'Aluminium, 13"',
            },
        },
        achievements: [
            '2020 — Pierwszy w historii koła pełny karbonowy aero kit',
        ],
    },

    {
        id: 'wut3',
        gen: 'III',
        year: 2017,
        name: 'WUT3',
        sub: 'Sezon 2017–2018',
        tagline: 'Pierwsze podium w historii koła — Cost & Manufacturing.',
        color: '#b62a23',
        hero: {
            chip: 'Sezon 2017 · Formula Student Combustion',
            kicker: 'Trzecia generacja',
            description: 'Pierwsze podium koła. KTM 690, pierwsze karbonowe skrzydła.',
        },
        story: [
            {
                kicker: '01 · Silnik',
                title: 'Debiut <span class="text-accent">KTM 690</span>.',
                p1: 'Pierwsza generacja koła z silnikiem KTM 690 LC4. Lżejszy i prostszy w obsłudze niż wcześniejszy 4-cylindrowy Honda CBR.',
                stats: [
                    { val: 52, unit: 'kW', lbl: 'Moc szczytowa' },
                ],
            },
            {
                kicker: '02 · Aero',
                title: 'Pierwsze <span class="text-accent">karbonowe skrzydła</span>.',
                p1: 'Częściowo karbonowy zestaw aero — skrzydło przednie i tylne. Reszta paneli z włókna szklanego.',
            },
            {
                kicker: '03 · Podwozie',
                title: 'Stalowa <span class="text-accent">space frame</span>.',
                p1: 'Tradycyjna stalowa rama spawana TIG z rur okrągłych. Wahacze pull-rod z aluminium.',
            },
        ],
        specs: {
            'Wymiary i masa': {
                'Długość': '2780 mm',
                'Szerokość': '1410 mm',
                'Rozstaw osi': '1510 mm',
                'Masa': '215 kg',
            },
            'Silnik': {
                'Konfiguracja': 'KTM 690 LC4',
                'Pojemność': '690 cm³',
                'Moc szczyt.': '52 kW (71 HP)',
            },
            'Osiągi': {
                '0 – 100 km/h': '4.5 s',
                'V max': '125 km/h',
                'Downforce @ 60': '64 kg',
            },
            'Konstrukcja': {
                'Rama': 'Spawana stal',
                'Zawieszenie': 'Pull-rod',
                'Hamulce': 'Brembo',
                'Felgi': 'Aluminium, 13"',
            },
        },
        achievements: [
            '2018 — 3. miejsce Cost & Manufacturing — FS East (Hungaroring)',
            '2017 — Pierwsze karbonowe elementy aero',
        ],
    },

    {
        id: 'wut2',
        gen: 'II',
        year: 2015,
        name: 'WUT2',
        sub: 'Sezon 2015–2016',
        tagline: 'Czterocylindrowy Honda CBR — najmocniejszy silnik w historii koła.',
        color: '#a82822',
        hero: {
            chip: 'Sezon 2015 · Formula Student Combustion',
            kicker: 'Druga generacja',
            description: 'Honda CBR600RR i pierwszy w historii koła Endurance ukończony bez awarii.',
        },
        story: [
            {
                kicker: '01 · Silnik',
                title: '<span class="text-accent">Honda CBR600RR</span> — 4 cylindry.',
                p1: 'Czterocylindrowy silnik 600 cm³ z motocykla Honda CBR. Wyższa moc szczytowa niż w jednocylindrowcach, ale i wyższa masa.',
                p2: 'Wymagał układu wydechowego 4-1 i dłuższego intake&apos;u — wyzwanie inżynierskie pełną gębą.',
                stats: [
                    { val: 60, unit: 'kW', lbl: 'Moc szczytowa' },
                ],
            },
            {
                kicker: '02 · Konstrukcja',
                title: 'Stalowa <span class="text-accent">space frame</span>.',
                p1: 'Sprawdzona stalowa rama. Aluminiowe felgi 13" i hamulce AP Racing.',
            },
        ],
        specs: {
            'Wymiary i masa': {
                'Długość': '2760 mm',
                'Szerokość': '1390 mm',
                'Rozstaw osi': '1500 mm',
                'Masa': '232 kg',
            },
            'Silnik': {
                'Konfiguracja': 'Honda CBR600RR 4-cyl',
                'Pojemność': '600 cm³',
                'Moc szczyt.': '60 kW (82 HP)',
            },
            'Osiągi': {
                '0 – 100 km/h': '4.5 s',
                'V max': '130 km/h',
            },
            'Konstrukcja': {
                'Rama': 'Spawana stal',
                'Zawieszenie': 'Push-rod',
                'Hamulce': 'AP Racing',
                'Felgi': 'Aluminium, 13"',
            },
        },
        achievements: [
            '2016 — Pierwsze ukończenie Endurance — FS Czech',
            '2015 — Pierwszy bolid koła z silnikiem 4-cylindrowym',
        ],
    },

    {
        id: 'wut1',
        gen: 'I',
        year: 2013,
        name: 'WUT1',
        sub: 'Sezon 2013–2014',
        tagline: 'Tam, gdzie wszystko się zaczęło.',
        color: '#8b2018',
        hero: {
            chip: 'Sezon 2013 · Formula Student Combustion',
            kicker: 'Pierwsza generacja',
            description: 'KTM 525, stalowa rama, włókno szklane — debiut WUT Racing na arenie międzynarodowej.',
        },
        story: [
            {
                kicker: '01 · Silnik',
                title: '<span class="text-accent">KTM 525</span> — debiut.',
                p1: 'Jednocylindrowy KTM 525 z silnika motocyklowego. Mały, lekki, prosty w obsłudze — idealny start dla nowego zespołu.',
                stats: [
                    { val: 38, unit: 'kW', lbl: 'Moc szczytowa' },
                ],
            },
            {
                kicker: '02 · Konstrukcja',
                title: 'Pierwszy <span class="text-accent">bolid od zera</span>.',
                p1: 'Wszystko zaprojektowane i zbudowane w ciągu 13 miesięcy przez grupę studentów SiMR Politechniki Warszawskiej. Włókno szklane jako materiał aero.',
            },
        ],
        specs: {
            'Wymiary i masa': {
                'Długość': '2750 mm',
                'Szerokość': '1400 mm',
                'Rozstaw osi': '1500 mm',
                'Masa': '248 kg',
            },
            'Silnik': {
                'Konfiguracja': 'KTM 525 1-cyl',
                'Pojemność': '525 cm³',
                'Moc szczyt.': '38 kW (52 HP)',
            },
            'Osiągi': {
                '0 – 100 km/h': '5.4 s',
                'V max': '110 km/h',
            },
            'Konstrukcja': {
                'Rama': 'Spawana stal',
                'Zawieszenie': 'Push-rod',
                'Hamulce': 'Brembo',
                'Felgi': 'Aluminium, 13"',
            },
        },
        achievements: [
            '2014 — Pierwsze ukończenie Acceleration na FS Germany',
            '2013 — Debiut WUT Racing na arenie międzynarodowej',
        ],
    },
];

export function findCar(id) {
    return CARS.find((c) => c.id === id);
}
