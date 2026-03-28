const matchState = {
  minute: 0,
  running: false,
  score: { home: 0, away: 0 }
};

function handleMainAction(){
  if(game.phase !== "live"){
    startMatch();
  } else {
    endMatch();
  }
}

function findPlayerMatch(){

  const round = game.league.schedule?.[game.league.currentRound];
  const myTeam = game.team.selected;

  console.log("Mein Team:", myTeam?.name);

  if(!round) return null;

  return round.find(match =>
    match.home.name === myTeam?.name ||
    match.away.name === myTeam?.name
  );
}

function simulateMatch(home, away){

  const diff = home.strength - away.strength;

  return {
    home: Math.max(0, Math.round(Math.random()*2 + diff*0.02)),
    away: Math.max(0, Math.round(Math.random()*2 - diff*0.02))
  };
}

function simulateMatchday(){

  const round = game.league.schedule?.[game.league.currentRound];

  if(!round) return;

  round.forEach(match => {

    if(
      match.home.name === game.team.selected?.name ||
      match.away.name === game.team.selected?.name
    ){
      return;
    }

    const result = simulateMatch(match.home, match.away);

    match.result = result;

    updateTable(match.home, match.away, result.home, result.away);
  });
}

function startMatch(){

  simulateMatchday();

  let match = findPlayerMatch();

  if(!match){
    console.warn("Fallback Match");
    match = game.league.schedule?.[game.league.currentRound]?.[0];
  }

  if(!match) return;

  game.match.current = match;
  game.phase = "live";

  matchState.minute = 0;
  matchState.running = true;
  matchState.score.home = 0;
  matchState.score.away = 0;

  renderCurrentMatch();
  updateUI();

  runMatchLoop();
}

function runMatchLoop(){

  const interval = setInterval(() => {

    if(!matchState.running){
      clearInterval(interval);
      return;
    }

    matchState.minute++;

    // 🔥 SAFE CALL
    if(typeof updateUI === "function"){
      updateUI();
    }

    if(matchState.minute > 90){
      clearInterval(interval);
      endMatch();
    }

  }, 300);
}
function endMatch(){

  const match = game.match.current;

  match.result = {
    home: matchState.score.home,
    away: matchState.score.away
  };

  updateTable(
    match.home,
    match.away,
    matchState.score.home,
    matchState.score.away
  );

  game.league.currentRound++;
  game.phase = "idle";

  renderSchedule();
}

window.handleMainAction = handleMainAction;
