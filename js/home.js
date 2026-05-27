/* ============================================
   HOME — 3D bolid + scroll story
   Każda sekcja ma data-dept ('aero' | 'chassis' | 'engine' | 'all')
   ============================================ */

import * as THREE from 'three';
import { loadCarParts, applyDept, tickOpacity, createSmokeSystem } from './car-model.js';

const canvas = document.getElementById('hero-canvas');
const loaderEl = document.getElementById('loader');
const loaderFill = document.querySelector('.loader-bar-fill');
const loaderPct = document.querySelector('.loader-pct span');

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x050505, 14, 36);

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2.6, 9);
camera.lookAt(0, 1.1, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

// Lights
scene.add(new THREE.AmbientLight(0x1a1a22, 0.55));
const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(6, 8, 5); scene.add(key);
const fillL = new THREE.DirectionalLight(0x4d6cff, 0.5); fillL.position.set(-8, 4, -3); scene.add(fillL);
const rim = new THREE.DirectionalLight(0xe10600, 1.8); rim.position.set(-4, 6, -7); scene.add(rim);
const bottomFill = new THREE.PointLight(0xe10600, 1.0, 8); bottomFill.position.set(0, 0.3, 3); scene.add(bottomFill);

const ground = new THREE.Mesh(
    new THREE.CircleGeometry(40, 64),
    new THREE.MeshStandardMaterial({ color: 0x0a0a0d, metalness: 0.55, roughness: 0.6 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const grid = new THREE.GridHelper(60, 60, 0x2a2a30, 0x12121a);
grid.material.transparent = true;
grid.material.opacity = 0.25;
scene.add(grid);

const carGroup = new THREE.Group();
scene.add(carGroup);

let carModel = null;
let partGroups = null;
let allMeshes = null;
let smokeSystem = null;
let currentDept = 'all';

// --- Loader chowamy gdy zdjęcie hero jest gotowe (model 3D ładuje się w tle) ---
let loaderHidden = false;
function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    loaderEl.classList.add('is-hidden');
    document.body.classList.add('loaded');
}
const heroImg = document.getElementById('hero-bg-img');
if (heroImg) {
    if (heroImg.complete && heroImg.naturalWidth > 0) hideLoader();
    else {
        heroImg.addEventListener('load', hideLoader);
        heroImg.addEventListener('error', hideLoader);
    }
}
// Fallback — nie trzymaj loadera dłużej niż 2.5 s niezależnie od wszystkiego
setTimeout(hideLoader, 2500);

// Karuzela hero jest inicjalizowana w common.js (initHeroCarousel) —
// współdzielona ze stroną "O nas".

// Load all 4 parts in parallel (w tle — model 3D potrzebny dopiero w sekcjach story)
loadCarParts((p) => {
    const display = Math.floor(p * 100);
    loaderFill.style.width = display + '%';
    loaderPct.textContent = display;
}).then(({ rootGroup, partGroups: pg, allMeshes: meshes }) => {
    carGroup.add(rootGroup);
    carModel = rootGroup;
    partGroups = pg;
    allMeshes = meshes;
    smokeSystem = createSmokeSystem(scene);
    hideLoader();
}).catch((err) => {
    console.error('GLB load error', err);
    hideLoader();
});

// Scroll-driven keyframes — pozycyjne (działa z przerywnikiem events-strip
// o dowolnej wysokości między sekcjami story).
const storyEl = document.querySelector('.story');
const storySections = Array.from(storyEl.querySelectorAll('.story-section'));

// Stała pozycja bolidu dla całego dept-touru (Aero / Chassis / Engine).
const DEPT_TOUR_FRAME = {
    rot: -0.5, x: 1.4, camY: 2.0, camZ: 8.2, lookX: 0.9, lookY: 1.05,
};

function buildKeyframes() {
    // Keyframe 0 = hero (canvas zakryty zdjęciem, ale lerp startuje stąd)
    const frames = [
        { rot: -0.45, x: 0, camY: 2.4, camZ: 9.0, lookX: 0, lookY: 1.1 },
    ];
    storySections.forEach((sec) => {
        const dept = sec.dataset.dept || 'all';
        const isDeptTour =
            dept === 'aero' || dept === 'chassis' || dept === 'suspension' ||
            dept === 'electronics' || dept === 'engine';
        if (isDeptTour) {
            frames.push({ ...DEPT_TOUR_FRAME });
        } else {
            // data-side decyduje gdzie jest tekst → bolid po przeciwnej stronie
            const side = sec.dataset.side || 'left';
            if (side === 'left') {
                // tekst lewo → bolid prawo
                frames.push({ rot: -Math.PI / 2 - 0.2, x: 2.0, camY: 1.9, camZ: 7.4, lookX: 1.5, lookY: 1.0 });
            } else {
                // tekst prawo → bolid lewo
                frames.push({ rot: -Math.PI + 0.4, x: -2.0, camY: 2.6, camZ: 7.2, lookX: -1.5, lookY: 0.95 });
            }
        }
    });
    return frames;
}
const KEYFRAMES = buildKeyframes();

function lerp(a, b, t) { return a + (b - a) * t; }
function smoothstep(t) { return t * t * (3 - 2 * t); }
function clamp01(v) { return Math.max(0, Math.min(1, v)); }

// Px-pozycje scrolla, przy których dany keyframe jest "aktywny".
// keyAnchors[0] = hero (0). keyAnchors[i+1] = scrollY gdy środek
// storySections[i] trafia w środek viewportu.
let keyAnchors = [];
function computeAnchors() {
    keyAnchors = [0];
    storySections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        const absTop = window.scrollY + rect.top;
        const center = absTop + sec.offsetHeight / 2;
        keyAnchors.push(Math.max(1, center - window.innerHeight / 2));
    });
}
computeAnchors();
window.addEventListener('load', computeAnchors);

function getKeyframeAtScroll(px) {
    const a = keyAnchors;
    if (px <= a[0]) return KEYFRAMES[0];
    if (px >= a[a.length - 1]) return KEYFRAMES[KEYFRAMES.length - 1];
    for (let i = 0; i < a.length - 1; i++) {
        if (px >= a[i] && px < a[i + 1]) {
            const t = smoothstep(clamp01((px - a[i]) / (a[i + 1] - a[i])));
            const ka = KEYFRAMES[i], kb = KEYFRAMES[i + 1];
            return {
                rot:   lerp(ka.rot,   kb.rot,   t),
                x:     lerp(ka.x,     kb.x,     t),
                camY:  lerp(ka.camY,  kb.camY,  t),
                camZ:  lerp(ka.camZ,  kb.camZ,  t),
                lookX: lerp(ka.lookX, kb.lookX, t),
                lookY: lerp(ka.lookY, kb.lookY, t),
            };
        }
    }
    return KEYFRAMES[KEYFRAMES.length - 1];
}

let smoothPx = window.scrollY;

// Dept-tour: śledzimy widoczność WSZYSTKICH sekcji i wybieramy
// tę najbardziej w viewport. Mapa trzyma aktualny ratio każdej sekcji.
const sectionRatios = new Map();
storySections.forEach(s => sectionRatios.set(s, 0));

const deptObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => sectionRatios.set(e.target, e.intersectionRatio));
    let best = null, bestRatio = 0;
    sectionRatios.forEach((ratio, target) => {
        if (ratio > bestRatio) { best = target; bestRatio = ratio; }
    });
    if (best && partGroups) {
        const d = best.dataset.dept || 'all';
        if (d !== currentDept) {
            currentDept = d;
            applyDept(partGroups, d);
        }
    } else if (bestRatio === 0 && currentDept !== 'all' && partGroups) {
        // żadna sekcja story nie jest w viewport (np. wróciliśmy do hero) →
        // reset do 'all' żeby zniknął dym/izolacja działów
        currentDept = 'all';
        applyDept(partGroups, 'all');
    }
}, { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9] });
storySections.forEach(s => deptObserver.observe(s));

function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    computeAnchors();
}
window.addEventListener('resize', onResize);

canvas.style.position = 'fixed';
canvas.style.inset = '0';
canvas.style.zIndex = '0';

// Canvas widoczny przez całe .story, gaśnie przy jego dolnej krawędzi.
function updateCanvasOpacity() {
    const px = window.scrollY;
    const storyBottom = storyEl.offsetTop + storyEl.offsetHeight;
    const fadeStart = storyBottom - window.innerHeight * 1.15;
    const fadeDist = window.innerHeight * 0.85;
    let op = 1;
    if (px > fadeStart) {
        op = 1 - (px - fadeStart) / fadeDist;
    }
    op = Math.max(0, Math.min(1, op));
    canvas.style.opacity = op.toFixed(3);
    canvas.style.pointerEvents = op < 0.05 ? 'none' : '';
}

const mouse = { x: 0, y: 0 };
const mouseTarget = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    mouseTarget.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseTarget.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

let lastT = performance.now();
function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;

    // płynne wygładzenie pozycji scrolla
    smoothPx = lerp(smoothPx, window.scrollY, 0.085);
    const k = getKeyframeAtScroll(smoothPx);

    const inDeptTour =
        currentDept === 'aero' ||
        currentDept === 'chassis' ||
        currentDept === 'suspension' ||
        currentDept === 'electronics' ||
        currentDept === 'engine';

    if (carModel) {
        // delikatny idle-spin tylko gdy jesteśmy na samej górze (hero)
        const idleSpin = smoothPx < 30 ? now * 0.00015 : 0;
        carGroup.rotation.y = k.rot + idleSpin;
        carGroup.position.x = k.x;
        // Podczas dept-touru bolid stoi nieruchomo (bez floatingu)
        carGroup.position.y = inDeptTour ? 0 : Math.sin(now * 0.0008) * 0.04;
    }

    // Strumienie opływu — widoczne TYLKO gdy aktywna sekcja to aero.
    // Twardy fix: dodatkowo sprawdzamy pozycję DOM, bo IntersectionObserver
    // przy szybkim scrollu nie zawsze łapie ratio=0 dla aero.
    if (smokeSystem) {
        let allowDept = currentDept;
        const firstSec = storySections[0];
        if (firstSec) {
            const rect = firstSec.getBoundingClientRect();
            if (rect.top > window.innerHeight * 0.5) {
                // wróciliśmy do hero / nad pierwszą sekcją story
                allowDept = 'all';
                if (currentDept !== 'all' && partGroups) {
                    currentDept = 'all';
                    applyDept(partGroups, 'all');
                }
            }
        }
        const wantSmoke = allowDept === 'aero';
        if (smokeSystem.visible !== wantSmoke) smokeSystem.visible = wantSmoke;
        if (wantSmoke) smokeSystem.update(dt);
    }
    if (allMeshes) tickOpacity(allMeshes, dt);

    mouse.x = lerp(mouse.x, mouseTarget.x, 0.05);
    mouse.y = lerp(mouse.y, mouseTarget.y, 0.05);
    camera.position.x = mouse.x * 0.3;
    camera.position.y = k.camY - mouse.y * 0.2;
    camera.position.z = k.camZ;
    camera.lookAt(k.lookX, k.lookY, 0);

    updateCanvasOpacity();
    renderer.render(scene, camera);
}
animate();

const marqueeTracks = document.querySelectorAll('.marquee-track');
marqueeTracks.forEach((tr) => { tr.innerHTML += tr.innerHTML; });
