// =========================
// 📦 IMPORTS
// =========================
import { renderSchedule, updateUI, renderLiveFeed } from "../ui/ui.js";
import { renderTable, renderLiveTable } from "../modules/table.js";
import { game } from "../core/state.js";
import { emit } from "./events.js";
import { EVENTS } from "./events.constants.js";

// 🆕 NEW
import { triggerEvent, updateEvents, getActiveModifiers } from "..engine/eventSystem.js";
import { applyModifiers } from "./modifierEngine.js";

// =========================
// 🧠 HELPERS
// =========================
function isMyTeam(team){
return game.team.selected && team.name === game.team.selected;
}

function isMyMatch(match){
return isMyTeam(match.home) || isMyTeam(match.away);
}

// =========================
// ▶️ BUTTON
// =========================
function handleMainAction(){
if(game.phase !== "live"){
startMatch();
}
}

// =========================
// 🏁 START MATCH
// =========================
function startMatch(){

console.log("🚀 Spiel wird gestartet...");
emit(EVENTS.GAME_START);

if(!game.team.selected){
console.error("❌ Kein Team ausgewählt!");
return;
}

const round = game.league.schedule[game.league.currentRound];

if(!round){
console.warn("❌ Kein Spieltag gefunden");
return;
}

const live = game.match.live;
live.minute = 0;
live.running = true;
live.score = { home: 0, away: 0 };
live.events = [];

let playerMatch = null;

round.forEach(match => {

if(isMyMatch(match)){
  playerMatch = match;
  return;
}

const home = Math.floor(Math.random() * 3);
const away = Math.floor(Math.random() * 3);

match.result = { home, away };
applyMatchResult(match);

});

if(!playerMatch){
console.error("❌ Kein Spiel für dein Team gefunden");
return;
}

game.match.current = playerMatch;
game.phase = "live";

renderSchedule();
renderTable();

runMatchLoop();
}

// =========================
// 🔁 MATCH LOOP
// =========================
function runMatchLoop(){

const interval = setInterval(() => {

const live = game.match.live;

if(!live.running){
  clearInterval(interval);
  return;
}

live.minute++;

// 🆕 EVENT SYSTEM UPDATE
updateEvents();

emit(EVENTS.STATE_CHANGED, {
  minute: live.minute
});

simulateLiveEvent();

updateUI();
renderLiveFeed();
renderLiveTable();

if(live.minute > 90){
  clearInterval(interval);
  endMatch();
}

}, 400);
}

// =========================
// 🎲 EVENTS
// =========================
function simulateLiveEvent(){

const match = game.match.current;
if(!match) return;

const rand = Math.random();

if(rand < 0.15){
createChance(match, true);
}
else if(rand < 0.30){
createChance(match, false);
}
else if(rand < 0.38){
createFoul(match);
}
else if(rand < 0.42){
createOffside(match);
}
}

// =========================
// ⚽ CHANCE
// =========================
function createChance(match, isHome){

const team = isHome ? match.home : match.away;
const opponent = isHome ? match.away : match.home;

// 🆕 Modifier System
const modifiers = getActiveModifiers();

const strengthDiff =
  applyModifiers(team.strength, modifiers)
  - opponent.strength;

const base = 0.5 + (strengthDiff * 0.015);
const tacticBonus = getTacticBonus(team);
const chance = base + tacticBonus + (Math.random() * 0.3);

if(chance > 0.9){
goal(team, isHome);
}
else if(chance > 0.6){
addEvent(`🧤 Parade gegen ${team.name}`);
}
else{
addEvent(`🎯 Chance für ${team.name}`);
}
}

// =========================
// 🧠 TAKTIK
// =========================
function getTacticBonus(team){
switch(team.tactic){
case "offensive": return 0.08;
case "defensive": return -0.05;
case "pressing": return 0.05;
case "counter": return 0.03;
default: return 0;
}
}

// =========================
// ⚽ TOR
// =========================
function goal(team, isHome){

// 🆕 Event triggern
triggerEvent("goal", { team });

const live = game.match.live;

if(isHome){
live.score.home++;
} else {
live.score.away++;
}

addEvent(`⚽ TOR für ${team.name}!`);

emit(EVENTS.MATCH_EVENT, {
type: "goal",
team: team.name,
minute: live.minute
});
}

// =========================
// 💥 FOUL
// =========================
function createFoul(match){

const isHome = Math.random() > 0.5;
const team = isHome ? match.home : match.away;

addEvent(`💥 Foul von ${team.name}`);

// 🆕 Event System
triggerEvent("foul", { team });

if(Math.random() > 0.8){
createPenalty(match, !isHome);
}
}

// =========================
// 🥅 ELFMETER
// =========================
function createPenalty(match, isHome){

const team = isHome ? match.home : match.away;

addEvent(`⚠️ Elfmeter für ${team.name}!`);

// 🆕 Event System
triggerEvent("penalty", { team });

if(Math.random() < 0.75){
goal(team, isHome);
addEvent(`🎯 verwandelt`);
} else {
addEvent(`❌ verschossen`);
}
}

// =========================
// 🚫 ABSEITS
// =========================
function createOffside(match){

const team = Math.random() > 0.5 ? match.home : match.away;

addEvent(`🚫 Abseits von ${team.name}`);

// 🆕
triggerEvent("offside", { team });
}

// =========================
// ➕ EVENT
// =========================
function addEvent(text){

const live = game.match.live;

live.events.unshift(
`${live.minute}' - ${text}`
);

emit(EVENTS.MATCH_EVENT, {
type: "generic",
text,
minute: live.minute
});

if(live.events.length > 25){
live.events.pop();
}
}

// =========================
// 🏁 ENDE
// =========================
function endMatch(){

const match = game.match.current;
const live = game.match.live;

if(!match || match._processed) return;

match.result = {
home: live.score.home,
away: live.score.away
};

applyMatchResult(match);

game.league.currentRound++;
game.match.current = null;
live.running = false;
game.phase = "idle";

renderTable();
renderSchedule();

console.log("✅ Spiel beendet");

emit(EVENTS.MATCH_FINISHED, {
score: live.score
});
}

// =========================
// 📊 RESULT
// =========================
function applyMatchResult(match){

if(match._processed) return;

const home = match.home;
const away = match.away;

const h = match.result.home;
const a = match.result.away;

home.played++;
away.played++;

home.goalsFor += h;
home.goalsAgainst += a;

away.goalsFor += a;
away.goalsAgainst += h;

if(h > a){
home.wins++;
away.losses++;
home.points += 3;
}
else if(a > h){
away.wins++;
home.losses++;
away.points += 3;
}
else{
home.draws++;
away.draws++;
home.points += 1;
away.points += 1;
}

match._processed = true;
}

// =========================
// 📦 EXPORTS
// =========================
export {
startMatch,
handleMainAction
};
