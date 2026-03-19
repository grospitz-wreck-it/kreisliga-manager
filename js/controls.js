function selectTeam() {
  selectedTeam = document.getElementById("teamSelect").value;
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
