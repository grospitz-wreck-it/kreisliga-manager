// =========================
// 🚀 MAIN INIT (CLEAN)
// =========================
console.log("MAIN FILE LOADED");

window.addEventListener("DOMContentLoaded", () => {

  console.log("🚀 DOM READY");

  initPlayer?.();
  initLeagueSelect?.();

  // 🔥 JETZT ERST VALUE LESEN
  const leagueSelect = document.getElementById("leagueSelect");

  console.log("👉 SELECT VALUE:", leagueSelect?.value);

  if(leagueSelect && leagueSelect.value){
    selectLeague(leagueSelect.value);
  } else {
    console.warn("❌ Keine Default Liga gesetzt");
  }

  bindUI?.();
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
