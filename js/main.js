console.log("MAIN START");

window.onload = function(){

  loadGame?.();

  initPlayer?.();
  initLeagueSelect?.();

  bindUI();

  updateHeader?.();
  updateTable?.();

  console.log("✅ App geladen");
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
