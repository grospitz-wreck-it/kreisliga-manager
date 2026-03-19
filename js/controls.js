function selectLeague() {
  let league = document.getElementById("leagueSelect").value;

  teams = leagues[league].map(name => ({
    name,
    points: 0,
    goals: 0
  }));

  selectedTeam = null;
  currentMatchday = 0;

  generateSchedule();

  let teamSelect = document.getElementById("teamSelect");
  teamSelect.innerHTML = "";

  teams.forEach(t => {
    let o = document.createElement("option");
    o.value = t.name;
    o.textContent = t.name;
    teamSelect.appendChild(o);
  });

  teamSelect.disabled = false;

  updateTable();

  document.getElementById("matchday").innerText =
    "Spieltag: 0 / " + schedule.length;
}

function selectTeam() {
  let select = document.getElementById("teamSelect");

  selectedTeam = select.value;
  select.disabled = true;

  updateTable();
}
