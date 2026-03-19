window.onload = function () {

  // ================= LIGA DROPDOWN =================
  let leagueSelect = document.getElementById("leagueSelect");
  leagueSelect.innerHTML = "";

  Object.keys(leagues).forEach(liga => {
    let o = document.createElement("option");
    o.value = liga;
    o.textContent = liga;
    leagueSelect.appendChild(o);
  });

  // 👉 Standard Liga
  let selectedLeague = leagueSelect.value;

  // ================= TEAMS INITIALISIEREN =================
  teams = leagues[selectedLeague].map(t => ({
    ...t,
    points: 0,
    goals: 0
  }));

  // 👉 WICHTIG: Reset
  currentMatchday = 0;

  // ================= TEAM DROPDOWN =================
  let teamSelect = document.getElementById("teamSelect");
  teamSelect.innerHTML = "";

  teams.forEach(t => {
    let o = document.createElement("option");
    o.value = t.name;
    o.textContent = t.name;
    teamSelect.appendChild(o);
  });

  // ================= SPIELPLAN =================
  generateSchedule();

  // Sicherheitscheck
  if (!schedule || schedule.length === 0) {
    console.error("Spielplan konnte nicht erstellt werden!");
  }

  // ================= UI =================
  document.getElementById("matchday").innerText =
    "Spieltag: 0 / " + schedule.length;

  updateTable();

  // Debug (optional)
  console.log("Liga geladen:", selectedLeague);
  console.log("Teams:", teams.length);
  console.log("Spieltage:", schedule.length);
};
