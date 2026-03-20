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

  // Setup schließen
  document.getElementById("setupPanel").classList.remove("open");
}

function toggleSetup(){
  document.getElementById("setupPanel").classList.toggle("open");
}

// =========================
// 🔥 TAKTIK
// =========================
let tacticModifier = 0;

function setTactic(){
  const val = document.getElementById("tacticSelect").value;

  if(val === "Offensiv"){
    tacticModifier = 0.02;
  }
  else if(val === "Defensiv"){
    tacticModifier = -0.015;
  }
  else{
    tacticModifier = 0;
  }

  document.getElementById("currentTactic").innerText = "Taktik: " + val;
}

// =========================
// 🔥 FORMATION (NEU)
// =========================
let formationModifier = 0;

function setFormation(){

  const val = document.getElementById("formationSelect").value;

  if(val === "4-3-3"){
    formationModifier = 0.01;
  }
  else if(val === "3-5-2"){
    formationModifier = 0.005;
  }
  else if(val === "5-3-2"){
    formationModifier = -0.015;
  }
  else{
    formationModifier = 0;
  }

  document.getElementById("currentFormation").innerText = "Formation: " + val;
}

// =========================
// 🔥 LIVE STEUERUNG
// =========================
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

// =========================
// 🔁 WECHSEL
// =========================
function makeSub(){
  if(!isSimulating){ 
    alert("Spiel läuft nicht"); 
    return; 
  }

  if(substitutions <= 0){ 
    alert("Keine Wechsel"); 
    return; 
  }

  let events=[
    "🔁 Wechsel",
    "🔁 Defensivwechsel",
    "🔁 Offensivwechsel"
  ];

  addEvent(events[Math.floor(Math.random()*events.length)]);

  substitutions--;
  document.getElementById("subCount").innerText = "Wechsel: " + substitutions;
}

// =========================
// ⏩ SPEED
// =========================
function setSpeed(e,multi){
  speedMultiplier = multi;

  let buttons = e.target.parentElement.querySelectorAll("button");
  buttons.forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");

  if(isSimulating){ 
    restartInterval(); 
  }
}
