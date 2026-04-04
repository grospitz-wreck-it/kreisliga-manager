// =========================
// 🌍 GLOBAL GAME STATE
// =========================
const game = {

  player: {
    name: ""
  },

  // =========================
  // 🏆 LIGA (NEU STRUKTURIERT)
  // =========================
  league: {
    current: null,            // ✅ aktive Liga
    schedule: [],
    currentRound: 0,
    currentMatchIndex: 0
  },

  // =========================
  // 📚 ALLE DATEN
  // =========================
  data: {
    leagues: []
  },

  team: {
    selected: null
  },

  match: {
    current: null,
    live: {
      minute: 0,
      running: false,
      score: { home: 0, away: 0 },
      events: []
    }
  },

  events: {
    history: [],
    last: null
  },

  settings: {
    sound: true,
    notifications: true
  },

  online: {
    leagueId: null,
    playerId: null,
    connected: false
  },

  phase: "setup",

  season: {
    year: 1
  }
};

// =========================
// 🧹 RESET GAME
// =========================
function resetGame(){

localStorage.clear();

game.player.name = "";

game.league = {
key: null,
teams: [],
schedule: [],
currentRound: 0,
currentMatchIndex: 0,
table: []
};

game.team.selected = null;

game.match.current = null;

game.match.live = {
minute: 0,
running: false,
score: { home: 0, away: 0 },
events: []
};

game.events.history = [];
game.events.last = null;

game.phase = "setup";
game.season.year = 1;

console.log("🧹 Game komplett zurückgesetzt");
}

// =========================
// 📦 EXPORTS
// =========================
export {
game,
resetGame
};
