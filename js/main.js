
// =========================
// 📥 LOAD LEAGUE
// =========================
function loadLeague(key){

  const league = LEAGUES[key];
  if(!league){
    console.error("❌ League nicht gefunden:", key);
    return;
  }

  game.league.key = key;

  game.league.teams = league.teams.map(name => ({
    name,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0
  }));

  console.log("✅ Liga geladen:", key, game.league.teams.length, "Teams");

  window.populateTeamSelect?.();
  window.updateTable?.();
  window.updateHeader?.();
}

// =========================
// 🏆 SELECT LEAGUE
// =========================
function selectLeague(key){

  console.log("🏆 selectLeague:", key);

  const league = LEAGUES[key];
  if(!league){
    console.error("❌ Liga nicht gefunden");
    return;
  }

  game.league.key = key;

  // Teams klonen (wichtig!)
  game.league.teams = league.teams.map(name => ({
    name,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0
  }));

  console.log("👥 Teams geladen:", game.league.teams);

function selectLeague(key){

  console.log("🏆 selectLeague:", key);

  game.league.key = key;

  const data = LEAGUES[key];

  game.league.teams = data.teams.map(name => ({
    name,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    played: 0
  }));

  console.log("👥 Teams geladen:", game.league.teams);

  // ❌ KEIN UI HIER MEHR
}
}

// 🌍 EXPORT
window.selectLeague = selectLeague;

// =========================
// ⚽ SELECT TEAM (🔥 HIER FEHLT ES BEI DIR)
// =========================
function selectTeam(){

  const select = document.getElementById("teamSelect");
  if(!select) return;

  const team = select.value;

  game.team.selected = team;

  console.log("✅ Team gewählt:", team);

  window.updateHeader?.();
}

// =========================
// 🌍 EXPORTS
// =========================
window.LEAGUES = LEAGUES;
window.selectLeague = selectLeague;
window.selectTeam = selectTeam;
window.loadLeague = loadLeague;
