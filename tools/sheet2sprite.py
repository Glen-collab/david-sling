"""Turn a picture sheet of poses (a row of N frames on magenta, from GPT) into a sprite sheet like vid2sprite's.

usage:
  python tools/sheet2sprite.py <sheet.png> <out_prefix> --frames N [--height H] [--ms 120] [--once] [--pingpong] [--mirror] [--blobs]

Splits the row into N pieces at the gaps between the figures, keys the magenta out (and the pink fringe), lines the
frames up on the feet and the head, and scales so the tallest frame is --height. Writes <out_prefix>.png + .json.
"""
import argparse, json
import numpy as np
from PIL import Image
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument("sheet"); ap.add_argument("out")
ap.add_argument("--frames", type=int, required=True); ap.add_argument("--height", type=int, default=200)
ap.add_argument("--ms", type=int, default=120); ap.add_argument("--once", action="store_true")
ap.add_argument("--pingpong", action="store_true"); ap.add_argument("--mirror", action="store_true")
ap.add_argument("--blobs", action="store_true", help="cut each figure out by its own outline (for figures whose tails overlap)")
args = ap.parse_args()

a = np.asarray(Image.open(args.sheet).convert("RGB")).astype(float)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mag = (r > 150) & (b > 150) & (g < r * 0.6) & (g < b * 0.6)
pink = np.clip((np.minimum(r, b) - g - 40) / 80, 0, 1)
alpha = np.where(mag, 0, 1 - pink * 0.9)
alpha = ndimage.grey_erosion(alpha, size=(2, 2))                       # trim the last pink pixel off the edges
out = a.copy(); m = pink > 0
out[..., 0] = np.where(m, r - (r - g) * pink * 0.5, r); out[..., 2] = np.where(m, b - (b - g) * pink * 0.8, b)
solid = alpha > 0.5

# split at the N-1 emptiest columns, spaced out
prof = ndimage.uniform_filter1d(solid.sum(0).astype(float), 9)
xs = np.where(solid.any(0))[0]; X0, X1 = xs.min(), xs.max() + 1
step = (X1 - X0) / args.frames
cuts = [int(X0 + step * k - step * 0.3 + np.argmin(prof[int(X0 + step * k - step * 0.3):int(X0 + step * k + step * 0.3)])) for k in range(1, args.frames)]
bounds = [X0] + cuts + [X1]

frames = []
if args.blobs:   # the N biggest figures, left to right, each with its own outline
    blab, bn = ndimage.label(solid); bsz = ndimage.sum(solid, blab, range(1, bn + 1))
    big = sorted((1 + int(i) for i in np.argsort(-bsz)[:args.frames]), key=lambda i: ndimage.find_objects(blab)[i - 1][1].start)
for k in range(args.frames):
    if args.blobs:
        sl = ndimage.find_objects(blab)[big[k] - 1][1]; x0, x1 = max(0, sl.start - 4), sl.stop + 4
        al = alpha[:, x0:x1] * ndimage.binary_dilation(blab[:, x0:x1] == big[k], iterations=2)
    else:
        x0, x1 = bounds[k], bounds[k + 1]
        al = alpha[:, x0:x1] * (ndimage.label(solid[:, x0:x1])[0] > 0)
    lab, n = ndimage.label(al > 0.5)
    if n > 1:   # keep the biggest figure (drop stray bits of the neighbours)
        sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); keep = 1 + int(np.argmax(sizes))
        al = al * ndimage.binary_dilation(lab == keep, iterations=2)
    ys, xs2 = np.where(al > 0.5)
    foot, top = ys.max(), ys.min()
    cx = int(np.median(xs2[ys < top + max(10, (foot - top) // 4)]))   # head centre
    im = Image.fromarray(np.dstack([out[:, x0:x1].clip(0, 255).astype(np.uint8), (al * 255).astype(np.uint8)]))
    frames.append((im, foot, top, cx, xs2.min(), xs2.max()))

tall = max(f[1] - f[2] for f in frames); sc = args.height / tall
L = max(f[3] - f[4] for f in frames) + 8; R = max(f[5] - f[3] for f in frames) + 8; U = max(f[1] - f[2] for f in frames) + 8
fw, fh = round((L + R) * sc), round((U + 4) * sc)
sheet = Image.new("RGBA", (fw * args.frames, fh))
for k, (im, foot, top, cx, xl, xr) in enumerate(frames):
    crop = im.crop((cx - L, foot - U, cx + R, foot + 4)).resize((fw, fh), Image.LANCZOS)
    if args.mirror: crop = crop.transpose(Image.FLIP_LEFT_RIGHT)
    sheet.paste(crop, (k * fw, 0))
sheet.save(args.out + ".png")
ax = round(L * sc) if not args.mirror else fw - round(L * sc)
json.dump({"frames": args.frames, "frame_w": fw, "frame_h": fh, "ms_per_frame": args.ms, "loop": not args.once,
           "align": "feet", "anchor_x": ax, "anchor_y": round(U * sc), "source": args.sheet.replace("\\", "/").split("/")[-1],
           **({"pingpong": True} if args.pingpong else {})}, open(args.out + ".json", "w"), indent=2)
print(f"{args.frames} frames of {fw}x{fh} -> {args.out}.png")
