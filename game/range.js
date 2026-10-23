// ---------------------------------------------------------------------------
// Gera's sling range (DESIGN, World 7 map: "a callback to World 4. Opens when all World 7 lost things are found. A bonus
// target challenge with Gera, plus a Psalm piece"). index.html#range, from its stop by the carved target at the stream
// (map.js MAP_WORLDS[7].sides). One screen: Gera at the left, a rock to throw from, a low wall for jars at the far end.
// A round is RANGE.TIME seconds: targets pop up (on posts, on ropes, swinging, jars on the wall, small gourds up high),
// stay a few seconds and go; each is worth points; two hits close together (quick release) earn Gera's bonus. At the
// end: the score, the best (davidProgress.rangeBest), an olive for every RANGE.OLIVE_PER points, and the first time the
// score reaches RANGE.GOLD, Gera's verse (Psalm 18:34), which goes in the Journal with World 7's notes (journal.js).
// Gera's lines are Claude's drafts for Glen to change.
// ---------------------------------------------------------------------------
const RANGE = {
  TIME: 60,                 // seconds a round
  COUNT: 3,                 // the count-in
  BRONZE: 15, SILVER: 30, GOLD: 45,   // scores for each mark (GOLD: Gera's verse, the first time)
  OLIVE_PER: 5,             // an olive for every this many points
  BONUS_GAP: 0.6,           // seconds between two hits for the quick-release bonus
  SPAWN: [1.2, 0.7],        // seconds between new targets: at the start, and in the last 20 seconds
  MAX_UP: [3, 5],           // targets up at once: at the start, and in the last 20 seconds
  // kind: points, radius, seconds it stays up, how often it comes (weight)
  KINDS: {
    post:  { pts: 1, r: 24, life: 5.0, w: 3 },
    rope:  { pts: 2, r: 24, life: 6.0, w: 3 },
    swing: { pts: 2, r: 24, life: 6.0, w: 2 },
    jar:   { pts: 1, r: 26, life: 7.0, w: 2 },
    small: { pts: 3, r: 14, life: 3.5, w: 1.5 },
  },
};
const RANGE_LINES = {   // Claude's drafts (Glen to change)
  hello: "Shepherd! So they've let you go out to him. Before you do, one more round on my range, like the yard at Gibeah. A minute. Hit what you can. Two quick ones, release, reload, and I'll count you extra.",
  again: "Again? Good. A slinger never stops practicing.",
  low: "Not bad. Keep your eye on the target, not the sling.",
  bronze: "A fair arm. A few more years and Benjamin would take you.",
  silver: "Now that's throwing. My captain would want you on the wall.",
  gold: "Ha! Benjamin's own seven hundred couldn't do better. Here. Remember this when you walk out there: \"He teaches my hands to war, so that my arms bend a bow of bronze.\" (Psalm 18:34)",
  goldAgain: "Gold again. You don't need me anymore, shepherd.",
};
const rng = { on: LEVEL_NAME === "range", phase: "hello", t: 0, score: 0, hits: 0, targets: [], spawnT: 0, lastHit: -9, floats: [], round: 0 };
const rangeProg = () => { try { return JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); } catch (e) { return {}; } };
const rangeLate = () => rng.phase === "play" && rng.t > RANGE.TIME - 20;
function geraSay(text) { sayLine("Gera", text); rng.quiet = 0; }   // (and the round waits until he's done)
function rangeStart() {   // a new round: the count-in
  Object.assign(rng, { phase: "count", t: 0, score: 0, hits: 0, targets: [], spawnT: 0.4, lastHit: -9, floats: [], round: rng.round + 1 });
}
// where a target is now (bobbing on its rope, swinging)
function rangePos(g) {
  const k = rng.t;
  if (g.kind === "rope") return { x: g.x, y: g.y + Math.sin(k * 1.5 + g.ph) * 1.8 * T };
  if (g.kind === "swing") { const a = Math.sin(k * 1.8 + g.ph) * 0.9, L = 3 * T; return { x: g.x + Math.sin(a) * L, y: g.y + Math.cos(a) * L }; }
  return { x: g.x, y: g.y };
}
function rangeSpawn() {
  const late = rangeLate(), up = rng.targets.filter(g => !g.hit).length;
  if (up >= RANGE.MAX_UP[late ? 1 : 0]) return;
  const ks = Object.keys(RANGE.KINDS), tot = ks.reduce((a, k) => a + RANGE.KINDS[k].w, 0);
  let r = Math.random() * tot, kind = ks[0];
  for (const k of ks) { r -= RANGE.KINDS[k].w; if (r <= 0) { kind = k; break; } }
  const rnd = (a, b) => a + Math.random() * (b - a);
  for (let tries = 0; tries < 8; tries++) {
    let x, y;
    if (kind === "post") { x = rnd(14, 27) * T; y = rnd(13.2, 15) * T; }
    else if (kind === "rope") { x = rnd(14, 34) * T; y = rnd(7.5, 10.5) * T; }
    else if (kind === "swing") { x = rnd(15, 27) * T; y = rnd(4.5, 6) * T; }   // y: the bar it swings from
    else if (kind === "jar") { x = (30.5 + Math.floor(Math.random() * 5)) * T; y = 13 * T - 30; }   // on the wall at the far end
    else { x = rnd(16, 34) * T; y = rnd(3.5, 7.5) * T; }
    const g = { kind, x, y, ph: Math.random() * 6, born: rng.t, life: RANGE.KINDS[kind].life * (late ? 0.85 : 1), hit: false, hitT: 0 };
    const p = rangePos(g);
    if (rng.targets.some(o => !o.hit && Math.hypot(rangePos(o).x - p.x, rangePos(o).y - p.y) < 90)) continue;
    rng.targets.push(g); sfx("stone_hit", x, 0.15, 2.2); return;
  }
}
function updateRange(dt) {
  if (!rng.on) return;
  rng.t += dt; rng.quiet = dialog.t > 0 ? 0 : (rng.quiet || 0) + dt;   // (quiet: how long since Gera stopped talking, so the A that closes his line doesn't start a round too)
  for (const f of rng.floats) f.t += dt;
  rng.floats = rng.floats.filter(f => f.t < 1.2);
  if (rng.phase === "hello") {   // Gera's welcome (the stage waits on it until A)
    if (rng.t > 0.8 && !rng.said) { rng.said = true; geraSay(RANGE_LINES.hello); }
    if (rng.said && rng.quiet > 0.3) rangeStart();
    return;
  }
  if (rng.phase === "count") {
    const n = Math.ceil(RANGE.COUNT - rng.t);
    if (n !== rng.lastN && n > 0) { rng.lastN = n; chime(2); }
    if (rng.t >= RANGE.COUNT) { rng.phase = "play"; rng.t = 0; rng.lastN = null; chime(9); }
    return;
  }
  if (rng.phase === "play") {
    rng.spawnT -= dt;
    if (rng.spawnT <= 0) { rangeSpawn(); rng.spawnT = RANGE.SPAWN[rangeLate() ? 1 : 0]; }
    rng.targets = rng.targets.filter(g => g.hit ? rng.t - g.hitT < 1.2 : rng.t - g.born < g.life);
    const left = Math.ceil(RANGE.TIME - rng.t);
    if (left <= 5 && left !== rng.lastN && left > 0) { rng.lastN = left; chime(1); }
    if (rng.t >= RANGE.TIME) rangeEnd();
    return;
  }
  if (rng.phase === "done") {   // the result: A again, B back to the map (once Gera has had his say)
    rng.targets = rng.targets.filter(g => g.hit && rng.t - g.hitT < 1.2);
    if (rng.t > 1.2 && rng.quiet > 0.3) {
      if (pressed("a") || pressed("start")) { geraSay(RANGE_LINES.again); rng.phase = "hello"; rng.said = true; rng.t = 0; }
      else if (pressed("b")) backToMap();
    }
  }
}
function rangeEnd() {
  rng.phase = "done"; rng.t = 0; rng.targets = rng.targets.filter(g => g.hit);
  const p = rangeProg(), s = rng.score;
  rng.prevBest = p.rangeBest || 0; rng.newBest = s > rng.prevBest;
  rng.olives = Math.floor(s / RANGE.OLIVE_PER);
  const firstGold = s >= RANGE.GOLD && !p.rangeGold;
  p.rangeBest = Math.max(rng.prevBest, s); p.olives = (p.olives || 0) + rng.olives; david.olives += rng.olives;
  if (firstGold) p.rangeGold = true;
  try { localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); } catch (e) {}
  rng.mark = s >= RANGE.GOLD ? "gold" : s >= RANGE.SILVER ? "silver" : s >= RANGE.BRONZE ? "bronze" : "low";
  chime(7); setTimeout(() => chime(11), 200);
  if (firstGold) sfx("extra_life");
  setTimeout(() => geraSay(firstGold ? RANGE_LINES.gold : rng.mark === "gold" ? RANGE_LINES.goldAgain : RANGE_LINES[rng.mark]), 900);
}
function stoneHitsRange(s) {   // main.js stone loop
  if (!rng.on || rng.phase !== "play") return false;
  for (const g of rng.targets) {
    if (g.hit || rng.t - g.born < 0.2) continue;
    const K = RANGE.KINDS[g.kind], p = rangePos(g);
    if (Math.hypot(s.x - p.x, s.y - p.y) > K.r + 6) continue;
    g.hit = true; g.hitT = rng.t; g.hx = p.x; g.hy = p.y; stoneHit(s, 0.5);
    for (let k = 0; k < (g.kind === "jar" ? 16 : 10); k++) bits.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 420, vy: -Math.random() * 420, life: 0.8, color: g.kind === "jar" ? (k % 2 ? "#b8693a" : "#8a4a26") : g.kind === "small" ? (k % 2 ? "#c8c040" : "#7a8a2a") : (k % 2 ? "#c0392b" : "#e8d3a8") });
    let pts = K.pts, txt = `+${K.pts}`;
    if (rng.t - rng.lastHit < RANGE.BONUS_GAP) { pts += 1; txt += "  Release, reload! +1"; }
    rng.lastHit = rng.t; rng.score += pts; rng.hits++;
    rng.floats.push({ x: p.x, y: p.y - 30, text: txt, t: 0 });
    return !s.power;
  }
  return false;
}
// ---- drawing ----
function drawRange(camX) {
  if (!rng.on) return;
  // Gera, at the left, watching (arms crossed while you throw; laughing at a good score)
  if (SPR.gera) {
    const talking = dialog.t > 0 && dialog.who === "Gera", now = performance.now() / 1000;
    const i = talking ? (rng.phase === "done" && rng.mark !== "low" ? (Math.floor(now * 1.4) % 2 ? 4 : 1) : 1) : rng.phase === "play" ? 5 : 0;
    drawSprite("gera", i, 1.2 * T - camX, GR * T, -1);
  }
  for (const g of rng.targets) {
    const K = RANGE.KINDS[g.kind];
    let p = g.hit ? { x: g.hx, y: g.hy + Math.min(400, (rng.t - g.hitT) ** 2 * 900) } : rangePos(g);
    const age = rng.t - g.born, left = g.life - age;
    if (!g.hit && left < 0.8 && Math.floor(age * 10) % 2) continue;   // about to go: it blinks
    const pop = g.hit ? 1 : Math.min(1, age / 0.25), x = p.x - camX;
    ctx.save();
    if (!g.hit && g.kind === "rope") { ctx.strokeStyle = "#7a5a32"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, p.y - K.r); ctx.stroke(); }
    if (!g.hit && g.kind === "swing") { ctx.strokeStyle = "#7a5a32"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(g.x - camX, g.y); ctx.lineTo(x, p.y - K.r); ctx.stroke(); ctx.fillStyle = "#5a3e22"; ctx.fillRect(g.x - camX - 30, g.y - 6, 60, 8); }
    if (!g.hit && g.kind === "small") { ctx.strokeStyle = "#7a5a32"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, p.y - K.r); ctx.stroke(); }
    if (g.kind === "jar") { ctx.globalAlpha = g.hit ? Math.max(0, 1 - (rng.t - g.hitT)) : 1; drawItem("gift_oil", x, p.y + 30, 0.36 * pop); ctx.restore(); continue; }
    if (!g.hit && g.kind === "post") { ctx.fillStyle = "#6b4a2a"; ctx.fillRect(x - 4, p.y, 8, GR * T - p.y); }
    ctx.translate(x, p.y); ctx.scale(pop, pop);
    if (g.hit) { ctx.rotate((rng.t - g.hitT) * 6); ctx.globalAlpha = Math.max(0, 1 - (rng.t - g.hitT)); }
    const R = K.r;
    if (g.kind === "small") {   // a little gourd on a string: worth the most
      ctx.fillStyle = "#b8b040"; ctx.beginPath(); ctx.ellipse(0, 2, R, R * 1.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#5a5a1a"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#6a8a2a"; ctx.fillRect(-2, -R - 6, 4, 8);
    } else {   // straw and wood, painted rings (like Gera's yard at Gibeah)
      ctx.fillStyle = "#c9a56a"; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#6b4a2a"; ctx.lineWidth = 3; ctx.stroke();
      for (const [rr, col] of [[R * 0.72, "#a8322a"], [R * 0.48, "#efe3c4"], [R * 0.24, "#a8322a"]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.fill(); }
    }
    if (!g.hit) { ctx.strokeStyle = `rgba(255,216,74,${0.55 + 0.3 * Math.sin(rng.t * 5 + g.ph)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, R + 4, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }
  ctx.save(); ctx.textAlign = "center"; ctx.font = "bold 22px sans-serif";
  for (const f of rng.floats) {
    ctx.globalAlpha = Math.max(0, 1 - f.t / 1.2); ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillText(f.text, f.x - camX + 2, f.y - f.t * 40 + 2);
    ctx.fillStyle = f.text.includes("Release") ? "#ffd166" : "#fff"; ctx.fillText(f.text, f.x - camX, f.y - f.t * 40);
  }
  ctx.restore();
}
function drawRangeOver() {   // the clock and the score (top middle), the count-in, the result
  if (!rng.on) return;
  ctx.save(); ctx.textAlign = "center";
  if (rng.phase === "play" || rng.phase === "done") {
    const left = rng.phase === "play" ? Math.max(0, RANGE.TIME - rng.t) : 0;
    const y = 44;   // (under the help line)
    ctx.fillStyle = "rgba(25,14,6,0.65)"; ctx.beginPath(); ctx.roundRect(W / 2 - 150, y, 300, 62, 12); ctx.fill();
    ctx.fillStyle = left <= 5 && rng.phase === "play" ? "#ff9a6a" : "#fff"; ctx.font = "bold 28px sans-serif"; ctx.fillText(`${Math.ceil(left)}`, W / 2 - 80, y + 36);
    ctx.fillStyle = "#ffe08a"; ctx.font = "15px sans-serif"; ctx.fillText("seconds", W / 2 - 80, y + 54); ctx.fillText("score", W / 2 + 70, y + 54);
    ctx.fillStyle = "#fff"; ctx.font = "bold 28px sans-serif"; ctx.fillText(`${rng.score}`, W / 2 + 70, y + 36);
  }
  if (rng.phase === "count") {
    const n = Math.ceil(RANGE.COUNT - rng.t), f = 1 - (rng.t % 1);
    ctx.globalAlpha = Math.min(1, f * 1.5); ctx.fillStyle = "#ffe08a"; ctx.font = `bold ${Math.round(80 + 40 * (1 - f))}px Georgia, serif`;
    ctx.fillText(n > 0 ? String(n) : "", W / 2, H / 2 - 40); ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff6e2"; ctx.font = "20px sans-serif"; ctx.fillText("Hit the targets with the gold rim. Two quick hits earn a bonus.", W / 2, H / 2 + 10);
  }
  if (rng.phase === "done" && rng.t > 0.4) {
    const f = Math.min(1, (rng.t - 0.4) / 0.5), y = 128;
    ctx.globalAlpha = f; ctx.fillStyle = "rgba(25,14,6,0.8)"; ctx.beginPath(); ctx.roundRect(W / 2 - 260, y, 520, 200, 16); ctx.fill();
    ctx.fillStyle = "#ffe08a"; ctx.font = "italic 26px Georgia, serif"; ctx.fillText("Gera's Sling Range", W / 2, y + 40);
    ctx.fillStyle = "#fff"; ctx.font = "bold 46px sans-serif"; ctx.fillText(`${rng.score}`, W / 2, y + 96);
    const markName = { gold: "Gold", silver: "Silver", bronze: "Bronze", low: "" }[rng.mark];
    ctx.font = "19px sans-serif"; ctx.fillStyle = rng.newBest ? "#ffd166" : "#e9dcc4";
    ctx.fillText(`${rng.hits} hit${rng.hits === 1 ? "" : "s"}${markName ? "  ·  " + markName : ""}  ·  ${rng.newBest ? "a new best!" : "best " + rng.prevBest}  ·  +${rng.olives} olive${rng.olives === 1 ? "" : "s"}`, W / 2, y + 132);
    ctx.fillStyle = "#c9bca4"; ctx.font = "16px sans-serif"; ctx.fillText(`Bronze ${RANGE.BRONZE}  ·  Silver ${RANGE.SILVER}  ·  Gold ${RANGE.GOLD}`, W / 2, y + 160);
    if (rng.t > 1.2 && rng.quiet > 0.3) { ctx.fillStyle = "#e9dcc4"; ctx.font = "17px sans-serif"; ctx.fillText("A: go again      B: back to the map", W / 2, y + 186); }
  }
  ctx.restore();
}
// the range's own note in the Journal (journal.js journalNotes, with World 7's): once the gold is won
function rangeNote() {
  const best = rangeProg().rangeBest || 0;
  return {
    left: [{ at: 5, size: "entry", segs: [{ text: "Gera's range, by the stream. One more round before the valley.", at: 5 }] },
           { at: 5, size: "small", segs: [{ text: `Best: ${best}. Release, reload, release.`, at: 5 }] }],
    right: [{ at: 5, size: "entry", segs: [{ text: "\"He teaches my hands to war, so that my arms bend a bow of bronze.\"", at: 5 }] },
            { at: 5, size: "small", segs: [{ text: "Psalm 18:34", at: 5 }] },
            { at: 5, size: "small", segs: [{ text: "Gera says Benjamin's seven hundred could hit a hair (Judges 20:16). The LORD taught my hands too, out with the sheep.", at: 5 }] }],
  };
}
