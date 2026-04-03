// =========================
// 📅 SPIELPLAN GENERIEREN
// =========================
import { game } from "../core/state.js";
function generateSchedule(){

  const originalTeams = game.league.teams;

  if(!originalTeams || originalTeams.length === 0){
    console.warn("❌ Keine Teams vorhanden");
    return;
  }

  // 👉 Referenzen behalten
  let teams = [...originalTeams];

  const rounds = [];

  const originalCount = teams.length;
  const isOdd = teams.length % 2 !== 0;

  // 👉 BYE bei ungerader Anzahl
  if(isOdd){
    console.warn("⚠️ Ungerade Liga → BYE hinzugefügt");
    teams.push({ name: "BYE" });
  }

  const totalRounds = teams.length - 1;
  const half = teams.length / 2;

  console.log(`📊 Teams: ${originalCount}`);
  console.log(`📅 Erwartete Spieltage: ${(originalCount - 1) * 2}`);

  // =========================
  // 🔁 HINRUNDE
  // =========================
  for(let roundIndex = 0; roundIndex < totalRounds; roundIndex++){

    const round = [];

    for(let i = 0; i < half; i++){

      const home = teams[i];
      const away = teams[teams.length - 1 - i];

      if(home.name !== "BYE" && away.name !== "BYE"){
        round.push({
          home,
          away,
          result: null,
          _processed: false
        });
      }
    }

    rounds.push(round);

    // =========================
    // 🔁 ROTATION (Circle Method)
    // =========================
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

  console.log("✅ Spielplan erstellt:", game.league.schedule.length, "Spieltage");

  // =========================
  // 🧪 VALIDIERUNG
  // =========================
  validateSchedule(originalCount);
}

// =========================
// 🧪 VALIDIERUNG (VERBESSERT)
// =========================
function validateSchedule(expectedTeamCount){

  const schedule = game.league.schedule;

  if(!schedule || schedule.length === 0){
    console.error("❌ Kein Spielplan vorhanden");
    return;
  }

  const firstRound = schedule[0];

  if(!firstRound){
    console.error("❌ Kein erster Spieltag");
    return;
  }

  const teams = [];

  firstRound.forEach(match => {
    teams.push(match.home.name);
    teams.push(match.away.name);
  });

  const unique = new Set(teams);

  console.log("🔍 Teams im Spieltag:", teams.length);
  console.log("🔍 Unique Teams:", unique.size);

  // ❌ Doppelte Teams
  if(teams.length !== unique.size){
    console.error("❌ DUPLIKATE IM SPIELTAG!");
  }

  // ❌ Fehlende Teams
  if(unique.size !== expectedTeamCount){
    console.error("❌ NICHT ALLE TEAMS EINGETEILT!");
  }

  // ✅ Spiele pro Spieltag
  const expectedMatches = Math.floor(expectedTeamCount / 2);

  if(firstRound.length !== expectedMatches){
    console.error("❌ Falsche Anzahl Spiele pro Spieltag:", firstRound.length);
  } else {
    console.log("✅ Spiele pro Spieltag korrekt:", expectedMatches);
  }
}

// =========================
// 👉 NÄCHSTES SPIEL
// =========================
function nextMatch(){

  const schedule = game.league.schedule;

  if(!schedule || schedule.length === 0){
    console.warn("❌ Kein Spielplan vorhanden");
    return null;
  }

  const roundIndex = game.league.currentRound;
  const matchIndex = game.league.currentMatchIndex || 0;

  if(roundIndex >= schedule.length){
    console.warn("🏁 Saison beendet");
    return null;
  }

  const round = schedule[roundIndex];

  if(!round || round.length === 0){
    console.warn("❌ Spieltag leer");
    return null;
  }

  return round[matchIndex] || null;
}

// =========================
// 👉 NACH SPIEL WEITER
// =========================
function advanceSchedule(){

  let roundIndex = game.league.currentRound;
  let matchIndex = game.league.currentMatchIndex || 0;

  const schedule = game.league.schedule;

  if(!schedule || !schedule[roundIndex]) return;

  const round = schedule[roundIndex];

  matchIndex++;

  // 👉 nächster Spieltag
  if(matchIndex >= round.length){
    matchIndex = 0;
    roundIndex++;
  }

  game.league.currentRound = roundIndex;
  game.league.currentMatchIndex = matchIndex;
}

export {
  generateSchedule,
  nextMatch,
  advanceSchedule
};
