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
Object.assign(W3, { RAT_SIZE: 0.6 });   // Glen's rat run sheet, next to everything else
function drawRat(k, x) {   // a little brown rat: Glen's running rat (standing still = its first frame), or a drawn one
  if (SPR.rat_run) {
    const run = k.gone || k.state === "run";
    drawSprite("rat_run", run ? frameOf("rat_run", k.t) : 0, x + k.facing * 14, k.y + 2, k.facing, W3.RAT_SIZE, k.alpha);
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
  if (guides.length) {   // 3-3: Shammah runs ahead (after a fall he's back at the last spot David reached)
    if (david.deadT > 0) shammahRun.dead = true;
    else { if (shammahRun.dead) { shammahRun.dead = false; resetGuide(); } updateGuide(dt); }
  }
  for (const g of granaries) {   // the whip snake slid off its beam (David came in and left it be): the rats bolt
    if (g.saved || !g.snake) continue;
    const sn = g.snake, inside = david.x > g.x0 && david.x < g.x1 && david.deadT <= 0;
    if (sn.state === "idle" && !sn.gone && inside) { sn.state = "leave"; sn.t = 0; sn.facing = Math.sign((g.x0 + g.x1) / 2 - sn.x) || 1; }   // David came in under it
    if (sn.state === "leave" && !(sn.gone && sn.vy)) {   // (gone with a fling = it was slung)
      g.huntT += dt; if (g.huntT > W3.SNAKE_HUNT) ratsFlee(g, "The whip snake went after the rats. Let it do its job: the granary's clear.");
    }
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
  david.olives -= W3.OIL_COST; sh.freed = true;
  chime(7);
  for (let k = 0; k < 14; k++) bits.push({ x: sh.x, y: sh.y - 40, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 260, life: 0.8, color: "#e8d27a" });
  toast("You anointed its head with oil, and the flies are gone. \"You anoint my head with oil\" (Psalm 23:5)");
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
//   from behind, grabs one and makes off with it over his shoulders. A stone makes him drop it and run.
// Stand-in art: a villager's walk clip darkened to a shadowy figure, until Glen's rustler clip (ART_PROMPTS).
// ---------------------------------------------------------------------------
Object.assign(W3, { RUSTLER_AFTER: 10, RUSTLER_SNEAK: 120, RUSTLER_RUN: 230, RUSTLER_ART: "abinadab_walk", RUSTLER_FILTER: "brightness(0.3) saturate(0.5)" });
const rustlerH = () => { const s = SPR[W3.RUSTLER_ART]; return s ? s.ay * SCALE * (TUNE.SPRITE_SIZE[W3.RUSTLER_ART] || 1) : 190; };   // his height on screen
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
    runCritter(k, W3.RUSTLER_SNEAK, dt);
    if (Math.abs(k.target.x - k.x) < 30) {
      const sh = k.target; line.splice(line.indexOf(sh), 1); sh.state = "stolen"; k.sheep = sh;
      baa(sh.x, 1); setCrit(k, "flee"); toast("He's grabbed one of your sheep! Hit him with a stone!");
    }
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
  if (k.sheep) Object.assign(k.sheep, { x: k.x - k.facing * 6, y: k.y - rustlerH() * 0.55, facing: k.facing });   // across his shoulders
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
  { sons: ["nethanel", "raddai", "ozem", "elihu"], lines: [
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
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#f2c98a"); sky.addColorStop(0.6, "#f7e2b8"); sky.addColorStop(1, "#d9b382");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  const base = H * 0.7;   // Bethlehem behind them: Glen's houses along the street
  ["town_house_big", "town_house_fort", "town_house_shed", "town_house_big"].forEach((n, i) => {
    const img = ITEM[n]; if (!img || !img.naturalWidth) return;
    const h = H * (i % 2 ? 0.3 : 0.26), w = img.naturalWidth * h / img.naturalHeight;
    ctx.globalAlpha = a * 0.85; ctx.drawImage(img, W * (0.04 + i * 0.24), base - h + 8, w, h);
  });
  ctx.globalAlpha = a; ctx.fillStyle = "#c9a172"; ctx.fillRect(0, base, W, H - base);
  ctx.fillStyle = "rgba(60,36,12,0.18)"; ctx.fillRect(0, 0, W, H);
  const n = S.sons.length, gap = Math.min(170, W * 0.6 / n);
  S.sons.forEach((son, i) => {   // they walk in from the left and stand before Samuel (the camera, on the right)
    const tx = W * 0.62 - (n - 1 - i) * gap, f = Math.min(1, P.t / PASS_ENTER), x = -120 + (tx + 120) * (1 - (1 - f) * (1 - f));
    const walk = son + "_walk", idle = son === "eliab" ? "eliab_arms_crossed" : son + "_idle";
    if (f < 1 && SPR[walk]) drawSprite(walk, frameOf(walk, P.t), x, base + 6, 1, PASS_SIZE, a);
    else if (SPR[idle]) drawSprite(idle, frameOf(idle, P.t), x, base + 6, 1, PASS_SIZE, a);
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
// 3-3 We Will Not Sit Down. Fences (fence(c): rails up top, open underneath: jump it, or roll under and keep your speed), the drain under
// the town wall (The One is in there), and Shammah running ahead: he waits at each guide() spot and calls out the way
// when David catches up, then runs on to the next (straight through the fences: he knows the gaps).
// ---------------------------------------------------------------------------
Object.assign(W3, { GUIDE_RUN: 400, GUIDE_NEAR: 4 });   // Shammah's speed (px/s); how close (tiles) David gets before he runs on
function drawFence(p) {   // two posts in the ground, rails across rows 13-14, open underneath (rows 15-16)
  const x = p.c * T + T / 2, top = 13 * T - 8, low = 15 * T;
  ctx.fillStyle = "#6b4a2a";
  for (const dx of [-T * 0.62, T * 0.62]) { ctx.beginPath(); ctx.roundRect(x + dx - 6, top - 6, 12, GR * T + 8 - top, 4); ctx.fill(); }
  for (let k = 0; k < 3; k++) {
    const y = top + 4 + k * (low - top - 14) / 2;
    ctx.fillStyle = "#8a6238"; ctx.beginPath(); ctx.roundRect(x - T * 0.85, y, T * 1.7, 11, 4); ctx.fill();
    ctx.fillStyle = "rgba(255,230,190,0.25)"; ctx.fillRect(x - T * 0.81, y + 1, T * 1.62, 3);
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
  Object.assign(G, { i, x: guides[i].x, y: guides[i].y, moving: false, said: false });
}
function updateGuide(dt) {
  const G = shammahRun; if (!guides.length) return;
  G.t += dt;
  if (G.moving) {
    const g = guides[G.i], dx = g.x - G.x, step = W3.GUIDE_RUN * dt;
    G.facing = Math.sign(dx) || 1;
    if (Math.abs(dx) <= step) { G.x = g.x; G.y = g.y; G.moving = false; G.said = false; }
    else { const f = step / Math.abs(dx); G.x += Math.sign(dx) * step; G.y += (g.y - G.y) * f; }
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
  const name = G.moving ? "shammah_walk" : "shammah_idle";
  drawSprite(name, frameOf(name, G.t * (G.moving ? 1.6 : 1)), G.x, G.y, G.facing);
}

// ---------------------------------------------------------------------------
// The Anointing (1 Samuel 16:12-13): plays when 3-3 is cleared, before the Journal. At the sacrifice outside the town
// gate: Jesse's sons in a line (Glen's clip, David at the end), Samuel walks in with the horn of oil, the LORD says
// "this is the one", David steps forward, and Samuel pours the oil over his head in front of his brothers. A warm light
// and David's song for the Spirit: something changed in David, not in his sling (no new powers). A moves it on.
// ---------------------------------------------------------------------------
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
    drawBackground(cx); drawTiles(cx);
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
