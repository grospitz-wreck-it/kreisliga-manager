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
// 📢 AD ENGINE START (FIX)
// =========================
function startAdsSafe(){

  const interval = setInterval(() => {

    // 👉 warten bis ads.js geladen ist
    if(typeof window.startAdEngine === "function"){

      console.log("✅ ads.js bereit → starte Ads");

      clearInterval(interval);

      window.startAdEngine(); // 👉 DIE aus ads.js!

    } else {
      console.log("⏳ warte auf ads.js...");
    }

  }, 200);
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
