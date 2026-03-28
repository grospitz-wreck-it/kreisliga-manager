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
// 🔍 MATCH FINDEN
// =========================
function findPlayerMatch(){

  const round = game.league.schedule?.[game.league.currentRound];
  const myTeam = game.team.selected;

  if(!round || !myTeam) return null;

  return round.find(m =>
    m.home.name === myTeam.name ||
    m.away.name === myTeam.name
  );
}

// =========================
// 🏁 START
// =========================
function startMatch(){

  simulateMatchday();

  let match = findPlayerMatch();

  if(!match){
    match = game.league.schedule?.[game.league.currentRound]?.[0];
  }

  if(!match) return;

  game.match.current = match;
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
// 🎲 EVENT STEUERUNG
// =========================
function simulateLiveEvent(){

  const match = game.match.current;
  if(!match) return;

  const homeWeight = getAttackWeight(match.home);
  const awayWeight = getAttackWeight(match.away);

  const rand = Math.random();

  // 🎯 CHANCEN (taktik beeinflusst!)
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
// 🧠 TAKTIK SYSTEM
// =========================
function getAttackWeight(team){

  if(team.tactic === "offensive") return 0.08;
  if(team.tactic === "defensive") return -0.05;

  return 0; // balanced
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
// 💥 FOUL + ELFMETER
// =========================
function createFoul(match){

  const isHome = Math.random() > 0.5;
  const team = isHome ? match.home : match.away;

  addEvent(`💥 Foul von ${team.name}`);

  // 🔥 ELFMETER CHANCE
  if(Math.random() > 0.8){
    createPenalty(match, !isHome);
    return;
  }

  // Karten
  const cardRoll = Math.random();

  if(cardRoll > 0.9){
    addEvent(`🟥 ROT für ${team.name}`);
    team.strength -= 10;
  }
  else if(cardRoll > 0.65){
    addEvent(`🟨 Gelb für ${team.name}`);
  }
}

// =========================
// 🥅 ELFMETER
// =========================
function createPenalty(match, isHome){

  const team = isHome ? match.home : match.away;

  addEvent(`⚠️ ELFMETER für ${team.name}!`);

  const scored = Math.random() < 0.75;

  if(scored){
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

  matchState.events.unshift(
    `${matchState.minute}' - ${text}`
  );

  if(matchState.events.length > 25){
    matchState.events.pop();
  }
}

// =========================
// 🧾 SPIELTAG
// =========================
function simulateMatchday(){

  const round = game.league.schedule?.[game.league.currentRound];

  if(!round) return;

  round.forEach(match => {

    // 👉 eigenes Spiel NICHT simulieren
    if(
      match.home.name === game.team.selected?.name ||
      match.away.name === game.team.selected?.name
    ){
      return;
    }

    const home = Math.floor(Math.random()*3);
    const away = Math.floor(Math.random()*3);

    // ✅ Ergebnis setzen
    match.result = { home, away };

    // ❌ ALT
    // updateTable(match.home, match.away, home, away);

    // ✅ NEU
    applyMatchResult(match);
  });

  // 👉 Tabelle danach einmal neu rendern
  renderTable();
}

// =========================
// 🏁 ENDE
// =========================
function endMatch(){

  const match = game.match.current;

  // ✅ Ergebnis setzen (bleibt wie bei dir)
  match.result = {
    home: matchState.score.home,
    away: matchState.score.away
  };

  applyMatchResult(match);

  // 👉 Tabelle neu rendern
  renderTable();

  game.league.currentRound++;
  game.phase = "idle";

  renderSchedule();
}

// =========================
// 🏁 Aktualisierung Ergebnisse
// =========================

function applyMatchResult(match){

  const home = match.home;
  const away = match.away;

  const h = match.result.home;
  const a = match.result.away;

  // Spiele
  home.played++;
  away.played++;

  // Tore
  home.goalsFor += h;
  home.goalsAgainst += a;

  away.goalsFor += a;
  away.goalsAgainst += h;

  // Ergebnis
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
}
// =========================
// 🌍 GLOBAL
// =========================
window.handleMainAction = handleMainAction;
