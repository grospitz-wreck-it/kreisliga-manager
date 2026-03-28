function updateTable(){

  const teams = game.league.teams;

  teams.sort((a,b)=> b.stats.points - a.stats.points);

  const tbody = document.querySelector("#table tbody");
  if(!tbody) return;

  tbody.innerHTML = "";

  teams.forEach(t=>{

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${t.name}</td>
      <td>${t.stats.played}</td>
      <td>${t.stats.wins}</td>
      <td>${t.stats.draws}</td>
      <td>${t.stats.losses}</td>
      <td>${t.stats.goalsFor}:${t.stats.goalsAgainst}</td>
      <td>${t.stats.points}</td>
    `;

    tbody.appendChild(tr);
  });
}

window.updateTable = updateTable;
