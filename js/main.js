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

// 🆕 👉 Spieler-Module (bereinigt)
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

// 👉 Splash Elemente holen
const splash = document.getElementById("splash");
const app = document.getElementById("app");
const startBtn = document.getElementById("startBtn");

// 👉 UI Events binden
bindUI();

// 👉 Ads starten
startAdEngine();

// 👉 Save laden
const loaded = loadGame();

if(loaded){
  console.log("💾 Save geladen");

  game.phase = "idle";

  // 👉 Splash direkt ausblenden
  if(splash) splash.style.display = "none";
  if(app) app.style.display = "block";

  // 🔥 UI nach Load wieder aufbauen
  initLeagueSelect();

  if(game.league.teams?.length > 0){
    populateTeamSelect();
    renderSchedule();
  }

} else {

  // 👉 Kein Save → Splash anzeigen
  game.phase = "setup";

  if(splash) splash.style.display = "flex";
  if(app) app.style.display = "none";

  // 👉 Start Button Logik
  if(startBtn){
    startBtn.addEventListener("click", () => {

      console.log("🎮 Spiel gestartet");

      splash.style.display = "none";
      app.style.display = "block";

      // 👉 optional: Phase wechseln
      game.phase = "idle";
    });
  }

  // =========================
  // 🆕 👉 SPIELER + TEAM BASIS LADEN (Lazy vorbereitet)
  // =========================
  try {
    console.log("⚽ Lade Spieler & Team-Struktur...");

    const players = await loadCSV("./data/spieler.csv");
    const teamsRaw = await loadCSV("./data/teams.csv");

    const teams = extractTeams(teamsRaw);
    initLeagueSelect();
    // 👉 PlayerPool initialisieren (KEINE Zuweisung!)
    initPlayerPool(players);

    // 👉 in Game State speichern
    game.players = players; // kompletter Pool
    game.teams = teams;     // nur Struktur

    console.log(`✅ PlayerPool: ${players.length} Spieler`);
    console.log(`✅ Teams: ${teams.length}`);

  } catch (e) {
    console.warn("❌ Spieler-Setup fehlgeschlagen:", e);
  }

}

// 👉 UI rendern (IMMER am Ende)
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
