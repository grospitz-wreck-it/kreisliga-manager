window.game = {

  meta: {
    version: 1
  },

  player: {
    name: null,
    id: null
  },

  league: {
    key: null,
    name: null,
    teams: [],
    schedule: [],
    currentMatchday: 0
  },

  team: {
    id: null,
    name: null,
    players: []
  },

  match: {
    current: null
  },

  settings: {
    speed: 1
  },

  phase: "setup" // setup | ready | live | halftime | fulltime
};
