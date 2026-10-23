"""Turn one of Glen's songs (a WAV from Suno) into a stage loop that comes round without a gap.

Suno songs end in a fade-out, so a plain loop would go quiet, stop and start over. Instead the song is cut on a beat
before its ending (--end, seconds; the nearest beat is used), and the last stretch of the song (--xfade seconds past
the cut) is laid fading out over the start fading in. The file then ends right where its start picks up the music.

  python tools/make_music_loop.py song.wav assets/sounds/music_w1_hills.mp3 --end 140 --xfade 4
  python tools/make_music_loop.py song.wav assets/sounds/music_w1_opening.mp3 --whole    (as it is, just the MP3)
"""
import argparse, os, subprocess, tempfile
import numpy as np, librosa, soundfile as sf

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--end", type=float, default=140, help="about where to cut, before the ending (seconds)")
ap.add_argument("--xfade", type=float, default=4, help="the crossfade (seconds)")
ap.add_argument("--whole", action="store_true", help="no loop: the song as it is")
a = ap.parse_args()

y, sr = librosa.load(a.src, sr=None, mono=False)
y = np.atleast_2d(y)
if a.whole:
    out = y
else:
    tempo, beats = librosa.beat.beat_track(y=librosa.to_mono(y), sr=sr, units="time")
    end = min(beats, key=lambda b: abs(b - a.end))
    e, x = int(end * sr), int(a.xfade * sr)
    assert e + x <= y.shape[1], "the crossfade runs past the end of the song"
    ramp = np.sin(np.linspace(0, np.pi / 2, x)) ** 2          # equal-power-ish fade
    head = y[:, :x] * ramp + y[:, e:e + x] * ramp[::-1]       # the tail fading out over the start fading in
    out = np.concatenate([head, y[:, x:e]], axis=1)
    print(f"tempo {float(np.atleast_1d(tempo)[0]):.0f} bpm, cut at {end:.2f}s, loop {out.shape[1] / sr:.1f}s")
tmp = os.path.join(tempfile.gettempdir(), "music_loop.wav")
sf.write(tmp, out.T, sr)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-ar", "44100", "-b:a", "192k", a.out], check=True)
print("wrote", a.out)
