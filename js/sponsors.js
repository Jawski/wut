// Sciana sponsorow. Kategorie i logotypy siedza w dane/sponsorzy.json,
// zeby dalo sie je zmieniac bez dotykania kodu strony.
//
// --lw i --lh to rozmiar kafelka liczony per logotyp tak, zeby kazdy zajmowal
// podobne pole - inaczej szerokie logotypy przytlaczaja te kwadratowe.

async function initSponsors() {
    const wrap = document.getElementById('sponsor-tiers');
    if (!wrap) return;

    let kategorie;
    try { kategorie = await window.WUT_dane('sponsorzy'); }
    catch (e) { return; }               // powod wypisuje wczytywarka

    const t = (klucz, zapas) => (window.WUT_t ? window.WUT_t(klucz) : null) || zapas;

    wrap.innerHTML = kategorie.map(k => {
        const kafelki = k.logotypy.map(l => {
            const obraz = `<img src="assets/sponsors/${l.plik}" alt="${l.nazwa}" loading="lazy">`;
            const styl = `style="--lw:${l.lw};--lh:${l.lh}"`;
            // partner bez adresu strony dostaje kafelek nieklikalny, zamiast
            // odnosnika prowadzacego donikad
            return l.url
                ? `<a class="sponsor-logo" ${styl} href="${l.url}" target="_blank" rel="noopener" title="${l.nazwa}" aria-label="${l.nazwa}">${obraz}</a>`
                : `<span class="sponsor-logo is-plain" ${styl} title="${l.nazwa}">${obraz}</span>`;
        }).join('\n                ');

        return `
        <div class="sponsor-tier reveal ${k.id}" style="--tier-color:${k.kolor};">
            <h2 class="sponsor-tier-title" data-i18n="${k.klucz}">${t(k.klucz, k.nazwa)}</h2>
            <div class="sponsor-logos">
                ${kafelki}
            </div>
        </div>`;
    }).join('\n');

    // sekcje dochodza po starcie strony, wiec same nie zalapia sie na
    // obserwatora pojawiania sie przy przewijaniu - zglaszamy je recznie
    if (typeof window.WUT_obserwujReveal === 'function') {
        window.WUT_obserwujReveal(wrap.querySelectorAll('.reveal'));
    }
}

// przelacznik jezyka przerysowuje tytuly kategorii
window.WUT_renderSponsors = initSponsors;

document.addEventListener('DOMContentLoaded', initSponsors);
