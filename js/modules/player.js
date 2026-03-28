function createPlayer(name, position){

  return {
    id: crypto.randomUUID(),
    name,
    position, // GK, DEF, MID, ATT
    rating: rand(50, 80),
    form: rand(40, 100),
    stamina: 100,
    yellow: 0,
    red: false
  };
}

function generateTeamPlayers(){

  return [
    createPlayer("Max Müller", "GK"),
    createPlayer("Schmidt", "DEF"),
    createPlayer("Kaya", "DEF"),
    createPlayer("Ali", "MID"),
    createPlayer("Jonas", "MID"),
    createPlayer("Ben", "ATT")
  ];
}

function rand(min, max){
  return Math.floor(Math.random()*(max-min)+min);
}

window.generateTeamPlayers = generateTeamPlayers;
