import { getSelectedTeam } from "./league.js";
import { game } from "../core/state.js";

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
// 📈 LIVE TABELLE
// =========================
function getLiveTable(){

const table = game.league.teams.map(team => ({
...team
}));

const match = game.match.current;

if(!match) return table;

const home = table.find(t => t.name === match.home.name);
const away = table.find(t => t.name === match.away.name);

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
// 🧾 TABELLE RENDERN
// =========================
function renderTable(customTable){

const tableData = customTable || game.league.teams;
const sorted = sortTable([...tableData]);

const tbody = document.getElementById("tableBody");
if(!tbody) return;

tbody.innerHTML = "";

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
const match = game.match.current;

if(match){
  if(
    team.name === match.home.name ||
    team.name === match.away.name
  ){
    tr.style.fontWeight = "bold";
  }
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
renderTable,
renderLiveTable,
getLiveTable,
sortTable
};
