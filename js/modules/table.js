```js
// =========================
// 📊 TABLE SYSTEM (FINAL FIX)
// =========================
import { game } from "../core/state.js";

// =========================
// 🧠 HELPERS
// =========================
function getTeamName(team){
  return typeof team === "string" ? team : team?.name;
}

// 👉 sorgt für stabile Tabellenwerte
function normalizeTeam(team){
  const name = getTeamName(team);

  return {
    name,
    played: team.played ?? 0,
    goalsFor: team.goalsFor ?? 0,
    goalsAgainst: team.goalsAgainst ?? 0,
    points: team.points ?? 0
  };
}

// =========================
// 🧱 INIT TABLE (NEU)
// =========================
function initTable(){

  const teams = game.league?.current?.teams;
  if(!teams) return;

  game.league.table = teams.map(t => normalizeTeam(t));

  console.log("📊 Tabelle initialisiert");
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
// 📈 LIVE TABLE (ROBUST)
// =========================
function getLiveTable(){

  if(!game.league.table || game.league.table.length === 0){
    initTable();
  }

  // 👉 WICHTIG: tiefe Kopie!
  const table = game.league.table.map(t => ({ ...t }));

  const match = game.match.current;
  if(!match) return table;

  const homeName = getTeamName(match.home);
  const awayName = getTeamName(match.away);

  const home = table.find(t => t.name === homeName);
  const away = table.find(t => t.name === awayName);

  if(!home || !away) return table;

  const h = game.match.live.score.home;
  const a = game.match.live.score.away;

  // Tore
  home.goalsFor += h;
  home.goalsAgainst += a;

  away.goalsFor += a;
  away.goalsAgainst += h;

  // Punkte
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
// 🧾 RENDER
// =========================
function renderTable(customTable){

  if(!game.league.table || game.league.table.length === 0){
    initTable();
  }

  const tableData = customTable || game.league.table;

  const sorted = sortTable([...tableData]);

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

    // ⭐ aktuelles Spiel
    if(team.name === homeName || team.name === awayName){
      tr.style.fontWeight = "bold";
    }

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${team.name}</td>
      <td>${team.played}</td>
      <td>${team.goalsFor}:${team.goalsAgainst}</td>
      <td>${diff}</td>
      <td>${team.points}</td>
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
  initTable,
  renderTable,
  renderLiveTable,
  getLiveTable,
  sortTable
};
```
