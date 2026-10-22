"""The giant's close-up (Glen's goliath_face_hit.mp4): his clip's stone is a jagged rock; it should be a smooth stone
(Glen, 2026-10-22). This paints the game's own smooth stone (assets/items/pick_oval.png, one of the stones David picks
from the brook in 7-3) over it in every frame it's in: flying in, stuck in the helmet, tumbling away. Where the old
rock was over the green screen it's keyed away first, so none of it peeks out. Glen's clip is left as it is.

  make_giant_fall.py paints it straight onto the slowed-down close-up (paint(), where()): slowing a clip makes frames
  in between Glen's by guessing how things move, and that smeared the stone ("watery", Glen). So the rock is slowed
  with everything else and the stone is painted on after, sharp, at its place between frames.
  python tools/patch_face_stone.py   -> david-sling-art/world7/goliath/goliath_face_hit_smooth.mp4 (his clip at its own
  speed with the stone in, to look at)

STONE_PATH: [frame, x, y] of the old rock's middle (960 x 960 frames), read off the clip by eye; between them (the
slowed frames) it's interpolated. Glen can move a point, or change STONE_SIZE / STONE_ITEM, and run this again, then make_giant_fall.py.
"""
import os, subprocess, sys, tempfile, shutil, glob
import numpy as np
from PIL import Image, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GOL = os.path.join(os.path.dirname(ROOT), "david-sling-art", "world7", "goliath")
SRC = os.path.join(GOL, "goliath_face_hit.mp4")
OUT = os.path.join(GOL, "goliath_face_hit_smooth.mp4")
STONE_ITEM = os.path.join(ROOT, "assets", "items", "pick_oval.png")
STONE_SIZE = (216, 152)   # px the smooth stone is drawn at: bigger than the rock, so none of it shows round the edges
                          # (Glen: at 184 x 128 bits of the rock flickered at its edge, "watery")
STONE_PATH = [   # frame, x, y (the rock flies in from the left, hits at 62, sits in the helmet, falls away down the left)
    (53, 12, 336), (54, 54, 312), (55, 78, 300), (56, 120, 284), (57, 172, 276), (58, 222, 270), (59, 266, 262),
    (60, 322, 264), (61, 358, 262), (62, 400, 258), (63, 404, 258), (64, 400, 260), (65, 392, 259), (66, 384, 259),
    (67, 378, 261), (68, 334, 264), (69, 304, 286), (70, 282, 306), (71, 258, 322), (72, 230, 346), (73, 200, 370),
    (74, 176, 394), (75, 146, 434), (76, 120, 484), (77, 88, 526), (78, 58, 560), (79, 30, 600),
]
STUCK = (62, 67)          # frames it's in the helmet (no spin)
OVER_GREEN = [(53, 57), (72, 75)]   # frames the rock is all over the green screen: only there is it keyed away (near the
                          # helmet that took bites out of it); elsewhere the smooth stone just covers it
TINT = (0.3, 1.22)        # the stone's colour kept, brightness: a pale grey river stone, like the one in the throw
SPIN = 7                  # degrees a frame while it flies
GREEN = (70, 240, 60)     # his screen's green (make_giant_fall.py keys 0x46f03c)


def run(args):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-2000:])


def stone_image():
    stone = Image.open(STONE_ITEM).convert("RGBA").resize(STONE_SIZE, Image.LANCZOS)
    rgb, alpha = stone.convert("RGB"), stone.getchannel("A")
    rgb = ImageEnhance.Brightness(ImageEnhance.Color(rgb).enhance(TINT[0])).enhance(TINT[1])
    stone = rgb.convert("RGBA"); stone.putalpha(alpha)
    return stone


def where(f):
    """The stone at frame f of Glen's clip (f can fall between frames: make_giant_fall.py paints it on the slowed-down
    close-up, whose frames come between his): (x, y, angle), or None when it isn't in the shot."""
    f0, f1 = STONE_PATH[0][0], STONE_PATH[-1][0]
    if f < f0 or f > f1: return None
    k = min(len(STONE_PATH) - 2, int(f - f0)); (fa, xa, ya), (fb, xb, yb) = STONE_PATH[k], STONE_PATH[k + 1]
    u = (f - fa) / (fb - fa)
    ang = -SPIN * (min(f, STUCK[0]) - f0) - (SPIN * 1.4 * (f - STUCK[1]) if f > STUCK[1] else 0)   # spins in flight, holds in the helmet
    return xa + (xb - xa) * u, ya + (yb - ya) * u, ang


def paint(im, f, stone, grow=1.0):
    """Paint the smooth stone over the rock in one frame (a PIL RGB image) at frame f. grow: how much further round it
    the old rock is keyed away (the slowed frames smear it a little wider)."""
    w = where(f)
    if not w: return im
    x, y, ang = w
    if any(g0 <= f <= g1 for g0, g1 in OVER_GREEN):   # the old rock over the green: back to green, so the key takes it
        a = np.asarray(im).astype(int)
        yy, xx = np.ogrid[:a.shape[0], :a.shape[1]]
        near = ((xx - x) / (STONE_SIZE[0] * 0.62 * grow)) ** 2 + ((yy - y) / (STONE_SIZE[1] * 0.75 * grow)) ** 2 < 1
        mx, mn = a.max(-1), a.min(-1); sat = (mx - mn) / np.maximum(mx, 1)
        a[near & (sat < 0.35) & (mx > 70)] = GREEN
        im = Image.fromarray(a.astype(np.uint8))
    s = stone.rotate(ang, resample=Image.BICUBIC, expand=True)
    im = im.convert("RGBA"); im.alpha_composite(s, (int(round(x - s.width / 2)), int(round(y - s.height / 2))))
    return im.convert("RGB")


def main():
    tmp = tempfile.mkdtemp()
    try:
        run(["ffmpeg", "-v", "error", "-i", SRC, os.path.join(tmp, "%04d.png")])
        files = sorted(glob.glob(os.path.join(tmp, "*.png")))
        stone = stone_image()
        for f in range(STONE_PATH[0][0], STONE_PATH[-1][0] + 1):
            paint(Image.open(files[f]).convert("RGB"), f, stone).save(files[f])
        run(["ffmpeg", "-v", "error", "-y", "-framerate", "24", "-i", os.path.join(tmp, "%04d.png"), "-c:v", "libx264",
             "-crf", "12", "-pix_fmt", "yuv420p", OUT])
        print("->", OUT)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
