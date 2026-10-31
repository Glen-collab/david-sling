"""Which art each world needs, so the web version only waits for that (game/asset_sets.js).

Run after adding or renaming sprites or items (after make_manifest.py):  python tools/make_asset_sets.py

For each sprite sheet and item it finds where the code names it:
  - in world<N>.js, or in main.js inside a `LEVEL_NAME === "N-..."` stage block  -> world N
  - built from a prefix (e.g. "soldier" + n + "_fear", "villager_" + kind)      -> the world(s) naming that prefix
  - in main.js's shared code                                                     -> every world ("core")
  - only in home.js / journal.js / map.js / menu.js / ...                       -> fetched in the background
The game itself only waits for its stage's ground and background and whatever its opening view draws (main.js
LOAD / frame()). Once it's playing, these lists are fetched in the background, a few at a time: the stage's own
critters and pieces first ("stages"), then the rest of its world ("gate"), then the shared screens ("later").
Anything at all is also fetched the first time it's drawn (main.js want()), so a name this misses only arrives a
moment late; it never goes missing.
"""
import json, os, re, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = lambda *p: os.path.join(ROOT, *p)

src = open(G("game", "sprites.js"), encoding="utf-8").read()
SPR = json.loads(re.search(r"window\.SPRITE_DATA\s*=\s*(\{.*?\n\});", src, re.S).group(1))
ITEMS = json.loads("[" + re.search(r"ITEM_LIST = \[(.*?)\]", src).group(1) + "]")

# the code, in chunks: "core" (main.js shared code), "w1".."w8", and "other:<file>" (screens: home, journal, map...)
chunks = collections.defaultdict(str)
for f in sorted(os.listdir(G("game"))):
    if not f.endswith(".js") or f in ("sprites.js", "journal_font.js", "asset_sets.js"):
        continue
    t = open(G("game", f), encoding="utf-8").read()
    if f == "main.js":
        cur = "core"
        for ln in t.split("\n"):
            m = re.search(r'LEVEL_NAME === "(\d)-', ln)
            if m and re.match(r"^\s*(\}\s*else\s+)?if\s*\(", ln):
                cur = "w" + m.group(1)
            chunks[cur] += ln + "\n"
            if cur != "core" and re.match(r"^\}\s*$", ln):
                cur = "core"
    else:
        m = re.match(r"world(\d)\.js$", f)
        chunks["w" + m.group(1) if m else "other:" + f] += t


def where(name):
    pat = re.compile(r"(?<![\w])" + re.escape(name) + r"(?![\w])")
    hits = {k for k, t in chunks.items() if pat.search(t)}
    if hits:
        return hits
    for k in range(len(name) - 1, 3, -1):   # a name built from a prefix: "soldier" + n + "_fear"
        p = '"' + name[:k] + '"'
        hits = {c for c, t in chunks.items() if p in t}
        if hits:
            return hits
    return set()


ALWAYS = re.compile(r"^(david_|lamb|sheep|flock|hud_)")   # David and the flock are on every stage
sets = {str(w): {"gate": [], "later": []} for w in range(1, 9)}   # gate: this world's own (fetched first); later: the rest
shared_later = []
for kind, names in (("s", SPR), ("i", ITEMS)):
    for n in names:
        key, hits = f"{kind}:{n}", where(n)
        worlds = {h[1] for h in hits if re.fullmatch(r"w\d", h)}
        if "core" in hits and (kind == "i" or ALWAYS.match(n)):
            for w in sets: sets[w]["gate"].append(key)   # shared items (campfires, olives, rocks) and David
        elif "core" in hits:
            for w in sets: (sets[w]["gate"] if w in worlds else sets[w]["later"]).append(key)
        elif worlds:
            for w in worlds: sets[w]["gate"].append(key)
        else:
            shared_later.append(key)   # screens only (home, journal, map), or not named anywhere
for w in sets:
    sets[w]["later"] += [k for k in shared_later if k not in sets[w]["gate"]]

# each stage's own block in main.js (critter("boar"), setPiece("bear")...): those come first in the background fetch
blocks = collections.defaultdict(str)
cur = None
for ln in open(G("game", "main.js"), encoding="utf-8").read().split("\n"):
    m = re.search(r'LEVEL_NAME === "(\d-\d)"', ln)
    if m and re.match(r"^\s*(\}\s*else\s+)?if\s*\(", ln): cur = m.group(1)
    elif cur and re.match(r"^\}\s*$", ln): cur = None
    if cur: blocks[cur] += ln + "\n"
sets["stages"] = {}
for st, t in blocks.items():
    w = st[0]
    words = {wd for q in re.findall(r'"([^"]*)"', t) for wd in re.findall(r"[a-z]+", q.lower())}   # talk(64, "The Steward") -> steward
    sets["stages"][st] = [k for k in sets[w]["gate"] + sets[w]["later"]
                          if re.search(r'"' + re.escape(k[2:]) + r'"', t) or k[2:].split("_")[0] in words]

out = G("game", "asset_sets.js")
with open(out, "w", encoding="utf-8") as fh:
    fh.write("// made by tools/make_asset_sets.py: per world, the art to wait for (gate) and to fetch in the background (later)\n")
    fh.write("window.ASSET_SETS = " + json.dumps(sets, separators=(",", ":")) + ";\n")

size = lambda k: os.path.getsize(G("assets", "sprites", os.path.basename(SPR[k[2:]]["src"]))) if k[0] == "s" else os.path.getsize(G("assets", "items", k[2:] + ".png"))
for w in [k for k in sets if k != "stages"]:
    g = sum(size(k) for k in sets[w]["gate"]); l = sum(size(k) for k in sets[w]["later"])
    print(f"World {w}: its own art {len(sets[w]['gate'])} ({g / 1e6:.0f} MB), then shared {len(sets[w]['later'])} ({l / 1e6:.0f} MB)")
print("wrote", os.path.relpath(out, ROOT))
