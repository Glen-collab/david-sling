(() => {
  const go = () => {
    if (typeof LOAD === "undefined" || LOAD.warm) return setTimeout(go, 200);
    for (const k of ["Menu", "Journal", "WorldMap", "Courtyard", "w1intro"]) { try { eval(k).active = false; } catch (e) {} }
    const R = rooms[0]; david.x = (R.c0 + 6) * T; david.y = GR * T; cave.room = R; cave.lamp = true;
    setTimeout(() => { document.body.setAttribute("data-img", canvas.toDataURL("image/jpeg", 0.75)); document.body.setAttribute("data-r", "cave far loaded " + CAVE_BG.far.naturalWidth + " errs " + (window.__errs || []).join(";")); }, 4000);
  };
  setTimeout(go, 500);
})();
