let teams = [];
let schedule = [];
let currentMatchday = 0;
let selectedTeam = null;
let selectedTactic = "normal";
let lastResults = [];
let isSimulating = false;
let teamLocked = false;

// 🔥 LIGEN SYSTEM (vorbereitet)
let leagues = {
  "Kreisliga A": [
    { name: "Team A", strength: 70, points: 0, goals: 0 },
    { name: "Team B", strength: 65, points: 0, goals: 0 },
    { name: "Team C", strength: 60, points: 0, goals: 0 },
    { name: "Team D", strength: 55, points: 0, goals: 0 }
  ]
};

let currentLeague = "Kreisliga A";

// Laden
function loadGame() {
  let saved = localStorage.getItem("kreisligaSave");

  if (saved) {
    let data = JSON.parse(saved);

    teams = data.teams;
    currentMatchday = data.currentMatchday || 0;
    selectedTeam = data.selectedTeam || null;
    selectedTactic = data.selectedTactic || "normal";
    lastResults = data.lastResults || [];
    teamLocked = data.teamLocked || false;
    currentLeague = data.currentLeague || "Kreisliga A";

    generateSchedule();
  } else {
    createNewGame();
  }
}

// Neue Liga
function createNewGame() {
  teams = JSON.parse(JSON.stringify(leagues[currentLeague]));

  currentMatchday = 0;
  selectedTeam = null;
  selectedTactic = "normal";
  lastResults = [];
  teamLocked = false;

  generateSchedule();
  saveGame();
}

// Speichern
function saveGame() {
  localStorage.setItem("kreisligaSave", JSON.stringify({
    teams,
    currentMatchday,
    selectedTeam,
    selectedTactic,
    lastResults,
    teamLocked,
    currentLeague
  }));
}

// Spielplan
function generateSchedule() {
  schedule = [];
  let temp = [...teams];

  for (let i = 0; i < temp.length - 1; i++) {
    let matchday = [];

    for (let j = 0; j < temp.length / 2; j++) {
      matchday.push([temp[j], temp[temp.length - 1 - j]]);
    }

    schedule.push(matchday);
    temp.splice(1, 0, temp.pop());
  }
}

// Taktik
function applyTactic(team, score) {
  if (team.name !== selectedTeam) return score;

  if (selectedTactic === "offensive") return score + 1;
  if (selectedTactic === "defensive") return Math.max(0, score - 1);

  return score;
}

// Spieltag starten
function simulateMatchday() {
  if (isSimulating) return;

  if (currentMatchday >= schedule.length) {
    alert("Saison beendet!");
    return;
  }

  isSimulating = true;
  lastResults = [];

  playMatchesLive(schedule[currentMatchday], 0);
}

// Spiele nacheinander
function playMatchesLive(matches, index) {
  if (index >= matches.length) {
    currentMatchday++;
    isSimulating = false;

    saveGame();
    updateTable();
    updateMatchdayDisplay();
    updateResults();
    return;
  }

  let [team1, team2] = matches[index];

  simulateLiveMatch(team1, team2, () => {
    playMatchesLive(matches, index + 1);
  });
}

// Live-Spiel
function simulateLiveMatch(team1, team2, callback) {
  let minute = 0;
  let score1 = 0;
  let score2 = 0;

  let box = document.getElementById("liveMatch");
  box.innerHTML = `<p><b>${team1.name} vs ${team2.name}</b></p>`;

  let interval = setInterval(() => {
    minute++;

    if (Math.random() < 0.15) {
      let attack1 = team1.strength + Math.random() * 20;
      let attack2 = team2.strength + Math.random() * 20;

      if (attack1 > attack2) {
        score1++;
        box.innerHTML += `<p>⚽ ${minute}' ${team1.name}</p>`;
      } else {
        score2++;
        box.innerHTML += `<p>⚽ ${minute}' ${team2.name}</p>`;
      }

      box.scrollTop = box.scrollHeight;
    }

    if (minute >= 90) {
      clearInterval(interval);

      score1 = applyTactic(team1, score1);
      score2 = applyTactic(team2, score2);

      team1.goals += score1;
      team2.goals += score2;

      if (score1 > score2) team1.points += 3;
      else if (score2 > score1) team2.points += 3;
      else {
        team1.points++;
        team2.points++;
      }

      box.innerHTML += `<p><b>Endstand: ${score1}:${score2}</b></p><hr>`;

      lastResults.push({ team1: team1.name, team2: team2.name, score1, score2 });

      setTimeout(callback, 800);
    }

  }, 100);
}

// Tabelle
function updateTable() {
  teams.sort((a, b) => b.points - a.points);

  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  teams.forEach(t => {
    let name = t.name === selectedTeam ? "👉 " + t.name : t.name;

    tbody.innerHTML += `
      <tr>
        <td>${name}</td>
        <td>${t.points}</td>
        <td>${t.goals}</td>
      </tr>`;
  });
}

// Anzeige
function updateMatchdayDisplay() {
  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday;
}

// Ergebnisse
function updateResults() {
  let div = document.getElementById("results");
  div.innerHTML = "";

  lastResults.forEach(r => {
    let line = `${r.team1} ${r.score1}:${r.score2} ${r.team2}`;
    if (r.team1 === selectedTeam || r.team2 === selectedTeam) {
      line = "👉 " + line;
    }
    div.innerHTML += `<p>${line}</p>`;
  });
}

// UI
function populateTeamSelect() {
  let select = document.getElementById("teamSelect");
  select.innerHTML = "";

  teams.forEach(t => {
    let opt = document.createElement("option");
    opt.value = t.name;
    opt.textContent = t.name;
    if (t.name === selectedTeam) opt.selected = true;
    select.appendChild(opt);
  });

  if (teamLocked) {
    select.disabled = true;
  }
}

function selectTeam() {
  if (teamLocked) {
    alert("Team bereits gewählt!");
    return;
  }

  selectedTeam = document.getElementById("teamSelect").value;
  teamLocked = true;

  saveGame();
  updateTable();
  populateTeamSelect();
}

function setTactic() {
  selectedTactic = document.getElementById("tacticSelect").value;
  document.getElementById("currentTactic").innerText =
    "Aktuelle Taktik: " + selectedTactic;
  saveGame();
}

// INIT
loadGame();
updateTable();
updateMatchdayDisplay();
populateTeamSelect();
updateResults();

document.getElementById("currentTactic").innerText =
  "Aktuelle Taktik: " + selectedTactic;
