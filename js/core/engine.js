// =========================
// 📦 IMPORTS
// =========================
import { renderSchedule, updateUI, renderLiveFeed } from "../ui/ui.js";
import { renderTable, renderLiveTable } from "../modules/table.js";
import { game } from "../core/state.js";
import { emit } from "./events.js";
import { EVENTS } from "./events.constants.js";

import {
  initMatch,
  runMatchLoop,
  simulateOtherMatches
} from "../matchEngine.js";

// =========================
// ▶️ BUTTON
// =========================
function handleMainAction(){
  if(game.phase !== "live"){
    startMatch();
  }
}

// =========================
// 🏁 START MATCH
// =========================
function startMatch(){

  console.log("🚀 Spiel wird gestartet...");

  if(game.match?.live?.running){
    console.warn("⚠️ Match läuft bereits");
    return;
  }

  if(!game.team?.selected){
    console.error("❌ Kein Team ausgewählt");
    return;
  }

  const league = game.league?.current;

  if(!league){
    console.error("❌ Keine aktive Liga");
    return;
  }

  const schedule = league.schedule;

  if(!schedule?.length){
    console.error("❌ Kein Spielplan vorhanden");
    return;
  }

  const roundIndex = league.currentRound || 0;
  const round = schedule[roundIndex];

  if(!round?.length){
    console.error("❌ Spieltag ungültig:", roundIndex);
    return;
  }

  if(!league.table || league.table.length === 0){
    console.error("❌ Tabelle fehlt");
    return;
  }

  // 👉 andere Matches simulieren
  simulateOtherMatches(round);

  // 👉 eigenes Match initialisieren
  const success = initMatch(round);

  if(!success){
    console.error("❌ Konnte Match nicht initialisieren");
    return;
  }

  game.phase = "live";

  emit(EVENTS.GAME_START);

  renderSchedule();
  renderTable();

  runMatchLoop({
    onTick: () => {
      updateUI();
      renderLiveFeed();
      renderLiveTable();
    },
    onEnd: () => {
      renderTable();
      renderSchedule();
    }
  });
}

// =========================
// 📦 EXPORTS
// =========================
export {
  startMatch,
  handleMainAction
};
