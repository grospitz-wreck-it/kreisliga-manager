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

    teams: [],       // Team-Objekte
    schedule: [],    // Spielplan
    currentRound: 0, // aktueller Spieltag

    table: []        // Tabelle (separat von teams!)
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

  // 🔥 NEU (Live Daten)
  live: {
    minute: 0,
    running: false,
    score: { home: 0, away: 0 },
    events: []
  }
},

  // =========================
// 📡 EVENTS (NEU)
// =========================
events: {
  history: [],   // alle Events (für Replay / Debug)
  last: null     // letztes Event
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
// 🧪 DEBUG HELPER (optional)
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
  game.phase = "setup";
  game.season.year = 1;

  console.log("🧹 Game komplett zurückgesetzt");
};
// =========================
// ⚙️ SETTINGS (NEU)
// =========================
settings: {
  sound: true,
  notifications: true
},
