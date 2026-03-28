const matchState = {
  minute: 0,
  running: false,
  score: { home: 0, away: 0 },
  events: [],
  cards: {
    home: 0,
    away: 0
  }
};

// =========================
// ▶️ BUTTON ACTION
// =========================
function handleMainAction(){
  if(game.phase !== "live"){
    startMatch();
  }
}

// =========================
// 🔍 SPIEL FINDEN
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
// 🏁 MATCH START
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

    if(matchState.minute > 90){
      clearInterval(interval);
      endMatch();
    }

  }, 400);
}

// =========================
// ⚽ LIVE EVENTS
// =========================
function simulateLiveEvent(){

  const match = game.match.current;

  if(!match) return;

  const rand = Math.random();

  // 🔥 EVENT WAHRSCHEINLICHKEITEN
  if(rand < 0.15){
    createChance(match);
  }
  else if(rand < 0.22){
    createFoul(match);
  }
  else if(rand < 0.26){
    createOffside(match);
  }
}

// =========================
// 🎯 CHANCE
// =========================
function createChance(match){

  const isHome = Math.random() > 0.5;
  const team = isHome ? match.home : match.away;

  const chanceQuality = Math.random();

  if(chanceQuality > 0.85){
    // TOR!
    if(isHome){
      matchState.score.home++;
    } else {
      matchState.score.away++;
    }

    addEvent(`⚽ TOR für ${team.name}!`);
  }
  else if(chanceQuality > 0.6){
    addEvent(`🧤 Große Parade gegen ${team.name}!`);
  }
  else{
    addEvent(`🎯 Chance für ${team.name}`);
  }
}

// =========================
// 🟥 FOUL + KARTEN
// =========================
function createFoul(match){

  const isHome = Math.random() > 0.5;
  const team = isHome ? match.home : match.away;

  addEvent(`💥 Foul von ${team.name}`);

  const cardRoll = Math.random();

  if(cardRoll > 0.85){
    addEvent(`🟥 ROTE KARTE für ${team.name}!`);

    if(isHome){
      matchState.cards.home++;
      match.home.strength -= 10;
    } else {
      matchState.cards.away++;
      match.away.strength -= 10;
    }
  }
  else if(cardRoll > 0.6){
    addEvent(`🟨 Gelbe Karte für ${team.name}`);
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
// ➕ EVENT HINZUFÜGEN
// =========================
function addEvent(text){

  matchState.events.unshift(
    `${matchState.minute}' - ${text}`
  );

  if(matchState.events.length > 20){
    matchState.events.pop();
  }
}

// =========================
// 🧾 MATCHDAY SIM
// =========================
function simulateMatchday(){

  const round = game.league.schedule?.[game.league.currentRound];

  if(!round) return;

  round.forEach(match => {

    if(
      match.home.name === game.team.selected?.name ||
      match.away.name === game.team.selected?.name
    ){
      return;
    }

    const homeGoals = Math.floor(Math.random()*3);
    const awayGoals = Math.floor(Math.random()*3);

    match.result = { home: homeGoals, away: awayGoals };

    updateTable(match.home, match.away, homeGoals, awayGoals);
  });
}

// =========================
// 🏁 MATCH ENDE
// =========================
function endMatch(){

  const match = game.match.current;

  match.result = {
    home: matchState.score.home,
    away: matchState.score.away
  };

  updateTable(
    match.home,
    match.away,
    matchState.score.home,
    matchState.score.away
  );

  game.league.currentRound++;
  game.phase = "idle";

  renderSchedule();
}

// =========================
// 🌍 GLOBAL
// =========================
window.handleMainAction = handleMainAction;
