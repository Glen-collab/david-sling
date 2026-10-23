"""Make a copy of a sprite sheet with every frame's lowest pixels (the feet) on the anchor line.

A jump cut from a video keeps the height of the jump in its frames: the animal is drawn high up in the air frames.
When the game moves the sprite up and down itself (the lamb's own jump), that height has to come out, or she'd fly
twice as high. Each frame is moved down so its feet sit where the standing frames' feet are.

  python tools/align_feet.py lamb_stomp lamb_jump      (assets/sprites/<in>.png/.json -> <out>.png/.json)
"""
import json, os, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "sprites")
src, dst = sys.argv[1], sys.argv[2]
meta = json.load(open(os.path.join(ROOT, src + ".json")))
im = Image.open(os.path.join(ROOT, src + ".png")).convert("RGBA")
fw, fh, n, ay = meta["frame_w"], meta["frame_h"], meta["frames"], meta["anchor_y"]
out = Image.new("RGBA", im.size)
for i in range(n):
    f = im.crop((i * fw, 0, (i + 1) * fw, fh))
    box = f.getchannel("A").point(lambda v: 255 if v > 60 else 0).getbbox()
    dy = (ay - box[3]) if box else 0          # down by the gap under the feet
    out.paste(f, (i * fw, dy), f)
    print(f"frame {i}: down {dy}")
out.save(os.path.join(ROOT, dst + ".png"))
meta = dict(meta, source=f"{src} with each frame's feet on the anchor line (tools/align_feet.py)")
json.dump(meta, open(os.path.join(ROOT, dst + ".json"), "w"), indent=2)
print("wrote", dst)
