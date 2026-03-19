window.onload = function () {

  // 👉 Liga Dropdown füllen
  let leagueSelect = document.getElementById("leagueSelect");
  leagueSelect.innerHTML = "";

  Object.keys(leagues).forEach(liga => {
    let o = document.createElement("option");
    o.value = liga;
    o.textContent = liga;
    leagueSelect.appendChild(o);
  });

  // 👉 Default Liga setzen
  let selectedLeague = leagueSelect.value;

  // 👉 Teams initialisieren
  teams = leagues[selectedLeague].map(t => ({
    ...t,
    points: 0,
    goals: 0
  }));

  // 👉 Team Dropdown füllen
  let teamSelect = document.getElementById("teamSelect");
  teamSelect.innerHTML = "";

  teams.forEach(t => {
    let o = document.createElement("option");
    o.value = t.name;
    o.textContent = t.name;
    teamSelect.appendChild(o);
  });

  // 👉 Spielplan generieren
  generateSchedule();

  // 👉 UI initial
  document.getElementById("matchday").innerText =
    "Spieltag: 0 / " + schedule.length;

  updateTable();
};
