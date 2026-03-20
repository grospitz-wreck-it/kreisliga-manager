function selectLeague(){ 
  const league = document.getElementById("leagueSelect").value;

  if(!league){
    alert("Liga wählen");
    return;
  }

  loadLeague(league);
  generateSchedule();
  populateTeamSelect();
  updateTable();
}

function selectTeam(){
  const team = document.getElementById("teamSelect").value;

  if(!team){
    alert("Team wählen!");
    return;
  }

  // Team setzen
  selectedTeam = team;
  teamLocked = true;

  // Anzeige
  document.getElementById("selectedTeamText").innerText = "Dein Team: " + team;

  // Sperren
  document.getElementById("teamSelect").disabled = true;
  document.getElementById("btnSelectTeam").disabled = true;

  // 🔥 FIX: Setup sauber schließen
  document.getElementById("setupPanel").classList.remove("open");
}

function toggleSetup(){
  document.getElementById("setupPanel").classList.toggle("open");
}

function setTactic(){
  const val = document.getElementById("tacticSelect").value;
  document.getElementById("currentTactic").innerText = "Taktik: " + val;
}

function setLiveMode(mode){
  document.getElementById("btnAttack").classList.remove("active");
  document.getElementById("btnCalm").classList.remove("active");

  if(mode==="attack"){
    liveModifier += 0.01;
    document.getElementById("btnAttack").classList.add("active");
  } else {
    liveModifier -= 0.01;
    document.getElementById("btnCalm").classList.add("active");
  }
}

function makeSub(){
  if(!isSimulating){ alert("Spiel läuft nicht"); return; }
  if(substitutions <= 0){ alert("Keine Wechsel"); return; }

  let events=["🔁 Wechsel","🔁 Defensivwechsel","🔁 Offensivwechsel"];
  addEvent(events[Math.floor(Math.random()*events.length)]);

  substitutions--;
  document.getElementById("subCount").innerText = "Wechsel: " + substitutions;
}

function setSpeed(e,multi){
  speedMultiplier = multi;

  let buttons = e.target.parentElement.querySelectorAll("button");
  buttons.forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");

  if(isSimulating){ restartInterval(); }
}
