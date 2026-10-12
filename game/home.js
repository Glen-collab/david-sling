// The home base (DESIGN.md §4c): a walk-in courtyard, side view, like a Castlevania town. For Worlds 1-3 it's
// Jesse's courtyard in Bethlehem (Glen's painting, assets/backgrounds/courtyard_w1.jpg). Walk with Left / Right;
// press Up at a spot:
//   the target      Jesse waits by the bullseye with each world's piece of the throw; after that, Up here practises
//                   the code. (Coming home after a world, David first sets aside the tithe: see TITHE_STORY.)
//   the shelf       the Journal
//   the stall       trade olives for lamp oil and food
//   the gate        back out to the map
// Olives, lamp oil and the fig cake are kept between stages in localStorage "davidProgress" (olives, lampOil, figCake).

const HOME = {
  WALK: 300, SIZE: 1.3,          // David's walking speed and size here
  FLOOR: 0.905,                  // where the floor is, as a fraction of the picture's height
  REACH: 90,                     // how close (px on screen) David must be to use a spot
  PRACTICE_TIME: 8,              // seconds to enter the code at the practice wall
};
// The tithe (decided 2026-10-12): the first thing when David comes home after a world, before the market or anything
// else, DAVID offers to set aside the first tenth of the olives he gathered in that world (counted as they were picked
// up, not what's left in the purse). Nobody asks him; Jesse only receives it. A choice, never forced, nothing paid
// back. David remembers Abraham and Jacob, taking turns by world. (The tenth of the flock, Leviticus 27:32, is saved
// for the end of the game.)
const TITHE_STORY = [
  { ref: "Genesis 14:20", text: "When Abraham came home from the battle, he gave Melchizedek, the priest of God Most High, a tenth of everything. He knew who had won it for him." },
  { ref: "Genesis 28:22", text: "Jacob slept with his head on a stone at Bethel, and in the morning he promised God: \"Of all that you will give me I will surely give a tenth to you.\"" },
];
// what David thinks, in his own words (one per world). In the spirit of Jesus' teaching (the rich fool's barns,
// Luke 12), but never quoting Him: David lived a thousand years before.
const TITHE_THOUGHT = [
  "They grew on His trees, not mine. The first of them should go back to Him.",
  "My basket is full and the flock is safe. God can use these more than I can.",
  "If I keep every one, I'll only want a bigger basket. The first tenth is His.",
  "He gave me the strength to gather them. Giving the first part back is how I remember that.",
  "The fields gave me more than I need. Someone in Bethlehem needs it more than I do.",
  "A lighter pouch and a full heart. That's a good trade.",
  "He fed me in the wilderness when I had nothing. The first tenth is the least I can give back.",
  "Tomorrow I face the giant. Whatever happens, the first tenth is His.",
];
// spots, as fractions of the picture's width
const HOME_SPOTS = [
  { id: "wall", x: 0.41, label: "Jesse, by the target" },
  { id: "shelf", x: 0.545, label: "The Journal" },
  { id: "stall", x: 0.705, label: "The market" },
  { id: "gate", x: 0.915, label: "Out to the fields" },
];
// the throw: one piece per world (§4c). Together it's the Konami code.
const THROW_PIECES = [["up"], ["up"], ["down"], ["down"], ["left", "right"], ["left", "right"], ["b"], ["a"]];
const THROW_WORDS = [
  "Look up, son. The LORD goes ahead of you, the way He did against the lion.",
  "Up again. The same help as with the lion, against the bear.",
  "Down: kneel. The prophet poured oil on your head, so stay humble.",
  "Down again: bow. You serve the king now.",
  "Left, right: steady steps on the road, even in the dark.",
  "Left, right again: in the valley, don't run either way.",
  "B: the sling. Not Saul's armour, the sling your hands know.",
  "A: faith. The battle is the LORD's.",
];
const ARROW = { up: "↑", down: "↓", left: "←", right: "→", a: "A", b: "B" };
const MARKET = [
  { id: "oil", name: "Lamp oil", cost: 20, what: "+30 oil for the lamp in caves (it burns before your olives)" },
  { id: "fig", name: "Fig cake", cost: 15, what: "An extra heart for your next stage" },
  { id: "pouch", name: "A better sling pouch", cost: 60, what: "Stones fly a little straighter (from World 2)", later: true },
];

const Courtyard = {
  active: false,
  open(world = 1) {
    if (!this.img) { this.img = new Image(); this.img.src = `../assets/backgrounds/courtyard_w1.jpg?v=${window.BUILD || 0}`; }
    this.world = world; this.active = true; this.fade = 0; this.leaving = null; this.t = 0;
    this.x = 0.82; this.facing = -1; this.walkT = 0; this.mode = null; this.msg = null;
    this.prog = loadProgress();
    // a world beaten since Jesse last spoke to you? he's waiting with its piece
    this.earned = [1, 2, 3, 4, 5, 6, 7, 8].filter(w => this.prog[`${w}-4`] && this.prog[`${w}-4`].cleared).length;
    // a world beaten and its tithe not yet offered? that comes first
    const tithes = this.prog.tithes || {};
    const w = [1, 2, 3, 4, 5, 6, 7, 8].find(k => this.prog[`${k}-4`] && this.prog[`${k}-4`].cleared && !(k in tithes));
    if (w) {
      const gathered = this.prog["gathered" + w] || 0, tenth = Math.min(gathered ? Math.max(1, Math.floor(gathered / 10)) : 0, this.prog.olives || 0);   // 143 gathered: 14
      if (tenth > 0) { this.mode = "tithe"; this.tw = { world: w, gathered, tenth, story: TITHE_STORY[(w - 1) % TITHE_STORY.length] }; this.pick = 0; }
      else { tithes[w] = 0; this.prog.tithes = tithes; this.save(); }
    }
    if (typeof audioUnlocked !== "undefined" && audioUnlocked) mapAmbience.play().catch(() => {});
  },
  sceneW() { return this.img && this.img.naturalWidth ? this.img.naturalWidth * H / this.img.naturalHeight : W * 3; },
  near() { const px = this.x * this.sceneW(); return HOME_SPOTS.find(s => Math.abs(s.x * this.sceneW() - px) < HOME.REACH) || null; },
  save() { saveProgress(this.prog); },
  say(who, text, t = 6) { this.msg = { who, text, t }; },
  update(dt) {
    this.t += dt; if (this.msg) { this.msg.t -= dt; if (this.msg.t <= 0) this.msg = null; }
    mapAmbience.volume = Math.max(0, Math.min(MTUNE.AMBIENCE_VOLUME, mapAmbience.volume + (this.leaving ? -dt : dt * 0.5)));
    if (this.leaving) {
      this.fade -= dt * 2;
      if (this.fade <= 0) { this.active = false; mapAmbience.pause(); const go = this.leaving; this.leaving = null; go(); }
      return;
    }
    this.fade = Math.min(1, this.fade + dt * 2);
    if (this.mode === "market") { this.updateMarket(); return; }
    if (this.mode === "practice") { this.updatePractice(dt); return; }
    if (this.mode === "tithe") { this.updateTithe(); return; }
    // walking
    const dir = (held("right") ? 1 : 0) - (held("left") ? 1 : 0);
    if (dir) { this.facing = dir; this.x = Math.max(0.17, Math.min(0.95, this.x + dir * HOME.WALK * dt / this.sceneW())); this.walkT += dt; } else this.walkT = 0;
    const spot = this.near();
    if (pressed("select")) { this.useShelf(); return; }
    if (!spot || !pressed("up")) return;
    if (spot.id === "gate") { this.leaving = () => WorldMap.open(this.world); return; }
    if (spot.id === "shelf") { this.useShelf(); return; }
    if (spot.id === "wall") { this.useJesse(); return; }
    if (spot.id === "stall") { this.mode = "market"; this.pick = 0; }
  },
  useShelf() {
    const last = [4, 3, 2, 1].find(k => this.prog[`${this.world}-${k}`] && this.prog[`${this.world}-${k}`].cleared);
    if (!last) { this.say("", "The Journal is empty for now. Clear 1-1 and David will write in it."); return; }
    this.active = false;
    Journal.open({ world: this.world, stage: last, read: true, onClose: () => { this.active = true; this.fade = 0; } });
  },
  useJesse() {
    if (!this.earned) { this.say("Jesse", "The lion's been near the flock, David. When you've faced it, come and find me here at the target. There's something I want to teach you about the throw."); return; }
    const given = this.prog.throwGiven || 0;
    if (this.earned <= given) {   // nothing new: practise
      this.mode = "practice"; this.code = THROW_PIECES.slice(0, this.earned).flat(); this.got = 0; this.pt = HOME.PRACTICE_TIME; this.result = null; return;
    }
    this.givePiece();
  },
  updateTithe() {
    if (pressed("up") || pressed("down")) this.pick = 1 - this.pick;
    if (!pressed("a")) return;
    const tw = this.tw; this.mode = null;
    this.prog.tithes = Object.assign(this.prog.tithes || {}, { [tw.world]: this.pick === 0 ? tw.tenth : 0 });
    if (this.pick === 0) {
      this.prog.olives = (this.prog.olives || 0) - tw.tenth;
      sfx("olive_pickup", undefined, 0.8); if (typeof chime === "function") { chime(3); setTimeout(() => chime(5), 160); }
      this.say("Jesse", `You thought of that before I said a word. ${tw.tenth} olives for the LORD; they'll go in with the family's offering. When you're ready, come and find me at the target. I have something for you.`, 8);
    } else if (this.earned > (this.prog.throwGiven || 0)) {
      this.say("Jesse", "Welcome home, son. When you're ready, come and find me at the target. I have something for you.", 6);
    }
    this.save();
  },
  givePiece() {
    const given = this.prog.throwGiven || 0;
    if (this.earned > given) {   // a new piece
      const k = given; this.prog.throwGiven = k + 1; this.save();
      this.say("Jesse", `${THROW_WORDS[k]}  (The throw: ${THROW_PIECES[k].map(b => ARROW[b]).join(" ")})`, 9);
      if (typeof chime === "function") chime(7);
    }
  },
  updatePractice(dt) {
    if (this.result) { this.result.t -= dt; if (this.result.t <= 0 || pressed("start")) this.mode = null; return; }
    this.pt -= dt;
    for (const b of ["up", "down", "left", "right", "a", "b"]) if (pressed(b)) {
      if (b === this.code[this.got]) { this.got++; if (typeof chime === "function") chime(this.got); }
      else this.got = b === this.code[0] ? 1 : 0;   // wrong: start again (a fresh first input counts)
      break;
    }
    if (this.got >= this.code.length) { this.result = { ok: true, t: 1.6 }; sfx("sling_throw", undefined, 0.9); sfx("stone_hit", undefined, 0.8); }
    else if (this.pt <= 0) { this.result = { ok: false, t: 1.4 }; }
    if (pressed("select")) this.mode = null;
  },
  updateMarket() {
    if (pressed("up")) this.pick = (this.pick + MARKET.length - 1) % MARKET.length;
    if (pressed("down")) this.pick = (this.pick + 1) % MARKET.length;
    if (pressed("b") || pressed("select")) { this.mode = null; return; }
    if (!pressed("a")) return;
    const item = MARKET[this.pick], olives = this.prog.olives || 0;
    if (item.later) { this.say("The trader", "I'll have a pouch for you when you come back from the wilderness."); return; }
    if (olives < item.cost) { this.say("The trader", `That's ${item.cost} olives, and you have ${olives}. Gather some more out in the fields.`); return; }
    this.prog.olives = olives - item.cost;
    if (item.id === "oil") this.prog.lampOil = (this.prog.lampOil || 0) + 30;
    if (item.id === "fig") this.prog.figCake = (this.prog.figCake || 0) + 1;
    this.save(); sfx("olive_pickup", undefined, 0.8);
    this.say("The trader", item.id === "oil" ? "Pressed from good olives. It'll keep your lamp burning." : "Fresh this morning. Eat it before your next stage.");
  },
  // ---- drawing ----
  draw() {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    const img = this.img; if (!img || !img.naturalWidth) { ctx.restore(); return; }
    ctx.globalAlpha = Math.max(0, this.fade);
    const SW = this.sceneW(), px = this.x * SW, cam = Math.max(0, Math.min(SW - W, px - W / 2)), floor = H * HOME.FLOOR;
    ctx.drawImage(img, -cam, 0, SW, H);
    // David (and his lamb behind him)
    const dx = px - cam, moving = this.walkT > 0;
    drawSprite(moving ? "lamb_run" : "lamb_stand", frameOf(moving ? "lamb_run" : "lamb_stand", this.t), dx - this.facing * 70, floor, this.facing, HOME.SIZE, ctx.globalAlpha);
    drawSprite(moving ? "david_walk" : "david_idle", frameOf(moving ? "david_walk" : "david_idle", moving ? this.walkT : this.t), dx, floor, this.facing, HOME.SIZE, ctx.globalAlpha);
    // the spot David is at
    const spot = this.mode ? null : this.near();
    if (spot) {
      const sx = spot.x * SW - cam;
      upHint(sx, floor - 250);
      ctx.font = "bold 18px sans-serif"; ctx.textAlign = "center";
      ctx.fillStyle = "rgba(25,14,6,0.7)"; const tw = ctx.measureText(spot.label).width + 20; ctx.beginPath(); ctx.roundRect(sx - tw / 2, floor - 212, tw, 28, 8); ctx.fill();
      ctx.fillStyle = "#ffe08a"; ctx.fillText(spot.label, sx, floor - 192);
    }
    this.drawPurse();
    if (this.mode === "market") this.drawMarket();
    if (this.mode === "practice") this.drawPractice();
    if (this.mode === "tithe") this.drawTithe();
    if (this.msg) this.drawMsg();
    ctx.textAlign = "right"; ctx.font = "14px sans-serif"; ctx.fillStyle = "rgba(255,245,225,0.9)";
    ctx.fillText(this.mode === "market" ? "Up / Down: choose    A: trade    B: leave" : this.mode === "practice" ? "Enter the throw    Select: stop" : this.mode === "tithe" ? "Up / Down: choose    A: answer" : "Left / Right: walk    Up: use    Select: Journal", W - 14, H - 10);
    ctx.restore();
  },
  drawPurse() {
    const p = this.prog;
    ctx.fillStyle = "rgba(25,14,6,0.72)"; ctx.beginPath(); ctx.roundRect(14, 12, 380, 64, 12); ctx.fill();
    ctx.textAlign = "left"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 22px sans-serif"; ctx.fillText("Jesse's courtyard", 28, 38);
    ctx.fillStyle = "#fff"; ctx.font = "16px sans-serif";
    ctx.fillText(`Olives ${p.olives || 0}   ·   Lamp oil ${p.lampOil || 0}${p.figCake ? "   ·   Fig cake ✓" : ""}`, 28, 62);
  },
  drawMsg() {
    const m = this.msg, a = Math.min(1, m.t * 2);
    ctx.save(); ctx.globalAlpha = a; ctx.font = "19px sans-serif";
    const words = m.text.split(" "), lines = []; let cur = "";
    for (const w of words) { const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > 760) { lines.push(cur); cur = w; } else cur = t; }
    lines.push(cur);
    const h = (m.who ? 44 : 20) + lines.length * 26, y = 92;
    ctx.fillStyle = "rgba(25,14,6,0.85)"; ctx.beginPath(); ctx.roundRect(W / 2 - 410, y, 820, h + 10, 14); ctx.fill();
    ctx.textAlign = "left";
    if (m.who) { ctx.fillStyle = "#ffd98a"; ctx.font = "bold 18px sans-serif"; ctx.fillText(m.who, W / 2 - 388, y + 28); }
    ctx.fillStyle = "#fff"; ctx.font = "19px sans-serif";
    lines.forEach((l, i) => ctx.fillText(l, W / 2 - 388, y + (m.who ? 56 : 32) + i * 26));
    ctx.restore();
  },
  drawMarket() {
    const x = W / 2 - 300, y = 230, w = 600, h = 70 + MARKET.length * 62;
    ctx.fillStyle = "rgba(25,14,6,0.9)"; ctx.beginPath(); ctx.roundRect(x, y, w, h, 16); ctx.fill();
    ctx.textAlign = "left"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 24px sans-serif"; ctx.fillText("The market", x + 24, y + 38);
    ctx.textAlign = "right"; ctx.fillStyle = "#e9dcc4"; ctx.font = "16px sans-serif"; ctx.fillText(`You have ${this.prog.olives || 0} olives`, x + w - 24, y + 38);
    MARKET.forEach((it, i) => {
      const iy = y + 60 + i * 62, sel = i === this.pick;
      if (sel) { ctx.fillStyle = "rgba(255,220,120,0.18)"; ctx.beginPath(); ctx.roundRect(x + 12, iy, w - 24, 54, 10); ctx.fill(); }
      ctx.textAlign = "left"; ctx.globalAlpha = it.later ? 0.5 : 1;
      ctx.fillStyle = "#fff"; ctx.font = "bold 19px sans-serif"; ctx.fillText(it.name, x + 30, iy + 24);
      ctx.fillStyle = "#d8cbb0"; ctx.font = "15px sans-serif"; ctx.fillText(it.what, x + 30, iy + 45);
      ctx.textAlign = "right"; ctx.fillStyle = "#cfe39a"; ctx.font = "bold 18px sans-serif"; ctx.fillText(`${it.cost} olives`, x + w - 30, iy + 34);
      ctx.globalAlpha = 1;
    });
  },
  drawTithe() {
    const tw = this.tw, x = W / 2 - 360, w = 720, y = 150;
    ctx.save(); ctx.font = "19px sans-serif";
    const text = `${tw.story.text}  I gathered ${tw.gathered} olives out there. ${TITHE_THOUGHT[(tw.world - 1) % TITHE_THOUGHT.length]}`;
    const words = text.split(" "), lines = []; let cur = "";
    for (const wd of words) { const t = cur ? cur + " " + wd : wd; if (ctx.measureText(t).width > w - 60) { lines.push(cur); cur = wd; } else cur = t; }
    lines.push(cur);
    const h = 84 + lines.length * 27 + 2 * 50 + 20;
    ctx.fillStyle = "rgba(25,14,6,0.9)"; ctx.beginPath(); ctx.roundRect(x, y, w, h, 16); ctx.fill();
    ctx.textAlign = "left"; ctx.fillStyle = "#ffd98a"; ctx.font = "bold 20px sans-serif"; ctx.fillText("David", x + 30, y + 36);
    ctx.textAlign = "right"; ctx.fillStyle = "#cdbb98"; ctx.font = "italic 15px Georgia, serif"; ctx.fillText(tw.story.ref, x + w - 30, y + 36);
    ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.font = "19px sans-serif";
    lines.forEach((l, i) => ctx.fillText(l, x + 30, y + 70 + i * 27));
    const opts = [`Set aside the first tenth: ${tw.tenth} olives`, "Not this time"], oy = y + 84 + lines.length * 27;
    opts.forEach((o, i) => {
      const iy = oy + i * 50;
      if (i === this.pick) { ctx.fillStyle = "rgba(255,220,120,0.18)"; ctx.beginPath(); ctx.roundRect(x + 18, iy, w - 36, 42, 10); ctx.fill(); }
      ctx.textAlign = "left"; ctx.fillStyle = i === this.pick ? "#ffe08a" : "#e9dcc4"; ctx.font = "bold 19px sans-serif"; ctx.fillText((i === this.pick ? "▶  " : "    ") + o, x + 34, iy + 28);
    });
    ctx.textAlign = "right"; ctx.fillStyle = "#cfe39a"; ctx.font = "15px sans-serif"; ctx.fillText(`You have ${this.prog.olives || 0} olives`, x + w - 30, oy + 28);
    ctx.restore();
  },
  drawPractice() {
    const n = this.code.length, box = 58, gap = 10, tw = n * box + (n - 1) * gap, x0 = W / 2 - tw / 2, y = 250;
    const bw = Math.max(tw + 60, 460);   // wide enough for the words even with one piece
    ctx.fillStyle = "rgba(25,14,6,0.85)"; ctx.beginPath(); ctx.roundRect(W / 2 - bw / 2, y - 70, bw, box + 130, 16); ctx.fill();
    ctx.textAlign = "center"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 22px sans-serif"; ctx.fillText("The practice wall", W / 2, y - 34);
    for (let i = 0; i < n; i++) {
      const bx = x0 + i * (box + gap), done = i < this.got;
      ctx.fillStyle = done ? "#e8b84a" : "rgba(255,255,255,0.12)"; ctx.beginPath(); ctx.roundRect(bx, y, box, box, 10); ctx.fill();
      ctx.fillStyle = done ? "#3a2410" : "rgba(255,255,255,0.35)"; ctx.font = "bold 30px sans-serif";
      ctx.fillText(done ? ARROW[this.code[i]] : "?", bx + box / 2, y + 40);   // from memory: the pieces only show once you've entered them
    }
    ctx.font = "17px sans-serif"; ctx.fillStyle = "#e9dcc4";
    const msg = this.result ? (this.result.ok ? "Thwack! Right in the middle of the target." : "Too slow. Try again.") : `Enter the throw from memory  ·  ${Math.max(0, this.pt).toFixed(1)} s`;
    ctx.fillText(msg, W / 2, y + box + 40);
  },
};
