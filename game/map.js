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
  AMBIENCE_VOLUME: 0.15,   // the hills, quietly under the theme
  THEME_VOLUME: 0.55,      // "Hush Little Seed" (Glen's harp): the title screen and the maps
  THEME_REST: 2,           // seconds of quiet before it plays again
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
  // World 2: Glen's painting of the wilderness (2048 x 1152): the summer camp bottom-left, the oak woods with Hanan's
  // campfire, the dry riverbed, Tekoa on its hill, the cliffs and the spring, and the bear's ravine bottom-right.
  2: {
    name: "The Wilderness", src: "../assets/maps/world2_map.jpg",
    david: { far: 0.6, near: 0.95, y0: 300, y1: 1050 },
    stops: [
      { id: "home", label: "Jesse's house", x: 350, y: 990 },   // the summer camp (home is still Jesse's courtyard)
      { id: "2-1", label: "The Forest Trail", x: 540, y: 790, trail: [[440, 960], [500, 900], [500, 840]] },
      { id: "2-2", label: "The Dry Riverbed", x: 900, y: 560, trail: [[520, 700], [600, 600], [720, 560], [800, 560]] },
      { id: "2-3", label: "The High Cliffs", x: 1290, y: 560, trail: [[980, 640], [1100, 690], [1230, 640]] },
      { id: "2-4", label: "The Bear's Ravine", x: 1500, y: 950, trail: [[1330, 680], [1380, 800], [1440, 900]] },
    ],
  },
  // World 3: Glen's painting of Bethlehem on its festival day (1920 x 1280): Jesse's farmhouse bottom-left, the town in
  // the middle, the far pasture top-left, the fields and fences, the altar and the well by the gate, the storm on the right.
  3: {
    name: "The Anointing", src: "../assets/maps/world3_map.jpg",
    david: { far: 0.6, near: 0.95, y0: 300, y1: 1100 },
    stops: [
      { id: "home", label: "Jesse's house", x: 300, y: 1050 },
      { id: "3-1", label: "The Day Before", x: 850, y: 560, trail: [[420, 1000], [560, 930], [640, 870], [760, 800], [800, 690]] },
      { id: "3-2", label: "The Far Pasture", x: 270, y: 380, trail: [[680, 640], [480, 600], [330, 520]] },
      { id: "3-3", label: "We Will Not Sit Down", x: 560, y: 820, trail: [[260, 500], [300, 600], [400, 700], [480, 760]] },
      // a story stop, not a stage: the sacrifice at the altar by the well, inside the gate (1 Samuel 16:5). After 3-3,
      // David walks here by himself and the Anointing plays.
      { id: "3-A", label: "The Anointing", story: true, x: 1300, y: 415, trail: [[700, 720], [880, 620], [1060, 520], [1220, 410]] },
      // then out of the gate, down the muddy track into the storm
      { id: "3-4", label: "The Chosen Shepherd", x: 1640, y: 1040, trail: [[1360, 560], [1430, 700], [1500, 840], [1570, 960]] },
    ],
  },
  // World 4: Glen's painting of the road north to Gibeah (2048 x 1152): Bethlehem's gate bottom-left, the road up through
  // the vineyards (the keeper's watchtower beside it), the training yard below the fortress, the kitchen fire in its
  // wall, the market town inside, the king's hall at the top; Jebus on its own hill to the right, off the path.
  4: {
    name: "The King's Court", src: "../assets/maps/world4_map.jpg",
    david: { far: 0.5, near: 0.9, y0: 150, y1: 1050 },
    stops: [
      { id: "home", label: "Bethlehem gate", x: 470, y: 1045 },
      { id: "4-1", label: "The Road to Gibeah", x: 1010, y: 690, trail: [[560, 990], [640, 910], [760, 830], [900, 760]] },
      { id: "4-2", label: "The Training Yard", x: 620, y: 440, trail: [[1040, 620], [960, 550], [880, 490], [790, 450]] },
      { id: "4-3", label: "The Broken String", x: 760, y: 235, trail: [[720, 400], [790, 370], [795, 315], [780, 270]] },
      { id: "4-4", label: "The King's Hall", x: 820, y: 150, trail: [[800, 200]] },
    ],
  },
  // World 5: Glen's painting of the road west (2048 x 1152): Jesse's house and fig tree bottom-left, the round watchtower
  // by the road, the fleeing family's tents and donkey, the cliff trail up past a lookout tower, the cave of the Name
  // (the glowing water) and Tobi's fire above it, the lookouts' ridge with the signal-fire pile on top, the terebinths,
  // and down the right side into the Valley of Elah, the two camps facing each other.
  5: {
    name: "The Road to the Valley", src: "../assets/maps/world5_map.jpg",
    david: { far: 0.5, near: 0.9, y0: 150, y1: 1050 },
    stops: [
      { id: "home", label: "Jesse's house", x: 235, y: 1020 },
      { id: "5-1", label: "The Supply Road", x: 480, y: 900, trail: [[310, 985], [390, 945]] },
      { id: "5-2", label: "The Mountain Trail", x: 820, y: 530, trail: [[615, 820], [715, 715], [780, 615]] },
      { id: "5-3", label: "The Lookouts' Ridge", x: 1085, y: 175, trail: [[840, 450], [920, 340], [1000, 265]] },
      { id: "5-4", label: "Down to Elah", x: 1590, y: 635, trail: [[1230, 205], [1380, 360], [1485, 490]] },
    ],
  },
  // World 6: stand-in until Glen's World 6 painting: World 5's map (the two camps are at its right edge)
  6: {
    name: "The Valley of Elah", src: "../assets/maps/world5_map.jpg",
    david: { far: 0.5, near: 0.9, y0: 150, y1: 1050 },
    stops: [
      { id: "home", label: "The camp of Israel", x: 1590, y: 635 },
      { id: "6-1", label: "The Camp of Fear", x: 1700, y: 560, trail: [[1640, 600]] },
      { id: "6-2", label: "No-Man's Land", x: 1820, y: 640, trail: [[1760, 600]] },
      { id: "6-3", label: "The Water Carriers", x: 1880, y: 760, trail: [[1860, 700]] },
      { id: "6-4", label: "The Tower's Shadow", x: 1960, y: 640, trail: [[1930, 700]] },
    ],
  },
  // The journey map (Castlevania-style): Glen's painting of the whole road from Bethlehem to the Valley of Elah,
  // one stop per world (2048 x 1152). A world counts as cleared when its 4th stage (the boss) is cleared.
  journey: {
    name: "The Journey", src: "../assets/maps/journey_map.jpg", journey: true,
    david: { far: 0.36, near: 0.6, y0: 250, y1: 950 },
    stops: [
      { id: "w1", world: 1, label: "The Shepherd's Fields", x: 420, y: 935 },
      { id: "w2", world: 2, label: "The Wilderness", x: 800, y: 795, trail: [[540, 880], [650, 830]] },
      { id: "w3", world: 3, label: "The Anointing", x: 985, y: 695, trail: [[880, 760], [930, 720]] },
      { id: "w4", world: 4, label: "The King's Court", x: 875, y: 370, trail: [[900, 620], [770, 545], [790, 450]] },
      { id: "w5", world: 5, label: "The Road to the Valley", x: 1740, y: 690, trail: [[1010, 430], [1260, 470], [1300, 560], [1520, 640]] },
      { id: "w6", world: 6, label: "The Valley of Elah", x: 1555, y: 345, trail: [[1730, 560], [1640, 480], [1580, 420]] },
      { id: "w7", world: 7, label: "The Giant's Shadow", x: 1770, y: 405, trail: [[1650, 380]] },
      { id: "w8", world: 8, label: "David and Goliath", x: 1790, y: 240, trail: [[1720, 330]] },
    ],
  },
};
const BUILT_WORLDS = [1, 2, 3, 4, 5, 6];   // worlds you can go into from the journey map so far
const BUILT_STAGES = ["1-1", "1-2", "1-3", "1-4", "2-1", "2-2", "2-3", "2-4", "3-1", "3-2", "3-3", "3-4", "4-1", "4-2", "4-3", "4-4", "5-1", "5-2", "5-3", "5-4", "6-1", "6-2"];   // stages that exist so far (the rest say "coming soon")

function loadProgress() { try { return JSON.parse(localStorage.getItem("davidProgress") || "{}"); } catch (e) { return {}; } }
function saveProgress(p) { try { localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {} }
// called when a stage is cleared: remember it, and that the map should open the next stretch of trail
function stageCleared(id, info) {
  const p = loadProgress();
  const old = p[id] || {};
  p[id] = { cleared: true, sheep: Math.max(old.sheep || 0, info.sheep || 0), total: info.total || old.total || 0,
            one: !!(old.one || info.one), stones: Math.max(old.stones || 0, info.stones || 0) };
  p.justCleared = id; p.at = id;
  if (info.olives !== undefined) p.olives = info.olives;   // what's in the purse now (spent at the market, §4c)
  if (info.lampOil !== undefined) p.lampOil = info.lampOil;
  if (info.gathered) { const k = "gathered" + id[0]; p[k] = (p[k] || 0) + info.gathered; }   // olives picked up in this world, for the tithe (home.js)
  if (id.endsWith("-4")) { p.view = "journey"; p.justWorld = true; p.jat = "w" + id[0]; }   // a world beaten: back out to the journey map
  saveProgress(p);
}

// Glen's harp theme, "Hush Little Seed" (the first 23 seconds): plays on the title screen and the maps,
// fades out for a stage, the courtyard or the Journal (main.js frame decides when it's wanted)
const themeMusic = new Audio(`../assets/audio/title_loop.mp3?v=${window.BUILD || 0}`); themeMusic._music = true; themeMusic.volume = 0;
let themeVol = 0, themeRestT = 0;
themeMusic.addEventListener("ended", () => { themeRestT = MTUNE.THEME_REST; });
function updateTheme(dt, want) {
  if (typeof audioUnlocked === "undefined" || !audioUnlocked) return;
  themeVol = want ? Math.min(MTUNE.THEME_VOLUME, themeVol + dt * 0.4) : Math.max(0, themeVol - dt * 0.8);
  themeMusic.volume = themeVol;
  if (themeRestT > 0) { themeRestT -= dt; if (themeRestT <= 0 && want) { themeMusic.currentTime = 0; themeMusic.play().catch(() => {}); } return; }
  if (want && themeMusic.paused && !themeMusic.ended) themeMusic.play().catch(() => {});
  if (want && themeMusic.ended) themeRestT = MTUNE.THEME_REST;
  if (!want && themeVol <= 0 && !themeMusic.paused) themeMusic.pause();
}
const mapAmbience = new Audio(`../assets/sounds/ambience_hills.mp3?v=${window.BUILD || 0}`); mapAmbience.loop = true; mapAmbience._music = true; mapAmbience.volume = 0;

const WorldMap = {
  active: false,
  open(world = 1) {
    const M = MAP_WORLDS[world]; if (!M) return;
    if (!M.img) { M.img = new Image(); M.img.src = M.src + "?v=" + (window.BUILD || 0); }
    this.M = M; this.world = world; this.active = true; this.fade = 0; this.t = 0; this.leaving = null;
    this.prog = loadProgress();
    if (this.prog.view !== world) { this.prog.view = world; saveProgress(this.prog); }   // reopen this map next time
    // the full trail as one line: each stop's index along it
    this.pts = []; this.stopAt = [];
    for (const s of M.stops) {
      for (const p of s.trail || []) this.pts.push({ x: p[0], y: p[1] });
      this.stopAt.push(this.pts.length); this.pts.push({ x: s.x, y: s.y });
    }
    this.dist = [0];
    for (let i = 1; i < this.pts.length; i++) this.dist.push(this.dist[i - 1] + Math.hypot(this.pts[i].x - this.pts[i - 1].x, this.pts[i].y - this.pts[i - 1].y));
    // how far the trail is open: up to the first stage not cleared
    this.openTo = M.journey ? M.stops.findIndex(s => !this.isCleared(s)) : M.stops.findIndex((s, i) => i > 0 && !this.isCleared(s));
    if (this.openTo < 0) this.openTo = M.stops.length - 1;
    // a stage (or on the journey map, a world) just cleared? walk the new stretch of trail in
    this.reveal = 1;
    const justKey = M.journey ? "justWorld" : "justCleared";
    if (this.prog[justKey]) { delete this.prog[justKey]; if (M.journey) delete this.prog.justCleared; saveProgress(this.prog); this.reveal = this.openTo > 0 ? 0 : 1; sfxLater(() => chime(4), 0.3); }
    const atI = Math.max(0, M.stops.findIndex(s => s.id === (M.journey ? this.prog.jat || "w1" : this.prog.at || "home")));
    this.cur = Math.min(atI, this.openTo);
    this.d = this.dist[this.stopAt[this.cur]]; this.target = this.cur; this.facing = 1; this.walkT = 0;
    this.autoStory = false;   // the next stop is a story (the Anointing) and David's right before it: he walks there by himself
    const nx = M.stops[this.openTo];
    if (nx && nx.story && !this.isCleared(nx) && this.cur === this.openTo - 1) { this.target = this.openTo; this.autoStory = true; }
    this.lambD = this.d; this.lambFacing = 1;
    this.stones = M.journey ? 0 : stonesFound(world);
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
  isCleared(st) {   // a stage, or on the journey map a whole world (its boss stage)
    const id = st.world ? `${st.world}-4` : st.id;
    return !!(this.prog[id] && this.prog[id].cleared);
  },
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
    const want = this.stopD(this.target), step = MTUNE.WALK_SPEED * dt * (this.M.journey && this.prog.favor ? 3.5 : 1);   // the King's Favor (End of World 4): quick on the Journey map
    const moving = Math.abs(want - this.d) > 0.5;
    if (moving) {
      const dir = Math.sign(want - this.d);
      this.d += dir * Math.min(step, Math.abs(want - this.d));
      const p = this.at(this.d); this.dirX = p.dx * dir; this.dirY = p.dy * dir;
      if (Math.abs(this.dirX) > 4) this.facing = Math.sign(this.dirX);
      this.walkT += dt;
      if (Math.abs(want - this.d) <= 0.5) {
        this.d = want; this.cur = this.target; this.walkT = 0; chime(this.cur); this.prog[this.M.journey ? "jat" : "at"] = this.M.stops[this.cur].id; saveProgress(this.prog);
        const st = this.M.stops[this.cur];
        if (st.story && this.autoStory) { this.autoStory = false; this.leaving = () => startStage(st.id); }   // arrived: the scene plays
      }
    }
    // the lamb trots along behind him on the trail
    if (moving) this.lastDir = Math.sign(want - this.d) || this.lastDir;
    const lambWant = Math.max(0, this.d - (this.lastDir || 1) * 44);
    this.lambD += (lambWant - this.lambD) * Math.min(1, dt * 5);
    this.lambFacing = this.facing;
    if (moving) return;
    // choose a stop: press the way the next (or last) stop lies on the painting, Up, Down, Left or Right
    // (only as far as the trail is open). If neither stop lies that way, Right = forward and Left = back.
    const press = ["up", "down", "left", "right"].find(k => pressed(k));
    if (press) {
      const v = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[press], here = this.M.stops[this.cur];
      let best = null, bestDot = 0.3;   // within about 70 degrees of the pressed way
      for (const i of [this.cur + 1, this.cur - 1]) {
        if (i < 0 || i > this.openTo || i >= this.M.stops.length) continue;
        const st = this.M.stops[i], dx = st.x - here.x, dy = st.y - here.y, len = Math.hypot(dx, dy) || 1;
        const dot = (dx * v[0] + dy * v[1]) / len;
        if (dot > bestDot) { bestDot = dot; best = i; }
      }
      if (best === null && press === "right" && this.cur < this.openTo) best = this.cur + 1;
      if (best === null && press === "left" && this.cur > 0) best = this.cur - 1;
      if (best !== null) this.target = best;
    }
    const stop = this.M.stops[this.cur];
    if (pressed("select")) { this.readJournal(); return; }
    if (this.M.journey) {   // the journey map: A goes into a world
      if (pressed("a") || pressed("start")) {
        if (BUILT_WORLDS.includes(stop.world)) this.leaving = () => this.open(stop.world);
        else toast(`World ${stop.world}: ${stop.label} isn't built yet.`);
      }
      return;
    }
    if (MAP_CHEAT && pressed("b") && stop.id !== "home") {   // ?cheat: B marks this stage cleared (testing the map)
      stageCleared(stop.id, {}); this.open(this.prog.view === "journey" ? "journey" : this.world); return;
    }
    if (!MAP_CHEAT && pressed("b")) { this.leaving = () => this.open("journey"); return; }   // B: back out to the journey map
    if ((pressed("a") || pressed("start")) && stop.id === "home") { this.leaving = () => Courtyard.open(this.world); return; }   // home: Jesse's courtyard
    if ((pressed("a") || pressed("start")) && stop.id !== "home") {
      if (BUILT_STAGES.includes(stop.id) || stop.story) this.leaving = () => startStage(stop.id);
      else toast(`${stop.id} ${stop.label} isn't built yet. It's next!`);
    }
  },
  readJournal() {   // Select: page through what David has written so far
    // this world's pages, or (none written yet, or nothing cleared here) the newest world before it that has some
    const p = this.prog, lastOf = w => [4, 3, 2, 1].find(k => p[`${w}-${k}`] && p[`${w}-${k}`].cleared);
    const from = this.M.journey ? Math.max(...BUILT_WORLDS) : this.world;
    let world = null;
    for (let w = from; w >= 1; w--) if (JOURNAL_PAGES[w] && lastOf(w)) { world = w; break; }
    if (!world) { toast("Nothing in the Journal yet. Clear 1-1 first."); return; }
    const last = lastOf(world);
    this.active = false;
    Journal.open({ world, stage: last, read: true, onClose: () => { this.active = true; this.fade = 0; } });
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
      const [x, y] = P(st.x, st.y), depth = 0.7 + 0.5 * (st.y / img.naturalHeight), done = this.isCleared(st), num = st.world ? String(st.world) : st.id.split("-")[1];
      const r = 17 * depth;
      if (st.id === "home") { if (!this.stoneMarker("map_stop", x, y, r * 0.85, "")) this.marker(x, y, r * 0.85, "#c9a46a", "#5a3a1c", "⌂"); return; }
      if (st.story) {   // a story stop: a small golden star
        ctx.save(); ctx.translate(x, y); ctx.fillStyle = done ? "#e8d9b8" : "#ffd84a"; ctx.strokeStyle = "#6b3a10"; ctx.lineWidth = 2; ctx.beginPath();
        for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
        ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); return;
      }
      const flash = !done && Math.floor(this.t * 2.5) % 2 === 0;
      if (!done) {   // a soft pulsing glow on the next stage
        const g = ctx.createRadialGradient(x, y, 2, x, y, r * 2.6);
        g.addColorStop(0, `rgba(255,220,120,${0.45 + 0.25 * Math.sin(this.t * 5)})`); g.addColorStop(1, "rgba(255,220,120,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, Math.PI * 2); ctx.fill();
      }
      if (!this.stoneMarker(done ? "map_stop_done" : "map_stop_next", x, y, r, done ? "" : num, !done && flash))
        this.marker(x, y, r, done ? "#e8d9b8" : flash ? "#ffd84a" : "#f7b733", done ? "#3d6b2a" : "#6b3a10", num);
      if (done && !M.journey) hudIcon(this.prog[st.id].one ? "sheep_one" : "sheep", x + r * 0.55, y - r * 2.1, r * 1.5);   // a sheep: home safe
    });
    // stones of remembrance: all 12 found = a little cairn by the fold
    if (M.cairn && this.stones >= 12) { const [cx, cy] = P(M.cairn.x, M.cairn.y); drawItem("map_cairn", cx, cy + 6, 0.12); }
    // David (and his lamb), smaller toward the back of the painting
    const dp = this.at(this.d), lp = this.at(this.lambD);
    const DV = M.david || { far: MTUNE.DAVID_FAR, near: MTUNE.DAVID_NEAR, y0: 330, y1: 730 };
    const size = y => DV.far + (DV.near - DV.far) * Math.max(0, Math.min(1, (y - DV.y0) / (DV.y1 - DV.y0)));
    const moving = this.walkT > 0, away = moving && this.dirY < -Math.abs(this.dirX) * 0.6;   // walking up into the picture: his back to us
    const [lx, ly] = P(lp.x, lp.y), [dx, dy] = P(dp.x, dp.y);
    const drawLambTok = () => drawSprite("lamb_run", moving ? frameOf("lamb_run", this.t) : 2, lx, ly, this.lambFacing, size(lp.y) * 1.35, ctx.globalAlpha);
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
  // Glen's stone markers: plain, finished (wool and olive leaves), next to play (glowing). false = not loaded yet
  stoneMarker(name, x, y, r, text, bright = false) {
    const img = ITEM[name]; if (!img || !img.naturalWidth) return false;
    const w = r * 3.6, h = img.naturalHeight * w / img.naturalWidth;
    ctx.save(); if (bright) ctx.filter = "brightness(1.25)";
    ctx.drawImage(img, x - w / 2, y - h * 0.6, w, h); ctx.restore();
    if (text) {
      ctx.fillStyle = "rgba(70,45,20,0.85)"; ctx.font = `bold ${Math.round(r * 1.05)}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(text, x, y - h * 0.2); ctx.textBaseline = "alphabetic";
    }
    return true;
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
    if (this.M.journey) { this.journeyPanel(st); return; }
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
      ctx.fillStyle = "#ffe08a"; ctx.font = "bold 24px sans-serif"; ctx.fillText("Home: Jesse's house", W / 2, y + 32);
      ctx.fillStyle = "#e9dcc4"; ctx.font = "16px sans-serif"; ctx.fillText("A: go into the courtyard    Right: walk out to the hills", W / 2, y + 60);
      return;
    }
    if (st.story) {
      ctx.fillStyle = "#ffe08a"; ctx.font = "bold 24px sans-serif"; ctx.fillText(st.label, W / 2, y + 32);
      ctx.fillStyle = "#e9dcc4"; ctx.font = "16px sans-serif"; ctx.fillText(p.cleared ? "A: watch it again" : "A: watch", W / 2, y + 58);
      return;
    }
    ctx.fillStyle = "#ffe08a"; ctx.font = "bold 24px sans-serif"; ctx.fillText(`${st.id}  ${st.label}`, W / 2, y + 32);
    ctx.fillStyle = "#e9dcc4"; ctx.font = "16px sans-serif";
    let line = p.cleared ? `Sheep found ${p.sheep || 0}/${p.total || 5}${p.one ? "  ·  The One ✓" : "  ·  The One: still out there"}  ·  stones ${p.stones || 0}/3` : BUILT_STAGES.includes(st.id) ? "A: play" : "Not built yet";
    if (p.cleared) line += "     A: play again";
    ctx.fillText(line, W / 2, y + 58);
    ctx.textAlign = "right"; ctx.font = "14px sans-serif"; ctx.fillStyle = "rgba(255,240,215,0.8)";
    ctx.fillText(`Arrows: walk    Select: Journal    Start: menu    ${MAP_CHEAT ? "B: mark cleared (cheat)" : "B: the journey map"}`, W - 14, H - 10);
  },
  journeyPanel(st) {
    const done = this.M.stops.filter(s => this.isCleared(s)).length;
    ctx.fillStyle = "rgba(25,14,6,0.72)"; ctx.beginPath(); ctx.roundRect(14, 12, 330, 64, 12); ctx.fill();
    ctx.textAlign = "left"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 22px sans-serif"; ctx.fillText("The Journey", 28, 38);
    ctx.fillStyle = "#fff"; ctx.font = "18px sans-serif"; ctx.fillText(`Bethlehem to the Valley of Elah  ·  ${done}/8`, 28, 62);
    const w = 560, x = (W - w) / 2, y = H - 92;
    ctx.fillStyle = "rgba(25,14,6,0.76)"; ctx.beginPath(); ctx.roundRect(x, y, w, 78, 14); ctx.fill();
    ctx.textAlign = "center"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 24px sans-serif"; ctx.fillText(`World ${st.world}: ${st.label}`, W / 2, y + 32);
    ctx.fillStyle = "#e9dcc4"; ctx.font = "16px sans-serif";
    ctx.fillText(!BUILT_WORLDS.includes(st.world) ? "Coming soon" : this.isCleared(st) ? "Cleared  ·  A: go back in" : "A: enter", W / 2, y + 58);
    ctx.textAlign = "right"; ctx.font = "14px sans-serif"; ctx.fillStyle = "rgba(255,240,215,0.8)";
    ctx.fillText("Arrows: walk    A: enter    Select: Journal    Start: menu", W - 14, H - 10);
  },
};
function sfxLater(fn, s) { setTimeout(fn, s * 1000); }
// start a stage from the map: "#1-2" in the address loads that stage
function startStage(id) {
  history.replaceState(null, "", location.pathname + location.search + "#" + id);
  location.reload();
}
const MAP_CHEAT = new URLSearchParams(location.search).has("cheat");
