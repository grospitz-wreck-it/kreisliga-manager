function initLeagueSelect(){

  const select = document.getElementById("leagueSelect");

  Object.entries(LEAGUES).forEach(([key, val]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = val.name;
    select.appendChild(opt);
  });
}
function renderSchedule(){

  const el = document.getElementById("schedule");

  if(!el) return;

  const round = game.league.schedule?.[game.league.currentRound];

  if(!round){
    el.innerHTML = "Kein Spielplan";
    return;
  }

  let html = "<h3>Spieltag " + (game.league.currentRound + 1) + "</h3>";

  round.forEach(match => {

    const result = match.result
      ? `${match.result.home}:${match.result.away}`
      : "-:-";

    html += `
      <div>
        ${match.home.name} vs ${match.away.name} (${result})
      </div>
    `;
  });

  el.innerHTML = html;
}

window.renderSchedule = renderSchedule;
function renderCurrentMatch(){

  const el = document.getElementById("currentMatch");

  if(!el) return;

  const match = game.match.current;

  if(!match){
    el.innerHTML = "Kein Spiel aktiv";
    return;
  }

  el.innerHTML = `
    <h3>${match.home.name} vs ${match.away.name}</h3>
  `;
}

window.renderCurrentMatch = renderCurrentMatch;
function populateTeamSelect(){

  const select = document.getElementById("teamSelect");
  select.innerHTML = "";

  game.league.teams.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.name;
    opt.textContent = `${t.name} (Stärke ${t.strength})`;
    select.appendChild(opt);
  });
}

function updateMatchUI(text){

  const el = document.getElementById("match");
  const m = game.match.current;

  if(m){
    el.innerText = `${m.home.name} vs ${m.away.name} - ${text}`;
  } else {
    el.innerText = text;
  }
}

window.initLeagueSelect = initLeagueSelect;
window.populateTeamSelect = populateTeamSelect;
window.updateMatchUI = updateMatchUI;
