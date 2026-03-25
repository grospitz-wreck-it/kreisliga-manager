// =========================
// ⚽ MATCH ENGINE
// =========================

var interval = null;

// =========================
// 🧠 SIMULATE MATCHDAY
// =========================
function simulateMatchday(){

  if(!game.team.selected){
    alert("Team wählen!");
    return;
  }

  var matches = game.league.schedule[game.league.currentMatchday];

  if(!matches){
    console.warn("Keine Spiele mehr");
    return;
  }

  game.league.currentMatchday++;

  startLiveMatch(matches);
}

// =========================
// 🎮 START LIVE MATCH
// =========================
function startLiveMatch(matches){

  game.match.minute = 0;
  game.match.isRunning = true;

  var myMatch = matches.find(function(m){
    return m.home === game.team.selected || m.away === game.team.selected;
  });

  if(!myMatch){
    console.error("Kein eigenes Spiel gefunden");
    return;
  }

  myMatch.score = { home: 0, away: 0 };

  window.currentMatch = myMatch;

  startInterval();
}

// =========================
// ⏱️ INTERVAL
// =========================
function startInterval(){

  if(interval){
    clearInterval(interval);
  }

  interval = window.setInterval(function(){

    if(!game.match.isRunning) return;

    game.match.minute = game.match.minute + 1;

    simulateMinute();

    if(game.match.minute >= 90){
      endMatch();
    }

  }, 1000 / (speedMultiplier || 1));
}

// =========================
// 🔁 RESTART INTERVAL
// =========================
function restartInterval(){
  startInterval();
}

// =========================
// ⏱️ MINUTE SIMULATION
// =========================
function simulateMinute(){

  var m = game.match.minute;
  var match = window.currentMatch;

  if(!match) return;

  var chance = 0.08;

  chance += Number(tacticModifier || 0);
  chance += Number(formationModifier || 0);
  chance += Number(liveModifier || 0);
  chance += Number(intensityModifier || 0);

  if(isNaN(chance)) chance = 0.08;

  // TOR
  if(Math.random() < chance){

    var isHome = Math.random() < 0.5;
    var scoringTeam = isHome ? match.home : match.away;

    if(isHome){
      match.score.home = match.score.home + 1;
    } else {
      match.score.away = match.score.away + 1;
    }

    addLiveEvent("⚽ Tor für " + scoringTeam + "!", m);
  }

  // EVENTS
  if(Math.random() < 0.05){

    var texts = [
      "💥 Chance vergeben",
      "🧤 Starke Parade",
      "🟨 Gelbe Karte",
      "📢 Fans werden laut"
    ];

    var index = Math.floor(Math.random() * texts.length);
    addLiveEvent(texts[index], m);
  }
}

// =========================
// 🏁 MATCH ENDE
// =========================
function endMatch(){

  clearInterval(interval);

  game.match.isRunning = false;
  game.phase = "ready";

  var match = window.currentMatch;
  if(!match) return;

  addLiveEvent(
    "🏁 Endstand: " + match.home + " " +
    match.score.home + " - " +
    match.score.away + " " +
    match.away,
    90
  );

  updateTableData(match);

  if(typeof updateTable === "function") updateTable();
  if(typeof updateMainButton === "function") updateMainButton();

  if(typeof submitScore === "function"){
    submitScore(match);
  }
}

// =========================
// 📊 TABELLE UPDATEN
// =========================
function updateTableData(match){

  var home = game.league.teams.find(function(t){
    return t.name === match.home;
  });

  var away = game.league.teams.find(function(t){
    return t.name === match.away;
  });

  if(!home || !away) return;

  home.goalsFor += match.score.home;
  home.goalsAgainst += match.score.away;

  away.goalsFor += match.score.away;
  away.goalsAgainst += match.score.home;

  home.played++;
  away.played++;

  if(match.score.home > match.score.away){
    home.points += 3;
    home.wins++;
    away.losses++;
  }
  else if(match.score.home < match.score.away){
    away.points += 3;
    away.wins++;
    home.losses++;
  }
  else{
    home.points += 1;
    away.points += 1;
    home.draws++;
    away.draws++;
  }
}
