/ =========================
// 📦 IMPORTS
// =========================
import { renderSchedule, updateUI, renderLiveFeed } from "../ui/ui.js";
import { renderTable, renderLiveTable } from "../modules/table.js";
import { game } from "../core/state.js";
import { emit } from "./events.js";
import { EVENTS } from "./events.constants.js";

import { triggerEvent, updateEvents, getActiveModifiers } from "../engine/eventSystem.js";
import { applyModifiers } from "../engine/modifierEngine.js";

// =========================
// 🧠 HELPERS
// =========================
function getTeamName(team){
return typeof team === "string" ? team : team?.name;
}

function getTeamFromTable(name){
const table = game.league?.table;

if(!table || table.length === 0){
console.error("❌ Tabelle nicht initialisiert");
return null;
}

return table.find(t => t.name === name) || null;
}

function isMyTeam(team){
return game.team.selected === getTeamName(team);
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

if(game.match?.live?.running){
console.warn("⚠️ Match läuft bereits");
return;
}

if(!game.team?.selected){
console.error("❌ Kein Team ausgewählt");
return;
}

const schedule = game.league?.schedule;
if(!schedule?.length){
console.error("❌ Kein Spielplan vorhanden");
return;
}

const roundIndex = game.league.currentRound || 0;
const round = schedule[roundIndex];

if(!round?.length){
console.error("❌ Spieltag ungültig:", roundIndex);
return;
}

if(!game.league?.table?.length){
console.error("❌ Tabelle fehlt → initTable vergessen?");
return;
}

const live = game.match.live;

live.minute = 0;
live.running = true;
live.score = { home: 0, away: 0 };
live.events = [];

let playerMatch = null;

for(const match of round){

if(!match || match._processed) continue;

if(isMyMatch(match)){
  playerMatch = match;
  continue;
}

const home = Math.floor(Math.random() * 3);
const away = Math.floor(Math.random() * 3);

match.result = { home, away };

applyMatchResult(match);

}

if(!playerMatch){
console.error("❌ Kein Spiel für dein Team gefunden");
return;
}

const homeTeam = getTeamFromTable(playerMatch.home);
const awayTeam = getTeamFromTable(playerMatch.away);

if(!homeTeam || !awayTeam){
console.error("❌ Teams nicht in Tabelle gefunden", playerMatch);
return;
}

game.match.current = {
...playerMatch,
home: homeTeam,
away: awayTeam
};

game.phase = "live";

emit(EVENTS.GAME_START);

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

if(!live?.running){
  clearInterval(interval);
  return;
}

live.minute++;

updateEvents();

emit(EVENTS.STATE_CHANGED, {
  minute: live.minute
});

simulateLiveEvent();

updateUI();
renderLiveFeed();
renderLiveTable();

if(live.minute >= 90){
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
}

// =========================
// ⚽ CHANCE
// =========================
function createChance(match, isHome){

const team = isHome ? match.home : match.away;
const opponent = isHome ? match.away : match.home;

if(!team || !opponent) return;

const modifiers = getActiveModifiers();

const strengthDiff =
applyModifiers(team.strength || 50, modifiers)
- (opponent.strength || 50);

const chance =
0.5 +
(strengthDiff * 0.015) +
(Math.random() * 0.3);

if(chance > 0.9){
goal(team, isHome);
}
else{
addEvent("🎯 Chance für " + team.name);
}
}

// =========================
// ⚽ TOR
// =========================
function goal(team, isHome){

if(!team) return;

triggerEvent("goal", { team });

const live = game.match.live;

if(isHome){
live.score.home++;
} else {
live.score.away++;
}

addEvent("⚽ TOR für " + team.name + "!");
}

// =========================
// ➕ EVENT
// =========================
function addEvent(text){

const live = game.match.live;
if(!live) return;

live.events.unshift(live.minute + "' - " + text);

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

if(!match || match._processed) return;

const home = getTeamFromTable(getTeamName(match.home));
const away = getTeamFromTable(getTeamName(match.away));

if(!home || !away){
console.error("❌ Team nicht gefunden:", match);
return;
}

const h = match.result?.home ?? 0;
const a = match.result?.away ?? 0;

home.played++;
away.played++;

home.goalsFor += h;
home.goalsAgainst += a;

away.goalsFor += a;
away.goalsAgainst += h;

if(h > a){
home.points += 3;
}
else if(a > h){
away.points += 3;
}
else{
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
