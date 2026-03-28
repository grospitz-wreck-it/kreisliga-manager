// =========================
// 📊 TABELLE ERSTELLEN
// =========================
function createTable(){

  if(!game.league.teams) return;

  game.league.table = game.league.teams.map(team => ({
    name: team.name,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    played: 0
  }));

  console.log("📊 Tabelle erstellt:", game.league.table);

  renderTable();
}

// =========================
// 🔄 UPDATE NACH SPIEL
// =========================
function updateTable(homeTeam, awayTeam, homeGoals, awayGoals){

  const table = game.league.table;

  if(!table){
    console.error("❌ Tabelle nicht vorhanden");
    return;
  }

  const home = table.find(t => t.name === homeTeam.name);
  const away = table.find(t => t.name === awayTeam.name);

  if(!home || !away){
    console.error("❌ Team nicht in Tabelle gefunden", homeTeam, awayTeam);
    return;
  }

  // =========================
  // 📊 BASIS
  // =========================
  home.played++;
  away.played++;

  home.goalsFor += homeGoals;
  home.goalsAgainst += awayGoals;

  away.goalsFor += awayGoals;
  away.goalsAgainst += homeGoals;

  // =========================
  // 🏆 ERGEBNIS
  // =========================
  if(homeGoals > awayGoals){
    home.points += 3;
    home.wins++;
    away.losses++;
  }
  else if(homeGoals < awayGoals){
    away.points += 3;
    away.wins++;
    home.losses++;
  }
  else{
    home.points += 1;
    away.points += 1;
    home.draws++;
    away.draws++;
  }

  // =========================
  // ➕ TORDIFFERENZ
  // =========================
  home.goalDiff = home.goalsFor - home.goalsAgainst;
  away.goalDiff = away.goalsFor - away.goalsAgainst;

  sortTable();
  renderTable();
}

// =========================
// 🔃 SORTIERUNG
// =========================
function sortTable(){

  game.league.table.sort((a, b) => {

    // Punkte
    if(b.points !== a.points){
      return b.points - a.points;
    }

    // Tordifferenz
    if(b.goalDiff !== a.goalDiff){
      return b.goalDiff - a.goalDiff;
    }

    // Tore
    if(b.goalsFor !== a.goalsFor){
      return b.goalsFor - a.goalsFor;
    }

    return 0;
  });
}

// =========================
// 🖥️ RENDER
// =========================
function renderTable(){

  const container = document.getElementById("table");
  if(!container) return;

  const table = game.league.table;
  if(!table) return;

  let html = `
    <table style="width:100%; font-size:14px; background:white; border-radius:10px; overflow:hidden;">
      <tr style="background:#2e7d32; color:white;">
        <th>#</th>
        <th>Team</th>
        <th>P</th>
        <th>T</th>
        <th>TD</th>
      </tr>
  `;

  table.forEach((team, i) => {

    const isPlayer = game.team.selected?.name === team.name;

    html += `
      <tr style="
        text-align:center;
        background:${isPlayer ? '#c8e6c9' : 'white'};
      ">
        <td>${i+1}</td>
        <td style="text-align:left; padding-left:6px;">
          ${team.name}
        </td>
        <td>${team.points}</td>
        <td>${team.goalsFor}:${team.goalsAgainst}</td>
        <td>${team.goalDiff}</td>
      </tr>
    `;
  });

  html += `</table>`;

  container.innerHTML = html;
}

// =========================
// 🌍 GLOBAL
// =========================
window.createTable = createTable;
window.updateTable = updateTable;
window.renderTable = renderTable;
