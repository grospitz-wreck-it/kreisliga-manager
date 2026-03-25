// =========================
// 📦 LIGEN LISTE (für UI)
// =========================
var leagues = {
  herford: "Kreisliga Herford",
  luebbecke: "Kreisliga Lübbecke",
  bielefeld: "Kreisliga Bielefeld"
};

// =========================
// 🏗️ TEAM ERSTELLEN
// =========================
function createTeam(name){
  return {
    name: name,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    played: 0
  };
}

// =========================
// 🏟️ LIGA LADEN
// =========================
function loadLeague(name){

  game.league.key = name;
  game.league.teams = [];
  game.league.schedule = [];
  game.league.currentMatchday = 0;

  let t = [];

  // =========================
  // 🏟️ HERFORD
  // =========================
  if (name === "herford") {
    t = [
      "Bünder SV","SC Herford","TuS Bruchmühlen","SV Rödinghausen II",
      "FC Exter","SV Enger-Westerenger","TuRa Löhne","FC Herford",
      "TSV Löhne","SV Oetinghausen","SC Vlotho","SV Bischofshagen",
      "TuS Hunnebrock","SV Hiddenhausen","FC Schweicheln","RW Kirchlengern II"
    ];
  }

  // =========================
  // 🏟️ LÜBBECKE
  // =========================
  else if (name === "luebbecke") {
    t = [
      "Gehlenbeck","TuSpo Rahden","TG Espelkamp","SuS Holzhausen",
      "FC Lübbecke II","FC Oppenwehe","TuS Stemwede","Union Varl",
      "SSV Ströhen","Fabbenstedt","TuS Tengern II","Tonnenheide",
      "Pr Espelkamp II","TuS Levern","Isenstedt","TuRa Espelk."
    ];
  }

  // =========================
  // 🏟️ BIELEFELD
  // =========================
  else if (name === "bielefeld") {
    t = [
      "TuS Jöllenbeck","SC Bielefeld","BV Werther","SG Oesterweg",
      "TuS 08 Senne I","Schildesche","SV Häger","Oldentrup",
      "TuS Jöllen. II","SC Peckeloh II","Kosova Bi","Ubbedissen",
      "TuS Ost Bie.","Amshausen","TuS Quelle","Gadderbaum"
    ];
  }

  // =========================
  // ❌ FALLBACK
  // =========================
  if(t.length === 0){
    console.error("❌ Unbekannte Liga:", name);
    alert("Liga nicht gefunden!");
    return;
  }

  // =========================
  // 🧱 TEAMS ERSTELLEN
  // =========================
  game.league.teams = t.map(createTeam);

  // =========================
  // ⚽ SPIELPLAN
  // =========================
  generateSchedule();

  // =========================
  // 💾 SAVE
  // =========================
  saveGameState?.();

  console.log("✅ Liga geladen:", name, game.league.teams.length, "Teams");
}

// =========================
// ⚽ SPIELPLAN (30 SPIELTAGE)
// =========================
function generateSchedule(){

  if(!game.league.teams || game.league.teams.length === 0){
    console.error("Keine Teams für Spielplan");
    return;
  }

  let tempTeams = [...game.league.teams];

  // Dummy bei ungerade
  if(tempTeams.length % 2 !== 0){
    tempTeams.push({ name: "SPIELFREI" });
  }

  const rounds = tempTeams.length - 1;
  const half = tempTeams.length / 2;

  let firstLeg = [];

  // =========================
  // 🔁 HINRUNDE
  // =========================
  for(let round = 0; round < rounds; round++){

    let matchday = [];

    for(let i = 0; i < half; i++){

      let home = tempTeams[i];
      let away = tempTeams[tempTeams.length - 1 - i];

      if(home.name !== "SPIELFREI" && away.name !== "SPIELFREI"){
        matchday.push({
          home: home.name,
          away: away.name
        });
      }
    }

    firstLeg.push(matchday);

    // Rotation
    let fixed = tempTeams[0];
    let rest = tempTeams.slice(1);

    rest.unshift(rest.pop());

    tempTeams = [fixed, ...rest];
  }

  // =========================
  // 🔁 RÜCKRUNDE
  // =========================
  let secondLeg = firstLeg.map(md =>
    md.map(m => ({
      home: m.away,
      away: m.home
    }))
  );

  // =========================
  // 🧩 KOMBINIEREN
  // =========================
  let fullSchedule = [...firstLeg, ...secondLeg];

  // Auf 30 Spieltage begrenzen
  while(fullSchedule.length < 30){
    fullSchedule = fullSchedule.concat(fullSchedule);
  }

  game.league.schedule = fullSchedule.slice(0, 30);

  console.log("✅ Spielplan erstellt:", game.league.schedule.length);
}
