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

    // 👉 wichtig: nur wenn Daten existieren
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
      const teamsRaw = await loadCSV("./data/ligen.csv");

      const teams = extractTeams(teamsRaw);

      // 👉 DEIN BESTEHENDES SYSTEM BEHALTEN
      game.players = players;
      game.teams = teams;

      // 👉 MINIMALER FIX: leagues ergänzen (für dein league.js)
      game.data = {
        leagues: [
          {
            name: "Kreisliga",
            teams: teams
          }
        ]
      };

      // 👉 jetzt ist alles da → UI initialisieren
      initLeagueSelect();

      initPlayerPool(players);

      console.log(`✅ PlayerPool: ${players.length} Spieler`);
      console.log(`✅ Teams: ${teams.length}`);

    } catch (e) {
      console.warn("❌ Spieler-Setup fehlgeschlagen:", e);
    }

  }

  // 👉 UI immer am Ende
  renderApp();

  console.log("✅ Init fertig");
}

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
