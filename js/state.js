// =========================
// 🌍 GLOBAL APP STATE
// =========================

window.app = window.app || {};

app.state = {

  player: {
    name: localStorage.getItem("playerName") || ""
  },

  league: {
    key: null,
    teams: [],
    schedule: [],
    currentMatchday: 0
  },

  team: {
    selected: null
  },

  match: {
    minute: 0,
    isRunning: false,
    data: null
  },

  phase: "idle",

  speed: 1

};
