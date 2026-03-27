// =========================
// ⚽ MATCH ENGINE (FINAL BALANCED)
// =========================

console.log("ENGINE START");

let interval = null;

// Default Speed
window.speedMultiplier = 1;

// =========================
// 🧠 SAISON START
// =========================
function startSeason(){

  game.league.currentMatchday = 0;
  game.league.schedule = generateMatchSchedule(game.league.teams);

  addLiveEvent("📅 Saison gestartet", 0);

  game.phase = "ready";
  updateMainButton?.();
}

// =========================
// 🧠 MATCHDAY
// =========================
function simulateMatchday(){

  if(game.match?.isRunning) return;

  if(!game.team.selected){
    alert("Team wählen!");
    return;
  }

  const i = game.league.currentMatchday || 0;
  const matches = game.league.schedule[i];

  if(!matches){
    addLiveEvent("🏆 Saison beendet!", 0);
    return;
  }

  game.league.currentMatchday++;

  startConference(matches);
}

// =========================
// 📡 KONFERENZ START
// =========================
function startConference(matches){

  clearLiveEvents?.();

  game.match = {
    minute: 0,
    isRunning: true,
    halftimePlayed: false,
    currentMatches: matches.map(m => ({
      ...m,
      score: { home: 0, away: 0 }
    }))
  };

  game.phase = "live";

  window.currentMatch = game.match.currentMatches.find(m =>
    m.home === game.team.selected || m.away === game.team.selected
  );

  if(window.currentMatch){
    addLiveEvent(`🆚 ${game.team.selected} vs ${getOpponentName(window.currentMatch)}`, 0);
  }

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

  if(interval) return;

  interval = setInterval(tick, getIntervalSpeed());
}

function tick(){

  if(!game.match) return;
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
}

// 👉 angenehmeres Tempo
function getIntervalSpeed(){
  const base = 1200; // 🔥 langsamer als vorher (war 1000)
  return base / (window.speedMultiplier || 1);
}

// =========================
// ▶️ RESUME
// =========================
function resumeMatch(){

  if(!game.match) return;
  if(game.match.minute < 45) return;

  game.match.isRunning = true;
  game.phase = "live";

  addLiveEvent("▶️ 2. Halbzeit startet", game.match.minute);

  updateMainButton?.();
}

// =========================
// 🚀 SPEED (1x / 3x / 5x)
// =========================
function setSpeed(multiplier){

  if(![1,3,5].includes(multiplier)){
    console.warn("Nur 1x, 3x oder 5x erlaubt");
    return;
  }

  window.speedMultiplier = multiplier;

  console.log("⚡ Speed:", multiplier);

  restartInterval();
}

// =========================
// 🔁 INTERVAL RESET
// =========================
function restartInterval(){

  if(!interval) return;

  clearInterval(interval);
  interval = null;

  interval = setInterval(tick, getIntervalSpeed());
}

// =========================
// ⚽ MINUTE
// =========================
function simulateConferenceMinute(){

  const minute = game.match.minute;

  game.match.currentMatches.forEach(match => {

    if(Math.random() < 0.08){

      const isHome = Math.random() < 0.5;

      if(isHome){
        match.score.home++;
      } else {
        match.score.away++;
      }

      if(match.home === game.team.selected || match.away === game.team.selected){
        addLiveEvent(`⚽ ${isHome ? match.home : match.away}`, minute);
      }
    }
  });

  applyLiveTable();
}

// =========================
// 📊 LIVE TABLE
// =========================
function applyLiveTable(){

  const teams = game.league.teams;

  teams.forEach(t => {
    t._live = {
      points: t.points,
      gf: t.goalsFor,
      ga: t.goalsAgainst
    };
  });

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

  updateTable?.(true);
}

// =========================
// 🏁 ENDE
// =========================
function endConference(){

  game.match.isRunning = false;
  game.phase = "ready";

  const matches = game.match.currentMatches;

  if(!game.history) game.history = [];

  matches.forEach(match => {
    updateTableData(match);
    game.history.push(match);
  });

  updateTable?.();

  addLiveEvent("🏁 Spiel beendet", 90);

  // 🔥 FIX: Upcoming IMMER anzeigen
  const next = getNextMatch();

  if(next){
    addLiveEvent(`➡️ Nächster Gegner: ${getOpponentName(next)}`, 0);
  } else {
    addLiveEvent("🏆 Saison beendet!", 0);
  }

  updateMainButton?.();
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
// 📅 SPIELPLAN
// =========================
function generateMatchSchedule(teams){

  if(!teams || !Array.isArray(teams)) return [];

  let list = [...teams];

  if(list.length % 2 !== 0){
    list.push({ name: "SPIELFREI" });
  }

  const rounds = [];
  const n = list.length;

  for(let r = 0; r < n - 1; r++){

    const matches = [];

    for(let i = 0; i < n / 2; i++){

      const home = list[i];
      const away = list[n - 1 - i];

      if(home.name !== "SPIELFREI" && away.name !== "SPIELFREI"){
        matches.push({ home: home.name, away: away.name });
      }
    }

    rounds.push(matches);
    list.splice(1, 0, list.pop());
  }

  const reverse = rounds.map(round =>
    round.map(m => ({ home: m.away, away: m.home }))
  );

  return [...rounds, ...reverse];
}

// =========================
// 🔎 HELPER
// =========================
function getNextMatch(){

  const i = game.league.currentMatchday || 0;
  const matches = game.league.schedule[i];

  if(!matches) return null;

  return matches.find(m =>
    m.home === game.team.selected || m.away === game.team.selected
  );
}

function getOpponentName(match){
  return match.home === game.team.selected ? match.away : match.home;
}

// =========================
// 🌍 EXPORTS
// =========================
window.startSeason = startSeason;
window.simulateMatchday = simulateMatchday;
window.resumeMatch = resumeMatch;
window.setSpeed = setSpeed;

console.log("ENGINE END");
