// =========================
// 📊 TABELLE
// =========================

function updateTable(){

  const table = document.getElementById("leagueTable");
  if(!table) return;

  table.innerHTML = "";

  if(!game.league.teams || game.league.teams.length === 0){
    console.warn("Keine Teams für Tabelle");
    return;
  }

  // Sortierung
  const sorted = [...game.league.teams].sort((a,b)=>{
    if(b.points !== a.points) return b.points - a.points;
    return (b.goalDiff || 0) - (a.goalDiff || 0);
  });

  sorted.forEach((team, index)=>{

    const row = document.createElement("tr");

    const isPlayer = team.name === game.team.selected;

    row.innerHTML = `
      <td>${index + 1}</td>
      <td ${isPlayer ? 'style="font-weight:bold;color:#4caf50"' : ''}>
        ${team.name}
      </td>
      <td>${team.points || 0}</td>
      <td>${team.goalsFor || 0}</td>
      <td>${team.goalsAgainst || 0}</td>
      <td>${(team.goalsFor || 0) - (team.goalsAgainst || 0)}</td>
    `;

    table.appendChild(row);
  });
}

// =========================
// 📋 TEAM DROPDOWN
// =========================

function populateTeamSelect(){

  const select = document.getElementById("teamSelect");
  if(!select) return;

  select.innerHTML = "";

  if(!game.league.teams) return;

  game.league.teams.forEach(team => {

    const opt = document.createElement("option");
    opt.value = team.name;
    opt.textContent = team.name;

    select.appendChild(opt);
  });

  // bereits gewähltes Team setzen
  if(game.team.selected){
    select.value = game.team.selected;
  }
}

// =========================
// 🧾 HEADER UPDATE (Fallback)
// =========================

function updateHeader(){

  const title = document.getElementById("gameTitle");
  const sub = document.getElementById("leagueTitle");

  if(title){
    title.innerText = game.player?.name || "Manager";
  }

  if(sub){
    const league = game.league?.key || "Keine Liga";
    const team = game.team?.selected || "";

    sub.innerText = team 
      ? `${league} • ${team}`
      : league;
  }
}
