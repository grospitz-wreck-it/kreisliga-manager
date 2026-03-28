console.log("MAIN START");

window.onload = function(){

  console.log("INIT START");

  loadGame?.();

  initPlayer?.();

  // 🔥 GANZ WICHTIG: zuerst Ligen rein
  initLeagueSelect?.();

  // 🔥 DANN UI binden
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
