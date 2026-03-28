window.game = {

  // =========================
  // 📦 META
  // =========================
  meta: {
    version: 2,
    lastSaved: null
  },


  // =========================
  // 👤 PLAYER
  // =========================
  player: {
    id: null,
    name: null,

    stats: {
      matches: 0,
      wins: 0,
      draws: 0,
      losses: 0
    }
  },


  // =========================
  // 🏆 LEAGUE
  // =========================
  league: {
    key: null,
    name: null,

    teams: [],        // [{ name, points, goalsFor, ... }]
    schedule: [],     // Spieltage
    currentMatchday: 0,

    size: 0           // Skalierung später (z.B. 16, 18 Teams)
  },


  // =========================
  // ⚽ USER TEAM
  // =========================
  team: {
    id: null,
    selected: null,   // 🔥 wichtig (Name des Teams)

    players: [
      // vorbereitet für später
      // {
      //   id: 1,
      //   name: "Max Müller",
      //   position: "ST",
      //   strength: 60,
      //   form: 1.0
      // }
    ],

    tactics: {
      style: "balanced",   // offensive | defensive | balanced
      pressing: 1,         // 1-3
      formation: "4-4-2"
    }
  },


  // =========================
  // 🎮 MATCH
  // =========================
  match: {

    current: null,   // wird von engine gesetzt

    history: [],     // spätere Spielhistorie

    stats: {
      shots: 0,
      fouls: 0,
      cards: 0
    }
  },


  // =========================
  // ⚙️ SETTINGS
  // =========================
  settings: {
    speed: 1   // 1x, 3x, 5x
  },


  // =========================
  // 🔄 GAME FLOW
  // =========================
  phase: "setup"
  // setup
  // ready
  // live
  // halftime
  // finished
};
