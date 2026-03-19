// ================= TEAM AUSWÄHLEN =================
function selectTeam() {
  const select = document.getElementById("teamSelect");

  if (!select.value) {
    alert("Bitte Team auswählen!");
    return;
  }

  selectedTeam = select.value.trim();

  console.log("Team gesetzt:", selectedTeam);

  // UI Feedback
  select.disabled = true;

  updateTable();
}

// ================= LIGA AUSWÄHLEN =================
function selectLeague() {
  let league = document.getElementById("leagueSelect").value;

  // 👉 neue Teams laden
  teams = leagues[league].map(t => ({
    ...t,
    points: 0,
    goals: 0
  }));

  // 👉 RESET (entscheidend!)
  selectedTeam = null;
  currentMatchday = 0;

  // 👉 Spielplan neu
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

  // 👉 wieder aktivieren
  teamSelect.disabled = false;

  updateTable();

  document.getElementById("matchday").innerText =
    "Spieltag: 0 / " + schedule.length;

  console.log("Liga gewechselt:", league);
}

// ================= TAKTIK =================
function setTactic() {
  selectedTactic = document.getElementById("tacticSelect").value;

  document.getElementById("currentTactic").innerText =
    "Taktik: " + selectedTactic;
}

// ================= LIVE MODUS =================
function setLiveMode(mode) {
  liveModifier = mode === "attack" ? 0.003 : -0.002;
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

// ================= GESCHWINDIGKEIT =================
function setSpeed(e, speed) {
  matchDuration = speed * 1800; 
  // 100 = langsam, 20 = schnell
}

// ================= HALBZEIT =================
function applyHalftime() {
  document.getElementById("halftimePanel").style.display = "none";

  matchStartTime = Date.now() - matchDuration / 2;

  currentInterval = setInterval(() => {
    let elapsed = Date.now() - matchStartTime;
    let minute = Math.floor((elapsed / matchDuration) * 90);

    updateTimeline(minute);
  }, 100);
}
