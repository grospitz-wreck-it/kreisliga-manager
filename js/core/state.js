
* =========================
* 🌍 GLOBAL GAME STATE (MODULE)
* =========================
  */

const game = {

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
currentMatchIndex: 0,

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
