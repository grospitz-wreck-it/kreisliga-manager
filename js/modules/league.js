console.log("LEAGUE MODULE");

// =========================
// 🏆 LIGEN DATEN (SKALIERBAR)
// =========================
const LEAGUES = {

  kreisliga: {
    name: "Kreisliga",
    teams: [
      "FC Herford",
      "SV Löhne",
      "VfL Bünde",
      "TuS Bruchmühlen",
      "SC Enger",
      "RW Kirchlengern",
      "SpVg Hiddenhausen",
      "TSV Oetinghausen",
      "FC Exter",
      "SV Rödinghausen II",
      "TuRa Löhne",
      "SC Vlotho",
      "FC Bad Oeynhausen",
      "SV Eidinghausen",
      "TuS Jöllenbeck",
      "BW Hollage"
    ]
  }

};

// =========================
// 🏆 LIGA AUSWÄHLEN
// =========================
function selectLeague(){

  const select = document.getElementById("leagueSelect");
  const key = select.value;

  if(!LEAGUES[key]) return;

  game.league.key = key;
  game.league.name = LEAGUES[key].name;

  // 👉 Teams generieren
  game.league.teams = LEAGUES[key].teams.map((name, i) => ({
    id: i,
    name,
    players: generateTeamPlayers(),
    stats: initStats()
  }));

  // 👉 Team Dropdown füllen
  populateTeamSelect();

  saveGame();
  updateHeader();

  console.log("✅ Liga geladen:", game.league.name);
}

// =========================
// ⚽ TEAM DROPDOWN
// =========================
function populateTeamSelect(){

  const select = document.getElementById("teamSelect");
  if(!select) return;

  select.innerHTML = "";

  game.league.teams.forEach(team => {
    const opt = document.createElement("option");
    opt.value = team.id;
    opt.textContent = team.name;
    select.appendChild(opt);
  });
}

// =========================
// ⚽ TEAM AUSWÄHLEN
// =========================
function selectTeam(){

  const select = document.getElementById("teamSelect");
  const id = parseInt(select.value);

  const team = game.league.teams.find(t => t.id === id);
  if(!team) return;

  game.team.id = team.id;
  game.team.name = team.name;
  game.team.players = team.players;

  document.getElementById("selectedTeamText").innerText = team.name;

  saveGame();
  updateHeader();

  console.log("✅ Team gewählt:", team.name);
}

// =========================
// 📊 STATS INIT
// =========================
function initStats(){
  return {
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0
  };
}

// =========================
// 📅 SAISON START
// =========================
function startSeason(){

  if(!game.league.teams.length){
    alert("Bitte Liga wählen!");
    return;
  }

  generateSchedule();

  game.league.currentMatchday = 0;
  game.phase = "ready";

  saveGame();

  console.log("🚀 Saison gestartet");
}

// =========================
// 🌍 EXPORTS
// =========================
window.selectLeague = selectLeague;
window.selectTeam = selectTeam;
window.startSeason = startSeason;
