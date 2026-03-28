const LEAGUES = {
  kreisliga: {
    name: "Kreisliga",
    size: 16
  }
};

function selectLeague(){

  const key = document.getElementById("leagueSelect").value;

  game.league.key = key;
  game.league.name = LEAGUES[key].name;

  generateLeagueTeams(LEAGUES[key].size);

  saveGame();
  updateHeader();
}

function generateLeagueTeams(count){

  const teams = [];

  for(let i=0;i<count;i++){

    teams.push({
      id: i,
      name: "Team " + (i+1),
      players: generateTeamPlayers(),
      stats: initStats()
    });
  }

  game.league.teams = teams;
}

function initStats(){
  return {
    played:0, wins:0, draws:0, losses:0,
    goalsFor:0, goalsAgainst:0, points:0
  };
}

window.selectLeague = selectLeague;
