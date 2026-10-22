"""The opening of World 1: Glen's two clips cut into one video (world1.js w1intro plays it, muted, under the game's music).
Bethlehem at dawn (the flyover), then breakfast at Jesse's table (Glen's second take, the brothers young), keyed over his
courtyard painting, full width: David grabs some bread and is gone out of the shot, and the camera pushes in on them.

  python tools/make_w1_opening.py      -> assets/video/w1_opening.mp4 and w1_opening_last.jpg

Clips: david-sling-art/world1/opening (bethlehem_dawn.mp4, breakfast2.mp4; breakfast.mp4 was the first take).
"""
import os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(os.path.dirname(ROOT), "david-sling-art", "world1", "opening")
TOWN = os.path.join(ART, "bethlehem_dawn.mp4")
TABLE = os.path.join(ART, "breakfast2.mp4")
YARD = os.path.join(ROOT, "assets", "backgrounds", "courtyard_w1.jpg")
FPS = 24
TOWN_END = 9.0     # seconds of the flyover used
XFADE = 0.8        # the cross-fade from the town to the table
TABLE_Y = -110     # the table shot fills the width (1280 x 854), its bottom (the bench and their feet) cut off by the frame
GREEN = "0x00fe00"


def run(args):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-2000:])


def main():
    out = os.path.join(ROOT, "assets", "video", "w1_opening.mp4")
    fil = (
        f"[0:v]trim=0:{TOWN_END},setpts=PTS-STARTPTS,fps={FPS},scale=1280:720,fade=in:st=0:d=1.2,format=yuv420p[town];"
        f"[2:v]crop=1621:912:0:0,scale=1280:720,boxblur=5:1,eq=brightness=-0.03,fps={FPS},format=yuv420p[yard];"
        f"[1:v]setpts=PTS-STARTPTS,fps={FPS},scale=1280:854:flags=lanczos,chromakey={GREEN}:0.2:0.06,despill=type=green[fg];"
        f"[yard][fg]overlay=0:{TABLE_Y}:shortest=1,format=yuv420p[table];"
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
