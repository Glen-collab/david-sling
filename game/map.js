// The World 1 map, Super Mario Bros. 3 style, on Glen's Bethlehem painting (assets/maps/world1_map.png).
// A dotted trail along the dirt path, flashing stops for stages not yet cleared, a little David (and his lamb)
// walking between them. Left / Right (or Up / Down) = walk to the next stop, A = play it, Select = read the Journal.
// Progress (cleared stages, sheep, stones) is saved in the browser: localStorage "davidProgress".

const MTUNE = {
  WALK_SPEED: 260,        // map pixels per second
  DAVID_NEAR: 0.85,       // David's size at the front of the painting (bottom)...
  DAVID_FAR: 0.5,         // ...and at the back (top), so he shrinks as he walks into the distance
  REVEAL_TIME: 1.4,       // seconds for a newly opened stretch of trail to draw itself
  DOT_GAP: 26,            // spacing of the trail dots (map pixels)
  NIGHT: 0.9,             // how dark the map gets at the lion's cave (0 = not at all)
  AMBIENCE_VOLUME: 0.3,
};

// Map pixels are the painting's own (1672 x 941). Each stop has the trail that leads to it from the stop before.
const MAP_WORLDS = {
  1: {
    name: "The Shepherd's Fields", src: "../assets/maps/world1_map.png",
    stops: [
      { id: "home", label: "The sheepfold", x: 607, y: 331 },
      { id: "1-1", label: "The Hills of Bethlehem", x: 580, y: 540,
        trail: [[533, 367], [440, 400], [400, 460], [440, 513]] },
      { id: "1-2", label: "The Wandering Flock", x: 1133, y: 620,
        trail: [[680, 567], [787, 607], [933, 627], [1027, 622]] },
      { id: "1-3", label: "The Rocky Pastures", x: 940, y: 400,
        trail: [[1107, 560], [1053, 493], [1000, 427]] },
      { id: "1-4", label: "The Lion's Territory", x: 1507, y: 727, night: true,
        trail: [[1013, 440], [1133, 507], [1267, 587], [1387, 667]] },
    ],
    cairn: { x: 700, y: 352 },   // where the stones of remembrance stack up when all 12 are found
  },
};
const BUILT_STAGES = ["1-1", "1-2", "1-3", "1-4"];   // stages that exist so far (the rest say "coming soon")

function loadProgress() { try { return JSON.parse(localStorage.getItem("davidProgress") || "{}"); } catch (e) { return {}; } }
function saveProgress(p) { try { localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {} }
// called when a stage is cleared: remember it, and that the map should open the next stretch of trail
function stageCleared(id, info) {
  const p = loadProgress();
  const old = p[id] || {};
  p[id] = { cleared: true, sheep: Math.max(old.sheep || 0, info.sheep || 0), total: info.total || old.total || 0,
            one: !!(old.one || info.one), stones: Math.max(old.stones || 0, info.stones || 0) };
  p.justCleared = id; p.at = id;
  saveProgress(p);
}

const mapAmbience = new Audio(`../assets/sounds/ambience_hills.mp3?v=${window.BUILD || 0}`); mapAmbience.loop = true; mapAmbience.volume = 0;

const WorldMap = {
  active: false,
  open(world = 1) {
    const M = MAP_WORLDS[world]; if (!M) return;
    if (!M.img) { M.img = new Image(); M.img.src = M.src + "?v=" + (window.BUILD || 0); }
    this.M = M; this.world = world; this.active = true; this.fade = 0; this.t = 0; this.leaving = null;
    this.prog = loadProgress();
    // the full trail as one line: each stop's index along it
    this.pts = []; this.stopAt = [];
    for (const s of M.stops) {
      for (const p of s.trail || []) this.pts.push({ x: p[0], y: p[1] });
      this.stopAt.push(this.pts.length); this.pts.push({ x: s.x, y: s.y });
    }
    this.dist = [0];
    for (let i = 1; i < this.pts.length; i++) this.dist.push(this.dist[i - 1] + Math.hypot(this.pts[i].x - this.pts[i - 1].x, this.pts[i].y - this.pts[i - 1].y));
    // how far the trail is open: up to the first stage not cleared
    const cleared = id => this.prog[id] && this.prog[id].cleared;
    this.openTo = M.stops.findIndex((s, i) => i > 0 && !cleared(s.id)); if (this.openTo < 0) this.openTo = M.stops.length - 1;
    // a stage just cleared? walk the new stretch of trail in
    this.reveal = 1;
    const just = this.prog.justCleared;
    if (just) { delete this.prog.justCleared; saveProgress(this.prog); this.reveal = 0; sfxLater(() => chime(4), 0.3); }
    const atI = Math.max(0, M.stops.findIndex(s => s.id === (this.prog.at || "home")));
    this.cur = Math.min(atI, this.openTo);
    this.d = this.dist[this.stopAt[this.cur]]; this.target = this.cur; this.facing = 1; this.walkT = 0;
    this.lambD = this.d; this.lambFacing = 1;
    this.stones = stonesFound(world);
    if (typeof audioUnlocked !== "undefined" && audioUnlocked) mapAmbience.play().catch(() => {});
  },
  // a point (and direction) at distance d along the trail
  at(d) {
    d = Math.max(0, Math.min(this.dist[this.dist.length - 1], d));
    let i = 1; while (i < this.dist.length - 1 && this.dist[i] < d) i++;
    const a = this.pts[i - 1], b = this.pts[i], f = (d - this.dist[i - 1]) / Math.max(1e-6, this.dist[i] - this.dist[i - 1]);
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, dx: b.x - a.x, dy: b.y - a.y };
  },
  stopD(i) { return this.dist[this.stopAt[i]]; },
  update(dt) {
    this.t += dt;
    mapAmbience.volume = Math.max(0, Math.min(MTUNE.AMBIENCE_VOLUME * (1 - this.night()), mapAmbience.volume + (this.leaving ? -dt : dt * 0.5)));
    if (mapAmbience.paused && typeof audioUnlocked !== "undefined" && audioUnlocked && !this.leaving) mapAmbience.play().catch(() => {});
    if (this.leaving) {
      this.fade -= dt * 2;
      if (this.fade <= 0) { this.active = false; mapAmbience.pause(); const go = this.leaving; this.leaving = null; go(); }
      return;
    }
    this.fade = Math.min(1, this.fade + dt * 2);
    if (this.reveal < 1) { this.reveal = Math.min(1, this.reveal + dt / MTUNE.REVEAL_TIME); return; }
    // walking: toward the target stop along the trail
    const want = this.stopD(this.target), step = MTUNE.WALK_SPEED * dt;
    const moving = Math.abs(want - this.d) > 0.5;
    if (moving) {
      const dir = Math.sign(want - this.d);
      this.d += dir * Math.min(step, Math.abs(want - this.d));
      const p = this.at(this.d); this.dirX = p.dx * dir; this.dirY = p.dy * dir;
      if (Math.abs(this.dirX) > 4) this.facing = Math.sign(this.dirX);
      this.walkT += dt;
      if (Math.abs(want - this.d) <= 0.5) { this.d = want; this.cur = this.target; this.walkT = 0; chime(this.cur); this.prog.at = this.M.stops[this.cur].id; saveProgress(this.prog); }
    }
    // the lamb trots along behind him on the trail
    if (moving) this.lastDir = Math.sign(want - this.d) || this.lastDir;
    const lambWant = Math.max(0, this.d - (this.lastDir || 1) * 44);
    this.lambD += (lambWant - this.lambD) * Math.min(1, dt * 5);
    this.lambFacing = this.facing;
    if (moving) return;
    // choose a stop: forward = Right / Down, back = Left / Up (only as far as the trail is open)
    if ((pressed("right") || pressed("down")) && this.cur < this.openTo) this.target = this.cur + 1;
    if ((pressed("left") || pressed("up")) && this.cur > 0) this.target = this.cur - 1;
    const stop = this.M.stops[this.cur];
    if (pressed("select")) { this.readJournal(); return; }
    if (MAP_CHEAT && pressed("b") && stop.id !== "home") {   // ?cheat: B marks this stage cleared (testing the map)
      stageCleared(stop.id, {}); this.open(this.world); return;
    }
    if ((pressed("a") || pressed("start")) && stop.id !== "home") {
      if (BUILT_STAGES.includes(stop.id)) this.leaving = () => startStage(stop.id);
      else toast(`${stop.id} ${stop.label} isn't built yet. It's next!`);
    }
  },
  readJournal() {   // Select: page through what David has written so far
    const p = this.prog, last = [4, 3, 2, 1].find(k => p[`${this.world}-${k}`] && p[`${this.world}-${k}`].cleared);
    if (!last) { toast("Nothing in the Journal yet. Clear 1-1 first."); return; }
    this.active = false;
    Journal.open({ world: this.world, stage: last, read: true, onClose: () => { this.active = true; this.fade = 0; } });
  },
  night() {   // the walk toward the lion's cave turns the map to night
    const i = this.M.stops.findIndex(s => s.night); if (i < 1) return 0;
    const a = this.stopD(i - 1), b = this.stopD(i);
    return MTUNE.NIGHT * Math.max(0, Math.min(1, (this.d - a) / (b - a)));
  },
  // ---- drawing ----
  draw() {
    const M = this.M, img = M.img; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    if (!img.naturalWidth) { ctx.restore(); return; }
    ctx.globalAlpha = Math.max(0, this.fade);
    const s = Math.max(W / img.naturalWidth, H / img.naturalHeight), ox = (W - img.naturalWidth * s) / 2, oy = (H - img.naturalHeight * s) / 2;
    const P = (x, y) => [ox + x * s, oy + y * s];
    ctx.drawImage(img, ox, oy, img.naturalWidth * s, img.naturalHeight * s);
    // night falls toward the lion's cave
    const n = this.night();
    if (n > 0) {
      ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = `rgba(${255 - 190 * n | 0},${255 - 170 * n | 0},${255 - 90 * n | 0},1)`; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
    }
    // the trail: open stretches as dots; a just-opened stretch draws itself in
    const openD = this.stopD(this.openTo), prevD = this.openTo > 0 ? this.stopD(this.openTo - 1) : 0;
    const showD = this.reveal < 1 ? prevD + (openD - prevD) * this.reveal : openD;
    for (let d = MTUNE.DOT_GAP / 2; d < showD; d += MTUNE.DOT_GAP) {
      const p = this.at(d), [x, y] = P(p.x, p.y), r = (2.2 + 1.6 * (p.y / img.naturalHeight)) * s * 1.6;
      ctx.fillStyle = "rgba(60,35,15,0.55)"; ctx.beginPath(); ctx.arc(x + 1, y + 1.5, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff4d6"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    // the stops
    M.stops.forEach((st, i) => {
      if (i > this.openTo || (i === this.openTo && this.reveal < 1)) return;
      const [x, y] = P(st.x, st.y), depth = 0.7 + 0.5 * (st.y / img.naturalHeight), done = this.prog[st.id] && this.prog[st.id].cleared;
      const r = 17 * depth;
      if (st.id === "home") { this.marker(x, y, r * 0.85, "#c9a46a", "#5a3a1c", "⌂"); return; }
      const flash = !done && Math.floor(this.t * 2.5) % 2 === 0;
      if (!done) {   // a soft pulsing glow on the next stage
        const g = ctx.createRadialGradient(x, y, 2, x, y, r * 2.6);
        g.addColorStop(0, `rgba(255,220,120,${0.45 + 0.25 * Math.sin(this.t * 5)})`); g.addColorStop(1, "rgba(255,220,120,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, Math.PI * 2); ctx.fill();
      }
      this.marker(x, y, r, done ? "#e8d9b8" : flash ? "#ffd84a" : "#f7b733", done ? "#3d6b2a" : "#6b3a10", st.id.split("-")[1]);
      if (done) hudIcon(this.prog[st.id].one ? "sheep_one" : "sheep", x + r * 0.55, y - r * 2.1, r * 1.5);   // a sheep: home safe
    });
    // stones of remembrance: all 12 found = a little cairn by the fold
    if (this.stones >= 12) { const [cx, cy] = P(M.cairn.x, M.cairn.y); for (let k = 0; k < 5; k++) hudIcon("stone", cx - 14 + (k % 3) * 9 - (k > 2 ? -4 : 0), cy - 10 - Math.floor(k / 3) * 9 - (k === 4 ? 9 : 0), 16); }
    // David (and his lamb), smaller toward the back of the painting
    const dp = this.at(this.d), lp = this.at(this.lambD);
    const size = y => MTUNE.DAVID_FAR + (MTUNE.DAVID_NEAR - MTUNE.DAVID_FAR) * Math.max(0, Math.min(1, (y - 330) / 400));
    const moving = this.walkT > 0, away = moving && this.dirY < -Math.abs(this.dirX) * 0.6;   // walking up into the picture: his back to us
    const [lx, ly] = P(lp.x, lp.y), [dx, dy] = P(dp.x, dp.y);
    const drawLambTok = () => drawSprite(moving ? "lamb_run" : "lamb_stand", frameOf(moving ? "lamb_run" : "lamb_stand", this.t), lx, ly, this.lambFacing, size(lp.y) * 1.35, ctx.globalAlpha);
    const drawDavidTok = () => {
      ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(dx, dy, 18 * size(dp.y), 5 * size(dp.y), 0, 0, Math.PI * 2); ctx.fill();
      const name = !moving ? "david_idle" : away ? "david_walk_away" : "david_walk";
      drawSprite(name, frameOf(name, moving ? this.walkT : this.t), dx, dy, this.facing, size(dp.y), ctx.globalAlpha);
    };
    if (ly < dy) { drawLambTok(); drawDavidTok(); } else { drawDavidTok(); drawLambTok(); }
    // the panel: world name, and the stop David is standing at
    ctx.globalAlpha = Math.max(0, this.fade);
    this.panel(n);
    ctx.restore();
  },
  marker(x, y, r, fill, ink, text) {
    ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(x + 2, y + r * 0.55, r * 1.05, r * 0.45, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = fill; ctx.strokeStyle = ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = ink; ctx.font = `bold ${Math.round(r * 1.15)}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, x, y + 1); ctx.textBaseline = "alphabetic";
  },
  panel() {
    const st = this.M.stops[this.cur], p = this.prog[st.id] || {};
    // top left: the world
    ctx.fillStyle = "rgba(25,14,6,0.72)"; ctx.beginPath(); ctx.roundRect(14, 12, 330, 64, 12); ctx.fill();
    ctx.textAlign = "left"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 22px sans-serif"; ctx.fillText(`World ${this.world}`, 28, 38);
    ctx.fillStyle = "#fff"; ctx.font = "18px sans-serif"; ctx.fillText(this.M.name, 28, 62);
    hudIcon("stone", 236, 26, 28, 0.95); hudText(`${this.stones}/12`, 270, 48, 18);
    // bottom: this stop
    const w = 560, x = (W - w) / 2, y = H - 92;
    ctx.fillStyle = "rgba(25,14,6,0.76)"; ctx.beginPath(); ctx.roundRect(x, y, w, 78, 14); ctx.fill();
    ctx.textAlign = "center";
    if (st.id === "home") {
      ctx.fillStyle = "#ffe08a"; ctx.font = "bold 24px sans-serif"; ctx.fillText("Home: the family sheepfold", W / 2, y + 32);
      ctx.fillStyle = "#e9dcc4"; ctx.font = "16px sans-serif"; ctx.fillText("Right: walk out to the hills", W / 2, y + 60);
      return;
    }
    ctx.fillStyle = "#ffe08a"; ctx.font = "bold 24px sans-serif"; ctx.fillText(`${st.id}  ${st.label}`, W / 2, y + 32);
    ctx.fillStyle = "#e9dcc4"; ctx.font = "16px sans-serif";
    let line = p.cleared ? `Sheep found ${p.sheep || 0}/${p.total || 5}${p.one ? "  ·  The One ✓" : "  ·  The One: still out there"}  ·  stones ${p.stones || 0}/3` : BUILT_STAGES.includes(st.id) ? "A: play" : "Not built yet";
    if (p.cleared) line += "     A: play again";
    ctx.fillText(line, W / 2, y + 58);
    ctx.textAlign = "right"; ctx.font = "14px sans-serif"; ctx.fillStyle = "rgba(255,240,215,0.8)";
    ctx.fillText(`Left / Right: walk    Select: Journal${MAP_CHEAT ? "    B: mark cleared (cheat)" : ""}`, W - 14, H - 10);
  },
};
function sfxLater(fn, s) { setTimeout(fn, s * 1000); }
// start a stage from the map: "#1-2" in the address loads that stage
function startStage(id) {
  history.replaceState(null, "", location.pathname + location.search + "#" + id);
  location.reload();
}
const MAP_CHEAT = new URLSearchParams(location.search).has("cheat");
