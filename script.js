let teams = [];
let schedule = [];
let currentMatchday = 0;

// Spiel laden
function loadGame() {
  let saved = localStorage.getItem("kreisligaSave");

  if (saved) {
    let data = JSON.parse(saved);

    teams = data.teams || [];
    schedule = data.schedule || [];
    currentMatchday = data.currentMatchday || 0;

  } else {
    // Neue Liga erstellen
    teams = [
      { name: "Team A", strength: 70, points: 0, goals: 0 },
      { name: "Team B", strength: 65, points: 0, goals: 0 },
      { name: "Team C", strength: 60, points: 0, goals: 0 },
      { name: "Team D", strength: 55, points: 0, goals: 0 }
    ];

    generateSchedule();
    saveGame();
  }
}

// Spiel speichern
function saveGame() {
  localStorage.setItem("kreisligaSave", JSON.stringify({
    teams,
    schedule,
    currentMatchday
  }));
}

// Spielplan generieren (Round Robin)
function generateSchedule() {
  schedule = []; // wichtig!

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

    // Rotation (außer erstes Team)
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

// Tabelle updaten
function updateTable() {
  teams.sort((a, b) => b.points - a.points);

  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  teams.forEach(team => {
    let row = `<tr>
      <td>${team.name}</td>
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

// 🔥 Wichtig: einmal alten Speicher löschen bei Update
function resetIfBroken() {
  let saved = localStorage.getItem("kreisligaSave");

  if (saved) {
    let data = JSON.parse(saved);

    // Falls alter Speicher ohne Spielplan
    if (!data.schedule || !data.teams) {
      localStorage.clear();
      location.reload();
    }
  }
}

// Init
resetIfBroken();
loadGame();
updateTable();
updateMatchdayDisplay();
