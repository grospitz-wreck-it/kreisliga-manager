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
import { initLeagueSelect } from "./modules/league.js";

// =========================
// 🆕 DATA
// =========================
import { loadCSV } from "./modules/loader.js";
import { extractLeagues } from "./modules/teamGenerator.js";
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

  // =========================
  // 📦 DATEN LADEN (IMMER!)
  // =========================
  try {

    console.log("⚽ Lade Daten...");

    const players = await loadCSV("./data/spieler.csv");
    const leaguesRaw = await loadCSV("./data/ligen.csv");

    const leagues = extractLeagues(leaguesRaw);

    initPlayerPool(players);

    game.players = players;
    game.data = { leagues };

    // 👉 Default Liga setzen
    if (leagues.length > 0) {
      game.league = game.league || {};
      game.league.current = leagues[0];
    }

    console.log(`✅ Spieler: ${players.length}`);
    console.log(`✅ Ligen: ${leagues.length}`);

  } catch (e) {
    console.warn("❌ Daten laden fehlgeschlagen:", e);
  }

  // =========================
  // 💾 SAVE LADEN
  // =========================
  const loaded = loadGame();

  const hasValidSave =
    loaded &&
    loaded.league &&
    loaded.team;

  // =========================
  // ✅ FALL 1: SAVE
  // =========================
  if (hasValidSave) {

    console.log("✅ Save geladen");

    game.phase = "idle";

    if(splash) splash.style.display = "none";
    if(app) app.style.display = "block";

    initLeagueSelect(); // 👉 kümmert sich auch um Teams

    renderSchedule();
  }

  // =========================
  // 🟡 FALL 2: KEIN SAVE
  // =========================
  else {

    console.log("🟡 Kein Save → Splash");

    game.phase = "setup";

    if(splash) splash.style.display = "flex";
    if(app) app.style.display = "none";

    initLeagueSelect(); // 👉 reicht komplett

    // 👉 Default Team setzen (WICHTIG)
    if (
      game.league?.current &&
      game.league.current.teams?.length
    ) {
      game.team = game.team || {};
      game.team.selected = game.league.current.teams[0].name;
    }

    if(startBtn){
      startBtn.onclick = () => {

        if(!game.league?.current){
          alert("Bitte Liga wählen");
          return;
        }

        if(!game.team?.selected){
          alert("Bitte Team wählen");
          return;
        }

        console.log("🎮 Spiel gestartet");

        splash.style.display = "none";
        app.style.display = "block";

        game.phase = "idle";
      };
    }
  }

  // =========================
  // 🎨 UI RENDER
  // =========================
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
