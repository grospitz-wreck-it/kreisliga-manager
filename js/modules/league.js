// =========================
// 📦 IMPORTS
// =========================
import { generateSchedule } from "./scheduler.js";
import { renderSchedule, renderCurrentMatch } from "../ui/ui.js";
import { renderTable } from "./table.js";
import { game } from "../core/state.js";
import { generateTeam } from "./teamLoader.js";

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

  if (!game.data || !game.data.leagues) {
    console.warn("⚠️ leagues noch nicht geladen");
    return;
  }

  selects.forEach(select => {

    select.innerHTML = "";
    select.onchange = null;

    game.data.leagues.forEach((league, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = league.name;
      select.appendChild(option);
    });

    select.onchange = (e) => {

      const index = e.target.value;
      game.league.current = game.data.leagues[index];

      // sync beide selects
      selects.forEach(s => {
        if(s !== select) s.value = index;
      });

      populateTeamSelect();
    };
  });

  // 👉 initial setzen
  if (game.data.leagues.length > 0) {
    game.league.current = game.data.leagues[0];
    populateTeamSelect();
  }
}

// =========================
// 👕 TEAM DROPDOWN (FIXED)
// =========================
function populateTeamSelect() {

  const splashSelect = document.getElementById("teamSelect");
  const menuSelect   = document.getElementById("teamSelectMenu");

  const selects = [splashSelect, menuSelect].filter(Boolean);

  const league = game.league?.current;

  if (!league || !league.teams) {
    console.warn("⚠️ Keine Teams gefunden:", league);
    return;
  }

  selects.forEach(select => {

    select.innerHTML = "";
    select.onchange = null;

    league.teams.forEach(team => {

      const option = document.createElement("option");

      const name =
        typeof team === "string" ? team : team.name;

      option.value = name;
      option.textContent = name;

      select.appendChild(option);
    });

    select.onchange = (e) => {

      const teamName = e.target.value;
      selectTeam(teamName);

      // sync beide selects
      selects.forEach(s => {
        if(s !== select) s.value = teamName;
      });
    };
  });

  // 👉 default team setzen
  if (league.teams.length > 0) {
    const first =
      typeof league.teams[0] === "string"
        ? league.teams[0]
        : league.teams[0].name;

    game.team = game.team || {};
    game.team.selected = first;
  }

  console.log("✅ Teams geladen:", league.teams.length);
}

// =========================
// 👤 TEAM WÄHLEN
// =========================
function selectTeam(teamName){

  const teams = game.league?.current?.teams;

  if(!teams || teams.length === 0){
    console.error("❌ Keine Teams geladen");
    return;
  }

  const teamObj =
    typeof teams[0] === "string"
      ? { name: teamName }
      : teams.find(t => t.name === teamName);

  if(!teamObj){
    console.warn("⚠️ Team nicht gefunden:", teamName);
    return;
  }

  game.team.selected = teamName;

  // 🆕 Spieler generieren falls nötig
  const players = ensureTeamPlayers(teamObj);
  game.team.players = players;

  renderCurrentMatch();
}

// =========================
// 🧠 GET TEAM
// =========================
function getSelectedTeam(){

  const teams = game.league?.current?.teams;

  if (!teams) return null;

  return typeof teams[0] === "string"
    ? teams.find(t => t === game.team.selected)
    : teams.find(t => t.name === game.team.selected);
}

// =========================
// 📦 EXPORTS
// =========================
export {
  initLeagueSelect,
  populateTeamSelect,
  selectTeam,
  getSelectedTeam
};
