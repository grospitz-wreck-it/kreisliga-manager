async function init(){

  console.log("🚀 Init läuft...");

  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  const startBtn = document.getElementById("startBtn");

  bindUI();
  startAdEngine();

  // =========================
  // 📦 DATEN IMMER LADEN
  // =========================
  try {

    console.log("⚽ Lade Spieler & Team-Struktur...");

    const players = await loadCSV("./data/spieler.csv");
    const leaguesRaw = await loadCSV("./data/ligen.csv");

    const leagues = extractLeagues(leaguesRaw);

    initPlayerPool(players);

    game.players = players;
    game.data = { leagues };

    // 👉 Default Liga setzen
    if (leagues.length > 0) {
      game.league = game.league || {};
      game.league.current = leagues[0];
    }

    console.log(`✅ PlayerPool: ${players.length}`);
    console.log(`✅ Ligen: ${leagues.length}`);
    console.log("👉 Current League:", game.league?.current);

  } catch (e) {
    console.warn("❌ Daten laden fehlgeschlagen:", e);
  }

  // =========================
  // 💾 SAVE LADEN
  // =========================
  const loaded = loadGame();

  console.log("💾 LOAD:", loaded);

  const hasValidSave =
    loaded &&
    loaded.league &&
    loaded.team;

  // =========================
  // ✅ FALL 1: SAVE
  // =========================
  if (hasValidSave) {

    console.log("✅ Gültiger Save geladen");

    game.phase = "idle";

    if(splash) splash.style.display = "none";
    if(app) app.style.display = "block";

    initLeagueSelect();
    populateTeamSelect(); // 🔥 wichtig

    renderSchedule();
  }

  // =========================
  // 🟡 FALL 2: SPLASH
  // =========================
  else {

    console.log("🟡 Kein gültiger Save → Splash");

    game.phase = "setup";

    if(splash) splash.style.display = "flex";
    if(app) app.style.display = "none";

    // 👉 Dropdowns initialisieren
    initLeagueSelect();
    populateTeamSelect(); // 🔥 DAS HAT GEFEHLT

    // 👉 Fallback: erstes Team setzen
    if (
      game.league?.current &&
      game.league.current.teams?.length
    ) {
      game.team = game.team || {};
      game.team.selected = game.league.current.teams[0];
    }

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
