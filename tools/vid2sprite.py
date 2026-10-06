"""Turn a green-screen walk-in-place clip into a pixel-art sprite sheet like try2.
usage: python vid2sprite.py <frames_dir> <out_prefix> [target_height]"""
import sys, glob, os
import numpy as np
from PIL import Image

frames_dir, out_prefix = sys.argv[1], sys.argv[2]
TARGET_H = int(sys.argv[3]) if len(sys.argv) > 3 else 63
files = sorted(glob.glob(os.path.join(frames_dir, "*.png")))

def key(path):
    a = np.asarray(Image.open(path).convert("RGB")).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    green = (g > r + 30) & (g > b + 30)
    alpha = (~green).astype(np.uint8) * 255
    # spill suppression on the remaining pixels
    a2 = a.copy()
    lim = np.maximum(r, b)
    a2[..., 1] = np.where(g > lim + 8, lim + 8, g)
    # keep only the biggest blob roughly: drop tiny specks at the frame borders
    alpha[:3, :] = 0; alpha[-3:, :] = 0; alpha[:, :3] = 0; alpha[:, -3:] = 0
    return np.dstack([a2.clip(0, 255).astype(np.uint8), alpha])

def green_ratio(path):
    a = np.asarray(Image.open(path).convert("RGB")).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    return ((g > r + 30) & (g > b + 30)).mean()

# skip intro frames that aren't on the green screen
good = [f for f in files if green_ratio(f) > 0.5]
start = files.index(good[0])
files = files[start:]
print("using frames", start, "to", start + len(files) - 1)

keyed = [key(f) for f in files]

# silhouette per frame, aligned on feet (bottom) and body centre (columns of the top half)
def silhouette(k):
    m = k[..., 3] > 128
    ys, xs = np.where(m)
    return m, ys.max(), int(np.median(xs[ys < ys.min() + (ys.max() - ys.min()) // 2]))

info = [silhouette(k) for k in keyed]
H = max(i[0].shape[0] for i in info)

def aligned_mask(i, size=(200, 160)):
    m, foot, cx = i
    out = np.zeros(size, bool)
    h, w = size
    ys, xs = np.where(m)
    ys2 = ys - foot + h - 5; xs2 = xs - cx + w // 2
    ok = (ys2 >= 0) & (ys2 < h) & (xs2 >= 0) & (xs2 < w)
    out[ys2[ok], xs2[ok]] = True
    return out

small = [np.asarray(Image.fromarray(aligned_mask(i, (640, 480)).astype(np.uint8) * 255).resize((120, 160), Image.BOX)) > 100 for i in info]

def diff(a, b):
    return (small[a] ^ small[b]).mean()

# find the loop: for each start in the first part, the lag (12..60) with the smallest difference
best = None
for s in range(0, min(30, len(small) - 61)):
    for lag in range(14, 61):
        d = diff(s, s + lag)
        if best is None or d < best[0]:
            best = (d, s, lag)
d, s, lag = best
print("loop: start", s, "length", lag, "diff", round(d, 4))

# sample the loop down to N frames
N = 12 if lag >= 20 else 8
idx = [s + round(i * lag / N) for i in range(N)]

# crop each frame around the feet/centre, consistent box
pad = 20
boxes = []
for i in idx:
    m, foot, cx = info[i]
    ys, xs = np.where(m)
    boxes.append((xs.min() - cx, ys.min() - foot, xs.max() - cx, 0))
L = min(b[0] for b in boxes) - pad; T = min(b[1] for b in boxes) - pad; R = max(b[2] for b in boxes) + pad
crops = []
for i in idx:
    m, foot, cx = info[i]
    im = Image.fromarray(keyed[i])
    crops.append(im.crop((cx + L, foot + T, cx + R, foot + 2)))
full_h = crops[0].height - pad - 2  # body height in source pixels
scale = TARGET_H / full_h
W2, H2 = round(crops[0].width * scale), round(crops[0].height * scale)

# pixelize: premultiplied BOX downscale, alpha threshold, palette from figure pixels only
def down(c):
    a = np.asarray(c).astype(float)
    al = a[..., 3:4] / 255.0
    pre = np.dstack([a[..., :3] * al, a[..., 3:4]])
    s = np.asarray(Image.fromarray(pre[..., :3].clip(0, 255).astype(np.uint8)).resize((W2, H2), Image.BOX)).astype(float)
    sa = np.asarray(Image.fromarray(a[..., 3].astype(np.uint8)).resize((W2, H2), Image.BOX)).astype(float)
    rgb = np.where(sa[..., None] > 0, s / np.maximum(sa[..., None] / 255.0, 1e-3), 0)
    return rgb.clip(0, 255).astype(np.uint8), sa > 110

smalls = [down(c) for c in crops]
allpx = np.concatenate([rgb[m] for rgb, m in smalls])
pal = Image.fromarray(allpx.reshape(-1, 1, 3)).quantize(colors=24, method=Image.MEDIANCUT)
outs = []
for rgb, m in smalls:
    q = np.asarray(Image.fromarray(rgb).quantize(palette=pal, dither=Image.NONE).convert("RGB"))
    outs.append(np.dstack([q, m.astype(np.uint8) * 255]))

sheet = np.concatenate(outs, axis=1)
Image.fromarray(sheet).save(out_prefix + "_sheet.png")
S = 5
gif = []
for o in outs:
    bg = Image.new("RGBA", (W2, H2), (110, 160, 210, 255)); bg.alpha_composite(Image.fromarray(o))
    gif.append(bg.convert("RGB").resize((W2 * S, H2 * S), Image.NEAREST))
gif[0].save(out_prefix + "_preview.gif", save_all=True, append_images=gif[1:], duration=round(1000 * lag / 24 / N), loop=0)
strip = Image.new("RGB", (W2 * S * N, H2 * S), "white")
for k, g in enumerate(gif): strip.paste(g, (k * W2 * S, 0))
strip.save(out_prefix + "_frames.png")
print("frames", N, "frame size", W2, "x", H2, "ms/frame", round(1000 * lag / 24 / N))
