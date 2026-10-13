// Funkcje pomocnicze skladu. Same dane - kto jest w zespole, jakie sa dzialy
// i sezony - siedza w dane/zespol.json oraz dane/zespol-archiwum.json, zeby
// dalo sie je zmieniac bez dotykania kodu.

// Wstawia wczytana tresc tam, gdzie reszta skryptow sie jej spodziewa.
window.WUT_wczytajZespol = async function () {
    const [d, archiwum] = await Promise.all([
        window.WUT_dane('zespol'),
        window.WUT_dane('zespol-archiwum'),
    ]);
    window.WUT_SEASONS      = d.sezony;
    window.WUT_DEPT_FILTERS = d.dzialy;
    window.WUT_DEPT_INFO    = d.dzialyOpis;
    window.WUT_NO_PHOTO     = d.bezZdjecia;
    window.WUT_TEAM         = d.sklad;
    window.WUT_TEAM_ARCHIVE = archiwum;
};

// Czlonkowie jednego dzialu. Kto siedzi w kilku dzialach naraz, ma je wypisane
// w "also" - wtedy oddajemy kopie z rola wlasciwa dla tego dzialu, zeby ta sama
// osoba mogla byc np. wiceprezesem w zarzadzie i zwyklym czlonkiem w elektronice.
window.WUT_deptMembers = function(lista, dept) {
    const out = [];
    lista.forEach(m => {
        if (m.dept === dept) { out.push(m); return; }
        const extra = (m.also || []).find(a => a.dept === dept);
        if (extra) {
            out.push(Object.assign({}, m, {
                dept: dept,
                role: extra.role || undefined,   // brak roli = domyslna rola dzialu
                rank: extra.rank,
            }));
        }
    });
    return out;
};

window.WUT_getRole = function(m) {
    if (m.role) return m.role;
    return window.WUT_DEPT_INFO[m.dept] ? window.WUT_DEPT_INFO[m.dept].defaultRole : 'Członek zespołu';
};

window.WUT_getDeptLabel = function(m) {
    return window.WUT_DEPT_INFO[m.dept] ? window.WUT_DEPT_INFO[m.dept].label : '—';
};

// imie.nazwisko@wutracing.pl z polskimi znakami zamienionymi na ascii
window.WUT_getEmail = function(m) {
    const map = { 'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ż':'z','ź':'z','ø':'o' };
    const ascii = m.name.toLowerCase().replace(/[ąćęłńóśżźø]/g, ch => map[ch] || ch);
    const parts = ascii.split(/\s+/);
    const first = parts.shift();
    const rest = parts.join('.');
    return `${first}.${rest}@wutracing.pl`;
};
