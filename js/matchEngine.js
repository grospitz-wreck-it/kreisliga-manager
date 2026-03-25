// =========================
// ⚽ MATCH ENGINE (CLEAN FINAL)
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
  }

  game.league.currentMatchday++;

  startConference(matches); // 🔥 IMMER KONFERENZ
}

// =========================
// 📡 KONFERENZ START
// =========================
function startConference(matches){

  console.log("📡 Konferenz startet", matches);

  clearLiveEvents?.();

  // Begegnungen anzeigen
  matches.forEach(m => {

    if(m.home === game.team.selected || m.away === game.team.selected){
      addLiveEvent(`🔥 DEIN SPIEL: ${m.home} vs ${m.away}`, 0);
    } else {
      addLiveEvent(`📢 ${m.home} vs ${m.away}`, 0);
    }

  });

  if(interval){
    clearInterval(interval);
    interval = null;
  }

  game.match.minute = 0;
  game.match.isRunning = true;
  game.match.halftimePlayed = false;
  game.phase = "live";

  game.match.currentMatches = matches.map(m => ({
    ...m,
    score: { home: 0, away: 0 }
  }));

  window.currentMatch = game.match.currentMatches.find(m =>
    m.home === game.team.selected || m.away === game.team.selected
  );

  updateTeamsUI?.();
  updateScoreUI?.();
  updateProgressBar?.();

  startConferenceInterval();
  updateMainButton?.();
}

// =========================
// ⏱️ KONFERENZ INTERVAL
// =========================
function startConferenceInterval(){

  console.log("⏱️ Konferenz Interval");

  if(interval) clearInterval(interval);

  interval = setInterval(() => {

    if(!game.match.isRunning) return;

    game.match.minute++;

    simulateConferenceMinute();

    updateScoreUI?.();
    updateProgressBar?.();

    // Halbzeit
    if(game.match.minute === 45 && !game.match.halftimePlayed){

      game.match.halftimePlayed = true;
      game.match.isRunning = false;
      game.phase = "halftime";

      addLiveEvent("⏸ Halbzeit (alle Spiele)", 45);
      updateMainButton?.();
      return;
    }

    // Ende
    if(game.match.minute >= 90){
      endConference();
    }

  }, 1000 / (window.speedMultiplier || 1));
}

// =========================
// ⚽ MINUTE (ALLE SPIELE)
// =========================
function simulateConferenceMinute(){

  const minute = game.match.minute;

  game.match.currentMatches.forEach(match => {

    let chance = 0.08;

    if(Math.random() < chance){

      if(Math.random() < 0.5){
        match.score.home++;
        addLiveEvent(`⚽ ${match.home} (${match.score.home})`, minute);
      } else {
        match.score.away++;
        addLiveEvent(`⚽ ${match.away} (${match.score.away})`, minute);
      }
    }
  });
}

// =========================
// 🏁 KONFERENZ ENDE
// =========================
function endConference(){

  console.log("🏁 Konferenz Ende");

  clearInterval(interval);

  game.match.isRunning = false;
  game.phase = "ready";

  const matches = game.match.currentMatches;

  matches.forEach(match => {
    updateTableData(match);
  });

  updateTable?.();

  addLiveEvent("🏁 Spieltag beendet", 90);

  updateMainButton?.();
}

// =========================
// ▶️ RESUME (FIXED!)
// =========================
function resumeMatch(){

  console.log("▶️ resumeMatch");

  if(!game.match) return;

  if(interval){
    clearInterval(interval);
    interval = null;
  }

  game.match.isRunning = true;
  game.phase = "live";

  addLiveEvent("▶️ 2. Halbzeit startet", 45);

  // 🔥 IMMER KONFERENZ
  startConferenceInterval();

  updateMainButton?.();
}

// =========================
// 🔁 SPEED FIX (WICHTIG)
// =========================
function restartInterval(){

  console.log("🔁 restartInterval");

  if(!game.match || !game.match.isRunning){
    console.warn("⏸ kein laufendes Spiel");
    return;
  }

  if(interval){
    clearInterval(interval);
  }

  // 🔥 erkennt automatisch Modus
  if(game.match.currentMatches && game.match.currentMatches.length > 0){
    startConferenceInterval();
  } else {
    startInterval();
  }
}

// =========================
// 📊 TABLE UPDATE
// =========================
function updateTableData(match){

  const home = game.league.teams.find(t => t.name === match.home);
  const away = game.league.teams.find(t => t.name === match.away);

  if(!home || !away) return;

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
// 🌍 EXPORTS
// =========================
window.simulateMatchday = simulateMatchday;
window.resumeMatch = resumeMatch;
window.restartInterval = restartInterval;

console.log("ENGINE END");
