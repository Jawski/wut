"""
WUT Racing — render statycznego obrazu bolidu do timeline'u na bolidy.html.

Otwiera WUT6TXTD.blend, ustawia kamerę w ujęciu 3/4, studyjne światło,
renderuje z przezroczystym tłem do assets/bolid-render.png.

Usage:
  blender --background WUT6TXTD.blend --python tools/render-bolid.py
"""
import bpy
import os
import math
import re
from mathutils import Vector

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(PROJECT_ROOT, "assets", "bolid-render.png")

RES_X, RES_Y = 1800, 1100

# Meshe tła/dekoracji — NIE część bolidu, chowamy przed renderem
DECOR_RE = re.compile(r'^(backplate|cube|plane|floor|ground|backdrop|studio)', re.I)


def visible_meshes():
    return [o for o in bpy.context.scene.objects
            if o.type == 'MESH' and not o.hide_get() and not o.hide_render]


def is_decor(obj):
    return bool(DECOR_RE.match(obj.name))


def world_bbox(objs):
    mn = Vector((1e9, 1e9, 1e9))
    mx = Vector((-1e9, -1e9, -1e9))
    for o in objs:
        for c in o.bound_box:
            w = o.matrix_world @ Vector(c)
            mn.x = min(mn.x, w.x); mn.y = min(mn.y, w.y); mn.z = min(mn.z, w.z)
            mx.x = max(mx.x, w.x); mx.y = max(mx.y, w.y); mx.z = max(mx.z, w.z)
    return mn, mx


def main():
    meshes = visible_meshes()
    if not meshes:
        print("Brak widocznych meshów!")
        return

    # Ukryj meshe dekoracyjne (tło, podłoga) — chcemy czysty render bolidu
    decor = [o for o in meshes if is_decor(o)]
    for o in decor:
        o.hide_render = True
        print(f"  Ukryto decor: {o.name}")
    print(f"Widocznych meshów: {len(meshes)}, decor ukryty: {len(decor)}")

    # Apply modifiers (mirror itd.) — żeby render pokazał komplet
    for obj in meshes:
        if not obj.modifiers:
            continue
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        for mod in list(obj.modifiers):
            try:
                bpy.ops.object.modifier_apply(modifier=mod.name)
            except Exception:
                pass

    # bbox tylko z meshów bolidu (bez decor)
    bolid_meshes = [o for o in visible_meshes() if not o.hide_render and not is_decor(o)]
    mn, mx = world_bbox(bolid_meshes)
    center = (mn + mx) * 0.5
    size = mx - mn
    longest = max(size.x, size.y, size.z)
    radius = (mx - center).length   # promień sfery otaczającej bolid
    print(f"BBox center {tuple(round(v,2) for v in center)}")
    print(f"BBox size {tuple(round(v,2) for v in size)}, longest {longest:.2f}, radius {radius:.2f}")

    # Kamera — ujęcie 3/4 z przodu, lekko z góry.
    cam_data = bpy.data.cameras.new("RenderCam")
    cam_data.lens = 50  # umiarkowanie szeroki — bez perspektywicznych zniekształceń
    cam = bpy.data.objects.new("RenderCam", cam_data)
    bpy.context.scene.collection.objects.link(cam)

    # Dystans tak, by sfera o promieniu `radius` mieściła się z marginesem.
    # hfov dla 36mm sensora: 2*atan(18/lens)
    hfov = 2.0 * math.atan(18.0 / cam_data.lens)
    # chcemy by bolid zajmował ~78% kadru → margines 1/0.78
    dist = (radius / 0.78) / math.tan(hfov / 2.0)

    az = math.radians(40)   # 40° w bok
    el = math.radians(22)   # 22° w górę
    cam.location = center + Vector((
        math.cos(el) * math.sin(az) * dist,
        -math.cos(el) * math.cos(az) * dist,
        math.sin(el) * dist,
    ))
    # celuj w środek bolidu (lekko powyżej, żeby ładnie siadł w kadrze)
    aim = center + Vector((0, 0, size.z * 0.05))
    direction = (aim - cam.location)
    cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = cam
    print(f"Kamera: dist {dist:.1f}, lens {cam_data.lens}mm")

    # Światło studyjne — 3-punktowe
    def add_light(name, kind, energy, loc, size_=5):
        ld = bpy.data.lights.new(name, type=kind)
        ld.energy = energy
        if kind == 'AREA':
            ld.size = size_
        lo = bpy.data.objects.new(name, ld)
        lo.location = center + Vector(loc)
        # celuj w bolid
        d = (center - lo.location)
        lo.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
        bpy.context.scene.collection.objects.link(lo)
        return lo

    add_light("Key",  'AREA', longest * longest * 60, ( longest*0.8,  longest*0.6, longest*1.1), size_=longest)
    add_light("Fill", 'AREA', longest * longest * 22, (-longest*1.0,  longest*0.3, longest*0.6), size_=longest*1.2)
    add_light("Rim",  'AREA', longest * longest * 45, (-longest*0.4, -longest*1.0, longest*0.8), size_=longest*0.8)

    # Render settings — Eevee, przezroczyste tło
    scene = bpy.context.scene
    try:
        scene.render.engine = 'BLENDER_EEVEE'
    except TypeError:
        scene.render.engine = 'BLENDER_EEVEE_NEXT'
    scene.render.film_transparent = True
    scene.render.resolution_x = RES_X
    scene.render.resolution_y = RES_Y
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    # delikatne podbicie ekspozycji
    scene.view_settings.exposure = 0.4
    try:
        scene.view_settings.look = 'AgX - Punchy'
    except TypeError:
        try:
            scene.view_settings.look = 'Punchy'
        except TypeError:
            scene.view_settings.look = 'None'

    # Eevee — ambient occlusion + bloom jeśli dostępne
    eevee = getattr(scene, 'eevee', None)
    if eevee:
        if hasattr(eevee, 'use_gtao'): eevee.use_gtao = True
        if hasattr(eevee, 'use_bloom'): eevee.use_bloom = True
        if hasattr(eevee, 'taa_render_samples'): eevee.taa_render_samples = 64

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    scene.render.filepath = OUT
    print(f"Renderowanie -> {OUT} ({RES_X}x{RES_Y})...")
    bpy.ops.render.render(write_still=True)
    if os.path.exists(OUT):
        kb = os.path.getsize(OUT) / 1024
        print(f"Gotowe: {kb:.0f} KB")
    else:
        print("BŁĄD: plik nie powstał")


if __name__ == '__main__':
    main()
