"""Turn a green-screen AI video clip into a smooth sprite sheet (Pixar look, no pixel step).

usage:
  python tools/vid2sprite.py <clip.mp4> <out_prefix> [--loop | --once] [--frames N] [--height H]

  --loop    find one clean repeating cycle (walk, run, idle). Default.
  --once    keep the whole move start to finish (jump, throw, roll, flip).
  --frames  how many frames to keep (default 12).
  --height  character height in the sheet, in pixels (default 240; the game scales it down smoothly).

Writes <out_prefix>_sheet.png (one row, transparent), <out_prefix>_preview.gif and <out_prefix>.json.
Needs ffmpeg on the PATH, numpy and Pillow.
"""
import argparse, glob, json, os, subprocess, tempfile
import numpy as np
from PIL import Image, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument("clip"); ap.add_argument("out")
ap.add_argument("--once", action="store_true"); ap.add_argument("--loop", action="store_true")
ap.add_argument("--frames", type=int, default=12); ap.add_argument("--height", type=int, default=240)
args = ap.parse_args()

tmp = tempfile.mkdtemp()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", args.clip, "-map", "0:v:0", os.path.join(tmp, "f%04d.png")], check=True)
fps_txt = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate",
                          "-of", "csv=p=0", args.clip], capture_output=True, text=True).stdout.strip().split("\n")[0]
num, den = (fps_txt.split("/") + ["1"])[:2]; fps = float(num) / float(den)
files = sorted(glob.glob(os.path.join(tmp, "*.png")))

def green_mask(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return ((g > r + 30) & (g > b + 30)) | ((g > 50) & (g > r * 1.25) & (g > b * 1.25)) | \
           ((g > 90) & (g >= r * 0.85) & (g > b * 1.6))

def key(path):
    a = np.asarray(Image.open(path).convert("RGB")).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    ex = g - np.maximum(r, b)
    alpha = np.clip(1 - (ex - 15) / 45, 0, 1)
    alpha[green_mask(a)] = 0
    a[..., 1] = np.minimum(g, np.maximum(r, b) + 6)          # remove green spill on edges
    al = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    alpha = np.asarray(al).copy()
    alpha[:4, :] = 0; alpha[-4:, :] = 0; alpha[:, :4] = 0; alpha[:, -4:] = 0
    # keep only the largest connected figure (drops specks)
    m = alpha > 128
    ys, xs = np.where(m)
    if len(ys):
        im = Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert("RGBA"); im.putalpha(Image.fromarray(alpha))
        return im
    return None

# skip frames that aren't on the green screen (e.g. a reference screenshot at the start)
def on_green(path):
    return green_mask(np.asarray(Image.open(path).convert("RGB")).astype(int)).mean() > 0.4
files = [f for f in files if on_green(f)]

def anchor(im):
    m = np.asarray(im)[..., 3] > 128; ys, xs = np.where(m)
    foot = ys.max(); top = ys.min()
    cx = int(np.median(xs[ys < top + max(10, (foot - top) // 4)]))   # head/shoulders centre
    return foot, cx, xs.min(), top, xs.max()

# loop finding on small aligned silhouettes
def sil(im, a):
    foot, cx = a[0], a[1]
    m = (np.asarray(im)[..., 3] > 128).astype(np.uint8) * 255
    can = Image.new("L", (600, 800)); can.paste(Image.fromarray(m), (300 - cx, 780 - foot))
    return np.asarray(can.resize((90, 120), Image.BOX)) > 100

keyed = [key(f) for f in files]
keyed = [k for k in keyed if k is not None]
anchors = [anchor(k) for k in keyed]
n = len(keyed)

if args.once:
    s, length = 0, n
else:
    sils = [sil(k, a) for k, a in zip(keyed, anchors)]
    best = None
    for s0 in range(0, max(1, min(n // 2, n - 15))):
        for lag in range(max(10, int(fps * 0.5)), min(n - s0, int(fps * 2.5))):
            d = (sils[s0] ^ sils[s0 + lag]).mean()
            if best is None or d < best[0]:
                best = (d, s0, lag)
    _, s, length = best
    print(f"loop: starts at frame {s}, {length} frames long ({length / fps:.2f}s), mismatch {best[0]:.4f}")

N = min(args.frames, length)
idx = [s + round(i * length / N) for i in range(N)] if not args.once else [round(i * (n - 1) / (N - 1)) for i in range(N)]

# one shared box around all chosen frames, aligned on feet + head centre
sel = [(keyed[i], anchors[i]) for i in idx]
L = min(a[2] - a[1] for _, a in sel) - 12
T = min(a[3] - a[0] for _, a in sel) - 12
R = max(a[4] - a[1] for _, a in sel) + 12
crops = [im.crop((a[1] + L, a[0] + T, a[1] + R, a[0] + 6)) for im, a in sel]

# scale so the character's standing height = --height (measured from the tallest frame)
char_h = max(a[0] - a[3] for _, a in sel)
sc = args.height / char_h
cw, ch = round(crops[0].width * sc), round(crops[0].height * sc)
frames = [c.resize((cw, ch), Image.LANCZOS) for c in crops]

sheet = Image.new("RGBA", (cw * N, ch))
for k, f in enumerate(frames): sheet.alpha_composite(f, (k * cw, 0))
sheet.save(args.out + "_sheet.png")

ms = round(1000 * (length / fps) / N)
gif = []
for f in frames:
    bg = Image.new("RGBA", f.size, (110, 160, 210, 255)); bg.alpha_composite(f)
    gif.append(bg.convert("RGB").resize((cw // 2 * 2 // 1, ch), Image.LANCZOS))
gif[0].save(args.out + "_preview.gif", save_all=True, append_images=gif[1:], duration=ms, loop=0)

json.dump({"frames": N, "frame_w": cw, "frame_h": ch, "ms_per_frame": ms, "loop": not args.once,
           "foot_y": ch - round(6 * sc), "center_x": round(-L * sc)}, open(args.out + ".json", "w"), indent=2)
print(f"{N} frames of {cw}x{ch}, {ms} ms each -> {args.out}_sheet.png")
