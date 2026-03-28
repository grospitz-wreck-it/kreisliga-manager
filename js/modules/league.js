// =========================
// 📦 LIGEN DATEN
// =========================
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
  if(!select) return;

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
  if(!select) return;

  select.innerHTML = `<option value="">Team wählen</option>`;

  if(!game.league.teams) return;

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

  if(!data){
    console.error("❌ Liga nicht gefunden:", key);
    return;
  }

  // Reset
  game.league.key = key;
  game.league.currentRound = 0;
  game.team.selected = null;
  game.match.current = null;

  // =========================
  // 🧱 TEAMS ERSTELLEN
  // =========================
  game.league.teams = data.teams.map(name => ({
    name,
    strength: Math.floor(Math.random() * 30) + 60,

    // 🔥 TAKTIK
    tactic: "balanced",

    // 📊 STATS
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    played: 0
  }));

  console.log("✅ Teams erstellt:", game.league.teams);

  // =========================
  // ⚽ SPIELPLAN
  // =========================
  generateSchedule();

  if(!game.league.schedule || game.league.schedule.length === 0){
    console.error("❌ Spielplan fehlgeschlagen!");
    return;
  }

  console.log("📅 Spielplan ready:", game.league.schedule.length);

  // =========================
  // 📊 UI UPDATES
  // =========================
  createTable?.();
  populateTeamSelect();
  renderSchedule?.();
}

// =========================
// 👤 TEAM WÄHLEN
// =========================
function selectTeam(teamName){

  if(!game.league.teams){
    console.error("❌ Keine Teams geladen");
    return;
  }

  const team = game.league.teams.find(t => t.name === teamName);

  if(!team){
    console.error("❌ Team nicht gefunden:", teamName);
    return;
  }

  game.team.selected = team;

  console.log("✅ Team gewählt:", team.name);

  // Optional direkt anzeigen
  renderCurrentMatch?.();
}

// =========================
// 🌍 GLOBAL EXPORTS
// =========================
window.initLeagueSelect = initLeagueSelect;
window.populateTeamSelect = populateTeamSelect;
window.selectLeague = selectLeague;
window.selectTeam = selectTeam;
