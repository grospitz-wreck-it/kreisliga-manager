// =========================
// 📅 SPIELPLAN GENERIEREN
// =========================
function generateSchedule(){

  const originalTeams = game.league.teams;

  if(!originalTeams || originalTeams.length === 0){
    console.warn("❌ Keine Teams vorhanden");
    return;
  }

  let teams = [...originalTeams]; // nur Array kopieren

  const rounds = [];

  // Bei ungerader Anzahl Dummy
  if(teams.length % 2 !== 0){
    teams.push({ name: "BYE" });
  }

  const totalRounds = teams.length - 1;
  const half = teams.length / 2;

  // =========================
  // 🔁 HINRUNDE
  // =========================
  for(let roundIndex = 0; roundIndex < totalRounds; roundIndex++){

    const round = [];

    for(let i = 0; i < half; i++){

      const home = teams[i];
      const away = teams[teams.length - 1 - i];

      if(home && away && home.name !== "BYE" && away.name !== "BYE"){
        round.push({
          home: home,   // ✅ REFERENZ
          away: away,   // ✅ REFERENZ
          result: null
        });
      }
    }

    rounds.push(round);

    // ✅ KORREKTE ROTATION (Circle Method)
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
      home: match.away, // gleiche Referenzen
      away: match.home,
      result: null
    }))
  );

  // =========================
  // 🧩 KOMBINIEREN
  // =========================
  game.league.schedule = [...rounds, ...returnRounds];
  game.league.currentRound = 0;
  game.league.currentMatchIndex = 0;

  console.log("📅 Spielplan erstellt:", game.league.schedule.length, "Spieltage");
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

  const match = round[matchIndex];

  if(!match){
    console.warn("❌ Kein Spiel gefunden");
    return null;
  }

  return match;
}

// =========================
// 👉 NACH SPIEL WEITER
// =========================
function advanceSchedule(){

  let roundIndex = game.league.currentRound;
  let matchIndex = game.league.currentMatchIndex || 0;

  const round = game.league.schedule[roundIndex];

  matchIndex++;

  // Wenn Spieltag fertig → nächster Spieltag
  if(matchIndex >= round.length){
    matchIndex = 0;
    roundIndex++;
  }

  game.league.currentRound = roundIndex;
  game.league.currentMatchIndex = matchIndex;
}

// =========================
// 🌍 GLOBAL
// =========================
window.generateSchedule = generateSchedule;
window.nextMatch = nextMatch;
window.advanceSchedule = advanceSchedule;
