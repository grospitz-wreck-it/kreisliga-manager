function initLeagueSelect(){

  const select = document.getElementById("leagueSelect");

  Object.entries(LEAGUES).forEach(([key, val]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = val.name;
    select.appendChild(opt);
  });
}

function populateTeamSelect(){

  const select = document.getElementById("teamSelect");
  select.innerHTML = "";

  game.league.teams.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });
}

function updateMatchUI(text){

  const el = document.getElementById("match");
  const m = game.match.current;

  if(m){
    el.innerText = `${m.home} vs ${m.away} - ${text}`;
  } else {
    el.innerText = text;
  }
}

window.initLeagueSelect = initLeagueSelect;
window.populateTeamSelect = populateTeamSelect;
window.updateMatchUI = updateMatchUI;
