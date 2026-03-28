// =========================
// ⚙️ ENGINE CORE
// =========================
console.log("ENGINE LOADED");

let interval = null;


// =========================
// 🎮 MAIN FLOW
// =========================
function handleMainAction(){

  console.log("🎮 Phase:", game.phase);

  switch(game.phase){

    case "setup":
      startSeason();
      break;

    case "ready":
      startMatch();
      break;

    case "halftime":
      resumeMatch();
      break;

    case "finished":
      nextMatchday();
      break;
  }

  updateMainButton();
}


// =========================
// 🏁 SAISON
// =========================
function startSeason(){

  if(!game.league.teams.length){
    alert("Bitte Liga wählen");
    return;
  }

  generateMatchSchedule();

  game.league.currentMatchday = 0;
  game.phase = "ready";

  console.log("🏁 Saison gestartet");
}


// =========================
// ⚽ MATCH START
// =========================
function startMatch(){

  const match = getCurrentMatch();

  if(!match){
    console.warn("❌ Kein Match gefunden");
    return;
  }

  clearLiveEvents?.();

  game.match.current = {
    ...match,
    minute: 0,
    homeGoals: 0,
    awayGoals: 0,
    running: true,
    half: 1
  };

  game.phase = "live";

  updateTeamsUI?.();
  updateScoreUI?.();

  startLoop();

  console.log("⚽ Spiel gestartet");
}


// =========================
// 🔁 GAME LOOP
// =========================
function startLoop(){

  clearInterval(interval);

  interval = setInterval(tick, 1000 / game.settings.speed);
}

function tick(){

  const m = game.match.current;
  if(!m || !m.running) return;

  m.minute++;

  // 🔥 EVENTS
  simulateEvents(m);

  updateScoreUI?.();
  updateProgressBar?.();

  // ⏸ HALBZEIT
  if(m.minute === 45 && m.half === 1){
    m.half = 2;
    pauseMatch("halftime");
    addLiveEvent?.("Halbzeit", m.minute);
    return;
  }

  // 🏁 ENDE
  if(m.minute >= 90){
    finishMatch();
  }
}


// =========================
// 🎲 MATCH EVENTS
// =========================
function simulateEvents(m){

  if(Math.random() < 0.05){

    const isHome = Math.random() < 0.5;

    if(isHome){
      m.homeGoals++;
      addLiveEvent?.("Tor Heimteam ⚽", m.minute);
    } else {
      m.awayGoals++;
      addLiveEvent?.("Tor Auswärtsteam ⚽", m.minute);
    }
  }
}


// =========================
// ⏸ PAUSE
// =========================
function pauseMatch(type){

  if(!game.match.current) return;

  game.match.current.running = false;
  game.phase = type;

  clearInterval(interval);

  console.log("⏸ Pause:", type);
}


// =========================
// ▶️ RESUME
// =========================
function resumeMatch(){

  if(!game.match.current) return;

  game.match.current.running = true;
  game.phase = "live";

  startLoop();

  console.log("▶ Spiel fortgesetzt");
}


// =========================
// 🏁 FINISH
// =========================
function finishMatch(){

  const m = game.match.current;
  if(!m) return;

  clearInterval(interval);

  saveResult(m);

  addLiveEvent?.("Abpfiff 🏁", m.minute);

  game.phase = "finished";
  game.match.current.running = false;

  updateTable?.();

  console.log("🏁 Spiel beendet");
}


// =========================
// ➡ NEXT MATCHDAY
// =========================
function nextMatchday(){

  game.league.currentMatchday++;

  game.phase = "ready";

  clearLiveEvents?.();

  console.log("➡ Nächster Spieltag");
}


// =========================
// ⚡ SPEED CONTROL
// =========================
function setSpeed(val){

  game.settings.speed = val;

  if(game.match.current?.running){
    startLoop();
  }

  console.log("⚡ Speed:", val);
}


// =========================
// 🔘 BUTTON TEXT
// =========================
function updateMainButton(){

  const btn = document.getElementById("mainButton");
  if(!btn) return;

  switch(game.phase){

    case "setup":
      btn.innerText = "▶ Saison starten";
      break;

    case "ready":
      btn.innerText = "▶ Spiel starten";
      break;

    case "live":
      btn.innerText = "⏸ Pause";
      break;

    case "halftime":
      btn.innerText = "▶ 2. Halbzeit";
      break;

    case "finished":
      btn.innerText = "▶ Nächstes Spiel";
      break;
  }
}


// =========================
// 🌍 EXPORTS
// =========================
window.handleMainAction = handleMainAction;
window.startMatch = startMatch;
window.resumeMatch = resumeMatch;
window.setSpeed = setSpeed;
window.updateMainButton = updateMainButton;
