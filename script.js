let teams = [];

// Lade gespeicherte Daten oder erstelle neue
function loadGame() {
  let saved = localStorage.getItem("kreisligaSave");

  if (saved) {
    teams = JSON.parse(saved);
  } else {
    teams = [
      { name: "Team A", strength: 70, points: 0, goals: 0 },
      { name: "Team B", strength: 65, points: 0, goals: 0 },
      { name: "Team C", strength: 60, points: 0, goals: 0 },
      { name: "Team D", strength: 55, points: 0, goals: 0 }
    ];
    saveGame();
  }
}

function saveGame() {
  localStorage.setItem("kreisligaSave", JSON.stringify(teams));
}

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

function simulateMatchday() {
  for (let i = 0; i < teams.length; i += 2) {
    simulateMatch(teams[i], teams[i + 1]);
  }

  saveGame();
  updateTable();
}

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

// Spiel laden beim Start
loadGame();
updateTable();
