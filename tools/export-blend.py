"""
WUT Racing — Blender export script.
Reads the loaded .blend file, lists all mesh objects, prints a category
mapping, then exports the whole scene as a single GLB with mesh names
preserved (so Three.js can toggle visibility per part).

Usage (Windows):
  "C:\\Program Files\\Blender Foundation\\Blender 5.1\\blender.exe" ^
    --background WUT6TXTD.blend ^
    --python tools\\export-blend.py
"""
import bpy
import os
import re
import sys

# Output path inside the project
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_GLB = os.path.join(PROJECT_ROOT, "models", "WUT6.glb")
REPORT_TXT = os.path.join(PROJECT_ROOT, "models", "WUT6.meshes.txt")

# Same category patterns as in JS
CATEGORY_PATTERNS = [
    ('wheels',     re.compile(r'(wheel|tire|tyre|rim|hub|brake|disc|caliper|opona|kolo|felg|piasta)', re.I)),
    ('engine',     re.compile(r'(engine|silnik|motor|cylinder|piston|crank|exhaust|intake|wydech|wlot|throttle|airbox|ecu|injector|chlodnica|radiator)', re.I)),
    ('suspension', re.compile(r'(suspension|wishbone|arm|damper|spring|pushrod|push.?rod|tie.?rod|rocker|amorty|zawieszenie|wahacz)', re.I)),
    ('aero',       re.compile(r'(wing|skrzydl|splitter|diffuser|dyfuzor|sidepod|aero|undertray|barge|airfoil)', re.I)),
    ('cockpit',    re.compile(r'(cockpit|seat|fotel|steer|kierow|pedal|driver|harness|head.?rest)', re.I)),
    ('chassis',    re.compile(r'(chassis|rama|frame|tube|tubular|monocoque|monokok|bulkhead|roll.?hoop|firewall)', re.I)),
    ('body',       re.compile(r'(body|panel|cover|skin|nadwozie|nose|noska|hood|maska)', re.I)),
]

def categorize(name):
    for cat, rx in CATEGORY_PATTERNS:
        if rx.search(name or ''):
            return cat
    return 'other'

def collection_chain(obj):
    """Return list of collection names that contain this object."""
    out = []
    for col in bpy.data.collections:
        if obj.name in col.objects:
            out.append(col.name)
    return out

def inspect_and_export():
    # Gather mesh objects
    mesh_objs = [o for o in bpy.data.objects if o.type == 'MESH']
    print(f"\n=== WUT Racing — Blender → GLB ===")
    print(f"Total objects in scene: {len(bpy.data.objects)}")
    print(f"Mesh objects: {len(mesh_objs)}")
    print(f"Collections: {[c.name for c in bpy.data.collections]}")

    by_cat = {}
    report_lines = []
    report_lines.append(f"Total meshes: {len(mesh_objs)}\n")
    report_lines.append("Collections: " + ", ".join(c.name for c in bpy.data.collections) + "\n\n")
    report_lines.append("Mesh name → category (collection chain)\n")
    report_lines.append("=" * 60 + "\n")

    for o in sorted(mesh_objs, key=lambda x: x.name.lower()):
        cat = categorize(o.name)
        by_cat.setdefault(cat, []).append(o.name)
        cols = collection_chain(o)
        report_lines.append(f"  {o.name:50s} → {cat:10s} [{','.join(cols)}]\n")

    report_lines.append("\nCategory summary:\n")
    for cat, names in sorted(by_cat.items()):
        report_lines.append(f"  {cat}: {len(names)} meshes\n")

    # Write report
    os.makedirs(os.path.dirname(REPORT_TXT), exist_ok=True)
    with open(REPORT_TXT, 'w', encoding='utf-8') as fh:
        fh.writelines(report_lines)
    print(f"\nReport written: {REPORT_TXT}")

    # Respect viewport visibility — the .blend has many archived generations
    # (Bolid1.*, Bolid2.*, BolidPrad.*) that should stay hidden.
    visible_meshes = [o for o in mesh_objs if not o.hide_get() and not o.hide_render]
    print(f"\nVisible meshes (will be exported): {len(visible_meshes)} of {len(mesh_objs)}")
    for o in visible_meshes:
        print(f"  + {o.name}")
    hidden_count = len(mesh_objs) - len(visible_meshes)
    print(f"Hidden meshes (skipped): {hidden_count}")

    # Select only the visible ones for export
    bpy.ops.object.select_all(action='DESELECT')
    for o in visible_meshes:
        o.select_set(True)
    if visible_meshes:
        bpy.context.view_layer.objects.active = visible_meshes[0]

    # Export GLB
    os.makedirs(os.path.dirname(OUTPUT_GLB), exist_ok=True)
    print(f"\nExporting to: {OUTPUT_GLB}")
    print("(This may take a moment for a large scene...)")

    # Use the glTF 2.0 exporter. Drop textures + cosmetic data — JS overrides
    # materials anyway, so geometry is the only thing we actually need.
    bpy.ops.export_scene.gltf(
        filepath=OUTPUT_GLB,
        export_format='GLB',
        use_selection=True,    # only the visible ones we selected above
        export_apply=True,
        export_yup=True,
        export_extras=True,
        export_animations=False,
        export_cameras=False,
        export_lights=False,
        export_materials='PLACEHOLDER',  # no texture bake — saves ~80 MB
        export_image_format='NONE',
        export_normals=True,
        export_tangents=False,
        export_attributes=False,
        export_skins=False,
        export_morph=False,
        # Draco compression — drops file size 5–10× at small CPU cost
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_draco_position_quantization=14,
        export_draco_normal_quantization=10,
        export_draco_texcoord_quantization=12,
    )

    size = os.path.getsize(OUTPUT_GLB) / (1024 * 1024)
    print(f"GLB written: {size:.1f} MB")
    print(f"Category summary: " + ", ".join(f"{c}={len(n)}" for c, n in sorted(by_cat.items())))


if __name__ == '__main__':
    try:
        inspect_and_export()
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
