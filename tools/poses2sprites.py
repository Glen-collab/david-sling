"""Cut a pose sheet (a grid of one character's poses on a transparent background, e.g. from Meta AI) into frames that
line up: same scale, feet on one line, the head over one spot. Then build sprite sheets from lists of those frames.

usage:
  python tools/poses2sprites.py <sheet.png> <name> --grid COLSxROWS --height H  name_move=1,2 name_other=3 ...

  Poses are numbered 1.. left to right, top to bottom. Each move=... makes assets/sprites/<name>_<move>.png/.json
  from those poses in that order (loops). --height is the standing pose's height on the sheet (David is 240).
  A pink fringe left from a magenta background is cleaned off the edges.
"""
import argparse, json, os
import numpy as np
from PIL import Image
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument("sheet"); ap.add_argument("name"); ap.add_argument("moves", nargs="+")
ap.add_argument("--grid", required=True); ap.add_argument("--height", type=int, default=220)
ap.add_argument("--ms", type=int, default=260); ap.add_argument("--out", default="assets/sprites")
args = ap.parse_args()
cols, rows = (int(v) for v in args.grid.lower().split("x"))

a = np.asarray(Image.open(args.sheet).convert("RGBA")).astype(float)
r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3] / 255
pink = np.clip((np.minimum(r, b) - g - 40) / 80, 0, 1) * (al > 0)
al = ndimage.grey_erosion(al * (1 - pink), size=(2, 2))
rgb = a[..., :3].copy()
rgb[..., 0] = np.where(pink > 0, r - (r - g) * pink * 0.5, r); rgb[..., 2] = np.where(pink > 0, b - (b - g) * pink * 0.8, b)
H, W = al.shape; cw, ch = W / cols, H / rows

poses = []
for k in range(cols * rows):   # each pose is its cell; bits of the neighbours poking in at the side are dropped
    x0, y0 = int(k % cols * cw), int(k // cols * ch); x1, y1 = int(x0 + cw), int(y0 + ch)
    A = al[y0:y1, x0:x1]
    lab, n = ndimage.label(A > 0.4); sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1)); big = sizes.max()
    keep_ids = []
    for i, s_ in enumerate(sizes):
        ys_, xs_ = np.where(lab == i + 1)
        edge = xs_.min() <= 2 or xs_.max() >= A.shape[1] - 3
        if s_ > 1200 and not (edge and s_ < 0.25 * big): keep_ids.append(i + 1)
    keep = np.isin(lab, keep_ids)
    A = A * ndimage.binary_dilation(keep, iterations=2)
    ys, xs = np.where(A > 0.4)
    foot, top = ys.max(), ys.min()
    head = xs[ys < top + (foot - top) // 6]   # the head: the top sixth of the figure
    poses.append(dict(img=np.dstack([rgb[y0:y1, x0:x1], A * 255]), foot=foot, top=top, cx=int(np.median(head)), xl=xs.min(), xr=xs.max()))

stand = poses[0]["foot"] - poses[0]["top"]; sc = args.height / stand   # one scale for every pose (pose 1 is standing)
for spec in args.moves:
    move, nums = spec.split("="); idx = [int(v) - 1 for v in nums.split(",")]
    ps = [poses[i] for i in idx]
    L = max(p["cx"] - p["xl"] for p in ps) + 6; R = max(p["xr"] - p["cx"] for p in ps) + 6; U = max(p["foot"] - p["top"] for p in ps) + 6
    fw, fh = round((L + R) * sc), round((U + 4) * sc)
    sheet = Image.new("RGBA", (fw * len(ps), fh))
    for k, p in enumerate(ps):
        im = Image.fromarray(p["img"].clip(0, 255).astype(np.uint8))
        crop = im.crop((p["cx"] - L, p["foot"] - U, p["cx"] + R, p["foot"] + 4)).resize((fw, fh), Image.LANCZOS)
        sheet.paste(crop, (k * fw, 0))
    out = os.path.join(args.out, f"{args.name}_{move}")
    sheet.save(out + ".png")
    json.dump({"frames": len(ps), "frame_w": fw, "frame_h": fh, "ms_per_frame": args.ms, "loop": True, "align": "feet",
               "anchor_x": round(L * sc), "anchor_y": round(U * sc), "source": os.path.basename(args.sheet), "poses": [i + 1 for i in idx]},
              open(out + ".json", "w"), indent=2)
    print(f"{args.name}_{move}: {len(ps)} frames of {fw}x{fh}")
