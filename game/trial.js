// ---------------------------------------------------------------------------
// The Shepherd's Trial (DESIGN "Post-game"): every boss again, no counsel help, best times. Picked from the title
// screen (menu.js, once 8-2 is cleared; open now for testing, SCENES_ALL_OPEN). Each one loads its stage as
// index.html?trial&at=<column>#<stage>: David starts at the last campfire before the arena (a fall brings him back
// there), the counsel is switched off in each world's file (TRIAL), and the clock runs from the start until the boss is
// beaten. Then the time, the best for that difficulty (localStorage davidTrial), and back to the list or again.
// ---------------------------------------------------------------------------
const TRIAL_BOSSES = [   // at: the column David starts on (the last fire before the arena); beaten: the boss is down
  { stage: "1-4", name: "The Lion", at: 215, beaten: () => lion && lion.state === "defeated" },
  { stage: "2-4", name: "The Bear", at: 190, beaten: () => typeof bear !== "undefined" && bear.on && bear.state === "defeated" },
  { stage: "3-4", name: "The Wild Ox", at: 244, beaten: () => typeof ox !== "undefined" && ox.on && (ox.state === "flee" || ox.state === "gone") },
  { stage: "4-4", name: "Saul's Torment", at: 166, beaten: () => typeof saul !== "undefined" && saul.calm },
  { stage: "5-4", name: "The Chariot", at: 206, beaten: () => typeof chariot !== "undefined" && !!chariot && chariot.beaten },
  { stage: "6-4", name: "The Watchtower", at: 156, beaten: () => typeof tw !== "undefined" && !!tw && tw.beaten },
  { stage: "7-4", name: "The Shield-Bearer", at: 152, beaten: () => typeof sb !== "undefined" && !!sb && sb.beaten },
  { stage: "8-2", name: "Goliath", at: 3, beaten: () => typeof g8 !== "undefined" && !!g8 && g8.state === "thrown" },
];
const TRIAL_TUNE = {
  AFTER: 2.2,      // seconds after the boss goes down before the result (the last stone lands, he falls)
};
function trialBest() { try { return JSON.parse(localStorage.getItem(slotKey("davidTrial")) || "{}"); } catch (e) { return {}; } }
const trialTime = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
const trial = { t: 0, beatenT: 0, done: false, sel: 0 };
const TRIAL_BOSS = TRIAL ? TRIAL_BOSSES.find(b => b.stage === LEVEL_STAGE) : null;
// main.js frame: true = the Trial has the screen (the result)
function trialFrame(dt) {
  if (!TRIAL_BOSS) return false;
  if (!trial.done) {
    trial.t += dt;
    if (TRIAL_BOSS.beaten()) {
      trial.beatenT += dt;
      if (trial.beatenT >= TRIAL_TUNE.AFTER) trialResult();
    }
    return false;
  }
  pollInput(); trial.show += dt;
  const go = pressed("a") || pressed("start"), again = pressed("b");
  if (trial.show > 0.8 && (go || again)) {
    if (again) { startStage(LEVEL_STAGE); return true; }
    try { sessionStorage.setItem("davidTrialBack", "1"); } catch (e) {}
    location.href = "index.html";
    return true;
  }
  drawTrialResult();
  return true;
}
function trialResult() {
  trial.done = true; trial.show = 0;
  const time = trial.t - trial.beatenT;   // (the clock stops when the boss goes down)
  trial.time = time;
  const all = trialBest(), mine = all[LEVEL_STAGE] || {}, k = SETTINGS.difficulty in DIFFICULTY ? SETTINGS.difficulty : "medium";
  trial.prev = mine[k]; trial.best = !(mine[k] <= time);
  if (trial.best) { mine[k] = Math.round(time * 10) / 10; all[LEVEL_STAGE] = mine; try { localStorage.setItem(slotKey("davidTrial"), JSON.stringify(all)); } catch (e) {} }
  // quiet: the fight's music, the giant's horns, the loops
  hushLoops(); hushGiant();
  for (const a of [dayMusic, nightMusic, caveMusic, stageTheme, ambience, bossMusic, stepsRun]) if (a && !a.paused) a.pause();
  if (typeof G8_MUSIC !== "undefined") G8_MUSIC.pause();
  if (typeof battleLoop !== "undefined") battleLoop.pause();
  chime(4); setTimeout(() => chime(7), 180); setTimeout(() => chime(11), 360);
  // the picture underneath, held still
  trial.snap = document.createElement("canvas"); trial.snap.width = W; trial.snap.height = H; trial.snap.getContext("2d").drawImage(canvas, 0, 0);
}
function drawTrialResult() {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (trial.snap) ctx.drawImage(trial.snap, 0, 0);
  const f = Math.min(1, trial.show / 0.6);
  ctx.fillStyle = `rgba(10,6,2,${0.7 * f})`; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = f; ctx.textAlign = "center";
  ctx.fillStyle = "#ffe08a"; ctx.font = "italic 30px Georgia, serif"; ctx.fillText("The Shepherd's Trial", W / 2, 200);
  ctx.fillStyle = "#fff6e2"; ctx.font = "bold 48px Georgia, serif"; ctx.fillText(`${TRIAL_BOSS.name}`, W / 2, 262);
  ctx.font = "bold 64px sans-serif"; ctx.fillStyle = "#fff"; ctx.fillText(trialTime(trial.time), W / 2, 360);
  ctx.font = "24px sans-serif"; ctx.fillStyle = trial.best ? "#ffd166" : "#e9dcc4";
  const diff = DIFF.name;
  ctx.fillText(trial.best ? (trial.prev ? `A new best on ${diff}! (was ${trialTime(trial.prev)})` : `Your first time on ${diff}.`) : `Best on ${diff}: ${trialTime(trial.prev)}`, W / 2, 414);
  if (trial.show > 0.8) { ctx.fillStyle = "#e9dcc4"; ctx.font = "20px sans-serif"; ctx.fillText("A: back to the Trial      B: try again", W / 2, 500); }
  ctx.restore();
}
function drawTrialClock() {   // top right, while the fight's on
  if (!TRIAL_BOSS || trial.done) return;
  ctx.save(); ctx.textAlign = "right";
  const y = H - 74;   // bottom right (the hearts and counts are top right)
  ctx.fillStyle = "rgba(25,14,6,0.6)"; ctx.beginPath(); ctx.roundRect(W - 232, y, 218, 58, 10); ctx.fill();
  ctx.fillStyle = "#ffe08a"; ctx.font = "15px sans-serif"; ctx.fillText(`Shepherd's Trial · ${DIFF.name}`, W - 26, y + 21);
  ctx.fillStyle = "#fff"; ctx.font = "bold 24px sans-serif"; ctx.fillText(trialTime(trial.t), W - 26, y + 49);
  ctx.restore();
}
if (TRIAL && !TRIAL_BOSS) location.href = "index.html";   // (a stage with no boss: nothing to do here)
if (TRIAL_BOSS) {   // no counsel: nobody at the fires or along the way has anything to say
  for (const k of talks) k.done = true;
  for (const f of fires) f.say = null;
}
