"""The opening of World 3: Glen's clips cut into one video (world3.js w3intro plays it, muted, and stops it where
the words go). The elders at Bethlehem's gate trembling as Samuel comes up the road with the heifer (1 Samuel 16:4),
then Eliab in Jesse's courtyard, smoothing his hair, sure the prophet has come for him.

  python tools/make_w3_opening.py      -> assets/video/w3_opening.mp4 and w3_opening_last.jpg

Clips: david-sling-art/world3/opening. CLIPS is the order, with the seconds of each used; a clip that isn't there yet
is left out (the boy running in with the news, news_run.mp4, goes first once Glen makes it). The cut times it prints
go in world3.js W3_OPEN.
"""
import os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(os.path.dirname(ROOT), "david-sling-art", "world3", "opening")
CLIPS = [   # (file, start s, end s)
    ("news_run.mp4", 0.0, 10.0),      # (not made yet) the boy running up the street with the news
    ("elders_gate.mp4", 0.0, 9.6),    # the elders at the gate, Samuel and the heifer on the road
    ("eliab_preens.mp4", 0.0, 10.0),  # Eliab hears it
]
FPS = 24
XFADE = 0.8


def run(args):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-2000:])


def main():
    clips = [c for c in CLIPS if os.path.exists(os.path.join(ART, c[0]))]
    args, fil, t, starts = [], [], 0.0, []
    for i, (f, a, b) in enumerate(clips):
        args += ["-i", os.path.join(ART, f)]
        fil.append(f"[{i}:v]trim={a}:{b},setpts=PTS-STARTPTS,fps={FPS},scale=1280:720,format=yuv420p" + (",fade=in:st=0:d=1.0" if i == 0 else "") + f"[c{i}]")
    last = "c0"; starts.append((clips[0][0], 0.0)); t = clips[0][2] - clips[0][1]
    for i in range(1, len(clips)):
        off = t - XFADE; fil.append(f"[{last}][c{i}]xfade=transition=fade:duration={XFADE}:offset={off:.3f}[x{i}]")
        last = f"x{i}"; starts.append((clips[i][0], off)); t = off + clips[i][2] - clips[i][1]
    out = os.path.join(ROOT, "assets", "video", "w3_opening.mp4")
    run(["ffmpeg", "-v", "error", "-y", *args, "-filter_complex", ";".join(fil), "-map", f"[{last}]", "-an", "-c:v", "libx264",
         "-crf", "20", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out])
    run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.1", "-i", out, "-frames:v", "1", "-q:v", "3",
         os.path.join(ROOT, "assets", "video", "w3_opening_last.jpg")])
    for f, s in starts: print(f"{s:6.2f}  {f}")
    print(f"{t:6.2f}  end   ({os.path.getsize(out) / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
