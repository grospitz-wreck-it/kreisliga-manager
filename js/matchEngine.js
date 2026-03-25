// =========================
// ⚽ MATCH ENGINE (FIXED)
// =========================

let interval = null;

// =========================
// 🧠 SIMULATE MATCHDAY
// =========================

function simulateMatchday(){

if(!game.team.selected){
alert("Team wählen!");
return;
}

const matches = game.league.schedule[game.league.currentMatchday];
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

// 👉 gesamten Spieltag speichern
window.currentMatchdayMatches = matches;

// eigenes Match finden
const myMatch = matches.find(m =>
m.home === game.team.selected || m.away === game.team.selected
);

if(!myMatch){
console.error("Kein eigenes Spiel gefunden");
return;
}

// Scores initialisieren
matches.forEach(m => {
if(!m.score){
m.score = { home: 0, away: 0 };
}
});

window.currentMatch = myMatch;

startInterval();
}

// =========================
// ⏱️ INTERVAL
// =========================

function startInterval(){

clearInterval(interval);

interval = setInterval(()=>{

```
if(!game.match.isRunning) return;

game.match.minute++;

simulateMinute();

// 🟡 HALBZEIT
if(game.match.minute === 45){
  game.match.isRunning = false;
  game.phase = "halftime";

  addLiveEvent("⏸ Halbzeit", 45);
  updateMainButton();
  return;
}

// 🔴 ENDE
if(game.match.minute >= 90){
  endMatch();
}
```

}, 1000 / (window.speedMultiplier || 1));
}

// =========================
// 🔁 RESTART INTERVAL
// =========================

function restartInterval(){
startInterval();
}

// =========================
// ▶️ RESUME MATCH
// =========================

function resumeMatch(){

if(game.phase !== "halftime") return;

game.match.isRunning = true;
game.phase = "live";

addLiveEvent("▶ 2. Halbzeit gestartet", game.match.minute);

startInterval();
}

// =========================
// ⏱️ MINUTE SIMULATION
// =========================

function simulateMinute(){

const m = game.match.minute;
const match = window.currentMatch;

if(!match) return;

// 🎯 Torwahrscheinlichkeit
let chance = 0.08;

chance += window.tacticModifier || 0;
chance += window.formationModifier || 0;
chance += window.liveModifier || 0;
chance += window.intensityModifier || 0;

// ⚽ DEIN SPIEL
if(Math.random() < chance){

```
const isHome = Math.random() < 0.5;
const scoringTeam = isHome ? match.home : match.away;

if(isHome) match.score.home++;
else match.score.away++;

addLiveEvent(`⚽ Tor für ${scoringTeam}!`, m);
```

}

// 🤖 ANDERE SPIELE
if(window.currentMatchdayMatches){

```
window.currentMatchdayMatches.forEach(otherMatch => {

  if(otherMatch === match) return;

  if(Math.random() < 0.05){

    if(Math.random() < 0.5) otherMatch.score.home++;
    else otherMatch.score.away++;
  }

});
```

}

// 📢 kleine Events
if(Math.random() < 0.05){
const texts = [
"💥 Chance vergeben",
"🧤 Starke Parade",
"🟨 Gelbe Karte",
"📢 Fans werden laut"
];

```
addLiveEvent(texts[Math.floor(Math.random()*texts.length)], m);
```

}
}

// =========================
// 🏁 MATCH ENDE
// =========================

function endMatch(){

clearInterval(interval);

game.match.isRunning = false;
game.phase = "ready";

const match = window.currentMatch;
if(!match) return;

addLiveEvent(`Endstand: ${match.home} ${match.score.home} - ${match.score.away} ${match.away}`, 90);

// 👉 ALLE Spiele auswerten
if(window.currentMatchdayMatches){
window.currentMatchdayMatches.forEach(m => updateTableData(m));
}

updateTable?.();
updateMainButton();

// optional Leaderboard
if(typeof submitScore === "function"){
submitScore(match);
}
}

// =========================
// 📊 TABELLE UPDATEN
// =========================

function updateTableData(match){

const home = game.league.teams.find(t => t.name === match.home);
const away = game.league.teams.find(t => t.name === match.away);

if(!home || !away) return;

home.goalsFor = (home.goalsFor || 0) + match.score.home;
home.goalsAgainst = (home.goalsAgainst || 0) + match.score.away;

away.goalsFor = (away.goalsFor || 0) + match.score.away;
away.goalsAgainst = (away.goalsAgainst || 0) + match.score.home;

if(match.score.home > match.score.away){
home.points = (home.points || 0) + 3;
}
else if(match.score.home < match.score.away){
away.points = (away.points || 0) + 3;
}
else{
home.points = (home.points || 0) + 1;
away.points = (away.points || 0) + 1;
}
}
