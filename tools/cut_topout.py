"""Cut David's ladder top-out from Glen's two green strips (back view and side view) into one sheet, david_topout.

usage: python tools/cut_topout.py <back_sheet.png> <side_sheet.png> <out_prefix>
Frames: back 0 (both hands up at the roof edge), back 1 (pulling up), side 1 (climbing over), side 2 (on hands and
knees), side 3 (up and stepping off). Each strip is scaled so its standing pose is David's height (240), frames sit on
their feet in equal cells, centred on their outline. main.js shifts each frame into place (TOPOUT_POS).
"""
import json, sys, numpy as np
from PIL import Image
from scipy import ndimage

def figures(path):
    a = np.asarray(Image.open(path).convert("RGB")).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    k = np.clip((g - np.maximum(r, b) - 30) / 60, 0, 1)            # 1 = green screen
    rgb = np.dstack([r, np.minimum(g, np.maximum(r, b) * 1.05), b])   # despill
    al = ndimage.grey_erosion(1 - k, size=(2, 2))
    lab, n = ndimage.label(al > 0.5); sz = ndimage.sum(al > 0.5, lab, range(1, n + 1))
    big = [1 + i for i in np.argsort(-sz)[:4]]
    big.sort(key=lambda i: ndimage.find_objects(lab)[i - 1][1].start)
    out = []
    for i in big:
        sl = ndimage.find_objects(lab)[i - 1]; m = ndimage.binary_dilation(lab == i, iterations=2) * al
        im = np.dstack([rgb, m * 255])[sl[0].start:sl[0].stop, sl[1].start:sl[1].stop].clip(0, 255).astype(np.uint8)
        out.append(Image.fromarray(im))
    return out

back, side = figures(sys.argv[1]), figures(sys.argv[2])
sb, ss = 240 / back[3].height, 240 / side[3].height       # the standing poses = David's height
picks = [(back[0], sb), (back[1], sb), (side[1], ss), (side[2], ss), (side[3], ss)]
ims = [im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS) for im, s in picks]
fw, fh = max(i.width for i in ims) + 4, max(i.height for i in ims) + 4
sheet = Image.new("RGBA", (fw * len(ims), fh))
for k, im in enumerate(ims): sheet.alpha_composite(im, (k * fw + (fw - im.width) // 2, fh - 2 - im.height))
sheet.save(sys.argv[3] + ".png")
json.dump({"frames": len(ims), "frame_w": fw, "frame_h": fh, "ms_per_frame": 200, "loop": False, "align": "feet",
           "anchor_x": fw // 2, "anchor_y": fh - 2, "source": "david_topout_back_sheet.png + david_topout_side_sheet.png"},
          open(sys.argv[3] + ".json", "w"), indent=1)
print(fw, fh, [i.size for i in ims])
