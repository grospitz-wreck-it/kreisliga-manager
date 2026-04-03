import { getAvailablePlayers, markAssigned } from "./playerPool.js";

function sample(arr, n){
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export function generateTeam(team){

  let squad = [];

  function pick(pos, n){
    const pool = getAvailablePlayers(pos);
    return sample(pool, n);
  }

  squad.push(...pick("Torwart", 2));
  squad.push(...pick("Verteidiger", 5));
  squad.push(...pick("Mittelfeld", 6));
  squad.push(...pick("Stürmer", 3));

  // fallback
  if(squad.length < 16){
    const rest = getAvailablePlayers("Mittelfeld"); // fallback flexibel
    squad.push(...sample(rest, 16 - squad.length));
  }

  markAssigned(squad, team.name);

  return squad;
}
