let interval = null;

// 🔥 Match State
let matchState = {
  minute: 0,
  half: 1,
  running: false,
  score: {
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
    home: teams[0],
    away: teams[1]
  };

  game.phase = "live";

  matchState.minute = 0;
  matchState.half = 1;
  matchState.running = true;
  matchState.score.home = 0;
  matchState.score.away = 0;

  clearLiveFeed();

  runMatchLoop();
}

// =========================
// 🔄 MATCH LOOP
// =========================
function runMatchLoop(){

  clearInterval(interval);

  interval = setInterval(() => {

    if(!matchState.running) return;

    matchState.minute++;

    maybeGoal();

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

    updateAllUI(
      `Minute ${matchState.minute}'`
    );

  }, 500);
}

// =========================
// ⚽ REALISTISCHE TORE
// =========================
function maybeGoal(){

  const home = game.match.current.home;
  const away = game.match.current.away;

  // 🔥 Basis Chance
  let baseChance = 0.05;

  // 🔥 Stärke Einfluss
  let diff = home.strength - away.strength;

  // Heimbonus
  let homeChance = baseChance + (diff * 0.001) + 0.02;
  let awayChance = baseChance - (diff * 0.001);

  // Clamp
  homeChance = Math.max(0.01, Math.min(0.15, homeChance));
  awayChance = Math.max(0.01, Math.min(0.15, awayChance));

  const roll = Math.random();

  if(roll < homeChance){
    matchState.score.home++;
    addLiveEvent(`⚽ TOR für ${home.name}!`);
  }
  else if(roll < homeChance + awayChance){
    matchState.score.away++;
    addLiveEvent(`⚽ TOR für ${away.name}!`);
  }
}

// =========================
// ⏹ ENDE
// =========================
function endMatch(){

  clearInterval(interval);

  matchState.running = false;
  game.phase = "setup";

  addLiveEvent("🏁 Abpfiff!");

  updateAllUI("Spiel beendet");
}

// =========================
// 📊 UI UPDATE
// =========================
function updateAllUI(text){
  updateMatchUI(text);
  updateScoreUI();
  updateProgressBar();
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
