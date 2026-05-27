# WUT Racing — projekt strony



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
