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

  if(!game.league.teams || game.league.teams.length === 0){
    console.error("Keine Teams geladen:", league);
    alert("Fehler beim Laden der Liga");
    return;
  }

  generateSchedule();
  populateTeamSelect?.();
  updateTable?.();

  updateHeader();

  game.phase = "idle";
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

  game.team.selected = team;

  localStorage.setItem("selectedTeam", team);

  document.getElementById("setupPanel")?.classList.remove("open");

  updateHeader();

  game.phase = "idle";
  updateMainButton();
}

// =========================
// 🔥 EVENT SYSTEM
// =========================

function addLiveEvent(text, minute = game.match.minute || 0){

  const box = document.getElementById("liveMatch");
  if(!box) return;

  const p = document.createElement("p");
  p.innerHTML = `<strong>${minute}'</strong> ${text}`;

  box.prepend(p);

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

window.tacticModifier = 0;

function setTactic(){

  const val = document.getElementById("tacticSelect").value;

  if(val === "Offensiv") window.tacticModifier = 0.02;
  else if(val === "Defensiv") window.tacticModifier = -0.015;
  else window.tacticModifier = 0;

  game.settings.tactic = val;

  addLiveEvent("📋 Taktik geändert: " + val);
}

// =========================
// 📐 FORMATION
// =========================

window.formationModifier = 0;

function setFormation(){

  const val = document.getElementById("formationSelect").value;

  if(val === "4-3-3") window.formationModifier = 0.01;
  else if(val === "3-5-2") window.formationModifier = 0.005;
  else if(val === "5-3-2") window.formationModifier = -0.015;
  else window.formationModifier = 0;

  game.settings.formation = val;

  addLiveEvent("📐 Formation: " + val);
}

// =========================
// ⚡ LIVE MODES
// =========================

window.liveModifier = 0;

function setLiveMode(mode){

  window.liveModifier = 0;

  document.querySelectorAll(".quickActions .btn")
    .forEach(b => b.classList.remove("active"));

  const btns = document.querySelectorAll(".quickActions .btn");

  if(mode === "attack"){
    window.liveModifier = 0.01;
    btns[0]?.classList.add("active");
    addLiveEvent("🔥 Mehr Druck nach vorne");
  }

  else if(mode === "calm"){
    window.liveModifier = -0.01;
    btns[1]?.classList.add("active");
    addLiveEvent("🧊 Team wird defensiver");
  }

  else if(mode === "counter"){
    window.liveModifier = 0.005;
    btns[2]?.classList.add("active");
    addLiveEvent("⚡ Umschaltspiel aktiviert");
  }
}

// =========================
// 🔁 WECHSEL
// =========================

window.substitutions = 5;

function makeSub(){

  if(!game.match.isRunning){
    alert("Spiel läuft nicht");
    return;
  }

  if(window.substitutions <= 0){
    alert("Keine Wechsel mehr");
    return;
  }

  const events = [
    "🔁 Frischer Stürmer kommt",
    "🔁 Defensiver Wechsel",
    "🔁 Mittelfeld wird verstärkt"
  ];

  addLiveEvent(events[Math.floor(Math.random()*events.length)]);

  window.substitutions--;
}

// =========================
// 🎚️ INTENSITÄT
// =========================

window.intensityModifier = 0;

function setIntensity(val){

  if(val == 1) window.intensityModifier = -0.01;
  if(val == 2) window.intensityModifier = 0;
  if(val == 3) window.intensityModifier = 0.02;

  game.settings.intensity = val;

  addLiveEvent("⚙️ Intensität angepasst");
}

// =========================
// ⏩ SPEED
// =========================

function setSpeed(e, multi){

  game.settings.speed = multi;
  window.speedMultiplier = multi;

  document.querySelectorAll(".speed")
    .forEach(b => b.classList.remove("active"));

  e.target.classList.add("active");

  if(game.match.isRunning && typeof restartInterval === "function"){
    restartInterval();
  }
}

// =========================
// ⏸️ PAUSE
// =========================

function pauseMatch(){

  game.match.isRunning = false;

  game.phase = "halftime";
  updateMainButton();

  addLiveEvent("⏸ Spiel pausiert");
}
