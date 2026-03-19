function updateTable() {
  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  teams
    .sort((a, b) => b.points - a.points)
    .forEach(t => {
      let name = t.name === selectedTeam ? "👉 " + t.name : t.name;

      tbody.innerHTML += `
        <tr>
          <td>${name}</td>
          <td>${t.points}</td>
          <td>${t.goals}</td>
        </tr>
      `;
    });
}
