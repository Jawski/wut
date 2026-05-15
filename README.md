# WUT Racing — projekt strony

Ultranowoczesna strona Koła Naukowego Pojazdów Wyścigowych Politechniki Warszawskiej.

## Jak uruchomić

**Ważne:** strona ładuje model 3D bolidu (FBX) i używa ES modules — **musi być serwowana przez serwer HTTP**, nie z `file://` (przeglądarki blokują).

### Najprościej — kliknij dwa razy:

`start-server.bat` — uruchomi lokalny serwer Pythona i otworzy stronę w przeglądarce.

### Ręcznie, jeżeli masz Pythona:

```bash
cd "C:\Users\Janek\Desktop\projekt strony"
python -m http.server 8080
```

Następnie otwórz: <http://localhost:8080>

### Alternatywnie — Live Server w VS Code

Otwórz folder w VS Code, zainstaluj rozszerzenie "Live Server" i kliknij prawym na `index.html` → "Open with Live Server".

---

## Struktura

```
projekt strony/
├── index.html          – Start (3D bolid + scroll-story w stylu Apple)
├── o-nas.html          – O nas (timeline, wartości)
├── zespol.html         – Zespół (karty + modal z biografią)
├── bolidy.html         – Bolidy (lista + 3D viewer w modalu)
├── sponsorzy.html      – Sponsorzy (cztery poziomy + kontakt)
├── css/
│   ├── main.css        – Wspólny styl (theme, nav, footer)
│   ├── home.css        – Hero 3D + sekcje story
│   └── pages.css       – Podstrony (team, cars, sponsors)
├── js/
│   ├── common.js       – Nav, footer, scroll progress, reveal
│   ├── car-loader.js   – Wspólny moduł 3D (Three.js + FBXLoader)
│   ├── home.js         – Scroll-driven 3D scene na stronie głównej
│   ├── team.js         – Dane członków + grid + modal
│   └── cars.js         – Dane bolidów + 3D viewer w modalu
└── models/
    └── WUT6.fbx    – Model 3D bolidu (58 MB)
```

---

## Co jest gotowe

- **Strona główna** — duży 3D model bolidu, kamera obraca się wraz ze scrollem przez 5 sekcji "story" (skład, aero, napęd, zawody, misja). Liczby animują się przy wejściu na ekran. Apple-style.
- **O nas** — timeline 2012→2026, trzy filary, CTA.
- **Zespół** — 16 przykładowych członków, filtrowanie po działach, modal z biografią i osiągnięciami. Zdjęcia jako monogramy (gdy dostarczysz prawdziwe fotki → wystarczy podmienić `<span class="initials">` na `<img>`).
- **Bolidy** — 6 generacji (WUT1 → WUT6), pełne dane techniczne, kliknięcie → modal z 3D viewerem (orbit controls). Każdy bolid używa tego samego modelu (zgodnie z prośbą), starsze generacje są subtelnie tonowane innym kolorem akcentów.
- **Sponsorzy** — cztery poziomy (Title / Premium / Technical / Partner), siatka kart, sekcja "zostań partnerem" z benefitami i kontaktem.

## Inspiracje

- **apple.com** — duża typografia, scroll-driven 3D, sekcje sczepione (sticky), płynne przejścia.
- **scuderiaferrari.com** — ciemna paleta, dramatyczne oświetlenie, mocne akcenty, mono-text dla danych technicznych.

## Stack

- Brak builda — czyste HTML/CSS/JS.
- Three.js 0.160 + FBXLoader + OrbitControls (z CDN unpkg).
- Inter + JetBrains Mono z Google Fonts.
- ES modules dla skryptów 3D, klasyczne `<script>` dla reszty.

## Co można dorzucić w drugim kroku

1. **Konwersja FBX → GLB** (gltf-pipeline / Blender) — model spadnie z 58 MB do ~5–10 MB, ładuje się 5× szybciej.
2. **Prawdziwe zdjęcia członków** — podmień `<span class="initials">` w `js/team.js` na ścieżkę do JPG.
3. **Logotypy sponsorów** — analogicznie, w `sponsorzy.html` zamiast tekstowych nazw wstaw SVG/PNG.
4. **CMS** — gdyby dane miały być edytowalne przez nie-programistów, można podłączyć Sanity / Strapi / Decap CMS.
5. **PWA + offline** — service worker, manifest, cache modelu 3D.
