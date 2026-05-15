"""
WUT Racing — re-kompresja part GLBs.

Każdy plik część (engine.glb / chassis.glb / suspension.glb / aero.glb)
otwieramy w czystym Blenderze i ponownie eksportujemy z:
  - kompresją Draco mesh
  - obniżoną jakością tekstur (JPEG)

Usage:
  blender --background --python tools/compress-parts.py
"""
import bpy
import os
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARTS_DIR = os.path.join(PROJECT_ROOT, "models", "parts")
PARTS = ["engine", "chassis", "suspension", "aero"]


def clear_scene():
    """Wyczyść scenę Blendera całkowicie."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    # Usuń wszystkie dane (orphan cleanup)
    for collection in (bpy.data.meshes, bpy.data.materials, bpy.data.images,
                       bpy.data.textures, bpy.data.objects, bpy.data.armatures):
        for item in list(collection):
            collection.remove(item)


def process(name):
    src = os.path.join(PARTS_DIR, f"{name}.glb")
    if not os.path.exists(src):
        print(f"SKIP: missing {src}")
        return
    src_size = os.path.getsize(src) / (1024 * 1024)

    clear_scene()
    print(f"\n=== {name}.glb ({src_size:.1f} MB) ===")

    # Import
    bpy.ops.import_scene.gltf(filepath=src)

    # Count meshes
    meshes = [o for o in bpy.data.objects if o.type == 'MESH']
    print(f"Imported {len(meshes)} mesh objects, {len(bpy.data.images)} images")

    # Resize big textures — keep max 1024px on longest side.
    # Wymuszamy PNG na WSZYSTKICH obrazach — JPEG psuje normal mapy
    # (artefakty "wstążek" na powierzchniach).
    MAX_SIZE = 1024
    for img in bpy.data.images:
        if img.size[0] == 0 or img.size[1] == 0:
            continue
        w, h = img.size[0], img.size[1]
        if w > MAX_SIZE or h > MAX_SIZE:
            ratio = MAX_SIZE / max(w, h)
            new_w = max(1, int(w * ratio))
            new_h = max(1, int(h * ratio))
            print(f"  Resize '{img.name}': {w}x{h} -> {new_w}x{new_h}")
            img.scale(new_w, new_h)
        img.file_format = 'PNG'   # wymuś PNG → AUTO export go zachowa

    # Select wszystko
    bpy.ops.object.select_all(action='SELECT')

    # Export with Draco + JPEG
    out = src  # nadpisz
    bpy.ops.export_scene.gltf(
        filepath=out,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_yup=True,
        export_extras=False,
        export_animations=False,
        export_cameras=False,
        export_lights=False,
        export_materials='EXPORT',
        # AUTO — zachowuje oryginalny format obrazu (PNG zostaje PNG, JPEG zostaje JPEG).
        # KLUCZOWE dla map normalnych — JPEG psuje normal data i powoduje
        # widoczne artefakty (paski/wstążki na powierzchniach).
        export_image_format='AUTO',
        # NIE ustawiamy jakości jpeg — całość już została zresize'owana
        # do 1024 px, dalsza re-kompresja by zniekształciła RGB w normal mapach.
        export_normals=True,
        export_tangents=False,
        export_skins=False,
        export_morph=False,
        # Draco
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_draco_position_quantization=14,
        export_draco_normal_quantization=10,
        export_draco_texcoord_quantization=12,
    )
    new_size = os.path.getsize(out) / (1024 * 1024)
    saved = src_size - new_size
    pct = (saved / src_size) * 100 if src_size > 0 else 0
    print(f"  {src_size:.1f} MB → {new_size:.1f} MB  (-{saved:.1f} MB, -{pct:.0f}%)")


def main():
    total_before = 0
    total_after = 0
    for name in PARTS:
        src = os.path.join(PARTS_DIR, f"{name}.glb")
        if os.path.exists(src):
            total_before += os.path.getsize(src)
        try:
            process(name)
        except Exception as e:
            print(f"ERROR processing {name}: {e}", file=sys.stderr)
            import traceback
            traceback.print_exc()
        if os.path.exists(src):
            total_after += os.path.getsize(src)

    print(f"\n=== TOTAL ===")
    print(f"  Before: {total_before / (1024*1024):.1f} MB")
    print(f"  After:  {total_after / (1024*1024):.1f} MB")
    if total_before > 0:
        print(f"  Saved:  {(total_before-total_after)/(1024*1024):.1f} MB ({((total_before-total_after)/total_before)*100:.0f}%)")


if __name__ == '__main__':
    main()
