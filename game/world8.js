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

// ===========================================================================
// 8-1 The Valley and 8-2 Goliath (DESIGN 5h; Glen, 2026-10-22: build World 8). The art for his attacks is still to
// came from Glen on 2026-10-22: goliath_thrust (the spear lowered, then the lunge), goliath_slam (the spear lifted, turned
// and driven down), goliath_sweep (the sword across) and goliath_chop (the sword overhead and down), clips in
// david-sling-art/world8/goliath. The javelin is still his goliath_spear sheet (frames 5-9 wind up, 10 throws, 11-19
// point), and roaring at the sky is goliath_yell until that clip comes.
//   setPiece("words8", c)    8-1: past column c, Goliath (standing W8.WORDS_GX tiles on) taunts (17:43-44), and David
//                            answers line by line, one A press each (17:45-47); the last line earns the throw's last
//                            piece (A, faith: DESIGN 4c), then it's straight on to 8-2.
//   setPiece("goliath8", c)  8-2: the arena, 35 columns from c. Plain stones bounce off his bronze. Survive and run
//                            toward him (17:48): close in W8.CLOSES times a phase; phase 2 is faster, with the people you
//                            met calling out his attacks; phase 3 he roars at the sky, his forehead is open, and the
//                            throw (the code, from memory) is the stone. Then giantFall, the slow-motion scene.
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
  CLOSE: 2.6,            // tiles from his front that count as closing in (17:48: David ran to meet him)
  CLOSES: 3,             // close-ins a phase (phases 1 and 2), then the next phase
  PUSHBACK: 6,           // tiles he staggers back when David closes in
  WALK: 42,              // px/s he advances (phase 2: x1.3)
  TELL: { thrust: 0.85, slam: 1.0, javelin: 1.05, sweep: 0.55, chop: 0.7 },   // seconds of each tell in phase 1
  TELL2: 0.75,           // phases 2 and 3: tells this much shorter
  COUNSEL: 1.3,          // after a loss (Shammah's counsel): tells this much longer, and the opening twice as long
  REACH: { thrust: 6, sweep: 4.2, chop: 3.8 },   // tiles from his front each one reaches (the chop: no jumping over it, get back)
  THRUST_Y: 70,          // the spear passes this high (px off the ground): jump higher, or roll under it
  SWEEP_Y: 60,           // the sweep: be higher than this
  WAVE: 620,             // px/s, the spear slam's shockwave along the ground (be in the air)
  JAV_T: 1.15,           // seconds the javelin is in the air
  JAV_R: 46,             // px from where it lands that it hurts
  RECOVER: 0.9,          // seconds after an attack before he moves again
  CODE_TIME: 5,          // seconds to enter the throw at the opening...
  CODE_PER_STONE: 0.1,   // ...plus this much for every stone of remembrance saved (DESIGN 3f)
  HEART_STONES: 4,       // +1 heart for every this many stones of remembrance saved
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
    try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.throwFaith = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
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
  drawSprite("goliath_yell", yell ? frameOf("goliath_yell", performance.now() / 1000) : 0, x, GR * T, -1, W8.SIZE);
}
function drawWords8Over() {   // David's answer, big across the valley, line by line
  const w = words8; if (!w || (w.state !== "answer" && w.state !== "roar")) return;
  ctx.save(); ctx.textAlign = "center";
  const band = ctx.createLinearGradient(0, 90, 0, 330); band.addColorStop(0, "rgba(10,6,2,0)"); band.addColorStop(0.5, "rgba(10,6,2,0.55)"); band.addColorStop(1, "rgba(10,6,2,0)");
  ctx.fillStyle = band; ctx.fillRect(0, 90, W, 240);
  const wrap = (text, font, maxW) => { ctx.font = font; const out = []; let cur = ""; for (const wd of text.split(" ")) { const t2 = cur ? cur + " " + wd : wd; if (ctx.measureText(t2).width > maxW && cur) { out.push(cur); cur = wd; } else cur = t2; } out.push(cur); return out; };
  if (w.line >= 0) {
    const last = w.line === W8.WORDS.length - 1, f = Math.min(1, w.lt / 0.5);
    const m = W8.WORDS[w.line].match(/^(.*?)\s*(\((?:1 Samuel)[^)]*\))?$/), text = m[1], ref = m[2] || "";   // the reference goes on its own line, small
    const font = last ? "italic bold 52px Georgia, serif" : "italic 32px Georgia, serif", rows = wrap(text, font, W - 400), lh = last ? 60 : 40, y0 = 205 - (rows.length - 1) * lh / 2 + (1 - f) * 8;
    ctx.globalAlpha = f; ctx.fillStyle = last ? "#ffe3a0" : "#fff4dc"; ctx.shadowColor = last ? "rgba(255,170,40,0.9)" : "rgba(0,0,0,0.8)"; ctx.shadowBlur = last ? 22 : 8;
    rows.forEach((r, i) => ctx.fillText(r, W / 2, y0 + i * lh));
    if (ref) { ctx.shadowBlur = 4; ctx.font = "italic 18px Georgia, serif"; ctx.fillStyle = "rgba(255,240,215,0.85)"; ctx.fillText(ref, W / 2, y0 + (rows.length - 1) * lh + (last ? 40 : 30)); }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  }
  if (w.state === "answer") {
    ctx.font = "18px sans-serif"; ctx.fillStyle = `rgba(255,240,215,${0.55 + 0.35 * Math.sin(performance.now() / 250)})`;
    ctx.fillText(keyText(w.line < 0 ? "Answer him. Press A." : "A"), W / 2, 330);
    ctx.font = "15px sans-serif"; ctx.fillStyle = "rgba(255,240,215,0.6)"; ctx.fillText("David", W / 2, 120);
  }
  ctx.restore(); ctx.textAlign = "left";
}

// ---- 8-2: the duel ----
const g8Piece = setPieces.find(p => p.kind === "goliath8");
const g8 = g8Piece ? { a0: g8Piece.c * T, a1: (g8Piece.c + 35) * T, counsel: false, smooth: 5, phase: 1 } : null;
const goliathFight = () => !!(g8 && g8.on && !g8.won);
function w8Cam() { return g8 && (g8.on || g8.won) ? [g8.a0, g8.a0] : null; }
const G8_MUSIC = Object.assign(new Audio(`../assets/sounds/goliath_theme.mp3?v=${window.BUILD || 0}`), { loop: true, preload: "auto" });   // Glen's war horns
function resetG8() {
  Object.assign(g8, { on: false, won: false, state: "walk", t: 0, x: g8.a1 - 6 * T, closes: 0, atk: null, waves: [], jav: null,
                      combo: 0, nextAt: 1.4, callout: null, code: null, flash: 0, walkT: 0, needClose: 0, armed: true });
}
if (g8) resetG8();
const g8Front = () => g8.x - W8.FRONT;
const g8Tell = atk => W8.TELL[atk] * (g8.phase > 1 ? W8.TELL2 : 1) * (g8.counsel ? W8.COUNSEL : 1);
function g8Met(who) {   // the people who call out warnings in phase 2: only the ones you met (DESIGN 5h)
  const p = loadProgress(), c = id => !!(p[id] && p[id].cleared);
  return { Hanan: c("1-1"), Gera: c("4-2"), Tobi: c("5-1"), Abinadab: c("6-1"), Shammah: c("7-3") }[who];
}
function g8Call(who, line) { if (g8.phase >= 2 && g8Met(who)) g8.callout = { who, line, t: 1.6 }; }
function stonesSavedAll() { return typeof stonesFound === "function" ? [1, 2, 3, 4, 5, 6, 7].reduce((n, w) => n + stonesFound(w), 0) : 0; }
function startG8() {
  g8.on = true; g8.t = 0;
  if (!g8.bonus) {   // the stones of remembrance you saved: more hearts, and longer to make the throw (DESIGN 3f)
    g8.bonus = true; const n = stonesSavedAll(), h = Math.floor(n / W8.HEART_STONES);
    if (h > 0) { david.maxHearts += h; david.hearts += h; }
    setTimeout(() => toast(`${n} stone${n === 1 ? "" : "s"} of remembrance${h ? `: +${h} heart${h === 1 ? "" : "s"}` : ""}, and a steadier hand for the throw.`), 2600);
  }
  G8_MUSIC.currentTime = 0; G8_MUSIC.volume = Math.min(1, TUNE.BOSS_MUSIC_VOLUME * 1.1); G8_MUSIC.play().catch(() => {});
  thud(1); shake8(1.2);
  sayLine("", "When the Philistine arose, and walked and came near to meet David, David hurried and ran toward the army to meet the Philistine. (1 Samuel 17:48)");
  setTimeout(() => toast("Plain stones bounce off his bronze. Survive, and run toward him: get in close when you see your chance."), 400);
}
function g8Hurt() { if (david.inv <= 0 && david.deadT <= 0) hurtDavid(g8.x); }
function g8Set(s) { g8.state = s; g8.t = 0; }
function g8Pick() {   // the next attack: the sword up close, otherwise the spear (thrust in reach), the slam or the javelin
  const dist = g8Front() - david.x;
  if (dist < W8.REACH.sweep * T) return dist < W8.REACH.chop * T && Math.random() < 0.5 ? "chop" : "sweep";
  const opts = dist < (W8.REACH.thrust - 0.5) * T ? ["thrust", "thrust", "slam", "javelin"] : ["slam", "javelin", "javelin"];
  return opts[Math.floor(Math.random() * opts.length)];
}
function g8Attack(atk) {
  g8.atk = atk; g8Set("tell");
  if (atk === "thrust") g8Call("Hanan", "Remember the lion!");
  if (atk === "slam") g8Call("Abinadab", "Get above him!");
  if (atk === "javelin") g8Call("Tobi", "Watch the sky!");
  if (atk === "sweep") g8Call("Shammah", "Not so close! Jump!");
  if (atk === "chop") g8Call("Shammah", "Get back from the sword!");
}
function g8CloseIn() {   // David got in close (17:48): he staggers back, and the meter fills
  g8.closes++; chime(6 + g8.closes); thud(0.7); shake8(0.6);
  g8.atk = null; g8.jav = null; g8Set("reset");
  if (!W8.closeTold) { W8.closeTold = true; toast("Right up to him! He staggers back a step. Do it again."); }
  if (g8.phase === 3) { if (g8.needClose) { g8.closes = 0; g8.needClose = 0; g8Set("roar"); } return; }
  if (g8.closes >= W8.CLOSES) {
    g8.closes = 0; g8.phase++;
    if (g8.phase === 2) {
      sayLine("Goliath", "Come to me, and I will give your flesh to the birds of the sky and to the animals of the field. (1 Samuel 17:44)"); goliathChain(["lecha_elai"], 0.8);
      setTimeout(() => toast("He's angry now: faster, one attack after another. Listen for the people who came with you."), 800);
    }
    if (g8.phase === 3) g8Set("roar");
  }
}
function g8Code() {   // the throw, as far as you know it (DESIGN 4c), and A (faith) from 8-1
  const learned = typeof throwLearned === "function" ? throwLearned() : 0, n = THROW_PIECE_LEN.slice(0, Math.min(7, learned)).reduce((a, b) => a + b, 0);
  let faith = false; try { faith = !!JSON.parse(localStorage.getItem("davidProgress") || "{}").throwFaith; } catch (e) {}
  const code = THROW_CODE.slice(0, n).concat(faith ? ["a"] : []);
  return code.length ? code : ["a"];
}
function g8JavPos(j) {
  const p = Math.min(1, j.t / W8.JAV_T), x = j.x0 + (j.tx - j.x0) * p, y = j.y0 + (GR * T - 6 - j.y0) * p - Math.sin(p * Math.PI) * 170;
  const dx = (j.tx - j.x0) / W8.JAV_T, dy = ((GR * T - 6 - j.y0) - Math.cos(p * Math.PI) * Math.PI * 170) / W8.JAV_T;
  return { x, y, a: Math.atan2(dy, dx) };
}
function updateGoliath8(dt) {
  if (!g8) return;
  const d = david;
  if (!g8.on && !g8.won && d.x > g8.a0 + 2 * T && d.deadT <= 0) startG8();
  if (!g8.on || g8.won) { if (g8.won && g8.state === "thrown") g8.t += dt; return; }
  if (d.deadT > 0) {   // David fell: the fight resets (the phase reached stays); Shammah's counsel from the slope
    resetG8(); G8_MUSIC.pause();
    if (!g8.counsel) { g8.counsel = true; setTimeout(() => sayLine("Shammah", "Come here. Tell me what happened. ... Watch him: every blow, he shows you first. You've got longer than you think. And when he roars at the sky, there's your opening."), 1600); }
    return;
  }
  g8.t += dt; g8.flash = Math.max(0, g8.flash - dt);
  if (g8.callout && (g8.callout.t -= dt) <= 0) g8.callout = null;
  if (g8.state !== "reset" && d.x > g8Front() - 14) { d.x = g8Front() - 14; if (d.vx > 0) d.vx = 0; }   // he's a wall of bronze: no walking through him
  if (d.x < g8.a0 + 16) d.x = g8.a0 + 16;
  // the shockwaves and the javelin
  for (let i = g8.waves.length - 1; i >= 0; i--) {
    const w = g8.waves[i]; w.x -= W8.WAVE * dt; w.t += dt;
    if (w.x < g8.a0 - 40) { g8.waves.splice(i, 1); continue; }
    if ((d.onGround || d.state === "roll") && Math.abs(d.x - w.x) < 28) { g8Hurt(); g8.waves.splice(i, 1); }
  }
  const j = g8.jav;
  if (j && !j.down) {
    j.t += dt;
    if (j.t >= W8.JAV_T) { j.down = true; j.dt = 0; thud(0.5); sfx("arrow_with_stick-to-target", j.tx, 0.8, 0.6); if (Math.abs(d.x - j.tx) < W8.JAV_R && d.y > GR * T - 90) g8Hurt(); }
  } else if (j && j.down && (j.dt += dt) > 2.5) g8.jav = null;
  // closing in (17:48): any time but while he's staggering, roaring, or the throw
  if (g8Front() - d.x > (W8.CLOSE + 1.5) * T) g8.armed = true;   // (after a close-in, step back out before the next one counts: by the arena's end he can't stagger far)
  if (g8.armed && !["reset", "roar", "open", "thrown", "miss"].includes(g8.state) && g8Front() - d.x < W8.CLOSE * T && d.onGround && d.inv <= 0) { g8.armed = false; g8CloseIn(); return; }
  if (g8.state === "walk") {
    if (g8Front() - d.x > 3 * T) { g8.x -= W8.WALK * (g8.phase > 1 ? 1.3 : 1) * dt; g8.walkT += dt; }
    g8.x = Math.max(g8.a0 + 8 * T, g8.x);
    if ((g8.nextAt -= dt) <= 0) g8Attack(g8Pick());
  } else if (g8.state === "tell") {
    if (g8.t >= g8Tell(g8.atk)) {
      g8Set("hit");
      if (g8.atk === "slam") { thud(1); shake8(1.1); g8.waves.push({ x: g8Front() - 10, t: 0 }); sfx("stone_hit", g8.x, 0.9, 0.4); }
      if (g8.atk === "javelin") { g8.jav = { x0: g8.x - 20, y0: GR * T - 300, tx: d.x, t: 0 }; sfx("arrow_single", g8.x, 0.9, 0.6); g8Call("Gera", "Release, reload! Knock it aside!"); }
      if (g8.atk === "thrust" || g8.atk === "sweep" || g8.atk === "chop") sfx("sling_throw_quick", g8.x, 0.8, 0.45);   // the whoosh of it, deep
    }
  } else if (g8.state === "hit") {
    const front = g8Front();
    if (g8.atk === "thrust" && g8.t < 0.28 && d.x > front - W8.REACH.thrust * T && d.state !== "roll" && d.y > GR * T - W8.THRUST_Y) g8Hurt();
    if (g8.atk === "sweep" && g8.t < 0.22 && d.x > front - W8.REACH.sweep * T && d.y > GR * T - W8.SWEEP_Y) g8Hurt();
    if (g8.atk === "chop" && g8.t < 0.25 && d.x > front - W8.REACH.chop * T && d.y > GR * T - 260) g8Hurt();   // overhead and down: only distance saves you
    if (g8.t > 0.35) g8Set("recover");
  } else if (g8.state === "recover") {
    if (g8.t >= W8.RECOVER * (g8.phase > 1 ? 0.75 : 1)) {
      if (g8.phase > 1 && g8.combo < 1 && Math.random() < 0.7) { g8.combo++; g8Attack(g8Pick()); }
      else { g8.combo = 0; g8Set("walk"); g8.nextAt = (g8.phase > 1 ? 0.6 : 1.1) + Math.random() * 0.7; if (g8.phase > 1) g8Call("Shammah", "Run toward him, David!"); }
    }
  } else if (g8.state === "reset") {   // he staggers back
    g8.x = Math.min(g8.a1 - 3 * T, g8.x + W8.PUSHBACK * T * dt);
    if (g8.t > 1.0) { g8Set("walk"); g8.nextAt = 0.8; }
  } else if (g8.state === "roar") {   // phase 3: he throws his head back and roars curses at the sky. His forehead is open.
    if (!g8.roared) { g8.roared = true; goliathChain(["lamah"], 0.9); thud(1); shake8(1.4); G8_MUSIC.volume = Math.min(1, TUNE.BOSS_MUSIC_VOLUME * 0.5); }
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
    if (g8.t > 0.7) { g8.won = true; giantFall.start(() => { clear8(); backToMap(); }); }
  } else if (g8.state === "miss") {   // the stone flies wide: he laughs, and comes on again; one of the five is gone
    if (!g8.missed) {
      g8.missed = true; g8.smooth = Math.max(1, g8.smooth - 1);
      sfx("taunting_yells", undefined, 0.7, 0.6); G8_MUSIC.volume = Math.min(1, TUNE.BOSS_MUSIC_VOLUME * 1.1);
      toast(`It flies wide. He laughs. (${g8.smooth} smooth stone${g8.smooth === 1 ? "" : "s"} left. Get in close again and he'll open up.)`);
    }
    if (g8.t > 1.6) { g8.missed = false; g8.needClose = 1; g8.closes = 0; g8.code = null; g8Set("walk"); g8.nextAt = 1; }
  }
}
function stoneHitsGoliath8(s) {   // plain stones: clang off his bronze, sparks, nothing more
  if (!g8 || !g8.on || g8.won) return false;
  if (g8.jav && !g8.jav.down) {   // a stone can knock the javelin aside in the air
    const jp = g8JavPos(g8.jav);
    if (Math.hypot(s.x - jp.x, s.y - jp.y) < 34) { if (typeof sbSparks === "function") sbSparks(jp.x, jp.y, 10, true); sfx("stone_hit", jp.x, 0.9, 1.4); g8.jav = null; if (!W8.knockTold) { W8.knockTold = true; toast("Knocked it aside!"); } return true; }
  }
  if (Math.abs(s.x - g8.x) < 60 && s.y > GR * T - 300 && s.y < GR * T) {
    if (typeof sbSparks === "function") sbSparks(s.x, s.y, 6, false);
    sfx("stone_hit", s.x, 0.6, 1.7); sfx("stone_hit", s.x, 0.35, 2.4);   // clang
    if (!W8.clangTold) { W8.clangTold = true; toast("It just clangs off his bronze. Only one stone will end this."); }
    return true;
  }
  return false;
}
function drawGoliath8(camX) {
  if (!g8) return;
  const x = g8.x - camX, now = performance.now() / 1000, fl = g8.flash > 0 ? "brightness(1.8)" : "";
  const j = g8.jav;   // the javelin's shadow on the ground, then the javelin
  if (j) {
    const jp = j.down ? { x: j.tx, y: GR * T - 30 } : g8JavPos(j), p = j.down ? 1 : Math.min(1, j.t / W8.JAV_T);
    if (!j.down) { ctx.fillStyle = `rgba(0,0,0,${0.15 + 0.35 * p})`; ctx.beginPath(); ctx.ellipse(j.tx - camX, GR * T - 2, 16 + 26 * p, 5 + 3 * p, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.save(); ctx.translate(jp.x - camX, jp.y); ctx.rotate(j.down ? -2.0 : jp.a);
    ctx.strokeStyle = "#5a3a1c"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(60, 0); ctx.stroke();
    ctx.fillStyle = "#9aa3ad"; ctx.beginPath(); ctx.moveTo(60, -6); ctx.lineTo(84, 0); ctx.lineTo(60, 6); ctx.fill(); ctx.restore();
  }
  for (const w of g8.waves) {   // the slam's shockwave: dust racing along the ground toward David
    const wx = w.x - camX; ctx.save();
    for (let k = 0; k < 6; k++) { ctx.fillStyle = `rgba(206,172,122,${0.75 - k * 0.1})`; ctx.beginPath(); ctx.ellipse(wx + k * 12, GR * T - 8 - k * 3, 20 - k * 2, 12 - k, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  if (!SPR.goliath_yell) return;
  if (!g8.on && !g8.won) { drawSprite("goliath_yell", 0, x, GR * T, -1, W8.SIZE); return; }
  const spear = f => drawSprite("goliath_spear", f, x, GR * T, -1, W8.SIZE, 1, fl);
  const tellP = g8.state === "tell" ? Math.min(1, g8.t / g8Tell(g8.atk)) : 1;
  if (g8.state === "walk" && SPR.goliath_walk && g8Front() - david.x > 3 * T) drawSprite("goliath_walk", frameOf("goliath_walk", g8.walkT), x, GR * T, -1, W8.SIZE, 1, fl);
  else if ((g8.state === "tell" || g8.state === "hit" || g8.state === "recover") && SPR.goliath_spear && g8.atk) {
    const a = g8.atk, hit = g8.state === "hit", rec = g8.state === "recover";
    const SHEET = { thrust: "goliath_thrust", slam: "goliath_slam", sweep: "goliath_sweep", chop: "goliath_chop" }[a];
    const TELLF = { thrust: 6, slam: 7, sweep: 5, chop: 5 };   // the sheet's frames that are the tell; the rest are the blow
    if (SHEET && SPR[SHEET]) {
      const n = SPR[SHEET].frames, tf = TELLF[a], f = g8.state === "tell" ? Math.min(tf - 1, Math.floor(tellP * tf)) : hit ? Math.min(n - 1, tf + Math.floor(g8.t / 0.35 * (n - tf))) : n - 1;
      drawSprite(SHEET, f, x, GR * T, -1, W8.SIZE * W8.CLIP_SIZE, 1, fl);
    }
    else if (a === "thrust") { if (hit) { ctx.save(); ctx.translate(-36, 0); spear(7); ctx.restore(); } else spear(rec ? 6 : 5 + Math.min(2, Math.floor(tellP * 2.99))); }
    else if (a === "sweep") spear(hit ? 8 : rec ? 7 : 6);
    else if (a === "slam") spear(hit || rec ? 4 : tellP < 0.5 ? 8 : 9);
    else if (a === "javelin") spear(hit ? 10 : rec ? 11 + Math.min(8, Math.floor(g8.t * 8)) : 5 + Math.min(4, Math.floor(tellP * 4.99)));
    if (g8.state === "tell" && (a === "thrust" || a === "slam")) {   // the iron head glints: the tell
      const gx = x + W8.GLINT[a][0], gy = GR * T - W8.GLINT[a][1], r = 10 + 8 * Math.sin(now * 18);
      const gl = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 2); gl.addColorStop(0, "rgba(255,255,230,0.95)"); gl.addColorStop(1, "rgba(255,220,120,0)");
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = gl; ctx.fillRect(gx - r * 2, gy - r * 2, r * 4, r * 4); ctx.restore();
    }
  } else {
    const yelling = ["reset", "roar", "open", "miss"].includes(g8.state);
    drawSprite("goliath_yell", yelling ? frameOf("goliath_yell", now) : 0, x, GR * T, -1, W8.SIZE, 1, fl);
  }
  if (g8.state === "roar" || g8.state === "open") {   // his forehead, open under the helmet's edge
    const hx = x + W8.BROW[0], hy = GR * T - W8.BROW[1], r = 14 + 6 * Math.sin(now * 6);
    const gl = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 2.4); gl.addColorStop(0, "rgba(255,240,180,0.85)"); gl.addColorStop(1, "rgba(255,200,80,0)");
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = gl; ctx.fillRect(hx - r * 3, hy - r * 3, r * 6, r * 6); ctx.restore();
  }
  if (typeof drawSbSparks === "function") drawSbSparks(camX);
}
Object.assign(W8, { GLINT: { thrust: [-150, 150], slam: [-40, 330] }, BROW: [-10, 245] });   // px from his feet: the spear-head's glint, his forehead (fit to the art)
function drawGoliath8Over() {   // the meter (17:48), the five stones, the callouts, and the throw
  if (!g8 || !g8.on || g8.won) return;
  ctx.save(); ctx.textAlign = "center";
  // how close you are: a bar that fills as you close in, and a pip for each time you've reached him this phase
  const dist = Math.max(0, g8Front() - david.x), k = 1 - Math.min(1, Math.max(0, (dist - W8.CLOSE * T) / (18 * T)));
  const bw = 360, bx = W / 2 - bw / 2, by = 54;
  ctx.fillStyle = "rgba(20,12,6,0.7)"; ctx.beginPath(); ctx.roundRect(bx - 12, by - 26, bw + 24, 58, 10); ctx.fill();
  ctx.fillStyle = "#e9dcc4"; ctx.font = "14px sans-serif"; ctx.fillText(g8.phase < 3 ? "Run toward him  (1 Samuel 17:48)" : g8.needClose ? "Get in close again" : "One stone", W / 2, by - 8);
  ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.fillRect(bx, by, bw, 10);
  ctx.fillStyle = k > 0.92 ? "#ffd27a" : "#c9a46a"; ctx.fillRect(bx, by, bw * k, 10);
  const need = g8.phase < 3 ? W8.CLOSES : 1;
  for (let i = 0; i < need; i++) { ctx.fillStyle = i < g8.closes ? "#ffd27a" : "rgba(255,255,255,0.25)"; ctx.beginPath(); ctx.arc(W / 2 + (i - (need - 1) / 2) * 22, by + 22, 6, 0, Math.PI * 2); ctx.fill(); }
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
function updateWorld8(dt) { if (WORLD !== 8) return; updateWords8(dt); updateGoliath8(dt); if (typeof updateVultures === "function") updateVultures(dt); }
function drawWorld8(camX) { if (WORLD !== 8) return; if (typeof drawVultures === "function") drawVultures(camX); drawWords8(camX); drawGoliath8(camX); }
function drawWorld8Over() { if (WORLD !== 8) return; drawWords8Over(); drawGoliath8Over(); }
function stoneHitsWorld8(s) { return WORLD === 8 && stoneHitsGoliath8(s); }
