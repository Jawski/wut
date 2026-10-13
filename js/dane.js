// Wczytywanie tresci strony z plikow w katalogu dane/.
//
// Tresc (sklad, bolidy, sponsorzy, wydarzenia, osiagniecia) siedzi w osobnych
// plikach, a nie w kodzie - dzieki temu da sie ja zmieniac bez dotykania
// skryptow. Kazdy plik pobierany jest najwyzej raz na odwiedziny strony.

(function () {
    const bufor = {};

    window.WUT_dane = function (nazwa) {
        if (!bufor[nazwa]) {
            bufor[nazwa] = fetch('dane/' + nazwa + '.json')
                .then(function (r) {
                    if (!r.ok) throw new Error('dane/' + nazwa + '.json — HTTP ' + r.status);
                    return r.json();
                })
                .catch(function (e) {
                    // bez tego strona milczy, a przyczyna jest nie do odgadniecia
                    console.error('Nie udalo sie wczytac danych:', e.message);
                    throw e;
                });
        }
        return bufor[nazwa];
    };
})();
