let interval = null;

function handleMainAction(){

  console.log("PHASE:", game.phase);

  if(game.phase === "setup"){
    startMatch();
  }
  else if(game.phase === "live"){
    endMatch();
  }
}

function startMatch(){

  const teams = game.league.teams;

  if(!teams.length){
    alert("Liga wählen!");
    return;
  }

  game.match.current = {
    home: teams[0],
    away: teams[1]
  };

  game.phase = "live";

  updateMatchUI("Spiel gestartet");

  interval = setTimeout(() => {
    endMatch();
  }, 3000);
}

function endMatch(){

  clearTimeout(interval);

  game.phase = "setup";

  updateMatchUI("Spiel beendet");
}

window.handleMainAction = handleMainAction;
