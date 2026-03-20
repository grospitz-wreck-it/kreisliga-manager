function updateTable() {
  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  [...teams]
    .sort((a,b)=> b.points-a.points || b.goals-a.goals)
    .forEach(t=>{
      let name = t.name === selectedTeam
      ? `<span class="userTeam">👉 ${t.name}</span>`
      : t.name;
      tbody.innerHTML += `<tr><td>${name}</td><td>${t.points}</td><td>${t.goals}</td></tr>`;
    });
}

function populateTeamSelect(){
  const select=document.getElementById("teamSelect");
  select.innerHTML="";
  teams.forEach(t=>{
    let o=document.createElement("option");
    o.value=t.name;
    o.textContent=t.name;
    select.appendChild(o);
  });
}

function addEvent(text){
  let box=document.getElementById("liveMatch");
  box.innerHTML=`<p>${text}</p>`+box.innerHTML;
}

function updateScoreboard(t1,t2,s1,s2){
  document.getElementById("score").innerText=`${s1} : ${s2}`;
  document.getElementById("teamLeft").innerText=t1.name;
  document.getElementById("teamRight").innerText=t2.name;
}

function updateTimeline(minute){
  document.getElementById("timelineBar").style.width=(minute/90)*100+"%";
}
