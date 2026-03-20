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

  selectedTeam = team;
  teamLocked = true;

  document.getElementById("selectedTeamText").innerText = "Dein Team: " + team;

  document.getElementById("teamSelect").disabled = true;
  document.getElementById("btnSelectTeam").disabled = true;

  document.getElementById("setupPanel").classList.remove("open");
}

function toggleSetup(){
  document.getElementById("setupPanel").classList.toggle("open");
}

//
// =========================
// 🔥 EVENT SYSTEM (NEU!)
// =========================
//

function addEvent(text, minute = currentMinute){

  const box = document.getElementById("liveMatch");
  if(!box) return;

  let p = document.createElement("p");

  // 👉 Minute IMMER einheitlich
  p.innerHTML = `<strong>${minute}'</strong> ${text}`;

  box.prepend(p);
}

//
// =========================
// 🔥 TAKTIK
// =========================
//

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

//
// =========================
// 🔥 FORMATION
// =========================
//

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

//
// =========================
// 🔥 LIVE STEUERUNG
// =========================
//

let liveModifier = 0; // 🔥 wichtig: reset möglich machen

function setLiveMode(mode){

  const attackBtn = document.getElementById("btnAttack");
  const calmBtn = document.getElementById("btnCalm");

  attackBtn.classList.remove("active");
  calmBtn.classList.remove("active");

  // 👉 reset statt stacking (WICHTIG!)
  liveModifier = 0;

  if(mode==="attack"){
    liveModifier = 0.01;
    attackBtn.classList.add("active");
  } 
  else {
    liveModifier = -0.01;
    calmBtn.classList.add("active");
  }

  addEvent(mode === "attack" ? "🔥 Team erhöht den Druck" : "🧊 Team zieht sich zurück");
}

//
// =========================
// 🔁 WECHSEL
// =========================
//

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

//
// =========================
// ⏩ SPEED
// =========================
//

function setSpeed(e,multi){

  speedMultiplier = multi;

  let buttons = e.target.parentElement.querySelectorAll("button");
  buttons.forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");

  if(isSimulating){ 
    restartInterval(); 
  }
}
