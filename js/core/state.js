// =========================
// 🌍 GLOBAL GAME STATE
// =========================
window.game = {

  // =========================
  // 👤 SPIELER
  // =========================
  player: {
    name: ""
  },

  // =========================
  // 🏆 LIGA
  // =========================
  league: {
    key: null,

    teams: [],
    schedule: [],
    currentRound: 0,

    table: []
  },

  // =========================
  // 👕 DEIN TEAM
  // =========================
  team: {
    selected: null
  },

  // =========================
  // ⚽ MATCH
  // =========================
  match: {
    current: null,

    // 🔥 LIVE STATE
    live: {
      minute: 0,
      running: false,
      score: { home: 0, away: 0 },
      events: []
    }
  },

  // =========================
  // 📡 EVENTS
  // =========================
  events: {
    history: [],
    last: null
  },

  // =========================
  // ⚙️ SETTINGS
  // =========================
  settings: {
    sound: true,
    notifications: true
  },

  // =========================
  // 🌐 ONLINE (PREP)
  // =========================
  online: {
    leagueId: null,
    playerId: null,
    connected: false
  },

  // =========================
  // 🏁 SPIELPHASE
  // =========================
  phase: "setup", // setup | idle | live

  // =========================
  // 📅 SAISON
  // =========================
  season: {
    year: 1
  }
};

// =========================
// 🧪 DEBUG HELPER
// =========================
window.resetGame = function(){

  localStorage.clear();

  game.player.name = "";

  game.league = {
    key: null,
    teams: [],
    schedule: [],
    currentRound: 0,
    table: []
  };

  game.team.selected = null;

  game.match.current = null;

  // 🔥 wichtig: live reset
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
};
