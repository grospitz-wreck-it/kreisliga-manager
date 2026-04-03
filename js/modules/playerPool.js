let playerPool = [];
let assigned = new Map(); // teamId -> players[]

export function initPlayerPool(players){
  playerPool = players;
}

export function getAvailablePlayers(position){
  return playerPool.filter(p => !p.Team && p.Position === position);
}

export function markAssigned(players, teamId){
  players.forEach(p => {
    p.Team = teamId;
  });
}
