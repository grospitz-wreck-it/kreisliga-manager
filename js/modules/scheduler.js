// =========================
// 📅 SPIELPLAN GENERIEREN
// =========================
function generateSchedule(){

  const originalTeams = game.league.teams;

  if(!originalTeams || originalTeams.length === 0){
    console.warn("❌ Keine Teams vorhanden");
    return;
  }

  // 👉 WICHTIG: echte Referenzen behalten
  let teams = [...originalTeams];

  const rounds = [];
  const n = teams.length;

  // ❗ Bei dir sollten es 16 sein → sonst Fehler anzeigen
  if(n % 2 !== 0){
    console.warn("⚠️ Ungerade Anzahl – BYE wird hinzugefügt");
    teams.push({ name: "BYE" });
  }

  const totalRounds = teams.length - 1;
  const half = teams.length / 2;

  // =========================
  // 🔁 HINRUNDE (Circle Method - stabil)
  // =========================
  for(let roundIndex = 0; roundIndex < totalRounds; roundIndex++){

    const round = [];

    for(let i = 0; i < half; i++){

      const home = teams[i];
      const away = teams[teams.length - 1 - i];

      // 👉 BYE ignorieren
      if(home.name !== "BYE" && away.name !== "BYE"){
        round.push({
          home,
          away,
          result: null,
          _processed: false
        });
      }
    }

    // 🔥 DEBUG (kannst du drin lassen)
    if(round.length !== 8 && teams.length === 16){
      console.error("❌ Falsche Anzahl Spiele:", round.length);
    }

    rounds.push(round);

    // =========================
    // 🔁 ROTATION (FIXED + ROTATE REST)
    // =========================
    const fixed = teams[0];
    const rest = teams.slice(1);

    const last = rest.pop();
    rest.unshift(last);

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
  // 🧩 KOMBINIEREN
  // =========================
  game.league.schedule = [...rounds, ...returnRounds];
  game.league.currentRound = 0;
  game.league.currentMatchIndex = 0;

  console.log("📅 Spielplan erstellt:", game.league.schedule.length, "Spieltage");

  // ✅ EXTRA VALIDIERUNG
  validateSchedule();
}

// =========================
// 🧪 VALIDIERUNG (NEU!)
// =========================
function validateSchedule(){

  const firstRound = game.league.schedule[0];

  if(!firstRound){
    console.error("❌ Kein Spieltag vorhanden");
    return;
  }

  const teams = [];

  firstRound.forEach(m => {
    teams.push(m.home.name);
    teams.push(m.away.name);
  });

  console.log("🔍 Teams im Spieltag:", teams.length);

  const unique = new Set(teams);

  console.log("🔍 Unique Teams:", unique.size);

  if(teams.length !== unique.size){
    console.error("❌ DUPLIKATE IM SPIELTAG!");
  }

  if(teams.length !== game.league.teams.length){
    console.error("❌ NICHT ALLE TEAMS IM SPIELTAG!");
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

  const round = game.league.schedule[roundIndex];

  matchIndex++;

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
