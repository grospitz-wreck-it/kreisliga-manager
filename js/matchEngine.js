// =========================
// ⚽ MATCH ENGINE (STABIL)
// =========================

let matchInterval = null;

window.speedMultiplier = 1;

// =========================
// 🧠 STATE HELPERS
// =========================

function isMatchRunning(){
  return game.match && game.match.isRunning;
}

// =========================
// ▶️ START MATCH
// =========================
function startMatch(){

  if(isMatchRunning()){
    console.warn("Spiel läuft bereits");
    return;
  }

  console.log("▶️ Spiel gestartet");

  game.match = {
    minute: 0,
    isRunning: true,
    homeGoals: 0,
    awayGoals: 0
  };

  game.phase = "live";

  startInterval();
}

// =========================
// ⏱ INTERVAL START
// =========================
function startInterval(){

  if(matchInterval){
    clearInterval(matchInterval);
  }

  const tickSpeed = 1000 / speedMultiplier;

  matchInterval = setInterval(matchTick, tickSpeed);

  console.log("⏱ Interval gestartet mit Speed:", speedMultiplier);
}

// =========================
// 🔄 TICK
// =========================
function matchTick(){

  if(!game.match || !game.match.isRunning) return;

  game.match.minute++;

  updateMatchUI();

  // ⚽ Zufalls-Events (MVP)
  if(Math.random() < 0.05){
    generateGoal();
  }

  // 🟨 Karten
  if(Math.random() < 0.02){
    generateCard();
  }

  // ⏸ HALBZEIT
  if(game.match.minute === 45){
    handleHalftime();
    return;
  }

  // 🏁 ENDE
  if(game.match.minute >= 90){
    endMatch();
    return;
  }
}

// =========================
// ⚽ GOAL
// =========================
function generateGoal(){

  const home = Math.random() > 0.5;

  if(home){
    game.match.homeGoals++;
  } else {
    game.match.awayGoals++;
  }

  logEvent(`⚽ Tor für ${home ? "Heim" : "Gast"}!`);
}

// =========================
// 🟨 CARD
// =========================
function generateCard(){
  logEvent("🟨 Gelbe Karte");
}

// =========================
// ⏸ HALBZEIT
// =========================
function handleHalftime(){

  console.log("⏸ Halbzeit");

  game.match.isRunning = false;
  game.phase = "halftime";

  clearInterval(matchInterval);

  updateMainButton();
}

// =========================
// ▶️ RESUME MATCH
// =========================
function resumeMatch(){

  if(game.phase !== "halftime"){
    console.warn("Nicht in Halbzeit");
    return;
  }

  console.log("▶️ 2. Halbzeit startet");

  game.match.isRunning = true;
  game.phase = "live";

  startInterval();
}

// =========================
// 🏁 MATCH ENDE
// =========================
function endMatch(){

  console.log("🏁 Spiel beendet");

  clearInterval(matchInterval);

  game.match.isRunning = false;
  game.phase = "ready";

  game.league.currentMatchday++;

  updateMainButton();

  showNextMatchInfo();
}

// =========================
// ⏩ SPEED
// =========================
function setSpeed(val){

  speedMultiplier = val;

  console.log("⏩ Speed:", val);

  if(isMatchRunning()){
    startInterval(); // restart sauber
  }
}

// =========================
// 🖥 UI UPDATE
// =========================
function updateMatchUI(){

  const score = document.getElementById("score");

  if(score){
    score.innerText = `${game.match.homeGoals} : ${game.match.awayGoals} (${game.match.minute}')`;
  }
}

// =========================
// 📰 EVENT LOG
// =========================
function logEvent(text){

  const box = document.getElementById("liveMatch");

  if(!box) return;

  const el = document.createElement("div");
  el.innerText = text;

  box.prepend(el);
}

// =========================
// ➡️ NEXT MATCH INFO
// =========================
function showNextMatchInfo(){

  const box = document.getElementById("newsBox");
  if(!box) return;

  box.innerHTML = `
    <div>
      👉 Nächster Spieltag bereit
      <br>
      <button onclick="startMatch()">▶ Nächstes Spiel</button>
    </div>
  `;
}

// =========================
// 🌍 EXPORTS (WICHTIG)
// =========================
window.startMatch = startMatch;
window.resumeMatch = resumeMatch;
window.setSpeed = setSpeed;
