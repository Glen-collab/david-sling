"""The opening of World 1: Glen's two clips cut into one video (world1.js w1intro plays it, muted, under the game's music).
Bethlehem at dawn (the flyover), then breakfast at Jesse's table, keyed over his courtyard painting: David grabs some
bread and is gone out of the shot. The breakfast clip's floor is green at the start and dirt later, so the shot is framed
tight, cut below the tabletop, and the floor never shows.

  python tools/make_w1_opening.py      -> assets/video/w1_opening.mp4 and w1_opening_last.jpg

Clips: david-sling-art/world1/opening (bethlehem_dawn.mp4, breakfast.mp4).
"""
import os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(os.path.dirname(ROOT), "david-sling-art", "world1", "opening")
TOWN = os.path.join(ART, "bethlehem_dawn.mp4")
TABLE = os.path.join(ART, "breakfast.mp4")
YARD = os.path.join(ROOT, "assets", "backgrounds", "courtyard_w1.jpg")
FPS = 24
TOWN_END = 9.0     # seconds of the flyover used
XFADE = 0.8        # the cross-fade from the town to the table
TABLE_CROP = (720, 525, 0, 100)   # w, h, x, y of the breakfast clip kept: the people and the tabletop, not the floor
GREEN = "0x04fa0d"


def run(args):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-2000:])


def main():
    out = os.path.join(ROOT, "assets", "video", "w1_opening.mp4")
    cw, ch, cx, cy = TABLE_CROP
    sw = round(720 * cw / ch / 2) * 2   # the table shot, scaled to the full height of the frame
    fil = (
        f"[0:v]trim=0:{TOWN_END},setpts=PTS-STARTPTS,fps={FPS},scale=1280:720,fade=in:st=0:d=1.2,format=yuv420p[town];"
        f"[2:v]crop=1621:912:0:0,scale=1280:720,boxblur=5:1,eq=brightness=-0.03,fps={FPS},format=yuv420p[yard];"
        f"[1:v]setpts=PTS-STARTPTS,fps={FPS},crop={cw}:{ch}:{cx}:{cy},scale={sw}:720,chromakey={GREEN}:0.18:0.06,despill=type=green[fg];"
        f"[yard][fg]overlay=0:0:shortest=1,format=yuv420p[table];"
        f"[town][table]xfade=transition=fade:duration={XFADE}:offset={TOWN_END - XFADE},format=yuv420p[v]"
    )
    run(["ffmpeg", "-v", "error", "-y", "-i", TOWN, "-i", TABLE, "-loop", "1", "-framerate", str(FPS), "-i", YARD,
         "-filter_complex", fil, "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "20", "-preset", "slow",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", out])
    run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.1", "-i", out, "-frames:v", "1", "-q:v", "3",
         os.path.join(ROOT, "assets", "video", "w1_opening_last.jpg")])
    d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out],
                             capture_output=True, text=True).stdout)
    print(f"  0.00  Bethlehem\n {TOWN_END - XFADE:5.2f}  the table\n {d:5.2f}  end   ({os.path.getsize(out) / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
