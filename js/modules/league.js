// =========================
// 📦 IMPORTS
// =========================
import { generateSchedule } from "./scheduler.js";
import { renderSchedule, renderCurrentMatch } from "../ui/ui.js";
import { renderTable } from "./table.js";
import { game } from "../core/state.js";
import { generateTeam } from "./teamLoader.js";
import { loadLeaguesFromCSV } from "./leagueLoader.js";


// =========================
// 📦 LIGEN DATEN (DYNAMISCH)
// =========================
let LEAGUES = {};


// =========================
// 🧠 HELPERS
// =========================
function ensureTeamPlayers(team){

  if(team.players && team.players.length > 0){
    return team.players;
  }

  console.log(`⚽ Generiere Kader für ${team.name}`);

  team.players = generateTeam(team);

  console.log(`✅ ${team.players.length} Spieler für ${team.name}`);

  return team.players;
}


// =========================
// 🏆 LIGA DROPDOWN
// =========================
async function initLeagueSelect(){

  const select = document.getElementById("leagueSelect");
  if(!select) return;

  try {
    LEAGUES = await loadLeaguesFromCSV("./data/ligen.csv");
    console.log("✅ Ligen geladen:", Object.keys(LEAGUES).length);
  } catch(e){
    console.error("❌ Fehler beim Laden der Ligen:", e);
    return;
  }

  select.innerHTML = `<option value="">Liga wählen</option>`;

  Object.keys(LEAGUES).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = LEAGUES[key].name;
    select.appendChild(opt);
  });

  select.onchange = (e) => {
    const value = e.target.value;
    if(!value) return;

    selectLeague(value);
  };
}


// =========================
// 👕 TEAM DROPDOWN
// =========================
function populateTeamSelect(){

  const select = document.getElementById("teamSelect");
  if(!select) return;

  select.innerHTML = `<option value="">Team wählen</option>`;

  const teams = game.league.teams;

  if(!teams || teams.length === 0) return;

  teams.forEach(team => {
    const opt = document.createElement("option");
    opt.value = team.name;
    opt.textContent = `${team.name} (Stärke ${team.strength})`;
    select.appendChild(opt);
  });

  select.onchange = (e) => {
    const value = e.target.value;
    if(!value) return;

    selectTeam(value);
  };
}


// =========================
// 🏟️ LIGA LADEN
// =========================
function selectLeague(key){

  const data = LEAGUES[key];

  if(!data){
    console.error("❌ Liga nicht gefunden:", key);
    return;
  }

  // Reset
  game.league.key = key;
  game.league.currentRound = 0;
  game.league.currentMatchIndex = 0;

  game.team.selected = null;
  game.match.current = null;

  // =========================
  // 🧠 TEAMS ERZEUGEN
  // =========================
  game.league.teams = data.teams.map(name => ({
    name,
    strength: Math.floor(Math.random() * 30) + 60,
    tactic: "balanced",
    form: [],
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    played: 0
  }));

  console.log(`✅ Liga "${data.name}" geladen mit ${game.league.teams.length} Teams`);

  // =========================
  // 📅 SPIELPLAN
  // =========================
  generateSchedule();

  if(!game.league.schedule || game.league.schedule.length === 0){
    console.error("❌ Spielplan fehlgeschlagen!");
    return;
  }

  console.log("📅 Spielplan ready:", game.league.schedule.length);

  // =========================
  // 🖥️ UI UPDATE
  // =========================
  renderTable();
  populateTeamSelect();
  renderSchedule();
}


// =========================
// 👤 TEAM WÄHLEN
// =========================
function selectTeam(teamName){

  console.log("👉 selectTeam Input:", teamName);

  const teams = game.league.teams;

  if(!teams || teams.length === 0){
    console.error("❌ Keine Teams geladen");
    return;
  }

  const team = teams.find(t => t.name === teamName);

  if(!team){
    console.warn("⚠️ Ungültiger Team-Wert:", teamName);
    return;
  }

  game.team.selected = team.name;

  console.log("✅ Team gewählt:", team.name);

  // 🆕 Lazy Spieler laden
  const players = ensureTeamPlayers(team);
  game.team.players = players;

  const tacticSelect = document.getElementById("tacticSelect");
  if(tacticSelect){
    tacticSelect.value = team.tactic;
  }

  renderCurrentMatch();
}


// =========================
// 🧠 GET SELECTED TEAM
// =========================
function getSelectedTeam(){
  return game.league.teams.find(
    t => t.name === game.team.selected
  );
}


// =========================
// 📦 EXPORTS
// =========================
export {
  initLeagueSelect,
  populateTeamSelect,
  selectLeague,
  selectTeam,
  getSelectedTeam
};
