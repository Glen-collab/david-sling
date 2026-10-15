"""Clean up david_anoint_sheep after vid2sprite --soft (Glen's pouring clip):
the screen's dark teal shadow trapped between his arm and body, the oil pool on the ground, and the stream below
sheep-head height (the sheep is drawn behind him, so the oil should end on its head, not run down its face).
usage: python tools/clean_anoint.py [px above the ground where the stream stops, default 70]"""
import json, sys, numpy as np
from PIL import Image
from scipy import ndimage
STOP = int(sys.argv[1]) if len(sys.argv) > 1 else 70
p = 'assets/sprites/david_anoint_sheep.png'; d = json.load(open(p[:-4] + '.json'))
a = np.array(Image.open(p)).astype(int); r, g, b, al = [a[..., i] for i in range(4)]
al = np.where((g >= r + 4) & (r < 85) & (g < 115) & (al > 0), 0, al)      # trapped screen shadow (very dark only: not the tunic folds)
oil = (b < 95) & (r - b > 95) & (g > r * 0.7) & (al > 0)                    # saturated golden oil (not the pale tunic, not skin)
low = np.zeros_like(oil); low[d['anchor_y'] - STOP:, :] = True
air = (np.roll(al, 5, 1) < 40) | (np.roll(al, -5, 1) < 40)                 # stream hanging in open air (in front of the tunic it stays)
pool = np.zeros_like(oil); pool[d['anchor_y'] - 10:, :] = True              # the pool on the ground
al = np.where(oil & ((low & air) | pool), 0, al)
a[..., 3] = al
fw = d['frame_w']; m = al > 60; lab, n = ndimage.label(m); sz = ndimage.sum(m, lab, range(1, n + 1))
for i in range(d['frames']):                                               # specks left over
    sl = lab[:, i * fw:(i + 1) * fw]
    for k in np.unique(sl):
        if k and sz[k - 1] < 60: a[:, i * fw:(i + 1) * fw, 3][sl == k] = 0
Image.fromarray(a.clip(0, 255).astype(np.uint8)).save(p)
print('cleaned', p)
