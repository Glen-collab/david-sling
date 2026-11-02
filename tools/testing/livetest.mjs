// node livetest.mjs <url> <outprefix> [steps json]
// Opens the URL in headless Chrome (fresh profile, real network, real time), waits for the game's loading screen to
// lift, reports seconds and MB, then runs optional steps (JS to eval, then a screenshot after a wait).
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, out, stepsJson] = process.argv.slice(2);
const steps = stepsJson ? JSON.parse(stepsJson) : [];
const port = 9333 + Math.floor(Math.random() * 500);
const prof = mkdtempSync(join(tmpdir(), "davidlive-"));
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe",
  ["--headless=new", "--mute-audio", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, "--window-size=1280,720", "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let tabs; for (let i = 0; i < 50; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (tabs.length) break; } catch (e) {} await sleep(200); }
const ws = new WebSocket(tabs.find(t => t.type === "page").webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const wait = {};
ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && wait[d.id]) { wait[d.id](d); delete wait[d.id]; } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; wait[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result?.result?.value;
const shot = async name => { const r = await send("Page.captureScreenshot", { format: "jpeg", quality: 70 }); writeFileSync(`${out}_${name}.jpg`, Buffer.from(r.result.data, "base64")); };
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
const t0 = Date.now();
await send("Page.navigate", { url });
let state = "";
for (;;) {
  await sleep(250);
  state = await ev(`typeof LOAD === "undefined" ? "boot" : (LOAD.warm ? "warm" : "play")`);
  if (state === "play" || Date.now() - t0 > 180000) break;
}
const secs = ((Date.now() - t0) / 1000).toFixed(1);
const mb = await ev(`(performance.getEntriesByType("resource").reduce((a, e) => a + (e.transferSize || e.encodedBodySize || 0), 0) / 1e6).toFixed(1)`);
console.log(`${url}  ${state === "play" ? "playing" : "STILL " + state} after ${secs}s, ${mb} MB downloaded by then`);
await shot("start");
for (const [k, s] of steps.entries()) {
  await sleep(s.wait || 0);
  if (s.js) await ev(s.js);
  await sleep(s.after || 600);
  const info = s.report ? await ev(s.report) : "";
  console.log(`  step ${k} ${s.name}: ${info}`);
  await shot(s.name);
}
ws.close(); chrome.kill();
