function updateTable() {
  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  teams.sort((a,b)=>b.points-a.points);

  teams.forEach(t=>{
    let name = t.name === selectedTeam ? "👉 " + t.name : t.name;

    tbody.innerHTML += `
      <tr>
        <td>${name}</td>
        <td>${t.points}</td>
        <td>${t.goals}</td>
      </tr>
    `;
  });
}

function addEvent(text) {
  let box = document.getElementById("liveMatch");
  let p = document.createElement("p");
  p.textContent = text;
  box.prepend(p);
}
function updateScoreboard(t1, t2, s1, s2) {
  document.getElementById("team1Name").innerText = t1.name;
  document.getElementById("team2Name").innerText = t2.name;
  document.getElementById("score").innerText = s1 + " : " + s2;
}

function updateTimeline(minute) {
  let bar = document.getElementById("timelineBar");
  bar.style.width = (minute / 90) * 100 + "%";
}
