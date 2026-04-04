async function init(){

  console.log("🚀 Init läuft...");

  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  const startBtn = document.getElementById("startBtn");

  bindUI();
  startAdEngine();

  // =========================
  // 📦 DATEN IMMER LADEN (WICHTIG)
  // =========================
  try {

    console.log("⚽ Lade Spieler & Team-Struktur...");

    const players = await loadCSV("./data/spieler.csv");
    const leaguesRaw = await loadCSV("./data/ligen.csv");

    const leagues = extractLeagues(leaguesRaw);

    initPlayerPool(players);

    game.players = players;
    game.data = { leagues };

    if (leagues.length > 0) {
      game.league = game.league || {};
      game.league.current = leagues[0];
    }

    console.log(`✅ PlayerPool: ${players.length}`);
    console.log(`✅ Ligen: ${leagues.length}`);

  } catch (e) {
    console.warn("❌ Daten laden fehlgeschlagen:", e);
  }

  // =========================
  // 💾 SAVE LADEN (NACH DATEN!)
  // =========================
  const loaded = loadGame();

  console.log("💾 LOAD:", loaded);

  const hasValidSave =
    loaded &&
    loaded.league &&
    loaded.team;

  // =========================
  // ✅ FALL 1: VALIDER SAVE
  // =========================
  if (hasValidSave) {

    console.log("✅ Gültiger Save geladen");

    game.phase = "idle";

    if(splash) splash.style.display = "none";
    if(app) app.style.display = "block";

    initLeagueSelect();
    populateTeamSelect();
    renderSchedule();

  }

  // =========================
  // 🟡 FALL 2: KEIN SAVE → SPLASH
  // =========================
  else {

    console.log("🟡 Kein gültiger Save → Splash");

    game.phase = "setup";

    if(splash) splash.style.display = "flex";
    if(app) app.style.display = "none";

    initLeagueSelect();

    if(startBtn){
      startBtn.onclick = () => {

        if(!game.league?.current){
          alert("Bitte Liga wählen");
          return;
        }

        if(!game.team?.selected){
          alert("Bitte Team wählen");
          return;
        }

        console.log("🎮 Spiel gestartet");

        splash.style.display = "none";
        app.style.display = "block";

        game.phase = "idle";
      };
    }
  }

  // =========================
  // 🎨 UI RENDER
  // =========================
  renderApp();

  console.log("✅ Init fertig");
}
