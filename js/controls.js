function selectLeague(){
  selectedTeam=select.value;
  updateTable();
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

  let type=prompt("offensiv / defensiv");
  if(!type) return;

  if(type==="offensiv") liveModifier+=0.01;
  else if(type==="defensiv") liveModifier-=0.01;

  substitutions--;
  document.getElementById("subCount").innerText="Wechsel: "+substitutions;
}

function setSpeed(e,speed){
  matchDuration=speed*1800;

  let buttons=e.target.parentElement.querySelectorAll("button");
  buttons.forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");

  if(isSimulating) restartInterval();
}
