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
        "w2_1": ("2-1 far.png", "2-1 mid.png", "2-1 near.png"),   # 2-1 The Forest Trail (morning; magenta, not green)
        "w2_2": ("2-2 far.png", "2-2 mid.png", "2-2 near.png"),   # 2-2 The Dry Riverbed (midday, a storm far off)
        "w2_3": ("2-3 far.png", "2-3 mid.png", "2-3 near.png"),   # 2-3 The High Cliffs (afternoon, the waterfall spring)
        "w2_4": ("2-4 far.png", "2-4 mid.png", "2-4 near.png"),   # 2-4 The Bear's Ravine (dusk)
        "w3_1": ("3-1 far.png", "3-1 mid.png", "3-1 near.png"),   # 3-1 The Day Before (Bethlehem, morning)
        "w3_2": ("3-2 far.png", "3-2 mid.png", "3-2 near.png"),   # 3-2 The Far Pasture (midday, Bethlehem far off)
        "w3_3": ("3-3 far.png", "3-3 mid.png", "3-3 near.png"),   # 3-3 We Will Not Sit Down (golden afternoon, the town gate)
        "w3_4": ("3-4 far.png", "3-4 mid.png", "3-4 near.png"),   # 3-4 The Chosen Shepherd (the storm)
        "w3_end": ("3-4 end far.png", "3-4 end mid.png", "3-4 end near.png"),   # End of World 3: the storm clears at sunset
        "w4_1": ("4-1 far.png", "4-1 mid.png", "4-1 near.png"),   # 4-1 The Road to Gibeah
        "w4_2": ("4-2 far.png", "4-2 mid.png", "4-2 near.png"),   # 4-2 The Training Yard
        "w4_3": ("4-3 far.png", "4-3 mid.png", "4-3 near.png"),   # 4-3 The Broken String
        "w4_4": ("4-4 far.png", "4-4 mid.png", "4-4 near.png"),
        "w5_1": ("5-1 far.png", "5-1 mid.png", "5-1 near.png"),
        "w5_2": ("5-2 far.png", "5-2 mid.png", "5-2 near.png"),
        "w5_3": ("5-3 far.png", "5-3 mid.png", "5-3 near.png"),
        "w5_4": ("5-4 far.png", "5-4 mid.png", "5-4 near.png"),
        "w6_1": ("6-1 far.png", "6-1 mid.png", "6-1 near.png"),
        "w6_2": ("6-2 far.png", "6-2 mid.png", "6-2 near.png")}   # 6-1 The Camp of Fear (morning, the Philistine camp across the valley)   # 5-4 Down to Elah (dawn, the two camps)   # 5-3 The Lookouts' Ridge (night, the two camps below)   # 5-2 The Mountain Trail (night, full moon)   # 5-1 The Supply Road (hot afternoon, smoke far off)   # 4-4 The King's Hall (night)   # 4-3 The Broken String (Gibeah's market, late afternoon)   # 4-2 The Training Yard (Gibeah's fortress)   # 4-1 The Road to Gibeah (morning, vineyards, Jebus far off)
MIRRORED = {"w1_2", "w1_3", "w1_4", "w2_1", "w2_2", "w2_3", "w2_4", "w3_1", "w3_2", "w3_3", "w3_4", "w3_end", "w4_1", "w4_2", "w4_3", "w4_4", "w5_1", "w5_2", "w5_3", "w5_4", "w6_1", "w6_2"}
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

def key_magenta(img, strict=False):
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
    if strict: solid &= ~((b > g - 15) & (r > g + 35))    # no pink in this picture: pink or rose pixels are bleed (sandstone is yellower, water isn't red)
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    a = np.where(solid[..., None], a, a[iy, ix])           # see-through pixels: the nearest solid colour
    al = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    out = Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert("RGBA"); out.putalpha(al)
    return out

NO_PINK = {"w2_3", "w2s"}   # sets with nothing pink in them, so any pink tinge is cleaned off (2-2's oleanders are pink: not in here)
MAGENTA_SETS = {"w4_4", "w5_1", "w5_2", "w5_3", "w5_4", "w6_1", "w6_2"}   # magenta, though the picture's corners aren't (4-4's mid layer has stone in its top corners)
def key_backdrop(img, name=""):   # green or magenta, whichever the corners are
    if name in MAGENTA_SETS: return key_magenta(img)
    c = np.asarray(img.convert("RGB"))[2:12, 2:12].reshape(-1, 3).mean(0)
    return key_magenta(img, name in NO_PINK) if c[0] > 150 and c[2] > 150 and c[1] < 120 else key_green(img)

def seamless(img, blend=140):
    """Blend the right edge into the left edge so the image repeats with no visible seam."""
    a = np.asarray(img).astype(float); W = a.shape[1]
    left, right = a[:, :blend], a[:, W - blend:]
    t = np.linspace(0, 1, blend)[None, :, None]       # 0 at the very left: all right-edge, 1: all left
    a[:, :blend] = right * (1 - t) + left * t
    return Image.fromarray(a[:, :W - blend].clip(0, 255).astype(np.uint8))

if __name__ == "__main__":   # (make_terrain_set.py imports the keying from here)
    info_path = os.path.join(OUT, "layers.json")
    info = json.load(open(info_path)) if os.path.exists(info_path) else {}
    for name, (far, mid, near) in SETS.items():
        if sys.argv[1:] and name not in sys.argv[1:]: continue
        fimg = Image.open(os.path.join(SRC, far)).convert("RGB"); fimg.save(os.path.join(OUT, f"{name}_far.jpg"), quality=92)
        for layer, f in (("mid", mid), ("near", near)):
            if not os.path.exists(os.path.join(SRC, f)): print(f"{name}: no {f} yet (borrow it: BG_BORROW in main.js)"); continue
            k = key_backdrop(Image.open(os.path.join(SRC, f)), name)
            if name not in MIRRORED: k = seamless(k)   # mirrored sets join by flipping every other copy (TUNE.BG_MIRROR), so no blend
            al = np.asarray(k)[..., 3] > 40; rows = np.where(al.any(1))[0]
            bb = k.getchannel("A").getbbox(); k = k.crop((0, bb[1], k.width, k.height))   # drop the empty green sky above
            k.save(os.path.join(OUT, f"{name}_{layer}.png"))
            info[f"{name}_{layer}"] = {"w": k.width, "h": k.height}
        info[f"{name}_far"] = {"w": fimg.width, "h": fimg.height}
    json.dump(info, open(os.path.join(OUT, "layers.json"), "w"), indent=1)
    print(json.dumps(info))
