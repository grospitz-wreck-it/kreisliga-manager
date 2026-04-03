// =========================
// 🌍 MATCH STATE
// =========================
import { renderSchedule } from "../ui/ui.js";
import { emit } from "./events.js";
import { EVENTS } from "./events.constants.js";
const matchState = {
  minute: 0,
  running: false,
  score: { home: 0, away: 0 },
  events: [],
};

// =========================
// 🧠 HELPERS
// =========================
function isMyTeam(team){
  return game.team.selected && team.name === game.team.selected;
}

function isMyMatch(match){
  return (
    isMyTeam(match.home) ||
    isMyTeam(match.away)
  );
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

  // 🔥 WICHTIG: Team gewählt?
  if(!game.team.selected){
    console.error("❌ Kein Team ausgewählt!");
    return;
  }

  const round = game.league.schedule?.[game.league.currentRound];

  if(!round){
    console.warn("❌ Kein Spieltag gefunden");
    return;
  }

  console.log("👉 Dein Team:", game.team.selected);

  // RESET
  matchState.minute = 0;
  matchState.running = true;
  matchState.score = { home: 0, away: 0 };
  matchState.events = [];

  let playerMatch = null;

  round.forEach(match => {

    // ✅ NEUE LOGIK
    if(isMyMatch(match)){
      playerMatch = match;
      return;
    }

    // 👉 andere Spiele simulieren
    const home = Math.floor(Math.random()*3);
    const away = Math.floor(Math.random()*3);

    match.result = { home, away };
    applyMatchResult(match);
  });

  if(!playerMatch){
    console.error("❌ Kein Spiel für dein Team gefunden");
    console.log("DEBUG Matches:", round);
    return;
  }

  console.log("✅ Spiel gefunden:", playerMatch.home.name, "vs", playerMatch.away.name);

  game.match.current = playerMatch;
  game.phase = "live";

  renderSchedule?.();
  renderTable?.();

  runMatchLoop();
}

// =========================
// 🔁 MATCH LOOP
// =========================
function runMatchLoop(){

  const interval = setInterval(() => {

    if(!matchState.running){
      clearInterval(interval);
      return;
    }

    matchState.minute++;
    emit(EVENTS.STATE_CHANGED, {
  minute: matchState.minute
});
    simulateLiveEvent();

    updateUI?.();
    renderLiveFeed?.();
    renderLiveTable?.();

    if(matchState.minute > 90){
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

  const strengthDiff = team.strength - opponent.strength;

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

  if(isHome){
    matchState.score.home++;
  } else {
    matchState.score.away++;
  }

  const text = `⚽ TOR für ${team.name}!`;

addEvent(text);

emit(EVENTS.MATCH_EVENT, {
  type: "goal",
  team: team.name,
  minute: matchState.minute
});
}

// =========================
// 💥 FOUL
// =========================
function createFoul(match){

  const isHome = Math.random() > 0.5;
  const team = isHome ? match.home : match.away;

  addEvent(`💥 Foul von ${team.name}`);

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
}

// =========================
// ➕ EVENT
// =========================
function addEvent(text){

  matchState.events.unshift(
    `${matchState.minute}' - ${text}`
  );

  emit(EVENTS.MATCH_EVENT, {
    type: "generic",
    text,
    minute: matchState.minute
  });

  if(matchState.events.length > 25){
    matchState.events.pop();
  }
}

// =========================
// 🏁 ENDE
// =========================
function endMatch(){

  const match = game.match.current;

  if(!match) return;
  if(match._processed) return;

  match.result = {
    home: matchState.score.home,
    away: matchState.score.away
  };

  applyMatchResult(match);

  game.league.currentRound++;
  game.match.current = null;
  matchState.running = false;
  game.phase = "idle";

  renderTable?.();
  renderSchedule?.();

  console.log("✅ Spiel beendet");
  emit(EVENTS.MATCH_FINISHED, {
  score: matchState.score
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
// 🌍 GLOBAL
// =========================
window.startMatch = startMatch;
window.handleMainAction = handleMainAction;
