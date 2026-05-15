"""
WUT Racing — przygotowanie zdjęć hero (karuzela).

Bierze wszystkie pliki z listy SOURCES, skaluje do web (2400 px szer.),
delikatnie podbija ostrość/kontrast/kolor i zapisuje jako
assets/hero-1.jpg, hero-2.jpg, ...

Usage:  py -3 tools/enhance-hero.py
"""
import os
import sys
from PIL import Image, ImageEnhance, ImageFilter
import numpy as np

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(PROJECT_ROOT, "assets")

# Kolejność = kolejność w karuzeli
SOURCES = [
    r"C:\Users\Janek\Downloads\54690330206_06cfc850a5_o.jpg",
    r"C:\Users\Janek\Downloads\54690018205_a3a248785f_o.jpg",
    r"C:\Users\Janek\Downloads\54689964963_5305d6a147_o.jpg",
]

TARGET_WIDTH = 2400
JPEG_QUALITY = 86


def s_curve(img, strength=0.08):
    arr = np.asarray(img).astype(np.float32) / 255.0
    curved = arr + strength * np.sin((arr - 0.5) * np.pi)
    curved = np.clip(curved, 0.0, 1.0)
    return Image.fromarray((curved * 255.0).astype(np.uint8))


def process(src, dst):
    img = Image.open(src).convert("RGB")
    ow, oh = img.size

    # Skaluj do TARGET_WIDTH (zwykle w dół — to oryginały 5-7K px)
    if ow != TARGET_WIDTH:
        scale = TARGET_WIDTH / ow
        nw, nh = TARGET_WIDTH, int(oh * scale)
        # przy downscalu LANCZOS daje ostry, czysty wynik
        img = img.resize((nw, nh), Image.LANCZOS)

    # Delikatny enhance — to realne zdjęcia, nie przesadzamy
    img = img.filter(ImageFilter.UnsharpMask(radius=1.6, percent=80, threshold=3))
    img = ImageEnhance.Contrast(img).enhance(1.08)
    img = ImageEnhance.Color(img).enhance(1.10)
    img = ImageEnhance.Brightness(img).enhance(1.02)
    img = s_curve(img, strength=0.06)

    img.save(dst, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    kb = os.path.getsize(dst) / 1024
    print(f"  {os.path.basename(src)} ({ow}x{oh}) -> {os.path.basename(dst)} "
          f"({img.size[0]}x{img.size[1]}, {kb:.0f} KB)")


def main():
    os.makedirs(ASSETS, exist_ok=True)
    done = 0
    for i, src in enumerate(SOURCES, start=1):
        if not os.path.exists(src):
            print(f"  SKIP (brak): {src}", file=sys.stderr)
            continue
        dst = os.path.join(ASSETS, f"hero-{i}.jpg")
        process(src, dst)
        done += 1
    print(f"Gotowe: {done} zdjęć w assets/")


if __name__ == "__main__":
    main()
