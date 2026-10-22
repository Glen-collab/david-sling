"""Glen's own voice, made into someone else's (Glen, 2026-10-22): he records a line, this makes it a boy, an old man
(Jesse, Hanan), or the giant.

  python tools/voice.py boy   in.m4a out.mp3
  python tools/voice.py old   in.m4a out.mp3
  python tools/voice.py giant in.m4a out.mp3

A voice has two parts that change with who's speaking: its pitch (how high the note is) and its formants (the ring
of the throat and mouth: a child's is small, so it rings higher). Raising only the pitch sounds like a man singing
high; raising both together sounds like a chipmunk. So each voice moves them separately: the formants by FORMANT
(resampling moves everything), then the pitch the rest of the way with the formants held (rubberband), and the speed
put back. Then a little character (an old man's waver), the room trimmed, and the loudness leveled to the game's.
"""
import subprocess, sys

VOICES = {   # pitch: x the note; formant: x the throat; tempo: x the speed; extra: ffmpeg filters after
    "boy":   {"pitch": 1.75, "formant": 1.18, "tempo": 1.04, "extra": "highpass=f=140,equalizer=f=3200:t=q:w=1.2:g=2"},
    "old":   {"pitch": 0.90, "formant": 0.97, "tempo": 0.93, "extra": "vibrato=f=5.2:d=0.07,highpass=f=110,lowpass=f=7000,equalizer=f=2500:t=q:w=1:g=-2"},
    "giant": {"pitch": 0.70, "formant": 0.82, "tempo": 0.92, "extra": "lowpass=f=6000,aecho=0.8:0.6:60:0.25"},
}


def main():
    if len(sys.argv) != 4 or sys.argv[1] not in VOICES:
        sys.exit(__doc__)
    v, src, out = VOICES[sys.argv[1]], sys.argv[2], sys.argv[3]
    sr, f = 48000, v["formant"]
    chain = ",".join([
        f"aresample={sr}", f"asetrate={round(sr * f)}", f"aresample={sr}",                  # throat and note both by f
        f"rubberband=pitch={v['pitch'] / f:.4f}:tempo={v['tempo'] / f:.4f}:formant=preserved:pitchq=quality",   # the note the rest of the way
        v["extra"],
        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
        "loudnorm=I=-16:TP=-1.5:LRA=11",
    ])
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", chain, "-ar", "44100", "-ac", "1", "-b:a", "128k", out],
                       capture_output=True, text=True)
    if r.returncode: sys.exit(r.stderr[-2000:])
    print("->", out)


if __name__ == "__main__":
    main()
