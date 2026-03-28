const matchState = {
  minute: 0,
  running: false,
  score: { home: 0, away: 0 },
  events: [],
  cards: { home: 0, away: 0 }
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

  const round = game.league.schedule?.[game.league.currentRound];
  const myTeam = game.team.selected;

  if(!round || !myTeam){
    console.warn("❌ Kein Spieltag oder Team");
    return;
  }

  // 👉 Spieltag simulieren (setzt auch dein Match)
  simulateMatchday();

  const match = game.match.current;

  if(!match){
    console.error("❌ Kein Spiel für dein Team gefunden");
    return;
  }

  game.phase = "live";

  matchState.minute = 0;
  matchState.running = true;
  matchState.score.home = 0;
  matchState.score.away = 0;
  matchState.events = [];
  matchState.cards.home = 0;
  matchState.cards.away = 0;

  renderCurrentMatch();
  updateUI();
  renderLiveFeed();

  runMatchLoop();
}

// =========================
// 🧾 SPIELTAG SIMULATION
// =========================
function simulateMatchday(){

  const round = game.league.schedule?.[game.league.currentRound];
  if(!round) return;

  let playerMatch = null;

  round.forEach(match => {

    const isPlayerMatch =
      match.home.name === game.team.selected?.name ||
      match.away.name === game.team.selected?.name;

    if(isPlayerMatch){
      playerMatch = match;
      return;
    }

    if(match._processed) return;

    const home = Math.floor(Math.random()*3);
    const away = Math.floor(Math.random()*3);

    match.result = { home, away };
    applyMatchResult(match);
  });

  if(playerMatch){
    game.match.current = playerMatch;
  } else {
    console.warn("⚠️ Kein Spiel für Spieler gefunden!");
  }

  renderTable();
}

// =========================
// 🔁 LOOP
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

  const homeWeight = getAttackWeight(match.home);
  const awayWeight = getAttackWeight(match.away);

  const rand = Math.random();

  if(rand < 0.12 + homeWeight){
    createChance(match, true);
  }
  else if(rand < 0.24 + awayWeight){
    createChance(match, false);
  }
  else if(rand < 0.32){
    createFoul(match);
  }
  else if(rand < 0.36){
    createOffside(match);
  }
}

// =========================
// 🧠 TAKTIK
// =========================
function getAttackWeight(team){
  if(team.tactic === "offensive") return 0.08;
  if(team.tactic === "defensive") return -0.05;
  return 0;
}

// =========================
// ⚽ CHANCE
// =========================
function createChance(match, isHome){

  const team = isHome ? match.home : match.away;
  const opponent = isHome ? match.away : match.home;

  const diff = team.strength - opponent.strength;
  const chance = Math.random() + diff * 0.01;

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
    return;
  }

  const card = Math.random();

  if(card > 0.9){
    addEvent(`🟥 ROT für ${team.name}`);
    team.strength -= 10;
  }
  else if(card > 0.65){
    addEvent(`🟨 Gelb für ${team.name}`);
  }
}

// =========================
// 🥅 ELFMETER
// =========================
function createPenalty(match, isHome){

  const team = isHome ? match.home : match.away;

  addEvent(`⚠️ ELFMETER für ${team.name}!`);

  if(Math.random() < 0.75){
    goal(team, isHome);
    addEvent(`🎯 Elfmeter verwandelt!`);
  } else {
    addEvent(`❌ Elfmeter verschossen!`);
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

  matchState.events.unshift(`${matchState.minute}' - ${text}`);

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

  match.result = {
    home: matchState.score.home,
    away: matchState.score.away
  };

  applyMatchResult(match);

  renderTable();
  renderSchedule();

  game.league.currentRound++;

  game.match.current = null;
  matchState.running = false;

  game.phase = "idle";

  console.log("✅ Spiel beendet");
}

// =========================
// 📊 TABELLE
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
