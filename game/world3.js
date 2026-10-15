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
const ladderRungs = new Set(); for (const l of ladders) for (const y of l.rungs) for (let c = l.c; c < l.c + 2; c++) ladderRungs.add(c + "," + y);
function onLadder(d) {   // main.js: standing on a rung? (Down steps down it)
  const on = ladderRungs.has(Math.floor(d.x / T) + "," + Math.floor(d.y / T));
  if (on && !W3.ladderTold) { W3.ladderTold = true; toast("A ladder: hold Up to climb it, Down to climb down, A to jump off."); }
  return on;
}
for (const p of setPieces) if (p.kind === "stepstone") specialPlat.add(p.c + "," + GR);   // stepping stones: drawn as rocks, not as ledges

// ---------------------------------------------------------------------------
// Drawing: houses, ladders, barley, the granary, the threshing floor
// ---------------------------------------------------------------------------
// Glen's pieces (assets/items/town_*.png, cut from his side-view sheet): the houses are stone walls built up from his
// low wall, row on row, with his mud roof slab on top
const ok = n => ITEM[n] && ITEM[n].naturalWidth;
const TOWN_STONE = "none";   // a filter for Glen's stone pieces if they ever need matching to the houses (his pale sheet matches as it is)
function drawStoneHouse(h) {
  const x0 = h.c * T, x1 = (h.c + h.w) * T, y0 = h.r * T, y1 = GR * T, w = x1 - x0, img = ITEM.town_low_wall;
  const rh = 34, rw = img.naturalWidth * rh / img.naturalHeight;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, y1 - y0); ctx.clip();
  ctx.fillStyle = "#a8703f"; ctx.fillRect(x0, y0, w, y1 - y0);
  ctx.filter = TOWN_STONE;
  for (let y = y1 - rh, row = 0; y > y0 - rh; y -= rh * 0.82, row++) {
    for (let x = x0 - ((row * 0.37 + h.c * 0.13) % 1) * rw; x < x1; x += rw - 6) ctx.drawImage(img, x, y, rw, rh);
  }
  ctx.filter = "none";
  const dw = Math.min(30, w * 0.3), dx = x0 + w * 0.5 - dw / 2;   // the doorway: a wooden door in the dark
  ctx.fillStyle = "#2e2014"; ctx.beginPath(); ctx.roundRect(dx - 4, y1 - 56, dw + 8, 56, [6, 6, 0, 0]); ctx.fill();
  ctx.fillStyle = "#7a5432"; ctx.fillRect(dx, y1 - 50, dw, 50); ctx.fillStyle = "#5e3f24"; for (let k = 1; k < 3; k++) ctx.fillRect(dx + dw * k / 3 - 1, y1 - 50, 2, 50);
  ctx.fillStyle = "#2e2014";
  for (let wy = y1 - 4 * T + 30; wy > y0 + 24; wy -= 4 * T) for (const fx of w > 4 * T ? [0.22, 0.78] : [0.5]) if (wy < y1 - 70 || fx !== 0.5) ctx.fillRect(x0 + w * fx - 8, wy, 16, 16);
  const sg = ctx.createLinearGradient(x0, 0, x0 + 22, 0); sg.addColorStop(0, "rgba(40,28,14,0.35)"); sg.addColorStop(1, "rgba(40,28,14,0)");
  ctx.fillStyle = sg; ctx.fillRect(x0, y0, 22, y1 - y0);
  ctx.restore();
  const slab = ITEM.town_roof_slab;   // the flat roof: beams and packed mud, overhanging a little
  if (ok("town_roof_slab")) ctx.drawImage(slab, x0 - 10, y0 - 12, w + 20, 26);
}
const HOUSE_SINK = 16;   // how far houses and stairs sink into the topsoil (pixels), like the dry-stone walls
const HOUSE_DEPTH = [28, 18];   // the box's depth: how far the roof top and the side wall reach right and up (pixels)
const HOUSE_BRICK = 0.34;       // size of Glen's side-profile bricks on the houses
// A house seen from the side, as a box: Glen's side-profile bricks on the front wall, the same bricks shaded on the
// side wall going back, a plastered roof on top with his beam along the front edge, a door and little windows.
function brickFill(x0, y0, x1, y1, seed) {   // his two-row brick strip, laid in courses across a face (clip first)
  const img = ITEM.town_side_low_wall, th = img.naturalHeight * HOUSE_BRICK, tw = img.naturalWidth * HOUSE_BRICK;
  for (let y = y1 - th, row = 0; y > y0 - th; y -= th - 2, row++)
    for (let x = x0 - ((row * 0.43 + seed * 0.17) % 1) * tw; x < x1; x += tw - 2) ctx.drawImage(img, x, y, tw, th);
}
function drawSideHouse(h) {
  const x0 = h.c * T, x1 = (h.c + h.w) * T, y0 = h.r * T, y1 = GR * T + HOUSE_SINK, w = x1 - x0, [D, E] = HOUSE_DEPTH;
  const face = (pts) => { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let k = 2; k < pts.length; k += 2) ctx.lineTo(pts[k], pts[k + 1]); ctx.closePath(); };
  ctx.save();   // the side wall going back, in shadow
  face([x1, y0, x1 + D, y0 - E, x1 + D, y1 - E, x1, y1]); ctx.clip();
  brickFill(x1 - 40, y0 - E, x1 + D, y1, h.c + 5);
  ctx.fillStyle = "rgba(70,45,22,0.55)"; ctx.fillRect(x1, y0 - E, D, y1 - y0 + E);
  ctx.restore();
  face([x0, y0, x0 + D, y0 - E, x1 + D, y0 - E, x1, y0]);   // the flat roof of packed mud plaster, lit by the sun
  const rg = ctx.createLinearGradient(0, y0 - E, 0, y0); rg.addColorStop(0, "#efdcb2"); rg.addColorStop(1, "#d9c08e");
  ctx.fillStyle = rg; ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, y1 - y0); ctx.clip();   // the front wall
  brickFill(x0, y0, x1, y1, h.c);
  const sg = ctx.createLinearGradient(0, y0, 0, y0 + 40); sg.addColorStop(0, "rgba(60,40,20,0.3)"); sg.addColorStop(1, "rgba(60,40,20,0)");
  ctx.fillStyle = sg; ctx.fillRect(x0, y0, w, 40);   // shade under the roof's edge
  const dw = Math.min(30, w * 0.3), dx = x0 + w * 0.5 - dw / 2, gy = GR * T;   // the doorway: a wooden door in the dark
  ctx.fillStyle = "#2e2014"; ctx.beginPath(); ctx.roundRect(dx - 4, gy - 56, dw + 8, 56 + HOUSE_SINK, [6, 6, 0, 0]); ctx.fill();
  ctx.fillStyle = "#8a6238"; ctx.fillRect(dx, gy - 50, dw, 50 + HOUSE_SINK); ctx.fillStyle = "#6b4a2a"; for (let k = 1; k < 3; k++) ctx.fillRect(dx + dw * k / 3 - 1, gy - 50, 2, 50 + HOUSE_SINK);
  for (let wy = gy - 4 * T + 30; wy > y0 + 24; wy -= 4 * T)   // little windows, one floor apart
    for (const fx of w > 4 * T ? [0.22, 0.78] : [0.5]) if (wy < gy - 70 || fx !== 0.5) {
      ctx.fillStyle = "#c9b088"; ctx.fillRect(x0 + w * fx - 11, wy - 3, 22, 22); ctx.fillStyle = "#2e2014"; ctx.fillRect(x0 + w * fx - 8, wy, 16, 16);
    }
  ctx.restore();
  ctx.strokeStyle = "rgba(70,45,22,0.5)"; ctx.lineWidth = 1.5;   // crisp edges where the faces meet
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1 + D, y0 - E); ctx.moveTo(x1, y0); ctx.lineTo(x1, y1); ctx.stroke();
  if (ok("town_side_beam")) ctx.drawImage(ITEM.town_side_beam, x0 - 6, y0 - 4, w + 12, 11);   // the roof beam along the front edge
}
// Glen's side-view houses (town_house_shed/tower/big.png, cut off the ground he came on). Per picture, in its own
// pixels: the wall's left and right edge, the roof line David stands on, and two cuts. Above the first cut (the roof)
// and below the second (door and windows) are drawn at true shape; the plain wall between repeats to make the house as
// tall as its blocks. A house too short for both parts is squashed a little instead.
const HOUSE_LOOKS = {
  shed:  { wx0: 35, wx1: 393, walk: 31, a: 91,  b: 146 },
  tower: { wx0: 30, wx1: 502, walk: 37, a: 155, b: 275 },
  big:   { wx0: 52, wx1: 708, walk: 12, a: 187, b: 287 },
  fort:  { wx0: 102, wx1: 1607, walk: 136, a: 506, b: 546 },
};
function drawHouseArt(h, img, L) {
  const x0 = h.c * T, y0 = h.r * T, y1 = GR * T + HOUSE_SINK, w = h.w * T, s = w / (L.wx1 - L.wx0);
  const W = img.naturalWidth, H = img.naturalHeight, dx = x0 - L.wx0 * s, dw = W * s;
  const need = (L.a - L.walk + H - L.b) * s, sy = Math.min(1, (y1 - y0) / need) * s;
  const topEnd = y0 + (L.a - L.walk) * sy, botStart = y1 - (H - L.b) * sy, band = (L.b - L.a) * s;
  for (let y = topEnd; y < botStart; y += band - 1) {   // the plain wall between roof and door, as often as it takes
    const hh = Math.min(band, botStart - y + 1);
    ctx.drawImage(img, 0, L.a, W, hh / s, dx, y, dw, hh);
  }
  ctx.drawImage(img, 0, L.b, W, H - L.b, dx, botStart, dw, (H - L.b) * sy);
  ctx.drawImage(img, 0, 0, W, L.a, dx, y0 - L.walk * sy, dw, L.a * sy);
}
// Glen's stair tower: drawn so its top ledge (picture row 260) is at row 6 and its ground (1700) sinks into the soil
function drawStairTower(t) {
  const img = ITEM.town_stair_tower, s = (GR * T + HOUSE_SINK - 6 * T) / (1700 - 260), ox = 140, oy = 106;
  ctx.drawImage(img, t.c * T - (155 - ox) * s, 6 * T - (260 - oy) * s, img.naturalWidth * s, img.naturalHeight * s);
}
function drawStepStone(p) {   // a flat grey rock standing up out of the stream, its top level with the bank
  const x = p.c * T + T / 2, y = GR * T;
  if (ok("boulder_grey")) { const img = ITEM.boulder_grey; ctx.drawImage(img, x - T * 0.75, y - 8, T * 1.5, T * 1.5); return; }
  ctx.fillStyle = "#8e8a80"; ctx.beginPath(); ctx.roundRect(x - T * 0.6, y - 6, T * 1.2, T * 1.3, 10); ctx.fill();
}
function drawHouse(h) {
  const rows = GR - h.r, look = h.w >= 6 ? "fort" : rows <= 4 ? "shed" : rows / h.w > 1.2 ? "tower" : "big";
  if (ok("town_house_" + look)) { drawHouseArt(h, ITEM["town_house_" + look], HOUSE_LOOKS[look]); return; }
  if (ok("town_side_low_wall")) { drawSideHouse(h); return; }
  if (ok("town_low_wall")) { drawStoneHouse(h); return; }
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
  if (ok("town_ladder")) {   // Glen's ladder, cut from the top down to the ground (it runs on below the soil)
    const img = ITEM.town_ladder, w = 2 * T - 4, sc = w / img.naturalWidth, top = l.r * T - 26, hh = GR * T + 10 - top;
    ctx.drawImage(img, 0, 0, img.naturalWidth, Math.min(img.naturalHeight, hh / sc), l.c * T + 2, top, w, Math.min(hh, img.naturalHeight * sc));
    return;
  }
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
  if (ok("town_barn")) {   // Glen's open barn: its tie beam is the snake's beam, its floor on the ground, stretched to the granary's width
    const img = ITEM.town_barn, B = { beam: 421, floor: 965, wx0: 149, wx1: 1369 };   // in the picture's own pixels
    const x0 = p.c * T, x1 = (p.c + p.w) * T, beamY = (GRANARY_BEAM_ROW + 1) * T, sy = (p.y - beamY) / (B.floor - B.beam), sx = (x1 - x0) / (B.wx1 - B.wx0);
    ctx.drawImage(img, x0 - B.wx0 * sx, beamY - B.beam * sy, img.naturalWidth * sx, img.naturalHeight * sy);
    return;
  }
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
  if (ok("town_side_threshing_floor")) {
    const img = ITEM.town_side_threshing_floor, w = rx * 2 + 20, h = img.naturalHeight * w / img.naturalWidth;
    ctx.drawImage(img, cx - w / 2, y - h + 8, w, h);
    ctx.fillStyle = "#d9b55c"; ctx.beginPath(); ctx.moveTo(cx - rx * 0.45, y - h * 0.55); ctx.quadraticCurveTo(cx, y - h * 0.55 - 44, cx + rx * 0.45, y - h * 0.55); ctx.fill();   // barley heaped on it
    return;
  }
  ctx.fillStyle = "#b8976a"; ctx.beginPath(); ctx.ellipse(cx, y - 4, rx, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#d9b55c"; ctx.beginPath(); ctx.moveTo(cx - rx * 0.5, y - 6); ctx.quadraticCurveTo(cx, y - 46, cx + rx * 0.5, y - 6); ctx.fill();
  ctx.fillStyle = "#cfc2a6"; for (let a = 0; a < 14; a++) { const t = a / 14 * Math.PI; ctx.beginPath(); ctx.ellipse(cx - Math.cos(t) * rx, y - 2, 9, 7, 0, 0, Math.PI * 2); ctx.fill(); }
}
function drawWorld3(camX) {
  if (typeof drawOx === "function") { drawFallenOak(camX); drawOx(camX); }   // 3-4 (below)
  if (!houses.length && !ladders.length && !stairs.length && !stairTowers.length && !setPieces.some(p => p.kind === "barley" || p.kind === "granary" || p.kind === "threshing" || p.kind === "stepstone" || p.kind === "fence" || p.kind === "guide")) return;
  const now = performance.now() / 1000;
  ctx.save(); ctx.translate(-Math.round(camX), 0);
  const on = (x0, x1) => x1 > camX - 60 && x0 < camX + W + 60;
  for (const p of setPieces) {
    if (!on(p.c * T, (p.c + (p.w || 4)) * T)) continue;
    if (p.kind === "granary") drawGranary(p);
    else if (p.kind === "threshing") drawThreshing(p);
  }
  for (const s of stairs) if (on(s.c * T, (s.c + 2 * s.h) * T)) {   // Glen's stone stairs, stretched over the steps
    if (ok("town_side_stairs")) ctx.filter = TOWN_STONE;
    if (ok("town_side_stairs")) ctx.drawImage(ITEM.town_side_stairs, s.c * T - 4, (GR - s.h) * T - 6, 2 * s.h * T + 8, s.h * T + 6 + HOUSE_SINK);
    else { ctx.fillStyle = "#a89a84"; for (let k = 0; k < s.h; k++) ctx.fillRect((s.c + 2 * k) * T, (GR - k - 1) * T, (2 * (s.h - k)) * T, T); }
    ctx.filter = "none";
  }
  for (const t of stairTowers) if (on(t.c * T, (t.c + 9) * T) && ok("town_stair_tower")) drawStairTower(t);
  for (const h of houses) if (on(h.c * T, (h.c + h.w) * T)) drawHouse(h);
  for (const l of ladders) if (on(l.c * T, (l.c + 2) * T)) drawLadder(l);
  for (const p of setPieces) if (p.kind === "barley" && on(p.c * T, (p.c + p.w) * T)) drawBarley(p, now);
  for (const p of setPieces) if (p.kind === "stepstone" && on(p.c * T, (p.c + 1) * T)) drawStepStone(p);
  for (const p of setPieces) if (p.kind === "drain" && on(p.c * T, (p.c + p.w) * T)) drawDrain(p);
  for (const p of setPieces) if (p.kind === "fence" && on(p.c * T - T, (p.c + 2) * T)) drawFence(p);
  drawGuide();
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
  if (k.state === "caught") { k.vx = 0; return; }   // in the whip snake's jaws
  if (k.state === "pause") { if (touchesDavid(critterBox(k)) && david.inv <= 0) hurtDavid(k.x); k.vx = 0; if (k.t > 0.4 + (k.home % 5) * 0.15) setCrit(k, "run"); return; }
  k.x += k.facing * W3.RAT_RUN * dt;
  if (touchesDavid(critterBox(k)) && david.inv <= 0) {   // run into one and it nips your ankle
    hurtDavid(k.x);
    if (!W3.nipTold) { W3.nipTold = true; toast("Ow! A rat nipped your ankle. Sling them out of the grain, or leave the snake to it."); }
  }
  if (Math.abs(k.x - k.home) > (k.range || 2 * T) && Math.sign(k.x - k.home) === k.facing) { k.facing = -k.facing; setCrit(k, "pause"); }
}
// The whip snake goes after the rats: drops to the floor, glides up to the nearest one and lunges (Glen's strike
// poses). It catches one or two (W3.SNAKE_CATCH), then the rest bolt and it slides off.
Object.assign(W3, { SNAKE_CATCH: 2, SNAKE_GLIDE: 260, SNAKE_STRIKE: 0.4 });
function huntRats(g, sn, dt) {
  sn.ht += dt;
  const floor = g.p.y, rats = critters.filter(k => k.kind === "rat" && !k.gone && k.home >= g.x0 - T && k.home <= g.x1 + T);
  if (sn.phase === "drop") { sn.y = Math.min(floor, sn.y + 700 * dt); if (sn.y >= floor) { sn.phase = "go"; sn.ht = 0; } return; }
  if (sn.phase === "go") {
    const k = rats.sort((a, b) => Math.abs(a.x - sn.x) - Math.abs(b.x - sn.x))[0];
    if (!k || (g.caught || 0) >= W3.SNAKE_CATCH) {
      ratsFlee(g, (g.caught || 0) ? `The whip snake caught ${g.caught === 1 ? "a rat" : "two rats"} and the rest bolted. Let it do its job: the granary's clear.` : "The whip snake went after the rats. The granary's clear.");
      Object.assign(sn, { state: "leave", t: 0 }); return;
    }
    sn.facing = Math.sign(k.x - sn.x) || 1; sn.x += sn.facing * W3.SNAKE_GLIDE * dt; sn.t += dt;
    if (Math.abs(k.x - sn.x) < 46) { sn.phase = "strike"; sn.ht = 0; sn.prey = k; k.state = "caught"; k.vx = 0; }
    return;
  }
  if (sn.phase === "strike" && sn.ht > W3.SNAKE_STRIKE) {
    const k = sn.prey; k.gone = true; k.vx = 0; k.alpha = 0.6;
    g.caught = (g.caught || 0) + 1; stoneHit({ x: k.x, y: k.y }, 0.25);
    if (g.caught === 1) toast("Snap! The whip snake caught a rat.");
    sn.phase = "go"; sn.ht = 0;
  }
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
Object.assign(W3, { RAT_SIZE: 0.6 });   // Glen's rat run sheet, next to everything else
function drawRat(k, x) {   // a little brown rat: Glen's running rat (standing still = its first frame), or a drawn one
  const nm = SPR.rat_run2 && Math.floor(k.home / (2 * T)) % 2 ? "rat_run2" : "rat_run";   // Glen's two rats, every other one
  if (SPR[nm]) {
    const run = k.gone || k.state === "run";
    drawSprite(nm, run ? frameOf(nm, k.t) : 0, x + k.facing * 14, k.y + 2, k.facing, W3.RAT_SIZE, k.alpha);
    return;
  }
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
  if (typeof updateOx === "function") { updateStorm(dt); updateOx(dt); }   // 3-4 (below)
  if (ladders.length && !W3.ladderTold && david.onGround && ladderRungs.has(Math.floor(david.x / T) + "," + Math.floor(david.y / T))) onLadder(david);
  if (guides.length) {   // 3-3: Shammah runs ahead (after a fall he's back at the last spot David reached)
    if (david.deadT > 0) shammahRun.dead = true;
    else { if (shammahRun.dead) { shammahRun.dead = false; resetGuide(); } updateGuide(dt); }
  }
  for (const g of granaries) {   // the whip snake slid off its beam (David came in and left it be): the rats bolt
    if (g.saved || !g.snake) continue;
    const sn = g.snake, inside = david.x > g.x0 && david.x < g.x1 && david.deadT <= 0;
    if (sn.state === "idle" && !sn.gone && inside) { sn.state = "leave"; sn.t = 0; sn.facing = Math.sign((g.x0 + g.x1) / 2 - sn.x) || 1; }   // David came in under it
    if (sn.state === "leave" && !(sn.gone && sn.vy)) {   // (gone with a fling = it was slung)
      g.huntT += dt; if (g.huntT > W3.SNAKE_HUNT) Object.assign(sn, { state: "hunt", phase: "drop", ht: 0, alpha: 1 });
    }
    if (sn.state === "hunt" && !sn.gone) huntRats(g, sn, dt);
  }
}

// ---------------------------------------------------------------------------
// 3-2 The Far Pasture. Flies: a sheep plagued by flies at its eyes won't settle until you rub olive oil on its head
// (press Down beside it). The oil comes from your flask, the one the olives fill (Psalm 23:5: "you anoint my head with
// oil"), the stage right before David himself is anointed.   lostSheep("sheep", c, 16, "flies")
// ---------------------------------------------------------------------------
Object.assign(W3, { OIL_COST: 5 });   // olives' worth of oil to anoint one sheep
function fliesSheep(sh, dx, dy) {   // called from updateSheep (main.js) while it's still plagued
  if (Math.abs(dx) > 80 || Math.abs(dy) > 80) return;
  if (!sh.hinted) { sh.hinted = true; toast("Flies at its eyes: it won't settle. Press Down to rub olive oil on its head."); }
  if (!pressed("down") || !david.onGround || inCutscene()) return;
  if (david.olives < W3.OIL_COST) { toast(`Not enough oil in your flask. Gather olives (it takes ${W3.OIL_COST}).`); return; }
  // he kneels over it like over a cast sheep (main.js updateLiftSheep), and rubs the oil in: oilSheep() below
  david.olives -= W3.OIL_COST;
  if (david.carrying || lamb.carried) { david.carrying = false; lamb.carried = false; lamb.x = david.x - david.facing * 50; lamb.y = david.y; }
  sh.state = "helped"; sh.upright = true; david.helpSheep = sh; david.helpSide = Math.sign(sh.x - david.x) || david.facing;
  sh.facing = -david.helpSide;   // it turns to him, head under the flask
  david.liftPhase = 0; david.harp = false; david.charging = false; david.throwT = -1; setState("liftSheep");
}
function oilSheep(sh) {   // main.js: halfway through the kneel, the oil goes on and the flies scatter
  sh.oiled = true; chime(7);
  for (let k = 0; k < 16; k++) bits.push({ x: sh.x + sh.facing * 18, y: sh.y - 46, vx: (Math.random() - 0.5) * 200, vy: -Math.random() * 240, life: 0.9, color: k % 2 ? "#e8d27a" : "#fff2b0" });
  for (let k = 0; k < 8; k++) bits.push({ x: sh.x, y: sh.y - 52, vx: (Math.random() - 0.5) * 600, vy: -200 - Math.random() * 300, life: 0.6, color: "#1d1a12" });   // the flies scatter
  toast("You rubbed olive oil on its head, and the flies are gone. \"You anoint my head with oil\" (Psalm 23:5)");
}
function drawFlies(x, y, t) {   // a little cloud of flies buzzing round its head
  ctx.save(); ctx.fillStyle = "#1d1a12";
  for (let k = 0; k < 11; k++) {
    const fx = x + Math.sin(t * 7.3 + k * 1.7) * 30, fy = y - 52 + Math.sin(t * 9.1 + k * 2.9) * 16;
    ctx.beginPath(); ctx.arc(fx, fy, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(220,230,240,0.55)"; ctx.fillRect(fx - 3, fy - 3, 2, 2); ctx.fillRect(fx + 1, fy - 3, 2, 2); ctx.fillStyle = "#1d1a12";
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Rustlers (3-2): with the whole town at the gathering, a sheep thief creeps up on the flock you left at a campfire.
//   critter("rustler", c) beside campfire(c). Once you've gone on past that fire with sheep resting there, he sneaks in
//   from behind, crouches and grabs one, and makes off with it held up over his head. A stone makes him drop it and run.
// Art: Glen's thief sheets: thief_sneak (crouched creep), thief_crawl (belly-crawl the last few steps), thief_pickup,
// thief_run (hand raised for the sheep), thief_stand. Without them: a villager's walk clip, darkened.
// ---------------------------------------------------------------------------
Object.assign(W3, { RUSTLER_AFTER: 10, RUSTLER_SNEAK: 120, RUSTLER_RUN: 230, RUSTLER_ART: "abinadab_walk", RUSTLER_FILTER: "brightness(0.3) saturate(0.5)",
  THIEF_GRAB: 0.55,     // seconds crouching to grab the sheep (pickup frames 0-4)
  THIEF_CRAWL: 3,       // tiles from the sheep where he drops to his belly and crawls
  THIEF_CRAWL_SPEED: 0.45,   // x his sneaking speed while crawling
  THIEF_HAND: 322 });   // how high his raised hand holds the sheep, in thief_run sheet pixels above his feet
const thiefArt = () => !!SPR.thief_run;
const rustlerH = () => { const nm = thiefArt() ? "thief_stand" : W3.RUSTLER_ART, s = SPR[nm]; return s ? s.ay * SCALE * (TUNE.SPRITE_SIZE[nm] || 1) : 190; };   // his height on screen
CRITTER_ART.rustler = { box: k => ({ x0: k.x - 30, x1: k.x + 30, y0: k.y - rustlerH(), y1: k.y }) };
function updateRustler(k, dx, sameLevel, dt) {
  const fire = k.fire || (k.fire = nearestFire(k.home));
  if (k.state === "idle") {   // out of sight (and after a fall, he's given back whatever he had)
    k.alpha = 0;
    if (k.sheep) { const sh = k.sheep; k.sheep = null; Object.assign(sh, { x: fire.x, y: fire.y, vy: 0 }); joinLine(sh, true); }
    const flock = line.filter(sh => sh.fire === fire && sh.state === "atFire" && sh.how !== "rescued");
    if (!k.done && flock.length && david.x > fire.x + W3.RUSTLER_AFTER * T) {
      k.done = true; k.target = flock[flock.length - 1];
      Object.assign(k, { x: Math.max(fire.x - 14 * T, Math.min(fire.x - 9 * T, camX - 80)), y: fire.y, vy: 0, facing: 1, alpha: 1 }); setCrit(k, "sneak");
      baa(fire.x, 1); toast("Baa! Back at the campfire... a thief is creeping up on your flock!");
    }
    return;
  }
  if (k.state === "sneak") {
    if (!line.includes(k.target) || k.target.state !== "atFire") {
      k.target = line.find(sh => sh.fire === fire && sh.state === "atFire" && sh.how !== "rescued");
      if (!k.target) { k.gone = true; k.vx = -W3.RUSTLER_RUN; return; }
    }
    k.facing = Math.sign(k.target.x - k.x) || 1;
    k.crawl = thiefArt() && SPR.thief_crawl && Math.abs(k.target.x - k.x) < W3.THIEF_CRAWL * T;
    runCritter(k, W3.RUSTLER_SNEAK * (k.crawl ? W3.THIEF_CRAWL_SPEED : 1), dt);
    if (Math.abs(k.target.x - k.x) < 30) {
      const sh = k.target; line.splice(line.indexOf(sh), 1); sh.state = "stolen"; k.sheep = sh; k.vx = 0;
      baa(sh.x, 1); setCrit(k, thiefArt() ? "grab" : "flee"); toast("He's grabbed one of your sheep! Hit him with a stone!");
    }
    return;
  }
  if (k.state === "grab") {   // crouched over it (the sheep stays on the ground until he's up and off)
    k.vx = 0; if (k.sheep) Object.assign(k.sheep, { y: k.y, facing: k.facing });
    if (k.t > W3.THIEF_GRAB) setCrit(k, "flee");
    return;
  }
  if (k.state === "flee") {   // off with it, away from David; stops to look back, runs again when he comes close
    k.facing = -Math.sign(dx) || -1;
    const moved = runCritter(k, W3.RUSTLER_RUN, dt);
    if (k.t > 2.5 || !moved) setCrit(k, "wait");
  } else if (k.state === "wait") {
    k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 40, 150, dt);
    k.facing = Math.sign(dx) || k.facing;
    if (Math.abs(dx) < 260 && k.t > 0.6) setCrit(k, "flee");
  }
  if (k.sheep && thiefArt()) {   // up in his raised hand while he runs; tucked at his side while he looks back
    const sc = SCALE * (TUNE.SPRITE_SIZE.thief_run || 1), up = k.state === "flee";
    Object.assign(k.sheep, { x: k.x - k.facing * (up ? 4 * sc : 10), y: k.y - (up ? W3.THIEF_HAND * sc : rustlerH() * 0.45), facing: k.facing });
  } else if (k.sheep) Object.assign(k.sheep, { x: k.x - k.facing * 6, y: k.y - rustlerH() * 0.55, facing: k.facing });   // across his shoulders
}
function stoneHitsRustler(k, s) {
  if (k.state === "idle") return false;   // not here yet
  if (k.sheep) {
    const sh = k.sheep; k.sheep = null; Object.assign(sh, { x: k.x, y: k.y, vy: 0 }); joinLine(sh, true);
    toast("He dropped your sheep and ran! It's trotting back to the fire.");
  } else toast("The thief ran off.");
  k.gone = true; k.facing = Math.sign(k.x - david.x) || -1; k.vx = k.facing * W3.RUSTLER_RUN * 1.6; stoneHit(s);
  return !s.power;
}
function drawRustler(k, x) {
  if (thiefArt()) {
    let nm = "thief_run", i = frameOf(nm, k.t);
    if (k.state === "sneak" && k.crawl) { nm = "thief_crawl"; i = frameOf(nm, k.t); }               // on his belly, the last few steps
    else if (k.state === "sneak" && SPR.thief_sneak) { nm = "thief_sneak"; i = frameOf(nm, k.t); }    // creeping, crouched low
    else if (k.state === "sneak") { nm = "thief_pickup"; i = 1 + (Math.floor(k.t * 3) % 2); }
    else if (k.state === "grab") { nm = "thief_pickup"; i = Math.min(4, Math.floor(k.t / W3.THIEF_GRAB * 5)); }
    else if (k.state === "wait") { nm = "thief_stand"; i = frameOf(nm, k.t); }                       // looking back at David
    drawSprite(nm, i, x, k.y, k.facing, 1, k.alpha);
    return;
  }
  const name = W3.RUSTLER_ART; if (!SPR[name]) return;
  const i = k.state === "wait" ? 0 : frameOf(name, k.t * (k.state === "sneak" ? 0.7 : 1.3));
  drawSprite(name, i, x, k.y, k.facing, k.state === "sneak" ? 0.94 : 1, k.alpha, W3.RUSTLER_FILTER);
}

// ---------------------------------------------------------------------------
// 3-2: at each campfire, a scene back in town. Jesse's sons pass before Samuel one by one, and each time the word is
// "not this one" (1 Samuel 16:6-10). Then you're back on the hill with the sheep, alone, on purpose. We see it through
// Samuel's eyes, so there's no Samuel on screen. A or B moves it on.
// ---------------------------------------------------------------------------
const PASS_SCENES = [
  { sons: ["eliab"], lines: [
    ["Samuel", "Surely the LORD's anointed is standing here."],                                                   // 16:6
    ["The LORD", "Don't look at his face, or how tall he is. People look at the outward appearance, but the LORD looks at the heart."] ] },   // 16:7
  { sons: ["abinadab", "shammah"], lines: [
    ["", "Jesse called Abinadab, and he passed before Samuel."],
    ["Samuel", "The LORD has not chosen this one either."],                                                       // 16:8
    ["", "Then Jesse had Shammah pass by."],
    ["Samuel", "The LORD has not chosen this one either."] ] },                                                   // 16:9
  { sons: [], line: true, lines: [
    ["", "Jesse had seven of his sons pass before Samuel."],
    ["Samuel", "The LORD has not chosen these."],                                                                 // 16:10
    ["", "And far out on the hills, the youngest was with the sheep."] ] },
];
const passScene = { active: false, t: 0, k: 0, line: 0, lineT: 0, seen: new Set() };
function fireLit(f) {   // main.js: a campfire was just lit
  if (LEVEL_NAME !== "3-2") return;
  const n = fires.indexOf(f);
  if (!PASS_SCENES[n] || passScene.seen.has(n)) return;
  passScene.seen.add(n); Object.assign(passScene, { active: true, t: 0, k: n, line: 0, lineT: 0 });
}
const PASS_ENTER = 1.6, PASS_LINE = 4.5, PASS_SIZE = 1.8;   // seconds to walk in, seconds per line, how big the brothers are
function updatePassScene(real) {
  const P = passScene, S = PASS_SCENES[P.k];
  P.t += real; if (P.t < PASS_ENTER) return;
  P.lineT += real;
  if ((P.lineT > 0.5 && (pressed("a") || pressed("b"))) || P.lineT > PASS_LINE) {
    if (P.line < S.lines.length - 1) { P.line++; P.lineT = 0; } else P.active = false;
  }
}
function drawPassScene() {
  const P = passScene; if (!P.active) return;
  const S = PASS_SCENES[P.k], a = Math.min(1, P.t * 2.5);
  ctx.save(); ctx.globalAlpha = a;
  const keep = bgWorld; bgWorld = "w3_1";   // Bethlehem: 3-1's town layers, and the stage's own topsoil (a stretch with no rocks)
  drawBackground(0); bgWorld = keep; drawFlatGround(0);
  const base = GR * T;
  if (S.line) {   // the seven: Glen's brothers-line clip, cut off just before David (he's out with the sheep)
    const B = SPR.brothers_line, ax = W * 0.2, cut = ax + (584 - B.ax) * SCALE * 1.9;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, cut, H); ctx.clip();
    drawSprite("brothers_line", Math.floor(P.t * 2) % 15, ax, base, 1, 1.9, a);
    ctx.restore();
  }
  const n = S.sons.length, gap = Math.min(170, W * 0.6 / n);
  S.sons.forEach((son, i) => {   // they walk in from the left and stand before Samuel (the camera, on the right)
    const tx = W * 0.62 - (n - 1 - i) * gap, f = Math.min(1, P.t / PASS_ENTER), x = -120 + (tx + 120) * (1 - (1 - f) * (1 - f));
    const walk = son + "_walk", idle = son === "eliab" ? "eliab_arms_crossed" : son + "_idle";
    if (f < 1 && SPR[walk]) drawSprite(walk, frameOf(walk, P.t), x, base, 1, PASS_SIZE, a);
    else if (SPR[idle]) drawSprite(idle, frameOf(idle, P.t), x, base, 1, PASS_SIZE, a);
  });
  ctx.textAlign = "center"; ctx.fillStyle = "rgba(50,30,10,0.85)"; ctx.font = "italic 22px Georgia, serif";
  ctx.fillText("Meanwhile, in Bethlehem...", W / 2, 50);
  if (P.t >= PASS_ENTER) {
    const [who, text] = S.lines[P.line], bw = Math.min(900, W - 60), bx = W / 2 - bw / 2, by = H - 150;
    ctx.fillStyle = "rgba(28,18,8,0.88)"; ctx.beginPath(); ctx.roundRect(bx, by, bw, 118, 16); ctx.fill();
    ctx.strokeStyle = "rgba(255,214,120,0.5)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.textAlign = "left"; let ty = by + 34;
    if (who) { ctx.fillStyle = "#ffd98a"; ctx.font = "bold 20px sans-serif"; ctx.fillText(who, bx + 24, ty); ty += 30; }
    ctx.fillStyle = "#fff6e2"; ctx.font = (who ? "" : "italic ") + "20px sans-serif";
    const words = text.split(" "); let cur = "";
    for (const wd of words) { const t2 = cur ? cur + " " + wd : wd; if (ctx.measureText(t2).width > bw - 48) { ctx.fillText(cur, bx + 24, ty); ty += 26; cur = wd; } else cur = t2; }
    ctx.fillText(cur, bx + 24, ty);
    ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,240,215,0.6)"; ctx.font = "14px sans-serif"; ctx.fillText("A: next", bx + bw - 18, by + 108);
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// 3-3 We Will Not Sit Down. Fences (fence(c): too tall to jump, open underneath: roll under), the drain under
// the town wall (The One is in there), and Shammah running ahead: he waits at each guide() spot and calls out the way
// when David catches up, then runs on to the next (straight through the fences: he knows the gaps).
// ---------------------------------------------------------------------------
Object.assign(W3, { GUIDE_RUN: 400, GUIDE_NEAR: 4 });   // Shammah's speed (px/s); how close (tiles) David gets before he runs on
function drawFence(p) {   // a tall plank fence (rows 7-14), open at the bottom (rows 15-16): roll under
  const x = p.c * T + T / 2, top = 7 * T, low = 15 * T;
  ctx.fillStyle = "#7a5634";   // upright planks, pointed tops
  for (let k = -2; k <= 2; k++) {
    const px = x + k * 13 - 6, pt = top + Math.abs(k) * 4;
    ctx.beginPath(); ctx.moveTo(px, low); ctx.lineTo(px, pt + 8); ctx.lineTo(px + 6, pt); ctx.lineTo(px + 12, pt + 8); ctx.lineTo(px + 12, low); ctx.fill();
    ctx.fillStyle = "rgba(40,24,10,0.35)"; ctx.fillRect(px + 10, pt + 8, 2, low - pt - 8); ctx.fillStyle = "#7a5634";
  }
  ctx.fillStyle = "#5e3f24";
  for (const dx of [-T * 0.95, T * 0.95]) { ctx.beginPath(); ctx.roundRect(x + dx - 7, top - 10, 14, GR * T + 8 - top + 10, 4); ctx.fill(); }   // posts down into the ground
  for (let k = 0; k < 2; k++) {
    const y = top + 30 + k * (low - top - 60);
    ctx.fillStyle = "#8a6238"; ctx.beginPath(); ctx.roundRect(x - T * 1.05, y, T * 2.1, 12, 4); ctx.fill();
    ctx.fillStyle = "rgba(255,230,190,0.25)"; ctx.fillRect(x - T * 1.0, y + 1, T * 2.0, 3);
  }
}
function drawDrain(p) {   // the low drain under the town wall: a dark arched opening with stones round it
  const x0 = p.c * T, x1 = (p.c + p.w) * T, top = 15 * T, bot = GR * T;
  ctx.fillStyle = "rgba(20,14,8,0.82)"; ctx.fillRect(x0, top, x1 - x0, bot - top);
  ctx.fillStyle = "#b9ab90";
  for (let x = x0 - 6; x < x0 + 30; x += 15) { ctx.beginPath(); ctx.roundRect(x, top - 10, 14, 12, 3); ctx.fill(); }
  ctx.fillStyle = "#8f8270"; ctx.fillRect(x0 - 4, top - 2, 6, bot - top + 2);
}
const guides = setPieces.filter(p => p.kind === "guide");
const shammahRun = { i: 0, x: guides.length ? guides[0].x : 0, y: guides.length ? guides[0].y : 0, moving: false, said: false, t: 0, facing: 1 };
function resetGuide() {   // after a fall: he's waiting at the last spot David reached (never further back than the checkpoint)
  const G = shammahRun; let i = 0;
  for (let k = 0; k < guides.length; k++) if (guides[k].x <= checkpoint.x + 2 * T) i = k;
  Object.assign(G, { i, x: guides[i].x, y: guides[i].y, moving: false, said: false, air: false, vy: 0 });
}
// Shammah runs the ground like David: up steps and roofs with a jump, over gaps with a jump, down off ledges with a
// drop. He knows the gaps under the fences (he ducks through them).
const fenceCols = new Set(setPieces.filter(p => p.kind === "fence").map(p => p.c));
function guideFloor(c, feet) {   // the top of what he can stand on in column c, from a little above his feet down
  if (c < 0 || c >= COLS) return null;
  for (let r = Math.max(1, Math.floor(feet / T) - 7); r < ROWS; r++) {
    const solidHere = (isSolid(c, r) && !fenceCols.has(c)) || isOneway(c, r);
    if (solidHere && !(isSolid(c, r - 1) && !fenceCols.has(c))) return r * T;
  }
  return null;
}
function guideJump(G, rise) { G.vy = -Math.sqrt(2 * TUNE.GRAVITY * Math.max(T, rise + 34)); G.air = true; }
function updateGuide(dt) {
  const G = shammahRun; if (!guides.length) return;
  G.t += dt;
  if (G.moving) {
    const g = guides[G.i], dx = g.x - G.x, dir = Math.sign(dx) || 1;
    G.facing = dir;
    const col = Math.floor(G.x / T), ahead = Math.floor((G.x + dir * 26) / T);
    if (!G.air) {
      const here = guideFloor(col, G.y), next = guideFloor(ahead, G.y);
      if (next !== null && next < G.y - 4) guideJump(G, G.y - next);                     // a step up: jump onto it
      else if (next === null || next > G.y + 2 * T) {                                    // a drop or a gap: is there a landing ahead at about this height?
        for (let k = 2; k <= 5; k++) { const f = guideFloor(col + dir * k, G.y); if (f !== null && f <= G.y + T) { guideJump(G, Math.max(0, G.y - f) + T); break; } }
      }
      if (!G.air && next !== null && next > G.y + 4) G.air = true;                        // walk off a ledge: fall
    }
    const step = W3.GUIDE_RUN * dt, wall = guideFloor(ahead, G.y);
    const blocked = G.air && wall !== null && wall < G.y - 8 && (wall > G.y - 6 * T);      // in the air, a wall in his face: no further until he's above it
    if (!blocked) G.x += Math.abs(dx) <= step ? dx : dir * step;
    if (G.air) {
      G.vy = Math.min(TUNE.MAX_FALL, G.vy + TUNE.GRAVITY * dt); G.y += G.vy * dt;
      const f = guideFloor(Math.floor(G.x / T), G.y - Math.max(0, G.vy * dt) - 2);
      if (G.vy > 0 && f !== null && G.y >= f) { G.y = f; G.vy = 0; G.air = false; }
    }
    if (Math.abs(g.x - G.x) < 1 && !G.air) { G.x = g.x; G.moving = false; G.said = false; }
    return;
  }
  G.facing = Math.sign(david.x - G.x) || 1;   // waiting: watching for David
  const near = Math.abs(david.x - G.x) < W3.GUIDE_NEAR * T || david.x > G.x;
  if (near && david.deadT <= 0 && !G.said) { G.said = true; sayLine("Shammah", guides[G.i].line); G.waitT = 0; }
  if (G.said && G.i < guides.length - 1) {
    G.waitT = (G.waitT || 0) + dt;
    if (G.waitT > 0.9) { G.i++; G.moving = true; }
  }
}
function drawGuide() {
  const G = shammahRun; if (!guides.length) return;
  const name = G.moving ? "shammah_walk" : "shammah_idle", duck = fenceCols.has(Math.floor(G.x / T)) || fenceCols.has(Math.floor((G.x + G.facing * 30) / T));
  drawSprite(name, frameOf(name, G.t * (G.moving ? 1.6 : 1)), G.x, G.y, G.facing, duck ? 0.6 : 1);   // ducking under a fence
}

// ---------------------------------------------------------------------------
// The Anointing (1 Samuel 16:12-13): plays when 3-3 is cleared, before the Journal. At the sacrifice outside the town
// gate: Jesse's sons in a line (Glen's clip, David at the end), Samuel walks in with the horn of oil, the LORD says
// "this is the one", David steps forward, and Samuel pours the oil over his head in front of his brothers. A warm light
// and David's song for the Spirit: something changed in David, not in his sling (no new powers). A moves it on.
// ---------------------------------------------------------------------------
function drawFlatGround(cx) {   // the stage's own topsoil and earth, flat all the way across (a story scene: no houses or rocks)
  const c0 = Math.floor(cx / T) - 3, c1 = c0 + Math.ceil(W / T) + 6, saved = [];
  for (let r = 0; r < ROWS; r++) for (let c = c0; c <= c1; c++) if (c >= 0 && c < COLS) {
    saved.push([r, c, solid[r][c], oneway[r][c]]); solid[r][c] = r >= GR ? 1 : 0; oneway[r][c] = false;
  }
  drawTiles(cx);
  for (const [r, c, v, o] of saved) { solid[r][c] = v; oneway[r][c] = o; }
}
function drawStoryBox(who, text, hint = "A: next", top = false) {   // the caption box of a story scene (bottom, or top)
  const bw = Math.min(900, W - 60), bx = W / 2 - bw / 2, by = top ? 76 : H - 150;
  ctx.save();
  ctx.fillStyle = "rgba(28,18,8,0.88)"; ctx.beginPath(); ctx.roundRect(bx, by, bw, 118, 16); ctx.fill();
  ctx.strokeStyle = "rgba(255,214,120,0.5)"; ctx.lineWidth = 2; ctx.stroke();
  ctx.textAlign = "left"; let ty = by + 34;
  if (who) { ctx.fillStyle = "#ffd98a"; ctx.font = "bold 20px sans-serif"; ctx.fillText(who, bx + 24, ty); ty += 30; }
  ctx.fillStyle = "#fff6e2"; ctx.font = (who ? "" : "italic ") + "20px sans-serif";
  const words = text.split(" "); let cur = "";
  for (const wd of words) { const t2 = cur ? cur + " " + wd : wd; if (ctx.measureText(t2).width > bw - 48) { ctx.fillText(cur, bx + 24, ty); ty += 26; cur = wd; } else cur = t2; }
  ctx.fillText(cur, bx + 24, ty);
  if (hint) { ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,240,215,0.6)"; ctx.font = "14px sans-serif"; ctx.fillText(hint, bx + bw - 18, by + 108); }
  ctx.restore();
}
const ANOINT = {
  SIZE: 1.7,          // how big the people are (the stage's ground line stays where it is)
  LINE_X: 0.16,       // where the brothers' line stands (its first man, as a share of the screen width)
  DAVID_DX: 404,      // from the line's anchor to David after he steps out (sprite pixels, brothers_line)
  DAVID_HEAD: 191,    // the top of David's head above the ground (sprite pixels)
  HORN: [62, 225],    // Samuel's horn tip, raised: ahead of his anchor and above the ground (sprite pixels, samuel_anoint)
  STEP_TIME: 2.4,     // seconds for David to step out of the line
  POUR_TIME: 5,       // seconds for Samuel to raise the horn and pour
};
// Glen's close-up of the oil pouring over David's head (Grok clip). At the pour, the wide shot fades into it, full
// screen, and fades back out when it ends. Missing file = the wide shot only.
const ANOINT_CLIP = Object.assign(document.createElement("video"), { src: "../assets/video/anointing_closeup.mp4", muted: true, playsInline: true, preload: "auto" });
ANOINT_CLIP.onerror = () => { ANOINT_CLIP.missing = true; };
const clipOk = () => !ANOINT_CLIP.missing && ANOINT_CLIP.readyState >= 2;
const anointing = {
  active: false, t: 0, step: 0, stepT: 0, done: null, samX: 0, glow: 0,
  lines: [
    ["", "David came in from the fields, still dusty from the hills. Everyone turned to look."],
    ["", "He was ruddy, with bright eyes and a fine appearance (1 Samuel 16:12)."],
    ["The LORD", "Rise and anoint him. This is the one."],                                                              // 16:12
    ["", "Then Samuel took the horn of oil and anointed him in front of his brothers."],                               // 16:13
    ["", "And the Spirit of the LORD came powerfully upon David from that day on."],                                   // 16:13
    ["Anointing", "In Israel, oil was poured on the head of someone God set apart for His work, like a king or a priest. The word Messiah means \"the anointed one.\""],
  ],
  start(done) { Object.assign(this, { active: true, t: 0, step: 0, stepT: 0, done, samX: W + 140, glow: 0, chimed: false, close: 0, closeEnd: -1, useClip: false }); hushLoops(); dialog.t = 0; },
  next() {
    this.step++; this.stepT = 0;
    this.close = 0; this.closeEnd = -1;
    if (this.step === 3 && clipOk()) { this.useClip = true; ANOINT_CLIP.currentTime = 0; ANOINT_CLIP.play().catch(() => {}); } else this.useClip = false;
  },
  CLOSE_FADE: 0.9,   // seconds to fade into and out of the close-up
  camX() { return Math.max(0, MAIN_COLS * T - W); },   // the end of 3-3: the town gate behind them
  lineX() { return W * ANOINT.LINE_X; },
  davidX() { return this.lineX() + ANOINT.DAVID_DX * SCALE * ANOINT.SIZE; },
  update(dt) {
    this.t += dt; this.stepT += dt;
    const A = this.stepT > 0.8 && (pressed("a") || pressed("b") || pressed("start"));
    const samTo = this.davidX() + ANOINT.HORN[0] * SCALE * ANOINT.SIZE;   // the horn right over David's head
    if (this.step >= 1) this.samX = Math.max(samTo, this.samX - 190 * dt);   // Samuel walks in from the right
    if (this.step === 1 && this.samX > samTo) return;                         // (the line waits until he's there)
    if (this.step === 2 && this.stepT < ANOINT.STEP_TIME) return;             // David steps out of the line
    if (this.step === 3 && this.useClip) {   // the close-up: fade in, play it through, fade back to the wide shot
      if (this.closeEnd < 0 && (ANOINT_CLIP.ended || this.stepT > 30)) this.closeEnd = 0;
      if (this.closeEnd < 0) this.close = Math.min(1, this.stepT / this.CLOSE_FADE);
      else { this.closeEnd += dt; this.close = Math.max(0, 1 - this.closeEnd / this.CLOSE_FADE); }
      if (this.close > 0 || this.closeEnd < 0) return;
    } else if (this.step === 3 && this.stepT < ANOINT.POUR_TIME) return;      // the oil (wide shot only)
    if (this.step === 4) this.glow = Math.min(1, this.glow + dt * 0.6);
    if (this.step === 3 && this.stepT >= ANOINT.POUR_TIME && !this.chimed) { this.chimed = true; chime(5); setTimeout(() => chime(9), 200); setTimeout(() => chime(12), 420); }
    if (!A) return;
    if (this.step === 3) { harpMusic.currentTime = 0; harpMusic.volume = TUNE.HARP_VOLUME; harpMusic.play().catch(() => {}); }   // David's song, for the Spirit
    if (this.step < this.lines.length - 1) { this.next(); return; }
    this.active = false; harpMusic.pause(); harpMusic.volume = 0;
    if (this.done) this.done();
  },
  draw() {
    const cx = this.camX(), y = GR * T, s = ANOINT.SIZE, a = Math.min(1, this.t / 1.2);
    drawBackground(cx); drawFlatGround(cx);
    const dx = this.davidX(), k = SCALE * s;
    // Jesse's sons (David at the end); he steps out at step 2
    const B = SPR.brothers_line;
    if (B) {
      let i;
      if (this.step < 2) i = Math.floor(this.t * 2) % 15;
      else i = Math.min(B.frames - 1, 15 + Math.floor(Math.min(1, this.stepT / ANOINT.STEP_TIME) * (B.frames - 15) + (this.step > 2 ? 9 : 0)));
      drawSprite("brothers_line", i, this.lineX(), y, 1, s);
    }
    // Samuel: walking in, standing, then the horn raised and poured (Glen's clip), facing the line
    const S = SPR.samuel_anoint;
    if (S && this.step >= 1) {
      let i;
      if (this.samX > this.davidX() + ANOINT.HORN[0] * SCALE * ANOINT.SIZE + 1) i = Math.floor(this.t * 6) % 3;
      else if (this.step < 3) i = 3 + Math.floor(this.t * 2) % 6;
      else if (this.step === 3) i = Math.min(20, 9 + Math.floor(this.stepT / ANOINT.POUR_TIME * 12));
      else i = 23;
      drawSprite("samuel_anoint", i, this.samX, y, -1, s);
      if (this.step === 3 && !this.useClip && i >= 15) {   // the oil running from the horn over David's head
        const hx = this.samX - ANOINT.HORN[0] * k, hy = y - ANOINT.HORN[1] * k, head = y - ANOINT.DAVID_HEAD * k;
        ctx.strokeStyle = "rgba(232,196,90,0.95)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(dx, head + 4); ctx.stroke();
        for (let n = 0; n < 4; n++) {
          const ph = (this.t * 1.3 + n / 4) % 1;
          ctx.fillStyle = `rgba(240,205,95,${1 - ph})`; ctx.beginPath(); ctx.arc(dx + (n - 1.5) * 9, head + 6 + ph * 40, 3.2, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    if (B && SPR.samuel_anoint && this.step >= 1) {   // David again, in front of Samuel (below Samuel's raised arm and horn)
      const cut = this.lineX() + (582 - B.ax) * k, head = y - (ANOINT.DAVID_HEAD + 12) * k;
      let i; if (this.step < 2) i = Math.floor(this.t * 2) % 15;
      else i = Math.min(B.frames - 1, 15 + Math.floor(Math.min(1, this.stepT / ANOINT.STEP_TIME) * (B.frames - 15) + (this.step > 2 ? 9 : 0)));
      ctx.save(); ctx.beginPath(); ctx.rect(cut, head, W - cut, H - head); ctx.clip();
      drawSprite("brothers_line", i, this.lineX(), y, 1, s); ctx.restore();
    }
    if (this.glow > 0) {   // the warm light on David (the Spirit of the LORD)
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(dx, y - 100 * k, 10, dx, y - 100 * k, 300);
      g.addColorStop(0, `rgba(255,214,120,${0.55 * this.glow})`); g.addColorStop(0.5, `rgba(255,190,90,${0.22 * this.glow})`); g.addColorStop(1, "rgba(255,190,90,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (let n = 0; n < 14; n++) {   // motes of light rising round him
        const ph = (this.t * 0.35 + n / 14) % 1;
        ctx.fillStyle = `rgba(255,240,190,${0.8 * this.glow * Math.sin(ph * Math.PI)})`;
        ctx.beginPath(); ctx.arc(dx + Math.sin(n * 2.3 + this.t) * 60, y - 20 - ph * 260, 2.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    if (this.close > 0 && ANOINT_CLIP.videoWidth) {   // the close-up, filling the screen
      const v = ANOINT_CLIP, sc = Math.max(W / v.videoWidth, H / v.videoHeight), vw = v.videoWidth * sc, vh = v.videoHeight * sc;
      ctx.save(); ctx.globalAlpha = this.close; ctx.drawImage(v, (W - vw) / 2, (H - vh) / 2, vw, vh); ctx.restore();
    }
    ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,248,230,0.9)"; ctx.font = "italic 22px Georgia, serif";
    ctx.fillText("The Anointing", W / 2, 50);
    if (this.t > 1.2) drawStoryBox(...this.lines[this.step], this.step === this.lines.length - 1 ? "A: continue" : "A: next", this.close < 0.5);   // up top over the wide shot; at the bottom over the close-up (the oil is up top there)   // up top: the people stand on the ground below
  },
};

// Back at the Anointing stop after it's happened: Samuel has gone home to Ramah (16:13), and one of the family is
// there to send David back to the sheep (he's still "with the sheep" in 16:19). A different one each visit.
// A: back to the map. B: see the anointing again.
const AFTER_ANOINT = [
  { who: "Jesse", idle: "jesse_idle", talk: "jesse_talk", lines: [
    "Samuel has gone home to Ramah. What the LORD has planned for you, I can't say. But I know where a shepherd belongs.",
    "The flock is waiting, son. Back to the pastures with you, and the LORD go with you."] },
  { who: "Shammah", idle: "shammah_idle", talk: "shammah_talk", walk: "shammah_walk", lines: [
    "There he is! The prophet's choice. Out of all of us, it was you. I'm proud of you, little brother.",
    "Still, somebody has to keep the sheep alive. Looks like it's still you. Go on, they're waiting."] },
  { who: "Eliab", idle: "eliab_arms_crossed", walk: "eliab_walk", lines: [
    "Oh, it's you. A little oil in your hair doesn't make you better than the rest of us.",
    "And who's minding the sheep? Go on, back to the pastures."] },   // the Eliab of 1 Samuel 17:28
  { who: "Abinadab", idle: "abinadab_idle", point: "abinadab_point", walk: "abinadab_walk", lines: [
    "Seven of us stood in that line, and the prophet chose you. I still can't believe it. Well done, David.",
    "Now go on. The sheep won't feed themselves."] },
];
const savedProgress = () => { try { return JSON.parse(localStorage.getItem("davidProgress") || "{}"); } catch (e) { return {}; } };   // (map.js loads after this file)
const afterAnoint = {
  active: false, t: 0, line: 0, lineT: 0, who: null, SIZE: 1.7, ENTER: 1.4,
  start() {
    const p = savedProgress(), n = p.afterAnoint || 0; p.afterAnoint = n + 1;
    try { localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
    Object.assign(this, { active: true, t: 0, line: 0, lineT: 0, who: AFTER_ANOINT[n % AFTER_ANOINT.length] }); dialog.t = 0;
  },
  update(dt) {
    this.t += dt; if (this.t < this.ENTER) return;
    this.lineT += dt; if (this.lineT < 0.5) return;
    const last = this.line >= this.who.lines.length - 1;
    if (last && pressed("b")) { this.active = false; anointing.start(() => backToMap()); return; }
    if (pressed("a") || pressed("start") || (!last && pressed("b"))) { if (!last) { this.line++; this.lineT = 0; } else { this.active = false; backToMap(); } }
  },
  draw() {
    const P = this.who, cx = anointing.camX(), y = GR * T, a = Math.min(1, this.t / 0.8), s = this.SIZE;
    drawBackground(cx); drawFlatGround(cx);
    drawSprite("david_idle", frameOf("david_idle", this.t), W * 0.34, y, 1, s);   // David, home from the hills
    const tx = W * 0.6, f = Math.min(1, this.t / this.ENTER), x = W + 120 + (tx - W - 120) * (1 - (1 - f) * (1 - f));
    let nm = P.idle;
    if (f < 1 && P.walk && SPR[P.walk]) nm = P.walk;
    else if (f >= 1 && this.line === 1 && P.point && SPR[P.point]) nm = P.point;   // pointing off to the pastures
    else if (f >= 1 && P.talk && SPR[P.talk] && this.lineT < 2.5) nm = P.talk;
    drawSprite(nm, frameOf(nm, this.t), f < 1 && !(P.walk && SPR[P.walk]) ? tx : x, y, -1, s, f < 1 && !(P.walk && SPR[P.walk]) ? f : 1);
    ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,248,230,0.9)"; ctx.font = "italic 22px Georgia, serif";
    ctx.fillText("After the Anointing", W / 2, 50);
    if (this.t >= this.ENTER) {
      const last = this.line >= P.lines.length - 1;
      drawStoryBox(P.who, P.lines[this.line], last ? "A: back to the map    B: see the anointing again" : "A: next", true);
    }
  },
};

// from the map's Anointing stop ("#3-A"): the scene the first time, then back to the map; after that, a word from family
if (STORY_HASH === "3-A") {
  if ((savedProgress()["3-A"] || {}).cleared) afterAnoint.start();
  else anointing.start(() => { stageCleared("3-A", {}); backToMap(); });
}

// ---------------------------------------------------------------------------
// 3-4 The Chosen Shepherd: the storm (rain, the dark, lightning), the fallen oak over The One, and the Wild Ox.
// The ox is NOT killed: it's driven off (DESIGN, World 3 boss). The arena (Glen's design, 2026-10-15): a big oak at each
// end and a low rock outside each one to hop over. The ox stays between the trees. It paws the ground facing David, then
// charges the length of the arena (roll under its horns). At the far end it either rams the tree and sits down dazed, or
// skids to a stop short of it and turns: you can't tell which until it happens. Only while it's dazed does a charged
// stone count. Three hits and it shakes its head and runs off into the rain.
// Art: Glen's four ox sheets (windup, charge, dazed, gallop); see drawOx below.
// ---------------------------------------------------------------------------
Object.assign(W3, {
  OX_SIZE: 1.6, OX_FILTER: "brightness(0.85)",   // a touch darker for the storm
  OX_TELL: 1.3,        // seconds pawing the ground before a charge (the warning)
  OX_CHARGE: 640,      // px/s
  OX_FAST: 1.15,       // each hit makes it this much quicker
  OX_STUCK: 2.6,       // seconds it sits dazed after ramming a tree (the window: a charged stone)
  OX_SKID: 0.8,        // seconds skidding to a stop when it pulls up short of the tree
  OX_HIT_CHANCE: 0.5,  // how often a charge ends in the tree...
  OX_MISS_MAX: 2,      // ...but never more than this many misses in a row
  OX_HITS: 3,          // dazed hits to drive it off
  LIGHTNING: [6, 10],  // seconds between flashes
  OAK_H: 9,            // the fight's oaks, tiles tall (Glen's oak sheet)
  OAK_FILTER: "brightness(0.85)",
  OAK_FALLEN_WIDEN: 3, OAK_FALLEN_X: 1, OAK_FALLEN_DROP: 10,   // The One's fallen oak: tiles wider than the hollow, tiles left of it, px down
});
const oxPiece = setPieces.find(p => p.kind === "ox");
const oxTrees = setPieces.filter(p => p.kind === "oxtree").map(p => ({ x: p.x, down: false, fallT: 0 })).sort((a, b) => a.x - b.x);
const ox = { on: !!oxPiece && oxTrees.length >= 2 };
const branches = [];
const oxLen = () => 230 * SCALE * W3.OX_SIZE;   // nose to tail on screen
function resetOx() {
  if (!ox.on) return;
  Object.assign(ox, { x: (oxTrees[0].x + oxTrees[1].x) / 2, y: GR * T, facing: -1, state: "wait", t: 0, hits: 0, misses: 0, vx: 0, flash: 0, alpha: 1, tree: null, told: {} });
  branches.length = 0;
}
resetOx();
const oxFight = () => ox.on && ox.state !== "wait" && ox.state !== "gone" && david.deadT <= 0;
const oxBlocking = () => ox.on && ox.state !== "gone" && ox.state !== "flee";
const oxArena = () => [oxTrees[0].x, oxTrees[1].x];   // between the two trees
const davidInArena = () => { const [a, b] = oxArena(); return david.x > a + 10 && david.x < b - 10 && david.deadT <= 0; };
function setOx(s) { if (ox.state !== s) { ox.state = s; ox.t = 0; } }
function oxBox() {   // generous: a stone from across the arena rises a little on its way
  const len = oxLen(), h = (ox.state === "stuck" ? 300 : 210) * SCALE * W3.OX_SIZE;
  const front = ox.x + ox.facing * 20, back = ox.x - ox.facing * (ox.state === "stuck" ? len * 1.15 : len);
  return { x0: Math.min(front, back), x1: Math.max(front, back), y0: ox.y - h, y1: ox.y };
}
function oxSay(key, text) { if (!ox.told[key]) { ox.told[key] = true; toast(text); } }
function updateOx(dt) {
  if (!ox.on) return;
  const O = ox, d = david, [ax0, ax1] = oxArena(), len = oxLen();
  O.t += dt; O.flash = Math.max(0, O.flash - dt);
  for (const b of branches) { b.vy += 1600 * dt; b.y += b.vy * dt; if (!b.hit && b.y > d.y - d.h && Math.abs(b.x - d.x) < 40 && b.y < d.y + 20) { b.hit = true; hurtDavid(b.x); } }
  for (let i = branches.length - 1; i >= 0; i--) if (branches[i].y > GR * T + 40) branches.splice(i, 1);
  if (O.state === "gone") return;
  if (O.state === "flee") { O.x += 520 * dt; O.facing = 1; O.alpha = Math.max(0, O.alpha - dt * 0.5); if (O.alpha <= 0) setOx("gone"); return; }
  if (O.state === "shake") {
    if (O.t > 1.6) { setOx("flee"); toast("It shook its head, snorted... and ran off into the rain. \"The voice of the LORD is powerful\" (Psalm 29:4)"); }
    return;
  }
  const inside = davidInArena();
  if (O.state === "wait") {   // out in the rain in the middle of the arena, until David hops in
    if (inside) { setOx("tell"); toast("A wild ox! Roll under its charge ({roll}). If it rams a tree and sits down dazed, hit it with a charged stone (hold B)."); }
    return;
  }
  const fast = Math.pow(W3.OX_FAST, O.hits);
  const noseMin = ax0 + 20, noseMax = ax1 - 20;   // how far its nose can go (the body runs back from the nose)
  O.walking = false;
  switch (O.state) {
    case "idle": {   // David hopped out: it trots back to the middle and stands there, snorting
      const mid = (ax0 + ax1) / 2;
      if (Math.abs(O.x - mid) > 20) { O.facing = Math.sign(mid - O.x); O.x += O.facing * 200 * dt; O.walking = true; }
      if (inside) setOx("tell");
      break;
    }
    case "tell":   // pawing the ground, head down, facing David: the warning
      if (!inside) { setOx("idle"); break; }
      O.facing = Math.sign(d.x - O.x) || O.facing;
      if (O.facing > 0 && O.x - len < ax0 + 10) O.x = ax0 + 10 + len;   // room for its body behind it
      if (O.facing < 0 && O.x + len > ax1 - 10) O.x = ax1 - 10 - len;
      if (O.t > W3.OX_TELL / fast) {
        O.willHit = O.misses >= W3.OX_MISS_MAX || Math.random() < W3.OX_HIT_CHANCE;
        setOx("charge");
      }
      break;
    case "charge": {
      O.x += O.facing * W3.OX_CHARGE * fast * dt;
      const wall = O.facing > 0 ? noseMax : noseMin, toWall = (wall - O.x) * O.facing;
      if (O.willHit && toWall <= 0) {   // horns into the trunk: down it goes, dazed
        O.x = wall; O.misses = 0; O.tree = O.facing > 0 ? oxTrees[1] : oxTrees[0]; setOx("stuck"); w2Shake.v = Math.max(w2Shake.v, 0.6);
        sfx("stone_hit", O.x, 1, 0.3); oxSay("stuck", "It rammed the tree! It's dazed. A charged stone, now!");
      } else if (!O.willHit && toWall <= 3 * T) {   // pulls up short
        O.misses++; O.skidV = W3.OX_CHARGE * fast * 0.7; setOx("skid");
        if (O.told.stuck) oxSay("short", "It stopped short of the tree: not dazed, so stones won't hurt it. Wait for the next one.");
      }
      break;
    }
    case "skid":   // sliding to a stop in the mud, short of the tree
      O.skidV = Math.max(0, (O.skidV || 0) - 900 * dt); O.x = Math.max(noseMin, Math.min(noseMax, O.x + O.facing * O.skidV * dt));
      if (O.t > W3.OX_SKID) setOx("turn");
      break;
    case "turn": if (O.t > 0.5) setOx(inside ? "tell" : "idle"); break;
    case "stuck":
      if (O.t > W3.OX_STUCK) { O.tree = null; setOx("turn"); oxSay("free", "It's up again! Watch for the next time it rams a tree."); }
      break;
  }
  // its horns: touching David hurts, unless he's rolling (or crawling) under them
  const low = d.state === "roll" || d.state === "crawl";
  if ((O.state === "charge" || O.state === "tell") && d.deadT <= 0 && !low) {
    const b = oxBox(), top = O.y - 150 * SCALE * W3.OX_SIZE;
    if (d.x + BODY_W / 2 > b.x0 && d.x - BODY_W / 2 < b.x1 && d.y > top && d.y - d.h < b.y1) hurtDavid(O.x);
  }
  if (O.state === "charge" && low && Math.abs(d.x - O.x) < 60) oxSay("roll", "Under its horns! Now watch where it ends up.");
}
function stoneHitsOx(s) {
  const O = ox; if (!O.on || O.state === "wait" || O.state === "flee" || O.state === "gone" || O.state === "shake") return false;
  const b = oxBox(); if (s.x < b.x0 || s.x > b.x1 || s.y < b.y0 || s.y > b.y1) return false;
  for (let k = 0; k < 8; k++) bits.push({ x: s.x, y: s.y, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 300, life: 0.5, color: "#fff2b0" });
  if (O.state === "stuck" && (s.charged || s.power)) {
    O.hits++; O.flash = 0.3; stoneHit(s); sfx("lion_hit", O.x, 0.8, 0.6); O.tree = null;
    if (O.hits >= W3.OX_HITS) { setOx("shake"); toast("It stopped."); }
    else { setOx("turn"); toast(`Hit! ${W3.OX_HITS - O.hits} more. It's angrier now, and quicker.`); }
    return true;
  }
  stoneHit(s, 0.6);
  if (O.state === "stuck") oxSay("tap", "A tap stone just bounces off. Hold B until the ring turns gold.");
  else oxSay("bounce", "Stones bounce off it while it's on its feet. Wait until it rams a tree.");
  return true;
}
function drawOx(camX) {
  if (!ox.on) return;
  for (const tr of oxTrees) {   // three big old oaks (Glen's sheet): gashed while the horns are in it, split once it's broken
    const x = tr.x - camX; if (x < -400 || x > W + 400) continue;
    if (ITEM.oak && ITEM.oak.naturalWidth) {
      const img = ITEM[tr.down ? "oak_split" : ox.tree === tr && ox.state === "stuck" ? "oak_gashed" : "oak"], h = W3.OAK_H * T * img.naturalHeight / ITEM.oak.naturalHeight, w = img.naturalWidth * h / img.naturalHeight;
      ctx.save(); ctx.filter = W3.OAK_FILTER; ctx.drawImage(img, x - w / 2, GR * T + 10 - h, w, h); ctx.restore();
      continue;
    }
    const img = ITEM.olive_tree; if (!img || !img.naturalWidth) continue;
    const h = 9 * T, w = img.naturalWidth * h / img.naturalHeight;
    ctx.save(); ctx.translate(x, GR * T + 6);
    if (tr.down) { const f = Math.min(1, tr.fallT / 0.9); ctx.rotate(f * f * 1.45 * (tr.x > ox.x ? 1 : -1)); ctx.globalAlpha = Math.max(0, 1 - Math.max(0, tr.fallT - 2) / 1.5); }
    ctx.filter = "brightness(0.7) saturate(0.8)"; ctx.drawImage(img, -w / 2, -h, w, h); ctx.restore();
  }
  for (const b of branches) { ctx.save(); ctx.translate(b.x - camX, b.y); ctx.rotate(b.y * 0.01); if (ITEM.log_short) ctx.drawImage(ITEM.log_short, -50, -14, 100, 28); ctx.restore(); }
  for (const p of setPieces) if (p.kind === "flockHuddle") {   // the flock, huddled together at the left of the arena
    const x = p.x - camX; if (x < -300 || x > W + 300) continue;
    [[-60, "sheep_stand"], [10, "sheepblack_stand"], [70, "sheep_stand"], [-20, "lamb_stand"], [40, "sheep_graze"]].forEach(([o, n], i) => {
      if (SPR[n]) drawSprite(n, 0, x + o + Math.sin(performance.now() / 90 + i) * (oxFight() ? 1.5 : 0), GR * T, i % 2 ? -1 : 1);
    });
  }
  if (ox.state === "gone") return;
  const x = ox.x - camX; if (x < -500 || x > W + 500) return;
  // Glen's ox sheets: ox_windup (stands, gets angry, digs in), ox_charge, ox_dazed (hits the tree, sits down dizzy,
  // shakes it off) and ox_gallop (running away, tail up)
  const once = (name, t, dur) => Math.min(SPR[name] ? SPR[name].frames - 1 : 0, Math.floor(t / dur * (SPR[name] ? SPR[name].frames : 1)));
  let name = "ox_windup", i = 0, filter = W3.OX_FILTER;
  if (ox.state === "tell") { i = 1 + Math.min(4, Math.floor(ox.t / W3.OX_TELL * 5)); filter += " drop-shadow(0 0 10px rgba(255,200,60,0.9))"; }
  else if (ox.state === "charge") { name = "ox_charge"; i = frameOf(name, ox.t); }
  else if (ox.state === "idle" && ox.walking) { name = "ox_charge"; i = frameOf(name, ox.t * 0.5); }   // trotting back to the middle
  else if (ox.state === "flee") { name = "ox_gallop"; i = frameOf(name, ox.t); }
  else if (ox.state === "stuck") { name = "ox_dazed"; i = ox.t < 1.2 ? once(name, ox.t, 1.2) : 3 + Math.floor(ox.t * 2.5) % 3; }
  else if (ox.state === "shake") { name = "ox_dazed"; i = [3, 4, 5, 4, 1, 0][Math.min(5, Math.floor(ox.t / 0.27))]; }
  else if (ox.state === "skid") { name = "ox_charge"; i = 0; }
  if (ox.flash > 0) filter += " brightness(2)";
  drawSprite(name, i, x, ox.y, ox.facing, W3.OX_SIZE, ox.alpha, filter);
}
function drawFallenOak(camX) {   // The One's hollow: Glen's fallen oak, roots over the rock at the left, the trunk across the top
  for (const p of setPieces) if (p.kind === "oak") {
    const x0 = p.c * T - camX; if (x0 > W + 300 || x0 + p.w * T < -300) continue;
    const img = ITEM.oak_fallen;
    if (img && img.naturalWidth) {
      const w = (p.w + W3.OAK_FALLEN_WIDEN) * T, h = img.naturalHeight * w / img.naturalWidth;
      ctx.save(); ctx.filter = W3.OAK_FILTER; ctx.drawImage(img, x0 - W3.OAK_FALLEN_X * T, GR * T + W3.OAK_FALLEN_DROP - h, w, h); ctx.restore();
      continue;
    }
    if (ITEM.log_long && ITEM.log_long.naturalWidth) ctx.drawImage(ITEM.log_long, x0 + 1.4 * T, p.r * T - 10, (p.w - 1.6) * T, T + 18);
    if (ITEM.stump_roots && ITEM.stump_roots.naturalWidth) { const img = ITEM.stump_roots, h = 3.4 * T, w = img.naturalWidth * h / img.naturalHeight; ctx.drawImage(img, x0 - w * 0.25, GR * T + 8 - h, w, h); }
  }
}
// the storm: darker, rain slanting down, and now and then lightning (in the arena it can bring a branch down)
const storm = { on: !!(STAGE_INFO && STAGE_INFO.storm), next: 4, flash: 0 };
function updateStorm(dt) {
  if (!storm.on) return;
  storm.flash = Math.max(0, storm.flash - dt * 2.2);
  storm.next -= dt;
  if (storm.next <= 0) {
    storm.next = W3.LIGHTNING[0] + Math.random() * (W3.LIGHTNING[1] - W3.LIGHTNING[0]); storm.flash = 1;
    setTimeout(() => {   // the thunder: Glen's thunder sounds (assets/sounds/thunder.mp3, thunder_2, thunder_3), one at random
      const th = ["thunder", "thunder_2", "thunder_3"].filter(n => SFX[n] && !SFX[n].missing);
      if (th.length) sfx(th[Math.floor(Math.random() * th.length)], undefined, 0.9, 0.9 + Math.random() * 0.2);
      w2Shake.v = Math.max(w2Shake.v, 0.25);
    }, 350);
    if (oxFight()) {   // a strike on the tree nearest David: a branch comes down
      const tr = oxTrees.slice().sort((a, b) => Math.abs(a.x - david.x) - Math.abs(b.x - david.x))[0];
      if (tr && Math.abs(tr.x - david.x) < 4 * T) { branches.push({ x: tr.x + (david.x - tr.x) * 0.6, y: GR * T - 6 * T, vy: 0 }); toast("Lightning hit the tree! Look out above!"); }
    }
  }
}
function drawStorm(camX) {
  if (!storm.on) return;
  ctx.save();
  const g = ctx.createLinearGradient(0, 0, 0, H);   // heavy cloud: darkest up top
  g.addColorStop(0, "rgba(22,28,40,0.72)"); g.addColorStop(0.55, "rgba(30,38,52,0.5)"); g.addColorStop(1, "rgba(20,26,36,0.35)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(200,215,235,0.35)"; ctx.lineWidth = 1.5; ctx.beginPath();
  const t = performance.now() / 1000;
  for (let k = 0; k < 140; k++) {   // rain: the same drops falling over and over, slanting with the wind
    const sx = (k * 97.3 + t * 260 - camX * 0.3) % (W + 200) - 100, sy = (k * 53.7 + t * 900) % (H + 60) - 30;
    ctx.moveTo(sx, sy); ctx.lineTo(sx - 9, sy + 26);
  }
  ctx.stroke();
  if (storm.flash > 0) { ctx.fillStyle = `rgba(235,240,255,${0.55 * storm.flash})`; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Hens in the village lanes (3-1): pecking about, they scatter, flapping, when David runs at them. Harmless, and
// they're the neighbors' hens: a stone just sends one off squawking (Glen's peck and run sheets).
//   critter("hen", c)
// ---------------------------------------------------------------------------
Object.assign(W3, { HEN_SIZE: 1.4, HEN_WANDER: 18, HEN_RUN: 250, HEN_SPOOK: 2.5, HEN_RANGE: 4 });   // RANGE: tiles from home
CRITTER_ART.hen = { idle: "chicken_peck", move: "chicken_run", len: 24, h: 40, box: k => ({ x0: k.x - 20, x1: k.x + 20, y0: k.y - 40, y1: k.y }) };
for (const k of critters) if (k.kind === "hen") { k.facing = k.home % 2 ? 1 : -1; k.t = (k.home % 5) * 0.7; }
function updateHen(k, dx, sameLevel, dt) {
  if (k.state === "run") {   // a flapping dash away from him, then back to pecking where she lands
    if (!runCritter(k, W3.HEN_RUN, dt) || k.t > 0.9 || Math.abs(k.x - k.home) > W3.HEN_RANGE * T * 1.5) setCrit(k, "peck");
    return;
  }
  if (k.state !== "peck") setCrit(k, "peck");
  if (Math.abs(k.x - k.home) > W3.HEN_RANGE * T) k.facing = Math.sign(k.home - k.x);
  else if (k.t > 3 + (k.home % 4) * 0.5) { k.facing = -k.facing; k.t = 0; }   // turns about now and then
  runCritter(k, W3.HEN_WANDER, dt);
  const fast = Math.abs(david.vx) > TUNE.WALK_SPEED * 0.6;
  if (sameLevel && david.deadT <= 0 && Math.abs(dx) < W3.HEN_SPOOK * T * (fast ? 1.6 : 1)) {
    k.facing = -Math.sign(dx) || 1; setCrit(k, "run");
  }
}
function stoneHitsHen(k, s) {
  k.facing = Math.sign(k.x - david.x) || 1; setCrit(k, "run");
  if (!W3.henStoned) { W3.henStoned = true; toast("Squawk! That's a neighbor's hen. Save your stones for the crows."); }
  return false;   // the stone flies on
}
function drawHen(k, x) {
  const nm = k.state === "run" ? "chicken_run" : "chicken_peck"; if (!SPR[nm]) return;
  drawSprite(nm, frameOf(nm, k.t + k.home), x, k.y, k.facing, W3.HEN_SIZE, k.alpha);
}

// ---------------------------------------------------------------------------
// Father's stray goat (3-1, DESIGN "bring a stray goat home through the lanes"): it's out nibbling by the woodpile.
// Walk up to it and it follows you; up a ladder or over the roofs it just leaps up after you (goats climb anything).
// Get it to Jesse at the end of the lanes. Glen's goat sheets: goat_stand (chew, look round, nibble), goat_walk, goat_run.
//   critter("goat", c)      W3.GOAT_HOME: the column it's going home to (Jesse)
// ---------------------------------------------------------------------------
Object.assign(W3, { GOAT_SIZE: 1.0,  GOAT_WALK: 150, GOAT_RUN: 380, GOAT_NEAR: 1.6, GOAT_FAR: 3.5, GOAT_LEAP: 9, GOAT_LOST: 22,
                    GOAT_LEAP_T: 0.65, GOAT_HOME: 214 });   // NEAR/FAR/LEAP/LOST in tiles; LEAP_T seconds in the air
CRITTER_ART.goat = { idle: "goat_stand", move: "goat_walk", len: 60, h: 70, box: k => ({ x0: k.x - 40, x1: k.x + 40, y0: k.y - 70, y1: k.y }) };
const standable = (x, y) => { const c = Math.floor(x / T), r = Math.floor(y / T); return isSolid(c, r) || isOneway(c, r); };
function goatLeap(k, tx, ty) {   // an arc from where it stands to (tx, ty), clearing whatever is between
  const top = Math.min(k.y, ty) - 70;
  Object.assign(k, { lx0: k.x, ly0: k.y, lx1: tx, ly1: ty, ltop: top, facing: Math.sign(tx - k.x) || k.facing });
  setCrit(k, "leap");
}
function updateGoat(k, dx, sameLevel, dt) {
  if (k.home2) {   // home with Jesse (and stays there, even if David falls and the critters reset)
    if (k.state !== "graze") { setCrit(k, "graze"); k.x = k.homeX; k.y = k.homeY; k.facing = 1; }
    return;
  }
  if (k.state === "leap") {
    const f = Math.min(1, k.t / W3.GOAT_LEAP_T), a = k.ly0 + (k.ly1 - k.ly0) * f;
    k.x = k.lx0 + (k.lx1 - k.lx0) * f; k.y = a - Math.sin(f * Math.PI) * (Math.max(k.ly0, k.ly1) - k.ltop);
    if (f >= 1) { k.y = k.ly1; k.vy = 0; k.onGround = true; setCrit(k, "walk"); }
    return;
  }
  if (!k.follow) {   // nibbling by the woodpile until he comes up to it
    if (k.state !== "idle") setCrit(k, "idle");
    if (sameLevel && Math.abs(dx) < 1.4 * T && david.deadT <= 0) {
      k.follow = true; toast("Father's goat got out again! It'll follow you. Lead it home to Father, at the far end of the lanes.");
    }
    return;
  }
  if (david.deadT > 0) { if (k.state !== "idle") setCrit(k, "idle"); return; }
  const adx = Math.abs(dx), ady = david.y - k.y;
  if (k.x > W3.GOAT_HOME * T - 3 * T && Math.abs(ady) < 40) {   // home
    k.home2 = true; k.homeX = k.x; k.homeY = k.y; k.facing = 1;
    toast("Father's goat is home. \"Good. One less thing to chase before the prophet comes.\"");
    return;
  }
  if (adx > W3.GOAT_LOST * T && david.onGround) {   // left far behind (or David fell): it comes trotting up the lane after him
    k.x = david.x - (david.facing || 1) * 2 * T; k.y = david.y;
    if (!standable(k.x, k.y)) k.x = david.x;
    setCrit(k, "idle"); return;
  }
  // he's up on a roof or a ledge (or down off one), standing still enough: leap to him
  if (david.onGround && Math.abs(ady) > 30 && adx < W3.GOAT_LEAP * T && k.onGround) {
    let tx = david.x - (Math.sign(dx) || 1) * 45;
    if (!standable(tx, david.y)) tx = david.x;
    goatLeap(k, tx, david.y); return;
  }
  if (adx < W3.GOAT_NEAR * T) { k.facing = Math.sign(dx) || k.facing; if (k.state !== "idle") setCrit(k, "idle"); k.vx = 0;
    k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt); return; }
  k.facing = Math.sign(dx) || 1;
  if (k.onGround && Math.abs(ady) < 30 && !standable(k.x + k.facing * 0.6 * T, k.y)) {   // a gap between the roofs: jump it
    for (let n = 2; n <= 5; n++) {
      const tx = k.x + k.facing * n * T;
      if (standable(tx, k.y) && !isSolid(Math.floor(tx / T), Math.floor(k.y / T) - 1)) { goatLeap(k, tx, k.y); return; }
    }
  }
  const fast = adx > W3.GOAT_FAR * T;
  setCrit(k, fast ? "run" : "walk");
  if (!runCritter(k, fast ? W3.GOAT_RUN : W3.GOAT_WALK, dt) && k.onGround && adx > 2 * T) {   // a wall or a gap in the way: hop it
    const tx = k.x + k.facing * 2.5 * T;
    let ty = null;
    for (let r = Math.floor(k.y / T) - 8; r <= Math.floor(k.y / T) + 4; r++) if (standable(tx, r * T) && !isSolid(Math.floor(tx / T), r - 1)) { ty = r * T; break; }
    if (ty !== null) goatLeap(k, tx, ty);
  }
}
function stoneHitsGoat(k, s) {
  if (!W3.goatStoned) { W3.goatStoned = true; toast("Not Father's goat! Save your stones for the crows."); }
  return false;   // the stone flies on
}
function drawGoat(k, x) {
  let nm = "goat_stand", i;
  if (k.state === "leap") { nm = "goat_run"; i = 4; }   // all four feet off the ground
  else if (k.state === "run") nm = "goat_run";
  else if (k.state === "walk") nm = "goat_walk";
  if (!SPR[nm]) return;
  if (i === undefined) i = frameOf(nm, k.t + (nm === "goat_stand" ? k.home : 0));
  drawSprite(nm, i, x, k.y, k.facing, W3.GOAT_SIZE, k.alpha);
}

// ---------------------------------------------------------------------------
// The end of World 3 (DESIGN "End of World 3 — reflection scene"): the storm passes at sunset, the flock is safe.
// Hanan walks up and gives David his own old shepherd's staff (Glen's clips: hanan_walk, hanan_give_staff, then the
// two of them, hanan_staff_to_david); Psalm 23:4. Then 1 Samuel 16:7, a rider far off on the road to Bethlehem (the
// king's messenger, setting up World 4), and David plays by the fire. Then the Journal.
// The gift: davidProgress.staff = one more heart, for good (main.js). It comes back at Goliath (1 Samuel 17:40).
// Background: Glen's sunset-after-the-rain set (w3_end), with 3-4's storm layers fading off it as the scene opens.
// ---------------------------------------------------------------------------
const w3ending = {
  active: false,
  lines: [
    ["Hanan", "That ox would have scattered the whole flock. You stood between them and it."],
    ["Hanan", "They say the prophet poured oil on your head. And here you are, back with the sheep the next day. Good."],
    ["Hanan", "I won't always be on these hills with you. Take this. When the path is hard, lean on it, and remember who leads you."],
  ],
  MID_H: 430, NEAR_H: 190, RIDER_Y: 250,  // layer heights on screen; how far above the ground the rider goes by
  RIDER_SIZE: 0.35, RIDE: 7,              // the far-off messenger's size, and seconds to cross
  DAVID_X: 520, FIRE_X: 900, WALK: 70,    // where David stands, the fire, Hanan's walking speed (his stride at this size)
  OFFER: 2.2, HANDOVER: 5.6, RAISE: 2.5,  // seconds: Hanan holding the staff out, the two of them, David lifting it up (Glen's clips)
  FLOCK_X: 330,                           // where David walks back to, with his staff
  start(done) {
    Object.assign(this, { active: true, t: 0, step: 0, stepT: 0, done, hananX: W + 30, gave: false, fade: 0 });
    hushLoops(); dialog.t = 0;
  },
  next() { this.step++; this.stepT = 0; },
  sc(name) { return SCALE * (TUNE.SPRITE_SIZE[name] || 1); },
  hananStop() { return this.DAVID_X + 192 * this.sc("hanan_staff_to_david"); },   // so the two-person clip lines up with them
  update(dt) {
    this.t += dt; this.stepT += dt; this.fade = Math.min(1, this.t / 1.5);
    const A = pressed("a") || pressed("b") || pressed("start");
    const say = i => { dialog.who = this.lines[i][0]; dialog.say = this.lines[i][1]; dialog.t = 90; };
    switch (this.step) {
      case 0: if (this.stepT > 3.5) this.next(); break;                                        // the rain stops, the sun comes out
      case 1: this.hananX = Math.max(this.hananStop(), this.hananX - this.WALK * dt); if (this.hananX <= this.hananStop()) { say(0); this.next(); } break;
      case 2: if (A) { say(1); this.next(); } break;
      case 3: if (A) { dialog.t = 0; this.next(); } break;
      case 4: if (this.stepT > this.OFFER) { say(2); this.next(); } break;                       // he holds it out
      case 5: if (A) { dialog.t = 0; this.next(); } break;
      case 6:                                                                                   // David takes it, and lifts it up
        if (this.stepT > this.HANDOVER + this.RAISE * 0.5 && !this.gave) {
          this.gave = true; sfx("extra_life", undefined, 0.7);
          try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.staff = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
        }
        if (this.gave && this.stepT > this.HANDOVER + this.RAISE && A) { this.davidX = this.DAVID_X; this.next(); }
        break;
      case 7:                                                                                   // back to his sheep, with the staff
        this.davidX = Math.max(this.FLOCK_X, this.davidX - TUNE.WALK_SPEED * 0.8 * dt); if (this.davidX <= this.FLOCK_X && this.stepT > 1) this.next(); break;
      case 8: if (this.stepT > 1.5 && A) this.next(); break;                                    // 1 Samuel 16:7
      case 9: if (this.stepT > 4 && A) this.next(); break;                                      // the rider on the road
      case 10:                                                                                  // by the fire, David plays
        if (this.stepT < 0.1 && audioUnlocked && harpMusic.paused) { harpMusic.currentTime = 0; harpMusic.volume = 0; harpMusic.play().catch(() => {}); }
        harpMusic.volume = Math.min(TUNE.HARP_VOLUME, harpMusic.volume + dt * 0.4);
        if (this.stepT > 3.5 && A) this.next();
        break;
      case 11: harpMusic.volume = Math.max(0, harpMusic.volume - dt * 0.8); if (this.stepT > 1.2) { harpMusic.pause(); this.active = false; const cb = this.done; this.done = null; cb && cb(); } break;
    }
  },
  drawLand(gy, now) {
    const clear = this.step === 0 ? Math.min(1, this.stepT / 3) : 1;
    const layers = (L, a) => {
      if (!L || a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      if (L.far && L.far.naturalWidth) ctx.drawImage(L.far, 0, 0, W, H);
      if (L.mid && L.mid.naturalWidth) drawLayerRepeating(L.mid, 0, 1, gy + 10, this.MID_H, true);
      if (L.near && L.near.naturalWidth) drawLayerRepeating(L.near, 0, 1, gy + 22, this.NEAR_H, true);
      ctx.restore();
    };
    ctx.fillStyle = "#2a2f3c"; ctx.fillRect(0, 0, W, H);
    layers(BG.w3_end, 1);
    layers(BG.w3_4, 1 - clear);   // the storm, fading off
    ctx.fillStyle = terPattern("sediment", TUNE.TER_FILL_SCALE) || "#3a3326"; ctx.fillRect(0, gy - 2, W, H - gy + 2);
    terStrip("topsoil", -4, W + 4, gy - TUNE.TER_GRASS_RISE, TUNE.TER_TOPSOIL_H);
    if (clear < 1) {   // the last of the rain
      ctx.save(); ctx.strokeStyle = `rgba(200,215,235,${0.35 * (1 - clear)})`; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let k = 0; k < 140; k++) { const sx = (k * 97.3 + now * 260) % (W + 200) - 100, sy = (k * 53.7 + now * 900) % (H + 60) - 30; ctx.moveTo(sx, sy); ctx.lineTo(sx - 8, sy + 22); }
      ctx.stroke(); ctx.restore();
    }
  },
  drawRider(gy, now) {   // the king's messenger far off on the hills, galloping toward Bethlehem (on the right): Glen's clip
    const k = Math.min(1, this.stepT / this.RIDE), x = W * 0.08 + k * W * 0.62, y = gy - this.RIDER_Y + Math.sin(k * 3) * 4;
    ctx.save(); ctx.globalAlpha = Math.min(1, this.stepT * 2);
    if (SPR.messenger_gallop) drawSprite("messenger_gallop", frameOf("messenger_gallop", now), x, y, 1, this.RIDER_SIZE, 1, "saturate(0.7) brightness(0.85)");   // a little hazy, far away
    else {
      if (SPR.donkey_walk) drawSprite("donkey_walk", frameOf("donkey_walk", now * 1.8), x, y, 1, 0.32, 1, "brightness(0.15)");
      ctx.fillStyle = "#1c1612"; ctx.beginPath(); ctx.ellipse(x - 4, y - 30, 5, 10, 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x - 2, y - 44, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  },
  draw() {
    const now = performance.now() / 1000, gy = 560;
    this.drawLand(gy, now);
    if (this.step === 9) this.drawRider(gy, now);
    const flock = [["sheep_graze", 90, 1], ["sheepblack_graze", 300, -1], ["sheep_stand", 380, 1], ["lamb_graze", 210, 1], ["sheep_graze", 40, -1], ["sheep_stand", 160, -1]];
    for (const [nm, x, f] of flock) if (SPR[nm]) drawSprite(nm, frameOf(nm, now + x), x, gy, f);
    if (this.step >= 10) {   // by the fire: Hanan on his rock, David on the other side with the harp
      const fx = this.FIRE_X - 220;
      drawItem("campfire", fx, gy + 4, 0.55);
      ctx.save(); ctx.globalCompositeOperation = "lighter"; const r = 70 + Math.sin(now * 11) * 6, g = ctx.createRadialGradient(fx, gy - 34, 4, fx, gy - 34, r);
      g.addColorStop(0, "rgba(255,170,60,0.4)"); g.addColorStop(1, "rgba(255,120,30,0)"); ctx.fillStyle = g; ctx.fillRect(fx - r, gy - 34 - r, r * 2, r * 2); ctx.restore();
      if (SPR.hanan_idle_nostaff) drawSprite("hanan_idle_nostaff", frameOf("hanan_idle_nostaff", now), fx - 100, gy, 1);   // standing by the fire, his hands empty
      else { drawItem("boulder_grey", fx - 92 - 30 * SCALE, gy + 4, 92 * SCALE / 375); if (SPR.hanan_sit) drawSprite("hanan_sit", frameOf("hanan_sit", now), fx - 92, gy, 1); }
      drawStaff(fx + 165, gy + 4, 0.95);   // standing beside him (a little taller than David)
      const k = Math.floor(now * 1000 / TUNE.HARP_LOOP_MS) % 6, i = 8 + (k < 4 ? k : 6 - k);
      drawSprite("david_play_harp", i, fx + 120, gy, -1);   // sitting on the ground by the fire, as in the stages
    } else {
      drawItem("campfire", this.FIRE_X, gy + 4, 0.55);
      if (this.step <= 5 || !SPR.hanan_staff_to_david) drawSprite("david_idle", frameOf("david_idle", now), this.DAVID_X, gy, 1);
      if (this.step >= 1 && this.step <= 5) {   // Hanan: walking up, talking, holding the staff out
        let nm = this.step === 1 ? "hanan_walk" : dialog.t > 0 && dialog.who === "Hanan" && this.step < 4 ? "hanan_talk" : "hanan_idle", i = frameOf(nm, now);
        if (this.step >= 4 && SPR.hanan_give_staff) { nm = "hanan_give_staff"; i = this.step === 4 ? Math.min(SPR[nm].frames - 1, Math.floor(this.stepT / this.OFFER * SPR[nm].frames)) : SPR[nm].frames - 1; }
        if (SPR[nm]) drawSprite(nm, i, this.hananX, gy, -1);
      }
      if (this.step === 6 && SPR.hanan_staff_to_david) {   // the two of them (Glen's clips, mirrored: Hanan on the right)
        const raising = this.stepT > this.HANDOVER && SPR.hanan_david_raise_staff, nm = raising ? "hanan_david_raise_staff" : "hanan_staff_to_david", s = SPR[nm];
        const i = Math.min(s.frames - 1, Math.floor((raising ? this.stepT - this.HANDOVER : this.stepT) / (raising ? this.RAISE : this.HANDOVER) * s.frames));
        drawSprite(nm, i, this.DAVID_X + 105 * this.sc(nm), gy, -1);
      }
      if (this.step >= 7) {   // Hanan stays by the fire; David with his staff, walking back to the flock, then standing with them
        const hn = SPR.hanan_idle_nostaff ? "hanan_idle_nostaff" : "hanan_idle";   // he's given it away (Glen's clip)
        drawSprite(hn, frameOf(hn, now), this.hananStop(), gy, -1);
        const nm = SPR.david_walk_staff ? "david_walk_staff" : "david_walk", walking = this.step === 7 && this.davidX > this.FLOCK_X;
        drawSprite(nm, walking ? frameOf(nm, now) : 0, this.davidX, gy, -1);
      }
    }
    if (this.step === 6 && this.gave) {   // the gift card
      ctx.save(); ctx.globalAlpha = Math.min(1, (this.stepT - this.HANDOVER - this.RAISE * 0.5) * 2);
      const cy = 80;
      ctx.fillStyle = "rgba(25,14,6,0.85)"; ctx.beginPath(); ctx.roundRect(W / 2 - 420, cy, 840, 150, 16); ctx.fill();
      drawStaff(W / 2 - 350, cy + 140, 0.85);
      ctx.textAlign = "center"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 26px sans-serif"; ctx.fillText("Hanan's shepherd's staff", W / 2 + 40, cy + 44);
      ctx.fillStyle = "#e9dcc4"; ctx.font = "18px sans-serif"; ctx.fillText("One more heart, for good.", W / 2 + 40, cy + 74);
      ctx.font = "italic 18px Georgia, serif"; ctx.fillText("\"Your rod and your staff, they comfort me.\"  Psalm 23:4", W / 2 + 40, cy + 108);
      ctx.restore(); ctx.textAlign = "left";
    }
    if (this.step === 0) caption("The storm passed. The flock was safe.", Math.min(1, this.stepT * 1.5) * Math.min(1, (3.5 - this.stepT) * 2));
    if (this.step === 8) {   // 1 Samuel 16:7 (WEB, "the LORD" for Yahweh)
      ctx.save(); ctx.globalAlpha = Math.min(1, this.stepT * 1.5);
      ctx.fillStyle = "rgba(8,10,24,0.72)"; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = "center"; ctx.fillStyle = "#fff6dc"; ctx.font = "italic 30px Georgia, serif";
      ctx.fillText("\"Don't look on his face, or on the height of his stature...", W / 2, 250);
      ctx.fillText("for I don't see as man sees. For man looks at the", W / 2, 298);
      ctx.fillText("outward appearance, but the LORD looks at the heart.\"", W / 2, 346);
      ctx.fillStyle = "#ffe08a"; ctx.font = "20px Georgia, serif"; ctx.fillText("1 Samuel 16:7", W / 2, 400);
      ctx.restore(); ctx.textAlign = "left";
    }
    if (this.step === 9) caption("Far off, a rider on the road to Bethlehem. A messenger from the king.", Math.min(1, this.stepT * 1.5));
    if (this.step === 10 && this.stepT > 3.5) caption(typeof JOURNAL_PAGES !== "undefined" && JOURNAL_PAGES[WORLD] ? "Press A to write in the Journal" : "Press A to continue", 1, true);
    else if (this.step === 2 || this.step === 3 || this.step === 5 || (this.step === 6 && this.gave && this.stepT > this.HANDOVER + this.RAISE) || (this.step === 8 && this.stepT > 1.5) || (this.step === 9 && this.stepT > 4)) caption("A: next", 0.8, true);
    if (dialog.t > 0) drawDialog();
    if (this.fade < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - this.fade})`; ctx.fillRect(0, 0, W, H); }
    if (this.step === 10 && this.stepT < 0.8) { ctx.fillStyle = `rgba(0,0,0,${1 - this.stepT / 0.8})`; ctx.fillRect(0, 0, W, H); }   // a fade to the fire
    if (this.step === 11) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, this.stepT / 1.2)})`; ctx.fillRect(0, 0, W, H); }
  },
};
function drawStaff(x, y, s) {   // Hanan's staff standing up, foot at x, y: Glen's art (assets/items/staff.png), or a drawn crook
  const img = ITEM.staff;
  if (img && img.naturalWidth) { const h = 330 * SCALE * s, w = img.naturalWidth * h / img.naturalHeight; ctx.drawImage(img, x - w / 2, y - h, w, h); return; }
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = "round";
  for (const [w, c] of [[11, "#3a2410"], [7, "#7a5130"]]) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -200); ctx.arc(-18, -200, 18, 0, Math.PI + 0.5, true); ctx.stroke();
  }
  ctx.restore();
}
// "?w3end" in the address plays the End of World 3 scene straight away (testing); "?w3end=6" jumps to the hand-over
if (new URLSearchParams(location.search).has("w3end")) setTimeout(() => {
  const at = Number(new URLSearchParams(location.search).get("w3end")) || 0;
  w3ending.start(() => location.reload());
  if (at) Object.assign(w3ending, { step: at, hananX: w3ending.hananStop(), davidX: at > 7 ? w3ending.FLOCK_X : w3ending.DAVID_X, gave: at > 6, fade: 1, t: 2 });
}, 300);

// ---------------------------------------------------------------------------
// Stray dogs (3-2): Glen's scruffy village dog plays the jackal's part (sits watching, runs in for the lamb, off with
// it in its jaws; a stone makes it drop it). mouth: [px ahead of its head, px up, lamb size] for the lamb it carries.
// ---------------------------------------------------------------------------
CRITTER_ART.dog = { idle: "dog_sit", move: "dog_run", walk: "dog_walk", len: 110, h: 60, mouth: [14, 22, 0.7] };
if (WORLD === 3 && SPR.dog_run) for (const k of critters) if (k.kind === "jackal") k.art = "dog";   // World 1's jackals stay jackals
