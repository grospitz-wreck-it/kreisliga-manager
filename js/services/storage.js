// =========================
// 💾 STORAGE MODULE
// =========================
import { game } from "../core/state.js";
import { generateSchedule } from "../modules/scheduler.js";

const STORAGE_KEY = "kreisliga_save";

// =========================
// 💾 SAVE
// =========================
function saveGame(){

try {


const data = {
  game
};

localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify(data)
);

console.log("✅ Spiel gespeichert");


} catch(e){
console.error("❌ Save Fehler", e);
}
}

// =========================
// 📂 LOAD
// =========================
function loadGame(){

try {


const raw = localStorage.getItem(STORAGE_KEY);

if(!raw){
  console.log("ℹ️ Kein Save gefunden");
  return false;
}

const data = JSON.parse(raw);

// 👉 GAME STATE
if(data.game){
  Object.assign(game, data.game);
}


// 👉 FALLBACK: Spielplan fehlt
if(
  (!game.league.schedule || game.league.schedule.length === 0) &&
  game.league.teams?.length
){
  console.warn("⚠️ Kein Spielplan im Save → neu generieren");
  generateSchedule();
}

console.log("✅ Spiel geladen");

return true;


} catch(e){
console.error("❌ Load Fehler", e);
return false;
}
}

// =========================
// 🗑 DELETE
// =========================
function clearSave(){
localStorage.removeItem(STORAGE_KEY);
console.log("🗑 Save gelöscht");
}

// =========================
// 📦 EXPORTS
// =========================
export {
saveGame,
loadGame,
clearSave
};
