function selectLeague(){
  if(teamLocked){ alert("Team gesperrt!"); return; }

  const val = document.getElementById("teamSelect").value;
  if(!val){ alert("Team wählen"); return; }

  selectedTeam = val;
  document.getElementById("loggedTeam").innerText = "Dein Team: " + val;
  updateTable();
}

function lockTeam(){
  teamLocked = true;
  document.getElementById("teamSelect").disabled = true;
  document.getElementById("btnSelectTeam").disabled = true;
}

function setTactic(){
  const t = document.getElementById("tacticSelect").value;
  document.getElementById("currentTactic").innerText = "Taktik: " + t;
}

function setLiveMode(mode){
  document.getElementById("btnAttack").classList.remove("active");
  document.getElementById("btnCalm").classList.remove("active");

  if(mode==="attack"){
    liveModifier += 0.02;
    document.getElementById("btnAttack").classList.add("active");
  } else {
    liveModifier -= 0.02;
    document.getElementById("btnCalm").classList.add("active");
  }
}

function makeSub(){
  if(!isSimulating){ alert("Kein Spiel"); return; }
  if(substitutions<=0){ alert("Keine Wechsel mehr"); return; }

  addEvent("🔁 Wechsel durchgeführt");
  substitutions--;
  document.getElementById("subCount").innerText = "Wechsel: " + substitutions;
}

function setSpeed(mult){
  speedMultiplier = mult;

  document.querySelectorAll(".speed").forEach(b=>b.classList.remove("active"));
  document.querySelector(`.speed[data-speed='${mult}']`).classList.add("active");

  if(isSimulating){ restartInterval(); }
}
