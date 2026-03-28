const LEAGUES = {
  a: {
    name: "Liga A",
    teams: ["Team 1", "Team 2"]
  },
  b: {
    name: "Liga B",
    teams: ["Team 3", "Team 4"]
  }
};

function selectLeague(key){

  const data = LEAGUES[key];

  game.league.key = key;
  game.league.teams = data.teams;

  populateTeamSelect();
}

function selectTeam(name){
  game.team.selected = name;
}

window.LEAGUES = LEAGUES;
window.selectLeague = selectLeague;
window.selectTeam = selectTeam;
