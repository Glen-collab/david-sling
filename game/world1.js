// World 1's creatures and stage pieces (loaded after main.js):
//   foxes (go for your lamb), jackals (steal it and run: sling them to get it back), the wild ram (charges: roll under it),
//   crumbling ledges, rope bridges, fake rock (a secret way in), the night in 1-4 with the lion on the far ridge,
//   and the words people say at campfires and along the way.

// World 2's file loads right after this one. It's added from here, not index.html, because a browser can keep an old
// copy of index.html (the scripts themselves always load fresh).
document.write('<script src="world2.js?v=' + (window.BUILD || 0) + '"><\/script>');
document.write('<script src="world3.js?v=' + (window.BUILD || 0) + '"><\/script>');   // Bethlehem: houses, crows, rats
document.write('<script src="world4.js?v=' + (window.BUILD || 0) + '"><\/script>');
document.write('<script src="world5.js?v=' + (window.BUILD || 0) + '"><\/script>');   // the road to the valley: the provisions, raiders, vultures   // the road to Gibeah: the gift donkey, dogs, bandits, doves
document.write('<script src="world6.js?v=' + (window.BUILD || 0) + '"><\/script>');   // the Valley of Elah: the frightened soldiers, the tents, Eliab
document.write('<script src="harp_songs.js?v=' + (window.BUILD || 0) + '"><\/script>');   // the harp-duel charts (tools/make_harp_chart.py)

const W1 = {
  FOX_SPEED: 330, FOX_SEE: 560,          // px/s; how close before a fox comes for the lamb
  JACKAL_SPEED: 430, JACKAL_SEE: 620,
  JACKAL_FLEE: 330, JACKAL_FLEE_TIME: 2.4, // running off with the lamb: speed, and how long before it stops to look back
  RAM_CHARGE: 560, RAM_SEE: 430, RAM_TELL: 0.7, RAM_REST: 1.3,   // the ram stamps (tell) before it charges
  CRUMBLE_SHAKE: 0.5, CRUMBLE_BACK: 3.5,  // seconds a ledge shakes before it drops, and until it's back
  NIGHT_TINT: "rgb(108,122,178)",         // 1-4: the colour the night multiplies everything by
  CLOUD_EVERY: 16, CLOUD_TIME: 4, CLOUD_DARK: 0.28,   // now and then a cloud covers the moon (never pitch black)
  DIALOG_SECS: 6,
};
Object.assign(TUNE.SPRITE_SIZE, { fox_trot: 0.8, fox_sit: 0.8, jackal_run: 0.85, jackal2_sit: 0.85, jackal_carry_lamb: 0.85, raven_fly: 1.5 });

// ---------------------------------------------------------------------------
// Words from people: campfires (who/say) and talk() spots along the way
// ---------------------------------------------------------------------------
const dialog = { who: "", say: "", t: 0 };
function sayLine(who, say) { Object.assign(dialog, { who, say, t: Math.max(W1.DIALOG_SECS, say.split(" ").length * 0.33), hold: true, heldSay: say }); toastTime = 0; }   // hold: the stage waits until A (main.js frame)
const dialogHeld = () => dialog.hold && dialog.t > 0 && dialog.say === dialog.heldSay;   // (a story scene writing its own lines into the box isn't held)
function updateTalks(dt) {
  dialog.t = Math.max(0, dialog.t - dt);
  for (const k of talks) if (!k.done && david.x > k.x && david.x < MAIN_COLS * T && david.deadT <= 0) { k.done = true; sayLine(k.who, k.say); learnSkill(k.teach); }
}
function drawDialog() {
  if (dialog.t <= 0) return;
  const a = Math.min(1, dialog.t * 2, (W1.DIALOG_SECS + 99 - dialog.t));
  ctx.save();
  if (dialogHeld()) { ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(0, 0, W, H); }   // the stage is waiting for A: dim it so it reads as paused
  ctx.globalAlpha = a;
  ctx.font = "19px sans-serif";
  // wrap to two or three lines
  const words = keyText(dialog.say).split(" "), lines = []; let cur = "";
  for (const w of words) { const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > 760) { lines.push(cur); cur = w; } else cur = t; }
  lines.push(cur);
  const h = 44 + lines.length * 26, y = helpT > 0 ? 140 : 52;   // up in the sky, out of the way of the ground (below the help box while it shows)
  ctx.fillStyle = "rgba(25,14,6,0.82)"; ctx.beginPath(); ctx.roundRect(W / 2 - 410, y, 820, h, 14); ctx.fill();
  ctx.fillStyle = "#ffd98a"; ctx.font = "bold 18px sans-serif"; ctx.textAlign = "left"; ctx.fillText(dialog.who, W / 2 - 388, y + 28);
  ctx.fillStyle = "#fff"; ctx.font = "19px sans-serif";
  lines.forEach((l, i) => ctx.fillText(l, W / 2 - 388, y + 56 + i * 26));
  if (dialogHeld()) { ctx.fillStyle = `rgba(255,217,138,${0.6 + 0.4 * Math.sin(performance.now() / 250)})`; ctx.font = "bold 17px sans-serif"; ctx.textAlign = "right"; ctx.fillText(keyText("A: next"), W / 2 + 396, y + h - 10); ctx.textAlign = "left"; }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Crumbling ledges and rope bridges
// ---------------------------------------------------------------------------
const specialPlat = new Set();
for (const p of crumbles.concat(bridges)) for (let c = p.c; c < p.c + p.w; c++) specialPlat.add(c + "," + p.r);
function setPlat(p, on) { for (let c = p.c; c < p.c + p.w; c++) oneway[p.r][c] = on; }
function onPlat(p) {
  const d = david;
  return d.onGround && Math.abs(d.y - p.r * T) < 2 && d.x + BODY_W / 2 > p.c * T && d.x - BODY_W / 2 < (p.c + p.w) * T;
}
function updateCrumbles(dt) {
  for (const p of crumbles) {
    p.t += dt;
    if (p.state === "solid" && onPlat(p)) { p.state = "shake"; p.t = 0; }
    else if (p.state === "shake" && p.t > W1.CRUMBLE_SHAKE) { p.state = "fallen"; p.t = 0; p.fy = 0; p.fv = 0; setPlat(p, false); sfx("stone_hit", p.c * T, 0.5, 0.7); }
    else if (p.state === "fallen") {
      p.fv += 1600 * dt; p.fy += p.fv * dt;
      const inside = david.x + BODY_W / 2 > p.c * T && david.x - BODY_W / 2 < (p.c + p.w) * T && david.y > p.r * T - 4 && david.y - david.h < (p.r + 1) * T;
      if (p.t > W1.CRUMBLE_BACK && !inside) { p.state = "solid"; p.t = 0; setPlat(p, true); }
    }
  }
}
function resetCrumbles() { for (const p of crumbles) { p.state = "solid"; p.t = 0; setPlat(p, true); } }
function drawPlatforms(camX) {
  ctx.save(); ctx.translate(-Math.round(camX), 0);
  for (const p of crumbles) {
    const x0 = p.c * T, x1 = (p.c + p.w) * T;
    if (x1 < camX - 50 || x0 > camX + W + 50) continue;
    if (p.state === "fallen") {
      if (p.t < 0.9) {   // it breaks into Glen's four chunks, which tumble down
        ctx.save(); ctx.globalAlpha = 1 - p.t / 0.9;
        for (let k = 0; k < 4; k++) {
          const img = ITEM["ledge_chunk_" + (k + 1)], cw = (x1 - x0 + 12) / 4;
          if (!img || !img.naturalWidth) continue;
          const ch = img.naturalHeight * cw / img.naturalWidth, cx = x0 - 6 + k * cw + (k - 1.5) * p.t * 40, cy = p.r * T - 8 + p.fy * (0.85 + k * 0.1);
          ctx.save(); ctx.translate(cx + cw / 2, cy + ch / 2); ctx.rotate((k - 1.5) * p.t * 0.9); ctx.drawImage(img, -cw / 2, -ch / 2, cw, ch); ctx.restore();
        }
        ctx.restore();
      }
      else if (p.t > W1.CRUMBLE_BACK - 0.5) { ctx.save(); ctx.globalAlpha = Math.min(1, (p.t - W1.CRUMBLE_BACK + 0.5) * 2) * 0.6; drawCrumbleLedge(x0, x1, p.r * T); ctx.restore(); }
      continue;
    }
    const shake = p.state === "shake" ? Math.sin(p.t * 70) * 3 : 0;
    drawCrumbleLedge(x0 + shake, x1 + shake, p.r * T + Math.abs(shake) * 0.5);
  }
  for (const b of bridges) {
    const x0 = b.c * T - 6, x1 = (b.c + b.w) * T + 6, y = b.r * T, sag = 5;
    if (x1 < camX - 50 || x0 > camX + W + 50) continue;
    const br = ITEM.rope_bridge, post = ITEM.bridge_post;
    if (br && br.naturalWidth && post && post.naturalWidth) {   // Glen's rope bridge, stretched across, with a post at each end
      const w = x1 - x0 + 10, h = br.naturalHeight * w / br.naturalWidth * 0.8;
      ctx.drawImage(br, x0 - 5, y - h * 0.77, w, h);
      const ph = 74, pw = post.naturalWidth * ph / post.naturalHeight;
      ctx.drawImage(post, x0 - pw * 0.7, y - ph + 10, pw, ph);
      ctx.save(); ctx.translate(x1 + pw * 0.7, 0); ctx.scale(-1, 1); ctx.drawImage(post, 0, y - ph + 10, pw, ph); ctx.restore();
      continue;
    }
    // posts at each end
    for (const px of [x0 - 4, x1 - 6]) { ctx.fillStyle = "#6b4423"; ctx.fillRect(px, y - 52, 10, 66); ctx.fillStyle = "#8a5a30"; ctx.fillRect(px + 2, y - 52, 4, 66); }
    // hand ropes
    ctx.strokeStyle = "#c9a46a"; ctx.lineWidth = 3;
    for (const dy of [-46, -26]) { ctx.beginPath(); ctx.moveTo(x0, y + dy); ctx.quadraticCurveTo((x0 + x1) / 2, y + dy + 22, x1, y + dy); ctx.stroke(); }
    // planks, hanging a little lower in the middle
    for (let x = x0; x < x1; x += 16) {
      const f = (x + 8 - x0) / (x1 - x0), dy = Math.sin(Math.PI * f) * sag;
      ctx.fillStyle = "#7a4e2a"; ctx.fillRect(x, y - 2 + dy, 13, 9);
      ctx.fillStyle = "#9b6a3c"; ctx.fillRect(x, y - 2 + dy, 13, 3);
      ctx.strokeStyle = "rgba(201,164,106,0.8)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 6, y - 26 + Math.sin(Math.PI * f) * 16); ctx.lineTo(x + 6, y - 2 + dy); ctx.stroke();
    }
    ctx.strokeStyle = "#c9a46a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y + 4); ctx.quadraticCurveTo((x0 + x1) / 2, y + 4 + sag * 2, x1, y + 4); ctx.stroke();
  }
  ctx.restore();
}

// the dark inside of a cave: deep shadow behind the opening (and behind the fake rock, so it's dark when you find it)
function drawCaveDark(camX) {
  for (const z of darkZones) {
    const x = z.c * T - camX, y = z.r * T, w = z.w * T, h = z.h * T;
    if (x > W || x + w < 0) continue;
    const g = ctx.createLinearGradient(x, 0, x + Math.min(w, 3 * T), 0);
    g.addColorStop(0, "#2a1d12"); g.addColorStop(1, "#0c0805");
    ctx.fillStyle = g; ctx.fillRect(x, y - 4, w, h + 6);
  }
}
// a crumbling ledge: Glen's cracked ledge, stretched to the ledge's width, its flat top at y
function drawCrumbleLedge(x0, x1, y) {
  const img = ITEM.ledge_cracked;
  if (!img || !img.naturalWidth) { drawLedgeRun(x0, x1, y - 4); return; }
  const w = x1 - x0 + 14, h = Math.min(70, img.naturalHeight * w / img.naturalWidth);
  ctx.drawImage(img, x0 - 7, y - h * 0.12, w, h);
}
// ---------------------------------------------------------------------------
// Carved walls (material 7): Castlevania-style secrets. Stand at one and press Up; enter the first `need` pieces of
// the throw from memory (Jesse teaches one per world beaten, DESIGN §4c) and the stone cracks open.
// ---------------------------------------------------------------------------
const THROW_CODE = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a"];
const THROW_PIECE_LEN = [1, 1, 1, 1, 2, 2, 1, 1];   // how many buttons each world's piece adds
const ARROWS = { up: "↑", down: "↓", left: "←", right: "→", a: "A", b: "B" };
function throwLearned() {   // how many pieces Jesse has given you (= worlds beaten)
  try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); return Math.min(p.throwGiven || 0, [1, 2, 3, 4, 5, 6, 7, 8].filter(w => p[`${w}-4`] && p[`${w}-4`].cleared).length); } catch (e) { return 0; }
}
const codeEntry = { active: false, wall: null, code: [], got: 0, t: 0, result: null };
function nearCodeWall() {
  const d = david;
  return codeWalls.find(w => !w.open && d.onGround && d.x < w.c * T && d.x > w.c * T - 2 * T && d.y > w.r * T && d.y <= (w.r + w.h) * T + 2);
}
function updateCodeEntry(d, dt) {
  if (!codeEntry.active) {
    const w = nearCodeWall();
    if (!w || !pressed("up") || d.harp || d.throwT >= 0) return false;
    const learned = throwLearned();
    if (learned < w.need) {
      sayLine("David", w.need === 1 ? "There's a carving on this stone, like an arrow. I don't understand it yet. Maybe Father would." : `The carving has ${w.need} marks on it. I only know ${learned} piece${learned === 1 ? "" : "s"} of the throw so far.`);
      baa(d.x + 3 * T, 0.7);
      return false;
    }
    const n = THROW_PIECE_LEN.slice(0, w.need).reduce((a, b) => a + b, 0);
    Object.assign(codeEntry, { active: true, wall: w, code: THROW_CODE.slice(0, n), got: 0, t: 6, result: null });
    d.vx = 0; setState("idle");
    return true;
  }
  d.vx = 0;
  if (codeEntry.result) {
    codeEntry.result.t -= dt;
    if (codeEntry.result.t <= 0) { if (codeEntry.result.ok) openCodeWall(codeEntry.wall); codeEntry.active = false; }
    return true;
  }
  codeEntry.t -= dt;
  for (const b of ["up", "down", "left", "right", "a", "b"]) if (pressed(b)) {
    if (b === codeEntry.code[codeEntry.got]) { codeEntry.got++; chime(codeEntry.got); }
    else codeEntry.got = b === codeEntry.code[0] ? 1 : 0;
    break;
  }
  if (codeEntry.got >= codeEntry.code.length) codeEntry.result = { ok: true, t: 0.6 };
  else if (codeEntry.t <= 0) { codeEntry.result = { ok: false, t: 1.2 }; }
  if (pressed("select")) codeEntry.active = false;
  return true;
}
function openCodeWall(w) {
  w.open = true;
  for (let x = w.c; x < w.c + w.w; x++) for (let r = w.r; r < w.r + w.h; r++) solid[r][x] = 0;
  for (let k = 0; k < 26; k++) bits.push({ x: (w.c + 0.5) * T, y: (w.r + Math.random() * w.h) * T, vx: (Math.random() - 0.2) * 420, vy: -Math.random() * 420, life: 1.1, color: k % 3 ? "#d8cbb0" : "#a8977a" });
  sfx("stone_hit", w.c * T, 1, 0.6); sfx("final_stone", undefined, 0.5);
  toast("The carved stone cracks open!");
}
function resetCodeWalls() {
  for (const w of codeWalls) { w.open = false; for (let x = w.c; x < w.c + w.w; x++) for (let r = w.r; r < w.r + w.h; r++) solid[r][x] = 7; }
}
function drawCodeWalls(camX) {
  const lim = terPattern("limestone", TUNE.TER_FILL_SCALE), learned = throwLearned();
  for (const w of codeWalls) {
    if (w.open) continue;
    const x = w.c * T - camX, y = w.r * T, ww = w.w * T, hh = w.h * T;
    if (x > W + 40 || x + ww < -40) continue;
    ctx.save();
    ctx.fillStyle = lim || "#c9b48c"; ctx.fillRect(x - 3, y - 2, ww + 6, hh + 4);
    ctx.fillStyle = "rgba(60,40,20,0.25)"; ctx.fillRect(x - 3, y - 2, ww + 6, hh + 4);
    // the carving: one mark per piece it needs, glowing softly once you know enough of the throw
    const ready = learned >= w.need, glow = ready ? 0.55 + 0.35 * Math.sin(performance.now() / 300) : 0;
    ctx.font = "bold 20px sans-serif"; ctx.textAlign = "center";
    for (let k = 0; k < w.need; k++) {
      const cy = y + 22 + k * 26;
      if (ready) { ctx.shadowColor = `rgba(255,210,110,${glow})`; ctx.shadowBlur = 12; }
      ctx.fillStyle = ready ? "#f3d27a" : "rgba(70,45,20,0.85)"; ctx.fillText("↑", x + ww / 2, cy);
      ctx.shadowBlur = 0;
    }
    ctx.strokeStyle = "rgba(50,32,15,0.6)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 4, y + hh * 0.55); ctx.lineTo(x + ww * 0.6, y + hh * 0.7); ctx.lineTo(x + ww - 3, y + hh * 0.66); ctx.stroke();
    ctx.restore();
    if (Math.abs(david.x - x - camX) < 2.5 * T && !codeEntry.active && nearCodeWall() === w) upHint(x + ww / 2, y - 40);
  }
}
function drawCodeEntry() {
  if (!codeEntry.active) return;
  const n = codeEntry.code.length, box = 54, gap = 10, tw = n * box + (n - 1) * gap, bw = Math.max(tw + 60, 440), y = 180;
  ctx.fillStyle = "rgba(25,14,6,0.88)"; ctx.beginPath(); ctx.roundRect(W / 2 - bw / 2, y - 64, bw, box + 120, 16); ctx.fill();
  ctx.textAlign = "center"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 21px sans-serif"; ctx.fillText("The carved stone", W / 2, y - 30);
  for (let i = 0; i < n; i++) {
    const bx = W / 2 - tw / 2 + i * (box + gap), done = i < codeEntry.got;
    ctx.fillStyle = done ? "#e8b84a" : "rgba(255,255,255,0.12)"; ctx.beginPath(); ctx.roundRect(bx, y, box, box, 10); ctx.fill();
    ctx.fillStyle = done ? "#3a2410" : "rgba(255,255,255,0.35)"; ctx.font = "bold 28px sans-serif";
    ctx.fillText(done ? ARROWS[codeEntry.code[i]] : "?", bx + box / 2, y + 37);
  }
  ctx.font = "16px sans-serif"; ctx.fillStyle = "#e9dcc4";
  const r = codeEntry.result;
  ctx.fillText(r ? (r.ok ? "Crack!" : "Nothing happens. Try again (Up).") : `Enter the throw from memory  ·  ${Math.max(0, codeEntry.t).toFixed(1)} s  ·  Select: stop`, W / 2, y + box + 36);
  ctx.textAlign = "left";
}
// ---------------------------------------------------------------------------
// Fake rock (material 5): looks like the rest of the rock, but David can walk into it. It turns see-through
// while he's inside, so you can see what you found.
// ---------------------------------------------------------------------------
function drawFakeRock(camX) {
  const lim = terPattern("limestone", TUNE.TER_FILL_SCALE);
  const near = (c, r) => Math.abs(david.x - (c + 0.5) * T) < 3 * T && david.y > r * T - 2 * T && david.y - david.h < (r + 3) * T;
  ctx.save(); ctx.translate(-Math.round(camX), 0);
  for (let r = 0; r < ROWS; r++) for (let c = Math.max(0, Math.floor(camX / T) - 1); c <= Math.min(COLS - 1, Math.ceil((camX + W) / T) + 1); c++) {
    if (solid[r][c] !== 5) continue;
    ctx.globalAlpha = near(c, r) ? 0.35 : 1;
    ctx.fillStyle = lim || "#c9b48c"; ctx.fillRect(c * T, r * T, T + 0.5, T + 0.5);
    // the giveaway: a thin dark crack down the middle
    ctx.strokeStyle = "rgba(40,28,14,0.55)"; ctx.lineWidth = 2;
    if (solid[r][c + 1] === 5) { ctx.beginPath(); ctx.moveTo((c + 1) * T, r * T); ctx.lineTo((c + 1) * T - 4, r * T + T / 2); ctx.lineTo((c + 1) * T + 2, (r + 1) * T); ctx.stroke(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Foxes, jackals and the wild ram
// ---------------------------------------------------------------------------
const CRITTER_ART = {
  fox:    { idle: "fox_sit",     move: "fox_trot",  len: 110, h: 50 },
  jackal: { idle: "jackal2_sit", move: "jackal_run", carry: "jackal_carry_lamb", len: 120, h: 55 },
  ram:    { idle: "ram_stand",   move: "ram_run",   tell: "ram_butt", len: 95, h: 70 },
};
function critterBox(k) {   // the anchor is the head; the body runs back from it
  const a = CRITTER_ART[k.kind]; if (a.box) return a.box(k);   // (small animals: from the sprite, world2.js)
  const front = k.x + k.facing * 8, back = k.x - k.facing * a.len;
  return { x0: Math.min(front, back), x1: Math.max(front, back), y0: k.y - a.h, y1: k.y };
}
const touchesDavid = b => david.x + BODY_W / 2 > b.x0 && david.x - BODY_W / 2 < b.x1 && david.y > b.y0 && david.y - david.h < b.y1;
const lambFree = () => !lamb.carried && !lamb.stolen && david.deadT <= 0;
function setCrit(k, s) { if (k.state !== s) { k.state = s; k.t = 0; } }
function runCritter(k, speed, dt) {   // move along the ground; stop at a pit edge or a wall
  k.vx = k.facing * speed;
  if (k.onGround && !groundAhead(k, k.facing)) k.vx = 0;
  k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt);
  const x0 = k.x; collideBody(k, 50, 44, dt);
  return Math.abs(k.x - x0) > 0.2 * speed * dt;   // false = stuck
}
const CHASERS = new Set(["fox", "jackal", "wolf", "boar", "hyena", "villagedog", "bandit", "raider", "ram"]);
function updateCritters(dt) {
  for (const k of critters) {
    if (k.gone) { if (k.alpha > 0) { k.alpha -= dt * 1.2; k.x += k.vx * dt; if (k.fly) k.y += k.vy * dt; } continue; }
    if (k.fell) { k.gone = true; k.alpha = 0; continue; }   // ran into a pit
    k.t += dt;
    const sameLevel = Math.abs(david.y - k.y) < 90;
    // (Glen) a chaser right under David on a ledge used to flip left-right every frame: within 2 tiles below him it keeps
    // going the way it was facing, runs on past, turns, and comes back under: pacing, not jittering
    let dx = david.x - k.x;
    if (!sameLevel && CHASERS.has(k.kind) && k.facing && Math.abs(dx) < 2 * T) dx = k.facing * 2 * T;
    if (k.kind === "fox") updateFox(k, dx, sameLevel, dt);
    else if (k.kind === "jackal") updateJackal(k, dx, sameLevel, dt);
    else if (k.kind === "ram") updateRam(k, dx, sameLevel, dt);
    else if (k.kind === "boar") updateBoar(k, dx, sameLevel, dt);   // world2.js
    else if (k.kind === "donkey") updateDonkey(k, dx, sameLevel, dt);
    else if (k.kind === "wolf") updateWolf(k, dx, sameLevel, dt);
    else if (k.kind === "scorpion") updateScorpion(k, dx, sameLevel, dt);
    else if (k.kind === "hedgehog") updateHedgehog(k, dx, sameLevel, dt);
    else if (k.kind === "tortoise") updateTortoise(k, dx, sameLevel, dt);
    else if (k.kind === "crow") updateCrow(k, dx, sameLevel, dt);   // world3.js
    else if (k.kind === "rat") updateRat(k, dx, sameLevel, dt);
    else if (k.kind === "rustler") updateRustler(k, dx, sameLevel, dt);
    else if (k.kind === "hen") updateHen(k, dx, sameLevel, dt);
    else if (k.kind === "goat") updateGoat(k, dx, sameLevel, dt);
    else if (k.kind === "giftdonkey") updateGiftDonkey(k, dx, sameLevel, dt);   // world4.js
    else if (k.kind === "villagedog") updateVillageDog(k, dx, sameLevel, dt);
    else if (k.kind === "bandit") updateBandit(k, dx, sameLevel, dt);
    else if (k.kind === "raider") updateRaider(k, dx, sameLevel, dt);   // world5.js
    else if (k.kind === "hyena") updateHyena(k, dx, sameLevel, dt);
    else if (k.kind === "tobi") updateTobi(k, dx, sameLevel, dt);
    else if (k.kind === "gazelle") updateGazelle(k, dx, sameLevel, dt);
    else if (k.kind === "packdonkey") updatePackDonkey(k, dx, sameLevel, dt);
    else if (k.kind === "dove") updateDove(k, dx, sameLevel, dt);
    else if (k.kind === "guarddog") updateGuardDog(k, dx, sameLevel, dt);
  }
}
function foxBark(k) {   // Glen's fox sound, at most every 3 seconds per fox
  const now = performance.now(); if (now - (k.barkAt || 0) < 3000) return;
  k.barkAt = now; sfxOne(["fox_1", "fox_2", "fox_3"], k.x, 0.75);
}
function updateFox(k, dx, sameLevel, dt) {
  if (k.ambush && k.state === "idle") {   // hiding in its bush (3-4)
    k.alpha = 0; k.vx = 0;
    if (sameLevel && Math.abs(dx) < 3.5 * T && david.deadT <= 0) {
      k.alpha = 1; k.facing = Math.sign(dx) || -1; k.vx = k.facing * W1.FOX_SPEED * 1.3; k.vy = -720; k.onGround = false;
      setCrit(k, "leap"); foxBark(k);
      if (!W1.ambushTold) { W1.ambushTold = true; toast("A fox, hiding in the bush! Sling it before it gets your lamb."); }
    }
    return;
  }
  if (k.state === "leap") {   // out of the bush in one bound
    k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt);
    if (k.onGround && k.t > 0.15) setCrit(k, "hunt");
    return;
  }
  if (k.state === "idle") {
    k.facing = Math.sign(dx) || k.facing;
    if (Math.abs(dx) < W1.FOX_SEE && sameLevel) { setCrit(k, "hunt"); foxBark(k); }   // a bark as it comes for the lamb
    k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); k.vx = 0; collideBody(k, 50, 44, dt);
    return;
  }
  if (k.state === "back") {   // ran off after nipping at the lamb; comes round again
    runCritter(k, W1.FOX_SPEED * 0.8, dt);
    if (k.t > 1.3) { setCrit(k, "hunt"); foxBark(k); }   // and again each time it comes back round
    return;
  }
  // hunting: straight for the lamb (or David, if he's carrying it)
  const tx = lambFree() ? lamb.x : david.x;
  k.facing = Math.sign(tx - k.x) || k.facing;
  runCritter(k, W1.FOX_SPEED, dt);
  const b = critterBox(k);
  if (lambFree() && Math.abs(lamb.x - k.x) < 40 && Math.abs(lamb.y - k.y) < 50) {
    popLamb(); baa(lamb.x, 1);
    toast("The fox went for your lamb! Sling it to drive it off.");
    k.facing = -k.facing; setCrit(k, "back");
  } else if (touchesDavid(b)) { hurtDavid(k.x); k.facing = -k.facing; setCrit(k, "back"); }
}
function updateJackal(k, dx, sameLevel, dt) {
  if (k.state === "idle") {
    k.facing = Math.sign(dx) || k.facing;
    if (Math.abs(dx) < W1.JACKAL_SEE && sameLevel) { setCrit(k, "run"); sfx(k.art === "dog" ? "wolf_bark" : "jackal", k.x, 0.7); }
    k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); k.vx = 0; collideBody(k, 50, 44, dt);
    return;
  }
  if (k.state === "run") {   // darting in for the lamb
    const tx = lambFree() ? lamb.x : david.x;
    k.facing = Math.sign(tx - k.x) || k.facing;
    runCritter(k, W1.JACKAL_SPEED, dt);
    if (lambFree() && Math.abs(lamb.x - k.x) < 44 && Math.abs(lamb.y - k.y) < 50) {
      lamb.stolen = true; baa(lamb.x, 1); setCrit(k, "flee");
      toast(`A ${k.art === "dog" ? "stray dog" : "jackal"} grabbed your lamb! Chase it and hit it with a stone!`);
    } else if (touchesDavid(critterBox(k))) { hurtDavid(k.x); k.facing = -k.facing; setCrit(k, "bounce"); }
    return;
  }
  if (k.state === "bounce") { runCritter(k, W1.JACKAL_SPEED * 0.6, dt); if (k.t > 0.9) setCrit(k, "run"); return; }
  // carrying the lamb: run away from David, stop and look back, run again when he comes close
  if (k.state === "flee") {
    k.facing = -Math.sign(dx) || k.facing;
    const moved = runCritter(k, W1.JACKAL_FLEE, dt);
    if (k.t > W1.JACKAL_FLEE_TIME || !moved) setCrit(k, "wait");
  } else if (k.state === "wait") {
    k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt);
    k.facing = Math.sign(dx) || k.facing;   // turns to look at him
    if (Math.abs(dx) < 220 && k.t > 0.6) setCrit(k, "flee");
  }
}
function dropStolenLamb(k) {
  lamb.stolen = false; lamb.x = k.x; lamb.y = k.y; lamb.vx = 0; lamb.vy = -300;
  for (let i = 0; i < 10; i++) bits.push({ x: k.x, y: k.y - 30, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 380, life: 0.6, color: "#fff7c2" });
  trail.length = 0; baa(k.x, 1);
}
function updateRam(k, dx, sameLevel, dt) {
  const art = CRITTER_ART.ram;
  if (k.state === "idle") {   // grazing, wandering a little
    k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt);
    if (sameLevel && Math.abs(dx) < W1.RAM_SEE && david.deadT <= 0) { k.facing = Math.sign(dx) || k.facing; setCrit(k, "tell"); }
    return;
  }
  if (k.state === "tell") {   // lowers its head and stamps: your warning
    if (k.t > W1.RAM_TELL) { setCrit(k, "charge"); k.startX = k.x; }
    return;
  }
  if (k.state === "charge") {
    const moved = runCritter(k, W1.RAM_CHARGE, dt);
    const outOfRange = k.range && Math.abs(k.x - k.home) > k.range;
    if (touchesDavid(critterBox(k)) && david.state !== "roll") hurtDavid(k.x);   // roll and it goes right over you
    if (!moved || outOfRange || Math.abs(k.x - k.startX) > 10 * T) {
      if (outOfRange) k.x = k.home + Math.sign(k.x - k.home) * k.range;
      k.facing = -k.facing; setCrit(k, "rest");
    }
    return;
  }
  if (k.state === "rest" && k.t > W1.RAM_REST) setCrit(k, "idle");
}
function stoneHitsCritters(s) {
  for (const k of critters) {
    if (k.gone) continue;
    const b = critterBox(k);
    if (s.x < b.x0 - 6 || s.x > b.x1 + 6 || s.y < b.y0 - 34 || s.y > b.y1 + 4) continue;   // generous on top: they're low, and stones leave his hand at chest height
    if (k.kind === "boar") return stoneHitsBoar(k, s);   // world2.js
    if (k.kind === "donkey") return stoneHitsDonkey(k, s);
    if (k.kind === "wolf") return stoneHitsWolf(k, s);
    if (k.kind === "scorpion") return stoneHitsScorpion(k, s);
    if (k.kind === "hedgehog") return stoneHitsHedgehog(k, s);
    if (k.kind === "tortoise") return stoneHitsTortoise(k, s);
    if (k.kind === "crow") return stoneHitsCrow(k, s);   // world3.js
    if (k.kind === "rat") return stoneHitsRat(k, s);
    if (k.kind === "rustler") return stoneHitsRustler(k, s);
    if (k.kind === "hen") { stoneHitsHen(k, s); continue; }
    if (k.kind === "goat") { stoneHitsGoat(k, s); continue; }
    if (k.kind === "giftdonkey") return stoneHitsGiftDonkey(k, s);   // world4.js
    if (k.kind === "villagedog") return stoneHitsVillageDog(k, s);
    if (k.kind === "bandit") return stoneHitsBandit(k, s);
    if (k.kind === "raider") return stoneHitsRaider(k, s);
    if (k.kind === "hyena") return stoneHitsHyena(k, s);
    if (k.kind === "tobi") return stoneHitsTobi(k, s);
    if (k.kind === "gazelle") return stoneHitsGazelle(k, s);
    if (k.kind === "packdonkey") return stoneHitsPackDonkey(k, s);
    if (k.kind === "dove") { stoneHitsDove(k, s); continue; }
    if (k.kind === "guarddog") return stoneHitsGuardDog(k, s);
    if (k.kind === "ram") {   // stones just bounce off those horns
      stoneHit(s, 0.6);
      if (!k.told) { k.told = true; toast("Stones bounce off the ram's horns! Roll under its charge: {roll}."); }
      return true;
    }
    if (k.kind === "jackal" && (k.state === "flee" || k.state === "wait")) { dropStolenLamb(k); toast("It dropped your lamb!"); }
    else toast(k.kind === "fox" ? "Fox driven off!" : k.art === "dog" ? "Stray dog driven off!" : "Jackal driven off!");
    k.gone = true; k.facing = Math.sign(k.x - david.x) || 1; k.vx = k.facing * 420; stoneHit(s);
    return !s.power;
  }
  return false;
}
function resetCritters() {
  for (const k of critters) Object.assign(k, { gone: false, fell: false, alpha: 1, x: k.home, y: k.y0, vx: 0, vy: 0, state: "idle", t: 0, told: false });
  lamb.stolen = false;
}
function drawCritters(camX) {
  for (const k of critters) if (k.ambush) {   // the bushes the foxes hide in: a shiver when David gets close
    const x = k.home - camX; if (x < -200 || x > W + 200) continue;
    const near = k.state === "idle" && Math.abs(david.x - k.home) < 7 * T, sh = near ? Math.sin(performance.now() / 45) * 3 : 0;
    const bush = ITEM.bush && ITEM.bush.naturalWidth ? "bush" : "thorn_bush";   // Glen's leafy bush once it's in assets/items (TUNE.BUSH_SIZE)
    drawItem(bush, x + sh, k.y0 + 10, bush === "bush" ? (TUNE.BUSH_SIZE || 0.5) : 0.55);
  }
  for (const k of critters) {
    if (k.alpha <= 0) continue;
    const x = k.x - camX; if (x < -300 || x > W + 300) continue;
    if (k.kind === "boar") { drawBoar(k, x); continue; }   // world2.js
    if (k.kind === "donkey") { drawDonkey(k, x); continue; }
    if (k.kind === "wolf") { drawWolf(k, x); continue; }
    if (k.kind === "scorpion" || k.kind === "hedgehog") { drawSmallCritter(k, x, k.kind + "_walk"); continue; }
    if (k.kind === "tortoise") { drawTortoise(k, x); continue; }
    if (k.kind === "crow") { drawCrow(k, x); continue; }   // world3.js
    if (k.kind === "rat") { drawRat(k, x); continue; }
    if (k.kind === "rustler") { drawRustler(k, x); continue; }
    if (k.kind === "hen") { drawHen(k, x); continue; }
    if (k.kind === "goat") { drawGoat(k, x); continue; }
    if (k.kind === "giftdonkey") { drawGiftDonkey(k, x); continue; }   // world4.js
    if (k.kind === "villagedog") { drawVillageDog(k, x); continue; }
    if (k.kind === "bandit") { drawBandit(k, x); continue; }
    if (k.kind === "raider") { drawRaider(k, x); continue; }
    if (k.kind === "hyena") { drawHyena(k, x); continue; }
    if (k.kind === "tobi") { drawTobi(k, x); continue; }
    if (k.kind === "gazelle") { drawGazelle(k, x); continue; }
    if (k.kind === "packdonkey") { drawPackDonkey(k, x); continue; }
    if (k.kind === "dove") { drawDove(k, x); continue; }
    if (k.kind === "guarddog") { drawVillageDog(k, x); continue; }
    const a = CRITTER_ART[k.art || k.kind];   // (k.art: the same animal with other art, e.g. World 3's stray dog as a jackal)
    let name = a.move, i;
    if (k.gone) i = frameOf(name, k.t * 1.5);
    else if (k.state === "idle") { name = a.idle; i = frameOf(name, k.t); }
    else if (k.kind === "jackal" && (k.state === "flee" || k.state === "wait") && !a.carry) {   // no carrying sheet: the lamb in its jaws
      name = k.state === "wait" ? a.walk : a.move; i = k.state === "wait" ? 0 : frameOf(name, k.t);
      drawSprite(name, i, x, k.y, k.facing, 1, k.alpha);
      drawSprite("lamb_stand", 0, x + k.facing * a.mouth[0] * SCALE, k.y - a.mouth[1] * SCALE, k.facing, a.mouth[2], k.alpha);
      continue;
    }
    else if (k.kind === "jackal" && (k.state === "flee" || k.state === "wait")) { name = a.carry; i = k.state === "wait" ? 0 : frameOf(name, k.t); }
    else if (k.kind === "ram" && k.state === "tell") { name = a.tell; i = Math.min(SPR[name].frames - 2, Math.floor(k.t * 1000 / SPR[name].ms)); }   // head down, horns first
    else if (k.kind === "ram" && k.state === "rest") { name = a.idle; i = 0; }
    else i = frameOf(name, k.t * (k.kind === "ram" && k.state === "charge" ? 1.4 : 1));
    const shake = 0;
    const filter = k.kind === "ram" && k.state === "tell" ? "drop-shadow(0 0 8px rgba(255,200,60,0.9))" : "";
    drawSprite(name, i, x + shake, k.y, k.facing, 1, k.alpha, filter);
  }
}

// ---------------------------------------------------------------------------
// The harmless green whip snake: leave it alone and it slides off. Sling it and you've hit the wrong snake.
// ---------------------------------------------------------------------------
function updateWhipSnake(s, dt) {
  if (s.state === "idle" && Math.abs(david.x - s.x) < 230 && Math.abs(david.y - s.y) < 80) { s.state = "leave"; s.t = 0; s.facing = Math.sign(s.x - david.x) || 1; }
  if (s.state === "leave") {
    s.x += s.facing * 110 * dt;
    if (s.t > 1.6) { s.alpha = Math.max(0, s.alpha - dt * 1.5); if (s.alpha <= 0) s.gone = true; }
  }
}
const WHIP_FILTER = "hue-rotate(75deg) saturate(1.5) brightness(0.9)";

// ---------------------------------------------------------------------------
// 1-4: the night, a cloud over the moon now and then, and the lion on the far ridge, watching
// ---------------------------------------------------------------------------
const ridgeLion = { x: 700, t: 0, roarT: 12 };
function drawLionRidge(camX) {
  if (!STAGE_INFO.night || !lion || lion.awake || lion.state === "defeated" || david.x > arenaX - 6 * T) return;
  const R = ridgeLion, now = performance.now() / 1000;
  const walking = Math.sin(now * 0.35) > -0.55;   // pads along, stops, watches
  if (walking) R.x += 36 / 60;
  let sx = R.x - camX * 0.25;
  if (sx < -250) { R.x += W + 500; sx = R.x - camX * 0.25; }
  if (sx > W + 250) { R.x -= W + 500; sx = R.x - camX * 0.25; }
  const name = walking ? "lion_prowl" : "lion_sit_roar";
  drawSprite(name, walking ? frameOf(name, now) : 0, sx, GR * T - 175, 1, 0.32, 0.8, "brightness(0.3) saturate(0.3)");
}
function updateNight(dt) {
  if (!STAGE_INFO.night || !lion || lion.awake || lion.state === "defeated") return;
  ridgeLion.roarT -= dt;
  if (ridgeLion.roarT <= 0) { ridgeLion.roarT = 22 + Math.random() * 14; sfx("lion_roar", undefined, 0.22, 0.85); }   // far off
}
const nightCanvas = document.createElement("canvas"); nightCanvas.width = W; nightCanvas.height = H;
function drawNight(camX) {
  if (!STAGE_INFO.night || cave.room) return;
  ctx.save();
  if (STAGE_INFO.nightSky) {
    // tint only what's in front of the sky (the hills, ground, David...), then put Glen's painted sky behind it
    const g = nightCanvas.getContext("2d");
    g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, W, H); g.drawImage(ctx.canvas, 0, 0);
    g.globalCompositeOperation = "multiply"; g.fillStyle = W1.NIGHT_TINT; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = "destination-in"; g.drawImage(ctx.canvas, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
    drawFarLayer(camX); drawMidNear(camX, false); ctx.drawImage(nightCanvas, 0, 0);
  } else {
    ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = W1.NIGHT_TINT; ctx.fillRect(0, 0, W, H);
  }
  ctx.globalCompositeOperation = "source-over";
  const k = (performance.now() / 1000) % W1.CLOUD_EVERY, c = k < W1.CLOUD_TIME ? Math.sin(Math.PI * k / W1.CLOUD_TIME) : 0;
  if (c > 0) { ctx.fillStyle = `rgba(5,8,25,${W1.CLOUD_DARK * c})`; ctx.fillRect(0, 0, W, H); }
  ctx.globalCompositeOperation = "lighter";
  if (!STAGE_INFO.nightSky) {   // the moon's glow, top right (a painted sky has its own moon)
    const g = ctx.createRadialGradient(W - 160, 90, 10, W - 160, 90, 420);
    g.addColorStop(0, `rgba(150,170,220,${0.22 * (1 - c * 0.6)})`); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  // campfires still glow warm in the dark
  for (const f of fires) if (f.lit) {
    const x = f.x - camX, r = 150 + Math.sin(performance.now() / 90) * 10;
    if (x < -r || x > W + r) continue;
    const fg = ctx.createRadialGradient(x, f.y - 30, 6, x, f.y - 30, r);
    fg.addColorStop(0, "rgba(255,150,50,0.45)"); fg.addColorStop(1, "rgba(255,110,30,0)");
    ctx.fillStyle = fg; ctx.fillRect(x - r, f.y - 30 - r, r * 2, r * 2);
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Finding The One: the game stops for a moment, and a card shows what Jesus said about the one lost sheep.
// World English Bible (public domain). Jesus told it about a thousand years after David (DESIGN §3b).
// ---------------------------------------------------------------------------
const ONE_VERSE = "“Which of you men, if you had one hundred sheep, and lost one of them, wouldn’t leave the ninety-nine in the wilderness, and go after the one that was lost, until he found it?”";
const ONE_CREDIT = "Jesus, Luke 15:4. He told this story about a thousand years after David.";
const oneMoment = { active: false, t: 0 };
function startOneMoment() {
  Object.assign(oneMoment, { active: true, t: 0 });
  chime(5); setTimeout(() => chime(9), 180); setTimeout(() => chime(12), 380);
}
function updateOneMoment(real) {
  oneMoment.t += real;
  if (oneMoment.t > 1.2 && (pressed("a") || pressed("b") || pressed("start"))) oneMoment.active = false;
}
function drawOneMoment() {
  if (!oneMoment.active) return;
  const a = Math.min(1, oneMoment.t * 2);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = "rgba(10,6,2,0.55)"; ctx.fillRect(0, 0, W, H);
  const w = 760, x = W / 2 - w / 2, y = 150;
  const g = ctx.createLinearGradient(0, y, 0, y + 330); g.addColorStop(0, "rgba(58,36,14,0.96)"); g.addColorStop(1, "rgba(30,18,7,0.96)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, 330, 20); ctx.fill();
  ctx.strokeStyle = "rgba(255,214,120,0.6)"; ctx.lineWidth = 2; ctx.stroke();
  hudIcon("sheep_one", W / 2 - 34, y + 20, 68);
  ctx.textAlign = "center"; ctx.fillStyle = "#ffd98a"; ctx.font = "bold 28px sans-serif"; ctx.fillText("You found The One!", W / 2, y + 122);
  ctx.fillStyle = "#fff6e2"; ctx.font = "italic 22px Georgia, serif";
  const words = ONE_VERSE.split(" "), lines = []; let cur = "";
  for (const wd of words) { const t = cur ? cur + " " + wd : wd; if (ctx.measureText(t).width > w - 90) { lines.push(cur); cur = wd; } else cur = t; }
  lines.push(cur);
  lines.forEach((l, i) => ctx.fillText(l, W / 2, y + 168 + i * 32));
  ctx.fillStyle = "#d8c4a0"; ctx.font = "16px sans-serif"; ctx.fillText(ONE_CREDIT, W / 2, y + 180 + lines.length * 32 + 10);
  if (oneMoment.t > 1.2) { ctx.fillStyle = "rgba(255,240,215,0.75)"; ctx.font = "15px sans-serif"; ctx.fillText("A: continue", W / 2, y + 315); }
  ctx.restore();
}
