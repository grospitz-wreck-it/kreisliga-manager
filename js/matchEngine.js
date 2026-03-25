// =========================
// ⚙️ GLOBALS
// =========================
var matchInterval = null;
var lastTick = 0;

// =========================
// ▶ SPIELTAG STARTEN
// =========================
function simulateMatchday(){

  var md = game.league.schedule[game.league.currentMatchday];

  if(!md || md.length === 0){
    console.error("❌ Kein Spieltag");
    return;
  }

  startLiveMatch(md[0]);
}

// =========================
// ⚽ MATCH START
// =========================
function startLiveMatch(match){

  if(matchInterval){
    clearInterval(matchInterval);
    matchInterval = null;
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
// ⏱ INTERVAL (🔥 FIXED)
// =========================
function startInterval(){

  if(matchInterval){
    clearInterval(matchInterval);
  }

  lastTick = Date.now();

  matchInterval = setInterval(function(){

    if(!game.match.running) return;

    var now = Date.now();
    var delta = now - lastTick;

    var step = 1000 / (speedMultiplier || 1);

    if(delta >= step){
      lastTick = now;
      simulateMinute();
    }

  }, 100);
}
function restartInterval(){

  if(!game.match.running) return;

  startInterval();
}
// =========================
// 🧠 MINUTE SIM
// =========================
function simulateMinute(){

  game.match.minute++;

  var m = game.match.minute;
  var match = window.currentMatch;

  if(!match) return;

  if(m === 45){
    addLiveEvent("⏸ Halbzeit – intensive Partie!", m);
  }

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

  // 👉 sorgt dafür, dass Anzeige immer sauber aktualisiert
  updateScoreUI();
}

// =========================
// 🎭 EVENT ENGINE
// =========================
function generateEvent(team, isHome, minute){

  var match = window.currentMatch;

  var buildup = [
    team + " baut ruhig von hinten auf",
    team + " lässt den Ball laufen",
    "Geduldiger Spielaufbau von " + team,
    team + " verlagert das Spiel clever",
    team + " sucht die Lücke im Mittelfeld"
  ];

  var midfield = [
    "starker Doppelpass",
    "schneller Seitenwechsel",
    "feines Dribbling",
    "Ballgewinn im Mittelfeld",
    "Pressing greift perfekt"
  ];

  var attack = [
    "Steilpass in die Spitze",
    "Flanke in den Strafraum",
    "Schuss aus der Distanz",
    "Durchbruch über außen",
    "gefährlicher Abschluss"
  ];

  var finish = [
    "TOR!!! ⚽",
    "knapp vorbei!",
    "überragend gehalten!",
    "an den Pfosten!",
    "geblockt im letzten Moment!"
  ];

  var rare = [
    "😳 Platzfehler sorgt für Chaos",
    "🤕 Spieler bleibt kurz liegen",
    "🗣 Diskussion mit dem Schiri",
    "🎯 Traumaktion aus dem Nichts",
    "😬 Riesenmissverständnis in der Abwehr"
  ];

  var text =
    randomFrom(buildup) + ", " +
    randomFrom(midfield) + ", " +
    randomFrom(attack) + " – " +
    randomFrom(finish);

  if(Math.random() < 0.05){
    text = randomFrom(rare);
  }

  addLiveEvent(text, minute);

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
// 🧾 EVENT UI
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

  if(matchInterval){
    clearInterval(matchInterval);
    matchInterval = null;
  }

  game.match.running = false;

  var match = window.currentMatch;

  addLiveEvent("🏁 Abpfiff!", 90);

  updateTableData(match);

  if(typeof updateTable === "function"){
    updateTable();
  }

  game.league.currentMatchday++;

  console.log("✅ Spiel beendet");
}

// =========================
// 🎲 HELPER
// =========================
function randomFrom(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}
