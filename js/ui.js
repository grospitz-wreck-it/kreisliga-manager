// =========================
// 📊 TABELLE
// =========================

function updateTable(){

  const table = document.querySelector("#table tbody");
  if(!table) return;

  table.innerHTML = "";

  const teams = game.league.teams;

  if(!teams || teams.length === 0){
    return;
  }

  // =========================
  // 📊 SORTIERUNG (ECHT)
  // =========================
  const sorted = [...teams].sort((a,b)=>{

    // 1. Punkte
    if(b.points !== a.points){
      return b.points - a.points;
    }

    // 2. Tordifferenz
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;

    if(diffB !== diffA){
      return diffB - diffA;
    }

    // 3. Tore
    if(b.goalsFor !== a.goalsFor){
      return b.goalsFor - a.goalsFor;
    }

    // 4. (Pseudo) direkter Vergleich fallback
    return a.name.localeCompare(b.name);
  });

  // =========================
  // 🧱 RENDER
  // =========================
  sorted.forEach((team, index)=>{

    const row = document.createElement("tr");

    const isPlayer = team.name === game.team.selected;
    const diff = team.goalsFor - team.goalsAgainst;

    row.innerHTML = `
      <td>${index + 1}</td>
      <td ${isPlayer ? 'style="font-weight:bold;color:#4caf50"' : ''}>
        ${team.name}
      </td>
      <td>${team.played || 0}</td>
      <td>${team.wins || 0}</td>
      <td>${team.draws || 0}</td>
      <td>${team.losses || 0}</td>
      <td>${team.goalsFor || 0}:${team.goalsAgainst || 0}</td>
      <td>${diff}</td>
      <td><strong>${team.points || 0}</strong></td>
    `;

    table.appendChild(row);
  });
}

// =========================
// 📋 TEAM DROPDOWN
// =========================

function populateTeamSelect(){

  const select = document.getElementById("teamSelect");
  if(!select) return;

  select.innerHTML = "";

  if(!game.league.teams) return;

  game.league.teams.forEach(team => {

    const opt = document.createElement("option");
    opt.value = team.name;
    opt.textContent = team.name;

    select.appendChild(opt);
  });

  // bereits gewähltes Team setzen
  if(game.team.selected){
    select.value = game.team.selected;
  }
}

// =========================
// 🧾 HEADER UPDATE (Fallback)
// =========================

function updateHeader(){

  const title = document.getElementById("gameTitle");
  const sub = document.getElementById("leagueTitle");

  if(title){
    title.innerText = game.player?.name || "Manager";
  }

  if(sub){
    const league = game.league?.key || "Keine Liga";
    const team = game.team?.selected || "";

    sub.innerText = team 
      ? `${league} • ${team}`
      : league;
  }
}
// =========================
// 🎮 UI EVENT SYSTEM (MOBILE FIX)
// =========================
function bindUI(){

  function bindButton(el, handler){
    if(!el) return;

    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      handler();
    });
  }

  bindButton(document.getElementById("mainActionBtn"), handleMainAction);
  bindButton(document.getElementById("menuBtn"), toggleSetup);
  bindButton(document.getElementById("overlay"), closeSetup);
}
