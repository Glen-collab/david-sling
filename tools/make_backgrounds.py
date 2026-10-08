"""Turn Glen's three background images per world into game layers:
far = opaque, mid/near = green keyed + made to repeat seamlessly. Also reports where the content sits."""
import os, json
import numpy as np
from PIL import Image, ImageFilter

SRC = r"C:/Users/big_g/Desktop/david-sling-art"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "david-sling", "assets", "backgrounds")
os.makedirs(OUT, exist_ok=True)
SETS = {"w1": ("image (5).jpg", "image (6).jpg", "image (7).jpg"),
        "w2": ("image (5) world 2.jpg", "image (6) world 2.jpg", "image (7) world 2.jpg")}

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

def seamless(img, blend=140):
    """Blend the right edge into the left edge so the image repeats with no visible seam."""
    a = np.asarray(img).astype(float); W = a.shape[1]
    left, right = a[:, :blend], a[:, W - blend:]
    t = np.linspace(0, 1, blend)[None, :, None]       # 0 at the very left: all right-edge, 1: all left
    a[:, :blend] = right * (1 - t) + left * t
    return Image.fromarray(a[:, :W - blend].clip(0, 255).astype(np.uint8))

info = {}
for name, (far, mid, near) in SETS.items():
    Image.open(os.path.join(SRC, far)).convert("RGB").save(os.path.join(OUT, f"{name}_far.jpg"), quality=92)
    for layer, f in (("mid", mid), ("near", near)):
        k = seamless(key_green(Image.open(os.path.join(SRC, f))))
        al = np.asarray(k)[..., 3] > 40; rows = np.where(al.any(1))[0]
        bb = k.getchannel("A").getbbox(); k = k.crop((0, bb[1], k.width, k.height))   # drop the empty green sky above
        k.save(os.path.join(OUT, f"{name}_{layer}.png"))
        info[f"{name}_{layer}"] = {"w": k.width, "h": k.height}
    info[f"{name}_far"] = {"w": 1168, "h": 784}
json.dump(info, open(os.path.join(OUT, "layers.json"), "w"), indent=1)
print(json.dumps(info))
