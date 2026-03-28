// =========================
// 🧠 UI MODULE
// =========================
console.log("UI START");
// =========================
// 🧾 HEADER
// =========================
function updateHeader(){

  const title = document.getElementById("gameTitle");
  const sub = document.getElementById("leagueTitle");

  if(title){
    title.innerText = game.player?.name || "Manager";
  }

  if(sub){
    const leagueName =
      window.LEAGUES?.[game.league.key]?.name || "Keine Liga";

    const team = game.team?.selected || "";

    sub.innerText = team
      ? `${leagueName} • ${team}`
      : leagueName;
  }
}
// =========================
// 🏆 LIGA SELECT
// =========================
function initLeagueSelect(){

  console.log("🔥 initLeagueSelect CALLED");

  const select = document.getElementById("leagueSelect");
  if(!select || typeof LEAGUES === "undefined") return;

  select.innerHTML = "";

  Object.entries(LEAGUES).forEach(([key, val]) => {

    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = val.name;

    select.appendChild(opt);
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

  if(game.team.selected){
    select.value = game.team.selected;
  }
}

// =========================
// 📊 TABELLE
// =========================
function updateTable(){

  const table = document.querySelector("#table tbody");
  if(!table) return;

  table.innerHTML = "";

  const teams = game.league.teams;
  if(!teams || teams.length === 0) return;

  const sorted = [...teams].sort((a,b)=>{

    if(b.points !== a.points) return b.points - a.points;

    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;

    if(diffB !== diffA) return diffB - diffA;

    if(b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    return a.name.localeCompare(b.name);
  });

  sorted.forEach((team, index)=>{

    const row = document.createElement("tr");

    const isPlayer = team.name === game.team.selected;

    const gf = team.goalsFor || 0;
    const ga = team.goalsAgainst || 0;

    row.innerHTML = `
      <td>${index + 1}</td>
      <td ${isPlayer ? 'style="color:#4caf50;font-weight:bold"' : ''}>
        ${team.name}
      </td>
      <td>${team.played || 0}</td>
      <td>${team.wins || 0}</td>
      <td>${team.draws || 0}</td>
      <td>${team.losses || 0}</td>
      <td>${gf}:${ga}</td>
      <td>${gf - ga}</td>
      <td><strong>${team.points || 0}</strong></td>
    `;

    table.appendChild(row);
  });
}

// =========================
// 📅 SPIELPLAN
// =========================
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

  document.getElementById("teamLeft").innerText = window.currentMatch.home;
  document.getElementById("teamRight").innerText = window.currentMatch.away;
}

function updateProgressBar(){

  const bar = document.getElementById("momentumBar");
  if(!bar) return;

  const minute = game.match.minute || 0;
  bar.style.width = (minute / 90 * 100) + "%";
}

// =========================
// 📢 EVENTS
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
  if(box) box.innerHTML = "";
}

// =========================
// 🎮 UI BINDINGS (FIXED)
// =========================
function bindUI(){

  console.log("🔗 bindUI aktiv");

  function bind(el, fn){
    if(!el) return;

    el.addEventListener("pointerdown", e => {
      e.preventDefault();
      fn();
    });
  }

  bind(document.getElementById("mainActionBtn"),
    () => window.handleMainAction?.());

  bind(document.getElementById("menuBtn"),
    () => window.toggleSetup?.());

  bind(document.getElementById("overlay"),
    () => window.closeSetup?.());

  bind(document.getElementById("selectLeagueBtn"),
    () => window.selectLeague?.());

  bind(document.getElementById("selectTeamBtn"),
    () => window.selectTeam?.());

  bind(document.getElementById("resetBtn"),
    () => window.resetGame?.());

  // SPEED
  document.querySelectorAll(".speedControl button")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        window.setSpeed?.(Number(btn.innerText.replace("x","")));
      });
    });

  // TABS
  document.querySelectorAll(".tableTabs .tab").forEach(tab => {

    tab.addEventListener("click", () => {

      document.querySelectorAll(".tableTabs .tab")
        .forEach(t => t.classList.remove("active"));

      tab.classList.add("active");

      document.querySelectorAll(".tabContent")
        .forEach(c => c.classList.remove("active"));

      document.getElementById(tab.dataset.tab)
        ?.classList.add("active");

      if(tab.dataset.tab === "scheduleTab"){
        renderSchedule();
      }

    });

  });

}

// =========================
// 🌍 EXPORTS
// =========================
window.initLeagueSelect = initLeagueSelect;
window.populateTeamSelect = populateTeamSelect;
window.updateTable = updateTable;
window.updateHeader = updateHeader;
window.bindUI = bindUI;
window.updateScoreUI = updateScoreUI;
window.updateTeamsUI = updateTeamsUI;
window.updateProgressBar = updateProgressBar;
window.addLiveEvent = addLiveEvent;
window.clearLiveEvents = clearLiveEvents;
window.renderSchedule = renderSchedule;
