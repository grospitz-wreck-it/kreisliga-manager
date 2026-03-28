const STORAGE_KEY = "kreisliga_save";

// =========================
// 💾 SAVE
// =========================
async function saveGame(){

  try {
    const data = {
      game,
      matchState
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
async function loadGame(){

  try {

    const raw = localStorage.getItem(STORAGE_KEY);

    if(!raw){
      console.log("ℹ️ Kein Save gefunden");
      return false;
    }

    const data = JSON.parse(raw);

    if(data.game){
      Object.assign(game, data.game);
    }

    if(data.matchState){
      Object.assign(matchState, data.matchState);
    }
    if((!game.league.schedule || game.league.schedule.length === 0) 
   && game.league.teams?.length){

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
// 🌍 EXPORT
// =========================
window.saveGame = saveGame;
window.loadGame = loadGame;
window.clearSave = clearSave;
