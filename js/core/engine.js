let interval = null;

// 🔥 Match State GLOBAL
let matchState = {
  minute: 0,
  half: 1,
  running: false
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

    // 🟡 Halbzeit
    if(matchState.minute === 45){
      matchState.half = 2;
      updateMatchUI("Halbzeit (45')");
      updateProgressBar();
      return;
    }

    // 🔴 Spielende
    if(matchState.minute >= 90){
      endMatch();
      return;
    }

    updateMatchUI(
      `Minute ${matchState.minute}' (HZ ${matchState.half})`
    );

    updateProgressBar();

  }, 500); // Geschwindigkeit (0.5s pro Minute)
}

// =========================
// ⏹ MATCH ENDE
// =========================
function endMatch(){

  clearInterval(interval);

  matchState.running = false;
  game.phase = "setup";

  updateMatchUI("Spiel beendet (90')");
  updateProgressBar();
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
// 🎮 BUTTON LOGIK
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
