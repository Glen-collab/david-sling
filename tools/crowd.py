"""Turn a few takes of one man shouting into a crowd shouting it (Glen's Philistine voices, World 6).

usage: python tools/crowd.py out.mp3 --takes "file.m4a@0.30-0.85" "file2.m4a@1.2-1.9" ... [--voices 12] [--spread 0.15]
                             [--far 0.6] [--seed 1] [--lead 1.6]
  --takes   each a recording and the seconds of one shout in it (the takes are shared out among the voices)
  --voices  how many men; each is the take pitched 0.78x-1.12x (deeper is likelier), a little faster or slower,
            panned somewhere left to right and coming in up to --spread seconds late
  --far     0 = right beside you, 1 = across the valley (less treble, more echo)
  --lead    the first voice is this much louder (one man leads the shout)
"""
import argparse, random, subprocess
ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("--takes", nargs="+", required=True)
ap.add_argument("--voices", type=int, default=12); ap.add_argument("--spread", type=float, default=0.15)
ap.add_argument("--far", type=float, default=0.5); ap.add_argument("--seed", type=int, default=1); ap.add_argument("--lead", type=float, default=1.6)
a = ap.parse_args(); R = random.Random(a.seed)
ins, chains, labels = [], [], []
for k, t in enumerate(a.takes):
    f, rng = t.rsplit("@", 1); s, e = (float(v) for v in rng.split("-")); ins += ["-ss", f"{s:.3f}", "-t", f"{e - s:.3f}", "-i", f]
splits = {k: [] for k in range(len(a.takes))}
for v in range(a.voices): splits[v % len(a.takes)].append(v)
for k, vs in splits.items():
    if not vs: continue
    chains.append(f"[{k}:a]aformat=sample_rates=44100:channel_layouts=mono,afade=t=in:d=0.02,areverse,afade=t=in:d=0.06,areverse,asplit={len(vs)}" + "".join(f"[s{v}]" for v in vs))
for v in range(a.voices):
    p = 1.0 if v == 0 else R.choice([R.uniform(0.78, 0.95), R.uniform(0.78, 0.95), R.uniform(0.95, 1.12)])
    tempo = 1.0 if v == 0 else R.uniform(0.9, 1.1)
    d = 0 if v == 0 else int(R.uniform(0, a.spread) * 1000)
    vol = a.lead if v == 0 else R.uniform(0.45, 0.9); pan = 0 if v == 0 else R.uniform(-0.8, 0.8)
    l, r = (1 - max(0, pan)), (1 + min(0, pan))
    chains.append(f"[s{v}]rubberband=pitch={p:.3f}:tempo={tempo:.3f},adelay={d},volume={vol:.2f},pan=stereo|c0={l:.2f}*c0|c1={r:.2f}*c0[v{v}]")
    labels.append(f"[v{v}]")
lp = int(9000 - 5000 * a.far); e1, e2 = int(90 + 200 * a.far), int(240 + 400 * a.far)
chains.append("".join(labels) + f"amix=inputs={a.voices}:normalize=0,highpass=f=110,lowpass=f={lp},"
              f"aecho=0.85:0.7:{e1}|{e2}:{0.15 + 0.3 * a.far:.2f}|{0.08 + 0.2 * a.far:.2f},alimiter=limit=0.9,loudnorm=I=-16:TP=-1.5,apad=pad_dur=0.6[out]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(chains), "-map", "[out]", "-ar", "44100", "-b:a", "160k", a.out], check=True)
print("->", a.out)
