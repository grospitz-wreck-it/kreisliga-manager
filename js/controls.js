function selectLeague(){ 
  const league = document.getElementById("leagueSelect").value;

  if(!league){
    alert("Liga wählen");
    return;
  }

  loadLeague(league);

  // ✅ FIX: Absicherung
  if(!teams || teams.length === 0){
    console.error("Keine Teams geladen:", league);
    alert("Fehler beim Laden der Liga");
    return;
  }

  generateSchedule();
  populateTeamSelect();
  updateTable();

  console.log("Liga geladen:", league, teams.length, "Teams");
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

// ✅ FIX: umbenannt (kein Konflikt mehr mit ui.js)
function addLiveEvent(text, minute = currentMinute){

  const box = document.getElementById("liveMatch");
  if(!box) return;

  let p = document.createElement("p");

  p.innerHTML = `<strong>${minute}'</strong> ${text}`;

  box.prepend(p);
}
function addEvent(text, minute = currentMinute){
  addLiveEvent(text, minute);
}
//
// =========================
// 🔥 TAKTIK
// =========================
//

tacticModifier = 0;

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

formationModifier = 0;

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

liveModifier = 0;

function setLiveMode(mode){

  const attackBtn = document.getElementById("btnAttack");
  const calmBtn = document.getElementById("btnCalm");

  attackBtn.classList.remove("active");
  calmBtn.classList.remove("active");

  // ✅ FIX: Reset statt stacking
  liveModifier = 0;

  if(mode==="attack"){
    liveModifier = 0.01;
    attackBtn.classList.add("active");
  } 
  else {
    liveModifier = -0.01;
    calmBtn.classList.add("active");
  }

  // ✅ FIX: neuer Funktionsname
  addLiveEvent(mode === "attack"
    ? "🔥 Team erhöht den Druck"
    : "🧊 Team zieht sich zurück"
  );
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

  // ✅ FIX: neuer Funktionsname
  addLiveEvent(events[Math.floor(Math.random()*events.length)]);

  substitutions--;

  document.getElementById("subCount").innerText = "Wechsel: " + substitutions;
}

//
// =========================
// ⏩ SPEED
// =========================
//

function setSpeed(multi, el){

  speedMultiplier = multi;

  // Buttons visuell setzen
  const container = document.getElementById("speedControls");
  if(container){
    let buttons = container.querySelectorAll("button");
    buttons.forEach(b => b.classList.remove("active"));
  }

  if(el){
    el.classList.add("active");
  }

  // 🔥 WICHTIG: IMMER neu starten
  if(isSimulating){
    restartInterval();
  }
}
