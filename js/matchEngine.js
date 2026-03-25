// =========================
// ⚽ MATCH ENGINE NEXT LEVEL
// =========================

var interval = null;
var momentum = 0; // -1 bis +1

// =========================
// 🧠 MATCHDAY
// =========================
function simulateMatchday(){

  if(!game.team.selected){
    alert("Team wählen!");
    return;
  }

  var matches = game.league.schedule[game.league.currentMatchday];
  if(!matches) return;

  game.league.currentMatchday++;
  startLiveMatch(matches);
}

// =========================
// 🎮 START MATCH
// =========================
function startLiveMatch(matches){

  game.match.minute = 0;
  game.match.isRunning = true;
  game.phase = "live";

  momentum = 0;

  var myMatch = matches.find(function(m){
    return m[0] === game.team.selected || m[1] === game.team.selected;
  });

  var matchObj = {
    home: myMatch[0],
    away: myMatch[1],
    score: { home: 0, away: 0 },
    red: { home: 0, away: 0 }
  };

  window.currentMatch = matchObj;

  updateTeamsUI();
  updateScoreUI();
  updateProgressBar();

  startInterval();
}

// =========================
// ⏱️ INTERVAL
// =========================
function startInterval(){

  if(interval) clearInterval(interval);

  interval = setInterval(function(){

    if(!game.match.isRunning) return;

    game.match.minute++;

    simulateMinute();

    updateScoreUI();
    updateProgressBar();

    if(game.match.minute === 45){
      game.match.isRunning = false;
      game.phase = "halftime";
      addLiveEvent("⏸ Halbzeit", 45);
      updateMainButton();
      return;
    }

    if(game.match.minute >= 90){
      endMatch();
    }

  }, 1000 / (speedMultiplier || 1));
}

// =========================
// ▶️ 2. HALBZEIT
// =========================
function resumeMatch(){

  if(game.phase !== "halftime") return;

  game.match.isRunning = true;
  game.phase = "live";

  addLiveEvent("▶️ 2. Halbzeit beginnt", 45);

  startInterval();
  updateMainButton();
}

// =========================
// ⏱️ MINUTE SIMULATION
// =========================
function simulateMinute(){

  var m = game.match.minute;
  var match = window.currentMatch;
  if(!match) return;

  updateMomentum(match);

  var chance = 0.05;

  chance += momentum * 0.05;
  chance += (match.red.home > match.red.away ? -0.03 : 0);
  chance += (match.red.away > match.red.home ? 0.03 : 0);

  chance += Number(tacticModifier || 0);
  chance += Number(liveModifier || 0);

  // ⚽ TOR
  if(Math.random() < chance){

    var isHome = momentum >= 0;

    if(isHome){
      match.score.home++;
      addLiveEvent(buildGoalText(match.home), m);
      momentum += 0.2;
    } else {
      match.score.away++;
      addLiveEvent(buildGoalText(match.away), m);
      momentum -= 0.2;
    }

    return;
  }

  // 🎲 EVENTS
  if(Math.random() < 0.3){
    triggerMatchEvent(match, m);
  }
}

// =========================
// 🔥 MOMENTUM SYSTEM
// =========================
function updateMomentum(match){

  momentum += (Math.random() - 0.5) * 0.1;

  if(match.score.home > match.score.away){
    momentum += 0.05;
  } else if(match.score.away > match.score.home){
    momentum -= 0.05;
  }

  momentum = Math.max(-1, Math.min(1, momentum));
}

// =========================
// 🎲 EVENT SYSTEM
// =========================
function triggerMatchEvent(match, minute){

  var team = momentum >= 0 ? match.home : match.away;
  var opponent = team === match.home ? match.away : match.home;

  var roll = Math.random();

  if(roll < 0.6){
    buildChanceEvent(team, opponent, minute);
  }
  else if(roll < 0.85){
    buildBigChanceEvent(team, opponent, minute);
  }
  else if(roll < 0.95){
    buildGameEvent(team, opponent, minute, match);
  }
  else{
    buildFunnyEvent(minute);
  }
}

// =========================
// ⚽ EVENT BUILDERS
// =========================
function buildChanceEvent(team, opponent, minute){

  var t1 = [
    team + baut ruhig auf",
    team + kombiniert stark",
    "Geduldiger Angriff von " + team
  ];

  var t2 = [
    "kommt in den Strafraum",
    "findet die Lücke",
    "zieht nach innen"
  ];

  var t3 = [
    "aber der Abschluss ist schwach",
    "doch der Keeper hält",
    "knapp vorbei!"
  ];

  addLiveEvent(randomPick(t1) + ", " + randomPick(t2) + " – " + randomPick(t3), minute);
}

function buildBigChanceEvent(team, opponent, minute){

  addLiveEvent(
    "😱 Riesenchance für " + team + "! " +
    randomPick([
      "Unglaublich vergeben!",
      "Was für eine Parade!",
      "Das muss ein Tor sein!"
    ]),
    minute
  );
}

function buildGameEvent(team, opponent, minute, match){

  var events = [

    function(){
      addLiveEvent("🟨 Gelb für " + team, minute);
    },

    function(){
      addLiveEvent("📐 Ecke für " + team, minute);
    },

    function(){
      addLiveEvent("🟥 ROT! " + team + " jetzt in Unterzahl!", minute);
      if(team === match.home) match.red.home++;
      else match.red.away++;
    }

  ];

  randomPick(events)();
}

function buildFunnyEvent(minute){

  var texts = [
    "😂 Spieler stolpert über den Ball",
    "🐦 Vogel auf dem Platz",
    "📢 Fan brüllt dazwischen"
  ];

  addLiveEvent(randomPick(texts), minute);
}

// =========================
// ⚽ TOR TEXT
// =========================
function buildGoalText(team){

  var a = [
    "⚽ TOR für " + team + "!",
    "🔥 TOOOOR! " + team,
    "⚡ Treffer!"
  ];

  var b = [
    "Unhaltbar!",
    "Eiskalt!",
    "Was für ein Ding!"
  ];

  return randomPick(a) + " – " + randomPick(b);
}

// =========================
// 🏁 MATCH ENDE
// =========================
function endMatch(){

  clearInterval(interval);

  game.match.isRunning = false;
  game.phase = "ready";

  var m = window.currentMatch;

  addLiveEvent(
    "🏁 Endstand: " +
    m.home + " " + m.score.home +
    " - " + m.score.away + " " + m.away,
    90
  );

  updateTableData(m);
  if(typeof updateTable === "function") updateTable();

  addMatchReport(m);
  updateMainButton();
}

// =========================
// 📊 TABLE UPDATE
// =========================
function updateTableData(match){

  var home = game.league.teams.find(t => t.name === match.home);
  var away = game.league.teams.find(t => t.name === match.away);

  if(!home || !away) return;

  home.goalsFor += match.score.home;
  home.goalsAgainst += match.score.away;

  away.goalsFor += match.score.away;
  away.goalsAgainst += match.score.home;

  home.played++;
  away.played++;

  if(match.score.home > match.score.away){
    home.points += 3;
  }
  else if(match.score.home < match.score.away){
    away.points += 3;
  }
  else{
    home.points++;
    away.points++;
  }
}

// =========================
// 📰 REPORT
// =========================
function addMatchReport(match){

  var text =
    match.home + " " +
    match.score.home + " - " +
    match.score.away + " " +
    match.away;

  addNews("📰 " + text);
}

// =========================
// 🎯 UI
// =========================
function updateScoreUI(){

  var el = document.getElementById("score");
  if(el && currentMatch){
    el.innerText = currentMatch.score.home + " : " + currentMatch.score.away;
  }
}

function updateTeamsUI(){

  if(!currentMatch) return;

  document.getElementById("teamLeft").innerText = currentMatch.home;
  document.getElementById("teamRight").innerText = currentMatch.away;
}

function updateProgressBar(){

  var bar = document.getElementById("momentumBar");
  if(!bar) return;

  bar.style.width = (game.match.minute / 90 * 100) + "%";
}

// =========================
// 🧠 HELPERS
// =========================
function randomPick(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}
