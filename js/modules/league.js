// =========================
// 📦 IMPORTS
// =========================
import { renderCurrentMatch } from "../ui/ui.js";
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
// 🏗️ INIT LEAGUE
// =========================
function initLeague(league){

  if(!league){
    console.error("❌ Keine Liga übergeben");
    return;
  }

  if(!Array.isArray(league.teams) || league.teams.length === 0){
    console.error("❌ Liga hat keine Teams", league);
    return;
  }

  // =========================
  // 📊 TABELLE
  // =========================
  league.table = league.teams.map(team => ({
    name: team.name,
    played: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    strength: team.strength || 50
  }));

  console.log("📊 Tabelle erstellt");

  // =========================
  // 📅 SPIELPLAN
  // =========================
  if(!league.schedule || league.schedule.length === 0){

    const teams = league.teams.map(t => t.name);
    const schedule = [];

    for(let i = 0; i < teams.length - 1; i++){

      const round = [];

      for(let j = 0; j < teams.length / 2; j++){

        const home = teams[j];
        const away = teams[teams.length - 1 - j];

        round.push({ home, away });
      }

      schedule.push(round);

      // Rotation (Round Robin)
      teams.splice(1, 0, teams.pop());
    }

    league.schedule = schedule;

    console.log("📅 Spielplan generiert:", schedule.length, "Spieltage");
  }

  // =========================
  // 🔄 RESET
  // =========================
  league.currentRound = 0;

  console.log("✅ Liga initialisiert:", league.name);
}

// =========================
// 🏆 INIT LEAGUE SELECT
// =========================
function initLeagueSelect(){

  const splashSelect = document.getElementById("leagueSelect");
  const menuSelect   = document.getElementById("leagueSelectMenu");

  const selects = [splashSelect, menuSelect].filter(Boolean);

  if (!game.data?.leagues?.length) {
    console.warn("⚠️ Keine Ligen geladen");
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

      const index = Number(e.target.value);
      game.league.current = game.data.leagues[index];

      // 👉 NEU: INIT
      initLeague(game.league.current);

      // sync
      selects.forEach(s => {
        if(s !== select) s.value = index;
      });

      populateTeamSelect();
    };
  });

  // 👉 Default Liga
  game.league = game.league || {};
  game.league.current = game.data.leagues[0];

  // 👉 NEU: INIT
  initLeague(game.league.current);

  populateTeamSelect();
}

// =========================
// 👕 TEAM SELECT
// =========================
function populateTeamSelect() {

  const splashSelect = document.getElementById("teamSelect");
  const menuSelect   = document.getElementById("teamSelectMenu");

  const selects = [splashSelect, menuSelect].filter(Boolean);

  const league = game.league?.current;

  if (!league || !Array.isArray(league.teams) || league.teams.length === 0) {
    console.warn("❌ Keine Teams vorhanden:", league);
    return;
  }

  selects.forEach(select => {

    select.innerHTML = "";
    select.onchange = null;

    league.teams.forEach(team => {

      const option = document.createElement("option");

      option.value = team.name;
      option.textContent = team.name;

      select.appendChild(option);
    });

    select.onchange = (e) => {

      const teamName = e.target.value;
      selectTeam(teamName);

      // sync
      selects.forEach(s => {
        if(s !== select) s.value = teamName;
      });
    };
  });

  // 👉 Default Team
  const firstTeam = league.teams[0];

  game.team = game.team || {};
  game.team.selected = firstTeam.name;

  ensureTeamPlayers(firstTeam);

  console.log("✅ Teams geladen:", league.teams.length);
}

// =========================
// 👤 TEAM WÄHLEN
// =========================
function selectTeam(teamName){

  const league = game.league?.current;

  if(!league || !league.teams){
    console.error("❌ Keine Liga/Teams vorhanden");
    return;
  }

  const team = league.teams.find(t => t.name === teamName);

  if(!team){
    console.warn("⚠️ Team nicht gefunden:", teamName);
    return;
  }

  game.team.selected = team.name;

  const players = ensureTeamPlayers(team);
  game.team.players = players;

  console.log("✅ Team gewählt:", team.name);

  renderCurrentMatch();
}

// =========================
// 🧠 GET TEAM
// =========================
function getSelectedTeam(){

  const league = game.league?.current;
  if (!league) return null;

  return league.teams.find(
    t => t.name === game.team?.selected
  );
}

// =========================
// 📦 EXPORTS
// =========================
export {
  initLeagueSelect,
  populateTeamSelect,
  selectTeam,
  getSelectedTeam,
  initLeague
};
