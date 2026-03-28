// =========================
// 📊 TABELLE ERSTELLEN
// =========================
function createTable(){

  game.league.teams.forEach(team => {
    team.points = 0;
    team.goalsFor = 0;
    team.goalsAgainst = 0;
    team.wins = 0;
    team.draws = 0;
    team.losses = 0;
    team.played = 0;
  });

  renderTable();
}

// =========================
// 📊 TABELLE UPDATEN
// =========================
function updateTable(match){

  if(!match || !match.result){
    console.warn("❌ Kein Match/Result für Tabelle");
    return;
  }

  const home = game.league.teams.find(t => t.name === match.home.name);
  const away = game.league.teams.find(t => t.name === match.away.name);

  if(!home || !away){
    console.error("❌ Team nicht gefunden", match.home, match.away);
    return;
  }

  const hg = match.result.home;
  const ag = match.result.away;

  // Spiele
  home.played++;
  away.played++;

  // Tore
  home.goalsFor += hg;
  home.goalsAgainst += ag;

  away.goalsFor += ag;
  away.goalsAgainst += hg;

  // Punkte
  if(hg > ag){
    home.wins++;
    home.points += 3;
    away.losses++;
  }
  else if(ag > hg){
    away.wins++;
    away.points += 3;
    home.losses++;
  }
  else{
    home.draws++;
    away.draws++;
    home.points += 1;
    away.points += 1;
  }

  renderTable();
}

// =========================
// 📊 TABELLE RENDERN
// =========================
function renderTable(){

  const el = document.getElementById("table");

  if(!el) return;

  const teams = [...game.league.teams].sort((a,b) => {
    if(b.points !== a.points) return b.points - a.points;

    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;

    if(diffB !== diffA) return diffB - diffA;

    return b.goalsFor - a.goalsFor;
  });

  let html = `
    <table style="width:100%; font-size:14px">
      <tr>
        <th>#</th>
        <th>Team</th>
        <th>Sp</th>
        <th>T</th>
        <th>Diff</th>
        <th>Pkt</th>
      </tr>
  `;

  teams.forEach((t, i) => {

    const diff = t.goalsFor - t.goalsAgainst;

    let style = "";

    // 🟢 Aufstieg
    if(i < 2){
      style = "background:#c8e6c9";
    }

    // 🔴 Abstieg
    if(i >= teams.length - 2){
      style = "background:#ffcdd2";
    }

    html += `
      <tr style="${style}">
        <td>${i+1}</td>
        <td>${t.name}</td>
        <td>${t.played}</td>
        <td>${t.goalsFor}:${t.goalsAgainst}</td>
        <td>${diff}</td>
        <td><b>${t.points}</b></td>
      </tr>
    `;
  });

  html += "</table>";

  el.innerHTML = html;
}

// =========================
// 🌍 GLOBAL
// =========================
window.createTable = createTable;
window.updateTable = updateTable;
window.renderTable = renderTable;
