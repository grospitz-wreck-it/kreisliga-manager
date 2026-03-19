let teams = [];
let schedule = [];
let currentMatchday = 0;
let selectedTeam = null;

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

    } catch (e) {
      console.log("Speicher zurückgesetzt:", e);
      localStorage.clear();
      createNewGame();
    }

  } else {
    createNewGame();
  }
}

// Neue Liga erstellen
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

  saveGame();
}

// Speichern
function saveGame() {
  localStorage.setItem("kreisligaSave", JSON.stringify({
    teams,
    schedule,
    currentMatchday,
    selectedTeam
  }));
}

// Spielplan generieren
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

// Spiel simulieren
function simulateMatch(team1, team2) {
  let score1 = Math.floor(Math.random() * (team1.strength / 20));
  let score2 = Math.floor(Math.random() * (team2.strength / 20));

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
}

// Spieltag simulieren
function simulateMatchday() {
  if (!schedule || schedule.length === 0) {
    alert("Fehler im Spielplan – neu laden!");
    return;
  }

  if (currentMatchday >= schedule.length) {
    alert("Saison beendet!");
    return;
  }

  let matches = schedule[currentMatchday];

  matches.forEach(match => {
    simulateMatch(match[0], match[1]);
  });

  currentMatchday++;

  saveGame();
  updateTable();
  updateMatchdayDisplay();
}

// Tabelle
function updateTable() {
  if (!teams) return;

  teams.sort((a, b) => b.points - a.points);

  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  teams.forEach(team => {
    let nameDisplay = team.name === selectedTeam
      ? "👉 " + team.name
      : team.name;

    let row = `<tr>
      <td>${nameDisplay}</td>
      <td>${team.points}</td>
      <td>${team.goals}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Spieltag anzeigen
function updateMatchdayDisplay() {
  const el = document.getElementById("matchday");
  if (el) {
    el.innerText = "Spieltag: " + currentMatchday;
  }
}

// Dropdown füllen
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

// Team auswählen
function selectTeam() {
  let select = document.getElementById("teamSelect");
  selectedTeam = select.value;

  saveGame();
  updateTable();
}

// INIT
loadGame();
updateTable();
updateMatchdayDisplay();
populateTeamSelect();
