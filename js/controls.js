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

  selectedTeam = null;
  teamLocked = false;

  document.getElementById("teamSelect").disabled = false;
  document.getElementById("btnSelectTeam").disabled = false;
  document.getElementById("loggedTeam").innerText = "Kein Team gewählt";

  document.getElementById("startBtn").innerText = "▶ Saison starten";
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

  lockTeam();
  updateTable();
}


function lockTeam(){
  const teamSelect = document.getElementById("teamSelect");

  if(!teamSelect.value){
    alert("Bitte Team wählen!");
    return;
  }

  // 🔥 Team speichern
  selectedTeam = teamSelect.value;

  // 🔒 Lock aktivieren
  teamLocked = true;

  // UI sperren
  teamSelect.disabled = true;
  document.getElementById("btnSelectTeam").disabled = true;

  // Anzeige aktualisieren
  document.getElementById("selectedTeamText").innerText = "Dein Team: " + selectedTeam;
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

  let events = ["🔁 Wechsel","🔁 Defensivwechsel","🔁 Offensivwechsel"];
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
