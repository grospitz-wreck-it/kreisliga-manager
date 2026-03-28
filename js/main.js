console.log("MAIN START");
window.onload = function(){

  console.log("INIT START");

  loadGame?.();

  initPlayer?.();

  // ✅ HIER: Dropdown befüllen
  initLeagueSelect();

  // ✅ DANACH: Events binden
  bindUI();

  updateHeader?.();
  updateTable?.();

  console.log("INIT DONE");
};

// =========================
// ▶️ FLOW
// =========================
function handleMainAction(){

  switch(game.phase){

    case "idle":
      startSeason();
      break;

    case "ready":
      startMatch();
      break;

    case "halftime":
      resumeMatch();
      break;

    case "live":
      pauseMatch();
      break;
  }
}
