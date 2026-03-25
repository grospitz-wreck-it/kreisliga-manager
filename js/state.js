// =========================
// 💾 GLOBAL GAME STATE
// =========================
console.log("STATE START");
window.game = {
  player: {
    id: localStorage.getItem("playerId") || crypto.randomUUID(),
    name: localStorage.getItem("playerName") || null
  },
  league: {
    key: localStorage.getItem("selectedLeague") || null,
    teams: [],
    schedule: [],
    currentMatchday: 0
  },
  team: {
    selected: localStorage.getItem("selectedTeam") || null
  },
  match: {
    isRunning: false,
    minute: 0,
    score: null
  },
  settings: {
    speed: 1,
    tactic: "Normal",
    formation: "4-4-2",
    intensity: 2
  }
};
var game = {
  player: {
    id: null,
    name: "",
    team: null
  },
  league: {
    key: null,
    teams: [],
    schedule: [],
    currentMatchday: 0
  },
  match: {
    running: false,
    minute: 0
  }
};
// =========================
// 💾 SAVE
// =========================
function saveGameState(){
  localStorage.setItem("gameState", JSON.stringify(game));
}

// =========================
// 📥 LOAD
// =========================
function loadGameState(){

  const saved = localStorage.getItem("gameState");
  if(!saved) return;

  try{
    const parsed = JSON.parse(saved);

    Object.assign(game, parsed);

    console.log("💾 Game geladen");
  }catch(e){
    console.error("Load Fehler", e);
  }
}
