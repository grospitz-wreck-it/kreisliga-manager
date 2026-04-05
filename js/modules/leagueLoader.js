// =========================
// 📦 IMPORTS
// =========================
import { loadCSV } from "./loader.js";

// =========================
// 🏆 LOAD LEAGUES FROM CSV
// =========================
export async function loadLeaguesFromCSV(path){

  const rows = await loadCSV(path);

  console.log("🧪 Erste CSV-Zeile:", rows?.[0]);

  if(!rows || rows.length === 0){
    console.warn("⚠️ CSV leer oder nicht geladen");
    return {};
  }

  const leagues = {};

  rows.forEach(row => {

    // =========================
    // 🔤 KEYS NORMALISIEREN
    // =========================
    const normalized = {};
    Object.keys(row).forEach(k => {
      normalized[k.toLowerCase().trim()] = row[k];
    });

    const liga = normalized.liga;
    if(!liga) return;

    const key = liga.toLowerCase().replace(/\s+/g, "_");

    // =========================
    // 👕 TEAMS EINLESEN
    // =========================
    const teams = [];

    for(let i = 1; i <= 20; i++){

      const raw = normalized[`team${i}`];
      if(!raw) continue;

      const name = raw.trim();

      // 👉 leere CSV-Felder ignorieren
      if(name === "") continue;

      teams.push({
        name
      });
    }

    // =========================
    // ⚠️ VALIDIERUNG
    // =========================
    if(teams.length === 0){
      console.warn(`⚠️ Liga ohne Teams übersprungen: ${liga}`);
      return;
    }

    console.log(`📊 ${liga}: ${teams.length} Teams geladen`);

    // =========================
    // ⚖️ GERADE TEAMANZAHL ERZWINGEN
    // =========================
    if(teams.length % 2 !== 0){
      console.warn(`⚠️ Liga "${liga}" hat ungerade Anzahl Teams → Freilos hinzugefügt`);

      teams.push({
        name: "Freilos"
      });
    }

    // =========================
    // 📦 SPEICHERN
    // =========================
    leagues[key] = {
      name: liga,
      teams
    };
  });

  console.log("📊 Geladene Ligen:", Object.keys(leagues).length);

  return leagues;
}
