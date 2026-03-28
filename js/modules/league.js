const LEAGUES = {
  a: {
    name: "Liga A",
    teams: [
      { name: "Team 1", strength: 70 },
      { name: "Team 2", strength: 60 }
    ]
  },
  b: {
    name: "Liga B",
    teams: [
      { name: "Team 3", strength: 80 },
      { name: "Team 4", strength: 50 }
    ]
  }
};

function selectLeague(key){

  const data = LEAGUES[key];

  game.league.key = key;

  // 🔥 WICHTIG: Kopie erstellen (kein Reference Bug)
  game.league.teams = data.teams.map(t => ({
    name: t.name,
    strength: t.strength
  }));

  populateTeamSelect();
}

function selectTeam(name){
  game.team.selected = name;
}
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
window.LEAGUES = LEAGUES;
window.selectLeague = selectLeague;
window.selectTeam = selectTeam;
