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
import { generateSchedule } from "./modules/scheduler.js";
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

  bindUI();
  startAdEngine();

  // =========================
  // 📦 DATEN LADEN
  // =========================
  try {

    console.log("⚽ Lade Daten...");

    const players = await loadCSV("./data/spieler.csv");
    const leaguesRaw = await loadCSV("./data/ligen.csv");

    const leagues = extractLeagues(leaguesRaw);

    initPlayerPool(players);

    game.players = players;
    game.data.leagues = leagues;

    // 👉 Default Liga setzen
    if (leagues.length > 0) {
      game.league.current = leagues[0];
      initTable();
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

  initLeagueSelect();

// 🔥 WICHTIG: erst sicherstellen, dass Teams final sind
initTable();

// 👉 dann Schedule
if(!game.league.schedule || game.league.schedule.length === 0){
  console.warn("⚠️ Kein Spielplan im Save → neu generieren");
  generateSchedule();
}

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

    initLeagueSelect();

    // 👉 Default Team setzen
    if (
      game.league.current &&
      game.league.current.teams?.length
    ) {
      const first = game.league.current.teams[0];

      game.team.selected =
        typeof first === "string" ? first : first.name;
    }
  }

  // =========================
  // 📅 SPIELPLAN SICHERSTELLEN (GLOBAL FIX)
  // =========================
  if(
    game.league.current &&
    (!game.league.schedule || game.league.schedule.length === 0)
  ){
    console.log("📅 Generiere Spielplan...");
    generateSchedule();
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
