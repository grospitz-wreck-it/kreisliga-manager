// =========================
// ⚙️ GLOBALS
// =========================
var matchInterval = null;
var matchSpeed = 1000;

// =========================
// ▶ SPIELTAG STARTEN
// =========================
function simulateMatchday(){

  var md = game.league.schedule[game.league.currentMatchday];

  if(!md || md.length === 0){
    console.error("❌ Kein Spieltag vorhanden");
    return;
  }

  console.log("📅 Spieltag", game.league.currentMatchday + 1);

  startLiveMatch(md[0]); // nur dein Spiel (erstmal)
}

// =========================
// ⚽ LIVE MATCH START
// =========================
function startLiveMatch(match){

  if(!match){
    console.error("❌ Kein Match übergeben");
    return;
  }

  window.currentMatch = {
    home: match.home,
    away: match.away,
    score: { home: 0, away: 0 }
  };

  game.match.minute = 0;
  game.match.running = true;

  updateScoreUI();

  startInterval();
}

// =========================
// ⏱ INTERVAL
// =========================
function startInterval(){

  if(matchInterval){
    clearInterval(matchInterval);
  }

  matchInterval = setInterval(function(){

    if(!game.match.running) return;

    simulateMinute();

  }, matchSpeed / (speedMultiplier || 1));
}

// =========================
// 🔄 RESTART (für Speed)
// =========================
function restartInterval(){
  startInterval();
}

// =========================
// 🧠 MINUTE SIMULATION
// =========================
function simulateMinute(){

  game.match.minute++;

  var m = game.match.minute;
  var match = window.currentMatch;

  if(!match) return;

  // Halbzeit
  if(m === 45){
    addLiveEvent("⏸ Halbzeitpause", m);
  }

  // Spielende
  if(m > 90){
    endMatch();
    return;
  }

  // Zufällige Chance
  var chance = 0.08;
  chance += Number(tacticModifier || 0);
  chance += Number(formationModifier || 0);
  chance += Number(liveModifier || 0);
  chance += Number(intensityModifier || 0);

  if(Math.random() < chance){

    var isHome = Math.random() < 0.5;
    var team = isHome ? match.home : match.away;

    generateEvent(team, isHome, m);
  }
}

// =========================
// 🎭 EVENT GENERATOR
// =========================
function generateEvent(team, isHome, minute){

  var match = window.currentMatch;

  var buildup = [
    team + " baut ruhig auf",
    team + " kombiniert sich nach vorne",
    "Geduldiger Angriff von " + team
  ];

  var action = [
    "starker Pass in die Spitze",
    "Flanke kommt gefährlich rein",
    "Schuss aus der Distanz",
    "Steilpass durch die Abwehr",
    "Dribbling durch das Mittelfeld"
  ];

  var finish = [
    "TOR!!!",
    "knapp vorbei!",
    "stark gehalten!",
    "an den Pfosten!",
    "über das Tor!"
  ];

  var text =
    buildup[Math.floor(Math.random()*buildup.length)] + ", " +
    action[Math.floor(Math.random()*action.length)] + " – " +
    finish[Math.floor(Math.random()*finish.length)];

  addLiveEvent(text, minute);

  // TOR?
  if(text.indexOf("TOR") !== -1){

    if(isHome){
      match.score.home++;
    } else {
      match.score.away++;
    }

    updateScoreUI();
  }
}

// =========================
// 🧾 LIVE EVENT UI
// =========================
function addLiveEvent(text, minute){

  var box = document.getElementById("liveMatch");
  if(!box) return;

  var p = document.createElement("p");
  p.innerHTML = "<strong>" + minute + "'</strong> " + text;

  box.prepend(p);
}

// =========================
// 🧮 SCORE UI
// =========================
function updateScoreUI(){

  var match = window.currentMatch;
  if(!match) return;

  var score = document.getElementById("score");
  var left = document.getElementById("teamLeft");
  var right = document.getElementById("teamRight");

  if(score){
    score.innerHTML = match.score.home + " : " + match.score.away;
  }

  if(left){
    left.innerHTML = match.home;
  }

  if(right){
    right.innerHTML = match.away;
  }
}

// =========================
// 🏁 MATCH ENDE
// =========================
function endMatch(){

  clearInterval(matchInterval);

  game.match.running = false;

  var match = window.currentMatch;

  addLiveEvent("🏁 Abpfiff!", 90);

  // Tabelle updaten
  updateTableData(match);

  if(typeof updateTable === "function"){
    updateTable();
  }

  // nächster Spieltag
  game.league.currentMatchday++;

  console.log("✅ Spiel beendet");
}
