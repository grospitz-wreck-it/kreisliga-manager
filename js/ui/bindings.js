// =========================
// 🔗 UI BINDINGS
// =========================
import {
selectLeague,
selectTeam,
getSelectedTeam,
initLeagueSelect,
populateTeamSelect
} from "../modules/league.js";

import { handleMainAction } from "../core/engine.js";
import { setPlayerName } from "../modules/player.js";
import { renderApp } from "./layout.js";

import { saveGame, loadGame, clearSave } from "../services/storage.js";
import { renderSchedule } from "./ui.js";

import { game } from "../core/state.js";

function bindUI(){

const leagueSelect = document.getElementById("leagueSelect");
const teamSelect = document.getElementById("teamSelect");
const button = document.getElementById("mainButton");
const tacticSelect = document.getElementById("tacticSelect");

const startBtn = document.getElementById("startBtn");
const burger = document.getElementById("burger");

const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const resetBtn = document.getElementById("resetBtn");

// =========================
// 🏆 Liga wählen
// =========================
if(leagueSelect){
leagueSelect.addEventListener("change", (e) => {
selectLeague(e.target.value);
populateTeamSelect(); // 🔥 wichtig
});
}

// =========================
// 👕 Team wählen
// =========================
if(teamSelect){
teamSelect.addEventListener("change", (e) => {
selectTeam(e.target.value);
});
}

// =========================
// ▶️ Spiel starten
// =========================
if(button){
button.addEventListener("click", () => {
handleMainAction();
});
}

// =========================
// 🧠 Taktik ändern
// =========================
if(tacticSelect){
tacticSelect.addEventListener("change", (e) => {


  const team = getSelectedTeam();

  if(!team){
    console.warn("❌ Kein Team ausgewählt");
    return;
  }

  team.tactic = e.target.value;

  console.log("🧠 Neue Taktik:", team.tactic);
});


}

// =========================
// 🟡 SPLASH START
// =========================
if(startBtn){
startBtn.addEventListener("click", () => {


  const input = document.getElementById("nameInput");
  if(!input) return;

  setPlayerName(input.value);

  game.phase = "idle";

  renderApp();

  // 🔥 NACH SPLASH UI INITIALISIEREN
  initLeagueSelect();
});


}

// =========================
// 🍔 BURGER MENU
// =========================
if(burger){
burger.addEventListener("click", () => {
const sidebar = document.getElementById("sidebar");
if(sidebar){
sidebar.classList.toggle("open");
}
});
}

// =========================
// 💾 SAVE
// =========================
if(saveBtn){
saveBtn.addEventListener("click", () => {
saveGame();
});
}

// =========================
// 📂 LOAD
// =========================
if(loadBtn){
loadBtn.addEventListener("click", () => {

  const loaded = loadGame();

  if(loaded){
    game.phase = "idle";

    renderApp();

    // 🔥 UI wiederherstellen
    initLeagueSelect();

    if(game.league.teams?.length){
      populateTeamSelect();
      renderSchedule();
    }
  }
});


}

// =========================
// 🗑 RESET
// =========================
if(resetBtn){
resetBtn.addEventListener("click", () => {
clearSave();
location.reload();
});
}
}

// =========================
// 📦 EXPORT
// =========================
export { bindUI };
