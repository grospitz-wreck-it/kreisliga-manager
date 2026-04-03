// =========================
// 📦 IMPORTS
// =========================

// 🔥 Core zuerst
import "./core/state.js";

// 🔧 Modules
import "./modules/ads.js";
import "./modules/league.js";
import "./modules/table.js";
import "./modules/scheduler.js";
import "./services/storage.js";

// 📡 Event System
import "./core/events.js";
import "./core/events.constants.js";
import "./core/eventStore.js";

// 🎮 Engine
import "./core/engine.js";

// 🖥 UI
import "./ui/ui.js";
import { bindUI } from "./ui/bindings.js";

// 📦 Funktionen explizit importieren
import { initLeagueSelect, populateTeamSelect } from "./modules/league.js";
import { renderSchedule } from "./modules/scheduler.js";


// =========================
// 📢 ADS START
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

  console.log("🚀 Init läuft...");

  // 👉 UI vorbereiten
  initLeagueSelect();
  bindUI();

  // 👉 Ads starten
  startAds();

  // 👉 Save laden
  if(typeof window.loadGame === "function"){

    const loaded = window.loadGame();

    if(loaded){
      console.log("💾 Save geladen");

      if(window.game.league.teams.length > 0){
        populateTeamSelect();
        renderSchedule();
      }
    }
  }

  // 👉 Phase setzen (aus state.js!)
  window.game.phase = "setup";

  console.log("✅ Init fertig");
}


// =========================
// ▶️ START
// =========================
window.addEventListener("load", init);
