// =========================
// ⚙️ GLOBALS
// =========================
var tacticModifier = 0;
var formationModifier = 0;
var liveModifier = 0;
var intensityModifier = 0;
var speedMultiplier = 1;

// =========================
// 🎮 MATCHDAY START
// =========================
function simulateMatchday(){

  if(!game.league || !game.league.schedule.length){
    console.error("Keine Liga geladen");
    return;
  }

  var day = game.league.currentMatchday;
  var matches = game.league.schedule[day];

  if(!matches || matches.length === 0){
    console.error("Keine Spiele vorhanden");
    return;
  }

  var firstMatch = matches[0];

  window.currentMatch = {
    home: firstMatch[0].name,
    away: firstMatch[1].name,
    score: { home: 0, away: 0 }
  };

  startLiveMatch();
}

// =========================
// ▶ MATCH START
// =========================
function startLiveMatch(){

  game.match = {
    minute: 0,
    running: true,
    interval: null
  };

  // 🔥 FIX: Progress direkt auf 0
  updateProgressBar();

  updateScoreUI();

  addLiveEvent("Anpfiff!", 0);

  startInterval();
}

// =========================
// ⏱ INTERVAL
// =========================
function startInterval(){

  clearInterval(game.match.interval);

  game.match.interval = setInterval(function(){

    if(!game.match.running) return;

    simulateMinute();

  }, 1000 / speedMultiplier);
}

// =========================
// ▶ RESUME
// =========================
function resumeMatch(){

  if(game.match.running) return;

  game.match.running = true;
  startInterval();

  console.log("▶ Match fortgesetzt");
}

// =========================
// ⏱ MINUTE SIMULATION
// =========================
function simulateMinute(){

  game.match.minute++;

  var m = game.match.minute;
  var match = window.currentMatch;

  if(!match) return;

  // 🛑 HALBZEIT
  if(m === 45){

    addLiveEvent("⏸ Halbzeit – intensive Partie!", m);

    game.match.running = false;
    clearInterval(game.match.interval);

    return;
  }

  // 🏁 SPIELENDE
  if(m > 90){
    endMatch();
    return;
  }

  var chance = 0.12;
  chance += Number(liveModifier || 0);
  chance += Number(intensityModifier || 0);

  if(Math.random() < chance){

    var isHome = Math.random() < 0.5;
    var team = isHome ? match.home : match.away;

    generateEvent(team, isHome, m);
  }

  updateScoreUI();
  updateProgressBar();
}

// =========================
// 🎯 EVENTS
// =========================
function generateEvent(team, isHome, minute){

  var match = window.currentMatch;

  var events = [

    team + " baut ruhig auf",
    team + " kombiniert stark durchs Mittelfeld",
    team + " kommt über außen",
    "Starker Pass von " + team,
    team + " mit viel Ballbesitz",
    team + " setzt den Gegner unter Druck",
    "Fehlpass im Aufbau von " + team,
    "Gute Chance für " + team,
    "Schuss von " + team + "!",
    "Knapp vorbei von " + team,
    "Große Chance für " + team + "!",
    "Latte! " + team,
    "Pfosten! Unglaublich!",
    "TOR für " + team + "!!!",
    "Was für ein Fehler in der Abwehr!",
    "Gelbe Karte für " + team,
    "Foulspiel im Mittelfeld",
    "Der Keeper hält stark!",
    "Riesenchance vergeben!",
    "Konter läuft für " + team,
    "Schneller Angriff von " + team
  ];

  var text = randomFrom(events);

  // ⚽ TOR LOGIK
  if(text.indexOf("TOR") !== -1){

    if(isHome){
      match.score.home++;
    } else {
      match.score.away++;
    }

    updateScoreUI();
  }

  addLiveEvent(text, minute);
}

// =========================
// 🏁 MATCH ENDE
// =========================
function endMatch(){

  clearInterval(game.match.interval);

  game.match.running = false;

  addLiveEvent("Abpfiff!", game.match.minute);

  updateTableData(window.currentMatch);

  if(typeof updateTable === "function"){
    updateTable();
  }

  console.log("Spiel beendet");
}

// =========================
// 📊 PROGRESS BAR
// =========================
function updateProgressBar(){

  var bar = document.getElementById("momentumBar");
  if(!bar) return;

  var minute = game.match.minute || 0;
  var percent = (minute / 90) * 100;

  bar.style.width = percent + "%";
}

// =========================
// 🔢 SCORE UI
// =========================
function updateScoreUI(){

  var match = window.currentMatch;
  if(!match) return;

  var left = document.getElementById("teamLeft");
  var right = document.getElementById("teamRight");
  var score = document.getElementById("score");

  if(left) left.innerText = match.home;
  if(right) right.innerText = match.away;

  if(score){
    score.innerText = match.score.home + " : " + match.score.away;
  }
}

// =========================
// 🎲 HELPER
// =========================
function randomFrom(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}
