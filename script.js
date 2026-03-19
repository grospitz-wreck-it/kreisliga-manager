// ================= STATE =================
let teams = [];
let schedule = [];
let currentMatchday = 0;
let selectedTeam = null;
let selectedTactic = "normal";
let lastResults = [];
let isSimulating = false;

let teamLocked = false;
let leagueLocked = false;

let currentLeague = "Kreisliga A Herford";

// ================= LIGEN =================
let leagues = {
  "Kreisliga A Herford": [
    { name: "TuS Bruchmühlen", strength: 75 },
    { name: "SV Enger-Westerenger", strength: 72 },
    { name: "VfL Holsen", strength: 70 },
    { name: "Bünder SV", strength: 68 },
    { name: "TSV Löhne", strength: 66 },
    { name: "SV Löhne-Obernbeck", strength: 64 },
    { name: "SC Enger", strength: 62 },
    { name: "FA Herringhausen/Eickum", strength: 60 },
    { name: "FC Exter", strength: 58 },
    { name: "TuRa Löhne", strength: 57 },
    { name: "SV Rödinghausen III", strength: 56 },
    { name: "TSG Kirchlengern II", strength: 55 },
    { name: "GW Pödinghausen", strength: 54 },
    { name: "SV Oetinghausen", strength: 53 }
  ]
};

// ================= INIT =================
function initTeams(raw) {
  return raw.map(t => ({
    ...t,
    points: 0,
    goals: 0,
    form: 0
  }));
}

// ================= SAVE / LOAD =================
function saveGame() {
  localStorage.setItem("save", JSON.stringify({
    teams, currentMatchday, selectedTeam, selectedTactic,
    teamLocked, leagueLocked, currentLeague, lastResults
  }));
}

function loadGame() {
  let s = localStorage.getItem("save");

  if (s) {
    let d = JSON.parse(s);
    teams = d.teams;
    currentMatchday = d.currentMatchday;
    selectedTeam = d.selectedTeam;
    selectedTactic = d.selectedTactic;
    teamLocked = d.teamLocked;
    leagueLocked = d.leagueLocked;
    currentLeague = d.currentLeague;
    lastResults = d.lastResults;
    generateSchedule();
  } else {
    createNewGame();
  }
}

// ================= NEW =================
function createNewGame() {
  teams = initTeams(leagues[currentLeague]);
  currentMatchday = 0;
  selectedTeam = null;
  selectedTactic = "normal";
  teamLocked = false;
  leagueLocked = false;
  lastResults = [];

  generateSchedule();
  saveGame();
}

// ================= SCHEDULE =================
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

  let returnRound = schedule.map(day =>
    day.map(match => [match[1], match[0]])
  );

  schedule = [...schedule, ...returnRound];
}

// ================= DROPDOWNS =================
function populateTeamSelect() {
  let s = document.getElementById("teamSelect");
  s.innerHTML = "";

  teams.forEach(t => {
    let o = document.createElement("option");
    o.value = t.name;
    o.textContent = t.name;
    s.appendChild(o);
  });

  if (teamLocked) s.disabled = true;
}

function populateLeagueSelect() {
  let s = document.getElementById("leagueSelect");
  s.innerHTML = "";

  Object.keys(leagues).forEach(l => {
    let o = document.createElement("option");
    o.value = l;
    o.textContent = l;
    s.appendChild(o);
  });

  s.value = currentLeague;

  if (leagueLocked) s.disabled = true;
}

// ================= ACTIONS =================
function selectLeague() {
  if (leagueLocked) return alert("Liga bereits gewählt!");

  currentLeague = document.getElementById("leagueSelect").value;

  createNewGame();

  populateTeamSelect();
  populateLeagueSelect();
  updateAll();
}

function selectTeam() {
  if (teamLocked) return alert("Team bereits gewählt!");

  selectedTeam = document.getElementById("teamSelect").value;

  teamLocked = true;
  leagueLocked = true;

  populateTeamSelect();
  populateLeagueSelect();

  saveGame();
  updateAll();
}

function setTactic() {
  selectedTactic = document.getElementById("tacticSelect").value;

  document.getElementById("currentTactic").innerText =
    "Taktik: " + selectedTactic;

  saveGame();
}

// ================= GAME =================
function simulateMatchday() {
  if (isSimulating) return;
  if (currentMatchday >= schedule.length) return alert("Saison beendet!");

  isSimulating = true;
  lastResults = [];

  let matches = schedule[currentMatchday];

  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  simulateLiveMatch(userMatch[0], userMatch[1], () => {
    simulateOthers(matches.filter(m => m !== userMatch));
  });
}

// ================= MATCH =================
function simulateLiveMatch(t1, t2, cb) {
  let min = 0, s1 = 0, s2 = 0;
  let box = document.getElementById("liveMatch");

  box.innerHTML = `<h2>${t1.name} vs ${t2.name}</h2>`;

  let i = setInterval(() => {
    min++;

    if (Math.random() < 0.08) {
      if (Math.random() < 0.5) {
        s1++;
        box.innerHTML += `<p>⚽ ${min}' ${t1.name}</p>`;
      } else {
        s2++;
        box.innerHTML += `<p>⚽ ${min}' ${t2.name}</p>`;
      }

      updateTable();
    }

    if (min === 45) {
      clearInterval(i);

      if (confirm(`Halbzeit ${s1}:${s2} ändern?`)) {
        selectedTactic = prompt("normal/offensive/defensive", selectedTactic) || selectedTactic;
      }

      setTimeout(() => simulateSecondHalf(t1, t2, s1, s2, cb), 1000);
    }

  }, 120);
}

function simulateSecondHalf(t1, t2, s1, s2, cb) {
  let min = 45;
  let box = document.getElementById("liveMatch");

  let i = setInterval(() => {
    min++;

    if (Math.random() < 0.08) {
      if (Math.random() < 0.5) {
        s1++;
        box.innerHTML += `<p>⚽ ${min}' ${t1.name}</p>`;
      } else {
        s2++;
        box.innerHTML += `<p>⚽ ${min}' ${t2.name}</p>`;
      }

      updateTable();
    }

    if (min >= 90) {
      clearInterval(i);

      updateStats(t1, t2, s1, s2);

      box.innerHTML += `<h3>Endstand: ${s1}:${s2}</h3>`;

      lastResults.push({ team1: t1.name, team2: t2.name, score1: s1, score2: s2 });

      setTimeout(cb, 1000);
    }

  }, 120);
}

// ================= OTHERS =================
function simulateOthers(matches) {
  let box = document.getElementById("liveMatch");
  box.innerHTML += "<hr><small>Andere Spiele:</small>";

  matches.forEach(([t1, t2]) => {
    let s1 = randomGoals(t1);
    let s2 = randomGoals(t2);

    updateStats(t1, t2, s1, s2);

    box.innerHTML += `<div style="font-size:12px">${t1.name} ${s1}:${s2} ${t2.name}</div>`;
  });

  finishMatchday();
}

// ================= LOGIC =================
function randomGoals(team) {
  let base = (team.strength / 100) + (team.form * 0.1);

  let g = 0;
  if (Math.random() < base) g++;
  if (Math.random() < base * 0.4) g++;

  return g;
}

function updateStats(t1, t2, s1, s2) {
  t1.goals += s1;
  t2.goals += s2;

  if (s1 > s2) {
    t1.points += 3;
    t1.form += 0.2;
    t2.form -= 0.2;
  } else if (s2 > s1) {
    t2.points += 3;
    t2.form += 0.2;
    t1.form -= 0.2;
  } else {
    t1.points++;
    t2.points++;
  }
}

// ================= END =================
function finishMatchday() {
  currentMatchday++;
  isSimulating = false;

  saveGame();
  updateAll();
}

// ================= UI =================
function updateAll() {
  updateTable();
  updateResults();
  updateMatchdayDisplay();
}

function updateTable() {
  teams.sort((a, b) => b.points - a.points);

  let tb = document.querySelector("#table tbody");
  tb.innerHTML = "";

  teams.forEach(t => {
    let n = t.name === selectedTeam ? "👉 " + t.name : t.name;

    tb.innerHTML += `<tr>
      <td>${n}</td>
      <td>${t.points}</td>
      <td>${t.goals}</td>
    </tr>`;
  });
}

function updateResults() {
  let d = document.getElementById("results");
  d.innerHTML = "";

  lastResults.forEach(r => {
    d.innerHTML += `<p>${r.team1} ${r.score1}:${r.score2} ${r.team2}</p>`;
  });
}

function updateMatchdayDisplay() {
  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday;
}

// ================= INIT =================
loadGame();
populateTeamSelect();
populateLeagueSelect();
updateAll();

document.getElementById("currentTactic").innerText =
  "Taktik: " + selectedTactic;
