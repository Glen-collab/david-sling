"""Turn Glen's terrain images into game pieces (World 1). Keys the green, crops, splits multi-piece images,
and makes fills/strips tile seamlessly."""
import os, json
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = r"C:/Users/big_g/Desktop/david-sling-art"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "david-sling", "assets", "terrain")
os.makedirs(OUT, exist_ok=True)
img = lambda n: Image.open(os.path.join(SRC, f"image ({n}) terrain.jpg")).convert("RGB")

def key(im):
    a = np.asarray(im).astype(float); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    ex = g - np.maximum(r, b)
    alpha = np.clip(1 - (ex - 45) / 45, 0, 1)
    alpha[(g > 120) & (g > r * 1.5) & (g > b * 1.6) & (ex > 70)] = 0
    a[..., 1] = np.where(alpha < 1, np.minimum(g, np.maximum(r, b) + 25), g)     # spill on edges only
    al = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    out = Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert("RGBA"); out.putalpha(al)
    return out

def crop(im):
    return im.crop(im.getchannel("A").getbbox())

def seam_x(im, blend=120):
    a = np.asarray(im).astype(float); W = a.shape[1]
    t = np.linspace(0, 1, blend)[None, :, None]
    a[:, :blend] = a[:, W - blend:] * (1 - t) + a[:, :blend] * t
    return Image.fromarray(a[:, :W - blend].clip(0, 255).astype(np.uint8))

def seam_y(im, blend=120):
    a = np.asarray(im).astype(float); H = a.shape[0]
    t = np.linspace(0, 1, blend)[:, None, None]
    a[:blend] = a[H - blend:] * (1 - t) + a[:blend] * t
    return Image.fromarray(a[:H - blend].clip(0, 255).astype(np.uint8))

def pieces(im, n):
    al = np.asarray(im)[..., 3] > 60
    lab, k = ndimage.label(ndimage.binary_closing(al, iterations=3))
    sizes = ndimage.sum(al, lab, range(1, k + 1)); order = np.argsort(sizes)[::-1][:n]
    objs = sorted([ndimage.find_objects(lab)[i] for i in order], key=lambda o: o[1].start)
    return [im.crop((o[1].start, o[0].start, o[1].stop, o[0].stop)) for o in objs]

info = {}
def save(im, name):
    im.save(os.path.join(OUT, name + ".png")); info[name] = list(im.size)

save(seam_x(crop(key(img(5)))), "topsoil")                       # grass edge + earth lip
save(seam_y(seam_x(img(6).convert("RGBA"))), "sediment")          # earth fill
save(seam_y(seam_x(img(7).convert("RGBA"))), "limestone")         # rock fill
save(seam_x(crop(key(img(8)))), "limestone_top")                   # rock top edge
for nm, p in zip(("ledge_left", "ledge_mid", "ledge_right"), pieces(key(img(9)), 3)): save(p, nm)
for nm, p in zip(("wall_left", "wall_mid", "wall_right"), pieces(key(img(10)), 3)): save(p, nm)
pl = pieces(key(img(11)), 2); save(pl[0], "pit_left"); save(pl[1], "pit_right")
json.dump(info, open(os.path.join(OUT, "terrain.json"), "w"), indent=1)
print(json.dumps(info))
