"""Turn a harp recording into a harp-duel song: a trimmed mp3 plus a chart of button notes on its plucks.

usage:
  python tools/make_harp_chart.py <song.mp3> <name> --start S --end E [--gap G] [--phrases 4,5,6] [--lead L]

  --start/--end  the part of the recording to use (seconds)
  --gap          the least time between two charted notes (bigger = easier; the strongest plucks win)
  --phrases      how many notes in each tune (a miss rewinds to the start of that tune)
  --lead         seconds of music before the first note (default 2.5)

Each charted note is a pluck in the recording. Its button comes from its pitch, low to high:
  down, left, B, A, right, up   (so a rising run looks like a rising pattern)
Writes assets/audio/harp_<name>.mp3 and the chart into game/harp_songs.js (other songs there are kept).
Needs ffmpeg, numpy and librosa.
"""
import argparse, json, os, re, subprocess
import numpy as np, librosa

ap = argparse.ArgumentParser()
ap.add_argument("song"); ap.add_argument("name")
ap.add_argument("--start", type=float, required=True); ap.add_argument("--end", type=float, required=True)
ap.add_argument("--gap", type=float, default=0.9); ap.add_argument("--phrases", default="4,5,6")
ap.add_argument("--lead", type=float, default=2.5)
args = ap.parse_args()
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
BUTTONS = ["down", "left", "b", "a", "right", "up"]   # low to high

sr = 22050
y, _ = librosa.load(args.song, sr=sr, mono=True)
hop = 256
env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
frames = librosa.onset.onset_detect(onset_envelope=env, sr=sr, hop_length=hop, backtrack=False)
times = librosa.frames_to_time(frames, sr=sr, hop_length=hop)
S = np.abs(librosa.stft(y, n_fft=4096, hop_length=hop))
freqs = librosa.fft_frequencies(sr=sr, n_fft=4096)
band = (freqs > 110) & (freqs < 1800)

def pitch_at(f):   # the new note: the frequency that rose the most at the pluck
    a = S[:, max(0, f - 3):f].mean(axis=1); b = S[:, f + 2:f + 8].mean(axis=1)
    rise = np.where(band, b - a, 0)
    k = int(np.argmax(rise))
    return float(librosa.hz_to_midi(freqs[k])) if rise[k] > 0 else None

t0 = args.start + args.lead   # first note no earlier than this
cand = [(env[f], t, f) for f, t in zip(frames, times) if t0 <= t <= args.end - 1.0]
cand.sort(reverse=True)
picked = []
for s, t, f in cand:   # the strongest plucks first, keeping them at least --gap apart
    if all(abs(t - p[0]) >= args.gap for p in picked):
        m = pitch_at(f)
        if m is not None: picked.append((t, m))
picked.sort()

sizes = [int(n) for n in args.phrases.split(",")]
need = sum(sizes)
if len(picked) < need: raise SystemExit(f"only {len(picked)} notes in that part at --gap {args.gap}; need {need}")
picked = picked[:need]
mids = np.array([m for _, m in picked])
edges = np.quantile(mids, np.linspace(0, 1, len(BUTTONS) + 1)[1:-1])
notes = []
for t, m in picked:
    b = BUTTONS[int(np.searchsorted(edges, m, side="right"))]
    if notes and notes[-1]["b"] == b and m != notes[-1]["m"]:   # a different note on the same button: nudge it to a neighbour
        i = BUTTONS.index(b); b = BUTTONS[min(len(BUTTONS) - 1, i + 1) if m > notes[-1]["m"] else max(0, i - 1)]
    notes.append({"t": round(t - args.start, 3), "b": b, "m": round(m, 1)})

phrases, i = [], 0
for n in sizes:
    phrases.append({"from": i, "to": i + n, "start": round(max(0, notes[i]["t"] - (args.lead if i == 0 else 1.6)), 3)}); i += n
end = min(args.end, args.start + notes[-1]["t"] + 3.5)

out_mp3 = os.path.join(ROOT, "assets", "audio", f"harp_{args.name}.mp3")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(args.start), "-to", str(end), "-i", args.song,
                "-af", f"afade=t=out:st={end - args.start - 2.5}:d=2.5", "-ac", "2", "-b:a", "160k", out_mp3], check=True)

js = os.path.join(ROOT, "game", "harp_songs.js")
songs = {}
if os.path.exists(js):
    m = re.search(r"HARP_SONGS = (\{.*\});", open(js, encoding="utf-8").read(), re.S)
    if m: songs = json.loads(m.group(1))
songs[args.name] = {"file": f"harp_{args.name}.mp3", "notes": [{"t": n["t"], "b": n["b"]} for n in notes], "phrases": phrases,
                    "source": f"{os.path.basename(args.song)} {args.start}-{end}s, gap {args.gap}"}
with open(js, "w", encoding="utf-8") as f:
    f.write("// Harp-duel songs: made by tools/make_harp_chart.py from Glen's harp recordings (don't edit by hand).\n"
            "// Each note is a pluck in the recording (t = seconds into the mp3); its button comes from its pitch.\n")
    f.write("const HARP_SONGS = " + json.dumps(songs, indent=1) + ";\n")
print(f"{len(notes)} notes in {len(sizes)} tunes, {end - args.start:.1f}s of music -> {out_mp3}")
for p in phrases:
    print("  tune:", " ".join(f"{notes[k]['b']}@{notes[k]['t']:.1f}" for k in range(p["from"], p["to"])))
