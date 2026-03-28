// =========================
// 🚀 MAIN INIT (CLEAN)
// =========================
console.log("MAIN FILE LOADED");

document.addEventListener("DOMContentLoaded", () => {

  console.log("🚀 DOM READY");

  try {

    // 🔹 Player
    if(typeof initPlayer === "function"){
      initPlayer();
    }

    // 🔹 Liga Dropdown
    if(typeof initLeagueSelect === "function"){
      initLeagueSelect();
    }

    // 🔹 UI Events
    if(typeof bindUI === "function"){
      bindUI();
    }

    // 🔹 UI Updates
    if(typeof updateHeader === "function"){
      updateHeader();
    }

    if(typeof updateTable === "function"){
      updateTable();
    }

    console.log("✅ INIT COMPLETE");

  } catch(err){
    console.error("❌ INIT ERROR:", err);
  }

});
// =========================
// 🎮 MAIN FLOW
// =========================
function handleMainAction(){

  console.log("🎮 Main Button:", game.phase);

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
function startSeason(){
  console.log("🏁 Saison startet");

  if(!game.league.teams.length){
    alert("Liga wählen!");
    return;
  }

  generateSchedule?.();

  game.phase = "ready";
}

function startMatch(){
  console.log("⚽ Spiel startet");

  simulateMatchday?.();

  game.phase = "live";
}

function resumeMatch(){
  console.log("▶️ 2. Halbzeit");

  resumeMatchEngine?.();

  game.phase = "live";
}

function pauseMatch(){
  console.log("⏸ Pause");

  pauseMatchEngine?.();

  game.phase = "halftime";
}

// EXPORTS
window.startSeason = startSeason;
window.startMatch = startMatch;
window.resumeMatch = resumeMatch;
window.pauseMatch = pauseMatch;
// =========================
// 🌍 EXPORT (WICHTIG!)
// =========================
window.handleMainAction = handleMainAction;
