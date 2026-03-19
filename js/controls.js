function selectTeam() {
  const select = document.getElementById("teamSelect");

  if (!select.value) {
    alert("Bitte Team auswählen!");
    return;
  }

  selectedTeam = select.value.trim(); // 👉 wichtig!

  console.log("Team gesetzt:", selectedTeam);

  // UI Feedback
  select.disabled = true;

  updateTable();
}

function setTactic() {
  selectedTactic = document.getElementById("tacticSelect").value;
  document.getElementById("currentTactic").innerText =
    "Taktik: " + selectedTactic;
}

function setLiveMode(mode) {
  liveModifier = mode === "attack" ? 0.003 : -0.002;
}

function makeSub() {
  if (!isSimulating) return alert("Spiel läuft nicht!");
  if (substitutions <= 0) return alert("Keine Wechsel mehr!");

  let type = prompt("offensiv oder defensiv?");

  if (type === "offensiv") {
    liveModifier += 0.002;
    addEvent("🔼 Offensiver Wechsel");
  } else if (type === "defensiv") {
    liveModifier -= 0.002;
    addEvent("🔽 Defensiver Wechsel");
  } else {
    return;
  }

  substitutions--;
  document.getElementById("subCount").innerText =
    "Wechsel: " + substitutions;
}

function setSpeed(e, speed) {}
function applyHalftime() {}
function selectLeague() {
  let league = document.getElementById("leagueSelect").value;

  // 👉 neue Teams laden
  teams = leagues[league].map(t => ({
    ...t,
    points: 0,
    goals: 0
  }));

  // 👉 GANZ WICHTIG: Reset
  selectedTeam = null;

  currentMatchday = 0;

  // 👉 neuer Spielplan
  generateSchedule();

  // 👉 Team Dropdown neu aufbauen
  let teamSelect = document.getElementById("teamSelect");
  teamSelect.innerHTML = "";

  teams.forEach(t => {
    let o = document.createElement("option");
    o.value = t.name;
    o.textContent = t.name;
    teamSelect.appendChild(o);
  });

  // 👉 wieder auswählbar machen
  teamSelect.disabled = false;

  // 👉 Anzeige aktualisieren
  updateTable();

  document.getElementById("matchday").innerText =
    "Spieltag: 0 / " + schedule.length;

  console.log("Liga gewechselt:", league);
}
