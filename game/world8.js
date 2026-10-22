// ---------------------------------------------------------------------------
// World 8, the Valley of Elah: David and Goliath (Glen, 2026-10-21: the fight is here, not in 7-4). Not built yet but
// for its end: Glen's clips cut into one movie scene, like an old action film (tools/make_giant_fall.py ->
// assets/video/giant_fall.mp4). The sling winds up, the stone flies in slow motion, the hit is shown three times
// (two takes over David's shoulder, then the close-up of the face, the helmet cracking), then he falls. The clip is
// muted; the sounds and the music below are timed to it. Then its last frame stays, with the verses.
// To watch it on its own: index.html#giantfall.
// ---------------------------------------------------------------------------
const W8 = {
  FALL_CUES: [   // [seconds into giant_fall.mp4, sound, volume, rate (under 1 is slower and deeper), shake]
    [0.0, "sling_charge", 0.8, 0.9], [1.6, "sling_charge", 0.8, 1.0],   // the sling whirling
    [3.1, "sling_throw", 1, 0.8],                                       // let go
    [3.46, "final_stone_goliath", 1, 0.6],                              // slow: its impact is at 1.7 s, so it lands with the stone (6.3)
    [6.3, "thunder", 0.9, 0.5, 1.4],
    [8.9, "sling_throw_quick", 0.8, 0.5],                               // the replay
    [10.05, "stone_hit", 1, 0.45, 1.1], [10.05, "thunder_2", 0.7, 0.6],
    [12.44, "final_stone", 1, 0.5],                                     // the close-up: its impact (0.8 s) at half speed lands at 14.04
    [14.04, "thunder_3", 0.9, 0.45, 1.6],
    [18.1, "phil_roar", 0.35, 0.7],                                     // the Philistines see him stagger
    [22.45, "thunder", 1, 0.4, 2.2], [22.45, "stone_hit", 1, 0.3],      // he hits the ground
  ],
  FALL_THUDS: [6.3, 10.05, 14.04, 22.45],   // the low thump of the impacts (thud)
  // (Glen) the music: assets/sounds/giant_fall_music.mp3 when he adds it (until then the boss loop, slowed and deeper,
  // FALL_MUSIC_RATE). Its loudness through the scene, [seconds into the clip, volume]: full through the wind-up and the
  // stone's flight, silent on the hit, low under the replays, up again as he staggers, cut dead when he lands.
  FALL_MUSIC_ENV: [[0, 0.9], [6.2, 0.9], [6.35, 0], [8.7, 0], [9.2, 0.4], [17.8, 0.4], [18.2, 1], [22.4, 1], [22.5, 0]],
  FALL_MUSIC_VOL: 1.1,  // times the boss music volume (TUNE.BOSS_MUSIC_VOLUME)
  FALL_MUSIC_RATE: 0.75,
  FALL_HORN: 1.5,       // after the clip ends: Israel's horn (17:52, "the men of Israel and of Judah arose, and shouted")
  FALL_VERSES: [
    "David put his hand in his bag, took a stone, and slung it, and struck the Philistine in his forehead. (1 Samuel 17:49)",
    "So David prevailed over the Philistine with a sling and with a stone. (1 Samuel 17:50)",
    "The LORD doesn't save with sword and spear; for the battle is the LORD's. (1 Samuel 17:47)",
  ],
};

const FALL_CLIP = Object.assign(document.createElement("video"), { src: "../assets/video/giant_fall.mp4?v=" + (window.BUILD || 0), muted: true, playsInline: true, preload: "auto" });
FALL_CLIP.onerror = () => { FALL_CLIP.missing = true; };
const FALL_STILL = Object.assign(new Image(), { src: "../assets/video/giant_fall_last.jpg?v=" + (window.BUILD || 0) });

const FALL_MUSIC = Object.assign(new Audio(`../assets/sounds/giant_fall_music.mp3?v=${window.BUILD || 0}`), { preload: "auto" });
FALL_MUSIC.onerror = () => {   // (until Glen's own track: the boss loop, slowed and deeper)
  if (FALL_MUSIC.fallback) return; FALL_MUSIC.fallback = true;
  FALL_MUSIC.src = `../assets/sounds/boss_loop.mp3?v=${window.BUILD || 0}`; FALL_MUSIC.loop = true;
};
function fallMusicVol(vt) {
  const E = W8.FALL_MUSIC_ENV; let v = E[E.length - 1][1];
  for (let i = 1; i < E.length; i++) if (vt < E[i][0]) { const [t0, v0] = E[i - 1], [t1, v1] = E[i]; v = v0 + (v1 - v0) * (vt - t0) / (t1 - t0); break; }
  return Math.max(0, Math.min(1, v * TUNE.BOSS_MUSIC_VOLUME * W8.FALL_MUSIC_VOL));
}

const giantFall = {
  active: false,
  start(then) {
    Object.assign(this, { active: true, then, state: audioUnlocked ? "clip" : "wait", t: 0, cue: 0, shake: 0, verse: 0, vt: 0, out: 0, horn: false });
    if (typeof hushLoops === "function") hushLoops();
    if (this.state === "clip") this.play();
  },
  play() {
    this.state = "clip"; this.t = 0; this.cue = 0;
    if (FALL_CLIP.missing) { this.state = "still"; return; }
    FALL_CLIP.currentTime = 0; FALL_CLIP.play().catch(() => { this.state = "still"; });
    FALL_MUSIC.currentTime = 0; FALL_MUSIC.volume = fallMusicVol(0);
    if (FALL_MUSIC.fallback) { FALL_MUSIC.playbackRate = W8.FALL_MUSIC_RATE; FALL_MUSIC.preservesPitch = false; }
    FALL_MUSIC.play().catch(() => {});
  },
  update(dt) {
    this.t += dt; this.shake = Math.max(0, this.shake - dt * 2.5);
    if (this.out > 0) { this.out += dt; if (this.out > 0.8) { this.active = false; FALL_CLIP.pause(); FALL_MUSIC.pause(); if (this.then) this.then(); } return; }
    if (this.state === "wait") { if (pressed("a") || pressed("start")) this.play(); return; }   // a tap first, so the sounds can play
    if (this.state === "clip") {
      const vt = FALL_CLIP.currentTime;
      if (FALL_MUSIC.fallback) { FALL_MUSIC.playbackRate = W8.FALL_MUSIC_RATE; FALL_MUSIC.preservesPitch = false; }
      FALL_MUSIC.volume = fallMusicVol(vt); if (FALL_MUSIC.volume === 0 && vt > 22.5) FALL_MUSIC.pause();
      while (this.cue < W8.FALL_CUES.length && W8.FALL_CUES[this.cue][0] <= vt) {
        const [, name, vol, rate, shake] = W8.FALL_CUES[this.cue++];
        sfx(name, undefined, vol, rate); if (shake) this.shake = Math.max(this.shake, shake);
        if (W8.FALL_THUDS.includes(W8.FALL_CUES[this.cue - 1][0]) && typeof thud === "function") thud(1);
      }
      if (FALL_CLIP.ended || this.t > 40 || (this.t > 1 && pressed("start"))) { this.state = "still"; this.t = 0; FALL_CLIP.pause(); FALL_MUSIC.pause(); }
      return;
    }
    if (!this.horn && this.t > W8.FALL_HORN) { this.horn = true; sfx("war_horn", undefined, 0.8); }
    this.vt += dt;
    if (this.vt > 1 && (pressed("a") || pressed("start"))) {
      if (this.verse < W8.FALL_VERSES.length - 1) { this.verse++; this.vt = 0; } else this.out = 0.001;
    }
  },
  draw() {
    const cover = (img, w, h) => { const s = Math.max(W / w, H / h), sx = (Math.random() - 0.5) * 22 * this.shake, sy = (Math.random() - 0.5) * 16 * this.shake, z = 1 + 0.03 * Math.min(1, this.shake);
      ctx.drawImage(img, (W - w * s * z) / 2 + sx, (H - h * s * z) / 2 + sy, w * s * z, h * s * z); };
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    if (this.state === "wait") {
      ctx.save(); ctx.textAlign = "center"; ctx.fillStyle = "#ffe3a0"; ctx.font = "italic 44px Georgia, serif"; ctx.fillText("The Stone", W / 2, H / 2 - 10);
      ctx.fillStyle = "rgba(255,240,215,0.7)"; ctx.font = "18px sans-serif"; ctx.fillText(keyText("Press A"), W / 2, H / 2 + 40); ctx.restore();
      return;
    }
    if (this.state === "clip") { if (FALL_CLIP.videoWidth && FALL_CLIP.readyState >= 2) cover(FALL_CLIP, FALL_CLIP.videoWidth, FALL_CLIP.videoHeight); }
    else if (FALL_STILL.naturalWidth) cover(FALL_STILL, FALL_STILL.naturalWidth, FALL_STILL.naturalHeight);
    if (this.state === "clip") {   // letterbox bars, like a film
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, 54); ctx.fillRect(0, H - 54, W, 54);
    } else {
      const a = Math.min(1, this.t / 1.2);
      ctx.save(); ctx.globalAlpha = a; ctx.textAlign = "center"; drawStoryBox("", W8.FALL_VERSES[this.verse], this.vt > 1 ? keyText("A: next") : "", true); ctx.restore();
    }
    if (this.out > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, this.out / 0.8)})`; ctx.fillRect(0, 0, W, H); }
  },
};

if (location.hash === "#giantfall") giantFall.start(() => backToMap());   // (testing: watch the scene by itself)
