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

  console.log("📢 Ad Engine startet...");

  const track = document.getElementById("adTrack");
  if(!track){
    console.warn("❌ adTrack fehlt");
    return;
  }

  // 🔥 WARTE BIS ADS READY
  const waitForAds = setInterval(() => {

    if(typeof window.serveAd === "function"){
      clearInterval(waitForAds);
      console.log("✅ Ads geladen → starte Rotation");
      runAds();
    } else {
      console.log("⏳ warte auf Ads...");
    }

  }, 300);

  function runAds(){

    setInterval(() => {

      const ads = window.serveAd(); // jetzt safe

      if(!ads || !ads.length){
        track.innerHTML = "<span style='color:white'>Keine Werbung aktiv</span>";
        return;
      }

      // 🔥 DUPLICATE für smooth scroll
      const loopAds = [...ads, ...ads];

      track.innerHTML = `
        <div class="ads">
          ${loopAds.map(ad => `
            <div class="adItem">
              ${ad.link ? `<a href="${ad.link}" target="_blank">` : ""}
                <img src="${ad.image}">
              ${ad.link ? `</a>` : ""}
            </div>
          `).join("")}
        </div>
      `;

    }, 8000); // langsamer = hochwertiger
  }
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
