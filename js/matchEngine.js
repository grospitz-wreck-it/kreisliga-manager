// =========================
// ⚽ MATCH ENGINE (MODULAR)
// =========================

import { game } from "./core/state.js";
import { emit } from "./events.js";
import { EVENTS } from "./events.constants.js";

import {
  triggerEvent,
  updateEvents,
  getActiveModifiers
} from "./engine/eventSystem.js";

import { applyModifiers } from "./engine/modifierEngine.js";

// =========================
// 🧠 HELPERS
// =========================
function getTeamName(team){
  return typeof team === "string" ? team : team?.name;
}

function getTeamFromTable(name){
  const table = game.league?.current?.table;
  if(!table) return null;
  return table.find(t => t.name === name) || null;
}

function isMyTeam(team){
  return game.team?.selected === getTeamName(team);
}

function isMyMatch(match){
  return isMyTeam(match?.home) || isMyTeam(match?.away);
}

// =========================
// 🎮 INIT MATCH
// =========================
function initMatch(round){

  if(!round || !game.match?.live) return false;

  const live = game.match.live;

  live.minute = 0;
  live.running = true;
  live.score = { home: 0, away: 0 };
  live.events = [];

  let playerMatch = null;

  for(const match of round){
    if(match && isMyMatch(match)){
      playerMatch = match;
      break;
    }
  }

  if(!playerMatch) return false;

  const homeTeam = getTeamFromTable(playerMatch.home);
  const awayTeam = getTeamFromTable(playerMatch.away);

  if(!homeTeam || !awayTeam) return false;

  game.match.current = {
    ...playerMatch,
    home: homeTeam,
    away: awayTeam
  };

  return true;
}

// =========================
// 🤖 ANDERE MATCHES
// =========================
function simulateOtherMatches(round){

  if(!round) return;

  for(const match of round){

    if(!match || match._processed) continue;
    if(isMyMatch(match)) continue;

    const home = Math.floor(Math.random() * 3);
    const away = Math.floor(Math.random() * 3);

    match.result = { home, away };

    applyMatchResult(match);
  }
}

// =========================
// 🔁 MATCH LOOP
// =========================
function runMatchLoop({ onTick, onEnd } = {}){

  const interval = setInterval(() => {

    const live = game.match?.live;

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

    if(onTick) onTick();

    if(live.minute >= 90){
      clearInterval(interval);
      endMatch(onEnd);
    }

  }, 400);
}

// =========================
// 🎲 LIVE EVENTS
// =========================
function simulateLiveEvent(){

  const match = game.match?.current;
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
// 🎯 CHANCE
// =========================
function createChance(match, isHome){

  const team = isHome ? match.home : match.away;
  const opponent = isHome ? match.away : match.home;

  if(!team || !opponent) return;

  const modifiers = getActiveModifiers() || [];

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
// ⚽ GOAL
// =========================
function goal(team, isHome){

  if(!team) return;

  triggerEvent("goal", { team });

  const live = game.match?.live;
  if(!live) return;

  if(isHome){
    live.score.home++;
  } else {
    live.score.away++;
  }

  addEvent("⚽ TOR für " + team.name + "!");
}

// =========================
// ➕ EVENT LOG
// =========================
function addEvent(text){

  const live = game.match?.live;
  if(!live) return;

  live.events.unshift(live.minute + "' - " + text);

  if(live.events.length > 25){
    live.events.pop();
  }
}

// =========================
// 🏁 END MATCH
// =========================
function endMatch(onEnd){

  const match = game.match?.current;
  const live = game.match?.live;

  if(!match || match._processed || !live) return;

  match.result = {
    home: live.score.home,
    away: live.score.away
  };

  applyMatchResult(match);

  if(game.league?.current){
    game.league.current.currentRound++;
  }

  game.match.current = null;
  live.running = false;
  game.phase = "idle";

  emit(EVENTS.MATCH_FINISHED, {
    score: live.score
  });

  if(onEnd) onEnd();
}

// =========================
// 📊 RESULT
// =========================
function applyMatchResult(match){

  if(!match || match._processed) return;

  const home = getTeamFromTable(getTeamName(match.home));
  const away = getTeamFromTable(getTeamName(match.away));

  if(!home || !away) return;

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
  initMatch,
  simulateOtherMatches,
  runMatchLoop
};
