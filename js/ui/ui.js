console.log("UI START");

// =========================
// 🏆 LEAGUE SELECT
// =========================
function initLeagueSelect(){

  const select = document.getElementById("leagueSelect");
  if(!select) return;

  select.innerHTML = "";

  Object.entries(LEAGUES).forEach(([key, val]) => {

    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = val.name;

    select.appendChild(opt);
  });
}

// =========================
// 📋 TEAM DROPDOWN
// =========================
function populateTeamSelect(){

  console.log("🔥 populateTeamSelect CALLED");

  const select = document.getElementById("teamSelect");
  if(!select) return;

  select.innerHTML = "";

  if(!game.league.teams || game.league.teams.length === 0){
    console.warn("⚠️ Keine Teams vorhanden");
    return;
  }

  game.league.teams.forEach(team => {

    const opt = document.createElement("option");
    opt.value = team.name;
    opt.textContent = team.name;

    select.appendChild(opt);
  });
}

// =========================
// 📊 TABELLE
// =========================
function updateTable(){

  const table = document.querySelector("#table tbody");
  if(!table) return;

  table.innerHTML = "";

  const teams = game.league.teams;
  if(!teams || teams.length === 0) return;

  const sorted = [...teams].sort((a,b)=> b.points - a.points);

  sorted.forEach((team, index)=>{

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index+1}</td>
      <td>${team.name}</td>
      <td>${team.played}</td>
      <td>${team.wins}</td>
      <td>${team.draws}</td>
      <td>${team.losses}</td>
      <td>${team.goalsFor}:${team.goalsAgainst}</td>
      <td>${team.goalsFor - team.goalsAgainst}</td>
      <td>${team.points}</td>
    `;

    table.appendChild(row);
  });
}

// =========================
// 🌍 EXPORTS
// =========================
window.initLeagueSelect = initLeagueSelect;
window.populateTeamSelect = populateTeamSelect;
window.updateTable = updateTable;
