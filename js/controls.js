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

  document.getElementById("toggleSetupBtn").style.display = "none";
  document.getElementById("setupPanel").style.display = "block";
}

function selectTeam(){
  const team = document.getElementById("teamSelect").value;

  if(!team){
    alert("Team wählen!");
    return;
  }

  function selectTeam(){
  const team = document.getElementById("teamSelect").value;
  const league = document.getElementById("leagueSelect").value;
  const tactic = document.getElementById("tacticSelect").value;

  if(!league){
    alert("Liga wählen!");
    return;
  }

  if(!team){
    alert("Team wählen!");
    return;
  }

  if(!tactic){
    alert("Taktik wählen!");
    return;
  }
  function resetGame(){

  // 🔥 komplette Variablen zurücksetzen
  selectedTeam = null;
  teamLocked = false;
  currentMatchday = 0;
  schedule = [];

  // UI zurücksetzen
  document.getElementById("teamSelect").disabled = false;
  document.getElementById("leagueSelect").disabled = false;
  document.getElementById("tacticSelect").disabled = false;
  document.getElementById("btnSelectTeam").disabled = false;

  document.getElementById("selectedTeamText").innerText = "Kein Team gewählt";
  document.getElementById("currentTactic").innerText = "Taktik: normal";

  document.getElementById("setupPanel").style.display = "block";
  document.getElementById("toggleSetupBtn").style.display = "none";

  document.getElementById("startBtn").innerText = "▶ Saison starten";

  document.getElementById("liveMatch").innerHTML = "";
  updateTable();
}
  selectedTeam = team;
  teamLocked = true;

  document.getElementById("selectedTeamText").innerText = "Dein Team: " + team;
  document.getElementById("teamSelect").disabled = true;
  document.getElementById("btnSelectTeam").disabled = true;
  document.getElementById("leagueSelect").disabled = true;
  document.getElementById("tacticSelect").disabled = true;

  // 🔥 ERST JETZT einklappen
  document.getElementById("setupPanel").style.display = "none";
  document.getElementById("toggleSetupBtn").style.display = "block";
}

function setTactic(){
  const val=document.getElementById("tacticSelect").value;
  document.getElementById("currentTactic").innerText="Taktik: "+val;
}

function setLiveMode(mode){
  document.getElementById("btnAttack").classList.remove("active");
  document.getElementById("btnCalm").classList.remove("active");

  if(mode==="attack"){
    liveModifier+=0.01;
    document.getElementById("btnAttack").classList.add("active");
  } else {
    liveModifier-=0.01;
    document.getElementById("btnCalm").classList.add("active");
  }
}

function makeSub(){
  if(!isSimulating){ alert("Spiel läuft nicht"); return; }
  if(substitutions<=0){ alert("Keine Wechsel"); return; }

  let events=["🔁 Wechsel","🔁 Defensivwechsel","🔁 Offensivwechsel"];
  addEvent(events[Math.floor(Math.random()*events.length)]);

  substitutions--;
  document.getElementById("subCount").innerText="Wechsel: "+substitutions;
}

function setSpeed(e,multi){
  speedMultiplier=multi;

  let buttons=e.target.parentElement.querySelectorAll("button");
  buttons.forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");

  if(isSimulating){ restartInterval(); }
}
