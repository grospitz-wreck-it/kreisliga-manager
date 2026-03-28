function bindUI(){

  document.getElementById("mainButton").onclick = handleMainAction;
  document.getElementById("teamSelect").onchange = selectTeam;
  document.querySelectorAll(".speedControl button").forEach(b=>{
    b.onclick = ()=> setSpeed(parseInt(b.innerText));
  });

  document.getElementById("leagueSelect").onchange = selectLeague;
}

window.bindUI = bindUI;
