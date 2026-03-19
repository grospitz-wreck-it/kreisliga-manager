function updateTable() {
  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  teams
    .sort((a, b) => b.points - a.points)
    .forEach(t => {
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
  box.innerHTML = `<p>${text}</p>` + box.innerHTML;
}

function updateScoreboard(t1, t2, s1, s2) {
  document.getElementById("score").innerText = `${s1} : ${s2}`;
  document.getElementById("teamLeft").innerText = t1.name;
  document.getElementById("teamRight").innerText = t2.name;
}

function updateTimeline(minute) {
  document.getElementById("timelineBar").style.width =
    (minute / 90) * 100 + "%";
}
