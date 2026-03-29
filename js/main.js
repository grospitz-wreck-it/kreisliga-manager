// =========================
// 🌍 GLOBAL GAME STATE
// =========================
const game = {
  phase: "setup",

  league: {
    key: null,
    teams: [],
    schedule: [],
    currentRound: 0
  },

  team: {
    selected: null
  },

  match: {
    current: null
  }
};

window.game = game;

// =========================
// 📢 AD ENGINE START
// =========================
function startAdEngine(){

  if(!window.renderAdBand){
    console.warn("Ads noch nicht geladen...");
    return;
  }

  window.startAdEngine(); // aus ads.js
}
// =========================
// 🚀 INIT
// =========================
function init(){

  console.log("🚀 Spiel wird gestartet...");

  // Dropdowns initialisieren
  initLeagueSelect();

  // UI Events binden
  bindUI();

  // 🔥 NEU: AD ENGINE STARTEN
  startAdEngine();

  // Optional: Save laden
  if(typeof loadGame === "function"){
    const loaded = loadGame();

    if(loaded){
      console.log("💾 Save geladen");

      if(game.league.teams.length > 0){
        populateTeamSelect();
        renderSchedule();
      }
    }
  }

  game.phase = "setup";

  console.log("✅ Init fertig");
}

// =========================
// ▶️ START
// =========================
window.onload = init;
