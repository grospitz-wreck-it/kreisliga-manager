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

// 🆕 👉 Spieler-Module (minimal ergänzt)
import { loadCSV } from "./modules/loader.js";
import { extractTeams } from "./modules/teamGenerator.js";
import { assignPlayers } from "./modules/assigner.js";
import { initPlayerPool } from "./modules/playerPool.js";
import { loadCSV } from "./modules/loader.js";

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
function init(){

console.log("🚀 Init läuft...");

// 👉 UI Events binden
bindUI();

// 👉 Ads starten
startAdEngine();

// 👉 Save laden
const loaded = loadGame();

if(loaded){
console.log("💾 Save geladen");


game.phase = "idle";

// 🔥 UI nach Load wieder aufbauen
initLeagueSelect();

if(game.league.teams?.length > 0){
  populateTeamSelect();
  renderSchedule();
}


} else {

// 👉 Kein Save → Splash
game.phase = "setup";

// =========================
// 🆕 👉 SPIELER GENERIERUNG (nur bei neuem Spiel)
// =========================
try {
  console.log("⚽ Generiere Spieler & Teams...");

  const players = loadCSV("./data/spieler.csv");
  const teamsRaw = loadCSV("./data/teams.csv");

  const teams = extractTeams(teamsRaw);
  const assignedPlayers = assignPlayers(players, teams);

  // 👉 in Game State speichern (wichtig!)
  game.players = assignedPlayers;

  console.log(`✅ ${assignedPlayers.length} Spieler zugewiesen`);

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
