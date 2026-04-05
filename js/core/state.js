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
game.data.events = [];
game.data.campaigns = [];

game.events.active = [];
game.events.cooldowns = {};
game.events.triggeredCount = 0;

game.ads.active = [];
game.ads.impressions = {};
game.ads.clicks = {};
game.ads.last = null;

game.analytics = {
  eventsTriggered: 0,
  adsSeen: 0,
  clicks: 0,
  sessionStart: Date.now(),
  playtime: 0
};
