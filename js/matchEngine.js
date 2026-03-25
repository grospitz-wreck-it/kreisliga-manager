// =========================
// ⚽ MATCH ENGINE (LIVE TABLE VERSION)
// =========================

console.log("ENGINE START");

let interval = null;

// =========================
// 🧠 MATCHDAY
// =========================
function simulateMatchday(){

  if(!game.team.selected){
    alert("Team wählen!");
    return;
  }

  const i = game.league.currentMatchday || 0;
  const matches = game.league.schedule[i];

  if(!matches) return;

  game.league.currentMatchday++;

  startConference(matches);
}

// =========================
// 📡 KONFERENZ START
// =========================
function startConference(matches){

  clearLiveEvents?.();

  if(interval){
    clearInterval(interval);
    interval = null;
  }

  game.match.minute = 0;
  game.match.isRunning = true;
  game.match.halftimePlayed = false;
  game.phase = "live";

  // Spiele initialisieren
  game.match.currentMatches = matches.map(m => ({
    ...m,
    score: { home: 0, away: 0 }
  }));

  // dein Spiel
  window.currentMatch = game.match.currentMatches.find(m =>
    m.home === game.team.selected || m.away === game.team.selected
  );

  // Anzeige
  updateTeamsUI?.();
  updateScoreUI?.();
  updateProgressBar?.();

  startConferenceInterval();
  updateMainButton?.();
}

// =========================
// ⏱️ INTERVAL
// =========================
function startConferenceInterval(){

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

      addLiveEvent("⏸ Halbzeit", 45);
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
// ⚽ MINUTE (KONFERENZ)
// =========================
function simulateConferenceMinute(){

  const minute = game.match.minute;

  game.match.currentMatches.forEach(match => {

    let chance = 0.08;

    if(Math.random() < chance){

      const isHome = Math.random() < 0.5;

      if(isHome){
        match.score.home++;
      } else {
        match.score.away++;
      }

      // 🔥 NUR dein Spiel bekommt Events
      if(match.home === game.team.selected || match.away === game.team.selected){

        if(isHome){
          addLiveEvent(`⚽ ${match.home}`, minute);
        } else {
          addLiveEvent(`⚽ ${match.away}`, minute);
        }
      }
    }
  });

  // 🔥 LIVE TABELLE
  applyLiveTable();
}

// =========================
// 📊 LIVE TABLE BERECHNEN
// =========================
function applyLiveTable(){

  const teams = game.league.teams;

  // reset
  teams.forEach(t => {
    t._live = {
      points: t.points,
      gf: t.goalsFor,
      ga: t.goalsAgainst
    };
  });

  // laufende spiele einrechnen
  game.match.currentMatches.forEach(match => {

    const home = teams.find(t => t.name === match.home);
    const away = teams.find(t => t.name === match.away);

    if(!home || !away) return;

    home._live.gf += match.score.home;
    home._live.ga += match.score.away;

    away._live.gf += match.score.away;
    away._live.ga += match.score.home;

    if(match.score.home > match.score.away){
      home._live.points += 3;
    } else if(match.score.home < match.score.away){
      away._live.points += 3;
    } else {
      home._live.points += 1;
      away._live.points += 1;
    }
  });

  // 👉 UI triggern
  updateTable?.(true); // true = live mode
}

// =========================
// 🏁 ENDE
// =========================
function endConference(){

  clearInterval(interval);

  game.match.isRunning = false;
  game.phase = "ready";

  const matches = game.match.currentMatches;

  matches.forEach(match => {
    updateTableData(match);
  });

  updateTable?.();

  addLiveEvent("🏁 Spiel beendet", 90);

  updateMainButton?.();
}

// =========================
// ▶️ RESUME
// =========================
function resumeMatch(){

  if(interval){
    clearInterval(interval);
    interval = null;
  }

  game.match.isRunning = true;
  game.phase = "live";

  addLiveEvent("▶️ 2. Halbzeit", 45);

  startConferenceInterval();
  updateMainButton?.();
}

// =========================
// 🔁 SPEED
// =========================
function restartInterval(){

  if(!game.match?.isRunning) return;

  if(interval) clearInterval(interval);

  startConferenceInterval();
}

// =========================
// 📊 TABLE FINAL
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
