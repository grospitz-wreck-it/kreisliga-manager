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
  if (substitutions <= 0) return alert("Keine Wechsel!");
  substitutions--;
  document.getElementById("subCount").innerText =
    "Wechsel: " + substitutions;
}

function setSpeed(e, speed) {}
function applyHalftime() {}
