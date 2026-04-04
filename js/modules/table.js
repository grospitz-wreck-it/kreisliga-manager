import { getSelectedTeam } from "./league.js";
import { game } from "../core/state.js";

// =========================
// 🧠 HELPERS (NEU)
// =========================
function getTeamName(team){
  return typeof team === "string" ? team : team?.name;
}

// =========================
// 📊 SORTIERUNG
// =========================
function sortTable(table){
  return table.sort((a, b) => {

    if(b.points !== a.points){
      return b.points - a.points;
    }

    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;

    if(diffB !== diffA){
      return diffB - diffA;
    }

    return b.goalsFor - a.goalsFor;
  });
}

// =========================
// 📈 LIVE TABELLE (FIXED)
// =========================
function getLiveTable(){

  const teams = game.league?.current?.teams;
  if(!teams) return [];

  // 👉 saubere Kopie (wichtig!)
  const table = teams.map(team => ({
    ...(typeof team === "string" ? { name: team } : team)
  }));

  const match = game.match.current;
  if(!match) return table;

  const homeName = getTeamName(match.home);
  const awayName = getTeamName(match.away);

  const home = table.find(t => t.name === homeName);
  const away = table.find(t => t.name === awayName);

  if(!home || !away) return table;

  const h = game.match.live.score.home;
  const a = game.match.live.score.away;

  // Tore simulieren
  home.goalsFor += h;
  home.goalsAgainst += a;

  away.goalsFor += a;
  away.goalsAgainst += h;

  // Punkte simulieren
  if(h > a){
    home.points += 3;
  }
  else if(a > h){
    away.points += 3;
  }
  else{
    home.points += 1;
    away.points += 1;
  }

  return table;
}

// =========================
// 🧾 TABELLE RENDERN (FIXED)
// =========================
function renderTable(customTable){

  const baseTable =
    customTable ||
    game.league?.current?.teams ||
    [];

  const normalized = baseTable.map(team => ({
    ...(typeof team === "string" ? { name: team } : team)
  }));

  const sorted = sortTable([...normalized]);

  const tbody = document.getElementById("tableBody");
  if(!tbody) return;

  tbody.innerHTML = "";

  const match = game.match.current;
  const homeName = match ? getTeamName(match.home) : null;
  const awayName = match ? getTeamName(match.away) : null;

  sorted.forEach((team, index) => {

    const tr = document.createElement("tr");

    const diff = team.goalsFor - team.goalsAgainst;

    // 🟢 Aufstieg
    if(index < 2){
      tr.style.background = "#c8f7c5";
    }

    // 🔴 Abstieg
    if(index >= sorted.length - 2){
      tr.style.background = "#f7c5c5";
    }

    // ⭐ aktuelles Spiel (FIXED)
    if(team.name === homeName || team.name === awayName){
      tr.style.fontWeight = "bold";
    }

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${team.name}</td>
      <td>${team.played ?? 0}</td>
      <td>${team.goalsFor ?? 0}:${team.goalsAgainst ?? 0}</td>
      <td>${diff}</td>
      <td>${team.points ?? 0}</td>
    `;

    tbody.appendChild(tr);
  });
}

// =========================
// ⚡ LIVE RENDER
// =========================
function renderLiveTable(){
  const live = getLiveTable();
  renderTable(live);
}

// =========================
// 📦 EXPORTS
// =========================
export {
  renderTable,
  renderLiveTable,
  getLiveTable,
  sortTable
};
