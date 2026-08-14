// dane czlonkow zespolu wedlug dzialow
// opisy, zawody i projekty pochodza z ankiety wypelnionej przez czlonkow

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
    {
        slug: 'kuba-pacocha', name: 'Jakub Pacocha', dept: 'zarzad', role: 'Prezes', since: 2022, studies: 'PW · MEiL',
        bio: 'Obecnie jestem prezesem, do tej pory działałem również jako wiceprezes ds. finansów, oraz koordynator działu Fundraising. Na co dzień lubię jazdę na rowerze oraz śledzę Formułę 1',
        achievements: [{ year: 2023, text: 'Węgry' }, { year: 2024, text: 'Węgry' }, { year: 2024, text: 'Chorwacja' }, { year: 2025, text: 'Austria' }, { year: 2025, text: 'Czechy' }, { year: 2025, text: 'Polska' }, { year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Projekt sidepodów oraz kanałów chłodzących - WUT6', 'Badanie spadku ciśnienia w chłodnicy - WUT6'],
    },
    {
        slug: 'bartek-pietrzak', name: 'Bartosz Pietrzak', dept: 'zarzad', role: 'Wiceprezes ds. operacyjno-finansowych', since: 2024, studies: 'PW · EiTI',
        bio: 'Uczestnik światowych finałów F1 in Schools w Singapurze 2023. Projektuje układy PCB, programuje w C++, C#, Python. Lubi podróżować.',
        achievements: [{ year: 2025, text: 'FS Czech' }, { year: 2025, text: 'FS Poland' }, { year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Projekt panelu LVMS', 'System telemetrii', 'System oświetlenia LED bolidu'],
    },
    {
        slug: 'grzes-radzikowski', name: 'Grzegorz Radzikowski', dept: 'zarzad', role: 'Wiceprezes ds. technicznych',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
    },

    // AERODYNAMIKA
    {
        slug: 'iga-gamska', name: 'Iga Gamska', dept: 'aero', role: 'Koordynator',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }],
    },
    {
        slug: 'benek-jez', name: 'Benedykt Jeż', dept: 'aero', role: 'Zastępca koordynatora', since: 2023, studies: 'PW · MEiL',
        bio: 'W zespole głównie zajmuję się prowadzeniem projektu aerodynamiki i obliczeniami CFD, ale lubię też prace warsztatowe przy wytwarzaniu elementów kompozytowych. W czasie kiedy akurat nie walczę z Fluentem albo nie siedzę na warsztacie lubię grać w kosza, wspinać się, żeglować albo jeździć na nartach :))',
        achievements: [{ year: 2025, text: 'Austria' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Sidepody i kanały chłodzenia WUT-6', 'Złożenia aero i sprinty CFD WUT-7'],
    },
    {
        slug: 'kuba-krajewski', name: 'Jakub Krajewski', dept: 'aero', role: 'Zastępca koordynatora', since: 2024, studies: 'PW · MT',
        bio: 'Kompozyty & Aero. Ręczna obróbka CNC: cięcie i wiele innych. Starszy Dremlowy.',
        achievements: [{ year: 2025, text: 'FS Austria' }, { year: 2025, text: 'FS Czech Republic' }, { year: 2026, text: 'FS Austria' }],
        projects: ['Nakładki aero na koła; endplate tylnego skrzydła'],
    },
    {
        slug: 'magda-sienska', name: 'Magdalena Sieńska', dept: 'aero',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
    },
    {
        slug: 'milosz-niedziela', name: 'Miłosz Niedziela', dept: 'aero',
        achievements: [{ year: 2026, text: 'FS Poland' }],
    },
    {
        slug: 'ola-bres', name: 'Aleksandra Breś', dept: 'aero',
        achievements: [{ year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
    },
    {
        slug: 'kamil-grabowski', name: 'Kamil Grabowski', dept: 'aero',
        achievements: [{ year: 2026, text: 'FS Poland' }],
    },
    {
        slug: 'stefan-jozefowicz-okonkwo', name: 'Stefan Józefowicz-Okonkwo', dept: 'aero',
        achievements: [{ year: 2026, text: 'FS Czech' }],
    },
    {
        slug: 'szymon-rosinski', name: 'Szymon Rosiński', dept: 'aero', since: 2024, studies: 'PW · MEiL',
        bio: 'Studiuję Mechanikę i Projektowanie Maszyn na wydziale MEiL. Jako członek działu aerodynamiki zajmuję się projektowaniem kompozytowych elementów pakietu aerodynamicznego oraz optymalizacją ich geometrii przy pomocy narzędzi CFD. Tworzę również wizualizacje wyników tych obliczeń, a na zawodach fotografuję nasz bolid. W wolnym czasie pracuję nad własnymi projektami z zakresu mechaniki, elektroniki i druku 3D oraz realizuję się jako Jachtowy Sternik Morski.',
        achievements: [{ year: 2025, text: 'POLSKA' }, { year: 2026, text: 'FS Czech' }],
        projects: ['Druk 3D foremników pakietu aerodynamicznego bolidu WUT 6', 'Projekt kanałów chłodzących tarcze hamulcowe bolidu WUT 7', 'System dokumentacji struktury wewnętrznej i estymacji masowej elementów kompozytowych'],
    },
    {
        slug: 'oliwier-jurczak', name: 'Oliwier Jurczak', dept: 'aero', since: 2025, studies: 'PW · MEiL',
        bio: 'Jestem osobą, którą od zawsze fascynowała Formuła 1 i to właśnie ona przyciągnęła mnie do świata motorsportu. Na torze kibicuję Maxowi Verstappenowi, a od strony inżynieryjnej podziwiam kunszt Adriana Neweya oraz Rossa Brawna. W zespole działam od niedawna, ale od razu postawiłem na proaktywność, między innymi, przejmując stery i jako główny realizator prowadząc proces badawczy chemicznego wygładzania form z ABS-u pod elementy kompozytowe. Obecnie moje działania skupiają się na aerodynamice teoretycznej i symulacjach CFD. Swoją pasję płynnie łączę z nauką. W ramach realizacji inżynierskiej pracy przejściowej, a zarazem dyplomowej, dogłębnie analizuję zjawisko porpoisingu w bolidach F1 z roku 2022. Po godzinach jestem pasjonatem rozwiązywania sudoku i dla sportu potrafię z pamięci wymienić wszystkie państwa świata.',
        projects: ['Prowadzenie badań obróbki ABS', 'Wdrożenie do środowiska CFD', 'Optymalizacja modeli CAD'],
    },
    {
        slug: 'lena-kaliszewska', name: 'Lena Kaliszewska', dept: 'aero',
        achievements: [{ year: 2026, text: 'FS Austria' }],
    },
    { slug: 'franciszek-knecht', name: 'Franciszek Knecht', dept: 'aero' },
    { slug: 'mikolaj-konicki', name: 'Mikołaj Konicki', dept: 'aero' },
    {
        slug: 'pawel-kruk', name: 'Paweł Kruk', dept: 'aero', since: 2025, studies: 'PW · MT',
        bio: 'Jestem nowym członkiem koła. Lubię pomagać w pracy warsztatowej przy wykonaniu pakietu aero w fazie wykonawczej. W wolnym czasie lubię czytać książki oraz grać na gitarze.',
    },
    { slug: 'malwina-kudlak', name: 'Malwina Kudlak', dept: 'aero' },
    {
        slug: 'mikolaj-magnuski', name: 'Mikołaj Magnuski', dept: 'aero', since: 2025, studies: 'PW · IM',
        bio: 'Do moich głównych zainteresowań należą materiały kompozytowe dlatego bardzo lubię wraz z innymi członkami koła tworzyć elementy aero z włókna węglowego. Jest to bardzo interesujący proces który daje mi dużo satysfakcji.',
    },
    { slug: 'marta-mnich', name: 'Marta Mnicho', dept: 'aero', f: 1 },
    {
        slug: 'wiktor-mikolajczyk', name: 'Wiktor Mikołajczyk', dept: 'aero',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }],
    },
    {
        slug: 'jan-oziemski', name: 'Jan Oziemski', dept: 'aero', since: 2025, studies: 'PW · Mechatronika',
        bio: 'Jako członek działu aerodynamiki zajmuję się projektowaniem i wykonaniem pakietu aerodynamicznego dla naszych najnowszych konstrukcji. Sporą część wolnego czasu spędzam na warsztacie laminując kolejne profile i przygotowując nowe foremniki.',
        achievements: [{ year: 2026, text: 'FS Poland' }],
        projects: ['Faza wykonawcza WUT-7', 'Foremniki profili FW', 'Rysunki wykonawcze częsci FW', 'Strona internetowa'],
    },
    {
        slug: 'patryk-pietrzykowski', name: 'Patryk Pietrzykowski', dept: 'aero', since: 2025, studies: 'PW · MEiL',
        bio: 'Interesuje się wyścigami samochodowymi F1, GT3, Sim-Racing oraz strategią wyścigową. W wolnym czasie programuje aplikacje komputerowe oraz skrypty. Uczę się mechaniki eksperymentując na swoim samochodzie. Staram się też utrzymać w dobrej formie fizycznej.',
    },
    {
        slug: 'nikodem-wera', name: 'Nikodem Wera', dept: 'aero', since: 2025, studies: 'PW · MEiL',
        bio: 'Studiuję Mechanikę i Projektowanie Maszyn. Interesuję się motoryzacją, sportami motorowymi, lotnictwem oraz astronomią.',
        projects: ['Przygotowanie WUT-6 do zawodów'],
    },

    // CHASSIS
    {
        slug: 'grzes-spruch', name: 'Grzegorz Spruch', dept: 'chassis', role: 'Koordynator',
        achievements: [{ year: 2026, text: 'FS Czech' }],
    },
    {
        slug: 'mikolaj-cieslak', name: 'Mikołaj Cieślak', dept: 'chassis', role: 'Zastępca koordynatora',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
    },
    {
        slug: 'aleksander-abramowicz', name: 'Aleksander Abramowicz', dept: 'chassis', since: 2023, studies: 'PW · SiMR',
        bio: 'Moja przygoda w WUT Racing kręci się wokół działu Chassis. Odpowiadam za to, aby konstrukcja nośna bolidu była lekka i wytrzymała. Przeprowadziłem wiele analiz MES, dzięki czemu kierowca naszych bolidów mógł czuć się bezpiecznie podczas dominacji na torze. Praca w tym zespole to dla mnie idealne połączenie studiów z pasją, prywatnie jestem wielkim fanem Formuły 1, można powiedzieć, że motorsportem żyję na co dzień - i w teorii, i w praktyce.',
        achievements: [{ year: 2024, text: 'FS Poland' }, { year: 2025, text: 'FS Poland' }, { year: 2026, text: 'FS Czech' }],
        projects: ['Stanowisko do spawania ramy WUT-7', 'Stanowisko do badania sztywności skrętnej', 'Analiza MES ramy WUT-7', 'Zagłówek do WUT-6', 'Analiza MES monocoque WUT-6', 'Analiza MES monocoque WUT-5', 'Owiewka kokpitu WUT-5', 'Badanie środka ciężkości WUT-4'],
    },
    {
        slug: 'bartlomiej-misurski', name: 'Bartłomiej Misiurski', dept: 'chassis', since: 2024, studies: 'PW · SiMR',
        bio: 'Zajmuję się projektowaniem i wykonaniem monocoque’u, jego obliczeniami strukturalnymi oraz zapewnieniem zgodności konstrukcji z regulaminem Formula Student. Interesuję się materiałami kompozytowymi, szczególnie ich zastosowaniem w motorsporcie i lekkich konstrukcjach. Lubię pracę zespołową, analizę techniczną i szukanie praktycznych rozwiązań, które pozwalają połączyć wytrzymałość z niską masą konstrukcji.',
        achievements: [{ year: 2025, text: 'FS Poland' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
        projects: ['kompozytowe wykroje foremników monocoque', 'aluminiowe inserty', 'wykonanie monocoque WUT7', 'push bar'],
    },
    {
        slug: 'michal-morawski', name: 'Michał Morawski', dept: 'chassis',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }],
    },
    { slug: 'aleksy-dorota', name: 'Aleksy Dorota', dept: 'chassis' },
    { slug: 'marcin-gruszczynski', name: 'Marcin Gruszczyński', dept: 'chassis' },
    {
        slug: 'piotr-kilianczyk', name: 'Piotr Kiliańczyk', dept: 'chassis',
        achievements: [{ year: 2026, text: 'FS Czech' }],
    },
    { slug: 'piotr-piwowarski', name: 'Piotr Piwowarski', dept: 'chassis' },

    // ZAWIESZENIE
    { slug: 'tomasz-zaleski', name: 'Tomasz Zaleski', dept: 'suspension', role: 'Koordynator' },
    {
        slug: 'ian-gjelleboll', name: 'Ian Gjelleboll', dept: 'suspension', role: 'Zastępca koordynatora',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
    },
    {
        slug: 'maks-wozniak', name: 'Maksymilian Woźniak', dept: 'suspension', role: 'Zastępca koordynatora',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
    },
    {
        slug: 'tomek-kolakowski', name: 'Tomasz Kołakowski', dept: 'suspension',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }],
    },
    {
        slug: 'grzes-siedlecki', name: 'Grzegorz Siedlecki', dept: 'suspension', since: 2023, studies: 'PW · SiMR',
        bio: 'W zespole głównie zajmuje się projektami z zakresu zawieszenia, a w szczególności ARB oraz pracami warsztatowymi. W wolnym czasie jestem sędzią sportów samochodowych i pasjonatem niskobudżetowego ścigania.',
        achievements: [{ year: 2025, text: 'FSA' }, { year: 2025, text: 'FSP' }, { year: 2026, text: 'FS Czech' }],
        projects: ['WUT5 - inserty pushrodów', 'WUT6 - mocowania wahaczy do monokoku', 'WUT7 - Anti Roll Bar - przód i tył'],
    },
    {
        slug: 'damian-czerwiec', name: 'Damian Czerwiec', dept: 'suspension', since: 2024, studies: 'PW · MT',
        bio: 'Siema, Jestem Damian. Na co dzień zajmuje się wieloma kwestiami związanymi z układem zawieszenia - organizacją, kontaktem z kluczowymi sponsorami, projektem własnych elementów, ale również pomagam i doradzam młodszym członkom w ich projektach. Dodatkowo, wykonałem oklejenie bolidu WUT-6 oraz WUT-7. W wolnym czasie (o ile taki znajdę) jeżdżę w profesjonalnym drifcie w simracingu oraz współtworzę narzędzie treningowe dla kierowców PROXIMITER. Jestem fanem sosu 1000 Wysp.',
        achievements: [{ year: 2025, text: 'Formula student Austria' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Układ kierowniczy WUT-7', 'Projekt mocowań wahaczy WUT-7', 'Stanowisko do spawania mocowań wahaczy tylnych WUT-7 i WUT-6', 'Projekt rockerów zawieszenia WUT-6', 'Projekt Insertów układu zawieszenia WUT-6'],
    },
    {
        slug: 'tamara-saganek', name: 'Tamara Saganek', dept: 'suspension', since: 2024, studies: 'PW · SiMR',
        bio: 'W kole zajmuje się pracą warsztatową, projektowaniem, analizą wytrzymałością oraz optymalizacją topologiczną elementów zawieszenia.',
        achievements: [{ year: 2025, text: 'Czechy' }, { year: 2025, text: 'Polska' }, { year: 2026, text: 'FS Austria' }],
        projects: ['Mocowania wachaczy', 'Pedał gazu', 'Przewody hamulcowe'],
    },
    {
        slug: 'dominik-werpachowski', name: 'Dominik Werpachowski', dept: 'suspension', since: 2024, studies: 'PW · EiTI',
        bio: 'W ramach działalności w kole naukowym uczestniczę w całym procesie powstawania bolidu wyścigowego. Jednocześnie poszerzam wiedzę z zakresu dynamiki pojazdu, uczę się projektować w środowisku CAD, poznaję zasady analiz MES oraz dobierania parametrów zawieszenia. Swój rozwój inżynierski realizuję dwutorowo – wiedzę pozyskaną w kole bezpośrednio wykorzystuję we własnym projekcie, jakim jest modyfikacja i jazda torowa Mazdą MX-5 NB. Z kolei praktyczne doświadczenie mechaniczne i wnioski z zachowania własnego auta na torze pomagają mi dużo lepiej rozumieć zagadnienia oraz wyzwania pojawiające się podczas budowy naszego bolidu.',
        projects: ['Helper Spring', 'Łącznik ARB', 'Mocowanie Amortyzatora'],
    },
    {
        slug: 'mateusz-jozwiak', name: 'Mateusz Jóźwiak', dept: 'suspension',
        achievements: [{ year: 2026, text: 'FS Poland' }],
    },
    {
        slug: 'bartlomiej-kolacz', name: 'Bartłomiej Kołacz', dept: 'suspension', since: 2025, studies: 'PW · MEiL',
        bio: 'Moja działalność w zespole obejmuje opracowywanie elementów zawieszenia i prace warsztatowe',
        projects: ['Rocker tylny', 'Łącznik górnego wahacza'],
    },
    { slug: 'leon-koslarz', name: 'Leon Koślarz', dept: 'suspension' },
    {
        slug: 'paulina-macek', name: 'Paulina Macek', dept: 'suspension',
        achievements: [{ year: 2026, text: 'FS Poland' }],
    },
    {
        slug: 'jan-rode', name: 'Jan Rode', dept: 'suspension',
        achievements: [{ year: 2026, text: 'FS Czech' }],
    },
    { slug: 'adam-tumidajewicz', name: 'Adam Tumidajewicz', dept: 'suspension' },
    {
        slug: 'tomasz-wrobel', name: 'Tomasz Wróbel', dept: 'suspension',
        achievements: [{ year: 2026, text: 'FS Poland' }],
    },

    // ELEKTRONIKA
    { slug: 'michal-zielinski', name: 'Michał Zieliński', dept: 'electronics', role: 'Koordynator' },
    {
        slug: 'blazej-molas', name: 'Błażej Molas', dept: 'electronics', role: 'Zastępca koordynatora',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }],
    },
    {
        slug: 'kacper-kowalski', name: 'Kacper Kowalski', dept: 'electronics', since: 2023, studies: 'PW · EiTI',
        bio: 'Specjalizuje się w projektowaniu zaawansowanych płytek PCB oraz programowaniu systemów wbudowanych opartych na mikrokontrolerach STM32. W kole naukowym odpowiada bezpośrednio za rozwój i wdrażanie układów elektronicznych. Prywatnie pasjonuje się szeroko pojętym majsterkowaniem oraz muzyka.',
        achievements: [{ year: 2024, text: 'Węgry' }, { year: 2025, text: 'Austria Czechy Polska' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Moduł pomiarowy i zarządzania bezpieczeństwem pakiety baterii układu hybrydowego', 'wiązka'],
    },
    {
        slug: 'mateusz-drabarek', name: 'Mateusz Drabarek', dept: 'electronics', since: 2019, studies: 'PW · MT',
        bio: 'W zespole WUT Racing zajmuję się elektroniką pojazdu, jestem kierowcą, spawam, dobrze się bawię.',
        achievements: [{ year: 2022, text: 'Czechy' }, { year: 2023, text: 'Węgry' }, { year: 2023, text: 'Niemcy' }, { year: 2023, text: 'Polska' }, { year: 2024, text: 'Węgry' }, { year: 2024, text: 'Chorwacja' }, { year: 2024, text: 'Polska' }, { year: 2025, text: 'Austria' }, { year: 2025, text: 'Polska' }, { year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Sprzęgło elektryczne', 'Wiązka elektryczna', 'Płytki drukowane PCB', 'Systemy bezpieczeństwa kierowcy'],
    },
    { slug: 'patrycja-wozniak', name: 'Patrycja Woźniak', dept: 'electronics', f: 1 },
    {
        slug: 'kasia-matejuk', name: 'Katarzyna Matejuk', dept: 'electronics', since: 2024, studies: 'PW · WE',
        bio: 'tu tu du du',
        achievements: [{ year: 2025, text: 'Polska' }, { year: 2026, text: 'FS Austria' }],
        projects: ['LVMS'],
    },
    { slug: 'tymoteusz-celmer', name: 'Tymoteusz Celmer', dept: 'electronics' },
    {
        slug: 'mateusz-olszewski', name: 'Mateusz Olszewski', dept: 'electronics',
        achievements: [{ year: 2026, text: 'FS Czech' }],
    },
    {
        slug: 'wojciech-glownia', name: 'Wojciech Głownia', dept: 'electronics',
        achievements: [{ year: 2026, text: 'FS Poland' }],
    },
    {
        slug: 'robert-gruszczynski', name: 'Robert Gruszczyński', dept: 'electronics', since: 2025, studies: 'PW · MiNI',
        bio: 'Jestem członkiem działu elektroniki WUT Racing od października 2025 roku. Zajmuję się projektowaniem i programowaniem rozwiązań związanych z komunikacją CAN oraz telemetrią bolidu. Interesuję się programowaniem, matematyką i praktycznym wykorzystaniem elektroniki w motorsporcie.',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Płytka telemetrii CAN', 'Dokumentacja ramek CAN'],
    },
    {
        slug: 'jan-maciag', name: 'Jan Maciąg', dept: 'electronics', since: 2026, studies: 'PW · EiTI',
        bio: 'Dołączyłem do działu elektroniki, żeby poszerzać wiedzę w tej dziedzinie. Bardziej interesuje mnie informatyka od strony sprzętowej i w tym kierunku chcę zdobywać doświadczenie. Realizowanie praktycznych zadań, które mają rzeczywiste zastosowanie, pozwala mi szybko się uczyć. Ponadto satysfakcję sprawia mi świadomość, że elementy, nad którymi pracuję, są faktycznie wykorzystywane.',
        projects: ['Aplikacja do telemetrii', 'PCB do obsługi LEDów'],
    },
    {
        slug: 'iwo-szaniawski', name: 'Iwo Szaniawski', dept: 'electronics', since: 2026, studies: 'PW · SiMR',
        bio: 'Jestem Iwo i w WUT Racing działam od wiosny 2026. Jako dumny członek działu elektroniki współtworzę złożone projekty systemów pokładowych w naszym bolidzie. Kocham Motorsport i od najmłodszych lat rozwijałem moją pasję do technologii, również hobbistycznie w zakresie projektowania i wykonywania własnych systemów audio łącząc pasję do precyzyjnej elektroniki z miłością do dobrego brzmienia ; )',
        achievements: [{ year: 2026, text: 'FS Poland' }],
    },

    // SILNIK
    {
        slug: 'mateusz-makarewicz', name: 'Mateusz Makarewicz', dept: 'engine', role: 'Koordynator', since: 2023, studies: 'PW · SiMR (absolwent)',
        bio: 'Interesuję się motorsportem, zwłaszcza w kontekście nieszablonowych rozwiązań technicznych i rozwoju jednostek napędowych. Lubię motoryzację z lat 90-tych.',
        achievements: [{ year: 2024, text: 'Polska' }, { year: 2025, text: 'Czechy' }, { year: 2025, text: 'Polska' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Układ przeniesienia napędu', 'Mocowania dyferencjału', 'Układ turbodoładowania'],
    },
    {
        slug: 'kuba-czarzasty', name: 'Jakub Czarzasty', dept: 'engine', role: 'Zastępca koordynatora', since: 2024, studies: 'PW · SiMR',
        bio: 'Od listopada 2024 roku należę do zespołu, przez ten czas miałem szansę wykorzystać wiedzę, którą zbieram na studiach w projektowaniu samochodów. Poza studiami lubię też jeździć na rowerze i zjeżdżać ze stoku na nartach.',
        achievements: [{ year: 2025, text: 'Czechy' }, { year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Planowanie i zarządzanie wydatkami działu na rok 2025/26', 'KNTI "Turbo"', 'Mocowania dyferencjału WUT-7', 'Podtrzymka spawalnicza wydechu WUT-7', 'Mocowania silnika WUT-7', 'Mocowania wydechu WUT-6'],
    },
    {
        slug: 'franek-kajdzik', name: 'Franciszek Kajdzik', dept: 'engine',
        achievements: [{ year: 2026, text: 'FS Austria' }],
    },
    {
        slug: 'michal-milaniuk', name: 'Michał Milaniuk', dept: 'engine',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }],
    },
    { slug: 'jakub-dzikowski', name: 'Jakub Dzikowski', dept: 'engine' },
    { slug: 'mikolaj-klonowski', name: 'Mikołaj Klonowski', dept: 'engine' },
    {
        slug: 'igor-syska', name: 'Igor Syska', dept: 'engine', since: 2023, studies: 'PW · MT',
        bio: 'Jestem stuednetm trzeciego roku Mechaniki i Budowy Maszyn o specjalizacji Konstrukcja i Produkcja Broni i Amunicji. Do koła naukowego dołączyłem w 2023 roku na pierwszym roku studiów i od tamtego czasu jestem członkiem działu silnika. Poza działaniami w swoim dziale zajmuję się wieloma aspektami wykonawczymi naszego projektu, w tym technologicznością niektórych elementów i zaawansowanymi technikami, jak na przykład ulepszanie cieplne. Moje zainteresowania to między innymi: symulacje komputerowe (MES, CFD, 1D), zagadnienia z zakresu mechaniki płynów, materiałoznastwo, techniki addytywne oraz reverse engineering.',
        achievements: [{ year: 2023, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Układ turbodoładowania silnika', 'Symulacje silnika 1D', 'Dwukomorowy drukowany catchtank', 'Układ stabilizacji kolektora dolotowego', 'Obróbka cieplna wydruków z AlSi10Mg'],
    },
    { slug: 'kacper-karpinski', name: 'Kacper Karpiński', dept: 'engine' },
    {
        slug: 'michal-mazur', name: 'Michał Mazur', dept: 'engine',
        achievements: [{ year: 2026, text: 'FS Poland' }],
    },
    {
        slug: 'franciszek-grezbiela', name: 'Franciszek Grzebiela', dept: 'engine',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Austria' }],
    },
    { slug: 'krzysztof-gut', name: 'Krzysztof Gut', dept: 'engine' },
    { slug: 'albert-kwasniewski', name: 'Albert Kwaśniewski', dept: 'engine' },
    {
        slug: 'kazik-michalec', name: 'Kazimierz Michalec', dept: 'engine', since: 2025, studies: 'PW · MEiL',
        achievements: [{ year: 2026, text: 'FS Austria' }],
        projects: ['elementy układu paliwowego'],
    },
    {
        slug: 'michal-szczawinski', name: 'Michał Szczawiński', dept: 'engine',
        achievements: [{ year: 2026, text: 'FS Czech' }],
    },
    {
        slug: 'antoni-wojcik', name: 'Antoni Wójcik', dept: 'engine', since: 2025, studies: 'PW · SiMR',
        bio: 'Interesuję się motoryzacją, sportem i majsterkowaniem',
        achievements: [{ year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Model stanowiska spawalniczego do wydechu', 'Tylna zębatka', 'Łapka sprzęgła i jej mocowanie'],
    },

    // PR
    {
        slug: 'kuba-kotowicz', name: 'Jakub Kotowicz', dept: 'pr', role: 'Koordynator',
        achievements: [{ year: 2026, text: 'FS Austria' }],
    },
    {
        slug: 'dagmara-legien', name: 'Dagmara Legień', dept: 'pr', role: 'Zastępca koordynatora',
        achievements: [{ year: 2026, text: 'FS Austria' }, { year: 2026, text: 'FS Poland' }],
    },
    { slug: 'michal-wisniewski', name: 'Michał Wiśniewski', dept: 'pr', role: 'Fotograf' },
    { slug: 'patrycja-wojcik', name: 'Patrycja Wójcik', dept: 'pr', f: 1 },
    { slug: 'monika-bajura', name: 'Monika Bajura', dept: 'pr' },
    {
        slug: 'szymon-frelik', name: 'Szymon Frelik', dept: 'pr', since: 2025, studies: 'PW · EiTI',
        bio: 'Jako członek działu PR zajmuję się stroną medialną zespołu. W wolnym czasie pasjonuję się motorsportem i simracingiem.',
    },
    { slug: 'marcelina-hyzy', name: 'Marcelina Hyży', dept: 'pr' },
    {
        slug: 'inka-junko', name: 'Inka Junko', dept: 'pr',
        achievements: [{ year: 2026, text: 'FS Czech' }],
    },
    {
        slug: 'zofia-kosmala', name: 'Zofia Kosmala', dept: 'pr',
        achievements: [{ year: 2026, text: 'FS Czech' }],
    },
    { slug: 'kacper-kozak', name: 'Kacper Kozak', dept: 'pr' },
    {
        slug: 'karolina-zawadzka', name: 'Karolina Zawadzka', dept: 'pr',
        achievements: [{ year: 2026, text: 'FS Austria' }],
    },
    {
        slug: 'marcin-malczewski', name: 'Marcin Malczewski', dept: 'pr', since: 2025, studies: 'AEH · Biznes',
        bio: 'Social media, finanse, marketing oraz okazjonalne robótki ręczne. Prywatnie miłośnik sportu, nie tylko piłki nożnej oraz tenisa ale również Formuły 1 oraz innych klas wyścigowych.',
        projects: ['WUT Racing', 'Foton Racing'],
    },

    // LOGISTYKA
    {
        slug: 'antek-starczynowski', name: 'Antoni Starczynowski', dept: 'logistics', role: 'Koordynator', since: 2024, studies: 'PW · WZ',
        bio: 'W kole staram się zapewnić utrzymanie operacyjności oraz statusu najaktywniejszego koła naukowego PW.  Prywatnie jestem piłkarskim trenerem dzieciaków w moim lokalnym klubie. Uwielbiam pichcenie czegoś smacznego w kuchni. Książki, futbol, windsurfing - ulubione formy spędzania wolnego czasu.',
        achievements: [{ year: 2025, text: 'Czechy' }, { year: 2026, text: 'FS Czech' }, { year: 2026, text: 'FS Poland' }],
        projects: ['Business Plan Presentation ’26', 'Akcelerator Kół Naukowych ’25', 'Wszystkie targi'],
    },
    {
        slug: 'dagmara-kucharczyk', name: 'Dagmara Kucharczyk', dept: 'logistics',
        achievements: [{ year: 2026, text: 'FS Poland' }],
    },
    { slug: 'jakub-michalec', name: 'Jakub Michalec', dept: 'logistics' },
    { slug: 'zofia-ladunkin', name: 'Zofia Ładunkin', dept: 'logistics' },
    { slug: 'olena-stakhiv', name: 'Olena Stakhiv', dept: 'logistics' },
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
