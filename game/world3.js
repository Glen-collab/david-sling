// World 3's stage pieces (loaded after world2.js): Bethlehem's flat-roofed houses to run across and the ladders up
// their walls, the barley fields and their crows, the granary with its rats (and the harmless whip snake on the beam:
// leave it alone and it does the job for you), the threshing floor.
// The houses, ladders, barley, granary and threshing floor are drawn here in plain shapes until Glen's World 3 pieces
// sheet arrives (ART_PROMPTS.md, "World 3 pieces"). Rats too, until there's a rat clip.

const W3 = {
  CROW_SPOOK: 1.4,     // David this close (tiles), running: the crow flaps up and lands again a little way off
  CROW_FLAP: 1.1,      // seconds it's up in the air
  CROW_SIZE: 1.0,      // next to the ravens of World 1 (same art)
  RAT_RUN: 150,        // px/s, scurrying about the grain sacks
  RAT_FLEE: 420,
  SNAKE_HUNT: 1.2,     // seconds after the whip snake slides off its beam before the rats bolt
};
Object.assign(TUNE.SPRITE_SIZE, { raven_peck: TUNE.SPRITE_SIZE.raven_peck || 1, raven_walk: TUNE.SPRITE_SIZE.raven_walk || 1 });

// ladders: a rung to hop onto every three rows (drawn as a ladder, not as rock ledges)
for (const l of ladders) for (const y of l.rungs) { plat(l.c, y, 2); for (let c = l.c; c < l.c + 2; c++) specialPlat.add(c + "," + y); }

// ---------------------------------------------------------------------------
// Drawing: houses, ladders, barley, the granary, the threshing floor
// ---------------------------------------------------------------------------
function drawHouse(h) {
  const x0 = h.c * T, x1 = (h.c + h.w) * T, y0 = h.r * T, y1 = GR * T, w = x1 - x0;
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, "#c9a878"); g.addColorStop(0.5, "#ddbf8f"); g.addColorStop(1, "#b8956a");
  ctx.fillStyle = g; ctx.fillRect(x0, y0, w, y1 - y0);
  ctx.strokeStyle = "rgba(120,88,52,0.25)"; ctx.lineWidth = 1;   // mud bricks showing through the plaster
  for (let y = y0 + 14, row = 0; y < y1; y += 14, row++) for (let x = x0 + (row % 2) * 16; x < x1 - 8; x += 32) {
    if ((x * 7 + y * 3) % 5 < 2) ctx.strokeRect(x + 2, y, 26, 12);
  }
  const floors = Math.max(1, Math.round((y1 - y0) / (4 * T)));   // a door at the bottom, little windows higher up
  ctx.fillStyle = "#5a3c22";
  const dw = Math.min(30, w * 0.3), dx = x0 + w * 0.5 - dw / 2;
  ctx.beginPath(); ctx.roundRect(dx, y1 - 52, dw, 52, [12, 12, 0, 0]); ctx.fill();
  ctx.fillStyle = "#3d2814";
  for (let f = 1; f <= floors; f++) {
    const wy = y1 - f * 4 * T + 34; if (wy < y0 + 30) break;
    for (const fx of w > 4 * T ? [0.22, 0.78] : [0.5]) if (f > 1 || fx !== 0.5) ctx.fillRect(x0 + w * fx - 8, wy, 16, 14);
  }
  ctx.fillStyle = "#8a6440"; ctx.fillRect(x0 - 4, y0 - 2, w + 8, 9);   // the roof edge: beams poking out under the parapet
  ctx.fillStyle = "#6b4a2c"; for (let x = x0 + 10; x < x1 - 6; x += 26) ctx.fillRect(x, y0 + 7, 8, 7);
  ctx.fillStyle = "rgba(255,240,210,0.35)"; ctx.fillRect(x0 - 4, y0 - 2, w + 8, 3);
  const sg = ctx.createLinearGradient(x0 - 22, 0, x0, 0);   // a soft shadow on the left, the sun's on the right
  sg.addColorStop(0, "rgba(0,0,0,0)"); sg.addColorStop(1, "rgba(60,40,20,0.25)"); ctx.fillStyle = sg; ctx.fillRect(x0 - 22, y0 + 8, 22, y1 - y0 - 8);
}
function drawLadder(l) {
  const x0 = l.c * T + 8, x1 = (l.c + 2) * T - 8, top = l.r * T - 22, bot = GR * T;
  ctx.strokeStyle = "#6b4423"; ctx.lineWidth = 6; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x0 + 4, bot); ctx.moveTo(x1, top); ctx.lineTo(x1 - 4, bot); ctx.stroke();
  ctx.strokeStyle = "#8a5a30"; ctx.lineWidth = 5;
  for (let y = top + 18; y < bot - 6; y += 22) { ctx.beginPath(); ctx.moveTo(x0 + 2, y); ctx.lineTo(x1 - 2, y); ctx.stroke(); }
  ctx.lineCap = "butt";
}
function drawBarley(p, now) {
  const x0 = p.c * T, x1 = (p.c + p.w) * T, y = p.y;
  for (let x = x0; x < x1; x += 7) {
    const h = 40 + ((x * 13) % 17), sway = Math.sin(now * 1.6 + x * 0.05) * 4;
    ctx.strokeStyle = (x / 7) % 3 < 1 ? "#c9a24a" : "#d9b55c"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sway * 0.3, y - h * 0.6, x + sway, y - h); ctx.stroke();
    ctx.fillStyle = "#e6c46a"; ctx.beginPath(); ctx.ellipse(x + sway, y - h - 6, 3, 8, sway * 0.04, 0, Math.PI * 2); ctx.fill();
  }
}
function drawGranary(p) {   // an open-fronted stone storehouse: sacks of grain inside, a beam across under the roof
  const x0 = p.c * T, x1 = (p.c + p.w) * T, y1 = p.y, top = y1 - 6 * T, beam = (GRANARY_BEAM_ROW + 1) * T;
  ctx.fillStyle = "#5e4a33"; ctx.fillRect(x0, top, x1 - x0, y1 - top);   // the dark inside
  ctx.fillStyle = "#b9a17c"; ctx.fillRect(x0 - 10, top - 14, x1 - x0 + 20, 18); ctx.fillRect(x0 - 10, top, 22, y1 - top); ctx.fillRect(x1 - 12, top, 22, y1 - top);
  ctx.fillStyle = "#7a5634"; ctx.fillRect(x0 + 12, beam, x1 - x0 - 24, 9);   // the beam the snake lies on
  for (let k = 0; k < 7; k++) {   // sacks of barley
    const sx = x0 + 30 + k * (x1 - x0 - 60) / 6, sh = 30 + (k % 3) * 6;
    ctx.fillStyle = k % 2 ? "#cdb486" : "#bfa275"; ctx.beginPath(); ctx.ellipse(sx, y1 - sh / 2, 16, sh / 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#9c7f52"; ctx.fillRect(sx - 5, y1 - sh - 4, 10, 6);
  }
}
function drawThreshing(p) {   // a round floor of beaten earth ringed with stones, barley piled on it
  const cx = (p.c + p.w / 2) * T, y = p.y, rx = p.w * T / 2;
  ctx.fillStyle = "#b8976a"; ctx.beginPath(); ctx.ellipse(cx, y - 4, rx, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#d9b55c"; ctx.beginPath(); ctx.moveTo(cx - rx * 0.5, y - 6); ctx.quadraticCurveTo(cx, y - 46, cx + rx * 0.5, y - 6); ctx.fill();
  ctx.fillStyle = "#cfc2a6"; for (let a = 0; a < 14; a++) { const t = a / 14 * Math.PI; ctx.beginPath(); ctx.ellipse(cx - Math.cos(t) * rx, y - 2, 9, 7, 0, 0, Math.PI * 2); ctx.fill(); }
}
function drawWorld3(camX) {
  if (!houses.length && !ladders.length && !setPieces.some(p => p.kind === "barley" || p.kind === "granary" || p.kind === "threshing")) return;
  const now = performance.now() / 1000;
  ctx.save(); ctx.translate(-Math.round(camX), 0);
  const on = (x0, x1) => x1 > camX - 60 && x0 < camX + W + 60;
  for (const p of setPieces) {
    if (!on(p.c * T, (p.c + (p.w || 4)) * T)) continue;
    if (p.kind === "granary") drawGranary(p);
    else if (p.kind === "threshing") drawThreshing(p);
  }
  for (const h of houses) if (on(h.c * T, (h.c + h.w) * T)) drawHouse(h);
  for (const l of ladders) if (on(l.c * T, (l.c + 2) * T)) drawLadder(l);
  for (const p of setPieces) if (p.kind === "barley" && on(p.c * T, (p.c + p.w) * T)) drawBarley(p, now);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Crows in the barley: pecking away at it. Walking past doesn't bother a crow (it just hops off and lands again);
// a stone sends it off for good. Clear a field and the barley's saved.
// ---------------------------------------------------------------------------
CRITTER_ART.crow = { idle: "raven_peck", move: "raven_walk", len: 40, h: 46, box: k => ({ x0: k.x - 30, x1: k.x + 30, y0: k.y - 50, y1: k.y }) };
CRITTER_ART.rat = { idle: "rat", move: "rat", len: 30, h: 20, box: k => ({ x0: k.x - 22, x1: k.x + 22, y0: k.y - 22, y1: k.y }) };
const fields = setPieces.filter(p => p.kind === "barley").map(p => ({ p, x0: p.c * T, x1: (p.c + p.w) * T, saved: false }));
const granaries = setPieces.filter(p => p.kind === "granary").map(p => ({ p, x0: p.c * T, x1: (p.c + p.w) * T, saved: false, huntT: 0 }));
for (const g of granaries) g.snake = snakes.find(s => s.kind === "whip" && s.x > g.x0 && s.x < g.x1);
for (const k of critters) if (k.kind === "crow") { k.facing = Math.random() < 0.5 ? -1 : 1; k.t = Math.random() * 3; }

function updateCrow(k, dx, sameLevel, dt) {
  if (k.state === "flap") {   // up, along, and down again
    const f = Math.min(1, k.t / W3.CROW_FLAP);
    k.x = k.fx0 + (k.fx1 - k.fx0) * f; k.y = k.y0 - Math.sin(f * Math.PI) * 70;
    if (f >= 1) { k.y = k.y0; setCrit(k, "idle"); }
    return;
  }
  if (k.t > 2.5 + (k.home % 7) * 0.3) { k.facing = -k.facing; k.t = 0; }   // turns about now and then, pecking
  if (sameLevel && Math.abs(dx) < W3.CROW_SPOOK * T && david.deadT <= 0) {
    const away = Math.sign(k.x - david.x) || 1, to = Math.max(k.home - 3 * T, Math.min(k.home + 3 * T, k.x + away * 2.5 * T));
    k.fx0 = k.x; k.fx1 = Math.abs(to - k.x) < T ? k.x - away * 3 * T : to; k.facing = Math.sign(k.fx1 - k.x) || 1;
    setCrit(k, "flap");
  }
}
function stoneHitsCrow(k, s) {
  k.gone = true; k.fly = true; k.facing = Math.sign(k.x - david.x) || 1; k.vx = k.facing * 260; k.vy = -220; stoneHit(s, 0.4);
  const f = fields.find(f => k.home >= f.x0 - T && k.home <= f.x1 + T);
  const left = f ? critters.filter(c => c.kind === "crow" && !c.gone && c.home >= f.x0 - T && c.home <= f.x1 + T).length : 0;
  if (f && !left && !f.saved) {
    f.saved = true; toast("The barley's safe from the crows. Bread for the prophet's feast!");
    pickups.push({ name: "bread", x: (f.x0 + f.x1) / 2, y: f.p.y, t: 0, taken: false });
  } else toast(left ? `Crow driven off! ${left} still in the barley.` : "Crow driven off!");
  return !s.power;
}
function drawCrow(k, x) {
  const sz = W3.CROW_SIZE;
  if (k.gone || k.state === "flap") { drawSprite("raven_fly", frameOf("raven_fly", k.t * 1.4), x, k.y, k.facing, sz, k.alpha); return; }
  drawSprite("raven_peck", frameOf("raven_peck", k.t), x, k.y, k.facing, sz, k.alpha);
}

// ---------------------------------------------------------------------------
// Rats in the granary: scurrying about the sacks. Sling them out, or walk in and leave the whip snake on the beam
// alone: it slides down after them and they bolt. (Sling the snake and you've hit the wrong one, §3d.)
// ---------------------------------------------------------------------------
function updateRat(k, dx, sameLevel, dt) {
  if (k.state === "idle") setCrit(k, "run");
  if (k.state === "pause") { k.vx = 0; if (k.t > 0.4 + (k.home % 5) * 0.15) setCrit(k, "run"); return; }
  k.x += k.facing * W3.RAT_RUN * dt;
  if (Math.abs(k.x - k.home) > (k.range || 2 * T) && Math.sign(k.x - k.home) === k.facing) { k.facing = -k.facing; setCrit(k, "pause"); }
}
function ratsFlee(g, why) {
  for (const k of critters) if (k.kind === "rat" && !k.gone && k.home >= g.x0 - T && k.home <= g.x1 + T) {
    k.gone = true; k.facing = Math.sign(k.x - (g.x0 + g.x1) / 2) || 1; k.vx = k.facing * W3.RAT_FLEE;
  }
  if (!g.saved) { g.saved = true; toast(why); pickups.push({ name: "cheese", x: (g.x0 + g.x1) / 2, y: g.p.y, t: 0, taken: false }); }
}
function stoneHitsRat(k, s) {
  k.gone = true; k.facing = Math.sign(k.x - david.x) || 1; k.vx = k.facing * W3.RAT_FLEE; stoneHit(s, 0.3);
  const g = granaries.find(g => k.home >= g.x0 - T && k.home <= g.x1 + T);
  const left = g ? critters.filter(c => c.kind === "rat" && !c.gone && c.home >= g.x0 - T && c.home <= g.x1 + T).length : 0;
  if (g && !left) ratsFlee(g, "The granary's clear. Father's barley is safe.");
  else toast(left ? `Rat chased off! ${left} still in the grain.` : "Rat chased off!");
  return !s.power;
}
function drawRat(k, x) {   // a little brown rat (drawn until there's a rat clip)
  const y = k.y, f = k.facing, run = k.gone || k.state === "run", leg = run ? Math.sin(performance.now() / 40) * 3 : 0;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.translate(x, y); ctx.scale(f, 1);
  ctx.strokeStyle = "#c79a8a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-12, -6); ctx.quadraticCurveTo(-26, -2, -32, -10); ctx.stroke();
  ctx.fillStyle = "#6e5646"; ctx.beginPath(); ctx.ellipse(0, -8, 14, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(13, -9, 7, 5, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#8c6f5c"; ctx.beginPath(); ctx.arc(9, -14, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(15, -10, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#c79a8a"; ctx.beginPath(); ctx.arc(20, -8, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#4e3c30"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-6, -3); ctx.lineTo(-6 + leg, 0); ctx.moveTo(7, -3); ctx.lineTo(7 - leg, 0); ctx.stroke();
  ctx.restore();
}

function updateWorld3(dt) {
  for (const g of granaries) {   // the whip snake slid off its beam (David came in and left it be): the rats bolt
    if (g.saved || !g.snake) continue;
    const sn = g.snake, inside = david.x > g.x0 && david.x < g.x1 && david.deadT <= 0;
    if (sn.state === "idle" && !sn.gone && inside) { sn.state = "leave"; sn.t = 0; sn.facing = Math.sign((g.x0 + g.x1) / 2 - sn.x) || 1; }   // David came in under it
    if (sn.state === "leave" && !(sn.gone && sn.vy)) {   // (gone with a fling = it was slung)
      g.huntT += dt; if (g.huntT > W3.SNAKE_HUNT) ratsFlee(g, "The whip snake went after the rats. Let it do its job: the granary's clear.");
    }
  }
}
