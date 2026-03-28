// =========================
// 🌍 MATCH STATE
// =========================
const matchState = {
  minute: 0,
  running: false,
  score: { home: 0, away: 0 },
  events: [],
};

// =========================
// ▶️ BUTTON
// =========================
function handleMainAction(){
  if(game.phase !== "live"){
    startMatch();
  }
}

// =========================
// 🏁 START MATCH
// =========================
function startMatch(){

  console.log("🚀 Spiel wird gestartet...");

  const round = game.league.schedule?.[game.league.currentRound];

  if(!round){
    console.warn("❌ Kein Spieltag gefunden");
    return;
  }

  // 🔥 RESET STATE
  matchState.minute = 0;
  matchState.running = true;
  matchState.score = { home: 0, away: 0 };
  matchState.events = [];

  let playerMatch = null;

  round.forEach(match => {

    // 👉 WICHTIG: gleiche Objekte vergleichen!
    const isPlayerMatch =
      match.home === game.team.selected ||
      match.away === game.team.selected;

    if(isPlayerMatch){
      playerMatch = match;
      return;
    }

    // 👉 andere Spiele simulieren
    const home = Math.floor(Math.random()*3);
    const away = Math.floor(Math.random()*3);

    match.result = { home, away };
    applyMatchResult(match);
  });

  if(!playerMatch){
    console.error("❌ Kein Spiel für dein Team gefunden");
    return;
  }

  game.match.current = playerMatch;
  game.phase = "live";

  renderSchedule();
  renderTable();

  runMatchLoop();
}

// =========================
// 🔁 MATCH LOOP
// =========================
function runMatchLoop(){

  const interval = setInterval(() => {

    if(!matchState.running){
      clearInterval(interval);
      return;
    }

    matchState.minute++;

    simulateLiveEvent();

    updateUI();
    renderLiveFeed();
    renderLiveTable();

    if(matchState.minute > 90){
      clearInterval(interval);
      endMatch();
    }

  }, 400);
}

// =========================
// 🎲 EVENTS
// =========================
function simulateLiveEvent(){

  const match = game.match.current;
  if(!match) return;

  const rand = Math.random();

  if(rand < 0.15){
    createChance(match, true);
  }
  else if(rand < 0.30){
    createChance(match, false);
  }
  else if(rand < 0.38){
    createFoul(match);
  }
  else if(rand < 0.42){
    createOffside(match);
  }
}

// =========================
// ⚽ CHANCE
// =========================
function createChance(match, isHome){

  const team = isHome ? match.home : match.away;
  const opponent = isHome ? match.away : match.home;

  const strengthDiff = team.strength - opponent.strength;
  const chance = Math.random() + strengthDiff * 0.01;

  if(chance > 0.9){
    goal(team, isHome);
  }
  else if(chance > 0.6){
    addEvent(`🧤 Parade gegen ${team.name}`);
  }
  else{
    addEvent(`🎯 Chance für ${team.name}`);
  }
}

// =========================
// ⚽ TOR
// =========================
function goal(team, isHome){

  if(isHome){
    matchState.score.home++;
  } else {
    matchState.score.away++;
  }

  addEvent(`⚽ TOR für ${team.name}!`);
}

// =========================
// 💥 FOUL
// =========================
function createFoul(match){

  const isHome = Math.random() > 0.5;
  const team = isHome ? match.home : match.away;

  addEvent(`💥 Foul von ${team.name}`);

  if(Math.random() > 0.8){
    createPenalty(match, !isHome);
  }
}

// =========================
// 🥅 ELFMETER
// =========================
function createPenalty(match, isHome){

  const team = isHome ? match.home : match.away;

  addEvent(`⚠️ Elfmeter für ${team.name}!`);

  if(Math.random() < 0.75){
    goal(team, isHome);
    addEvent(`🎯 verwandelt`);
  } else {
    addEvent(`❌ verschossen`);
  }
}

// =========================
// 🚫 ABSEITS
// =========================
function createOffside(match){

  const team = Math.random() > 0.5 ? match.home : match.away;
  addEvent(`🚫 Abseits von ${team.name}`);
}

// =========================
// ➕ EVENT
// =========================
function addEvent(text){

  matchState.events.unshift(
    `${matchState.minute}' - ${text}`
  );

  if(matchState.events.length > 25){
    matchState.events.pop();
  }
}

// =========================
// 🏁 ENDE
// =========================
function endMatch(){

  const match = game.match.current;

  if(!match){
    console.warn("❌ Kein aktuelles Match");
    return;
  }

  if(match._processed){
    console.warn("⚠️ Match bereits verarbeitet");
    return;
  }

  // ✅ Ergebnis setzen
  match.result = {
    home: matchState.score.home,
    away: matchState.score.away
  };

  applyMatchResult(match);

  // ✅ Runde erhöhen
  game.league.currentRound++;

  // ✅ Cleanup
  game.match.current = null;
  matchState.running = false;
  game.phase = "idle";

  renderTable();
  renderSchedule();

  console.log("✅ Spiel beendet");
}

// =========================
// 📊 RESULT
// =========================
function applyMatchResult(match){

  if(match._processed) return;

  const home = match.home;
  const away = match.away;

  const h = match.result.home;
  const a = match.result.away;

  home.played++;
  away.played++;

  home.goalsFor += h;
  home.goalsAgainst += a;

  away.goalsFor += a;
  away.goalsAgainst += h;

  if(h > a){
    home.wins++;
    away.losses++;
    home.points += 3;
  }
  else if(a > h){
    away.wins++;
    home.losses++;
    away.points += 3;
  }
  else{
    home.draws++;
    away.draws++;
    home.points += 1;
    away.points += 1;
  }

  match._processed = true;
}

// =========================
// 🌍 GLOBAL
// =========================
window.startMatch = startMatch;
window.handleMainAction = handleMainAction;
