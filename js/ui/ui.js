console.log("UI START");

// =========================
// 🏆 LIGA SELECT INIT
// =========================
function initLeagueSelect(){
  console.log("🔥 initLeagueSelect CALLED");

  const select = document.getElementById("leagueSelect");
  console.log("SELECT:", select);

  if(!select) return;

  select.innerHTML = "TEST"; // 👈 TEST
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

    if(b.stats.points !== a.stats.points){
      return b.stats.points - a.stats.points;
    }

    const diffA = a.stats.goalsFor - a.stats.goalsAgainst;
    const diffB = b.stats.goalsFor - b.stats.goalsAgainst;

    if(diffB !== diffA){
      return diffB - diffA;
    }

    return b.stats.goalsFor - a.stats.goalsFor;
  });

  sorted.forEach((team, index)=>{

    const s = team.stats;

    const row = document.createElement("tr");

    const isPlayer = team.name === game.team.name;

    row.innerHTML = `
      <td>${index + 1}</td>
      <td ${isPlayer ? 'style="font-weight:bold;color:#4caf50"' : ''}>
        ${team.name}
      </td>
      <td>${s.played}</td>
      <td>${s.wins}</td>
      <td>${s.draws}</td>
      <td>${s.losses}</td>
      <td>${s.goalsFor}:${s.goalsAgainst}</td>
      <td>${s.points}</td>
    `;

    table.appendChild(row);
  });
}

// =========================
// 📋 TEAM SELECT
// =========================
function populateTeamSelect(){

  const select = document.getElementById("teamSelect");
  if(!select) return;

  select.innerHTML = "";

  game.league.teams.forEach(team => {

    const opt = document.createElement("option");
    opt.value = team.id;
    opt.textContent = team.name;

    select.appendChild(opt);
  });
}

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
    const league = game.league?.name || "Keine Liga";
    const team = game.team?.name || "";

    sub.innerText = team 
      ? `${league} • ${team}`
      : league;
  }
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

  document.getElementById("teamLeft").innerText = currentMatch.home;
  document.getElementById("teamRight").innerText = currentMatch.away;
}

function updateProgressBar(){

  const bar = document.getElementById("momentumBar");
  if(!bar) return;

  const percent = (game.match.minute / 90) * 100;
  bar.style.width = percent + "%";
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
// 📅 SPIELPLAN
// =========================
function renderSchedule(){

  const container = document.getElementById("scheduleContainer");
  if(!container) return;

  const schedule = game.league.schedule;

  if(!schedule || schedule.length === 0){
    container.innerHTML = "<p>Kein Spielplan</p>";
    return;
  }

  let html = "";

  schedule.forEach((round, index) => {

    html += `<div class="matchday"><h4>Spieltag ${index+1}</h4>`;

    round.forEach(match => {

      html += `
        <div class="match">
          ${match.home} vs ${match.away}
        </div>
      `;
    });

    html += `</div>`;
  });

  container.innerHTML = html;
}

// =========================
// 🎮 BINDINGS (EINMAL!)
// =========================
function bindUI(){

  console.log("🔗 bindUI aktiv");

  // MAIN BUTTON
  document.getElementById("mainButton")
    ?.addEventListener("click", handleMainAction);

  // MENU
  document.getElementById("menuBtn")
    ?.addEventListener("click", toggleSetup);

  document.getElementById("overlay")
    ?.addEventListener("click", closeSetup);

  // SELECTS
  document.getElementById("leagueSelect")
    ?.addEventListener("change", selectLeague);

  document.getElementById("teamSelect")
    ?.addEventListener("change", selectTeam);

  // RESET
  document.getElementById("resetGameBtn")
    ?.addEventListener("click", resetGame);

  // SPEED
  document.querySelectorAll(".speedControl button")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        setSpeed(Number(btn.dataset.speed));
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
window.updateTable = updateTable;
window.populateTeamSelect = populateTeamSelect;
window.updateHeader = updateHeader;
window.bindUI = bindUI;
window.updateScoreUI = updateScoreUI;
window.updateTeamsUI = updateTeamsUI;
window.updateProgressBar = updateProgressBar;
window.addLiveEvent = addLiveEvent;
window.clearLiveEvents = clearLiveEvents;
