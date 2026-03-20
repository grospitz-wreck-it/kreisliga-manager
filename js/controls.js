function selectLeague(){
  const league = document.getElementById("leagueSelect").value;

  if(!league){
    alert("Liga wählen");
    return;
  }

  loadLeague(league);        // Teams laden
  generateSchedule();        // Spielplan
  populateTeamSelect();      // Team-Dropdown füllen
  updateTable();             // Tabelle anzeigen

  // Reset UI
  selectedTeam = null;
  teamLocked = false;

  document.getElementById("teamSelect").disabled = false;
  document.getElementById("btnSelectTeam").disabled = false;
  document.getElementById("loggedTeam").innerText = "Kein Team gewählt";
}


function selectTeam(){
  if(teamLocked){
    alert("Team bereits festgelegt!");
    return;
  }

  const select = document.getElementById("teamSelect");

  if(!select || !select.value){
    alert("Bitte Team auswählen!");
    return;
  }

  selectedTeam = select.value;

  document.getElementById("loggedTeam").innerText =
    "Dein Team: " + selectedTeam;

  updateTable();
}


function lockTeam(){
  teamLocked = true;

  document.getElementById("teamSelect").disabled = true;
  document.getElementById("btnSelectTeam").disabled = true;
}


function setTactic(){
  const val = document.getElementById("tacticSelect").value;
  document.getElementById("currentTactic").innerText = "Taktik: " + val;
}


function setLiveMode(mode){
  document.getElementById("btnAttack").classList.remove("active");
  document.getElementById("btnCalm").classList.remove("active");

  if(mode === "attack"){
    liveModifier += 0.01;
    document.getElementById("btnAttack").classList.add("active");
  } else {
    liveModifier -= 0.01;
    document.getElementById("btnCalm").classList.add("active");
  }
}


function makeSub(){
  if(!isSimulating){
    alert("Spiel läuft nicht");
    return;
  }

  if(substitutions <= 0){
    alert("Keine Wechsel mehr");
    return;
  }

  let events = [
    "🔁 Wechsel",
    "🔁 Defensivwechsel",
    "🔁 Offensivwechsel"
  ];

  addEvent(events[Math.floor(Math.random()*events.length)]);

  substitutions--;
  document.getElementById("subCount").innerText =
    "Wechsel: " + substitutions;
}


function setSpeed(e, multi){
  speedMultiplier = multi;

  let buttons = e.target.parentElement.querySelectorAll("button");
  buttons.forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");

  if(isSimulating){
    restartInterval();
  }
}
