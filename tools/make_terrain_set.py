"""Turn one of Glen's 8-image ground sets (World 2 on: magenta backgrounds) into game terrain pieces.
usage: python tools/make_terrain_set.py w2f      (reads david-sling-art/2-forest 1..8.png -> assets/terrain/w2f/)
Images, in order: 1 ground edge strip, 2 soil fill, 3 rock fill, 4 rock top edge strip, 5 ledge L/M/R,
6 log (or wall) L/M/R, 7 pit left/right walls, 8 rock base L/M/R. A missing image is skipped (the game falls back
to World 1's piece)."""
import os, sys, json
import numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_backgrounds import key_backdrop   # green or magenta, with the fringe clean-up

SETS = {"w2f": "2-forest", "w2s": "2-sand", "w4p": "4-palace", "w5m": "5-mountain"}
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = r"C:/Users/big_g/Desktop/david-sling-art"

def crop(im): return im.crop(im.getchannel("A").getbbox())
def seam_x(im, blend=120):
    a = np.asarray(im).astype(float); W = a.shape[1]; t = np.linspace(0, 1, blend)[None, :, None]
    a[:, :blend] = a[:, W - blend:] * (1 - t) + a[:, :blend] * t
    return Image.fromarray(a[:, :W - blend].clip(0, 255).astype(np.uint8))
def seam_y(im, blend=120):
    a = np.asarray(im).astype(float); H = a.shape[0]; t = np.linspace(0, 1, blend)[:, None, None]
    a[:blend] = a[H - blend:] * (1 - t) + a[:blend] * t
    return Image.fromarray(a[:H - blend].clip(0, 255).astype(np.uint8))
def fill(im):   # a square fill -> World 1's fill shape (1048 x 664) without stretching: crop the middle band
    im = im.convert("RGBA"); w, h = im.size; bh = round(w * 664 / 1048) + 120
    im = im.crop((0, (h - bh) // 2, w, (h - bh) // 2 + bh)).resize((1048 + 120, 664 + 120), Image.LANCZOS)
    return seam_y(seam_x(im))
def strip(im, h_out):   # a ground/rock edge strip, World 1's width
    k = seam_x(crop(im)); return k.resize((1048, round(k.height * 1048 / k.width)), Image.LANCZOS)
def pieces(im, n):
    al = np.asarray(im)[..., 3] > 60
    lab, k = ndimage.label(ndimage.binary_closing(al, iterations=3))
    sizes = ndimage.sum(al, lab, range(1, k + 1)); order = np.argsort(sizes)[::-1][:n]
    objs = sorted([ndimage.find_objects(lab)[i] for i in order], key=lambda o: o[1].start)
    y0, y1 = min(o[0].start for o in objs), max(o[0].stop for o in objs)   # one shared top and bottom, so all three draw at one scale
    return [im.crop((o[1].start, y0, o[1].stop, y1)) for o in objs]

name = sys.argv[1]; prefix = SETS[name]; OUT = os.path.join(ROOT, "assets", "terrain", name); os.makedirs(OUT, exist_ok=True)
src = lambda n: os.path.join(SRC, f"{prefix} {n}.png")
info = {}
def save(im, nm):
    im.save(os.path.join(OUT, nm + ".png")); info[nm] = list(im.size)
have = lambda n: os.path.exists(src(n))
op = lambda n: Image.open(src(n))
if have(1): save(strip(key_backdrop(op(1), name), 218), "topsoil")
if have(2): save(fill(op(2)), "sediment")
if have(3): save(fill(op(3)), "limestone")
if have(4): save(strip(key_backdrop(op(4), name), 364), "limestone_top")
# some of Glen's images need a hand: (fraction of the height to keep from the top) for ledges drawn over a ground strip
LEDGE_TOP = {"w2s": 0.66}
if have(5):
    im5 = op(5)
    if name in LEDGE_TOP: im5 = im5.crop((0, 0, im5.width, round(im5.height * LEDGE_TOP[name])))
    for nm, p in zip(("ledge_left", "ledge_mid", "ledge_right"), pieces(key_backdrop(im5, name), 3)): save(p, nm)
if have(6):
    for nm, p in zip(("wall_left", "wall_mid", "wall_right"), pieces(key_backdrop(op(6), name), 3)): save(p, nm)
if have(7):
    k7 = key_backdrop(op(7), name); pl = pieces(k7, 2)
    if len(pl) < 2 or pl[1].width < k7.width * 0.15:   # drawn as one joined crevice: split it down the middle (each side keeps its wall)
        w = k7.width; pl = [crop(k7.crop((0, 0, round(w * 0.47), k7.height))), crop(k7.crop((round(w * 0.53), 0, w, k7.height)))]
    save(pl[0], "pit_left"); save(pl[1], "pit_right")
if have(8):
    for nm, p in zip(("base_left", "base_mid", "base_right"), pieces(key_backdrop(op(8), name), 3)): save(p, nm)
json.dump(info, open(os.path.join(OUT, "terrain.json"), "w"), indent=1)
print(json.dumps(info))
