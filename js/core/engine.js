let interval = null;

// 🔥 Match State GLOBAL
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

    // ⚽ TOR CHANCE
    maybeGoal();

    // 🟡 Halbzeit
    if(matchState.minute === 45){
      matchState.half = 2;
      addLiveEvent("⏸ Halbzeitpause");
      updateAllUI("Halbzeit (45')");
      return;
    }

    // 🔴 Spielende
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
// ⚽ TORE
// =========================
function maybeGoal(){

  // ca. 6–10 Tore pro Spiel maximal
  const chance = Math.random();

  if(chance < 0.08){ // 8% pro Minute

    const isHome = Math.random() < 0.5;

    if(isHome){
      matchState.score.home++;
      addLiveEvent(`⚽ TOR für ${game.match.current.home}!`);
    } else {
      matchState.score.away++;
      addLiveEvent(`⚽ TOR für ${game.match.current.away}!`);
    }
  }
}

// =========================
// ⏹ MATCH ENDE
// =========================
function endMatch(){

  clearInterval(interval);

  matchState.running = false;
  game.phase = "setup";

  addLiveEvent("🏁 Abpfiff!");

  updateAllUI("Spiel beendet");
}

// =========================
// 📊 UI UPDATE KOMPLETT
// =========================
function updateAllUI(text){

  updateMatchUI(text);
  updateScoreUI();
  updateProgressBar();
}

// =========================
// 📊 SCORE
// =========================
function updateScoreUI(){

  const el = document.getElementById("score");

  if(!el) return;

  el.innerText =
    `${matchState.score.home} : ${matchState.score.away}`;
}

// =========================
// 📊 PROGRESS BAR
// =========================
function updateProgressBar(){

  const percent = (matchState.minute / 90) * 100;

  const bar = document.getElementById("progressFill");

  if(bar){
    bar.style.width = percent + "%";
  }
}

// =========================
// 📰 LIVE TICKER
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
  if(box){
    box.innerHTML = "";
  }
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
