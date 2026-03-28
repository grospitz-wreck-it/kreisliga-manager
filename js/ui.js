// =========================
// 📊 TABELLE
// =========================
console.log("UI START");
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
    const pts = team._live?.points ?? team.points;
    const gf  = team._live?.gf ?? team.goalsFor;
    const ga  = team._live?.ga ?? team.goalsAgainst;
    const diff = gf - ga;

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
// =========================
// 🎮 MATCH UI
// =========================

function updateScoreUI(){

  const el = document.getElementById("score");
  if(!el || !window.currentMatch) return;

  el.innerText =
    window.currentMatch.score.home + " : " +
    window.currentMatch.score.away;
}

function updateTeamsUI(){

  if(!window.currentMatch) return;

  const l = document.getElementById("teamLeft");
  const r = document.getElementById("teamRight");

  if(l) l.innerText = window.currentMatch.home;
  if(r) r.innerText = window.currentMatch.away;
}

function updateProgressBar(){

  const bar = document.getElementById("momentumBar");
  if(!bar) return;

  const minute = game.match.minute || 0;
  const percent = (minute / 90) * 100;

  bar.style.width = percent + "%";
}
// =========================
// 📢 LIVE EVENTS UI
// =========================
function addLiveEvent(text, minute){

  const box = document.getElementById("liveMatch");
  if(!box) return;

  const el = document.createElement("div");
  el.innerText = `${minute}' ${text}`;

  box.prepend(el);
}

function clearLiveEvents(){

  const box = document.getElementById("liveMatch");
  if(!box) return;

  box.innerHTML = "";
}
function renderSchedule(){

  const container = document.getElementById("scheduleContainer");
  if(!container) return;

  const schedule = game.league.schedule;

  if(!schedule || schedule.length === 0){
    container.innerHTML = "<p>Kein Spielplan vorhanden</p>";
    return;
  }

  let html = "";

  schedule.forEach((round, index) => {

    const isCurrent = index === game.league.currentMatchday;

    html += `
      <div class="matchday ${isCurrent ? "current" : ""}">
        <h4>Spieltag ${index + 1}</h4>
    `;

    round.forEach(match => {

      const isUser =
        match.home === game.team.selected ||
        match.away === game.team.selected;

      html += `
        <div class="match ${isUser ? "highlight" : ""}">
          <span>${match.home}</span>
          <span>vs</span>
          <span>${match.away}</span>
        </div>
      `;
    });

    html += `</div>`;
  });

  container.innerHTML = html;
}
function bindUI(){

  console.log("🔗 bindUI aktiv");

  // ===== SETUP =====
  document.getElementById("menuBtn")
    ?.addEventListener("click", toggleSetup);

  document.querySelector(".closeBtn")
    ?.addEventListener("click", closeSetup);

  document.getElementById("selectLeagueBtn")
    ?.addEventListener("click", selectLeague);

  document.getElementById("selectTeamBtn")
    ?.addEventListener("click", selectTeam);

  document.getElementById("resetBtn")
    ?.addEventListener("click", resetGame);

  // ===== TABS =====
  document.querySelectorAll(".tableTabs .tab").forEach(tab => {

    tab.addEventListener("click", () => {

      // Buttons
      document.querySelectorAll(".tableTabs .tab")
        .forEach(t => t.classList.remove("active"));

      tab.classList.add("active");

      // Inhalte
      document.querySelectorAll(".tabContent")
        .forEach(c => c.classList.remove("active"));

      const target = document.getElementById(tab.dataset.tab);
      target?.classList.add("active");

      // 🔥 Spielplan rendern beim Öffnen
      if(tab.dataset.tab === "scheduleTab"){
        renderSchedule();
      }
    });

  });

  // ===== SPEED =====
  document.querySelectorAll(".speedControl button")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        setSpeed(Number(btn.innerText.replace("x","")));
      });
    });

}
// =========================
// 🌍 EXPORT
// =========================
window.addLiveEvent = addLiveEvent;
window.clearLiveEvents = clearLiveEvents;
// =========================
// 🌍 GLOBAL EXPORTS (FIX)
// =========================
window.updateTable = updateTable;
window.populateTeamSelect = populateTeamSelect;
window.updateHeader = updateHeader;
window.bindUI = bindUI;
window.updateScoreUI = updateScoreUI;
window.updateTeamsUI = updateTeamsUI;
window.updateProgressBar = updateProgressBar;
