let interval = null;

// 🔥 Match State
let matchState = {
  minute: 0,
  half: 1,
  running: false,

  score: {
    home: 0,
    away: 0
  },

  cards: {
    home: 0,
    away: 0
  }
};

// =========================
// ▶️ START MATCH
// =========================
function startMatch(){

  const teams = game.league.teams;

  if(!teams.length){
    alert("Liga wählen!");
    return;
  }

  game.match.current = {
    home: { ...teams[0] },
    away: { ...teams[1] }
  };

  game.phase = "live";

  matchState.minute = 0;
  matchState.half = 1;
  matchState.running = true;

  matchState.score.home = 0;
  matchState.score.away = 0;

  matchState.cards.home = 0;
  matchState.cards.away = 0;

  clearLiveFeed();
  nextMatch();
  runMatchLoop();
}

// =========================
// 🔄 LOOP
// =========================
function runMatchLoop(){

  clearInterval(interval);

  interval = setInterval(() => {

    if(!matchState.running) return;

    matchState.minute++;

    simulateMinute();

    if(matchState.minute === 45){
      matchState.half = 2;
      addLiveEvent("⏸ Halbzeitpause");
      updateAllUI("Halbzeit (45')");
      return;
    }

    if(matchState.minute >= 90){
      endMatch();
      return;
    }

    updateAllUI(`Minute ${matchState.minute}'`);

  }, 500);
}

// =========================
// 🎲 MINUTEN-SIMULATION
// =========================
function simulateMinute(){

  const home = game.match.current.home;
  const away = game.match.current.away;

  // 🔥 effektive Stärke (Karten schwächen!)
  const homeEff = home.strength - matchState.cards.home * 5;
  const awayEff = away.strength - matchState.cards.away * 5;

  const total = homeEff + awayEff;

  const homeBias = homeEff / total;

  const roll = Math.random();

  // =========================
  // ⚽ CHANCE
  // =========================
  if(roll < 0.25){

    const isHome = Math.random() < homeBias;
    const team = isHome ? home : away;

    addLiveEvent(`🔥 Große Chance für ${team.name}!`);

    // TOR (jetzt deutlich seltener)
    if(Math.random() < 0.2){
      scoreGoal(isHome);
    } else {
      addLiveEvent(`❌ ${team.name} vergibt die Chance`);
    }

    return;
  }

  // =========================
  // 🚫 FOUL
  // =========================
  if(roll < 0.45){

    const isHome = Math.random() < homeBias;
    const team = isHome ? away : home; // foulendes Team

    addLiveEvent(`🚫 Foul von ${team.name}`);

    // Karte?
    handleCard(team === home);

    return;
  }

  // =========================
  // 🚩 ABSEITS
  // =========================
  if(roll < 0.6){

    const isHome = Math.random() < homeBias;
    const team = isHome ? home : away;

    addLiveEvent(`🚩 Abseits von ${team.name}`);
    return;
  }

  // =========================
  // 🎯 STANDARD / ELFMETER
  // =========================
  if(roll < 0.7){

    if(Math.random() < 0.2){
      handlePenalty();
    } else {
      addLiveEvent("🎯 Freistoß aus guter Position");
    }

    return;
  }

  // =========================
  // 💬 KOMMENTAR
  // =========================
  addCommentary(homeEff, awayEff);
}

// =========================
// ⚽ TOR
// =========================
function scoreGoal(isHome){

  const team = isHome ? "home" : "away";
  const name = isHome
    ? game.match.current.home.name
    : game.match.current.away.name;

  matchState.score[team]++;

  addLiveEvent(`⚽ TOOOOR für ${name}!`);
}

// =========================
// 🟥 KARTEN
// =========================
function handleCard(isHomeTeam){

  const key = isHomeTeam ? "home" : "away";
  const name = isHomeTeam
    ? game.match.current.home.name
    : game.match.current.away.name;

  const r = Math.random();

  if(r < 0.6){
    matchState.cards[key]++;
    addLiveEvent(`🟨 Gelbe Karte für ${name}`);

    // Gelb-Rot
    if(matchState.cards[key] >= 2){
      matchState.cards[key] += 2; // extra Strafe
      addLiveEvent(`🟥 Gelb-Rot für ${name}!`);
    }

  } else if(r < 0.85){
    matchState.cards[key] += 3;
    addLiveEvent(`🟥 Rote Karte für ${name}!`);
  }
}

// =========================
// 🥅 ELFMETER
// =========================
function handlePenalty(){

  const isHome = Math.random() < 0.5;
  const name = isHome
    ? game.match.current.home.name
    : game.match.current.away.name;

  addLiveEvent(`🎯 Elfmeter für ${name}!`);

  if(Math.random() < 0.75){
    scoreGoal(isHome);
  } else {
    addLiveEvent(`❌ Elfmeter verschossen von ${name}`);
  }
}

// =========================
// 💬 KOMMENTARE (FLOSKELN)
// =========================
function addCommentary(homeEff, awayEff){

  if(typeof words === "undefined") return;

  let text = "";

  if(homeEff > awayEff){
    text = `${game.match.current.home.name} ${r(words.actions)} und wirkt ${r(words.adjPositive)}.`;
  } else if(awayEff > homeEff){
    text = `${game.match.current.away.name} ${r(words.actions)} und tritt ${r(words.adjPositive)} auf.`;
  } else {
    text = `Beide Teams wirken ${r(words.adjNegative)}.`;
  }

  addLiveEvent(text);
}

// =========================
// 📊 UI
// =========================
function updateAllUI(text){
  updateMatchUI(text);
  updateScoreUI();
  updateProgressBar();
  saveGame();
}

function updateScoreUI(){
  const el = document.getElementById("score");
  if(!el) return;

  el.innerText =
    `${matchState.score.home} : ${matchState.score.away}`;
}

function updateProgressBar(){
  const percent = (matchState.minute / 90) * 100;
  const bar = document.getElementById("progressFill");

  if(bar){
    bar.style.width = percent + "%";
  }
}

// =========================
// 📰 LIVE
// =========================
function addLiveEvent(text){

  const box = document.getElementById("liveFeed");
  if(!box) return;

  const p = document.createElement("p");
  p.innerText = `${matchState.minute}' - ${text}`;

  box.prepend(p);
}

function clearLiveFeed(){
  const box = document.getElementById("liveFeed");
  if(box) box.innerHTML = "";
}

// =========================
// ⏹ ENDE
// =========================
function endMatch(){

  clearInterval(interval);

  matchState.running = false;
  game.phase = "setup";

  addLiveEvent("🏁 Abpfiff!");

  const home = game.match.current.home;
  const away = game.match.current.away;

  updateTable(
    home,
    away,
    matchState.score.home,
    matchState.score.away
  );

  renderTable();

  updateAllUI("Spiel beendet");
}

// =========================
// 🎮 BUTTON
// =========================
function handleMainAction(){

  if(game.phase === "setup"){
    startMatch();
  } else {
    endMatch();
  }
}

// 🌍 EXPORTS
window.handleMainAction = handleMainAction;
window.matchState = matchState;
