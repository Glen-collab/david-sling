"""Re-cut a hand-edited sheet: one figure per frame (by connected blobs), each kept at its own offset from an even grid,
in wider frames so nothing crosses a frame line. Anchor taken from the base sheet the edit was made from."""
import json, sys
import numpy as np
from PIL import Image
from scipy import ndimage

src, base, out, grid = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])   # grid: spacing of the figures in the edit
s = np.asarray(Image.open(src).convert("RGBA")); H = s.shape[0]
a = s[..., 3] > 20
lab, n = ndimage.label(ndimage.binary_dilation(a, iterations=2))
objs = ndimage.find_objects(lab); sz = ndimage.sum(a, lab, range(1, n + 1))
figs = sorted([i + 1 for i in range(n) if sz[i] > 3000], key=lambda k: objs[k - 1][1].start)
# small bits (whiskers, tail tips) join the nearest figure
small = [i + 1 for i in range(n) if sz[i] <= 3000 and sz[i] > 5]
owner = {}
for k in small:
    xs = objs[k - 1][1]; cx = (xs.start + xs.stop) / 2
    owner[k] = min(figs, key=lambda f: abs((objs[f - 1][1].start + objs[f - 1][1].stop) / 2 - cx))
bd = json.load(open(base))
pad_l = 10; offs = []
for i, f in enumerate(figs):
    offs.append(objs[f - 1][1].start - i * grid)
lo = min(offs); hi = max(objs[f - 1][1].stop - i * grid for i, f in enumerate(figs))
W2 = hi - lo + 2 * pad_l
sheet = np.zeros((H, W2 * len(figs), 4), np.uint8)
for i, f in enumerate(figs):
    m = (lab == f) | np.isin(lab, [k for k, o in owner.items() if o == f])
    m &= a
    x0 = i * grid + lo - pad_l
    piece = np.where(m[..., None], s, 0)
    for dx in range(W2):
        sx = x0 + dx
        if 0 <= sx < s.shape[1]: sheet[:, i * W2 + dx] = piece[:, sx]
Image.fromarray(sheet).save(out + ".png")
d = dict(bd); d["frames"] = len(figs); d["frame_w"] = W2; d["frame_h"] = H
d["anchor_x"] = bd["anchor_x"] - lo + pad_l; d["source"] = "Glen's Photoshop edit of " + base.split("/")[-1][:-5]
json.dump(d, open(out + ".json", "w"), indent=2)
print(out, len(figs), "frames of", W2, "x", H, "anchor_x", d["anchor_x"])
