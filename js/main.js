// =========================
// 📦 CORE
// =========================
import { renderApp } from "./ui/layout.js";
import { game } from "./core/state.js";
import "./core/events.js";
import "./core/events.constants.js";
import "./core/eventStore.js";

// =========================
// 🔧 MODULES
// =========================
import { startAdEngine } from "./modules/ads.js";
import "./modules/scheduler.js";
import "./modules/table.js";
import { initLeagueSelect, populateTeamSelect } from "./modules/league.js";

// =========================
// 🆕 SPIELER
// =========================
import { loadCSV } from "./modules/loader.js";
import { extractTeams } from "./modules/teamGenerator.js";
import { initPlayerPool } from "./modules/playerPool.js";

// =========================
// 🎮 ENGINE
// =========================
import { handleMainAction } from "./core/engine.js";

// =========================
// 💾 STORAGE
// =========================
import { loadGame } from "./services/storage.js";

// =========================
// 🖥 UI
// =========================
import { bindUI } from "./ui/bindings.js";
import { renderSchedule } from "./ui/ui.js";

// =========================
// 🚀 INIT
// =========================
// =========================
// 🚀 INIT
// =========================
async function init(){

  console.log("🚀 Init läuft...");

  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  const startBtn = document.getElementById("startBtn");

  bindUI();
  startAdEngine();

  const loaded = loadGame();

  // =========================
  // 💾 SAVE EXISTIERT
  // =========================
  if(loaded){

    console.log("💾 Save geladen");

    game.phase = "idle";

    if(splash) splash.style.display = "none";
    if(app) app.style.display = "block";

    if(game.data?.leagues){
      initLeagueSelect();
      populateTeamSelect();
    }

    renderSchedule();

  } else {

    // =========================
    // 🟡 SPLASH MODE
    // =========================
    game.phase = "setup";

    if(splash) splash.style.display = "flex";
    if(app) app.style.display = "none";

    if(startBtn){
      startBtn.onclick = () => {
        console.log("🎮 Spiel gestartet");

        splash.style.display = "none";
        app.style.display = "block";

        game.phase = "idle";
      };
    }

    // =========================
    // 📦 DATEN LADEN
    // =========================
    try {

      console.log("⚽ Lade Spieler & Team-Struktur...");

      const players = await loadCSV("./data/spieler.csv");
      const leaguesRaw = await loadCSV("./data/ligen.csv");

      const leagues = extractLeagues(leaguesRaw);

      initPlayerPool(players);

      game.players = players;

      game.data = {
        leagues: leagues
      };

      if (leagues.length > 0) {
        game.league = game.league || {};
        game.league.current = leagues[0];
      }

      initLeagueSelect();

      console.log(`✅ PlayerPool: ${players.length} Spieler`);
      console.log(`✅ Ligen: ${leagues.length}`);
      console.log(`✅ Teams gesamt: ${
        leagues.reduce((sum, l) => sum + l.teams.length, 0)
      }`);

    } catch (e) {
      console.warn("❌ Spieler-Setup fehlgeschlagen:", e);
    }

  } // ✅ else geschlossen

  // 👉 UI immer am Ende
  renderApp();

  console.log("✅ Init fertig");

} // ✅ init geschlossen

// =========================
// ▶️ START
// =========================
document.addEventListener("DOMContentLoaded", init);

// =========================
// 📦 EXPORTS
// =========================
export {
  init,
  handleMainAction
};
