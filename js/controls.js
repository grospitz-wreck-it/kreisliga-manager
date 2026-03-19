// ================= League =================
function selectLeague() {
  const league = document.getElementById("leagueSelect").value;

  if (!league) {
    alert("Bitte Liga wählen!");
    return;
  }

  loadLeague(league);
  generateSchedule();
  populateTeamSelect();
  updateTable();

  console.log("Liga gestartet:", league);
}

// ================= TEAM =================
function selectTeam() {
  const select = document.getElementById("teamSelect");

  if (!select.value) {
    alert("Bitte Team auswählen!");
    return;
  }

  selectedTeam = select.value.trim();

  console.log("Team gesetzt:", selectedTeam);

  // 👉 WICHTIG: nichts anderes verändern!
  // kein updateTable hier nötig
}

// ================= TAKTIK =================
function setTactic() {
  selectedTactic = document.getElementById("tacticSelect").value;

  document.getElementById("currentTactic").innerText =
    "Taktik: " + selectedTactic;
}

// ================= LIVE MODE =================
function setLiveMode(mode) {
  if (mode === "attack") {
    liveModifier += 0.01;
  } else {
    liveModifier -= 0.01;
  }
}

// ================= WECHSEL =================
function makeSub() {

  if (!isSimulating) {
    alert("Spiel läuft nicht!");
    return;
  }

  if (substitutions <= 0) {
    alert("Keine Wechsel mehr!");
    return;
  }

  let type = prompt("Wechsel? offensiv / defensiv");

  if (!type) return;

  type = type.toLowerCase();

  if (type === "offensiv") {
    liveModifier += 0.01;
    addEvent("🔼 Offensiver Wechsel");
  } 
  else if (type === "defensiv") {
    liveModifier -= 0.01;
    addEvent("🔽 Defensiver Wechsel");
  } 
  else {
    alert("Bitte 'offensiv' oder 'defensiv' eingeben");
    return;
  }

  substitutions--;

  document.getElementById("subCount").innerText =
    "Wechsel: " + substitutions;
}

// ================= SPEED =================
function setSpeed(e, speed) {
  matchDuration = speed * 1800;

  let buttons = e.target.parentElement.querySelectorAll("button");
  buttons.forEach(b => b.classList.remove("active"));

  e.target.classList.add("active");
}
