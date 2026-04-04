// =========================
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
// 🧠 HELPERS (FIXED)
// =========================
function getTeamName(team){
  return typeof team === "string" ? team : team?.name;
}

function getTeamObject(teamName){
  const teams = game.league?.current?.teams;
  if(!teams) return null;

  return teams.find(t =>
    (typeof t === "string" ? t : t.name) === teamName
  );
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
  emit(EVENTS.GAME_START);

  if(!game.team.selected){
    console.error("❌ Kein Team ausgewählt!");
    return;
  }

  const schedule = game.league?.schedule;

  if(!schedule || schedule.length === 0){
    console.error("❌ Kein Spielplan vorhanden");
    return;
  }

  const round = schedule[game.league.currentRound];

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
// ⚽ CHANCE (FIXED)
// =========================
function createChance(match, isHome){

  const teamName = isHome ? match.home : match.away;
  const opponentName = isHome ? match.away : match.home;

  const team = getTeamObject(teamName) || { name: teamName, strength: 50 };
  const opponent = getTeamObject(opponentName) || { name: opponentName, strength: 50 };

  const modifiers = getActiveModifiers();

  const strengthDiff =
    applyModifiers(team.strength || 50, modifiers)
    - (opponent.strength || 50);

  const base = 0.5 + (strengthDiff * 0.015);
  const tacticBonus = getTacticBonus(team);
  const chance = base + tacticBonus + (Math.random() * 0.3);

  if(chance > 0.9){
    goal(team, isHome);
  }
  else if(chance > 0.6){
    addEvent(`🧤 Parade gegen ${getTeamName(team)}`);
  }
  else{
    addEvent(`🎯 Chance für ${getTeamName(team)}`);
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
// ⚽ TOR (FIXED)
// =========================
function goal(team, isHome){

  triggerEvent("goal", { team });

  const live = game.match.live;

  if(isHome){
    live.score.home++;
  } else {
    live.score.away++;
  }

  addEvent(`⚽ TOR für ${getTeamName(team)}!`);

  emit(EVENTS.MATCH_EVENT, {
    type: "goal",
    team: getTeamName(team),
    minute: live.minute
  });
}

// =========================
// 💥 FOUL
// =========================
function createFoul(match){

  const isHome = Math.random() > 0.5;
  const teamName = isHome ? match.home : match.away;

  addEvent(`💥 Foul von ${teamName}`);

  triggerEvent("foul", { team: teamName });

  if(Math.random() > 0.8){
    createPenalty(match, !isHome);
  }
}

// =========================
// 🥅 ELFMETER
// =========================
function createPenalty(match, isHome){

  const teamName = isHome ? match.home : match.away;

  addEvent(`⚠️ Elfmeter für ${teamName}!`);

  triggerEvent("penalty", { team: teamName });

  if(Math.random() < 0.75){
    goal({ name: teamName }, isHome);
    addEvent(`🎯 verwandelt`);
  } else {
    addEvent(`❌ verschossen`);
  }
}

// =========================
// 🚫 ABSEITS
// =========================
function createOffside(match){

  const teamName = Math.random() > 0.5 ? match.home : match.away;

  addEvent(`🚫 Abseits von ${teamName}`);

  triggerEvent("offside", { team: teamName });
}

// =========================
// ➕ EVENT
// =========================
function addEvent(text){

  const live = game.match.live;

  live.events.unshift(`${live.minute}' - ${text}`);

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
// 📊 RESULT (FIXED CORE)
// =========================
function applyMatchResult(match){

  if(match._processed) return;

  const homeTeam = getTeamObject(match.home);
  const awayTeam = getTeamObject(match.away);

  if(!homeTeam || !awayTeam){
    console.error("❌ Team nicht gefunden:", match);
    return;
  }

  const h = match.result.home;
  const a = match.result.away;

  homeTeam.played++;
  awayTeam.played++;

  homeTeam.goalsFor += h;
  homeTeam.goalsAgainst += a;

  awayTeam.goalsFor += a;
  awayTeam.goalsAgainst += h;

  if(h > a){
    homeTeam.wins++;
    awayTeam.losses++;
    homeTeam.points += 3;
  }
  else if(a > h){
    awayTeam.wins++;
    homeTeam.losses++;
    awayTeam.points += 3;
  }
  else{
    homeTeam.draws++;
    awayTeam.draws++;
    homeTeam.points += 1;
    awayTeam.points += 1;
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
