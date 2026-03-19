function selectLeague() {
  let league = document.getElementById("leagueSelect").value;

  teams = leagues[league].map(t => ({
    ...t,
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

function setTactic() {
  selectedTactic = document.getElementById("tacticSelect").value;
}

function setLiveMode(mode) {
  liveModifier = mode === "attack" ? 0.002 : -0.002;
}

function makeSub() {
  if (!isSimulating) return;
  if (substitutions <= 0) return;

  substitutions--;
  document.getElementById("subCount").innerText =
    "Wechsel: " + substitutions;
}

function setSpeed(e, speed) {
  matchDuration = speed * 1800;
}

function applyHalftime() {
  document.getElementById("halftimePanel").style.display = "none";

  matchStartTime = Date.now() - matchDuration / 2;

  currentInterval = setInterval(() => {
    let elapsed = Date.now() - matchStartTime;
    let minute = Math.floor((elapsed / matchDuration) * 90);

    updateTimeline(minute);
  }, 100);
}
