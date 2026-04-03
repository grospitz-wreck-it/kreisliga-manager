import { loadCSV } from "./loader.js";

export async function loadLeaguesFromCSV(path){

  const rows = await loadCSV(path);

  console.log("🧪 Erste CSV-Zeile:", rows?.[0]);

  if(!rows || rows.length === 0){
    console.warn("⚠️ CSV leer oder nicht geladen");
    return {};
  }

  const leagues = {};

  rows.forEach(row => {

    // 👉 Keys normalisieren
    const normalized = {};
    Object.keys(row).forEach(k => {
      normalized[k.toLowerCase().trim()] = row[k];
    });

    const liga = normalized.liga;
    if(!liga) return;

    const key = liga.toLowerCase().replace(/\s+/g, "_");

    // 👉 Teams aus Team1–Team16 ziehen
    const teams = [];

    for(let i = 1; i <= 20; i++){ // flexibel bis 20
      const t = normalized[`team${i}`];
      if(t && t.trim() !== ""){
        teams.push(t.trim());
      }
    }

    if(teams.length === 0) return;

    leagues[key] = {
      name: liga,
      teams
    };
  });

  console.log("📊 Geladene Ligen:", Object.keys(leagues).length);

  return leagues;
}
