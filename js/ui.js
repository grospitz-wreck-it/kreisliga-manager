// =========================
// 📊 TABELLE (FINAL CLEAN)
// =========================
function updateTable(isLive = false, liveT1 = null, liveT2 = null) {

  const tbody = document.querySelector("#table tbody");
  if(!tbody) return;

  tbody.innerHTML = "";

  // 👉 KEIN originales Array zerstören!
  let tableData = teams.map(t => ({ ...t }));

  // =========================
  // 🔥 LIVE OVERRIDE
  // =========================
  if(isLive && liveT1 && liveT2){
    tableData = tableData.map(t => {
      if(t.name === liveT1.name) return liveT1;
      if(t.name === liveT2.name) return liveT2;
      return t;
    });
  }

  // =========================
  // 🔥 SORTIERUNG
  // =========================
  tableData.sort((a, b) =>
    b.points - a.points ||
    (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst) ||
    b.goalsFor - a.goalsFor
  );

  // =========================
  // 🧱 RENDER
  // =========================
  tableData.forEach((t, index) => {

    let goalDiff = (t.goalsFor || 0) - (t.goalsAgainst || 0);

    let rowClass = "";

    // 👉 Tabellenplatz
    if(index === 0){
      rowClass += " first";
    }
    else if(index >= tableData.length - 2){
      rowClass += " relegation";
    }

    // 👉 eigenes Team
    if(t.name === selectedTeam){
      rowClass += " userTeamRow";
    }

    // 👉 Live Match Teams
    if(isLive && (t.name === liveT1?.name || t.name === liveT2?.name)){
      rowClass += " live";
    }

    const row = document.createElement("tr");
    row.className = rowClass.trim();

    row.innerHTML = `
      <td>${t.name}</td>
      <td>${t.played || 0}</td>
      <td>${t.wins || 0}</td>
      <td>${t.draws || 0}</td>
      <td>${t.losses || 0}</td>
      <td>${t.goalsFor || 0}:${t.goalsAgainst || 0}</td>
      <td>${goalDiff}</td>
      <td><strong>${t.points || 0}</strong></td>
    `;

    tbody.appendChild(row);
  });
}


// =========================
// 👥 TEAM SELECT
// =========================
function populateTeamSelect(){

  const select = document.getElementById("teamSelect");
  if(!select) return;

  select.innerHTML = "";

  if(!teams || teams.length === 0) return;

  teams.forEach(t => {
    let o = document.createElement("option");
    o.value = t.name;
    o.textContent = t.name;
    select.appendChild(o);
  });

  select.selectedIndex = 0;
}


// =========================
// 📢 LIVE EVENTS (FIX)
// =========================
function addEvent(text){

  const box = document.getElementById("liveMatch");
  if(!box) return;

  const p = document.createElement("p");
  p.textContent = text;

  box.prepend(p);
}


// =========================
// 🧾 SCOREBOARD
// =========================
function updateScoreboard(t1, t2, s1, s2){

  if(!t1 || !t2) return;

  const score = document.getElementById("score");
  const left = document.getElementById("teamLeft");
  const right = document.getElementById("teamRight");

  if(score) score.innerText = `${s1} : ${s2}`;
  if(left) left.innerText = t1.name;
  if(right) right.innerText = t2.name;

  if(!left || !right) return;

  left.classList.remove("leading","losing");
  right.classList.remove("leading","losing");

  if(s1 > s2){
    left.classList.add("leading");
    right.classList.add("losing");
  }
  else if(s2 > s1){
    right.classList.add("leading");
    left.classList.add("losing");
  }
}


// =========================
// ⏱️ TIMELINE
// =========================
function updateTimeline(minute){

  const bar = document.getElementById("timelineBar");
  if(!bar) return;

  bar.style.width = (minute / 90) * 100 + "%";
}
