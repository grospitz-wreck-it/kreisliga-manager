const LEAGUES = {
  herford: {
    name: "Kreisliga A Herford",
    teams: [
      "SC Herford","FC Exter","TuS Bruchmühlen","SV Enger-Westerenger",
      "SV Rödinghausen II","TuS Jöllenbeck II","VfL Holsen","SV Oetinghausen",
      "FC Herford","TuS Hunnebrock","SC Vlotho","TuS Bardüttingdorf",
      "SV Löhne-Obernbeck","TuS Dünne","SV Bischofshagen","FC Schweicheln"
    ]
  },
  luebbecke: {
    name: "Kreisliga A Lübbecke",
    teams: [
      "TuS Tengern II","FC Lübbecke","SV Börninghausen","TuS Gehlenbeck",
      "FC Preußen Espelkamp II","SV Hüllhorst","TuS Dielingen",
      "SV Schnathorst","FC Oppenwehe","TuS Nettelstedt",
      "SV Rahden","TuS Stemwede","SV Hüllhorst II",
      "FC Bad Oeynhausen II","SV Holzhausen","TuS Levern"
    ]
  },
  bielefeld: {
    name: "Kreisliga A Bielefeld",
    teams: [
      "TuS Dornberg II","VfR Wellensiek","SC Hicret Bielefeld",
      "TuS Brake","VfB Fichte Bielefeld","SC Bielefeld",
      "TuS Quelle II","SV Gadderbaum","FC Hilal Spor",
      "TuS Einigkeit","SV Ubbedissen","SC Stieghorst",
      "VfL Oldentrup","TuS Ost","SV Heepen","FC Türk Sport"
    ]
  }
};

// =========================
// 🏆 Liga wählen
// =========================
function selectLeague(key){

  const data = LEAGUES[key];

  game.league.key = key;

  game.league.teams = data.teams.map(name => ({
    name,
    strength: Math.floor(Math.random() * 30) + 60
  }));

  game.league.currentRound = 0;

  createTable();
  generateSchedule();
  populateTeamSelect();

  console.log("✅ Liga geladen:", data.name);
}

window.selectLeague = selectLeague;

// =========================
// 👕 TEAM wählen (FIX!)
// =========================
function selectTeam(teamName){

  const team = game.league.teams.find(t => t.name === teamName);

  if(!team){
    console.error("❌ Team nicht gefunden:", teamName);
    return;
  }

  // 🔥 NUR NAME SPEICHERN
  game.team.selected = team.name;

  console.log("✅ Team gewählt:", team.name);
}

window.selectTeam = selectTeam;

window.selectTeam = selectTeam;
