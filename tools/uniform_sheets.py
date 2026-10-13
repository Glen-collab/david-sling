"""Give a set of sprite sheets (one character, several moves) the same frame size and the same anchor, so the
character is the same size in every move and every sheet lines up frame for frame. Optional empty room around it
(e.g. for Glen to paint cut-off horns back in Photoshop).

usage:
  python tools/uniform_sheets.py <dir> <name> [<name> ...] [--top 0.35] [--side 0.12]

  Reads and rewrites <dir>/<name>.png + <name>.json (from vid2sprite.py: <out>_sheet.png is renamed to <out>.png first
  if that's what's there). --top / --side: extra room above / either side, as a fraction of the tallest frame.
"""
import argparse, json, os
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("dir"); ap.add_argument("names", nargs="+")
ap.add_argument("--top", type=float, default=0.0); ap.add_argument("--side", type=float, default=0.0)
args = ap.parse_args()

sheets = {}
for n in args.names:
    png = os.path.join(args.dir, n + ".png")
    if not os.path.exists(png) and os.path.exists(os.path.join(args.dir, n + "_sheet.png")):
        os.replace(os.path.join(args.dir, n + "_sheet.png"), png)
    sheets[n] = (json.load(open(os.path.join(args.dir, n + ".json"))), Image.open(png).convert("RGBA"))

# the shared box, measured from each sheet's anchor (feet / head centre)
left = max(j["anchor_x"] for j, _ in sheets.values())
right = max(j["frame_w"] - j["anchor_x"] for j, _ in sheets.values())
up = max(j["anchor_y"] for j, _ in sheets.values())
down = max(j["frame_h"] - j["anchor_y"] for j, _ in sheets.values())
tall = up + down
side, top = round(args.side * tall), round(args.top * tall)
ax, ay = left + side, up + top
fw, fh = ax + right + side, ay + down

for n, (j, im) in sheets.items():
    out = Image.new("RGBA", (fw * j["frames"], fh))
    for k in range(j["frames"]):
        fr = im.crop((k * j["frame_w"], 0, (k + 1) * j["frame_w"], j["frame_h"]))
        out.alpha_composite(fr, (k * fw + ax - j["anchor_x"], ay - j["anchor_y"]))
    out.save(os.path.join(args.dir, n + ".png"))
    j.update(frame_w=fw, frame_h=fh, anchor_x=ax, anchor_y=ay)
    json.dump(j, open(os.path.join(args.dir, n + ".json"), "w"), indent=2)
    print(f"{n}: {j['frames']} frames of {fw}x{fh}, anchor {ax},{ay}")
