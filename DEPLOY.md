# Deploy na GitHub Pages

Strona jest **w pełni statyczna** (HTML + CSS + JS + assety) — GitHub Pages serwuje ją bez żadnej konfiguracji. Nie potrzebujesz żadnego buildu.

---

## 1. Stwórz repo na GitHubie

Wejdź na <https://github.com/new> i:
- **Repository name** — np. `wutracing` (lub jeśli chcesz domenę typu `<user>.github.io`, nazwij repo dokładnie `<twoj-username>.github.io`)
- **Public** (Pages na darmowym koncie wymaga publicznego repo)
- **NIE** zaznaczaj „Add README", „Add .gitignore", „Choose license" — masz już własne

Kliknij **Create repository**. Skopiuj URL (np. `https://github.com/wutracing/strona.git`).

---

## 2. Wypchnij projekt

W PowerShellu w folderze projektu:

```powershell
cd "C:\Users\Janek\Desktop\projekt strony"
git init
git branch -M main
git add .
git commit -m "Initial commit — WUT Racing site"
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

(Jeżeli git zapyta o login → użyj swojego username z GitHuba i Personal Access Token zamiast hasła. PAT generujesz w `Settings → Developer settings → Personal access tokens → Generate new token (classic)`, scope: `repo`.)

---

## 3. Włącz GitHub Pages

W repo na GitHubie:
- **Settings** → lewe menu **Pages**
- **Source**: `Deploy from a branch`
- **Branch**: `main`, folder `/ (root)`
- Kliknij **Save**

Po ~1–2 minutach pojawi się link u góry: `Your site is live at https://<USER>.github.io/<REPO>/`

---

## 4. Co dalej

### Aktualizacja strony
```powershell
git add .
git commit -m "opis zmiany"
git push
```
Pages odświeża się ~1–2 minuty po pushu.

### Własna domena (opcjonalnie)
Jeśli masz np. `wutracing.pl` i chcesz żeby strona działała tam zamiast `<user>.github.io/<repo>/`:
1. **Settings → Pages → Custom domain** → wpisz `wutracing.pl` → Save
2. Utwórz w repo plik `CNAME` z jedną linią: `wutracing.pl` (już zostanie zrobiony automatycznie przez GitHuba w kroku 1)
3. U dostawcy DNS dodaj rekordy:
   - `A` → `185.199.108.153`
   - `A` → `185.199.109.153`
   - `A` → `185.199.110.153`
   - `A` → `185.199.111.153`
   - `CNAME` (subdomena `www`) → `<user>.github.io`
4. Po propagacji DNS (zwykle do 24h) zaznacz **Enforce HTTPS** w Pages

---

## Co znajduje się w repozytorium

| Folder/plik | Po co |
|---|---|
| `index.html`, `o-nas.html`, `zespol.html`, `bolidy.html`, `bolid.html`, `czlonek.html`, `wydarzenia.html`, `sponsorzy.html` | Strony |
| `css/` | `main.css`, `home.css`, `pages.css` |
| `js/` | Skrypty modułowe + `common.js` (nav, karuzela, countdown) |
| `models/parts/` | 4 GLBy bolidu (engine, chassis, suspension, aero) — łącznie ~24 MB, ładowane przez Three.js |
| `assets/` | Zdjęcia hero, zespół, logo, render bolidu |
| `tools/` | Skrypty Pythona (Blender bake, kompresja, render) — używane LOKALNIE, nie potrzebne na produkcji, ale nie szkodzą |

`.gitignore` pomija lokalny serwer (`serve.py`, `start-server.bat`), katalog `.claude/`, logi, OS junk.

`.nojekyll` mówi GitHub Pages żeby nie próbował przepuszczać plików przez Jekyll (inaczej pliki zaczynające się od `_` byłyby pomijane).

---

## Limity GitHuba — czy się mieścimy?

| Limit | Aktualnie | OK? |
|---|---|---|
| 100 MB / plik | max 7.7 MB (`aero.glb`) | ✅ |
| 1 GB / repo (zalecane) | ~40 MB | ✅ |
| 100 GB miesięcznie transferu | n/a | ✅ |
| GitHub Pages do 100 GB miesięcznie | n/a | ✅ |

Jeżeli kiedyś będziesz dodawać duże filmy/PSD — używaj [Git LFS](https://git-lfs.github.com/).
