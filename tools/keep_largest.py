"""Keep only the biggest shape in each frame of a sprite sheet (the animal), dropping anything beside it that came
with the clip (the scorpion next to the lamb), then trim the frames to what's left, feet on the bottom line.

  python tools/keep_largest.py in_sheet.png in.json assets/sprites/<name>    -> <name>.png/.json
"""
import json, sys
import numpy as np
from PIL import Image
from scipy import ndimage

src, meta_in, out = sys.argv[1], sys.argv[2], sys.argv[3]
meta = json.load(open(meta_in))
im = np.asarray(Image.open(src).convert("RGBA")).copy()
fw, fh, n = meta["frame_w"], meta["frame_h"], meta["frames"]
frames = []
for i in range(n):
    f = im[:, i * fw:(i + 1) * fw].copy()
    lab, k = ndimage.label(f[..., 3] > 30)
    if k > 1:
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, k + 1))
        keep = 1 + int(np.argmax(sizes))
        grown = ndimage.binary_dilation(lab == keep, iterations=3)   # keep its soft edge
        f[~grown] = 0
    frames.append(f)
ys, xs = np.nonzero(np.any([f[..., 3] > 30 for f in frames], axis=0))
x0, x1, y0, y1 = int(xs.min()) - 6, int(xs.max()) + 7, int(ys.min()) - 6, int(ys.max()) + 1
x0, y0 = max(0, x0), max(0, y0)
w, h = x1 - x0, y1 - y0
sheet = Image.new("RGBA", (w * n, h))
for i, f in enumerate(frames): sheet.paste(Image.fromarray(f[y0:y1, x0:x1]), (i * w, 0))
sheet.save(out + ".png")
meta.pop("video_frames", None)
meta.update(frame_w=w, frame_h=h, anchor_x=(w // 2), anchor_y=h - 2)
json.dump(meta, open(out + ".json", "w"), indent=2)
print(f"{n} frames of {w}x{h} -> {out}.png")
