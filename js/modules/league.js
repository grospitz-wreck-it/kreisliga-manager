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

// =========================
// 🏆 LIGA DROPDOWN
// =========================
function initLeagueSelect(){

  const select = document.getElementById("leagueSelect");

  select.innerHTML = `<option value="">Liga wählen</option>`;

  Object.keys(LEAGUES).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = LEAGUES[key].name;
    select.appendChild(opt);
  });
}

// =========================
// 👕 TEAM DROPDOWN
// =========================
function populateTeamSelect(){

  const select = document.getElementById("teamSelect");

  select.innerHTML = `<option value="">Team wählen</option>`;

  game.league.teams.forEach(team => {
    const opt = document.createElement("option");
    opt.value = team.name;
    opt.textContent = `${team.name} (Stärke ${team.strength})`;
    select.appendChild(opt);
  });
}

// =========================
// 🏟️ LIGA LADEN
// =========================
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

// =========================
// 👤 TEAM WÄHLEN
// =========================
function selectTeam(teamName){

  const team = game.league.teams.find(t => t.name === teamName);

  if(!team){
    console.error("❌ Team nicht gefunden:", teamName);
    return;
  }

  game.team.selected = team;

  console.log("✅ Team gesetzt:", team.name);
}

// =========================
// 🌍 GLOBAL
// =========================
window.initLeagueSelect = initLeagueSelect;
window.populateTeamSelect = populateTeamSelect;
window.selectLeague = selectLeague;
window.selectTeam = selectTeam;
