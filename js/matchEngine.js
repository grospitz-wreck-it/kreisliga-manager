// =========================
// ⚽ MATCH ENGINE (FINAL FIX)
// =========================

console.log("ENGINE START");

let interval = null;

// =========================
// 🧠 MATCHDAY
// =========================
function simulateMatchday(){

  console.log("👉 simulateMatchday");

  if(!game.team.selected){
    alert("Team wählen!");
    return;
  }

  if(!game.league.schedule || !game.league.schedule.length){
    console.error("❌ Kein Spielplan");
    return;
  }

  const i = game.league.currentMatchday || 0;
  const matches = game.league.schedule[i];

  if(!matches){
    console.warn("❌ Kein Spieltag");
    return;
    startConference(matches);
  }

  game.league.currentMatchday++;
  startLiveMatch(matches);
}

// =========================
// 🎮 START
// =========================
function startLiveMatch(matches){
  clearLiveEvents?.();
  console.log("🚀 startLiveMatch");
  game.match.halftimePlayed = false;
  game.match.minute = 0;
  game.match.isRunning = true;
  game.phase = "live";

  const myMatch = matches.find(m =>
    m.home === game.team.selected || m.away === game.team.selected
  );

  if(!myMatch){
    console.error("❌ Kein eigenes Spiel");
    return;
  }

  myMatch.score = { home: 0, away: 0 };
  game.match.currentMatches = []

  updateTeamsUI();
  updateScoreUI();
  updateProgressBar();

  startInterval();
  updateMainButton?.();
}

// =========================
// ⏱️ INTERVAL
// =========================
function startInterval(){

  console.log("⏱️ Interval");

  if(interval) clearInterval(interval);

  interval = setInterval(() => {

    if(!game.match.isRunning) return;

    game.match.minute++;

    simulateMinute();
    updateScoreUI();
    updateProgressBar();

    if(game.match.minute === 45 && !game.match.halftimePlayed){

  game.match.halftimePlayed = true;

  game.match.isRunning = false;
  game.phase = "halftime";

  addLiveEvent("⏸ Halbzeit", 45);

  updateMainButton?.();
  return;
}

    if(game.match.minute >= 90){
      endMatch();
    }

  }, 1000 / (window.speedMultiplier || 1));
}
// =========================
// 🔁 INTERVAL NEUSTARTEN
// =========================
function restartInterval(){

  console.log("🔁 restartInterval");

  // nur neu starten, wenn Spiel läuft
  if(!game.match || !game.match.isRunning){
    console.warn("⏸ kein laufendes Spiel");
    return;
  }

  // aktuellen Interval killen
  if(interval){
    clearInterval(interval);
  }

  // neu starten mit aktueller Geschwindigkeit
  startInterval();
}
// =========================
// ▶️ RESUME
// =========================
function resumeMatch(){

  console.log("▶️ resumeMatch", game.phase);

  if(!game.match){
    console.warn("kein match");
    return;
  }

  // 🔥 alten Interval IMMER killen
  if(interval){
    clearInterval(interval);
    interval = null;
  }

  game.match.isRunning = true;
  game.phase = "live";

  addLiveEvent("▶️ 2. Halbzeit startet", 45);

  startInterval();

  updateMainButton?.();
}

// =========================
// ⚽ MINUTE
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

  if(Math.random() < chance){
    if(Math.random() < 0.5){
      match.score.home++;
      addLiveEvent("⚽ " + match.home, m);
    } else {
      match.score.away++;
      addLiveEvent("⚽ " + match.away, m);
    }
  }
}

// =========================
// 🏁 ENDE
// =========================
function endMatch(){

  console.log("🏁 Ende");

  clearInterval(interval);

  game.match.isRunning = false;
  game.phase = "ready";

  const m = window.currentMatch;
  if(!m) return;

  addLiveEvent(
    "🏁 " + m.home + " " + m.score.home +
    " - " + m.score.away + " " + m.away,
    90
  );

  updateTableData(m);
  updateTable?.();
  addMatchReport(m);

  updateMainButton?.();
}

// =========================
// 📊 TABLE
// =========================
function updateTableData(match){

  const home = game.league.teams.find(t => t.name === match.home);
  const away = game.league.teams.find(t => t.name === match.away);

  if(!home || !away){
    console.warn("⚠️ Team fehlt");
    return;
  }

  home.played++;
  away.played++;

  home.goalsFor += match.score.home;
  home.goalsAgainst += match.score.away;

  away.goalsFor += match.score.away;
  away.goalsAgainst += match.score.home;

  if(match.score.home > match.score.away){
    home.points += 3;
  } else if(match.score.home < match.score.away){
    away.points += 3;
  } else {
    home.points++;
    away.points++;
  }
}
// =========================
// 🌍 GLOBAL EXPORTS
// =========================
window.simulateMatchday = simulateMatchday;
window.startLiveMatch = startLiveMatch;
window.resumeMatch = resumeMatch;
window.restartInterval = restartInterval; // 🔥 DAS IST DER WICHTIGE
console.log("ENGINE END");
window.restartInterval = restartInterval;
