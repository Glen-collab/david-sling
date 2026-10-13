"""Turn Glen's three background images per world into game layers:
far = opaque, mid/near = green keyed + made to repeat seamlessly. Also reports where the content sits."""
import os, sys, json
import numpy as np
from PIL import Image, ImageFilter

SRC = r"C:/Users/big_g/Desktop/david-sling-art"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "backgrounds")
os.makedirs(OUT, exist_ok=True)
SETS = {"w1": ("image (5).jpg", "image (6).jpg", "image (7).jpg"),
        "w2": ("image (5) world 2.jpg", "image (6) world 2.jpg", "image (7) world 2.jpg"),
        "w1_2": ("1-2 far.png", "1-2 mid.png", "1-2 near.png"),   # 1-2 The Wandering Flock (morning)
        "w1_3": ("1-3 far.png", "1-3 mid.png", "1-3 near.png"),   # 1-3 The Rocky Pastures
        "w1_4": ("1-4 far.png", "1-4 mid.png", "1-4 near.png"),   # 1-4 The Lion's Territory (night)
        "w2_1": ("2-1 far.png", "2-1 mid.png", "2-1 near.png")}   # 2-1 The Forest Trail (morning; magenta, not green)
MIRRORED = {"w1_2", "w1_3", "w1_4", "w2_1"}
# usage: python make_backgrounds.py [set ...]   (no names = all sets)

def key_green(img):
    a = np.asarray(img.convert("RGB")).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    ex = g - np.maximum(r, b)
    alpha = np.clip(1 - (ex - 40) / 50, 0, 1)
    alpha[(g > 150) & (g > r * 1.6) & (g > b * 1.6)] = 0
    a[..., 1] = np.minimum(g, np.maximum(r, b) + 10)      # remove green spill on the edges
    al = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    out = Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert("RGBA"); out.putalpha(al)
    return out

def key_magenta(img):
    """World 2 layers sit on magenta (#FF00FF), because the woods are full of green leaves.
    Edge pixels take the colour of the nearest solid pixel, so no pink fringe is left on pale, hazy trees."""
    from scipy import ndimage
    a = np.asarray(img.convert("RGB")).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    ex = np.minimum(r, b) - g                              # how magenta a pixel is
    alpha = np.clip(1 - (ex - 40) / 60, 0, 1)
    alpha[(r > 170) & (b > 170) & (g < 110)] = 0
    near_edge = ndimage.binary_dilation(alpha < 0.5, iterations=8)           # within a few px of the see-through part...
    solid = (alpha >= 0.98) & ~(near_edge & (ex > 10))                       # ...pinkish pixels are magenta bleed, not paint
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    a = np.where(solid[..., None], a, a[iy, ix])           # see-through pixels: the nearest solid colour
    al = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    out = Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert("RGBA"); out.putalpha(al)
    return out

def key_backdrop(img):   # green or magenta, whichever the corners are
    c = np.asarray(img.convert("RGB"))[2:12, 2:12].reshape(-1, 3).mean(0)
    return key_magenta(img) if c[0] > 150 and c[2] > 150 and c[1] < 120 else key_green(img)

def seamless(img, blend=140):
    """Blend the right edge into the left edge so the image repeats with no visible seam."""
    a = np.asarray(img).astype(float); W = a.shape[1]
    left, right = a[:, :blend], a[:, W - blend:]
    t = np.linspace(0, 1, blend)[None, :, None]       # 0 at the very left: all right-edge, 1: all left
    a[:, :blend] = right * (1 - t) + left * t
    return Image.fromarray(a[:, :W - blend].clip(0, 255).astype(np.uint8))

info_path = os.path.join(OUT, "layers.json")
info = json.load(open(info_path)) if os.path.exists(info_path) else {}
for name, (far, mid, near) in SETS.items():
    if sys.argv[1:] and name not in sys.argv[1:]: continue
    fimg = Image.open(os.path.join(SRC, far)).convert("RGB"); fimg.save(os.path.join(OUT, f"{name}_far.jpg"), quality=92)
    for layer, f in (("mid", mid), ("near", near)):
        k = key_backdrop(Image.open(os.path.join(SRC, f)))
        if name not in MIRRORED: k = seamless(k)   # mirrored sets join by flipping every other copy (TUNE.BG_MIRROR), so no blend
        al = np.asarray(k)[..., 3] > 40; rows = np.where(al.any(1))[0]
        bb = k.getchannel("A").getbbox(); k = k.crop((0, bb[1], k.width, k.height))   # drop the empty green sky above
        k.save(os.path.join(OUT, f"{name}_{layer}.png"))
        info[f"{name}_{layer}"] = {"w": k.width, "h": k.height}
    info[f"{name}_far"] = {"w": fimg.width, "h": fimg.height}
json.dump(info, open(os.path.join(OUT, "layers.json"), "w"), indent=1)
print(json.dumps(info))
