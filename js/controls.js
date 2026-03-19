function selectLeague(){
    alert("Team kann nicht mehr gewechselt werden!");
    return;
  }

  const select=document.getElementById("teamSelect");
  if(!select.value) return alert("Team wählen");

  selectedTeam=select.value;

  document.getElementById("loggedTeam").innerText = "Dein Team: " + selectedTeam;
  updateTable();
}

function lockTeam(){
  teamLocked = true;
  document.getElementById("teamSelect").disabled = true;
  document.getElementById("btnSelectTeam").disabled = true;
}

function setTactic(){
  selectedTactic=document.getElementById("tacticSelect").value;
  document.getElementById("currentTactic").innerText="Taktik: "+selectedTactic;
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

  liveModifier=Math.max(-0.1,Math.min(0.1,liveModifier));
}

function makeSub(){
  if(!isSimulating) return alert("Spiel läuft nicht!");
  if(substitutions<=0) return alert("Keine Wechsel mehr!");

  let events=[
    "🔁 Frischer Stürmer kommt",
    "🔁 Defensiver Wechsel",
    "🔁 Mittelfeld wird verstärkt"
  ];

  addEvent(events[Math.floor(Math.random()*events.length)]);

  substitutions--;
  document.getElementById("subCount").innerText="Wechsel: "+substitutions;
}

function setSpeed(e,multi){
  speedMultiplier = multi;

  let buttons=e.target.parentElement.querySelectorAll("button");
  buttons.forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");

  if(isSimulating){
    restartInterval();
  }
}
