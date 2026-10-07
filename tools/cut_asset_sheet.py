"""Cut each item out of the GPT asset sheet (white background) into its own transparent PNG."""
import os
import numpy as np
from PIL import Image, ImageDraw
from collections import deque

SRC = r"C:/Users/big_g/Desktop/david-sling-art/assets.png"
OUT = r"C:/Users/big_g/AppData/Local/Temp/claude/C--Users-big-g/7a9d917b-0061-4e5d-ae32-de430972c7d4/scratchpad/items"
os.makedirs(OUT, exist_ok=True)
im = np.asarray(Image.open(SRC).convert("RGB")).astype(int)

BOXES = {  # x0, y0, x1, y1 on the 1536 x 1024 sheet
    "bread": (15, 105, 225, 258), "cheese": (250, 105, 420, 258), "grapes": (445, 105, 605, 258),
    "raisins": (628, 105, 800, 258), "figs": (820, 105, 1010, 258), "fig_cake": (1040, 105, 1245, 258),
    "olives": (1285, 105, 1510, 258),
    "dates": (12, 322, 185, 470), "lentils": (200, 322, 372, 470), "roasted_grain": (378, 322, 590, 470),
    "honey": (598, 300, 750, 470), "poison_berries": (768, 330, 918, 478), "thistle": (922, 330, 1088, 478),
    "toxic_mushroom": (1098, 330, 1232, 478), "wasp_large": (1262, 310, 1398, 478), "wasp_small": (1398, 310, 1532, 478),
    "fig_tree": (12, 580, 252, 790), "grape_vine": (255, 585, 472, 790), "olive_tree": (474, 560, 692, 790),
    "date_palm": (694, 548, 908, 790), "oleander": (912, 595, 1106, 790), "beehive_tree": (1106, 555, 1336, 790),
    "thorn_bush": (1336, 610, 1522, 790),
    "rock_ledge": (8, 838, 205, 975), "cave": (218, 838, 402, 975), "campfire": (405, 820, 562, 975),
    "tent": (565, 838, 782, 975), "crops": (785, 838, 952, 975), "vineyard": (952, 838, 1160, 975),
    "stone_wall": (1162, 850, 1322, 975), "cliff_edge": (1332, 838, 1512, 975),
}

def is_bg(px):
    return (px.min(axis=-1) > 232) & ((px.max(axis=-1) - px.min(axis=-1)) < 22)

def is_text(px):
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    return (b > 110) & (b > r + 55) & (g < 120)

def flood(mask, seeds):
    h, w = mask.shape; out = np.zeros_like(mask); q = deque()
    for y, x in seeds:
        if mask[y, x] and not out[y, x]: out[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not out[ny, nx]:
                out[ny, nx] = True; q.append((ny, nx))
    return out

report = []
for name, (x0, y0, x1, y1) in BOXES.items():
    crop = im[y0:y1, x0:x1]
    bg = is_bg(crop) | is_text(crop)
    h, w = bg.shape
    edge = [(y, x) for y in range(h) for x in (0, w - 1)] + [(y, x) for x in range(w) for y in (0, h - 1)]
    fg = ~flood(bg, edge)          # whites inside an item (cheese, mushroom spots) stay
    # keep blobs at least 4% the size of the biggest (drops slivers of neighbouring items)
    lab = np.zeros((h, w), int); sizes = [0]
    for sy in range(h):
        for sx in range(w):
            if fg[sy, sx] and not lab[sy, sx]:
                blob = flood(fg & (lab == 0), [(sy, sx)])
                sizes.append(int(blob.sum())); lab[blob] = len(sizes) - 1
    big = max(sizes)
    keep = np.isin(lab, [k for k, c in enumerate(sizes) if k and c >= 0.04 * big])
    img = Image.fromarray(np.dstack([crop.astype(np.uint8), np.where(keep, 255, 0).astype(np.uint8)]))
    img = img.crop(img.getchannel("A").getbbox())
    img.save(os.path.join(OUT, name + ".png"))
    report.append(f"{name} {img.size[0]}x{img.size[1]}")
print(", ".join(report))

names = list(BOXES); cols = 8; cw, chh = 180, 170
board = Image.new("RGB", (cols * cw, ((len(names) + cols - 1) // cols) * (chh + 16)), (110, 160, 210))
d = ImageDraw.Draw(board)
for i, n in enumerate(names):
    it = Image.open(os.path.join(OUT, n + ".png")); it.thumbnail((cw - 10, chh - 10))
    x = (i % cols) * cw; y = (i // cols) * (chh + 16)
    board.paste(it, (x + 5, y + 16), it); d.text((x + 4, y + 2), n, fill="black")
board.save(os.path.join(os.path.dirname(OUT), "items_board.png"))
