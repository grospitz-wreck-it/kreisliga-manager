// =========================
// 🔗 UI BINDINGS
// =========================
import {
  selectTeam,
  getSelectedTeam,
  initLeagueSelect
} from "../modules/league.js";

import { handleMainAction } from "../core/engine.js";
import { setPlayerName } from "../modules/player.js";
import { renderApp } from "./layout.js";

import { saveGame, loadGame, clearSave } from "../services/storage.js";
import { renderSchedule } from "./ui.js";

import { game } from "../core/state.js";

// =========================
// 🧠 BINDINGS
// =========================
function bindUI(){

  const teamSelect = document.getElementById("teamSelect");
  const button = document.getElementById("mainButton");
  const tacticSelect = document.getElementById("tacticSelect");

  const startBtn = document.getElementById("startBtn");
  const burger = document.getElementById("burger");

  const saveBtn = document.getElementById("saveBtn");
  const loadBtn = document.getElementById("loadBtn");
  const resetBtn = document.getElementById("resetBtn");

  // =========================
  // 👕 TEAM WÄHLEN
  // =========================
  if(teamSelect){
    teamSelect.onchange = (e) => {
      selectTeam(e.target.value);
    };
  }

  // =========================
  // ▶️ MAIN BUTTON
  // =========================
  if(button){
    button.onclick = () => {
      handleMainAction();
    };
  }

  // =========================
  // 🧠 TAKTIK
  // =========================
  if(tacticSelect){
    tacticSelect.onchange = (e) => {

      const team = getSelectedTeam();

      if(!team){
        console.warn("❌ Kein Team ausgewählt");
        return;
      }

      team.tactic = e.target.value;

      console.log("🧠 Neue Taktik:", team.tactic);
    };
  }

  // =========================
  // 🟡 SPLASH START
  // =========================
  if(startBtn){
    startBtn.onclick = () => {

      const input = document.getElementById("nameInput");
      if(!input) return;

      const success = setPlayerName(input.value);

      if(!success){
        alert("Bitte gültigen Namen eingeben");
        return;
      }

      console.log("🎮 Spiel gestartet");

      game.phase = "idle";

      const splash = document.getElementById("splash");
      const app = document.getElementById("app");

      if(splash) splash.style.display = "none";
      if(app) app.style.display = "block";

      renderApp();
    };
  }

  // =========================
  // 🍔 BURGER MENU
  // =========================
  if(burger){
    burger.onclick = () => {
      const sidebar = document.getElementById("sidebar");
      if(sidebar){
        sidebar.classList.toggle("open");
      }
    };
  }

  // =========================
  // 💾 SAVE
  // =========================
  if(saveBtn){
    saveBtn.onclick = () => {
      saveGame();
      console.log("💾 Spiel gespeichert");
    };
  }

  // =========================
  // 📂 LOAD
  // =========================
  if(loadBtn){
    loadBtn.onclick = () => {

      const loaded = loadGame();

      if(!loaded){
        alert("Kein Save gefunden");
        return;
      }

      console.log("📂 Save geladen");

      game.phase = "idle";

      const splash = document.getElementById("splash");
      const app = document.getElementById("app");

      if(splash) splash.style.display = "none";
      if(app) app.style.display = "block";

      renderApp();

      // 👉 wichtig: UI neu aufbauen
      initLeagueSelect();
      renderSchedule();
    };
  }

  // =========================
  // 🗑 RESET
  // =========================
  if(resetBtn){
    resetBtn.onclick = () => {

      if(confirm("Spielstand wirklich löschen?")){
        clearSave();
        location.reload();
      }
    };
  }
}

// =========================
// 📦 EXPORT
// =========================
export { bindUI };
