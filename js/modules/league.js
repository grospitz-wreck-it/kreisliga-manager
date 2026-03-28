const LEAGUES = {
  herford: {
    name: "Kreisliga A Herford",
    teams: [
      "SC Herford","FC Exter","TuS Bruchmühlen","SV Enger-Westerenger",
      "SV Rödinghausen II","TuS Jöllenbeck II","VfL Holsen","SV Oetinghausen",
      "FC Herford","TuS Hunnebrock","SC Vlotho","TuS Bardüttingdorf",
      "SV Löhne-Obernbeck","TuS Dünne","SV Bischofshagen","FC Schweicheln"
    ]
  }
};

function selectLeague(key){

  const data = LEAGUES[key];

  game.league.key = key;

  game.league.teams = data.teams.map(name => ({
    name,
    strength: Math.floor(Math.random() * 30) + 60,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    played: 0
  }));

  game.league.currentRound = 0;

  generateSchedule();

  createTable();
  populateTeamSelect();
  renderSchedule();
}

function selectTeam(teamName){

  const team = game.league.teams.find(t => t.name === teamName);

  if(!team){
    console.error("❌ Team nicht gefunden:", teamName);
    return;
  }

  game.team.selected = team; // 🔥 OBJEKT

  console.log("✅ Team gesetzt:", team.name);
}

window.selectLeague = selectLeague;
window.selectTeam = selectTeam;
