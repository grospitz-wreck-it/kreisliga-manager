// =========================
// 🌍 GLOBAL GAME STATE
// =========================
const game = {
  phase: "setup",

  league: {
    key: null,
    teams: [],
    schedule: [],
    currentRound: 0
  },

  team: {
    selected: null
  },

  match: {
    current: null
  }
};

window.game = game;

// =========================
// 📢 AD ENGINE START
// =========================
function startAdEngine(){

  console.log("📢 Ad Engine gestartet");

  setInterval(()=>{

    // 👉 falls Engine noch nicht geladen
    if(!window.serveAd) return;

    const ad = serveAd({
      league: window.currentLeagueId,
      team: window.currentTeamId,
      global: true
    });

    const track = document.getElementById("adTrack");
    if(!track) return;

    if(!ad){
      track.innerHTML = "<span style='color:white'>Keine Werbung aktiv</span>";
      return;
    }

    track.innerHTML = `
      <img src="${ad.image}" style="height:60px;object-fit:contain">
    `;

  }, 3000);
}

// =========================
// 🚀 INIT
// =========================
function init(){

  console.log("🚀 Spiel wird gestartet...");

  // Dropdowns initialisieren
  initLeagueSelect();

  // UI Events binden
  bindUI();

  // 🔥 NEU: AD ENGINE STARTEN
  startAdEngine();

  // Optional: Save laden
  if(typeof loadGame === "function"){
    const loaded = loadGame();

    if(loaded){
      console.log("💾 Save geladen");

      if(game.league.teams.length > 0){
        populateTeamSelect();
        renderSchedule();
      }
    }
  }

  game.phase = "setup";

  console.log("✅ Init fertig");
}

// =========================
// ▶️ START
// =========================
window.onload = init;
