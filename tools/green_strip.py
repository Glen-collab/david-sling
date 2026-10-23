"""Cut a strip of poses on a green background (frames side by side, gaps between) into a game sprite sheet.

Each pose is found as its own shape (outlines may overlap), keyed, and lined up on its body: the middle of what's
left after the thin parts (wing feathers, legs) are worn away, so a bird's body holds still while its wings beat.
Scaled so the poses' median width is --width px; --mirror turns them around; --drop leaves out poses (1-based).

  python tools/green_strip.py strip.png raven_fly --width 96 --mirror --drop 9 --ms 83
"""
import argparse, json, os
import numpy as np
from PIL import Image
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("name")
ap.add_argument("--width", type=float, required=True); ap.add_argument("--mirror", action="store_true")
ap.add_argument("--drop", default=""); ap.add_argument("--ms", type=int, default=83); ap.add_argument("--erode", type=int, default=12)
a = ap.parse_args()
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

rgb = np.asarray(Image.open(a.src).convert("RGB")).astype(np.float32)
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
green = g - np.maximum(r, b)
alpha = np.clip(1 - (green - 40) / 40, 0, 1)
rgb[..., 1] = np.where(green > 0, np.maximum(r, b), g)          # the green off the edges
mask = alpha > 0.5
# each pose is its own shape (their outlines can overlap: one bird's wingtip reaches past the next one's tail)
lab, n = ndimage.label(mask)
sizes = ndimage.sum(mask, lab, range(1, n + 1))
boxes = ndimage.find_objects(lab)
ids = sorted([i + 1 for i in range(n) if sizes[i] > 0.01 * sizes.max()], key=lambda i: boxes[i - 1][1].start)
drop = {int(x) for x in a.drop.split(",") if x}
ids = [i for k_, i in enumerate(ids, 1) if k_ not in drop]
print(len(ids), "poses")

poses = []
for i in ids:
    ys, xs = boxes[i - 1]
    own = ndimage.binary_dilation(lab[ys, xs] == i, iterations=2)   # this pose only (with its soft edge)
    img = np.dstack([rgb[ys, xs], alpha[ys, xs] * 255 * own]).astype(np.uint8)
    body = ndimage.binary_erosion(lab[ys, xs] == i, iterations=a.erode)
    if not body.any(): body = lab[ys, xs] == i
    cy, cx = ndimage.center_of_mass(body)
    poses.append((Image.fromarray(img), cx, cy))
k = a.width / np.median([p[0].width for p in poses])
poses = [(im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS), cx * k, cy * k) for im, cx, cy in poses]
if a.mirror: poses = [(im.transpose(Image.FLIP_LEFT_RIGHT), im.width - cx, cy) for im, cx, cy in poses]
L = max(cx for im, cx, cy in poses) + 2; R = max(im.width - cx for im, cx, cy in poses) + 2
U = max(cy for im, cx, cy in poses) + 2; D = max(im.height - cy for im, cx, cy in poses) + 2
fw, fh = int(np.ceil(L + R)), int(np.ceil(U + D))
sheet = Image.new("RGBA", (fw * len(poses), fh))
for i, (im, cx, cy) in enumerate(poses): sheet.paste(im, (int(round(i * fw + L - cx)), int(round(U - cy))), im)
out = os.path.join(ROOT, "assets", "sprites", a.name)
sheet.save(out + ".png")
json.dump({"frames": len(poses), "frame_w": fw, "frame_h": fh, "ms_per_frame": a.ms, "loop": True, "align": "center",
           "anchor_x": int(round(L)), "anchor_y": int(round(U)),
           "source": f"{os.path.basename(a.src)} (tools/green_strip.py: keyed, lined up on the body{', mirrored' if a.mirror else ''})"},
          open(out + ".json", "w"), indent=2)
print(f"{len(poses)} frames of {fw}x{fh} -> {out}.png")
