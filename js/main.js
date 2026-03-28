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

// =========================
// 🌍 EXPORT (WICHTIG!)
// =========================
window.handleMainAction = handleMainAction;
