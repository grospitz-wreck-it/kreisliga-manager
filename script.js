let teams = [];
let schedule = [];
let currentMatchday = 0;
let selectedTeam = null;
let selectedTactic = "normal";
let lastResults = [];

// Spiel laden
function loadGame() {
  let saved = localStorage.getItem("kreisligaSave");

  if (saved) {
    try {
      let data = JSON.parse(saved);

      if (!data.teams || !data.schedule) {
        throw "Alter Speicher inkompatibel";
      }

      teams = data.teams;
      schedule = data.schedule;
      currentMatchday = data.currentMatchday || 0;
      selectedTeam = data.selectedTeam || null;
      selectedTactic = data.selectedTactic || "normal";
      lastResults = data.lastResults || [];

    } catch (e) {
      localStorage.clear();
      createNewGame();
    }

  } else {
    createNewGame();
  }
}

// Neue Liga
function createNewGame() {
  teams = [
    { name: "Team A", strength: 70, points: 0, goals: 0 },
    { name: "Team B", strength: 65, points: 0, goals: 0 },
    { name: "Team C", strength: 60, points: 0, goals: 0 },
    { name: "Team D", strength: 55, points: 0, goals: 0 }
  ];

  generateSchedule();
  currentMatchday = 0;
  selectedTeam = null;
  selectedTactic = "normal";
  lastResults = [];

  saveGame();
}

// Speichern
function saveGame() {
  localStorage.setItem("kreisligaSave", JSON.stringify({
    teams,
    schedule,
    currentMatchday,
    selectedTeam,
    selectedTactic,
    lastResults
  }));
}

// Spielplan
function generateSchedule() {
  schedule = [];

  let tempTeams = [...teams];

  for (let i = 0; i < tempTeams.length - 1; i++) {
    let matchday = [];

    for (let j = 0; j < tempTeams.length / 2; j++) {
      matchday.push([
        tempTeams[j],
        tempTeams[tempTeams.length - 1 - j]
      ]);
    }

    schedule.push(matchday);
    tempTeams.splice(1, 0, tempTeams.pop());
  }
}

// Taktik anwenden
function applyTactic(team, baseScore) {
  if (team.name !== selectedTeam) return baseScore;

  if (selectedTactic === "offensive") {
    return baseScore + 1;
  }

  if (selectedTactic === "defensive") {
    return Math.max(0, baseScore - 1);
  }

  return baseScore;
}

// Spiel simulieren
function simulateMatch(team1, team2) {
  let score1 = Math.floor(Math.random() * (team1.strength / 20));
  let score2 = Math.floor(Math.random() * (team2.strength / 20));

  score1 = applyTactic(team1, score1);
  score2 = applyTactic(team2, score2);

  team1.goals += score1;
  team2.goals += score2;

  if (score1 > score2) {
    team1.points += 3;
  } else if (score2 > score1) {
    team2.points += 3;
  } else {
    team1.points += 1;
    team2.points += 1;
  }

  return {
    team1: team1.name,
    team2: team2.name,
    score1,
    score2
  };
}

// Spieltag simulieren
function simulateMatchday() {
  if (!schedule || currentMatchday >= schedule.length) {
    alert("Saison beendet!");
    return;
  }

  let matches = schedule[currentMatchday];
  lastResults = [];

  matches.forEach(match => {
    let result = simulateMatch(match[0], match[1]);
    lastResults.push(result);
  });

  currentMatchday++;

  saveGame();
  updateTable();
  updateMatchdayDisplay();
  updateResults();
}

// Tabelle
function updateTable() {
  teams.sort((a, b) => b.points - a.points);

  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  teams.forEach(team => {
    let name = team.name === selectedTeam
      ? "👉 " + team.name
      : team.name;

    let row = `<tr>
      <td>${name}</td>
      <td>${team.points}</td>
      <td>${team.goals}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Spieltag Anzeige
function updateMatchdayDisplay() {
  const el = document.getElementById("matchday");
  if (el) {
    el.innerText = "Spieltag: " + currentMatchday;
  }
}

// Ergebnisse anzeigen
function updateResults() {
  let container = document.getElementById("results");
  if (!container) return;

  container.innerHTML = "";

  lastResults.forEach(r => {
    let isUserMatch =
      r.team1 === selectedTeam || r.team2 === selectedTeam;

    let line = `${r.team1} ${r.score1}:${r.score2} ${r.team2}`;

    if (isUserMatch) {
      line = "👉 " + line;
    }

    container.innerHTML += `<p>${line}</p>`;
  });
}

// Dropdown Team
function populateTeamSelect() {
  let select = document.getElementById("teamSelect");
  if (!select) return;

  select.innerHTML = "";

  teams.forEach(team => {
    let option = document.createElement("option");
    option.value = team.name;
    option.textContent = team.name;

    if (team.name === selectedTeam) {
      option.selected = true;
    }

    select.appendChild(option);
  });
}

// Team wählen
function selectTeam() {
  selectedTeam = document.getElementById("teamSelect").value;
  saveGame();
  updateTable();
}

// Taktik setzen
function setTactic() {
  selectedTactic = document.getElementById("tacticSelect").value;
  saveGame();
}

// INIT
loadGame();
updateTable();
updateMatchdayDisplay();
populateTeamSelect();
updateResults();
