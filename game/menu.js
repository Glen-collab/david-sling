// The title screen, the pause menu and Settings.
//   Title (first thing each time the game is opened): Continue / New game / Settings
//   Pause (Start in a stage, on a map or in the courtyard): Resume / Settings / Back to the map (or Title screen)
//   Settings: which controller (with a picture of its buttons), set up a controller, music and sound volume
// Settings are saved in localStorage "davidSettings" (SETTINGS in main.js). Up/Down choose, Left/Right change,
// A or Start picks, B goes back.

const MENU_TITLE_BG = "../assets/backgrounds/title.jpg";   // Glen's painting: David and the flock at sunset above Bethlehem
const CONTROLLERS = ["keyboard", "nes", "snes"];
const CONTROLLER_NAMES = { keyboard: "Keyboard", nes: "NES controller", snes: "SNES controller" };

function hasSave() { const p = loadProgress(); return Object.keys(p).some(k => /^\d-\d$/.test(k)) || !!p.skills || !!p.olives; }

const Menu = {
  active: false,
  // first thing when the game opens: the title once per sitting (a stage cleared reloads the page, and that goes straight to the map)
  boot() {
    let seen = false; try { seen = sessionStorage.getItem("davidTitleSeen"); } catch (e) {}
    if (seen) WorldMap.open(loadProgress().view || "journey"); else this.open("title");
  },
  open(screen, fromStage = false) {
    this.fromStage = fromStage; this.active = true; this.t = 0; this.msg = null;
    if (screen === "title") {
      if (!this.bg) { this.bg = new Image(); this.bg.src = MENU_TITLE_BG + "?v=" + (window.BUILD || 0); }
      this.snap = null;
    } else {   // keep a picture of what's underneath (the game is paused behind the menu)
      this.snap = document.createElement("canvas"); this.snap.width = W; this.snap.height = H;
      this.snap.getContext("2d").drawImage(canvas, 0, 0);
      this.under = WorldMap.active ? "map" : Courtyard.active ? "courtyard" : "stage";
      WorldMap.active = false; Courtyard.active = false;   // paused; they come back on Resume
    }
    this.home = screen; this.go(screen);
  },
  go(screen) { this.screen = screen; this.sel = 0; const it = this.items(); while (it[this.sel] && it[this.sel].off) this.sel++; },
  close() {
    this.active = false;
    if (this.under === "map") WorldMap.active = true;
    if (this.under === "courtyard") Courtyard.active = true;
    this.under = null;
  },
  leaveTitle(fn) { try { sessionStorage.setItem("davidTitleSeen", "1"); } catch (e) {} this.active = false; this.under = null; fn(); },
  items() {
    const S = SETTINGS;
    if (this.screen === "title") return [
      { label: "Continue", off: !hasSave(), act: () => this.leaveTitle(() => WorldMap.open(loadProgress().view || "journey")) },
      { label: "New game", act: () => hasSave() ? this.go("confirm") : this.newGame() },
      { label: "Settings", act: () => this.go("settings") },
    ];
    if (this.screen === "pause") return [
      { label: "Resume", act: () => this.close() },
      { label: "Settings", act: () => this.go("settings") },
      this.under === "stage" ? { label: "Back to the map", act: () => backToMap() }
                             : { label: "Title screen", act: () => { this.under = null; this.open("title"); } },
    ];
    if (this.screen === "settings") {
      const cyc = d => { S.controller = CONTROLLERS[(CONTROLLERS.indexOf(S.controller) + d + CONTROLLERS.length) % CONTROLLERS.length]; saveSettings(); };
      const vol = (k, d) => { S[k] = Math.max(0, Math.min(10, S[k] + d)); saveSettings(); if (k === "sfx") chime(S.sfx % 8); };
      return [
        { label: "Controller", value: "◀  " + CONTROLLER_NAMES[S.controller] + "  ▶", lr: cyc, act: () => this.go("controls") },
        { label: "Show the buttons", act: () => this.go("controls") },
        { label: "Set up a controller", act: () => { if (readPad()) startSetup(); else this.msg = "Press a button on the controller first, so the browser can see it."; } },
        { label: "Music", bar: S.music, lr: d => vol("music", d) },
        { label: "Sounds", bar: S.sfx, lr: d => vol("sfx", d) },
        { label: "Back", act: () => this.go(this.home) },
      ];
    }
    if (this.screen === "confirm") return [
      { label: "No, keep my game", act: () => this.go("title") },
      { label: "Yes, start over", act: () => this.newGame() },
    ];
    return [{ label: "Back", act: () => this.go("settings") }];   // controls
  },
  newGame() {
    for (const k of ["davidProgress", "davidStones", "davidGateTops"]) try { localStorage.removeItem(k); } catch (e) {}
    this.leaveTitle(() => WorldMap.open("journey"));
  },
  update(dt) {
    this.t += dt;
    if (setup.active) return;
    const it = this.items();
    const move = d => { let i = this.sel; do { i = (i + d + it.length) % it.length; } while (it[i].off && i !== this.sel); this.sel = i; this.msg = null; chime(1); };
    if (pressed("down")) move(1);
    if (pressed("up")) move(-1);
    const cur = it[this.sel];
    if (cur && cur.lr && pressed("left")) cur.lr(-1);
    if (cur && cur.lr && pressed("right")) cur.lr(1);
    if ((pressed("a") || pressed("start")) && cur && !cur.off && cur.act) { chime(4); cur.act(); return; }
    if (this.screen === "controls" && (pressed("left") || pressed("right"))) {
      SETTINGS.controller = CONTROLLERS[(CONTROLLERS.indexOf(SETTINGS.controller) + (pressed("right") ? 1 : -1) + 3) % 3]; saveSettings();
    }
    if (pressed("b")) {
      if (this.screen === "controls") this.go("settings");
      else if (this.screen === "settings" || this.screen === "confirm") this.go(this.home);
      else if (this.screen === "pause") this.close();
    }
  },
  // ---- drawing ----
  draw() {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    if (this.snap) { ctx.drawImage(this.snap, 0, 0); ctx.fillStyle = "rgba(10,6,2,0.62)"; ctx.fillRect(0, 0, W, H); }
    else if (this.bg && this.bg.naturalWidth) {
      // a very slow push in, like a film opening
      const img = this.bg, s = Math.max(W / img.naturalWidth, H / img.naturalHeight) * (1.02 + 0.03 * Math.min(1, this.t / 40));
      ctx.drawImage(img, (W - img.naturalWidth * s) / 2, (H - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
      if (this.screen !== "title") { ctx.fillStyle = "rgba(10,6,2,0.45)"; ctx.fillRect(0, 0, W, H); }   // settings over it: dimmer
      const g = ctx.createLinearGradient(0, H * 0.75, 0, H); g.addColorStop(0, "rgba(10,6,2,0)"); g.addColorStop(1, "rgba(10,6,2,0.5)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    ctx.textAlign = "center";
    if (this.screen === "controls") { this.drawControls(); ctx.restore(); return; }
    const title = this.screen === "title" || (this.screen === "confirm");
    if (title) {
      // gold letters with a dark outline and a soft glow, so they read against the bright sunset sky
      ctx.lineJoin = "round"; ctx.shadowColor = "rgba(60,30,5,0.6)"; ctx.shadowBlur = 18;
      ctx.font = "bold 96px Georgia, serif"; ctx.lineWidth = 10; ctx.strokeStyle = "#4a2a10"; ctx.strokeText("David", W / 2, 150);
      ctx.shadowBlur = 0; ctx.fillStyle = "#ffd76a"; ctx.fillText("David", W / 2, 150);
      ctx.font = "italic bold 36px Georgia, serif"; ctx.lineWidth = 7; ctx.strokeText("The Shepherd's Sling", W / 2, 202);
      ctx.fillStyle = "#fff4d6"; ctx.fillText("The Shepherd's Sling", W / 2, 202);
    } else {
      ctx.fillStyle = "#ffe08a"; ctx.font = "bold 44px Georgia, serif"; ctx.fillText(this.screen === "pause" ? "Paused" : "Settings", W / 2, 150);
    }
    if (this.screen === "confirm") {
      ctx.fillStyle = "#fff"; ctx.font = "22px sans-serif";
      ctx.fillText("Start a new game? Your saved game (stages, sheep, olives, skills) will be erased.", W / 2, 320);
    }
    // the list
    const it = this.items(), rowH = 54, top = this.screen === "confirm" ? 380 : title ? 330 : 220;
    const bw = this.screen === "settings" ? 620 : 420;
    ctx.fillStyle = "rgba(25,14,6,0.72)"; ctx.beginPath(); ctx.roundRect(W / 2 - bw / 2, top - 40, bw, it.length * rowH + 30, 16); ctx.fill();
    it.forEach((m, i) => {
      const y = top + i * rowH, on = i === this.sel;
      if (on) { ctx.fillStyle = "rgba(255,210,110,0.18)"; ctx.beginPath(); ctx.roundRect(W / 2 - bw / 2 + 12, y - 30, bw - 24, 44, 10); ctx.fill(); }
      ctx.fillStyle = m.off ? "rgba(255,255,255,0.3)" : on ? "#ffe08a" : "#f3ead8";
      ctx.font = `${on ? "bold " : ""}26px sans-serif`;
      const twoCol = this.screen === "settings";
      ctx.textAlign = twoCol ? "left" : "center";
      ctx.fillText((on ? "▸ " : "") + m.label, twoCol ? W / 2 - bw / 2 + 36 : W / 2, y);
      if (m.value) { ctx.textAlign = "right"; ctx.font = "22px sans-serif"; ctx.fillText(m.value, W / 2 + bw / 2 - 30, y); }
      if (m.bar !== undefined) {   // ten little stones for the volume
        for (let k = 0; k < 10; k++) {
          ctx.fillStyle = k < m.bar ? (on ? "#ffd166" : "#e9dcc4") : "rgba(255,255,255,0.15)";
          ctx.beginPath(); ctx.ellipse(W / 2 + 40 + k * 24, y - 8, 9, 7, 0, 0, Math.PI * 2); ctx.fill();
        }
        if (on) { ctx.fillStyle = "#ffe08a"; ctx.textAlign = "left"; ctx.font = "20px sans-serif"; ctx.fillText("◀", W / 2 + 4, y - 1); ctx.fillText("▶", W / 2 + 280, y - 1); }
      }
      ctx.textAlign = "center";
    });
    // under the list
    ctx.font = "17px sans-serif"; ctx.fillStyle = "#e9dcc4";
    let y = top + it.length * rowH + 30;
    if (this.screen === "settings") {
      const p = readPad();
      ctx.fillText(p ? `A controller is plugged in${mapFor(p) ? " and set up ✓" : ": choose \"Set up a controller\""}` : "No controller seen yet (press a button on it so the browser sees it).", W / 2, y); y += 26;
    }
    if (this.msg) { ctx.fillStyle = "#ffd166"; ctx.fillText(this.msg, W / 2, y); }
    if (!audioUnlocked && this.screen === "title") { ctx.fillStyle = "#ffe08a"; ctx.fillText("Click the game once to turn on sound", W / 2, H - 56); }
    ctx.fillStyle = "rgba(10,6,2,0.9)"; ctx.fillRect(0, H - 46, W, 46);
    ctx.fillStyle = "rgba(255,240,215,0.8)"; ctx.font = "15px sans-serif";
    ctx.fillText(this.hint(), W / 2, H - 18);
    ctx.restore();
  },
  hint() {
    const k = SETTINGS.controller === "keyboard";
    return k ? "Arrows: choose    Left / Right: change    Z or Enter: OK    X: back" : "D-pad: choose    Left / Right: change    A: OK    B: back";
  },
  // a picture of the chosen controller and what each button does
  drawControls() {
    const c = SETTINGS.controller;
    const rows = c === "keyboard" ? [
      ["Arrows (or W A S D)", "Walk. Keep holding to run"],
      ["Z or Space", "Jump (A). Hold it to jump higher"],
      ["X", "Throw a stone (B). Up + X throws up"],
      ["Down", "Crouch. Next to the lamb: pick it up"],
      ["Down + Z, or V", "Roll"],
      ["Up", "Go into a cave, read a carving"],
      ["Shift", "Sit and play the harp (Select). On a map: the Journal"],
      ["Enter or Esc", "Pause and settings (Start)"],
    ] : [
      ["D-pad", "Walk. Keep holding to run"],
      ["A", "Jump. Hold it to jump higher"],
      ["B", "Throw a stone. Up + B throws up"],
      ["Down", "Crouch. Next to the lamb: pick it up"],
      [c === "snes" ? "X  (or Down + A)" : "Down + A", "Roll"],
      ["Up", "Go into a cave, read a carving"],
      [c === "snes" ? "Y  (or Select)" : "Select", "Sit and play the harp. On a map: the Journal"],
      ["Start", "Pause and settings"],
    ];
    ctx.fillStyle = "rgba(10,6,2,0.55)"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(25,14,6,0.8)"; ctx.beginPath(); ctx.roundRect(636, 156, 610, 412, 16); ctx.fill();
    ctx.fillStyle = "#ffe08a"; ctx.font = "bold 40px Georgia, serif"; ctx.fillText("◀  " + CONTROLLER_NAMES[c] + "  ▶", W / 2, 90);
    if (c === "nes") this.drawNES(330, 300); else if (c === "snes") this.drawSNES(330, 300); else this.drawKeys(330, 300);
    ctx.textAlign = "left";
    rows.forEach(([b, what], i) => {
      const y = 190 + i * 50;
      ctx.fillStyle = "#ffe08a"; ctx.font = "bold 21px sans-serif"; ctx.fillText(b, 660, y);
      ctx.fillStyle = "#f3ead8"; ctx.font = "19px sans-serif"; ctx.fillText(what, 660, y + 22);
    });
    ctx.textAlign = "center"; ctx.fillStyle = "rgba(255,240,215,0.75)"; ctx.font = "15px sans-serif";
    ctx.fillText("Left / Right: another controller    A or B: back", W / 2, H - 22);
  },
  dpad(x, y, s) {
    ctx.fillStyle = "#1c1c1c"; ctx.fillRect(x - s * 1.5, y - s / 2, s * 3, s); ctx.fillRect(x - s / 2, y - s * 1.5, s, s * 3);
  },
  label(t, x, y, col = "#fff", size = 16) { ctx.fillStyle = col; ctx.font = `bold ${size}px sans-serif`; ctx.textAlign = "center"; ctx.fillText(t, x, y); },
  drawNES(cx, cy) {
    ctx.fillStyle = "#c9c6c0"; ctx.beginPath(); ctx.roundRect(cx - 250, cy - 100, 500, 200, 12); ctx.fill();
    ctx.fillStyle = "#2a2a2a"; ctx.beginPath(); ctx.roundRect(cx - 232, cy - 70, 464, 150, 8); ctx.fill();
    this.dpad(cx - 160, cy + 10, 34);
    ctx.fillStyle = "#9a958e"; ctx.beginPath(); ctx.roundRect(cx - 60, cy - 40, 120, 100, 6); ctx.fill();
    for (const [dx, t] of [[-28, "SELECT"], [28, "START"]]) { ctx.fillStyle = "#1c1c1c"; ctx.beginPath(); ctx.roundRect(cx + dx - 20, cy + 22, 40, 12, 6); ctx.fill(); this.label(t, cx + dx, cy + 12, "#b5302a", 11); }
    for (const [dx, t] of [[110, "B"], [180, "A"]]) {
      ctx.fillStyle = "#b5302a"; ctx.beginPath(); ctx.arc(cx + dx, cy + 20, 26, 0, Math.PI * 2); ctx.fill();
      this.label(t, cx + dx + 22, cy + 70, "#b5302a", 18);
    }
  },
  drawSNES(cx, cy) {
    ctx.fillStyle = "#cfcbd8";
    ctx.beginPath(); ctx.arc(cx - 160, cy + 10, 110, 0, Math.PI * 2); ctx.arc(cx + 160, cy + 10, 110, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(cx - 160, cy - 80, 320, 160);
    ctx.fillStyle = "#b9b5c4"; ctx.beginPath(); ctx.roundRect(cx - 240, cy - 108, 120, 20, 8); ctx.roundRect(cx + 120, cy - 108, 120, 20, 8); ctx.fill();
    this.label("L", cx - 180, cy - 92, "#555", 14); this.label("R", cx + 180, cy - 92, "#555", 14);
    this.dpad(cx - 160, cy + 10, 30);
    for (const [dx, t] of [[-30, "SELECT"], [30, "START"]]) {
      ctx.save(); ctx.translate(cx + dx, cy + 20); ctx.rotate(-0.5); ctx.fillStyle = "#555"; ctx.beginPath(); ctx.roundRect(-20, -6, 40, 12, 6); ctx.fill(); ctx.restore();
      this.label(t, cx + dx, cy + 52, "#555", 11);
    }
    const B = [["X", 0, -46, "#3a62c4"], ["Y", -46, 0, "#3f9a4a"], ["A", 46, 0, "#c4373a"], ["B", 0, 46, "#e0b43a"]];
    for (const [t, dx, dy, col] of B) {
      ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx + 160 + dx, cy + 10 + dy, 22, 0, Math.PI * 2); ctx.fill();
      this.label(t, cx + 160 + dx, cy + 17 + dy, "#fff", 18);
    }
  },
  drawKeys(cx, cy) {
    const key = (x, y, w, t) => { ctx.fillStyle = "#e9e4da"; ctx.beginPath(); ctx.roundRect(x, y, w, 44, 6); ctx.fill(); ctx.fillStyle = "#b5ad9e"; ctx.fillRect(x, y + 38, w, 6); this.label(t, x + w / 2, y + 28, "#333", 15); };
    key(cx - 250, cy - 40, 60, "Shift"); key(cx - 180, cy - 40, 50, "Z"); key(cx - 120, cy - 40, 50, "X"); key(cx - 60, cy - 40, 50, "C"); key(cx, cy - 40, 50, "V");
    key(cx - 200, cy + 20, 240, "Space");
    key(cx + 140, cy - 100, 70, "Enter");
    key(cx + 150, cy - 30, 50, "↑"); key(cx + 95, cy + 20, 50, "←"); key(cx + 150, cy + 20, 50, "↓"); key(cx + 205, cy + 20, 50, "→");
  },
};
