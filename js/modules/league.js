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
// 🏆 INIT LEAGUE SELECT
// =========================
function initLeagueSelect(){

  const splashSelect = document.getElementById("leagueSelect");
  const menuSelect   = document.getElementById("leagueSelectMenu");

  const selects = [splashSelect, menuSelect].filter(Boolean);

  // ✅ SAFETY: verhindert deinen Crash
  if (!game.data || !game.data.leagues) {
    console.warn("⚠️ leagues noch nicht geladen");
    return;
  }

  selects.forEach(select => {

    // 🧹 reset
    select.innerHTML = "";

    // 🧠 verhindert doppelte EventListener
    select.onchange = null;

    // 🏆 Ligen füllen
    game.data.leagues.forEach((league, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = league.name;
      select.appendChild(option);
    });

    // 🔁 Change Event
    select.onchange = (e) => {
      const index = e.target.value;

      game.league.current = game.data.leagues[index];

      // 👉 optional sync zwischen Splash & Menü
      selects.forEach(s => {
        if(s !== select) s.value = index;
      });

      populateTeamSelect();
    };

  });

  // 👉 optional: initial Teams laden
  if (game.data.leagues.length > 0) {
    game.league.current = game.data.leagues[0];
    populateTeamSelect();
  }
}

// =========================
// 👕 TEAM DROPDOWN
// =========================
function populateTeamSelect(){

  const splashSelect = document.getElementById("teamSelect");
  const menuSelect   = document.getElementById("teamSelectMenu");

  const selects = [splashSelect, menuSelect].filter(Boolean);

  // ✅ SAFETY: verhindert Crash
  if (!game.league || !game.league.current || !game.league.current.teams) {
    console.warn("⚠️ keine Teams für aktuelle Liga");
    return;
  }

  const teams = game.league.current.teams;

  selects.forEach(select => {

    // 🧹 reset
    select.innerHTML = "";

    // 🧠 verhindert doppelte Listener
    select.onchange = null;

    // 👥 Teams einfügen
    teams.forEach((team, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = team.name;
      select.appendChild(option);
    });

    // 🔁 Change Event
    select.onchange = (e) => {
      const index = e.target.value;

      game.team = teams[index];

      // 🔄 Sync Splash ↔ Menü
      selects.forEach(s => {
        if(s !== select) s.value = index;
      });

      console.log("✅ Team gewählt:", game.team.name);
    };

  });

  // 👉 Initial setzen (falls noch kein Team)
  if (!game.team && teams.length > 0) {
    game.team = teams[0];

    // UI synchronisieren
    selects.forEach(s => s.value = 0);
  }
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
