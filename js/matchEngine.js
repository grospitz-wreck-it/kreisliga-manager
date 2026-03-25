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

  var day = game.league.currentMatchday;
  var matches = game.league.schedule[day];

  var firstMatch = matches[0];

  // 👉 ORIGINAL (funktionierend)
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

  // ✅ FIX: Balken auf 0 setzen
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
// ▶ RESUME (für Halbzeit)
// =========================
function resumeMatch(){

  if(game.match.running) return;

  game.match.running = true;
  startInterval();
}


// =========================
// ⏱ MINUTE
// =========================
function simulateMinute(){

  game.match.minute++;

  var m = game.match.minute;
  var match = window.currentMatch;

  if(!match) return;

  // 🛑 HALBZEIT (ECHT)
  if(m === 45){

    addLiveEvent("⏸ Halbzeit – intensive Partie!", m);

    game.match.running = false;
    clearInterval(game.match.interval);

    return;
  }

  // 🏁 ENDE
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
  updateProgressBar(); // ✅ FIX
}


// =========================
// 🎯 EVENTS
// =========================
function generateEvent(team, isHome, minute){

  var match = window.currentMatch;

  var events = [

    team + " baut ruhig auf",
    team + " kombiniert stark durchs Mittelfeld",
    team + " verlagert das Spiel clever",
    team + " mit viel Ballbesitz",
    "Starker Pass von " + team,
    "Unsicherheit in der Abwehr",
    "Fehlpass im Aufbau",
    "Konterchance für " + team,
    "Schneller Angriff von " + team,
    "Gefährlicher Abschluss!",
    "Große Chance!",
    "Knapp vorbei!",
    "Latte!",
    "Pfosten!",
    "TOR für " + team + "!!!",
    "Der Keeper hält stark!",
    "Riesenchance vergeben!",
    "Foulspiel im Mittelfeld",
    "Gelbe Karte",
    "Starkes Pressing von " + team
  ];

  var text = randomFrom(events);

  // ⚽ TOR
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
