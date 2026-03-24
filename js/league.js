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
function loadLeague(name) {

  teams = [];
  schedule = [];
  currentMatchday = 0;

  if (name === "herford") {
    teams = [
      createTeam("Bünder SV"),
      createTeam("SC Herford"),
      createTeam("TuS Bruchmühlen"),
      createTeam("SV Rödinghausen II"),
      createTeam("FC Exter"),
      createTeam("SV Enger-Westerenger"),
      createTeam("TuRa Löhne"),
      createTeam("FC Herford"),
      createTeam("TSV Löhne"),
      createTeam("SV Oetinghausen"),
      createTeam("SC Vlotho"),
      createTeam("SV Bischofshagen"),
      createTeam("TuS Hunnebrock"),
      createTeam("SV Hiddenhausen"),
      createTeam("FC Schweicheln"),
      createTeam("RW Kirchlengern II")
    ];
  }

  if (name === "luebbecke") {
    teams = [
      createTeam("Gehlenbeck"),
      createTeam("TuSpo Rahden"),
      createTeam("TG Espelkamp"),
      createTeam("SuS Holzhausen"),
      createTeam("FC Lübbecke II"),
      createTeam("FC Oppenwehe"),
      createTeam("TuS Stemwede"),
      createTeam("Union Varl"),
      createTeam("SSV Ströhen"),
      createTeam("Fabbenstedt"),
      createTeam("TuS Tengern II"),
      createTeam("Tonnenheide"),
      createTeam("Pr Espelkamp II"),
      createTeam("TuS Levern"),
      createTeam("Isenstedt"),
      createTeam("TuRa Espelk.")
    ];
  }

  if (name === "bielefeld") {
    teams = [
      createTeam("TuS Jöllenbeck"),
      createTeam("SC Bielefeld"),
      createTeam("BV Werther"),
      createTeam("SG Oesterweg"),
      createTeam("TuS 08 Senne I"),
      createTeam("Schildesche"),
      createTeam("SV Häger"),
      createTeam("Oldentrup"),
      createTeam("TuS Jöllen. II"),
      createTeam("SC Peckeloh II"),
      createTeam("Kosova Bi"),
      createTeam("Ubbedissen"),
      createTeam("TuS Ost Bie."),
      createTeam("Amshausen"),
      createTeam("TuS Quelle"),
      createTeam("Gadderbaum")
    ];
  }

  console.log("Teams geladen:", teams.length);

  generateSchedule(); // 🔥 automatisch erzeugen
}

// =========================
// ⚽ SPIELPLAN (30 SPIELTAGE)
// =========================
function generateSchedule(){

  if(!teams || teams.length === 0){
    console.error("Keine Teams für Spielplan");
    return;
  }

  schedule = [];

  let tempTeams = [...teams];

  // 👉 Dummy bei ungerade
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
        matchday.push([home, away]);
      }
    }

    firstLeg.push(matchday);

    // Rotation (stabil)
    let fixed = tempTeams[0];
    let rest = tempTeams.slice(1);

    rest.unshift(rest.pop());

    tempTeams = [fixed, ...rest];
  }

  // =========================
  // 🔁 RÜCKRUNDE
  // =========================
  let secondLeg = firstLeg.map(matchday =>
    matchday.map(match => [match[1], match[0]])
  );

  // =========================
  // 🧩 KOMBINIEREN
  // =========================
  schedule = [...firstLeg, ...secondLeg];

  // =========================
  // 🔥 AUF 30 SPIELTAGE FIXEN
  // =========================
  while(schedule.length < 30){
    schedule = schedule.concat(schedule);
  }

  schedule = schedule.slice(0, 30);

  console.log("Spielplan erstellt:", schedule.length, "Spieltage");
}
