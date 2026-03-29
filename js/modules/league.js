// =========================
// 📦 LIGEN DATEN
// =========================
window.LEAGUES = {
  herford: {
    name: "Kreisliga A Herford",
    teams: [
      "VfL Holsen II",
      "TSV Löhne",
      "SV Oetinghausen",
      "FC Exter",
      "FC Herford",
      "TuRa Löhne",
      "TuS Hunnebrock",
      "TuS Bardüttingdorf-Wallenbrück",
      "TuS Dünne",
      "SV Bischofshagen-Wittel",
      "FC Schweicheln",
      "SG FA Herringhausen/Eickum II",
      "Bünder SV",
      "SC Enger",
      "RW Kirchlengern II",
      "SpVg Hiddenhausen"
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

  // 🔥 EVENT FIX
  select.onchange = function(){
    selectLeague(this.value);
  };
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

  // 🔥 EVENT FIX
  select.onchange = function(){
    selectTeam(this.value);
  };
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
    tactic: "balanced",
    form: [],
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    played: 0
  }));

  if(game.league.teams.length !== 16){
    console.error("❌ FALSCHE TEAMANZAHL:", game.league.teams.length);
  } else {
    console.log("✅ Teams erstellt:", game.league.teams.length);
  }

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
  // 📊 UI
  // =========================
  renderTable?.();
  populateTeamSelect();
  renderSchedule?.();
}

// =========================
// 👤 TEAM WÄHLEN (🔥 FIX)
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

  // 🔥 WICHTIG: STRING statt Objekt!
  game.team.selected = team.name;

  // optional für Spiel-Logik
  game.team.data = team;

  console.log("✅ Team gewählt:", team.name);

  const tacticSelect = document.getElementById("tacticSelect");
  if(tacticSelect){
    tacticSelect.value = team.tactic;
  }

  renderCurrentMatch?.();
}

// =========================
// 🌍 EXPORTS
// =========================
window.initLeagueSelect = initLeagueSelect;
window.populateTeamSelect = populateTeamSelect;
window.selectLeague = selectLeague;
window.selectTeam = selectTeam;
