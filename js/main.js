// =========================
// 📦 CORE
// =========================
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

// 👉 UI vorbereiten
initLeagueSelect();
bindUI();

// 👉 Ads starten
startAdEngine();

// 👉 Save laden
const loaded = loadGame();

if(loaded){
console.log("💾 Save geladen");
  
if(game.league.teams.length > 0){
  populateTeamSelect();
  renderSchedule();
}

}

// 👉 Phase setzen
game.phase = "setup";

console.log("✅ Init fertig");
}

// =========================
// ▶️ START
// =========================
window.addEventListener("load", init);

// =========================
// 📦 OPTIONAL EXPORTS
// =========================
export {
init,
handleMainAction
};
