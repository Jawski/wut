/* ============================================
   Single-bolid page — bolid.html?id=<carId>
   Same dept-tour visuals as home but only technical data (no descriptions).
   ============================================ */

import * as THREE from 'three';
import { loadCarParts, applyDept, tickOpacity, createSmokeSystem } from './car-model.js';
import { CARS, findCar } from './cars-data.js';

const params = new URLSearchParams(location.search);
const carId = params.get('id') || 'wut6';
const car = findCar(carId) || CARS[0];

document.title = `${car.name} — WUT Racing`;
document.getElementById('hero-chip').textContent = car.hero.chip;
document.getElementById('hero-title').innerHTML = car.name.replace(/(\d+)/, '<span class="accent-line">$1</span>');
document.getElementById('hero-kicker').textContent = car.hero.kicker.toUpperCase();
document.getElementById('hero-year').textContent = car.year;
document.getElementById('hero-tagline').innerHTML = `<strong>${car.tagline}</strong>`;
document.getElementById('specs-title').innerHTML = `${car.name} <span class="text-accent">w liczbach</span>.`;
document.getElementById('ach-name').textContent = car.name;
document.getElementById('loader-mark').textContent = `WUT RACING · ${car.name}`;

function pickSpecs(specs, groups) {
    const out = [];
    for (const g of groups) {
        if (specs[g]) for (const [k, v] of Object.entries(specs[g])) out.push({ k, v });
    }
    return out;
}

const DEPT_SECTIONS = [
    { dept: 'aero',    eyebrow: '01 · Aero',       title: 'Aerodynamika.',     groups: ['Osiągi'],                        accentKeys: ['Downforce @ 60', 'Akceleracja boczna'] },
    { dept: 'chassis', eyebrow: '02 · Chassis',    title: 'Rama + zawieszenie.', groups: ['Konstrukcja', 'Wymiary i masa'], accentKeys: ['Rama', 'Masa'] },
    { dept: 'engine',  eyebrow: '03 · Powertrain', title: 'Silnik.',            groups: ['Silnik', 'Napęd'],               accentKeys: ['Moc szczyt.', 'Pojemność'] },
    { dept: 'all',     eyebrow: '04 · Osiągi',     title: 'Osiągi.',            groups: ['Osiągi'],                        accentKeys: ['0 – 100 km/h', 'V max'] },
];

function renderStory() {
    const wrap = document.getElementById('story-sections');
    wrap.innerHTML = DEPT_SECTIONS.map((s, idx) => {
        const rows = pickSpecs(car.specs, s.groups);
        const accents = rows.filter(r => s.accentKeys.includes(r.k));
        const rest = rows.filter(r => !s.accentKeys.includes(r.k));
        const accentCards = accents.map(r => `<div class="dept-big-stat"><div class="val">${r.v}</div><div class="lbl">${r.k}</div></div>`).join('');
        const tableRows = rest.map(r => `<div class="dept-spec-row"><div class="k">${r.k}</div><div class="v">${r.v}</div></div>`).join('');
        return `
            <div class="story-section" data-dept="${s.dept}">
                <div class="container">
                    <div class="story-split">
                        <div class="story-text reveal">
                            <span class="eyebrow">${s.eyebrow}</span>
                            <h2 class="h-1">${s.title}</h2>
                            ${accentCards ? `<div class="dept-big-stats">${accentCards}</div>` : ''}
                            ${tableRows ? `<div class="dept-spec-table">${tableRows}</div>` : ''}
                        </div>
                        <div class="story-visual reveal" data-delay="2">
                            <span class="label">// DZIAŁ / ${s.dept.toUpperCase()}</span>
                            <span class="big-num">${String(idx + 1).padStart(2, '0')}</span>
                            <span class="corner">${car.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderSpecs() {
    const wrap = document.getElementById('specs-grid');
    const flat = [];
    for (const [_, rows] of Object.entries(car.specs)) for (const [k, v] of Object.entries(rows)) flat.push({ k, v });
    const cells = flat.slice(0, 8);
    wrap.innerHTML = cells.map((c, i) => `<div class="spec-cell reveal" data-delay="${i % 4}"><div class="lbl">${c.k}</div><div class="val">${c.v}</div></div>`).join('');
}

function renderAchievements() {
    const list = document.getElementById('achievement-list');
    list.innerHTML = car.achievements.map(a => {
        const m = a.match(/^(\d{4})\s*[—\-]\s*(.+)$/);
        if (m) return `<li><span class="year">${m[1]}</span><span>${m[2]}</span></li>`;
        return `<li><span>${a}</span></li>`;
    }).join('');
}

renderStory();
renderSpecs();
renderAchievements();

// =================================================
// 3D SCENE
// =================================================
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

const carColorHex = parseInt(car.color.slice(1), 16);
scene.add(new THREE.AmbientLight(0x1a1a22, 0.55));
const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(6, 8, 5); scene.add(key);
const fillL = new THREE.DirectionalLight(0x4d6cff, 0.5); fillL.position.set(-8, 4, -3); scene.add(fillL);
const rim = new THREE.DirectionalLight(carColorHex, 1.8); rim.position.set(-4, 6, -7); scene.add(rim);
const bottomFill = new THREE.PointLight(carColorHex, 1.0, 8); bottomFill.position.set(0, 0.3, 3); scene.add(bottomFill);

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

    loaderFill.style.width = '100%';
    loaderPct.textContent = '100';
    setTimeout(() => {
        loaderEl.classList.add('is-hidden');
        document.body.classList.add('loaded');
    }, 400);
}).catch((err) => {
    console.error('GLB load error', err);
    loaderEl.querySelector('.loader-mark').textContent = 'BŁĄD ŁADOWANIA';
});

const storySections = Array.from(document.querySelectorAll('.story-section'));

// Stała pozycja bolidu dla dept-touru (Aero / Chassis / Engine)
const DEPT_TOUR_FRAME = { rot: -0.5, x: 1.4, camY: 2.0, camZ: 8.2, lookX: 0.9, lookY: 1.05 };

function buildKeyframes() {
    const frames = [{ rot: -0.45, x: 0, camY: 2.4, camZ: 9.0, lookX: 0, lookY: 1.1 }];
    storySections.forEach((sec, idx) => {
        const dept = sec.dataset.dept || 'all';
        const isDeptTour = dept === 'aero' || dept === 'chassis' || dept === 'engine';
        if (isDeptTour) {
            frames.push({ ...DEPT_TOUR_FRAME });
        } else {
            const odd = idx % 2 === 0;
            if (odd) {
                frames.push({ rot: -Math.PI / 2 - 0.15 - idx * Math.PI / 3, x: 2.0, camY: 1.8 + (idx % 3) * 0.4, camZ: 7.4, lookX: 1.5, lookY: 1.0 });
            } else {
                frames.push({ rot: -Math.PI + 0.5 - idx * Math.PI / 3, x: -2.0, camY: 3.2 - (idx % 3) * 0.3, camZ: 7.0, lookX: -1.5, lookY: 0.9 });
            }
        }
    });
    return frames;
}
const KEYFRAMES = buildKeyframes();
const STORY_END_VH = 1 + storySections.length;

let scrollY = 0;
let targetScroll = 0;
function lerp(a, b, t) { return a + (b - a) * t; }
function smoothstep(t) { return t * t * (3 - 2 * t); }

function getKeyframeAt(progress) {
    const totalSpan = KEYFRAMES.length - 1;
    const idx = Math.min(Math.floor(progress * totalSpan), totalSpan - 1);
    const localT = (progress * totalSpan) - idx;
    const t = smoothstep(Math.max(0, Math.min(1, localT)));
    const a = KEYFRAMES[idx], b = KEYFRAMES[idx + 1];
    return {
        rot:   lerp(a.rot,   b.rot,   t),
        x:     lerp(a.x,     b.x,     t),
        camY:  lerp(a.camY,  b.camY,  t),
        camZ:  lerp(a.camZ,  b.camZ,  t),
        lookX: lerp(a.lookX, b.lookX, t),
        lookY: lerp(a.lookY, b.lookY, t),
    };
}

function updateScroll() {
    const px = window.scrollY;
    const storyEndPx = window.innerHeight * STORY_END_VH;
    targetScroll = Math.max(0, Math.min(1, px / storyEndPx));
}
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

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
    }
}, { threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9] });
storySections.forEach(s => deptObserver.observe(s));

function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);

canvas.style.position = 'fixed';
canvas.style.inset = '0';
canvas.style.zIndex = '0';

function updateCanvasOpacity() {
    const px = window.scrollY;
    const storyEndPx = window.innerHeight * STORY_END_VH;
    const fadeDistance = window.innerHeight * 0.8;
    let op = 1;
    if (px > storyEndPx - fadeDistance * 0.3) {
        op = 1 - ((px - (storyEndPx - fadeDistance * 0.3)) / fadeDistance);
    }
    canvas.style.opacity = Math.max(0, Math.min(1, op)).toFixed(3);
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
    scrollY = lerp(scrollY, targetScroll, 0.08);
    const k = getKeyframeAt(scrollY);
    const inDeptTour = currentDept === 'aero' || currentDept === 'chassis' || currentDept === 'engine';

    if (carModel) {
        const idleSpin = scrollY < 0.02 ? now * 0.00015 : 0;
        carGroup.rotation.y = k.rot + idleSpin;
        carGroup.position.x = k.x;
        carGroup.position.y = inDeptTour ? 0 : Math.sin(now * 0.0008) * 0.04;
    }

    if (smokeSystem) {
        const wantSmoke = currentDept === 'aero';
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
