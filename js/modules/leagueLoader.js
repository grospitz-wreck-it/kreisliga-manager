import { loadCSV } from "./loader.js";

export async function loadLeaguesFromCSV(path){

  const rows = await loadCSV(path);

  const leagues = {};

  rows.forEach(row => {

    const liga = row.liga?.trim();
    const team = row.team?.trim();

    if(!liga || !team) return;

    const key = liga.toLowerCase().replace(/\s+/g, "_");

    if(!leagues[key]){
      leagues[key] = {
        name: `Kreisliga A ${liga}`,
        teams: []
      };
    }

    leagues[key].teams.push(team);
  });

  return leagues;
}
