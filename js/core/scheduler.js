function generateSchedule(){

  const teams = game.league.teams;
  const rounds = [];

  for(let i=0;i<teams.length-1;i++){

    const round = [];

    for(let j=0;j<teams.length/2;j++){

      round.push({
        home: teams[j],
        away: teams[teams.length-1-j],
        result: null
      });
    }

    teams.splice(1,0,teams.pop());
    rounds.push(round);
  }

  game.league.schedule = rounds;
}

window.generateSchedule = generateSchedule;
