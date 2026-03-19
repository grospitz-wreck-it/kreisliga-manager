window.addEventListener("DOMContentLoaded", ()=>{

  const leagueSelect = document.getElementById("leagueSelect");

  Object.keys(leagues).forEach(l=>{
    const o = document.createElement("option");
    o.value = l;
    o.textContent = leagues[l];
    leagueSelect.appendChild(o);
  });

  document.getElementById("btnStartLeague").onclick = selectLeague;
  document.getElementById("btnSelectTeam").onclick = selectTeam;
  document.getElementById("btnTactic").onclick = setTactic;
  document.getElementById("startBtn").onclick = simulateMatchday;

  document.getElementById("btnAttack").onclick = ()=>setLiveMode('attack');
  document.getElementById("btnCalm").onclick = ()=>setLiveMode('calm');
  document.getElementById("btnSub").onclick = makeSub;

  document.querySelectorAll(".speed").forEach(b=>{
    b.onclick = ()=> setSpeed(parseInt(b.dataset.speed));
  });

  document.getElementById("resumeBtn").onclick = resumeMatch;
  document.getElementById("halfAttack").onclick = ()=>setLiveMode('attack');
  document.getElementById("halfCalm").onclick = ()=>setLiveMode('calm');

});
