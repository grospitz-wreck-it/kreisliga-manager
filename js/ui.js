function updateTable() {
  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  // 🔥 Sortierung (Punkte + Torverhältnis)
  teams.sort((a, b) =>
    b.points - a.points ||
    (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst)
  );

  teams.forEach((t, index) => {

    // 👉 Dein Team markieren
    let name = t.name === selectedTeam
      ? `<span class="userTeam">👉 ${t.name}</span>`
      : t.name;

    let goalDiff = t.goalsFor - t.goalsAgainst;

    // 👉 Tabellenplatz Klassen
    let rowClass = "";

    if(index === 0){
      rowClass = "first"; // 🟢 Aufstieg
    }
    else if(index >= teams.length - 2){
      rowClass = "relegation"; // 🔴 Abstieg
    }

    tbody.innerHTML += `
      <tr class="${rowClass}">
        <td>${name}</td>
        <td>${t.played || 0}</td>
        <td>${t.wins || 0}</td>
        <td>${t.draws || 0}</td>
        <td>${t.losses || 0}</td>
        <td>${t.goalsFor || 0}:${t.goalsAgainst || 0}</td>
        <td>${goalDiff}</td>
        <td><strong>${t.points}</strong></td>
      </tr>
    `;
  });
}

function populateTeamSelect(){
  const select = document.getElementById("teamSelect");

  if(!select){
    console.warn("teamSelect nicht gefunden");
    return;
  }

  select.innerHTML = "";

  if(!teams || teams.length === 0){
    console.warn("Keine Teams zum Befüllen");
    return;
  }

  teams.forEach(t => {
    let o = document.createElement("option");
    o.value = t.name;
    o.textContent = t.name;
    select.appendChild(o);
  });

  // ✅ UX Fix (neu, aber ungefährlich)
  select.selectedIndex = 0;
}

// ⚠️ WICHTIG: Diese Version bleibt bewusst drin,
// weil sie von matchEngine genutzt wird
function addEvent(text){
  let box = document.getElementById("liveMatch");

  if(!box) return;

  box.innerHTML = `<p>${text}</p>` + box.innerHTML;
}

function updateScoreboard(t1, t2, s1, s2){
  if(!t1 || !t2) return;

  document.getElementById("score").innerText = `${s1} : ${s2}`;
  document.getElementById("teamLeft").innerText = t1.name;
  document.getElementById("teamRight").innerText = t2.name;

  // 🔥 Führung hervorheben
  document.getElementById("teamLeft").classList.remove("leading","losing");
  document.getElementById("teamRight").classList.remove("leading","losing");

  if(s1 > s2){
    document.getElementById("teamLeft").classList.add("leading");
    document.getElementById("teamRight").classList.add("losing");
  }
  else if(s2 > s1){
    document.getElementById("teamRight").classList.add("leading");
    document.getElementById("teamLeft").classList.add("losing");
  }
}

function updateTimeline(minute){
  const bar = document.getElementById("timelineBar");
  if(!bar) return;

  bar.style.width = (minute / 90) * 100 + "%";
}
