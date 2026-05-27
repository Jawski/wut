import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const DRACO_DECODER_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

let dracoLoader = null;
function getDracoLoader() {
    if (dracoLoader) return dracoLoader;
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_URL);
    return dracoLoader;
}

export const PART_FILES = [
    { category: 'engine',     url: 'models/parts/engine.glb' },
    { category: 'chassis',    url: 'models/parts/chassis.glb' },
    { category: 'suspension', url: 'models/parts/suspension.glb' },
    { category: 'aero',       url: 'models/parts/aero.glb' },
];

const DIM_OPACITY = 0.035;
const FULL_OPACITY = 1.0;
const OPAQUE_THRESHOLD = 0.985;

export function loadCarParts(onProgress) {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(getDracoLoader());

    const totals = PART_FILES.map(() => ({ loaded: 0, total: 0 }));

    function emit() {
        if (!onProgress) return;
        const sumL = totals.reduce((s, t) => s + t.loaded, 0);
        const sumT = totals.reduce((s, t) => s + (t.total || 0), 0);
        const p = sumT > 0 ? sumL / sumT : 0;
        onProgress(Math.max(0, Math.min(1, p)));
    }

    const promises = PART_FILES.map((p, idx) => new Promise((resolve, reject) => {
        loader.load(
            p.url,
            (gltf) => {
                const group = new THREE.Group();
                group.name = p.category;
                group.userData.category = p.category;
                group.add(gltf.scene);
                resolve({ category: p.category, group });
            },
            (xhr) => {
                totals[idx].loaded = xhr.loaded;
                totals[idx].total = xhr.total || Math.max(xhr.loaded, totals[idx].total);
                emit();
            },
            reject
        );
    }));

    return Promise.all(promises).then((parts) => {
        const rootGroup = new THREE.Group();
        const partGroups = {};
        const allMeshes = [];

        parts.forEach(({ category, group }) => {
            partGroups[category] = group;
            rootGroup.add(group);
            group.traverse((c) => {
                if (c.isMesh) {
                    c.userData.category = category;
                    c.castShadow = true;
                    c.receiveShadow = true;
                    prepareMaterial(c);
                    c.frustumCulled = false;
                    allMeshes.push(c);
                }
            });
        });

        normalizeRoot(rootGroup);

        return { rootGroup, partGroups, allMeshes };
    });
}

function normalizeRoot(root) {
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const TARGET = 4.2;
    const scale = TARGET / maxDim;
    root.scale.setScalar(scale);

    const box2 = new THREE.Box3().setFromObject(root);
    const c2 = new THREE.Vector3();
    box2.getCenter(c2);
    root.position.x -= c2.x;
    root.position.y -= box2.min.y;
    root.position.z -= c2.z;
}

function prepareMaterial(mesh) {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((m) => {
        if (!m) return;
        m.transparent = false;
        m.opacity = FULL_OPACITY;
        m.depthWrite = true;
        m.userData.targetOpacity = FULL_OPACITY;
        m.side = THREE.DoubleSide;
    });
}

export function applyDept(partGroups, dept) {
    const knownCategories = Object.keys(partGroups);
    const showEverything =
        dept === 'all' ||
        dept === 'aero' ||
        dept === 'chassis' ||
        dept === 'suspension' ||
        dept === 'electronics' ||
        !knownCategories.includes(dept);

    Object.entries(partGroups).forEach(([cat, group]) => {
        const isActive = showEverything || dept === cat;
        const targetOpacity = isActive ? FULL_OPACITY : DIM_OPACITY;
        group.traverse((c) => {
            if (!c.isMesh || !c.material) return;
            const mats = Array.isArray(c.material) ? c.material : [c.material];
            mats.forEach((m) => {
                if (!m) return;
                m.userData.targetOpacity = targetOpacity;
            });
        });
    });
}

export function tickOpacity(allMeshes, dt) {
    const speed = 5.5;
    for (const mesh of allMeshes) {
        if (!mesh.material) continue;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
            if (!m || m.userData.targetOpacity == null) continue;
            const target = m.userData.targetOpacity;
            if (Math.abs(m.opacity - target) > 0.001) {
                m.opacity = THREE.MathUtils.lerp(m.opacity, target, Math.min(1, speed * dt));
            }
            const wantsOpaque = m.opacity >= OPAQUE_THRESHOLD;
            if (wantsOpaque) {
                if (m.transparent) {
                    m.transparent = false;
                    m.opacity = 1.0;
                    m.depthWrite = true;
                    m.needsUpdate = true;
                }
            } else {
                if (!m.transparent) {
                    m.transparent = true;
                    m.depthWrite = false;
                    m.needsUpdate = true;
                }
            }
        }
    }
}

export function createWindTunnel(scene) {
    const NUM_STREAMS = 18;
    const SEGMENTS = 110;
    const TUBE_RADIUS = 0.022;

    const CAR_HALF_LEN = 2.1;
    const CAR_HEIGHT   = 1.55;
    const CAR_HALF_WID = 0.55;

    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: 0.85 },
            uColor: { value: new THREE.Color(0xdfeaff) },  // lekko niebieskawy biały
        },
        vertexShader: /* glsl */ `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform float uSpeed;
            uniform vec3  uColor;
            varying vec2  vUv;

            void main() {
                float u = vUv.x;
                float base = 0.10;
                const float PULSES = 2.0;
                float flow = fract(u * PULSES - uTime * uSpeed);
                float pulse = smoothstep(0.0, 0.10, flow) * smoothstep(0.62, 0.10, flow);
                float endFade = smoothstep(0.0, 0.05, u) * smoothstep(1.0, 0.93, u);

                float alpha = (base + pulse * 0.7) * endFade * 0.55;
                if (alpha < 0.01) discard;
                gl_FragColor = vec4(uColor, alpha);
            }
        `,
    });

    const group = new THREE.Group();
    group.visible = false;

    function makeCurve(type, lane) {
        const xFront =  CAR_HALF_LEN + 2.6 + Math.random() * 0.8;
        const xRear  = -CAR_HALF_LEN - 2.6 - Math.random() * 0.8;
        const pts = [];

        if (type === 'over') {
            const z = lane * CAR_HALF_WID * 0.7;
            const yBase = 0.55;
            const yPeak = CAR_HEIGHT + 0.35 + Math.abs(lane) * 0.15;
            pts.push(new THREE.Vector3(xFront,        yBase,          z));
            pts.push(new THREE.Vector3(CAR_HALF_LEN*0.75, yBase + 0.25, z));
            pts.push(new THREE.Vector3(CAR_HALF_LEN*0.15, yPeak,       z * 0.85));
            pts.push(new THREE.Vector3(-CAR_HALF_LEN*0.5, yPeak*0.78,  z * 0.9));
            pts.push(new THREE.Vector3(-CAR_HALF_LEN*0.95, yBase+0.5,  z));
            pts.push(new THREE.Vector3(xRear,         yBase + 0.15,    z));
        } else if (type === 'side') {
            const y = 0.35 + Math.abs(lane) * 0.85;
            const zSide = Math.sign(lane || 1) * CAR_HALF_WID;
            const zBulge = Math.sign(lane || 1) * (CAR_HALF_WID + 0.55 + Math.abs(lane) * 0.25);
            pts.push(new THREE.Vector3(xFront,         y, zSide * 0.6));
            pts.push(new THREE.Vector3(CAR_HALF_LEN*0.8,  y, zSide));
            pts.push(new THREE.Vector3(0,              y, zBulge));
            pts.push(new THREE.Vector3(-CAR_HALF_LEN*0.8, y, zSide));
            pts.push(new THREE.Vector3(xRear,          y, zSide * 0.6));
        } else {
            const z = lane * CAR_HALF_WID * 0.8;
            const y = 0.08;
            pts.push(new THREE.Vector3(xFront, y, z));
            pts.push(new THREE.Vector3(0,      y, z));
            pts.push(new THREE.Vector3(xRear,  y, z));
        }
        return new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
    }

    const plan = [];
    for (let i = 0; i < 6; i++)  plan.push({ type: 'over', lane: (i / 5) * 2 - 1 });
    for (let i = 0; i < 8; i++)  plan.push({ type: 'side', lane: (i % 2 === 0 ? -1 : 1) * (0.3 + (i >> 1) * 0.25) });
    for (let i = 0; i < 4; i++)  plan.push({ type: 'under', lane: (i / 3) * 2 - 1 });

    plan.forEach((cfg, idx) => {
        const curve = makeCurve(cfg.type, cfg.lane);
        const tube = new THREE.TubeGeometry(curve, SEGMENTS, TUBE_RADIUS, 6, false);
        const mesh = new THREE.Mesh(tube, material);
        const phase = idx / plan.length;
        const uvAttr = tube.attributes.uv;
        for (let j = 0; j < uvAttr.count; j++) {
            uvAttr.setX(j, uvAttr.getX(j) + phase);
        }
        uvAttr.needsUpdate = true;
        group.add(mesh);
    });

    scene.add(group);

    return {
        group,
        material,
        update(dt) {
            material.uniforms.uTime.value += dt;
        },
        set visible(v) { group.visible = v; },
        get visible() { return group.visible; },
    };
}

export const createSmokeSystem = createWindTunnel;
