// =========================
// 📅 SPIELPLAN GENERIEREN
// =========================
import { game } from "../core/state.js";

function generateSchedule(){

  const league = game.league?.current;

  if(!league || !Array.isArray(league.teams) || league.teams.length < 2){
    console.error("❌ Ungültige Liga / zu wenig Teams");
    return;
  }

  // 👉 IMMER STRING-NAMEN!
  let teams = league.teams.map(t =>
    typeof t === "string" ? t : t.name
  );

  const originalCount = teams.length;
  const rounds = [];

  // 👉 BYE bei ungerader Anzahl
  if(teams.length % 2 !== 0){
    console.warn("⚠️ Ungerade Liga → BYE");
    teams.push("BYE");
  }

  const totalRounds = teams.length - 1;
  const half = teams.length / 2;

  console.log(`📊 Teams: ${originalCount}`);
  console.log(`📅 Spieltage: ${(teams.length - 1) * 2}`);

  // =========================
  // 🔁 HINRUNDE
  // =========================
  for(let r = 0; r < totalRounds; r++){

    const round = [];

    for(let i = 0; i < half; i++){

      const home = teams[i];
      const away = teams[teams.length - 1 - i];

      if(home !== "BYE" && away !== "BYE"){
        round.push({
          home,
          away,
          result: null,
          _processed: false
        });
      }
    }

    rounds.push(round);

    // 👉 Rotation (stabil!)
    const fixed = teams[0];
    const rest = teams.slice(1);

    rest.unshift(rest.pop());

    teams = [fixed, ...rest];
  }

  // =========================
  // 🔁 RÜCKRUNDE
  // =========================
  const returnRounds = rounds.map(round =>
    round.map(match => ({
      home: match.away,
      away: match.home,
      result: null,
      _processed: false
    }))
  );

  // =========================
  // 🧩 FINAL
  // =========================
  game.league.schedule = [...rounds, ...returnRounds];
  game.league.currentRound = 0;
  game.league.currentMatchIndex = 0;

  console.log("✅ Spielplan erstellt:", game.league.schedule.length);

  validateSchedule(originalCount);
}

// =========================
// 🧪 VALIDIERUNG (FIXED)
// =========================
function validateSchedule(expectedTeamCount){

  const schedule = game.league.schedule;

  if(!schedule?.length){
    console.error("❌ Kein Spielplan vorhanden");
    return;
  }

  const firstRound = schedule[0];

  if(!firstRound?.length){
    console.error("❌ Erster Spieltag leer");
    return;
  }

  const teams = [];

  firstRound.forEach(match => {
    teams.push(match.home);
    teams.push(match.away);
  });

  const unique = new Set(teams);

  console.log("🔍 Teams im Spieltag:", teams.length);
  console.log("🔍 Unique:", unique.size);

  if(teams.length !== unique.size){
    console.error("❌ DUPLIKATE!");
  }

  const expectedMatches = Math.floor(expectedTeamCount / 2);

  if(firstRound.length !== expectedMatches){
    console.error("❌ Falsche Spielanzahl:", firstRound.length);
  } else {
    console.log("✅ Spieltag korrekt:", expectedMatches);
  }
}

// =========================
// 👉 NÄCHSTES SPIEL
// =========================
function nextMatch(){

  const schedule = game.league?.schedule;

  if(!schedule?.length){
    console.warn("❌ Kein Spielplan");
    return null;
  }

  const roundIndex = game.league.currentRound || 0;
  const matchIndex = game.league.currentMatchIndex || 0;

  const round = schedule[roundIndex];

  if(!round?.length){
    console.warn("❌ Spieltag leer");
    return null;
  }

  return round[matchIndex] || null;
}

// =========================
// 👉 WEITER
// =========================
function advanceSchedule(){

  let roundIndex = game.league.currentRound || 0;
  let matchIndex = game.league.currentMatchIndex || 0;

  const schedule = game.league.schedule;

  if(!schedule?.length) return;

  const round = schedule[roundIndex];

  matchIndex++;

  if(matchIndex >= round.length){
    matchIndex = 0;
    roundIndex++;
  }

  game.league.currentRound = roundIndex;
  game.league.currentMatchIndex = matchIndex;
}

// =========================
// 📦 EXPORTS
// =========================
export {
  generateSchedule,
  nextMatch,
  advanceSchedule
};
