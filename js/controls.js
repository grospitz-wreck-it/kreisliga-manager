// =========================
// 🏟️ LIGA AUSWAHL
// =========================

function selectLeague(){ 

  const league = document.getElementById("leagueSelect").value;

  if(!league){
    alert("Liga wählen");
    return;
  }

  localStorage.setItem("selectedLeague", league);

  loadLeague(league);

  if(!teams || teams.length === 0){
    console.error("Keine Teams geladen:", league);
    alert("Fehler beim Laden der Liga");
    return;
  }

  generateSchedule();
  populateTeamSelect();
  updateTable();

  updateHeader();

  gameState.phase = "idle";
  updateMainButton();

  console.log("Liga geladen:", league);
}

// =========================
// 🧍 TEAM AUSWAHL
// =========================

function selectTeam(){

  const team = document.getElementById("teamSelect").value;

  if(!team){
    alert("Team wählen!");
    return;
  }

  selectedTeam = team;
  teamLocked = true;

  localStorage.setItem("selectedTeam", team);

  document.getElementById("setupPanel").classList.remove("open");

  updateHeader();

  gameState.phase = "idle";
  updateMainButton();
}

// =========================
// 🔥 EVENT SYSTEM
// =========================

function addLiveEvent(text, minute = currentMinute){

  const box = document.getElementById("liveMatch");
  if(!box) return;

  const p = document.createElement("p");
  p.innerHTML = `<strong>${minute}'</strong> ${text}`;

  box.prepend(p);

  // Limit für Performance
  if(box.children.length > 50){
    box.removeChild(box.lastChild);
  }
}

function addEvent(text, minute){
  addLiveEvent(text, minute);
}

// =========================
// 🎯 TAKTIK
// =========================

tacticModifier = 0;

function setTactic(){

  const val = document.getElementById("tacticSelect").value;

  if(val === "Offensiv") tacticModifier = 0.02;
  else if(val === "Defensiv") tacticModifier = -0.015;
  else tacticModifier = 0;

  addLiveEvent("📋 Taktik geändert: " + val);
}

// =========================
// 📐 FORMATION
// =========================

formationModifier = 0;

function setFormation(){

  const val = document.getElementById("formationSelect").value;

  if(val === "4-3-3") formationModifier = 0.01;
  else if(val === "3-5-2") formationModifier = 0.005;
  else if(val === "5-3-2") formationModifier = -0.015;
  else formationModifier = 0;

  addLiveEvent("📐 Formation: " + val);
}

// =========================
// ⚡ LIVE MODES
// =========================

liveModifier = 0;

function setLiveMode(mode){

  liveModifier = 0;

  // Buttons resetten
  document.querySelectorAll(".quickActions .btn")
    .forEach(b => b.classList.remove("active"));

  const btns = document.querySelectorAll(".quickActions .btn");

  if(mode === "attack"){
    liveModifier = 0.01;
    btns[0]?.classList.add("active");
    addLiveEvent("🔥 Mehr Druck nach vorne");
  }

  else if(mode === "calm"){
    liveModifier = -0.01;
    btns[1]?.classList.add("active");
    addLiveEvent("🧊 Team wird defensiver");
  }

  else if(mode === "counter"){
    liveModifier = 0.005;
    btns[2]?.classList.add("active");
    addLiveEvent("⚡ Umschaltspiel aktiviert");
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
    alert("Keine Wechsel mehr");
    return;
  }

  const events = [
    "🔁 Frischer Stürmer kommt",
    "🔁 Defensiver Wechsel",
    "🔁 Mittelfeld wird verstärkt"
  ];

  addLiveEvent(events[Math.floor(Math.random()*events.length)]);

  substitutions--;
}

// =========================
// 🎚️ INTENSITÄT
// =========================

intensityModifier = 0;

function setIntensity(val){

  if(val == 1) intensityModifier = -0.01;
  if(val == 2) intensityModifier = 0;
  if(val == 3) intensityModifier = 0.02;

  addLiveEvent("⚙️ Intensität angepasst");
}

// =========================
// ⏩ SPEED
// =========================

function setSpeed(e, multi){

  speedMultiplier = multi;

  document.querySelectorAll(".speed").forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");

  if(isSimulating){
    restartInterval();
  }
}

// =========================
// ⏸️ PAUSE
// =========================

function pauseMatch(){

  isSimulating = false;

  gameState.phase = "matchday_ready";
  updateMainButton();

  addLiveEvent("⏸ Spiel pausiert");
}
