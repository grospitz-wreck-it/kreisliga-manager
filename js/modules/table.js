// =========================
// 📊 TABELLE ERSTELLEN
// =========================
function createTable(){

  if(!game.league.teams) return;

  game.league.table = game.league.teams.map(team => ({
    name: team.name,

    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,

    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,

    points: 0,

    // 🔥 FORM (letzte 5 Spiele)
    form: []
  }));

  console.log("📊 Tabelle erstellt");

  renderTable();
}

// =========================
// 🔄 UPDATE
// =========================
function updateTable(homeTeam, awayTeam, homeGoals, awayGoals){

  const table = game.league.table;

  const home = table.find(t => t.name === homeTeam.name);
  const away = table.find(t => t.name === awayTeam.name);

  if(!home || !away){
    console.error("❌ Team nicht gefunden", homeTeam, awayTeam);
    return;
  }

  // Spiele
  home.played++;
  away.played++;

  // Tore
  home.goalsFor += homeGoals;
  home.goalsAgainst += awayGoals;

  away.goalsFor += awayGoals;
  away.goalsAgainst += homeGoals;

  // Ergebnis
  if(homeGoals > awayGoals){

    home.points += 3;
    home.wins++;
    away.losses++;

    updateForm(home, "W");
    updateForm(away, "L");

  }
  else if(homeGoals < awayGoals){

    away.points += 3;
    away.wins++;
    home.losses++;

    updateForm(away, "W");
    updateForm(home, "L");

  }
  else{

    home.points += 1;
    away.points += 1;

    home.draws++;
    away.draws++;

    updateForm(home, "D");
    updateForm(away, "D");
  }

  // Tordifferenz
  home.goalDiff = home.goalsFor - home.goalsAgainst;
  away.goalDiff = away.goalsFor - away.goalsAgainst;

  sortTable();
  renderTable();
}

// =========================
// 🔥 FORM SYSTEM
// =========================
function updateForm(team, result){

  team.form.unshift(result);

  if(team.form.length > 5){
    team.form.pop();
  }
}

// =========================
// 🔃 SORTIERUNG
// =========================
function sortTable(){

  game.league.teams.sort((a, b) => {

    // Punkte
    if(b.points !== a.points) return b.points - a.points;

    // Tordifferenz
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;
    if(diffB !== diffA) return diffB - diffA;

    // Tore
    if(b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    // Name
    return a.name.localeCompare(b.name);
  });
}

// =========================
// 🎨 FORM ANZEIGE
// =========================
function renderForm(form){

  return form.map(r => {

    if(r === "W") return "🟢";
    if(r === "D") return "🟡";
    if(r === "L") return "🔴";

  }).join("");
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
    <table style="width:100%; font-size:13px; background:white;">
      <tr style="background:#2e7d32; color:white;">
        <th>#</th>
        <th>Team</th>
        <th>Sp</th>
        <th>S</th>
        <th>U</th>
        <th>N</th>
        <th>T</th>
        <th>Diff</th>
        <th>P</th>
        <th>Form</th>
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
        <td>${team.played}</td>
        <td>${team.wins}</td>
        <td>${team.draws}</td>
        <td>${team.losses}</td>
        <td>${team.goalsFor}:${team.goalsAgainst}</td>
        <td>${team.goalDiff}</td>
        <td><b>${team.points}</b></td>
        <td>${renderForm(team.form)}</td>
      </tr>
    `;
  });

  html += `</table>`;

  container.innerHTML = html;
}

// =========================
// 🌍 EXPORT
// =========================
window.createTable = createTable;
window.updateTable = updateTable;
window.renderTable = renderTable;
