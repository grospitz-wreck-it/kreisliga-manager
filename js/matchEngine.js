```javascript
// =========================
// ⚽ MATCH ENGINE (CLEAN + DEBUG)
// =========================
console.log("ENGINE START");
console.log("✅ matchEngine geladen");
let interval = null;

// =========================
// 🧠 MATCHDAY STARTEN
// =========================
function simulateMatchday(){

  console.log("👉 simulateMatchday gestartet");

  if(!game.team.selected){
    alert("Team wählen!");
    return;
  }

  if(!game.league.schedule || !game.league.schedule.length){
    console.error("❌ Kein Spielplan vorhanden", game.league);
    return;
  }

  const matchdayIndex = game.league.currentMatchday || 0;
  const matches = game.league.schedule[matchdayIndex];

  console.log("📅 Spieltag:", matchdayIndex, matches);

  if(!matches){
    console.warn("❌ Kein Spieltag gefunden");
    return;
  }

  game.league.currentMatchday++;

  startLiveMatch(matches);
}

// =========================
// 🎮 MATCH START
// =========================
function startLiveMatch(matches){

  console.log("🚀 startLiveMatch", matches);

  // RESET
  game.match.minute = 0;
  game.match.isRunning = true;
  game.phase = "live";

  const myMatch = matches.find(m =>
    m.home === game.team.selected || m.away === game.team.selected
  );

  if(!myMatch){
    console.error("❌ Kein eigenes Spiel gefunden", matches);
    return;
  }

  myMatch.score = { home: 0, away: 0 };
  window.currentMatch = myMatch;

  console.log("⚽ Mein Spiel:", myMatch);

  updateTeamsUI();
  updateScoreUI();
  updateProgressBar();

  startInterval();

  if(typeof updateMainButton === "function") updateMainButton();
}

// =========================
// ⏱️ INTERVAL START
// =========================
function startInterval(){

  console.log("⏱️ Interval startet");

  if(interval){
    clearInterval(interval);
  }

  interval = setInterval(() => {

    if(!game.match.isRunning){
      console.log("⏸ Interval pausiert");
      return;
    }

    game.match.minute++;

    simulateMinute();

    updateScoreUI();
    updateProgressBar();

    // HALBZEIT
    if(game.match.minute === 45){
      console.log("⏸ Halbzeit");

      game.match.isRunning = false;
      game.phase = "halftime";

      addLiveEvent("⏸ Halbzeit", 45);

      if(typeof updateMainButton === "function") updateMainButton();
      return;
    }

    // ENDE
    if(game.match.minute >= 90){
      endMatch();
    }

  }, 1000 / (window.speedMultiplier || 1));
}

// =========================
// ▶️ 2. HALBZEIT
// =========================
function resumeMatch(){

  console.log("▶️ resumeMatch");

  if(game.phase !== "halftime"){
    console.warn("❌ Resume nicht erlaubt");
    return;
  }

  game.match.isRunning = true;
  game.phase = "live";

  addLiveEvent("▶️ 2. Halbzeit startet", 45);

  startInterval();

  if(typeof updateMainButton === "function") updateMainButton();
}

// =========================
// ⏱️ MINUTE SIMULATION
// =========================
function simulateMinute(){

  const m = game.match.minute;
  const match = window.currentMatch;

  if(!match) return;

  let chance = 0.08;

  chance += Number(window.tacticModifier || 0);
  chance += Number(window.formationModifier || 0);
  chance += Number(window.liveModifier || 0);
  chance += Number(window.intensityModifier || 0);

  if(isNaN(chance)) chance = 0.08;

  // TOR
  if(Math.random() < chance){

    const isHome = Math.random() < 0.5;

    if(isHome){
      match.score.home++;
      addLiveEvent("⚽ Tor für " + match.home + "!", m);
    } else {
      match.score.away++;
      addLiveEvent("⚽ Tor für " + match.away + "!", m);
    }
  }

  // RANDOM EVENTS
  if(Math.random() < 0.05){

    const events = [
      "💥 Große Chance!",
      "🧤 Parade!",
      "🟨 Gelbe Karte",
      "📢 Fans laut!"
    ];

    const text = events[Math.floor(Math.random() * events.length)];
    addLiveEvent(text, m);
  }
}

// =========================
// 🏁 MATCH ENDE
// =========================
function endMatch(){

  console.log("🏁 Spiel beendet");

  clearInterval(interval);

  game.match.isRunning = false;
  game.phase = "ready";

  var match = window.currentMatch;
  if(!match) return;

  var text =
    match.home + " " +
    match.score.home + " - " +
    match.score.away + " " +
    match.away;

  addLiveEvent("🏁 " + text, 90);

  updateTableData(match);

  if(typeof updateTable === "function") updateTable();

  addMatchReport(match);

  if(typeof updateMainButton === "function") updateMainButton();
}
// =========================
// 📊 TABELLE UPDATEN
// =========================
function updateTableData(match){

  const home = game.league.teams.find(t => t.name === match.home);
  const away = game.league.teams.find(t => t.name === match.away);

  if(!home || !away){
    console.warn("⚠️ Team nicht gefunden", match);
    return;
  }

  home.goalsFor += match.score.home;
  home.goalsAgainst += match.score.away;

  away.goalsFor += match.score.away;
  away.goalsAgainst += match.score.home;

  home.played++;
  away.played++;

  if(match.score.home > match.score.away){
    home.points += 3;
    home.wins++;
    away.losses++;
  }
  else if(match.score.home < match.score.away){
    away.points += 3;
    away.wins++;
    home.losses++;
  }
  else{
    home.points += 1;
    away.points += 1;
    home.draws++;
    away.draws++;
  }
}

console.log("ENGINE ENDE");
