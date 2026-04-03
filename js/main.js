// =========================
// 📦 CORE
// =========================
import "./core/state.js";
import "./core/events.js";
import "./core/events.constants.js";
import "./core/eventStore.js";

// =========================
// 🔧 MODULES
// =========================
import "./modules/ads.js";
import "./modules/scheduler.js";
import "./modules/table.js";
import { initLeagueSelect, populateTeamSelect } from "./modules/league.js";

// =========================
// 🎮 ENGINE
// =========================
import { handleMainAction } from "./core/engine.js";

// =========================
// 🖥 UI
// =========================
import { bindUI } from "./ui/bindings.js";
import { renderSchedule } from "./ui/ui.js";

// =========================
// 📢 ADS START
// =========================
function startAds(){

if(typeof window.startAdEngine === "function"){
console.log("✅ Ads starten direkt");
window.startAdEngine();
} else {
console.warn("❌ startAdEngine nicht gefunden");
}

}

// =========================
// 🚀 INIT
// =========================
function init(){

console.log("🚀 Init läuft...");

initLeagueSelect();
bindUI();

startAds();

if(typeof window.loadGame === "function"){

```
const loaded = window.loadGame();

if(loaded){
  console.log("💾 Save geladen");

  if(window.game.league.teams.length > 0){
    populateTeamSelect();
    renderSchedule();
  }
}
```

}

window.game.phase = "setup";

console.log("✅ Init fertig");
}

// =========================
// ▶️ START
// =========================
window.addEventListener("load", init);
