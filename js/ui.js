function updateTable(){
  const tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  teams
    .sort((a,b)=> b.points-a.points || b.goals-a.goals)
    .forEach(t=>{
      const tr = document.createElement("tr");
      const name = t.name === selectedTeam ? "👉 "+t.name : t.name;
      tr.innerHTML = `<td>${name}</td><td>${t.points}</td><td>${t.goals}</td>`;
      tbody.appendChild(tr);
    });
}
