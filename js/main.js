// =========================
// 🌍 GLOBAL GAME STATE
// =========================

import "./core/state.js";
import "./modules/ads.js";
import "./ui/ui.js";
import "./modules/league.js";
import "./modules/table.js";
import "./modules/scheduler.js";
import "./services/storage.js";
import "./core/events.js";
import "./core/events.constants.js";
import "./core/engine.js";
import "./ui/bindings.js";


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
// 📢 ADS START (SAUBER)
// =========================
function startAds(){

  if(typeof window.startAdEngine === "function"){
    console.log("✅ Ads starten direkt");
    window.startAdEngine();
  } else {
    console.warn("❌ startAdEngine nicht gefunden (ads.js fehlt?)");
  }

}

// =========================
// 🚀 INIT
// =========================
function init(){

  console.log("🚀 Spiel wird gestartet...");

  // UI vorbereiten
  initLeagueSelect();
  bindUI();

  // Ads starten (einmal, sauber)
  startAds();

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
// ▶️ START (WICHTIG!)
// =========================
window.addEventListener("load", () => {
  init();
});
