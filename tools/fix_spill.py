"""Fix sprite sheets where parts of one frame spill across the frame line into its neighbour.
Widens every frame by PAD on both sides and moves each stray piece back to the frame it belongs to.
usage: python tools/fix_spill.py <sheet.png> [--pad 50]   (updates the .json next to it: frame_w, anchor_x)"""
import json, sys, argparse
import numpy as np
from PIL import Image
from scipy import ndimage

ap = argparse.ArgumentParser(); ap.add_argument("png"); ap.add_argument("--pad", type=int, default=50)
args = ap.parse_args()
jp = args.png[:-4] + ".json"; d = json.load(open(jp))
s = np.asarray(Image.open(args.png).convert("RGBA")); w, n, P = d["frame_w"], d["frames"], args.pad
H = s.shape[0]; W2 = w + 2 * P
out = np.zeros((H, W2 * n, 4), np.uint8)
moved = []
def paste(dst_frame, piece, x_in_old_frame_coords):
    """piece: H x pw RGBA, placed so its left edge sits at x (in the destination frame's OLD coordinates)."""
    x = dst_frame * W2 + P + x_in_old_frame_coords
    reg = out[:, x:x + piece.shape[1]]
    out[:, x:x + piece.shape[1]] = np.where(piece[..., 3:4] > reg[..., 3:4], piece, reg)
for i in range(n):
    f = s[:, i * w:(i + 1) * w].copy(); a = f[..., 3] > 40
    lab, k = ndimage.label(a)
    if k:
        sizes = ndimage.sum(a, lab, range(1, k + 1)); main = np.argmax(sizes) + 1
        for cid in range(1, k + 1):
            if cid == main: continue
            m = lab == cid; ys, xs = np.where(m)
            piece = np.zeros_like(f); piece[m] = f[m]
            if xs.max() >= w - 2 and xs.min() > w - P and i + 1 < n:      # overflow of the NEXT frame, reaching left
                paste(i + 1, piece[:, xs.min():], xs.min() - w); f[m] = 0; moved.append((i + 1, i + 2, int(m.sum())))
            elif xs.min() <= 1 and xs.max() < P and i > 0:                   # overflow of the PREVIOUS frame, reaching right
                paste(i - 1, piece[:, :xs.max() + 1], w); f[m] = 0; moved.append((i + 1, i, int(m.sum())))
    paste(i, f, 0)
Image.fromarray(out).save(args.png)
d["frame_w"] = W2; d["anchor_x"] = d["anchor_x"] + P; json.dump(d, open(jp, "w"), indent=2)
bad = [i + 1 for i in range(n) if (out[:, i * W2:i * W2 + 2, 3] > 40).any() or (out[:, (i + 1) * W2 - 2:(i + 1) * W2, 3] > 40).any()]
print("moved (from frame, to frame, px):", moved, "| new frame", W2, "| still touching an edge:", bad)
