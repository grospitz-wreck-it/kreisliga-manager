// =========================
// MATCH ENGINE SAFE
// =========================

var interval = null;

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

function startLiveMatch(matches){

game.match.minute = 0;
game.match.isRunning = true;

window.currentMatchdayMatches = matches;

matches.forEach(function(m){
if(!m.score){
m.score = { home: 0, away: 0 };
}
});

var myMatch = matches.find(function(m){
return m.home === game.team.selected || m.away === game.team.selected;
});

if(!myMatch){
console.error("Kein eigenes Spiel gefunden");
return;
}

window.currentMatch = myMatch;

startInterval();
}

function startInterval(){

clearInterval(interval);

interval = setInterval(function(){

```
if(!game.match.isRunning) return;

game.match.minute++;

simulateMinute();

if(game.match.minute === 45){
  game.match.isRunning = false;
  game.phase = "halftime";
  addLiveEvent("Halbzeit", 45);
  updateMainButton();
  return;
}

if(game.match.minute >= 90){
  endMatch();
}
```

}, 1000 / (window.speedMultiplier || 1));
}

function restartInterval(){
startInterval();
}

function resumeMatch(){

if(game.phase !== "halftime") return;

game.match.isRunning = true;
game.phase = "live";

addLiveEvent("2. Halbzeit gestartet", game.match.minute);

startInterval();
}

function simulateMinute(){

  var m = game.match.minute;
  var match = window.currentMatch;

  if(!match) return;

  var chance = 0.08;

  // 👉 ALLES ZU ZAHLEN ZWINGEN
  chance += Number(window.tacticModifier || 0);
  chance += Number(window.formationModifier || 0);
  chance += Number(window.liveModifier || 0);
  chance += Number(window.intensityModifier || 0);

  // 👉 ABSICHERN
  if(isNaN(chance)) chance = 0.08;

  if(Math.random() < chance){

    var isHome = Math.random() < 0.5;
    var scoringTeam = isHome ? match.home : match.away;

    if(isHome) match.score.home++;
    else match.score.away++;

    addLiveEvent("⚽ Tor für " + scoringTeam + "!", m);
  }

  if(Math.random() < 0.05){

    var texts = [
      "💥 Chance vergeben",
      "🧤 Starke Parade",
      "🟨 Gelbe Karte",
      "📢 Fans werden laut"
    ];

    var txt = texts[Math.floor(Math.random() * texts.length)];
    addLiveEvent(txt, m);
  }
}

// andere Spiele
if(window.currentMatchdayMatches){

```
window.currentMatchdayMatches.forEach(function(otherMatch){

  if(otherMatch === match) return;

  if(Math.random() < 0.05){

    if(Math.random() < 0.5) otherMatch.score.home++;
    else otherMatch.score.away++;
  }

});
```

}

if(Math.random() < 0.05){
addLiveEvent("Chance oder Aktion im Spiel", m);
}
}

function endMatch(){

clearInterval(interval);

game.match.isRunning = false;
game.phase = "ready";

var match = window.currentMatch;
if(!match) return;

addLiveEvent(
"Endstand: " +
match.home + " " + match.score.home +
" - " +
match.score.away + " " + match.away,
90
);

if(window.currentMatchdayMatches){
window.currentMatchdayMatches.forEach(function(m){
updateTableData(m);
});
}

updateTable && updateTable();
updateMainButton && updateMainButton();

if(typeof submitScore === "function"){
submitScore(match);
}
}

function updateTableData(match){

var home = game.league.teams.find(function(t){ return t.name === match.home; });
var away = game.league.teams.find(function(t){ return t.name === match.away; });

if(!home || !away) return;

home.goalsFor = (home.goalsFor || 0) + match.score.home;
home.goalsAgainst = (home.goalsAgainst || 0) + match.score.away;

away.goalsFor = (away.goalsFor || 0) + match.score.away;
away.goalsAgainst = (away.goalsAgainst || 0) + match.score.home;

if(match.score.home > match.score.away){
home.points = (home.points || 0) + 3;
} else if(match.score.home < match.score.away){
away.points = (away.points || 0) + 3;
} else {
home.points = (home.points || 0) + 1;
away.points = (away.points || 0) + 1;
}
}
