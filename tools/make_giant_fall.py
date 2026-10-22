"""The fall of Goliath (World 8): Glen's clips cut into one movie scene, like an old action film.
The sling winds up, the stone flies in slow motion, the hit is shown three times (two takes from over David's
shoulder, then the close-up of the face), then he falls. The game plays it muted and puts its own sounds on it
(world8.js GIANT_FALL.CUES, timed to the cut times this prints).

  python tools/make_giant_fall.py            -> assets/video/giant_fall.mp4 and giant_fall_last.jpg

Clips: david-sling-art/world8 (windup, throw_hit_fall, throw_take2) and david-sling-art/world7/goliath/goliath_face_hit.
Each cut: (clip, start s, end s, speed). Speed under 1 is slow motion (frames made in between, so it stays smooth).
"""
import os, subprocess, sys, tempfile, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(os.path.dirname(ROOT), "david-sling-art")
CLIP = {
    "windup": os.path.join(ART, "world8", "windup.mp4"),
    "hit": os.path.join(ART, "world8", "throw_hit_fall.mp4"),
    "take2": os.path.join(ART, "world8", "throw_take2.mp4"),
    "face": os.path.join(ART, "world7", "goliath", "goliath_face_hit.mp4"),
}
FPS = 24
FLASH = 0.25   # the white flash between the replays (seconds)
CUTS = [   # (name, clip, start, end, speed, flash after)
    ("windup",  "windup", 0.0, 2.6, 1.0,  False),
    ("throw",   "hit",    0.4, 1.05, 1.0, False),
    ("slowhit", "hit",    1.05, 2.4, 0.25, True),    # the stone in, slow: it strikes at about 1.8 s in the clip
    ("replay2", "take2",  3.95, 4.9, 0.3, True),     # the other take: strikes at about 4.3 s
    ("replay3", "face",   2.0, 3.9, 0.35, True),     # the close-up: the stone, the helmet cracks
    ("stagger", "hit",    2.2, 3.4, 1.0,  False),
    ("fall",    "hit",    3.4, 5.4, 0.5,  False),    # down, slow
    ("down",    "hit",    5.4, 6.0, 1.0,  False),
]


def run(args):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-2000:])


def cut(tmp, i, name, clip, a, b, speed):
    out = os.path.join(tmp, f"{i:02d}.mp4")
    slow = f",minterpolate=fps={FPS / speed:.3f}:mi_mode=mci:mc_mode=obmc:me_mode=bidir:me=epzs:search_param=48:vsbmc=0" if speed < 1 else ""
    tempo = f",setpts=PTS/{speed}" if speed != 1 else ""
    if clip == "face":   # Glen's green-screen close-up, over the camp behind him, blurred and pushed in
        bg = f"[1:v]trim=0.1:0.2,setpts=PTS-STARTPTS,crop=200:112:1080:30,scale=1280:720,boxblur=18:2,eq=brightness=-0.06,loop=-1:1:0,fps={FPS}[bg]"
        fg = (f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS,fps={FPS}{slow}{tempo},fps={FPS},"
              "chromakey=0x46f03c:0.16:0.06,despill=type=green,scale=1060:1060[fg]")
        fil = f"{bg};{fg};[bg][fg]overlay=230:-40:shortest=1,format=yuv420p[v]"
        run(["ffmpeg", "-v", "error", "-y", "-i", CLIP[clip], "-i", CLIP["take2"], "-filter_complex", fil, "-map", "[v]",
             "-an", "-c:v", "libx264", "-crf", "16", "-r", str(FPS), out])
    else:
        fil = f"trim={a}:{b},setpts=PTS-STARTPTS,fps={FPS}{slow}{tempo},fps={FPS},scale=1280:720,format=yuv420p"
        run(["ffmpeg", "-v", "error", "-y", "-i", CLIP[clip], "-vf", fil, "-an", "-c:v", "libx264", "-crf", "16", "-r", str(FPS), out])
    return out


def main():
    tmp = tempfile.mkdtemp()
    try:
        parts, t, times = [], 0.0, []
        white = os.path.join(tmp, "white.mp4")
        run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=white:s=1280x720:r={FPS}:d={FLASH}",
             "-vf", "format=yuv420p", "-c:v", "libx264", "-crf", "16", white])
        for i, (name, clip, a, b, speed, flash) in enumerate(CUTS):
            p = cut(tmp, i, name, clip, a, b, speed)
            d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                     capture_output=True, text=True).stdout)
            times.append((name, round(t, 2))); parts.append(p); t += d
            if flash: parts.append(white); times.append((name + " flash", round(t, 2))); t += FLASH
        lst = os.path.join(tmp, "list.txt")
        open(lst, "w").write("".join(f"file '{p.replace(os.sep, '/')}'\n" for p in parts))
        out = os.path.join(ROOT, "assets", "video", "giant_fall.mp4")
        run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c:v", "libx264", "-crf", "22",
             "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out])
        run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.1", "-i", out, "-frames:v", "1", "-q:v", "3",
             os.path.join(ROOT, "assets", "video", "giant_fall_last.jpg")])
        for name, s in times: print(f"{s:7.2f}  {name}")
        print(f"{t:7.2f}  end   ({os.path.getsize(out) / 1e6:.1f} MB)")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
