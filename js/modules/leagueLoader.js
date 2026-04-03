console.log("🧪 Erste CSV-Zeile:", rows[0]);
import { loadCSV } from "./loader.js";
export async function loadLeaguesFromCSV(path){

  const rows = await loadCSV(path);

  if(!rows || rows.length === 0){
    console.warn("⚠️ CSV leer oder nicht geladen");
    return {};
  }

  const leagues = {};

  rows.forEach(row => {

    // 👉 KEYS NORMALISIEREN
    const normalized = {};
    Object.keys(row).forEach(k => {
      normalized[k.toLowerCase()] = row[k];
    });

    const ligaRaw =
      normalized.liga ||
      normalized.kreis ||
      normalized.league;

    const team =
      normalized.team ||
      normalized.mannschaft;

    if(!ligaRaw || !team) return;

    const liga = ligaRaw.trim();
    const key = liga.toLowerCase().replace(/\s+/g, "_");

    if(!leagues[key]){
      leagues[key] = {
        name: liga.includes("Kreisliga")
          ? liga
          : `Kreisliga A ${liga}`,
        teams: []
      };
    }

    leagues[key].teams.push(team.trim());
  });

  console.log("📊 Geladene Ligen:", Object.keys(leagues).length);

  return leagues;
}
