"""Cut a green-screen clip of a man getting up (hiding -> standing) into one sprite row, correcting a camera zoom.

usage:
  python tools/clip2rise.py <clip.mp4> <out_prefix> --t0 S --t1 S --stand S [--frames 12] [--height 270]
                            [--zoom "Z@A-B"] [--thin W] [--mirror]

  --t0/--t1  the part of the clip to use, in seconds; frame 0 is the hiding pose, the last one standing.
  --stand    a time (s) when he is standing upright: his height there becomes --height pixels.
  --zoom     "1.3@1.0-3.0": the camera is 1.3x closer up to 1.0 s, easing to 1x by 3.0 s (each frame is shrunk to match).
  --thin     ignore things thinner than W video pixels when measuring the standing height (a spear sticking up).
  --pad      add P pixels of empty space on the left, right and top of every frame (room to paint in Photoshop).
Writes <out_prefix>_sheet.png and <out_prefix>.json (same fields as vid2sprite.py), feet on the bottom line.
"""
import argparse, json, os, subprocess, tempfile, glob
import numpy as np
from scipy import ndimage
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("clip"); ap.add_argument("out")
ap.add_argument("--t0", type=float, default=0); ap.add_argument("--t1", type=float, required=True)
ap.add_argument("--stand", type=float, required=True)
ap.add_argument("--frames", type=int, default=12); ap.add_argument("--height", type=int, default=270)
ap.add_argument("--zoom", default=""); ap.add_argument("--thin", type=int, default=0)
ap.add_argument("--mirror", action="store_true"); ap.add_argument("--pad", type=int, default=0)
args = ap.parse_args()

def grab(t):
    d = tempfile.mkdtemp(); p = os.path.join(d, "f.png")
    subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", args.clip, "-frames:v", "1", p], check=True)
    return np.asarray(Image.open(p).convert("RGB")).astype(float)

def key(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    ex = g - np.maximum(r, b)
    al = np.clip(1 - (ex - 25) / 45, 0, 1)
    a = a.copy(); a[..., 1] = np.minimum(g, np.maximum(r, b) + 8)   # green spill off the edges
    lab, n = ndimage.label(al > 0.5)
    if n:   # keep the man (the biggest piece) and anything close to it
        sz = ndimage.sum(al > 0.5, lab, range(1, n + 1)); big = np.argmax(sz) + 1
        near = ndimage.binary_dilation(lab == big, iterations=25)
        keep = np.isin(lab, [i + 1 for i in range(n) if (near & (lab == i + 1)).any() and sz[i] > 40])
        al = np.where(ndimage.binary_dilation(keep, iterations=2), al, 0)
    al = ndimage.grey_erosion(al, size=(2, 2))
    return np.dstack([a, al * 255]).clip(0, 255).astype(np.uint8)

def zoom_at(t):
    if not args.zoom: return 1.0
    z, rng = args.zoom.split("@"); z = float(z); a, b = (float(v) for v in rng.split("-"))
    if t <= a: return z
    if t >= b: return 1.0
    u = (t - a) / (b - a); u = u * u * (3 - 2 * u)
    return z + (1 - z) * u

def body_h(rgba):
    m = rgba[..., 3] > 128
    if args.thin: m = ndimage.binary_opening(m, structure=np.ones((args.thin, args.thin)))
    ys = np.where(m.any(1))[0]; return ys.max() - ys.min()

sc = args.height / (body_h(key(grab(args.stand))) / zoom_at(args.stand))
cuts = []
for k in range(args.frames):
    t = args.t0 + (args.t1 - args.t0) * k / max(1, args.frames - 1)
    rgba = key(grab(t)); A = rgba[..., 3] > 60
    ys, xs = np.where(A)
    feet_y = ys.max()
    low = A[max(0, feet_y - (feet_y - ys.min()) // 6):feet_y + 1]   # the bottom sixth: feet and legs set the x anchor
    cx = np.where(low.any(0))[0].mean()
    s = sc / zoom_at(t)
    im = Image.fromarray(rgba[ys.min():feet_y + 1, xs.min():xs.max() + 1], "RGBA")
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    if args.mirror: im = im.transpose(Image.FLIP_LEFT_RIGHT); ax = im.width - (cx - xs.min()) * s
    else: ax = (cx - xs.min()) * s
    cuts.append((im, ax, t))

L = max(ax for im, ax, t in cuts); R = max(im.width - ax for im, ax, t in cuts)
P = args.pad; fw, fh = round(L + R) + 4 + 2 * P, max(im.height for im, ax, t in cuts) + 2 + P
sheet = Image.new("RGBA", (fw * len(cuts), fh))
for k, (im, ax, t) in enumerate(cuts): sheet.alpha_composite(im, (k * fw + round(L - ax) + 2 + P, fh - 2 - im.height))
sheet.save(args.out + "_sheet.png")
json.dump({"frames": len(cuts), "frame_w": fw, "frame_h": fh, "ms_per_frame": 200, "loop": False, "align": "feet",
           "anchor_x": round(L) + 2 + P, "anchor_y": fh - 2, "source": os.path.basename(args.clip),
           "times": [round(t, 2) for _, _, t in cuts]}, open(args.out + ".json", "w"), indent=2)
print(f"{len(cuts)} frames of {fw}x{fh} -> {args.out}_sheet.png")
