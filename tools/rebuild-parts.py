"""
WUT Racing — pełny rebuild GLB-ów z .blend.

Robi 3 rzeczy:
  1. Apply wszystkich modyfikatorów na każdym widocznym meshu
     (rozwiązuje brak kół po jednej stronie — Mirror Modifier baked).
  2. Wypieka (bake) materiały, których Base Color przechodzi przez Mix node /
     Color Ramp / inny złożony graph. Dzięki temu naklejki sponsorów,
     "WARSAW TU", "006" itp. widoczne w Blenderze trafiają do GLB jako pojedyncza
     teksturka, którą Three.js wczyta jako Base Color.
  3. Kategoryzuje widoczne meshe (engine / chassis / suspension / aero)
     po nazwach, eksportuje każdy bucket jako osobny GLB z Draco mesh compression.

Wynik trafia do `models/parts/<category>.glb`.

Usage:
  "C:\\Program Files\\Blender Foundation\\Blender 5.1\\blender.exe" \
    --background --python tools/rebuild-parts.py
"""
import bpy
import os
import re
import sys
import time

BLEND = r"C:\Users\Janek\Downloads\WUT6TXTD.blend"
PROJECT_ROOT = r"C:\Users\Janek\Desktop\projekt strony"
OUT_DIR = os.path.join(PROJECT_ROOT, "models", "parts")
BAKE_TMP_DIR = os.path.join(PROJECT_ROOT, "models", "parts", "_baked")

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(BAKE_TMP_DIR, exist_ok=True)

BAKE_RES = 2048      # rozdzielczość bake — 2K wystarczy na naklejki
BAKE_SAMPLES = 1     # bake DIFFUSE color nie potrzebuje wielu próbek

# Wzorce kategoryzacji (kolejność ważna — pierwszy trafiony wygrywa)
CATEGORY_PATTERNS = [
    ('suspension', re.compile(
        r'(wheel|tire|tyre|rim|hub|brake|disc|caliper|opona|kolo|felg|piasta|'
        r'wishbone|arm|damper|spring|push.?rod|tie.?rod|rocker|amorty|zawieszenie|wahacz)',
        re.I)),
    ('engine', re.compile(
        r'(engine|silnik|motor|cylinder|piston|crank|exhaust|intake|wydech|wlot|'
        r'throttle|airbox|ecu|injector|oilpan|oil.?pan|chlodnica|radiator|block|'
        r'fs22.*block)',
        re.I)),
    ('aero', re.compile(
        r'(wing|skrzydl|splitter|diffuser|dyfuzor|sidepod|undertray|barge|airfoil)',
        re.I)),
    ('chassis', re.compile(
        r'(chassis|rama|frame|tube|tubular|monocoque|monokok|mono(?:\.|$)|'
        r'bulkhead|roll.?hoop|roll.?bar|rollbar|firewall|body|panel|nadwozie|'
        r'cockpit|seat|fotel|head.?rest|backplate)',
        re.I)),
]

# Dla nazw bezsensownych (Bolid2.083 itp.) używamy pozycji w bbox:
# - meshe nisko i daleko z boku = wheels/suspension
# - meshe z tyłu, mid-height = engine
# - meshe wysoko nad bolidem = chassis (rollbar)
# - cienkie i na dole = aero (splitter, diffuser)

def categorize(obj):
    """Zwraca kategorię (engine / chassis / suspension / aero) dla obiektu."""
    name = obj.name
    # Najpierw słowne wzorce
    for cat, rx in CATEGORY_PATTERNS:
        if rx.search(name):
            return cat

    # Convention prefiksu CAD w tym .blend:
    #   Bolid6.0xx → engine bay (Z konfiguracji użytkownika)
    #   Bolid2.0xx → suspension (przednią część)
    #   BolidPrad. → engine/elektryka
    #   FS22.*BLOCK*  → engine block
    if re.match(r'^Bolid6[\._]', name, re.I): return 'engine'
    if re.match(r'^Bolid2[\._]', name, re.I): return 'suspension'
    if re.match(r'^BolidPrad[\._]', name, re.I): return 'engine'
    if re.match(r'^FS22[\._]', name, re.I): return 'engine'

    # Reszta CAD codes (FS25.*, Bolid1.*) — pozycja w bbox.
    # Use world bbox center. Convention:
    #   +X = front, -X = rear, +Y = up, ±Z = sides
    try:
        from mathutils import Vector
        corners = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
        cx = sum(p.x for p in corners) / 8.0
        cy = sum(p.y for p in corners) / 8.0
        cz = sum(p.z for p in corners) / 8.0
        # Rough heuristics (przybliżone do bbox bolidu):
        if cx < -1.5 and cy < 0.6:
            # rear-low region — engine area
            return 'engine'
        if abs(cz) > 0.6 and cy < 0.3:
            # blisko boku, nisko — koła / zawieszenie
            return 'suspension'
        if cx > 0.4 and cy < 0.3:
            # niżej z przodu — splitter / przedni element aero
            return 'aero'
    except Exception:
        pass

    return 'chassis'   # default — strukturalna część ramy / nadwozia


# ---------------------------------------------------------------------------
# Krok 1: open + apply modifiers
# ---------------------------------------------------------------------------

def apply_all_modifiers():
    visible = [o for o in bpy.context.scene.objects
               if o.type == 'MESH' and not o.hide_get() and not o.hide_render]
    print(f"\n[1/3] Apply modifiers on {len(visible)} visible meshes...")
    applied_count = 0
    for obj in visible:
        if not obj.modifiers:
            continue
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        for mod in list(obj.modifiers):
            try:
                bpy.ops.object.modifier_apply(modifier=mod.name)
                applied_count += 1
                print(f"  Applied {mod.type:>20s} on {obj.name}")
            except Exception as e:
                print(f"  FAIL {mod.type:>20s} on {obj.name}: {e}")
    print(f"  Total modifiers applied: {applied_count}")


# ---------------------------------------------------------------------------
# Krok 2: bake materials z złożonym shader graph
# ---------------------------------------------------------------------------

def material_needs_bake(material):
    """True jeśli materiał ma JAKIEKOLWIEK tekstury lub złożony graph.
    Brute-force: bakujemy wszystko co ma Image Texture — gwarantuje że
    naklejki, tekstury skrzydeł itd. trafią do GLB jako jedna mapa Base Color."""
    if not material or not material.use_nodes:
        return False
    nodes = material.node_tree.nodes
    has_texture = any(n.type == 'TEX_IMAGE' for n in nodes)
    complex_types = {'MIX_RGB', 'MIX_SHADER', 'MIX', 'GROUP', 'CURVE_RGB',
                     'HUE_SAT', 'BRIGHTCONTRAST', 'GAMMA', 'INVERT',
                     'MAP_RANGE', 'MATH', 'VECT_MATH', 'MAPPING'}
    has_complex = any(n.type in complex_types for n in nodes)
    return has_texture or has_complex


def setup_cycles_bake():
    bpy.context.scene.render.engine = 'CYCLES'
    bpy.context.scene.cycles.device = 'CPU'
    bpy.context.scene.cycles.samples = BAKE_SAMPLES
    bpy.context.scene.render.bake.use_pass_direct = False
    bpy.context.scene.render.bake.use_pass_indirect = False
    bpy.context.scene.render.bake.use_pass_color = True
    bpy.context.scene.render.bake.margin = 16
    bpy.context.scene.render.bake.use_clear = True


def ensure_uv_map(obj):
    if obj.data.uv_layers:
        return True
    print(f"  No UV on {obj.name} — smart projecting...")
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    try:
        bpy.ops.uv.smart_project()
    except Exception as e:
        print(f"  UV unwrap fail: {e}")
        bpy.ops.object.mode_set(mode='OBJECT')
        return False
    bpy.ops.object.mode_set(mode='OBJECT')
    return True


def _rewire_to_baked(nt, bake_node):
    """Podłącz wypieczoną teksturę pod Base Color Principled BSDF."""
    out_node = next((n for n in nt.nodes if n.type == 'OUTPUT_MATERIAL'), None)
    bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if bsdf:
        bc = bsdf.inputs.get('Base Color')
        for link in list(bc.links):
            nt.links.remove(link)
        nt.links.new(bake_node.outputs['Color'], bc)
        # ścisz metalliczność/odbicia żeby naklejki były czytelne
        if 'Metallic' in bsdf.inputs:
            bsdf.inputs['Metallic'].default_value = 0.0
        if 'Roughness' in bsdf.inputs:
            bsdf.inputs['Roughness'].default_value = 0.55
        if out_node:
            surf = out_node.inputs.get('Surface')
            if surf and (not surf.is_linked or surf.links[0].from_node != bsdf):
                for link in list(surf.links):
                    nt.links.remove(link)
                nt.links.new(bsdf.outputs['BSDF'], surf)


def bake_object(obj, mats_needing_bake, already_baked):
    """Bake WSZYSTKIE materiały obiektu (które tego wymagają i nie były jeszcze
    zrobione). Obsługuje multi-material meshe — każdy slot dostaje swój target."""
    if not obj.material_slots:
        return
    if not ensure_uv_map(obj):
        print(f"  skip {obj.name} (no UV)")
        return

    # Dodaj target image node do KAŻDEGO materiału obiektu
    # (Blender wymaga active image node w każdym materiale bakowanego obiektu)
    targets = {}   # mat.name -> (node, image, node_tree)
    for slot in obj.material_slots:
        mat = slot.material
        if not mat or not mat.use_nodes:
            continue
        nt = mat.node_tree
        safe = re.sub(r'[^A-Za-z0-9_-]', '_', mat.name)
        img_name = f"baked_{safe}"
        img = bpy.data.images.get(img_name) or bpy.data.images.new(
            img_name, BAKE_RES, BAKE_RES, alpha=False)
        img.colorspace_settings.name = 'sRGB'
        node = nt.nodes.new('ShaderNodeTexImage')
        node.image = img
        node.label = 'BAKE_TARGET'
        nt.nodes.active = node
        targets[mat.name] = (node, img, nt)

    if not targets:
        return

    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    start = time.time()
    try:
        bpy.ops.object.bake(type='DIFFUSE')
    except Exception as e:
        print(f"  BAKE FAIL on {obj.name}: {e}")
        for _name, (node, _img, nt) in targets.items():
            nt.nodes.remove(node)
        return
    elapsed = time.time() - start

    # Pack + rewire każdy materiał
    for mat_name, (node, img, nt) in targets.items():
        try:
            img.pack()
        except Exception:
            pass
        try:
            img.filepath_raw = os.path.join(BAKE_TMP_DIR, f"baked_{re.sub(r'[^A-Za-z0-9_-]','_',mat_name)}.png")
            img.file_format = 'PNG'
            img.save()
        except Exception:
            pass
        _rewire_to_baked(nt, node)
        already_baked.add(mat_name)
    print(f"  ✓ {obj.name}: baked {len(targets)} mat(s) in {elapsed:.1f}s")


def bake_complex_materials():
    setup_cycles_bake()
    visible = [o for o in bpy.context.scene.objects
               if o.type == 'MESH' and not o.hide_get() and not o.hide_render]

    # Które materiały wymagają bake
    mats_needing_bake = set()
    for obj in visible:
        for slot in obj.material_slots:
            if slot.material and material_needs_bake(slot.material):
                mats_needing_bake.add(slot.material.name)

    print(f"\n[2/3] Bake materials: {len(mats_needing_bake)} unikalnych do wypieczenia")
    already_baked = set()
    for obj in visible:
        obj_mats = [s.material.name for s in obj.material_slots if s.material]
        todo = [m for m in obj_mats if m in mats_needing_bake and m not in already_baked]
        if not todo:
            continue
        bake_object(obj, mats_needing_bake, already_baked)
    print(f"  Razem wypieczono: {len(already_baked)} materiałów")


# ---------------------------------------------------------------------------
# Krok 3: categorize + export per bucket
# ---------------------------------------------------------------------------

def export_parts():
    visible = [o for o in bpy.context.scene.objects
               if o.type == 'MESH' and not o.hide_get() and not o.hide_render]

    buckets = {'engine': [], 'chassis': [], 'suspension': [], 'aero': []}
    for o in visible:
        cat = categorize(o)
        buckets[cat].append(o)

    print(f"\n[3/3] Export parts:")
    for cat, lst in buckets.items():
        print(f"  {cat}: {len(lst)}")

    # Set back to Eevee/Workbench (any non-Cycles)
    try:
        bpy.context.scene.render.engine = 'BLENDER_EEVEE'
    except TypeError:
        try:
            bpy.context.scene.render.engine = 'BLENDER_WORKBENCH'
        except Exception:
            pass

    for cat, objs in buckets.items():
        if not objs:
            print(f"  Skip {cat} (empty)")
            continue
        bpy.ops.object.select_all(action='DESELECT')
        for o in objs:
            o.select_set(True)
        bpy.context.view_layer.objects.active = objs[0]
        out_path = os.path.join(OUT_DIR, f"{cat}.glb")
        print(f"\n  Exporting {cat}.glb ({len(objs)} meshes)...")
        try:
            bpy.ops.export_scene.gltf(
                filepath=out_path,
                export_format='GLB',
                use_selection=True,
                export_apply=False,   # już zaaplikowane w kroku 1
                export_yup=True,
                export_extras=False,
                export_animations=False,
                export_cameras=False,
                export_lights=False,
                export_materials='EXPORT',
                export_image_format='AUTO',  # zachowaj PNG dla normal maps
                export_normals=True,
                export_tangents=False,
                export_skins=False,
                export_morph=False,
                export_draco_mesh_compression_enable=True,
                export_draco_mesh_compression_level=6,
                export_draco_position_quantization=14,
                export_draco_normal_quantization=10,
                export_draco_texcoord_quantization=12,
            )
            size_mb = os.path.getsize(out_path) / (1024 * 1024)
            print(f"  → {size_mb:.1f} MB")
        except Exception as e:
            print(f"  EXPORT FAIL: {e}")
            import traceback; traceback.print_exc()


def main():
    print(f"Opening: {BLEND}")
    bpy.ops.wm.open_mainfile(filepath=BLEND)

    apply_all_modifiers()
    bake_complex_materials()
    export_parts()

    print("\n=== DONE ===")
    for f in sorted(os.listdir(OUT_DIR)):
        if f.endswith('.glb'):
            size = os.path.getsize(os.path.join(OUT_DIR, f)) / (1024 * 1024)
            print(f"  {f}: {size:.1f} MB")


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f"\nFATAL: {e}", file=sys.stderr)
        import traceback; traceback.print_exc()
        sys.exit(1)
