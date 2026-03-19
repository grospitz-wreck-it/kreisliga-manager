// ================= LIGA =================
function selectLeague() {
  let league = document.getElementById("leagueSelect").value;

  teams = leagues[league].map(name => ({
    name,
    points: 0,
    goals: 0,
    strength: 50 + Math.random() * 20
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

// ================= TEAM =================
function selectTeam() {
  let select = document.getElementById("teamSelect");

  selectedTeam = select.value;
  select.disabled = true;

  updateTable();
}

// ================= TAKTIK =================
function setTactic() {
  selectedTactic = document.getElementById("tacticSelect").value;

  document.getElementById("currentTactic").innerText =
    "Taktik: " + selectedTactic;
}
function setSpeed(e, speed) {
  matchDuration = speed * 1800;

  // visuelles Feedback (aktive Taste)
  let buttons = e.target.parentElement.querySelectorAll("button");
  buttons.forEach(b => b.classList.remove("active"));

  e.target.classList.add("active");
}
