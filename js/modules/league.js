// =========================
// 🏟️ LEAGUE DATA
// =========================
const LEAGUES = {

  herford: {
    name: "Kreisliga Herford",
    teams: [
      "SC Herford","FC Löhne","SV Enger","TuS Bruchmühlen",
      "VfL Holsen","RW Kirchlengern","TuS Hücker","SV Rödinghausen II",
      "FC Exter","TuS Bardüttingdorf","SC Vlotho","FC Herford",
      "SV Bünde","TuS Dünne","RW Dreyen","FC Schweicheln"
    ]
  },

  luebbecke: {
    name: "Kreisliga Lübbecke",
    teams: [
      "TuS Nettelstedt","FC Preußen Espelkamp","VfL Frotheim","TuS Gehlenbeck",
      "SV Hüllhorst","BW Oberbauerschaft","FC Lübbecke","TuS Rahden",
      "SV Tengern II","FC Oppenwehe","TuS Stemwede","SV Börninghausen",
      "FC Fabbenstedt","TuS Dielingen","SV Blasheim","RW Ahlsen"
    ]
  }

};

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
function selectLeague(){

  const select = document.getElementById("leagueSelect");
  if(!select) return;

  const key = select.value;

  console.log("SELECTED:", key);

  if(!LEAGUES[key]){
    console.error("❌ Ungültige Liga");
    return;
  }

  loadLeague(key);
}

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
