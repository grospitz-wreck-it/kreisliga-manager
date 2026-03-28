function bindUI(){

  document.getElementById("mainButton").onclick = handleMainAction;

  document.querySelectorAll(".speedControl button").forEach(b=>{
    b.onclick = ()=> setSpeed(parseInt(b.innerText));
  });

  document.getElementById("leagueSelect").onchange = selectLeague;
}

window.bindUI = bindUI;
