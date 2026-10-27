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
    [0.0, "sling_charge", 0.8, 0.9], [1.6, "sling_charge", 0.8, 1.0], [3.2, "sling_charge", 0.8, 1.05],   // the sling whirling (Glen's longer wind-up)
    [4.95, "sling_throw", 1, 0.8],                                      // let go
    [5.25, "final_stone_goliath", 1, 0.6],                              // slow: its impact is at 1.7 s, so it lands with the stone (8.09)
    [8.09, "thunder", 0.9, 0.5, 1.4],
    [10.69, "sling_throw_quick", 0.8, 0.5],                               // the replay
    [11.84, "stone_hit", 1, 0.45, 1.1], [11.84, "thunder_2", 0.7, 0.6],
    [16.76, "final_stone", 1, 0.5],                                     // the close-up (Glen's forehead take): its impact (0.8 s) at half speed lands at 18.36
    [18.36, "thunder_3", 0.9, 0.45, 1.6],
    [18.89, "phil_roar", 0.35, 0.7],                                     // the Philistines see him stagger
    [23.24, "thunder", 1, 0.4, 2.2], [23.24, "stone_hit", 1, 0.3],      // he hits the ground
    [24.3, "stone_hit", 0.7, 0.35, 0.8],                                 // (Glen) and over onto his back, the dust going up; the clip holds on it
  ],
  FALL_THUDS: [8.09, 11.84, 18.36, 23.24, 24.3],   // the low thump of the impacts (thud)
  // (Glen) the music: assets/sounds/giant_fall_music.mp3 when he adds it (until then the boss loop, slowed and deeper,
  // FALL_MUSIC_RATE). Its loudness through the scene, [seconds into the clip, volume]: full through the wind-up and the
  // stone's flight, silent on the hit, low under the replays, up again as he staggers, cut dead when he lands.
  FALL_MUSIC_ENV: [[0, 0.9], [7.99, 0.9], [8.14, 0], [10.49, 0], [10.99, 0.4], [18.59, 0.4], [18.99, 1], [23.19, 1], [23.29, 0]],
  FALL_MUSIC_VOL: 1.1,  // times the boss music volume (TUNE.BOSS_MUSIC_VOLUME)
  FALL_MUSIC_RATE: 0.75,
  FALL_HORN: 1.5,       // after the clip ends: Israel's horn (17:52, "the men of Israel and of Judah arose, and shouted")
  FALL_VERSES: [
    "David put his hand in his bag, took a stone and slung it, and struck the Philistine in his forehead. (1 Samuel 17:49)",
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
      FALL_MUSIC.volume = fallMusicVol(vt); if (FALL_MUSIC.volume === 0 && vt > W8.FALL_MUSIC_ENV[W8.FALL_MUSIC_ENV.length - 1][0]) FALL_MUSIC.pause();
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

// ===========================================================================
// 8-1 The Valley and 8-2 Goliath (DESIGN 5h; Glen, 2026-10-22: build World 8). The art for his attacks is still to
// came from Glen on 2026-10-22: goliath_thrust (the spear lowered, then the lunge), goliath_slam (the spear lifted, turned
// and driven down), goliath_sweep (the sword across) and goliath_chop (the sword overhead and down), clips in
// david-sling-art/world8/goliath. The javelin is still his goliath_spear sheet (frames 5-9 wind up, 10 throws, 11-19
// point). goliath_roar (head back, roaring at the sky: the opening) and goliath_point (yelling, pointing: his taunts)
// came after, from one clip.
//   setPiece("words8", c)    8-1: past column c, Goliath (standing W8.WORDS_GX tiles on) taunts (17:43-44), and David
//                            answers line by line, one A press each (17:45-47); the last line earns the throw's last
//                            piece (A, faith: DESIGN 4c), then it's straight on to 8-2.
//   setPiece("goliath8", c)  8-2: W8.ARENA columns from c. (Glen, 2026-10-24) A run at him under his spears (17:48):
//                            one at a time and fast, flat (low: jump, high: roll) or, near him, down at where you
//                            stand; stand still and one comes at once. Reach him and he laughs, taunts (17:44), throws
//                            a quick volley up close, then laughs at the sky: his forehead is open and the throw (the
//                            code, from memory) is the stone. Plain stones bounce off his bronze. Then giantFall.
// ===========================================================================
Object.assign(W8, {
  WORDS_GX: 14,          // 8-1: how many tiles past the trigger Goliath stands
  WORDS: [               // David's answer, one A press a line (WEB, with "the LORD"); the last one is the throw's last piece
    "You come to me with a sword, with a spear, and with a javelin;",
    "but I come to you in the name of the LORD of Armies, the God of the armies of Israel, whom you have defied. (1 Samuel 17:45)",
    "Today, the LORD will deliver you into my hand ... that all the earth may know that there is a God in Israel, (1 Samuel 17:46)",
    "and that all this assembly may know that the LORD doesn't save with sword and spear;",
    "for the battle is the LORD's. (1 Samuel 17:47)",
  ],
  FRONT: 52,             // 8-2: px from Goliath's feet to his front (he faces left, toward David)
  // (Glen, 2026-10-24) 8-2 is a run at him under his spears: one spear at a time, fast. Stand still and one finds you.
  // Reach him and he laughs, taunts (17:44), throws a quick volley up close, then laughs at the sky: the throw.
  ARENA: 200,            // columns from the start of the run to the far end (Glen, 2026-10-24: longer; was 110)
  WALK_MAX: 12,          // tiles he walks toward David at most (so the crowd knows where to stand: at the end, where David reaches him)
  REACH_AT: 8,           // tiles from his front: David has made it to him (the laugh, the taunt, the volley)
  WALK: 42,              // px/s he comes on between throws (17:48: "the Philistine arose, and walked and came near")
  TELL: { charge: 0.42, volley: 0.34 },   // seconds he shows each throw: the spear lowered = flat, raised = down at you
  COUNSEL: 1.3,          // after a loss (Shammah's counsel): tells this much longer, and the throw's time doubled
  GAP: 0.22,             // seconds after one spear has passed David before he starts the next (only one coming at a time)
  STILL: 0.6,            // seconds standing still before he throws at you at once
  VOLLEY: 4,             // spears in the close-up volley before he laughs at the sky
  ONES: 31,              // The Ones in the game, one a stage but 8-2 (the duel): all of them opens the secret ending
  VOLLEY_AGAIN: 6,       // after a missed throw: he laughs, and this many before he opens up again
  SPEED: 2000,           // px/s, every spear (Glen, 2026-10-24: faster; was 1500)
  PACE: 1,               // THE KNOB: how quick his spears come, all at once (their speed, the tells, the gaps, his walk). 1.2 = 20% quicker
                         // (Easy x0.85 and Hard x1.2 on top: main.js DIFFICULTY spear)
  LOW_Y: 24,             // px off the ground of a low flat spear: jump it
  HIGH_Y: 86,            // px off the ground of a high one, at his shoulders: roll under it (David stands 96 px, rolls 64)
  DIAG_RANGE: 22,        // tiles: nearer than this he also throws down at where you stand
  JAV_R: 40,             // px from where a downward spear lands that it hurts
  SPEAR_SHEET_LEN: 450,  // the thrown spear's length, in goliath_spear sheet pixels (so it matches the one he holds)
  SPEAR_SINK: 22,        // px of the tip buried in the ground once it lands
  OVER_HAND: [173, 267], // Glen's overhead throw (goliath_overhead, 2026-10-24): his hand in frame 15, the moment it leaves (px in front of / above his feet)
  OVER_REL: 15,          // its frames: 0-14 the wind-up (spear behind his head, then forward), 15 it's gone, 15-17 the follow-through
  JAV_HAND: [172, 293],  // his throwing hand in goliath_spear frame 11 (sheet px in front of / above his feet): the downward spear leaves from there
  CODE_TIME: 5,          // seconds to enter the throw at the opening...
  CODE_PER_STONE: 0.1,   // ...plus this much for every stone of remembrance saved (DESIGN 3f)
  SIZE: 1.55,            // Goliath (as in 7-4)
  CLIP_SIZE: 1.66,       // Glen's 2026-10-22 attack sheets against goliath_yell (standing 240 px vs 401 in the sheets)
});

// ---- 8-1: the words before the fight ----
const words8Piece = setPieces.find(p => p.kind === "words8");
const words8 = words8Piece ? { x: words8Piece.c * T, gx: (words8Piece.c + W8.WORDS_GX) * T, state: "far", t: 0, line: -1, lt: 0 } : null;
const w8Busy = () => !!(words8 && words8.state !== "far" && words8.state !== "done") || !!(g8 && g8.on && (g8.state === "open" || g8.state === "thrown"));
const shake8 = v => { if (typeof w2Shake !== "undefined") w2Shake.v = Math.max(w2Shake.v, v); };
function clear8() {   // a World 8 stage done (no sheepfold out here)
  hushLoops(true);
  const stones = specials.filter(o => o.taken).length;
  saveStones(LEVEL_STAGE, stones);
  stageCleared(LEVEL_STAGE, { sheep: foundCount(), total: lostCount(), one: line.some(sh => sh.one), stones, olives: david.olives, lampOil: david.lampOil, gathered: david.gathered });
}
function updateWords8(dt) {
  const w = words8, d = david; if (!w) return;
  w.t += dt; w.lt += dt;
  if (w.state === "far") {
    if (d.x > w.x && d.deadT <= 0) {
      Object.assign(w, { state: "taunt", t: 0, holdX: d.x }); d.vx = 0; setState("idle"); d.facing = 1;
      thud(1); shake8(1.2);   // he plants his spear: the ground shakes
      if (typeof giantDrone !== "undefined") { giantDrone.k = 1; giantDrone.start(); }
      sayLine("Goliath", "Am I a dog, that you come to me with sticks? (1 Samuel 17:43)"); goliathChain(["hakelev"], 0.8);
    }
    return;
  }
  if (w.state === "done") return;
  d.x = w.holdX; d.vx = 0;   // David stands his ground
  if (w.state === "taunt" && !dialog.hold && w.t > 0.5) {
    w.state = "taunt2"; w.t = 0; thud(0.8); shake8(0.8);
    sayLine("Goliath", "Come to me, and I will give your flesh to the birds of the sky and to the animals of the field. (1 Samuel 17:44)"); goliathChain(["lecha_elai"], 0.8);
  } else if (w.state === "taunt2" && !dialog.hold && w.t > 0.5) {
    w.state = "answer"; w.t = 0; w.line = -1; w.lt = 0;
  } else if (w.state === "answer" && w.t > 0.35 && (w.line < 0 || w.lt > 0.7) && pressed("a")) {
    w.line++; w.lt = 0; chime(4 + w.line * 2);
    if (w.line === W8.WORDS.length - 1) {   // "for the battle is the LORD's": the Israelite slope roars
      w.state = "roar"; w.t = 0;
      setTimeout(() => { sfx("phil_roar", undefined, 0.9, 1.12); sfx("war_horn", undefined, 0.7); }, 600);
    }
  } else if (w.state === "roar" && w.t > 2.4 && !w.told) {
    w.told = true;
    try { const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); p.throwFaith = true; localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); } catch (e) {}
    toast("The last piece of the throw: A. Faith. \"The battle is the LORD's.\"");
  } else if (w.state === "roar" && w.t > 6.5) {
    w.state = "done";
    if (typeof giantDrone !== "undefined") giantDrone.stop(2);
    clear8();
    setTimeout(() => startStage("8-2"), 800);   // straight into the duel
  }
}
function drawWords8(camX) {
  const w = words8; if (!w || !SPR.goliath_yell) return;
  const x = w.gx - camX; if (x < -300 || x > W + 300) return;
  const yell = w.state === "taunt" || w.state === "taunt2" || (dialog.t > 0 && dialog.who === "Goliath");
  if (SPR.goliath_point) {   // (Glen's yell-and-point clip) he lifts his arm and points at David as he shouts; then keeps shouting
    const f = !yell ? 0 : w.t < 1.4 ? Math.min(7, Math.floor(w.t / 0.18)) : 5 + Math.floor(performance.now() / 160) % 3;
    drawSprite("goliath_point", f, x, GR * T, -1, W8.SIZE * W8.CLIP_SIZE); return;
  }
  drawSprite("goliath_yell", yell ? frameOf("goliath_yell", performance.now() / 1000) : 0, x, GR * T, -1, W8.SIZE);
}
function drawWords8Over() {   // David's answer, big across the valley, line by line
  const w = words8; if (!w || (w.state !== "answer" && w.state !== "roar")) return;
  ctx.save(); ctx.textAlign = "center";
  const band = ctx.createLinearGradient(0, 90, 0, 330); band.addColorStop(0, "rgba(10,6,2,0)"); band.addColorStop(0.5, "rgba(10,6,2,0.68)"); band.addColorStop(1, "rgba(10,6,2,0)");
  ctx.fillStyle = band; ctx.fillRect(0, 90, W, 240);
  const wrap = (text, font, maxW) => { ctx.font = font; const out = []; let cur = ""; for (const wd of text.split(" ")) { const t2 = cur ? cur + " " + wd : wd; if (ctx.measureText(t2).width > maxW && cur) { out.push(cur); cur = wd; } else cur = t2; } out.push(cur); return out; };
  if (w.line >= 0) {
    const last = w.line === W8.WORDS.length - 1, f = Math.min(1, w.lt / 0.5);
    const m = W8.WORDS[w.line].match(/^(.*?)\s*(\((?:1 Samuel)[^)]*\))?$/), text = m[1], ref = m[2] || "";   // the reference goes on its own line, small
    const font = last ? "italic bold 52px Georgia, serif" : "italic 32px Georgia, serif", rows = wrap(text, font, W - 400), lh = last ? 60 : 40, y0 = 205 - (rows.length - 1) * lh / 2 + (1 - f) * 8;
    ctx.globalAlpha = f; ctx.fillStyle = last ? "#ffe3a0" : "#fff4dc"; ctx.shadowColor = last ? "rgba(255,170,40,0.9)" : "rgba(0,0,0,0.8)"; ctx.shadowBlur = last ? 22 : 8;
    rows.forEach((r, i) => ctx.fillText(r, W / 2, y0 + i * lh));
    if (ref) { ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 6; ctx.font = "italic 20px Georgia, serif"; ctx.fillStyle = "#fff0d4"; ctx.fillText(ref, W / 2, y0 + (rows.length - 1) * lh + (last ? 40 : 30)); }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  }
  if (w.state === "answer") {   // (Glen, 2026-10-27: the name and the A were too faint to read over the bright sky)
    const pill = (txt, y, font, fg, bg) => {
      ctx.font = font; const tw = ctx.measureText(txt).width + 36;
      ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(W / 2 - tw / 2, y - 24, tw, 36, 18); ctx.fill();
      ctx.fillStyle = fg; ctx.fillText(txt, W / 2, y + 2);
    };
    pill("David", 116, "bold 22px Georgia, serif", "#ffd27a", "rgba(20,12,4,0.72)");
    const pulse = 0.8 + 0.2 * Math.sin(performance.now() / 250);
    pill(keyText(w.line < 0 ? "Answer him. Press A." : "A: next"), 340, "bold 22px sans-serif", `rgba(255,236,190,${pulse})`, "rgba(20,12,4,0.72)");
  }
  ctx.restore(); ctx.textAlign = "left";
}

// ---- 8-2: the duel ----
const g8Piece = setPieces.find(p => p.kind === "goliath8");
const g8 = g8Piece ? { a0: g8Piece.c * T, a1: (g8Piece.c + W8.ARENA) * T, counsel: false, smooth: 5, phase: 1 } : null;
const goliathFight = () => !!(g8 && g8.on && !g8.won);
const G8_MUSIC = Object.assign(new Audio(`../assets/sounds/music_8_stone.mp3?v=${window.BUILD || 0}`), { loop: true, preload: "auto" });   // Glen's "The One Stone" (2026-10-23; his war horns, goliath_theme, before it: they stay in 7-4)
function resetG8() {
  Object.assign(g8, { on: false, won: false, state: "charge", t: 0, x: g8.a1 - 6 * T, atk: null, tellT: 0, jav: null, past: [], stuck: [], relT: 9, relKind: null,
                      thrown: 0, nextAt: 1.4, callout: null, code: null, flash: 0, walkT: 0, stillT: 0, lastAtk: null });
}
if (g8) resetG8();
const g8Front = () => g8.x - W8.FRONT;
const g8Pace = () => W8.PACE * (DIFF.spear || 1);
const g8Tell = () => W8.TELL[g8.state === "volley" ? "volley" : "charge"] * (g8.counsel ? W8.COUNSEL : 1) / g8Pace();
const g8SpearK = () => SCALE * W8.SIZE * (TUNE.SPRITE_SIZE.goliath_spear || 1);   // goliath_spear sheet px -> world px
function g8Met(who) {   // the people who call out warnings: only the ones you met (DESIGN 5h)
  const p = loadProgress(), c = id => !!(p[id] && p[id].cleared);
  return { Hanan: c("1-1"), Gera: c("4-2"), Tobi: c("5-1"), Abinadab: c("6-1"), Shammah: c("7-3") }[who];
}
function g8Call(who, line) { if (g8Met(who)) g8.callout = { who, line, t: 1.2 }; }
function stonesSavedAll() { return typeof stonesFound === "function" ? [1, 2, 3, 4, 5, 6, 7].reduce((n, w) => n + stonesFound(w), 0) : 0; }
function startG8() {
  g8.on = true; g8.t = 0;
  if (!g8.bonus && !TRIAL) {   // the stones of remembrance you saved (not in the Shepherd's Trial): longer to make the throw (DESIGN 3f)
    g8.bonus = true; const n = stonesSavedAll();   // (Glen, 2026-10-24: no extra hearts any more, just the ones you came with)
    if (n) setTimeout(() => toast(`${n} stone${n === 1 ? "" : "s"} of remembrance: a steadier hand for the throw.`), 5200);
  }
  G8_MUSIC.currentTime = 0; G8_MUSIC.volume = Math.min(1, TUNE.BOSS_MUSIC_VOLUME * 1.1); G8_MUSIC.play().catch(() => {});
  thud(1); shake8(1.2);
  sayLine("", "When the Philistine arose, and walked and came near to meet David, David hurried and ran toward the army to meet the Philistine. (1 Samuel 17:48)");
  setTimeout(() => toast("Run at him and don't stop. Jump the low spears, roll under the high ones, and never stand still."), 400);
}
function g8Hurt() { if (david.inv <= 0 && david.deadT <= 0) hurtDavid(g8.x); }
function g8Set(s) { g8.state = s; g8.t = 0; }
function g8Pick() {   // a flat spear, low (jump it) or high (roll under it); near enough, one thrown down at where you stand
  const near = g8Front() - david.x < W8.DIAG_RANGE * T;
  if (near && g8.stillT > W8.STILL) return "down";   // standing still: he throws right at you
  const opts = near ? ["low", "high", "down"] : ["low", "high"];
  let a = opts[Math.floor(Math.random() * opts.length)];
  if (a === g8.lastAtk && Math.random() < 0.5) a = opts[Math.floor(Math.random() * opts.length)];   // not too often the same twice
  return a;
}
function g8Attack(atk) {
  g8.atk = atk; g8.lastAtk = atk; g8.tellT = 0;
  if (atk === "low") g8Call("Shammah", "Low! Jump!");
  if (atk === "high") g8Call("Hanan", "High! Roll under it!");
  if (atk === "down") g8Call("Tobi", "Keep moving!");
}
const g8Passed = j => !j || j.x < david.x - 80;   // the spear in the air is behind David now: the next can come
function g8Throw(kind) {   // the spear leaves his hand: flat from his front, or down from over his head at where David is
  const d = david, k = g8SpearK(), L = W8.SPEAR_SHEET_LEN * k;
  if (g8.jav) g8.past.push(g8.jav);   // (the last one flies on behind him, harmless)
  if (kind === "down") {
    const over = !!SPR.goliath_overhead, hk = over ? SCALE * W8.SIZE * W8.CLIP_SIZE * (TUNE.SPRITE_SIZE.goliath_overhead || 1) : k, H8 = over ? W8.OVER_HAND : W8.JAV_HAND;
    const hx = g8.x - H8[0] * hk, hy = GR * T - H8[1] * hk, a = Math.atan2(GR * T - 6 - hy, Math.min(-1, d.x - hx));
    g8.jav = { kind, x: hx + Math.cos(a) * L * 0.6, y: hy + Math.sin(a) * L * 0.6, a, tx: d.x, t: 0 };   // (x, y: its point)
    g8.jav.y0 = g8.jav.y;
  } else g8.jav = { kind, x: g8Front() - 10, y: GR * T - (kind === "low" ? W8.LOW_Y : W8.HIGH_Y), a: Math.PI, t: 0 };
  g8.relT = 0; g8.relKind = kind; g8.thrown++;
  sfx("arrow_single", g8.x, 0.9, 0.6); sfx("sling_throw_quick", g8.x, 0.7, 0.45);   // the whoosh of it, deep
}
function g8SpearHits(j) {   // does the spear's shaft (its front half) cross David?
  const d = david, L = W8.SPEAR_SHEET_LEN * g8SpearK();
  const x0 = d.x - BODY_W / 2, x1 = d.x + BODY_W / 2, y0 = d.y - d.h, y1 = d.y;
  for (let s = 0; s <= L * 0.55; s += 10) {
    const px = j.x - Math.cos(j.a) * s, py = j.y - Math.sin(j.a) * s;
    if (px > x0 && px < x1 && py > y0 && py < y1) return true;
  }
  return false;
}
function updateSpear8(dt) {   // the one spear in the air, and the ones stuck in the ground
  for (let i = g8.stuck.length - 1; i >= 0; i--) if ((g8.stuck[i].t += dt) > 2.5) g8.stuck.splice(i, 1);
  for (let i = g8.past.length - 1; i >= 0; i--) {
    const p = g8.past[i]; p.x += Math.cos(p.a) * W8.SPEED * g8Pace() * dt; p.y += Math.sin(p.a) * W8.SPEED * g8Pace() * dt;
    if (p.kind === "down" && p.y >= GR * T - 6) { g8.stuck.push({ x: p.x, a: p.a, t: 0 }); g8.past.splice(i, 1); }
    else if (p.x < camX - 200 || p.x < g8.a0 - 200) g8.past.splice(i, 1);
  }
  const j = g8.jav; if (!j) return;
  const v = W8.SPEED * g8Pace();
  j.t += dt; j.x += Math.cos(j.a) * v * dt; j.y += Math.sin(j.a) * v * dt;
  if (g8SpearHits(j)) { g8Hurt(); g8.jav = null; return; }
  if (j.kind === "down" && j.y >= GR * T - 6) {   // into the ground where David was standing
    thud(0.5); sfx("arrow_with_stick-to-target", j.x, 0.8, 0.6);
    if (Math.abs(david.x - j.x) < W8.JAV_R && david.y > GR * T - 90) g8Hurt();
    g8.stuck.push({ x: j.x, a: j.a, t: 0 }); g8.jav = null;
  } else if (j.x < camX - 200 || j.x < g8.a0 - 200) g8.jav = null;   // a flat one, gone past
}
function g8Code() {   // the throw, as far as you know it (DESIGN 4c), and A (faith) from 8-1
  const learned = typeof throwLearned === "function" ? throwLearned() : 0, n = THROW_PIECE_LEN.slice(0, Math.min(7, learned)).reduce((a, b) => a + b, 0);
  let faith = false; try { faith = !!JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}").throwFaith; } catch (e) {}
  const code = THROW_CODE.slice(0, n).concat(faith ? ["a"] : []);
  return code.length ? code : ["a"];
}
function updateGoliath8(dt) {
  if (!g8) return;
  const d = david;
  if (!g8.on && !g8.won && d.x > g8.a0 + 2 * T && d.deadT <= 0) startG8();
  if (!g8.on || g8.won) { if (g8.won && g8.state === "thrown") g8.t += dt; return; }
  if (d.deadT > 0) {   // David fell: the fight starts over; Shammah's counsel from the slope
    resetG8(); G8_MUSIC.pause();
    if (!g8.counsel && !TRIAL) { g8.counsel = true; setTimeout(() => sayLine("Shammah", "Come here. Tell me what happened. ... Don't stop running: stand still and he'll find you. He shows you every spear first. Lowered, it comes flat: low, jump it; high, roll under it. Over his head, it comes down at you: keep moving. You've got longer than you think."), 1600); }
    return;
  }
  g8.t += dt; g8.flash = Math.max(0, g8.flash - dt); g8.relT += dt;
  if (g8.callout && (g8.callout.t -= dt) <= 0) g8.callout = null;
  if (d.x > g8Front() - 14) { d.x = g8Front() - 14; if (d.vx > 0) d.vx = 0; }   // he's a wall of bronze: no walking through him
  if (d.x < g8.a0 + 16) d.x = g8.a0 + 16;
  g8.stillT = d.onGround && Math.abs(d.vx) < 40 ? g8.stillT + dt : 0;
  updateSpear8(dt);
  if (g8.state === "charge" && g8Front() - d.x < W8.REACH_AT * T && g8Passed(g8.jav)) {   // David made it to him: he laughs (a throw he was showing, he holds)
    g8.atk = null; g8Set("laugh"); thud(0.8); shake8(0.8); sfx("taunting_yells", g8.x, 0.8, 0.6);
  }
  if (g8.state === "charge" || g8.state === "volley") {   // his spears, one at a time
    if (g8.atk) { if ((g8.tellT += dt) >= g8Tell()) { g8Throw(g8.atk); g8.atk = null; g8.nextAt = W8.GAP / g8Pace(); } }
    else if (g8Passed(g8.jav)) {
      if (g8.stillT > W8.STILL && g8.state === "charge") g8.nextAt = Math.min(g8.nextAt, 0);
      if ((g8.nextAt -= dt) <= 0) {
        if (g8.state === "volley" && g8.thrown >= g8.volleyN) g8Set("roar");
        else g8Attack(g8Pick());
      }
    }
  }
  if (g8.state === "charge") {
    if (!g8.atk && g8.relT > 0.5 && g8Front() - d.x > (W8.REACH_AT + 3) * T) { g8.x = Math.max(g8.a1 - (6 + W8.WALK_MAX) * T, g8.x - W8.WALK * g8Pace() * dt); g8.walkT += dt; }   // he comes on, slowly
  } else if (g8.state === "laugh") {
    if (g8.t > 1.5) {   // and taunts (the stage waits on the words)
      g8Set("taunt");
      sayLine("Goliath", "Come to me, and I will give your flesh to the birds of the sky and to the animals of the field. (1 Samuel 17:44)"); goliathChain(["lecha_elai"], 0.8);
    }
  } else if (g8.state === "taunt") {
    if (g8.t > 0.4 && !dialog.hold) { g8Set("volley"); g8.thrown = 0; g8.volleyN = W8.VOLLEY; g8.nextAt = 0.3; }
  } else if (g8.state === "roar") {   // he throws his head back and laughs at the sky. His forehead is open.
    if (!g8.roared) { g8.roared = true; sfx("taunting_yells", g8.x, 0.9, 0.55); goliathChain(["lamah"], 0.9); thud(1); shake8(1.4); G8_MUSIC.volume = Math.min(1, TUNE.BOSS_MUSIC_VOLUME * 0.5); }
    if (g8.t > 1.3) {
      g8Set("open"); g8.roared = false;
      g8.code = { seq: g8Code(), got: 0, t: (W8.CODE_TIME + stonesSavedAll() * W8.CODE_PER_STONE) * (g8.counsel ? 2 : 1), result: null };
      d.vx = 0; d.facing = 1; setState("idle"); sfx("sling_charge", d.x, 0.8, 0.8);
      if (!W8.codeTold) { W8.codeTold = true; toast("His forehead is open! The throw: enter it from memory."); }
    }
  } else if (g8.state === "open") {
    const c = g8.code; d.vx = 0;
    if (!c.result) {
      c.t -= dt;
      for (const b of ["up", "down", "left", "right", "a", "b"]) if (pressed(b)) {
        if (b === c.seq[c.got]) { c.got++; chime(c.got); }
        else { c.got = b === c.seq[0] ? 1 : 0; sfx("stone_hit", d.x, 0.4, 1.6); }
        break;
      }
      if (c.got >= c.seq.length) { c.result = "hit"; g8Set("thrown"); sfx("sling_throw", d.x, 1, 0.8); g8.flash = 0.6; G8_MUSIC.pause(); }
      else if (c.t <= 0) { c.result = "miss"; g8Set("miss"); sfx("sling_throw", d.x, 0.8); }
    }
  } else if (g8.state === "thrown") {   // the stone: then the slow-motion scene (giantFall), then the map
    if (g8.t > 0.7 && !TRIAL) { g8.won = true; giantFall.start(() => abnerScene.start(() => { clear8(); backToMap(); })); }   // the fall, then Saul's tent (17:55-58)
  } else if (g8.state === "miss") {   // the stone flies wide: he laughs, and throws again; one of the five is gone
    if (!g8.missed) {
      g8.missed = true; g8.smooth = Math.max(1, g8.smooth - 1);
      sfx("taunting_yells", undefined, 0.7, 0.6); G8_MUSIC.volume = Math.min(1, TUNE.BOSS_MUSIC_VOLUME * 1.1);
      toast(`It flies wide. He laughs, and the spears come again. (${g8.smooth} smooth stone${g8.smooth === 1 ? "" : "s"} left. Live through them and he'll open up again.)`);
    }
    if (g8.t > 1.6) { g8.missed = false; g8.code = null; g8Set("volley"); g8.thrown = 0; g8.volleyN = W8.VOLLEY_AGAIN; g8.nextAt = 0.3; }
  }
}
function stoneHitsGoliath8(s) {   // plain stones: clang off his bronze, sparks, nothing more
  if (!g8 || !g8.on || g8.won) return false;
  if (g8.jav) {   // a stone can knock the spear aside in the air (anywhere along its front half)
    const j = g8.jav, Ls = W8.SPEAR_SHEET_LEN * g8SpearK();
    for (let q = 0; q <= Ls * 0.55; q += 14) {
      const px = j.x - Math.cos(j.a) * q, py = j.y - Math.sin(j.a) * q;
      if (Math.hypot(s.x - px, s.y - py) < 30) { if (typeof sbSparks === "function") sbSparks(px, py, 10, true); sfx("stone_hit", px, 0.9, 1.4); g8.jav = null; if (!W8.knockTold) { W8.knockTold = true; toast("Knocked it aside!"); } return true; }
    }
  }
  if (Math.abs(s.x - g8.x) < 60 && s.y > GR * T - 300 && s.y < GR * T) {
    if (typeof sbSparks === "function") sbSparks(s.x, s.y, 6, false);
    sfx("stone_hit", s.x, 0.6, 1.7); sfx("stone_hit", s.x, 0.35, 2.4);   // clang
    if (!W8.clangTold) { W8.clangTold = true; toast("It just clangs off his bronze. Only one stone will end this."); }
    return true;
  }
  return false;
}
function drawSpear8(x, y, a, alpha = 1) {   // Glen's spear, its point at (x, y) on screen, pointing along angle a
  const img = ITEM.spear_goliath, L = W8.SPEAR_SHEET_LEN * g8SpearK();
  const cx = x - Math.cos(a) * L / 2, cy = y - Math.sin(a) * L / 2;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(cx, cy);
  if (img && img.naturalWidth) {   // (assets/items/spear_goliath.png: drawn on a slant, tip at the top right)
    const ia = Math.atan2(-img.naturalHeight, img.naturalWidth), k = L / Math.hypot(img.naturalWidth, img.naturalHeight);
    ctx.rotate(a - ia); ctx.drawImage(img, -img.naturalWidth * k / 2, -img.naturalHeight * k / 2, img.naturalWidth * k, img.naturalHeight * k);
  } else {   // (until the picture loads)
    ctx.rotate(a); ctx.strokeStyle = "#5a3a1c"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-L / 2, 0); ctx.lineTo(L / 2 - 24, 0); ctx.stroke();
    ctx.fillStyle = "#9aa3ad"; ctx.beginPath(); ctx.moveTo(L / 2 - 24, -6); ctx.lineTo(L / 2, 0); ctx.lineTo(L / 2 - 24, 6); ctx.fill();
  }
  ctx.restore();
}
function drawGoliath8(camX) {
  if (!g8) return;
  const x = g8.x - camX, now = performance.now() / 1000, fl = g8.flash > 0 ? "brightness(1.8)" : "";
  for (const s of g8.stuck) drawSpear8(s.x - camX + Math.cos(s.a) * W8.SPEAR_SINK, GR * T + Math.sin(s.a) * W8.SPEAR_SINK - 6, s.a, Math.min(1, (2.5 - s.t) / 0.5));   // stuck in the ground
  for (const p of g8.past) drawSpear8(p.x - camX, p.y, p.a);
  const j = g8.jav;
  if (j) {
    if (j.kind === "down") {   // its shadow on the ground where it will land
      const p = Math.min(1, Math.max(0, (j.y - j.y0) / Math.max(1, GR * T - 6 - j.y0)));
      ctx.fillStyle = `rgba(0,0,0,${0.15 + 0.35 * p})`; ctx.beginPath(); ctx.ellipse(j.tx - camX, GR * T - 2, 16 + 26 * p, 5 + 3 * p, 0, 0, Math.PI * 2); ctx.fill();
    }
    const Ls = W8.SPEAR_SHEET_LEN * g8SpearK(), tx = j.x - camX - Math.cos(j.a) * Ls * 0.8, ty = j.y - Math.sin(j.a) * Ls * 0.8;   // a streak behind it, so it can be seen coming
    const ex = tx - Math.cos(j.a) * 220, ey = ty - Math.sin(j.a) * 220, gr = ctx.createLinearGradient(tx, ty, ex, ey);
    gr.addColorStop(0, "rgba(255,244,214,0.75)"); gr.addColorStop(1, "rgba(255,244,214,0)");
    ctx.save(); ctx.strokeStyle = gr; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(j.x - camX - Math.cos(j.a) * 30, j.y - Math.sin(j.a) * 30); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
    drawSpear8(j.x - camX, j.y, j.a);
  }
  if (g8.atk && (g8.state === "charge" || g8.state === "volley")) {   // the tell, so every spear can be read: how high it will come, or where it will land
    const p = Math.min(1, g8.tellT / g8Tell()), pulse = 0.55 + 0.45 * Math.sin(now * 22);
    ctx.save();
    if (g8.atk === "down") {   // a ring on the ground where David is standing
      ctx.strokeStyle = `rgba(255,90,60,${0.5 + 0.5 * p * pulse})`; ctx.fillStyle = `rgba(255,80,50,${0.2 + 0.2 * p})`; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.ellipse(david.x - camX, GR * T - 4, 40 - 12 * p, 11 - 3 * p, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else {   // a streak at the height it will fly, from his front (or the edge of the screen, if he's off it)
      const y = GR * T - (g8.atk === "low" ? W8.LOW_Y : W8.HIGH_Y), x1 = Math.min(W - 6, g8Front() - camX), x0 = x1 - 90 - 70 * p;
      const gr = ctx.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, "rgba(255,120,60,0)"); gr.addColorStop(1, `rgba(255,150,70,${0.5 + 0.45 * pulse})`);
      ctx.fillStyle = gr; ctx.fillRect(x0, y - 4, x1 - x0, 8);
      if (g8Front() - camX > W) { ctx.fillStyle = `rgba(255,150,70,${0.6 + 0.4 * pulse})`; ctx.beginPath(); ctx.moveTo(W - 6, y - 14); ctx.lineTo(W - 30, y); ctx.lineTo(W - 6, y + 14); ctx.fill(); }
    }
    ctx.restore();
  }
  if (!SPR.goliath_yell) return;
  if (!g8.on && !g8.won) { drawSprite("goliath_yell", 0, x, GR * T, -1, W8.SIZE); return; }
  const C = W8.SIZE * W8.CLIP_SIZE, spear = f => drawSprite("goliath_spear", f, x, GR * T, -1, W8.SIZE, 1, fl);
  const tellP = g8.atk ? Math.min(1, g8.tellT / g8Tell()) : 1, flat = k => k === "low" || k === "high";
  if (g8.atk && flat(g8.atk) && SPR.goliath_thrust)   // the spear lowered, drawn back: it will come flat
    drawSprite("goliath_thrust", Math.min(5, Math.floor(tellP * 6)), x, GR * T, -1, C, 1, fl);
  else if (g8.atk === "down" && SPR.goliath_overhead)   // (Glen's overhead throw) the spear back behind his head, then forward: it will come down at you
    drawSprite("goliath_overhead", Math.min(W8.OVER_REL - 1, Math.floor(tellP * W8.OVER_REL)), x, GR * T, -1, C, 1, fl);
  else if (g8.atk === "down" && SPR.goliath_spear) spear(5 + Math.min(5, Math.floor(tellP * 5.99)));
  else if (g8.relT < 0.35 && flat(g8.relKind) && SPR.goliath_thrust) {   // the lunge as it leaves his hand
    const n = SPR.goliath_thrust.frames; drawSprite("goliath_thrust", Math.min(n - 1, 6 + Math.floor(g8.relT / 0.35 * (n - 6))), x, GR * T, -1, C, 1, fl);
  } else if (g8.relT < 0.6 && g8.relKind === "down" && SPR.goliath_overhead)   // his hand empty, following through
    drawSprite("goliath_overhead", Math.min(SPR.goliath_overhead.frames - 1, W8.OVER_REL + Math.floor(g8.relT / 0.15)), x, GR * T, -1, C, 1, fl);
  else if (g8.relT < 1.0 && g8.relKind === "down" && SPR.goliath_spear) spear(11 + Math.min(8, Math.floor(g8.relT * 8)));
  else if ((g8.state === "roar" || g8.state === "open") && SPR.goliath_roar)   // (Glen) his head thrown back, laughing at the sky: the forehead open
    drawSprite("goliath_roar", g8.state === "roar" && g8.t < 0.6 ? Math.floor(g8.t / 0.2) : 3 + Math.floor(now * 4) % 5, x, GR * T, -1, C, 1, fl);
  else if ((g8.state === "laugh" || g8.state === "taunt" || g8.state === "miss") && SPR.goliath_point)   // he points at David and laughs
    drawSprite("goliath_point", g8.t < 1.0 && g8.state !== "taunt" ? Math.min(7, Math.floor(g8.t / 0.12)) : 5 + Math.floor(now * 6) % 3, x, GR * T, -1, C, 1, fl);
  else if (g8.state === "charge" && SPR.goliath_walk && g8.walkT > 0 && g8.relT > 0.5 && g8Front() - david.x > (W8.REACH_AT + 3) * T) drawSprite("goliath_walk", frameOf("goliath_walk", g8.walkT), x, GR * T, -1, W8.SIZE, 1, fl);
  else drawSprite("goliath_yell", 0, x, GR * T, -1, W8.SIZE, 1, fl);
  if (g8.state === "roar" || g8.state === "open") {   // his forehead, open under the helmet's edge
    const hx = x + W8.BROW[0], hy = GR * T - W8.BROW[1], r = 14 + 6 * Math.sin(now * 6);
    const gl = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 2.4); gl.addColorStop(0, "rgba(255,240,180,0.85)"); gl.addColorStop(1, "rgba(255,200,80,0)");
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = gl; ctx.fillRect(hx - r * 3, hy - r * 3, r * 6, r * 6); ctx.restore();
    ctx.save(); ctx.strokeStyle = `rgba(255,214,90,${0.6 + 0.4 * Math.sin(now * 8)})`; ctx.lineWidth = 3; ctx.shadowColor = "rgba(255,200,60,0.9)"; ctx.shadowBlur = 12;   // a target ring, so it can't be missed
    ctx.beginPath(); ctx.arc(hx, hy, 16 + 4 * Math.sin(now * 8), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  if (typeof drawSbSparks === "function") drawSbSparks(camX);
}
TUNE.SPRITE_SIZE.goliath_overhead = 0.64;   // (cut at 375 px tall; his other attack sheets are 240: this matches them)
Object.assign(W8, { BROW: [-2, 242] });   // px from his feet: his forehead (fit to the art)
function drawGoliath8Over() {   // how far to him (17:48), the five stones, the callouts, and the throw
  if (!g8 || !g8.on || g8.won) return;
  ctx.save(); ctx.textAlign = "center";
  const bw = 360, bx = W / 2 - bw / 2, by = 54, run = g8.state === "charge";
  const full = (W8.ARENA - 8 - W8.REACH_AT) * T, k = run ? 1 - Math.min(1, Math.max(0, (g8Front() - david.x - W8.REACH_AT * T) / full)) : 1;
  ctx.fillStyle = "rgba(20,12,6,0.7)"; ctx.beginPath(); ctx.roundRect(bx - 12, by - 26, bw + 24, 58, 10); ctx.fill();
  ctx.fillStyle = "#e9dcc4"; ctx.font = "14px sans-serif";
  ctx.fillText(run ? "Run toward him  (1 Samuel 17:48)" : ["roar", "open", "thrown"].includes(g8.state) ? "One stone" : "He laughs at you. Stay on your feet.", W / 2, by - 8);
  if (g8.state === "volley") {   // the spears still to come, up close
    for (let i = 0; i < g8.volleyN; i++) { ctx.fillStyle = i < g8.thrown ? "rgba(255,255,255,0.2)" : "#ffd27a"; ctx.beginPath(); ctx.arc(W / 2 + (i - (g8.volleyN - 1) / 2) * 22, by + 8, 6, 0, Math.PI * 2); ctx.fill(); }
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fillRect(bx, by, bw, 10);
    ctx.fillStyle = k > 0.92 ? "#ffd27a" : "#c9a46a"; ctx.fillRect(bx, by, bw * k, 10);
  }
  // the five smooth stones (World 7), bottom left
  for (let i = 0; i < 5; i++) { ctx.globalAlpha = i < g8.smooth ? 1 : 0.25; drawItem("pick_round", 34 + i * 30, H - 34, 26 / 320); }
  ctx.globalAlpha = 1;
  if (g8.callout) {   // someone you met, calling from the slope
    const c = g8.callout;
    ctx.globalAlpha = Math.min(1, c.t / 0.3); ctx.fillStyle = "rgba(28,18,8,0.85)"; ctx.beginPath(); ctx.roundRect(40, 110, 380, 58, 12); ctx.fill();
    ctx.textAlign = "left"; ctx.fillStyle = "#ffd98a"; ctx.font = "bold 16px sans-serif"; ctx.fillText(c.who, 56, 133);
    ctx.fillStyle = "#fff6e2"; ctx.font = "18px sans-serif"; ctx.fillText(c.line, 56, 157); ctx.globalAlpha = 1; ctx.textAlign = "center";
  }
  const c = g8.code;
  if (g8.state === "open" && c) {   // the throw, from memory: each right one lights up (the sling winds tighter); a wrong one starts it over
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(0, 0, W, H);
    const n = c.seq.length, box = 52, gap = 9, tw = n * box + (n - 1) * gap, y = 200, pw = Math.max(tw + 60, 460);
    ctx.fillStyle = "rgba(25,14,6,0.88)"; ctx.beginPath(); ctx.roundRect(W / 2 - pw / 2, y - 66, pw, box + 124, 16); ctx.fill();
    ctx.fillStyle = "#ffe08a"; ctx.font = "bold 22px sans-serif"; ctx.fillText("The throw", W / 2, y - 32);
    for (let i = 0; i < n; i++) {
      const bx2 = W / 2 - tw / 2 + i * (box + gap), done = i < c.got;
      ctx.fillStyle = done ? "#e8b84a" : "rgba(255,255,255,0.12)"; ctx.beginPath(); ctx.roundRect(bx2, y, box, box, 10); ctx.fill();
      ctx.fillStyle = done ? "#3a2410" : "rgba(255,255,255,0.35)"; ctx.font = "bold 28px sans-serif"; ctx.fillText(done ? ARROWS[c.seq[i]] : "?", bx2 + box / 2, y + 36);
    }
    ctx.font = "16px sans-serif"; ctx.fillStyle = "#e9dcc4"; ctx.fillText(`Enter the throw from memory  ·  ${Math.max(0, c.t).toFixed(1)} s`, W / 2, y + box + 34);
  }
  ctx.restore(); ctx.textAlign = "left";
}

// ---- hooks (main.js calls these) ----
function updateWorld8(dt) { if (WORLD !== 8) return; updateWords8(dt); updateGoliath8(dt); updateCrowd8(dt); updateRout8(dt); updateEliab8(dt); if (typeof updateVultures === "function") updateVultures(dt); }
function drawWorld8(camX) { if (WORLD !== 8) return; if (typeof drawVultures === "function") drawVultures(camX); drawRout8Back(camX); drawWords8(camX); drawGoliath8(camX); drawEliab8(camX); }
function drawWorld8Over() { if (WORLD !== 8) return; drawWords8Over(); drawGoliath8Over(); }
function stoneHitsWorld8(s) { return WORLD === 8 && stoneHitsGoliath8(s); }

// ---------------------------------------------------------------------------
// After the duel: Saul & Abner, "Whose son is this young man?" (1 Samuel 17:55-58; DESIGN 5h). In Saul's tent (the
// World 7 tent). Saul asks Abner; Abner doesn't know; Saul sends him; Abner brings David in (17:57, kid-clean: the
// rest of that verse is left to the Journal reference) and presents him to the king; David answers with who he's
// always been. Glen's Abner: abner_talk, abner_walk, abner_present (david-sling-art/world8/abner).
// To watch it on its own: index.html#abner.
// ---------------------------------------------------------------------------
Object.assign(W8, {
  ABNER_SIZE: 1.18,      // Abner against David (a grown commander; David is a youth)
  TENT_Z: 1.9,           // how close the camera is (as in the World 7 tent scene)
  FETCH: [2.2, 3.0, 6.2],   // 17:57: Abner gone off right by, back in from the right at, both stopped before Saul by (seconds)
  SAUL_AT: 0.24, ABNER_AT: 0.58, DAVID_AT: 0.47, ABNER_BACK: 0.70,   // where they stand (fractions of the screen width)
  ABNER_BEATS: [
    { who: "", text: "When Saul saw David go out against the Philistine, he said to Abner, the captain of the army," },
    { who: "King Saul", text: "\"Abner, whose son is this youth?\" (1 Samuel 17:55)", saul: true },
    { who: "Abner", text: "\"As your soul lives, O king, I can't tell.\" (1 Samuel 17:55)", abner: true },
    { who: "King Saul", text: "\"Inquire whose son the young man is!\" (1 Samuel 17:56)", saul: true },
    { who: "", text: "As David returned from the battle, Abner took him and brought him before Saul. (1 Samuel 17:57)", fetch: true },
    { who: "King Saul", text: "\"Whose son are you, you young man?\" (1 Samuel 17:58)", saul: true, david: true },
    { who: "David", text: "\"I am the son of your servant Jesse the Bethlehemite.\" (1 Samuel 17:58)", david: true },
  ],
});
const abnerScene = {
  active: false,
  start(then) { Object.assign(this, { active: true, then, t: 0, i: 0, bt: 0, out: 0 }); hushLoops(); dialog.t = 0; },
  update(dt) {
    this.t += dt; this.bt += dt;
    if (this.out > 0) { this.out += dt; if (this.out > 1.2) { this.active = false; if (this.then) { const f = this.then; this.then = null; f(); } } return; }
    const B = W8.ABNER_BEATS[this.i], ready = B.fetch ? this.bt > W8.FETCH[2] + 0.4 : this.bt > 0.6;
    if (B.fetch && this.bt > 0.05 && !this.walked) { this.walked = true; }
    if (ready && (pressed("a") || pressed("b") || pressed("start"))) {
      if (this.i < W8.ABNER_BEATS.length - 1) { this.i++; this.bt = 0; if (W8.ABNER_BEATS[this.i].fetch) this.walked = false; }
      else this.out = 0.001;
    }
  },
  draw() {
    const B = W8.ABNER_BEATS[this.i], now = performance.now() / 1000, fy = H - 6, z = W8.TENT_Z, za = z * W8.ABNER_SIZE;
    if (typeof TENT_BG !== "undefined" && TENT_BG.naturalWidth) { const s = Math.max(W / TENT_BG.naturalWidth, H / TENT_BG.naturalHeight); ctx.drawImage(TENT_BG, (W - TENT_BG.naturalWidth * s) / 2, (H - TENT_BG.naturalHeight * s) / 2, TENT_BG.naturalWidth * s, TENT_BG.naturalHeight * s); }
    else { ctx.fillStyle = "#2a1c10"; ctx.fillRect(0, 0, W, H); }
    // Saul, on the left, facing them
    // (Glen, 2026-10-24: the old talking pose was jerky) his smooth talking clip, saul_talk, while he speaks; its first frame while he listens
    if (SPR.saul_talk) drawSprite("saul_talk", B.saul ? frameOf("saul_talk", this.bt) : 0, W * W8.SAUL_AT, fy, 1, z);
    else drawSprite(SPR.saul_armor ? "saul_armor" : "saul", B.saul && SPR.saul_armor ? 5 : 0, W * W8.SAUL_AT, fy, 1, z);
    // Abner and David: before 17:57 Abner stands before the king; in 17:57 he goes out and brings David in; after, both stand there
    const after = this.i > W8.ABNER_BEATS.findIndex(b => b.fetch), fetching = B.fetch, [gone, back, there] = W8.FETCH;
    if (fetching) {
      const t = this.bt;
      if (t < gone) {   // he turns and goes out to find him
        const p = t / gone; drawSprite("abner_walk", frameOf("abner_walk", now), W * (W8.ABNER_AT + (1.12 - W8.ABNER_AT) * p), fy, 1, za);
      } else if (t >= back) {   // back in, David walking ahead of him
        const p = Math.min(1, (t - back) / (there - back)), walking = p < 1;
        const dx = W * (1.18 + (W8.DAVID_AT - 1.18) * p), ax = W * (1.34 + (W8.ABNER_BACK - 1.34) * p);
        drawSprite(walking ? "david_walk" : "david_idle", frameOf(walking ? "david_walk" : "david_idle", now), dx, fy, -1, z);
        if (walking) drawSprite("abner_walk", frameOf("abner_walk", now), ax, fy, -1, za);
        else drawSprite("abner_present", Math.min(SPR.abner_present.frames - 1, Math.floor((t - there) / 0.26)), ax, fy, -1, za);   // and presents him to the king
      }
    } else if (after) {
      drawSprite("david_idle", frameOf("david_idle", now), W * W8.DAVID_AT, fy, -1, z);
      drawSprite("abner_present", SPR.abner_present.frames - 1, W * W8.ABNER_BACK, fy, -1, za);
    } else {
      drawSprite(B.abner ? "abner_talk" : "abner_present", B.abner ? frameOf("abner_talk", now) : 0, W * W8.ABNER_AT, fy, -1, za);
    }
    const a = Math.min(1, this.t / 1.0);
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = "center";
    drawStoryBox(B.who, B.text, (B.fetch ? this.bt > W8.FETCH[2] + 0.4 : this.bt > 0.6) ? keyText("A: next") : "", true);
    ctx.restore(); ctx.textAlign = "left";
    const f = this.out > 0 ? Math.min(1, this.out / 1.2) : Math.max(0, 1 - this.t / 0.8);
    if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  },
};
if (location.hash === "#abner") abnerScene.start(() => backToMap());   // (testing: the scene by itself)

// ===========================================================================
// 8-3 The Rout (1 Samuel 17:51-52; DESIGN 5h): the Philistines run, and Israel chases them. Joyful and fast, and it
// runs itself (autoRun8: main.js's held("right")): you only jump the dropped shields, rocks and piles of gear. No
// fighting, nothing that hurts. Philistines flee ahead of you (phil_run), Israel's soldiers run with you (soldier_run).
//   setPiece("rout8end", c)  past column c: the end of the chase, and back to the map.
// 8-4 Home (DESIGN 5h): the hills of Bethlehem at sunset, everyone you met along the path, Eliab a little behind,
// Hanan at the fold; after the gate, w8ending (Hanan's last words, the flashback, "The battle is the LORD's"),
// then the Journal.
// ===========================================================================
Object.assign(W8, {
  ROUT_RUNNERS: 7,       // Philistines fleeing ahead (they run a little slower than David: he gains on them)
  ROUT_ISRAEL: 6,        // Israel's soldiers running with him
  ROUT_PHIL_SPEED: 0.82, // times David's run
  ELIAB_FROM: 120,       // 8-4: from this column Eliab walks behind David, a few steps back
  ELIAB_GAP: 4.5,        // tiles behind him
  HOME_BEATS: [
    { who: "Hanan", text: "I heard." },
    { who: "", text: "David looked back toward the hills, and remembered the night of the lion, and the lamb he carried home.", flash: true },
    { who: "Hanan", text: "The lion was bigger than you. The giant was bigger than you. They always will be. Remember who stood with you." },
    { card: true },
  ],
});
const autoRun8 = () => LEVEL_STAGE === "8-3" && !(rout8 && rout8.done) && david.deadT <= 0;   // main.js: held("right")
const rout8End = setPieces.find(p => p.kind === "rout8end");
const rout8 = LEVEL_STAGE === "8-3" ? { done: false, phil: [], isr: [], t: 0 } : null;
if (rout8) {
  for (let i = 0; i < W8.ROUT_RUNNERS; i++) rout8.phil.push({ x: (14 + i * 6) * T, ph: Math.random() * 3, s: 0.85 + Math.random() * 0.2 });
  for (let i = 0; i < W8.ROUT_ISRAEL; i++) rout8.isr.push({ dx: -260 + i * 90 + Math.random() * 40, ph: Math.random() * 3, s: 0.8 + Math.random() * 0.15 });
}
// ---- 8-3's spoils (Glen, 2026-10-23): "a game to collect things", how many can you get? Olives (the purse, as anywhere),
// bread and figs the Philistines dropped as they ran, and lambs they had stolen (touch one and it runs back to Israel's
// lines). From column 230 their abandoned camp: raised boards over the way (W8.ROUT_FORKS), spoils up top and others
// underneath, so you choose. At the end, the tally and the best (davidProgress.rout8Best), and 1 Samuel 17:53.
Object.assign(W8, {
  SPOIL_PTS: { olive: 1, bread: 2, figs: 2, lamb: 5 },   // points toward the spoils total
  SPOIL_SIZE: 0.36,      // bread and figs (food elsewhere is 0.32: a little bigger, they go by fast)
  LAMB_SIZE: 1.15,      // (a touch bigger than lambs elsewhere, so they read at a run)
  // the chase, before the camp: [kind, column, row] (row 16 = on the ground, 12-13 = a jump up)
  ROUT_SPOILS: [["bread", 22, 16], ["figs", 34, 12], ["bread", 52, 16], ["lamb", 64, 16], ["figs", 76, 16], ["bread", 84, 13],
                ["figs", 100, 16], ["lamb", 108, 16], ["bread", 118, 12], ["figs", 128, 16], ["lamb", 140, 16], ["bread", 147, 16],
                ["figs", 154, 12], ["lamb", 166, 16], ["bread", 172, 16], ["figs", 182, 13], ["lamb", 200, 16], ["bread", 208, 12],
                ["figs", 218, 16]],
  // the camp: [column, what's up on the boards, what's underneath]; the boards run 12 columns at row 13
  ROUT_FORKS: [[236, "olives", "lamb bread"], [262, "figs bread figs", "lamb lamb"], [288, "olives", "figs lamb figs"],
               [340, "bread lamb bread", "olives"], [366, "figs figs figs", "lamb bread"], [418, "lamb olives", "bread figs bread"],
               [444, "olives", "lamb lamb"], [496, "bread figs bread figs", "lamb olives"], [522, "lamb lamb", "olives"]],
  // piles and loose spoils between the boards: [column, pile height (0 = none), spoils on the ground after it]
  ROUT_CAMP: [[254, 2, "bread"], [280, 1, "lamb"], [306, 3, ""], [314, 1, "figs"], [322, 2, "lamb"], [332, 1, "bread"],
              [358, 2, "figs"], [384, 3, ""], [392, 1, "lamb"], [400, 2, "bread"], [410, 1, "figs"], [436, 2, "lamb"],
              [462, 3, ""], [470, 1, "bread"], [478, 2, "lamb"], [488, 1, "figs"], [514, 2, "bread"], [540, 3, ""],
              [548, 1, "lamb"], [556, 2, "figs"], [564, 1, "bread"], [572, 2, "lamb"]],
});
const spoils8 = [];
const spoil8 = (kind, c, r) => spoils8.push({ kind, x: c * T + T / 2, y: (r + 1) * T, t: Math.random() * 6, taken: false });
if (rout8) {
  for (const [k, c, r] of W8.ROUT_SPOILS) spoil8(k, c, r);
  const put = (what, c0, r) => what.split(" ").filter(Boolean).forEach((k, i, all) => {
    const c = c0 + Math.round((i + 1) * 12 / (all.length + 1));
    if (k === "olives") oliveArc(c0 + 2, r - 1, 8); else spoil8(k, c, r);
  });
  for (const [c, up, down] of W8.ROUT_FORKS) {
    rock(c, GR - 1, 2, 1);                        // a pile to jump from, up onto the boards
    plat(c + 3, 13, 12);                          // the boards (drop off them, or jump up onto them from underneath)
    put(up, c + 3, 12); put(down, c + 3, 16);
  }
  for (const [c, h, k] of W8.ROUT_CAMP) { if (h) rock(c, GR - h, 2, h); if (k) spoil8(k, c + (h ? 4 : 0), 16); }
  rout8.got = { olive: 0, bread: 0, figs: 0, lamb: 0 };
  talk(232, "Tobi", "Their camp! Grab what you can. You can't get it all, so choose: up on the boards, or underneath?");
}
const rout8Olives = () => olives.filter(o => o.taken && o.kind !== "golden").length;
const rout8Total = () => { const g = rout8.got; g.olive = rout8Olives(); return Object.keys(W8.SPOIL_PTS).reduce((n, k) => n + g[k] * W8.SPOIL_PTS[k], 0); };
function updateSpoils8(dt) {
  for (const p of spoils8) {
    p.t += dt;
    if (p.taken) { if (p.kind === "lamb") { p.x -= 520 * dt; p.gone = (p.gone || 0) + dt; } continue; }   // a saved lamb runs back
    if (Math.abs(p.x - david.x) < 42 && david.y > p.y - 70 && david.y - david.h < p.y + 10) {
      p.taken = true; rout8.got[p.kind]++;
      if (p.kind === "lamb") { baa(p.x, 0.7); toast(`A lamb saved! (${rout8.got.lamb})`); }
      else sfx("heal", undefined, 0.45);
      for (let k = 0; k < 8; k++) bits.push({ x: p.x, y: p.y - 20, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 380, life: 0.5, color: "#ffe9a0" });
    }
  }
}
function drawSpoils8(camX) {
  const now = performance.now() / 1000;
  for (const p of spoils8) {
    const x = p.x - camX; if (x < -80 || x > W + 80) continue;
    if (p.kind === "lamb") {
      if (p.taken && p.gone > 1.5) continue;
      const nm = p.taken ? "lamb_run" : "lamb_stand";
      if (SPR[nm]) drawSprite(nm, p.taken ? frameOf(nm, now * 1.5) : 0, x, p.y, -1, W8.LAMB_SIZE, p.taken ? Math.max(0, 1 - p.gone / 1.5) : 1);
    } else if (!p.taken) drawItem(p.kind, x, p.y - 4 + Math.sin(p.t * 3) * 3, W8.SPOIL_SIZE);
  }
}
function drawRout8Over() {   // the tally at the top while he runs; the spoils, counted, at the end
  if (!rout8 || !rout8.got) return;
  const g = rout8.got, total = rout8Total(), icons = [["olive", "Olives"], ["bread", "Bread"], ["figs", "Figs"], ["lamb", "Lambs"]];
  const icon = (k, x, y, s) => {
    if (k === "olive") drawOlive(x, y - 8 * s, "green", 1.3 * s);
    else if (k === "lamb") { if (SPR.lamb_stand) drawSprite("lamb_stand", 0, x, y + 12 * s, -1, 1.0 * s); }
    else drawItem(k, x, y + 10 * s, 0.17 * s);
  };
  ctx.save(); ctx.textAlign = "left";
  if (!rout8.panel) {
    ctx.fillStyle = "rgba(25,14,6,0.6)"; ctx.beginPath(); ctx.roundRect(W / 2 - 250, 40, 500, 50, 12); ctx.fill();
    icons.forEach(([k], i) => { const x = W / 2 - 215 + i * 100; icon(k, x, 66, 1); ctx.fillStyle = "#fff"; ctx.font = "bold 22px sans-serif"; ctx.fillText(g[k], x + 24, 74); });
    ctx.textAlign = "right"; ctx.fillStyle = "#ffd166"; ctx.font = "bold 24px sans-serif"; ctx.fillText(total, W / 2 + 236, 78);
    ctx.font = "12px sans-serif"; ctx.fillText("spoils", W / 2 + 236, 54);
    ctx.restore(); return;
  }
  const f = Math.min(1, rout8.panelT / 0.5);
  ctx.globalAlpha = f; ctx.fillStyle = "rgba(10,6,2,0.8)"; ctx.beginPath(); ctx.roundRect(W / 2 - 330, 100, 660, 470, 18); ctx.fill();
  ctx.textAlign = "center"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 38px Georgia, serif"; ctx.fillText("The Spoils of the Camp", W / 2, 156);
  ctx.fillStyle = "#e9dcc4"; ctx.font = "italic 18px Georgia, serif";
  ctx.fillText("The children of Israel returned from chasing after the Philistines,", W / 2, 190);
  ctx.fillText("and they plundered their camp. (1 Samuel 17:53)", W / 2, 214);
  icons.forEach(([k, name], i) => {
    const y = 268 + i * 48; icon(k, W / 2 - 170, y - 8, 1.2);
    ctx.textAlign = "left"; ctx.fillStyle = "#f3ead8"; ctx.font = "24px sans-serif"; ctx.fillText(name, W / 2 - 130, y);
    ctx.textAlign = "right"; ctx.fillStyle = "#fff"; ctx.font = "bold 24px sans-serif"; ctx.fillText(`${g[k]}`, W / 2 + 110, y);
    ctx.fillStyle = "#c9b98f"; ctx.font = "18px sans-serif"; ctx.fillText(`× ${W8.SPOIL_PTS[k]}`, W / 2 + 180, y);
  });
  ctx.textAlign = "center"; ctx.fillStyle = "#ffd166"; ctx.font = "bold 30px sans-serif"; ctx.fillText(`Spoils: ${total}`, W / 2, 484);
  ctx.font = "18px sans-serif"; ctx.fillStyle = rout8.newBest ? "#ffd166" : "#e9dcc4";
  ctx.fillText(rout8.newBest ? (rout8.prevBest ? `A new best! (was ${rout8.prevBest})` : "Your first run. Can you beat it?") : `Your best: ${rout8.prevBest}`, W / 2, 516);
  if (rout8.panelT > 1) { ctx.fillStyle = "#e9dcc4"; ctx.font = "16px sans-serif"; ctx.fillText(keyText("A: on to the map"), W / 2, 552); }
  ctx.restore();
}
function updateRout8(dt) {
  if (!rout8) return;
  rout8.t += dt; updateSpoils8(dt);
  const run = TUNE.RUN_SPEED;
  for (const p of rout8.phil) {   // fleeing ahead; once he's passed one by, it comes back in further ahead
    p.x += run * W8.ROUT_PHIL_SPEED * p.s * dt;
    if (p.x < camX - 200) p.x = camX + W + 120 + Math.random() * 400;
  }
  for (const s of rout8.isr) s.dx += (Math.sin(rout8.t * 0.7 + s.ph) * 30 - (s.dx - (-260 + rout8.isr.indexOf(s) * 90))) * dt * 0.5;   // they keep pace, drifting a little
  if (rout8End && !rout8.done && david.x > rout8End.x) {
    rout8.done = true; david.vx = 0;
    sayLine("", "The men of Israel and of Judah arose and shouted, and pursued the Philistines as far as Gai and to the gates of Ekron. (1 Samuel 17:52)");
    sfx("war_horn", undefined, 0.8);
    rout8.endT = 0;
  }
  if (rout8.done && rout8.endT !== undefined && !dialog.hold) {
    rout8.endT += dt;
    if (rout8.endT > 0.6 && !rout8.panel) {   // the tally, and the best
      rout8.panel = true; rout8.panelT = 0;
      const total = rout8Total();
      try {
        const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); rout8.prevBest = p.rout8Best || 0; rout8.newBest = total > rout8.prevBest;
        if (rout8.newBest) { p.rout8Best = total; localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); }
      } catch (e) {}
      chime(4); setTimeout(() => chime(7), 160);
    }
    if (rout8.panel) { rout8.panelT += dt; if (rout8.panelT > 1 && (pressed("a") || pressed("start")) && !rout8.left) { rout8.left = true; clear8(); setTimeout(() => backToMap(), 500); } }
  }
}
function drawRout8Back(camX) {   // behind David: the fleeing Philistines, smaller (further off), and Israel's soldiers with him
  if (!rout8) return;
  drawSpoils8(camX);
  const now = performance.now() / 1000;
  if (SPR.phil_run) for (const p of rout8.phil) { const x = p.x - camX; if (x > -150 && x < W + 150) drawSprite("phil_run", frameOf("phil_run", now * 1.3 + p.ph), x, GR * T - 26, 1, W8.ROUT_PHIL_SIZE, 0.85, "brightness(0.85)"); }
  if (SPR.soldier_run && !rout8.done) for (const s of rout8.isr) { const x = david.x + s.dx - camX; if (x > -150 && x < W + 150) drawSprite("soldier_run", frameOf("soldier_run", now * 1.2 + s.ph), x, GR * T - 14, 1, W8.ROUT_ISR_SIZE * s.s); }
}
Object.assign(W8, { ROUT_PHIL_SIZE: 0.8, ROUT_ISR_SIZE: 1.0 });

// ---- 8-4: Eliab, a little behind ----
const eliab8 = LEVEL_STAGE === "8-4" ? { on: false, x: 0, walking: false } : null;
function updateEliab8(dt) {
  if (!eliab8) return;
  if (!eliab8.on) { if (david.x > W8.ELIAB_FROM * T) { eliab8.on = true; eliab8.x = david.x - (W8.ELIAB_GAP + 6) * T; } return; }
  const want = david.x - W8.ELIAB_GAP * T, gap = want - eliab8.x;
  eliab8.walking = Math.abs(gap) > 10;
  if (eliab8.walking) eliab8.x += Math.sign(gap) * Math.min(Math.abs(gap), TUNE.WALK_SPEED * 0.85 * dt);
}
function drawEliab8(camX) {
  if (!eliab8 || !eliab8.on) return;
  const x = eliab8.x - camX, now = performance.now() / 1000; if (x < -150 || x > W + 150) return;
  if (eliab8.walking && SPR.eliab_walk) drawSprite("eliab_walk", frameOf("eliab_walk", now), x, GR * T, 1);
  else if (SPR.eliab_arms_crossed) drawSprite("eliab_arms_crossed", frameOf("eliab_arms_crossed", now), x, GR * T, 1);
}

// ---- after the fold at 8-4: Hanan's last words ----
const w8ending = {
  active: false,
  start(then) { Object.assign(this, { active: true, then, t: 0, i: 0, bt: 0, out: 0 }); dialog.t = 0; },
  update(dt) {
    this.t += dt; this.bt += dt;
    if (this.out > 0) { this.out += dt; if (this.out > 1.4) { this.active = false; if (this.then) { const f = this.then; this.then = null; f(); } } return; }
    const B = W8.HOME_BEATS[this.i];
    if (B.card && this.bt > 5) { this.out = 0.001; return; }
    if (this.bt > (B.card ? 2 : 0.6) && (pressed("a") || pressed("b") || pressed("start"))) {
      if (this.i < W8.HOME_BEATS.length - 1) { this.i++; this.bt = 0; } else this.out = 0.001;
    }
  },
  draw() {
    const B = W8.HOME_BEATS[this.i], now = performance.now() / 1000;
    const cover = img => { if (!img || !img.naturalWidth) return false; const s = Math.max(W / img.naturalWidth, H / img.naturalHeight); ctx.drawImage(img, (W - img.naturalWidth * s) / 2, (H - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s); return true; };
    const strip = img => { if (img && img.naturalWidth) { const h = img.naturalHeight * W / img.naturalWidth; ctx.drawImage(img, 0, H - h, W, h); } };   // once, the full width, along the bottom (no seams)
    ctx.fillStyle = "#1a1008"; ctx.fillRect(0, 0, W, H);
    if (B.flash) {   // the flashback: the moonlit rocks of World 1, and the lamb
      const f = Math.min(1, this.bt / 1.2);
      cover(BG.w1_4 && BG.w1_4.far); strip(BG.w1_4 && BG.w1_4.near);
      ctx.fillStyle = "rgba(20,30,60,0.35)"; ctx.fillRect(0, 0, W, H);
      if (SPR.lamb_walk) drawSprite("lamb_walk", frameOf("lamb_walk", now), W * 0.5, H - 80, 1, 1.6);
      const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.85); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = `rgba(255,255,255,${0.6 * (1 - f)})`; ctx.fillRect(0, 0, W, H);
    } else if (!B.card) {   // the fold at sunset: Hanan at the gate, David with him
      cover(BG.w8_4 && BG.w8_4.far); strip(BG.w8_4 && BG.w8_4.mid); strip(BG.w8_4 && BG.w8_4.near);
      const z = 1.5, fy = H - 40, talking = B.who === "Hanan";
      drawSprite(talking && SPR.hanan_talk ? "hanan_talk" : "hanan_idle", frameOf(talking && SPR.hanan_talk ? "hanan_talk" : "hanan_idle", now), W * 0.6, fy, -1, z * (TUNE.SPRITE_SIZE.hanan_idle || 1));
      drawSprite("david_idle", frameOf("david_idle", now), W * 0.42, fy, 1, z);
    }
    if (B.card) {   // the last words
      const f = Math.min(1, this.bt / 1.5);
      ctx.save(); ctx.textAlign = "center"; ctx.globalAlpha = f;
      ctx.fillStyle = "#ffe3a0"; ctx.font = "italic bold 58px Georgia, serif"; ctx.shadowColor = "rgba(255,170,40,0.8)"; ctx.shadowBlur = 24;
      ctx.fillText("The battle is the LORD's.", W / 2, H / 2 - 6);
      ctx.shadowBlur = 0; ctx.font = "italic 20px Georgia, serif"; ctx.fillStyle = "rgba(255,240,215,0.85)"; ctx.fillText("1 Samuel 17:47", W / 2, H / 2 + 42);
      ctx.restore();
    } else {
      ctx.save(); ctx.textAlign = "center"; drawStoryBox(B.who, B.text, this.bt > 0.6 ? keyText("A: next") : "", true); ctx.restore(); ctx.textAlign = "left";
    }
    const f = this.out > 0 ? Math.min(1, this.out / 1.4) : Math.max(0, 1 - this.t / 1.0);
    if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  },
};

// ---------------------------------------------------------------------------
// The end of the game (Glen, 2026-10-22): after the last Journal page (his whole song playing over it, journal.js
// journalSong), the credits roll over the hills of Bethlehem while the song plays on, then the final score; and if every
// one of The One was found (W8.ONES, 31), the secret ending (DESIGN 5h): a thousand years later, shepherds on the same hills.
// W8.CREDITS is the list: [size, text]; "" is a gap. (Glen: fill in or change any line.)
// To watch it alone: index.html#credits
// ---------------------------------------------------------------------------
Object.assign(W8, {
  CREDITS: [
    ["title", "David: The Shepherd's Sling"], ["", ""],
    ["head", "A game by"], ["name", "Glen"], ["", ""],
    ["head", "Story, art direction, and the voices of Goliath and the Philistines"], ["name", "Glen"], ["", ""],
    ["head", "\"The Shepherd Leads Me\""], ["small", "a song inspired by Psalm 23"], ["name", "Glen"], ["", ""],
    ["head", "Characters and scenes"], ["small", "made by Glen with AI image and video tools, then cut, painted and put together by hand"], ["", ""],
    ["head", "Code"], ["name", "Claude (Anthropic), with Glen"], ["", ""],
    ["head", "Sounds and music"], ["small", "from Pixabay and other sound libraries (see assets/sounds/SOURCES.md)"], ["", ""],
    ["head", "Scripture"], ["small", "Scripture quotations are from the World English Bible (public domain)."], ["", ""],
    ["head", "Thanks"], ["small", "to every family who plays it together"], ["", ""], ["", ""],
    ["score", ""], ["", ""], ["", ""],
    ["title", "Thank you for playing."], ["", ""],
    ["verse", "The battle is the LORD's."], ["small", "1 Samuel 17:47"],
  ],
  CREDITS_SPEED: 42,     // px a second the credits roll (hold A: three times as fast)
  SECRET: [              // all 31 of The One: Luke 2:8-11 (WEB), on the hills of World 1 at night
    { text: "About a thousand years later." },
    { text: "There were shepherds in the same country staying in the field, and keeping watch by night over their flock. (Luke 2:8)" },
    { text: "Behold, an angel of the Lord stood by them, and the glory of the Lord shone around them, and they were terrified. (Luke 2:9)", glory: true },
    { text: "The angel said to them, \"Don't be afraid, for behold, I bring you good news of great joy which will be to all the people.\" (Luke 2:10)", glory: true },
    { text: "\"For there is born to you today, in David's city, a Savior, who is Christ the Lord.\" (Luke 2:11)", glory: true, last: true },
  ],
});
function endScore() {   // sheep saved, The One found (of W8.ONES: 8-2 has none), stones of remembrance (of 96)
  const p = loadProgress(); let sheep = 0, total = 0, ones = 0;
  for (const k in p) if (/^\d-\d$/.test(k) && p[k] && p[k].cleared) { sheep += p[k].sheep || 0; total += p[k].total || 0; if (p[k].one) ones++; }
  const stones = typeof stonesFound === "function" ? [1, 2, 3, 4, 5, 6, 7, 8].reduce((n, w) => n + stonesFound(w), 0) : 0;
  return { sheep, total, ones, stones };
}
const credits8 = {
  active: false,
  start(then) {
    Object.assign(this, { active: true, then, t: 0, y: H + 20, out: 0, secret: -1, st: 0, score: endScore() });
    if (typeof journalSong !== "undefined" && journalSong.paused && audioUnlocked) { journalSong.volume = 0.9 * (typeof musicMul === "function" ? 1 : 1); journalSong.play().catch(() => {}); }
  },
  height() { return W8.CREDITS.reduce((h, [k]) => h + ({ title: 70, head: 34, name: 44, small: 30, verse: 64, score: 120 }[k] || 26), 0); },
  update(dt) {
    this.t += dt;
    if (this.out > 0) {
      this.out += dt;
      if (typeof journalSong !== "undefined") journalSong.volume = Math.max(0, journalSong.volume - dt * 0.4);
      if (this.out > 2.2) { this.active = false; if (typeof journalSong !== "undefined") journalSong.pause(); if (this.then) { const f = this.then; this.then = null; f(); } }
      return;
    }
    if (this.secret >= 0) {   // the secret ending
      this.st += dt;
      if (this.st > 1.2 && (pressed("a") || pressed("start"))) { if (this.secret < W8.SECRET.length - 1) { this.secret++; this.st = 0; } else this.out = 0.001; }
      return;
    }
    const end = -this.height() + H * 0.42, fast = held("a") ? 3 : 1;
    this.y = Math.max(end, this.y - W8.CREDITS_SPEED * fast * dt);
    if (pressed("start")) this.y = end;
    if (this.y <= end && this.t > 3 && pressed("a")) {
      if (this.score.ones >= W8.ONES) { this.secret = 0; this.st = 0; }
      else this.out = 0.001;
    }
  },
  draw() {
    const now = performance.now() / 1000;
    const cover = img => { if (!img || !img.naturalWidth) return; const s = Math.max(W / img.naturalWidth, H / img.naturalHeight); ctx.drawImage(img, (W - img.naturalWidth * s) / 2, (H - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s); };
    ctx.fillStyle = "#120b05"; ctx.fillRect(0, 0, W, H);
    if (this.secret >= 0) {   // the hills of World 1 at night: a fire, the flock; then the glory of the Lord
      const B = W8.SECRET[this.secret];
      if (this.secret > 0) {
        cover(BG.w1_4 && BG.w1_4.far);
        if (BG.w1_4 && BG.w1_4.near && BG.w1_4.near.naturalWidth) { const n = BG.w1_4.near, h = n.naturalHeight * W / n.naturalWidth; ctx.drawImage(n, 0, H - h, W, h); }
        if (SPR.sheep_graze) for (let i = 0; i < 5; i++) drawSprite(i % 2 ? "sheep_stand" : "sheep_graze", frameOf(i % 2 ? "sheep_stand" : "sheep_graze", now + i), W * (0.55 + i * 0.07), H - 60, i % 2 ? 1 : -1, 0.9);
        if (B.glory) {   // light fills the sky
          const g = ctx.createRadialGradient(W / 2, 0, 20, W / 2, 0, H * 1.2), k = Math.min(1, this.st / 1.5);
          g.addColorStop(0, `rgba(255,250,220,${0.95 * k})`); g.addColorStop(0.5, `rgba(255,230,160,${0.5 * k})`); g.addColorStop(1, "rgba(255,220,140,0)");
          ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
        }
      }
      ctx.save(); ctx.textAlign = "center";
      if (this.secret === 0) { ctx.globalAlpha = Math.min(1, this.st / 1.2); ctx.fillStyle = "#e9dcc4"; ctx.font = "italic 34px Georgia, serif"; ctx.fillText(B.text, W / 2, H / 2); }
      else drawStoryBox("", B.text, this.st > 1.2 ? keyText("A: next") : "", true);
      ctx.restore(); ctx.textAlign = "left";
    } else {
      cover(BG.w8_4 && BG.w8_4.far);
      ctx.fillStyle = "rgba(15,8,3,0.62)"; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.textAlign = "center"; let y = this.y;
      for (const [k, text] of W8.CREDITS) {
        const h = { title: 70, head: 34, name: 44, small: 30, verse: 64, score: 120 }[k] || 26;
        if (y > -140 && y < H + 140) {
          if (k === "title") { ctx.font = "bold 46px Georgia, serif"; ctx.fillStyle = "#ffe08a"; ctx.fillText(text, W / 2, y); }
          else if (k === "head") { ctx.font = "16px sans-serif"; ctx.fillStyle = "rgba(255,230,190,0.75)"; ctx.fillText(text.toUpperCase(), W / 2, y); }
          else if (k === "name") { ctx.font = "italic 30px Georgia, serif"; ctx.fillStyle = "#fff4dc"; ctx.fillText(text, W / 2, y); }
          else if (k === "small") { ctx.font = "italic 20px Georgia, serif"; ctx.fillStyle = "#efe2c8"; ctx.fillText(text, W / 2, y); }
          else if (k === "verse") { ctx.font = "italic bold 44px Georgia, serif"; ctx.fillStyle = "#ffe3a0"; ctx.shadowColor = "rgba(255,170,40,0.8)"; ctx.shadowBlur = 18; ctx.fillText(text, W / 2, y); ctx.shadowBlur = 0; }
          else if (k === "score") {
            const S = this.score; ctx.font = "16px sans-serif"; ctx.fillStyle = "rgba(255,230,190,0.75)"; ctx.fillText("YOUR JOURNEY", W / 2, y);
            ctx.font = "22px Georgia, serif"; ctx.fillStyle = "#fff4dc";
            ctx.fillText(`Sheep brought home: ${S.sheep}${S.total ? ` of ${S.total}` : ""}`, W / 2, y + 34);
            ctx.fillText(`The One found: ${S.ones} of ${W8.ONES}`, W / 2, y + 64);
            ctx.fillText(`Stones of remembrance: ${S.stones} of 96`, W / 2, y + 94);
          }
        }
        y += h;
      }
      ctx.restore(); ctx.textAlign = "left";
      if (this.y <= -this.height() + H * 0.42 && this.t > 3) { ctx.save(); ctx.textAlign = "right"; ctx.font = "15px sans-serif"; ctx.fillStyle = "rgba(255,240,215,0.7)"; ctx.fillText(keyText("A: continue"), W - 16, H - 14); ctx.restore(); ctx.textAlign = "left"; }
    }
    const f = this.out > 0 ? Math.min(1, this.out / 2.2) : Math.max(0, 1 - this.t / 1.5);
    if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
  },
};
if (location.hash === "#credits") addEventListener("load", () => credits8.start(() => backToMap()));   // (testing: the credits by themselves; after the map script, for the score)

// ---------------------------------------------------------------------------
// The crowd on the Israelite slope (DESIGN 3c, 5h): everyone you met stands behind David in 8-1 and 8-2, a little
// further back (smaller, higher up the ground), facing the giant. Met = the stage where you met them is cleared; the
// soldiers you lifted in World 6 (courage6) stand in the back row; Eliab is always there, at the edge. At "The battle
// is the LORD's." they cheer; in the fight, whoever calls out a warning (g8Call) steps up and talks.
// W8.CROWD lists them: [name, stage you met them in (null = always), idle sprites (first one that exists), talk sprite].
// The old gleaner and the water captain join by themselves once their sheets are in (gleaner_idle, captain_idle).
// ---------------------------------------------------------------------------
Object.assign(W8, {
  CROWD: [
    ["Eliab", null, ["eliab_war_idle", "eliab_arms_crossed"], "eliab_war_idle"],
    ["Shammah", "7-3", ["shammah_idle"], "shammah_talk"],
    ["Abinadab", "6-1", ["abinadab_war_idle", "abinadab_idle"], "abinadab_war_talk"],
    ["The water captain", "6-3", ["captain_idle"], "captain_talk"],
    ["Tobi", "5-1", ["tobi_talk"], "tobi_talk"],
    ["The Steward", "4-3", ["steward"], "steward"],
    ["Gera", "4-2", ["gera"], "gera"],
    ["The old gleaner", "3-1", ["gleaner_idle"], "gleaner_talk"],
    ["His father", "2-2", ["father_idle"], "father_talk"],
    ["The boy from Tekoa", "2-2", ["boy_idle"], "boy_talk"],
    ["The shepherd girl", "1-3", ["girl_talk"], "girl_talk"],
    ["Hanan", "1-1", ["hanan_idle"], "hanan_talk"],
  ],
  CROWD_SIZE: 0.78,      // the front row, next to David (they're a few steps up the slope)
  CROWD_LIFT: 34,        // px above the ground line (further back)
  CROWD_BACK_SIZE: 0.64, // the back row: the soldiers you lifted
  CROWD_BACK_LIFT: 64,
  CROWD_SOLDIERS: 10,    // at most this many lifted soldiers drawn
  CROWD_GAP: 1.05,       // tiles between people in the front row
});
function crowd8List() {   // who's on the slope today
  const p = loadProgress(), pick = names => names.find(n => SPR[n]);
  const front = W8.CROWD.filter(([, st, idle]) => (!st || (p[st] && p[st].cleared)) && pick(idle)).map(([who, , idle, talkNm]) => ({ who, idle: pick(idle), talk: SPR[talkNm] ? talkNm : pick(idle) }));
  const n = Math.min(W8.CROWD_SOLDIERS, typeof courage6 === "function" ? courage6() : 0);
  return { front, soldiers: n, lifted: typeof courage6 === "function" ? courage6() : 0 };
}
let crowd8 = null;   // made on the first frame (loadProgress is in map.js, which loads after this file)
function crowd8Spot() {   // the right-hand end of the front row (x, world px): just behind where David stands
  if (words8) return words8.x - 1.6 * T;
  if (g8) return g8.a1 - (6 + W8.WALK_MAX + W8.REACH_AT + 3) * T - W8.FRONT;   // (Glen, 2026-10-24) at the end of the run, just behind where David reaches him
  return 0;
}
function updateCrowd8(dt) {
  if (!crowd8 && (LEVEL_STAGE === "8-1" || LEVEL_STAGE === "8-2")) crowd8 = Object.assign(crowd8List(), { cheer: 0, told: false });
  if (!crowd8) return;
  if (crowd8.cheer > 0) crowd8.cheer = Math.max(0, crowd8.cheer - dt);
  if (words8 && words8.state === "roar" && words8.t < 0.7 && words8.t + dt >= 0.6) crowd8.cheer = 5;   // with the roar from the slope
  if (g8 && g8.won && !crowd8.wonCheer) { crowd8.wonCheer = true; crowd8.cheer = 6; }
  if (!crowd8.told && words8 && crowd8.front.length > 1 && david.x > crowd8Spot() - (crowd8.front.length * W8.CROWD_GAP + 2) * T) {
    crowd8.told = true;
    const named = crowd8.front.filter(c => c.who !== "Eliab").length;
    if (named) toast(`Up on the slope: everyone you met${crowd8.lifted ? `, and ${crowd8.lifted} soldiers you lifted` : ""}. They'll call out to you in the fight.`);
  }
}
function drawCrowd8(camX) {
  if (!crowd8 || (g8 && g8.won)) return;
  const now = performance.now() / 1000, x1 = crowd8Spot(), gap = W8.CROWD_GAP * T, n = crowd8.front.length;
  const x0 = x1 - (n - 1) * gap, cheer = crowd8.cheer > 0;
  const hop = (i, k) => cheer ? Math.max(0, Math.sin(now * 9 + i * 1.7)) * 16 * k * Math.min(1, crowd8.cheer) : 0;
  // the back row: the soldiers you lifted, spread across behind the people
  for (let i = 0; i < crowd8.soldiers; i++) {
    const x = x0 - gap * 0.5 + (i + 0.5) * ((x1 - x0 + gap) / crowd8.soldiers) - camX; if (x < -120 || x > W + 120) continue;
    const nm = SPR.soldier_talk ? "soldier_talk" : null; if (!nm) break;
    drawSprite(nm, cheer ? frameOf(nm, now + i) : 0, x, GR * T - W8.CROWD_BACK_LIFT - hop(i, 0.7), 1, W8.CROWD_BACK_SIZE * (0.94 + (i % 3) * 0.04), 1, "brightness(0.8) saturate(0.85)");
  }
  // the front row: the people you met, Eliab at the far end on his own
  crowd8.front.forEach((c, i) => {
    let x = x0 + i * gap - camX; if (c.who === "Eliab") x -= gap * 0.8;
    if (x < -150 || x > W + 150) return;
    const calling = g8 && g8.callout && g8.callout.who === c.who, talking = calling || (cheer && c.who !== "Eliab");
    const nm = talking ? c.talk : c.idle, lift = W8.CROWD_LIFT + (calling ? 10 : 0) + (c.who === "Eliab" ? 0 : hop(i, 1));
    drawSprite(nm, talking ? frameOf(nm, now + i * 0.3) : 0, x, GR * T - lift, 1, W8.CROWD_SIZE, 1, calling ? "" : "brightness(0.9)");
    if (calling) {   // a small name over the one calling, so you can see who it was
      ctx.save(); ctx.textAlign = "center"; ctx.font = "bold 14px sans-serif"; ctx.fillStyle = "rgba(28,18,8,0.7)";
      const tw = ctx.measureText(c.who).width + 14; ctx.beginPath(); ctx.roundRect(x - tw / 2, GR * T - lift - 168, tw, 22, 8); ctx.fill();
      ctx.fillStyle = "#ffd98a"; ctx.fillText(c.who, x, GR * T - lift - 152); ctx.restore(); ctx.textAlign = "left";
    }
  });
}

// ---------------------------------------------------------------------------
// The opening of World 8 (Glen, 2026-10-22), the first time 8-1 is played (or ?w8intro): his film of David walking
// down into the valley alone between the two armies (assets/video/w8_film.mp4, 1 Samuel 17:40), then the title card,
// then 8-1 as it was.
// ---------------------------------------------------------------------------
const w8intro = {
  active: false,
  start() { Object.assign(this, { active: true, t: 0 }); hushLoops(); dialog.t = 0; },
  update(dt) {
    this.t += dt;
    if (this.t > 4.2 || (this.t > 0.8 && (pressed("a") || pressed("b") || pressed("start")))) {
      this.active = false;
      try { const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); p.w8intro = true; localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); } catch (e) {}
    }
  },
  draw() {   // the title card, over the valley the stage starts in
    const keep = bgWorld; bgWorld = "w8_1"; drawBackground(0); bgWorld = keep; drawFlatGround(0);
    const f = Math.min(1, this.t / 0.8), o = Math.min(1, Math.max(0, (4.2 - this.t) / 0.6));
    ctx.fillStyle = `rgba(10,6,2,${0.75 * f})`; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.globalAlpha = f * o; ctx.textAlign = "center"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 54px Georgia, serif"; ctx.fillText("WORLD 8", W / 2, H / 2 - 20);
    ctx.fillStyle = "#fff6e2"; ctx.font = "italic 34px Georgia, serif"; ctx.fillText("David and Goliath", W / 2, H / 2 + 30); ctx.restore();
    if (this.t < 0.4) { ctx.fillStyle = `rgba(0,0,0,${1 - this.t / 0.4})`; ctx.fillRect(0, 0, W, H); }
  },
};
if (LEVEL_STAGE === "8-1" && location.hash === "#8-1") {
  let seen = false; try { seen = !!JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}").w8intro; } catch (e) {}
  if (!seen || new URLSearchParams(location.search).has("w8intro"))   // his film first: the walk into the valley, 17:40
    preFilm.start({ src: "../assets/video/w8_film.mp4", words: [[0.8, 4.2, "The Valley of Elah"], [5.0, 9.9, "", "“His sling was in his hand; and he came near to the Philistine.” (1 Samuel 17:40)"]],
      loop: ["ambience_hills", 0.45, 0.3], cues: [[6.5, "taunting_yells", 0.12]] }, () => w8intro.start());
}
