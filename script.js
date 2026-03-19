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

// ================= LIGA =================
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
    teams, currentMatchday, selectedTeam,
    selectedTactic, teamLocked, leagueLocked,
    currentLeague, lastResults
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

  let returnRound = schedule.map(d => d.map(m => [m[1], m[0]]));
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

    if (t.name === selectedTeam) o.selected = true;

    s.appendChild(o);
  });

  if (!selectedTeam && teams.length > 0) {
    s.value = teams[0].name;
  }

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

  let dropdown = document.getElementById("teamSelect");
  selectedTeam = dropdown.options[dropdown.selectedIndex].value;

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

// ================= SCOREBOARD =================
function updateScoreboard(t1, t2, s1, s2) {
  document.getElementById("team1Name").innerText = t1.name;
  document.getElementById("team2Name").innerText = t2.name;
  document.getElementById("score").innerText = s1 + " : " + s2;
}

// ================= MATCHDAY =================
function simulateMatchday() {
  if (isSimulating) return;
  if (!selectedTeam) return alert("Bitte Team wählen!");
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

// ================= GOAL LOGIC =================
function getGoalChance(minute, s1, s2) {
  let base = 0.05;

  if (minute > 75) base += 0.02;
  if (minute > 90) base += 0.05;

  if (selectedTactic === "offensive") base += 0.03;
  if (selectedTactic === "defensive") base -= 0.02;

  let diff = Math.abs(s1 - s2);
  if (diff >= 1) base += 0.02;

  return Math.max(0.02, base);
}

// ================= LIVE MATCH =================
function simulateLiveMatch(t1, t2, cb) {
  let minute = 0;
  let s1 = 0, s2 = 0;

  let box = document.getElementById("liveMatch");

  let extra1 = Math.floor(Math.random() * 5) + 1;
  let extra2 = Math.floor(Math.random() * 5) + 1;

  box.innerHTML = "";

  updateScoreboard(t1, t2, s1, s2);

  let interval = setInterval(() => {
    minute++;

    let display = minute;

    if (minute > 45 && minute <= 45 + extra1)
      display = `45+${minute - 45}`;

    if (minute > 90)
      display = `90+${minute - 90}`;

    if (Math.random() < getGoalChance(minute, s1, s2)) {
      if (Math.random() < 0.5) {
        s1++;
        box.innerHTML = `<p>⚽ ${display}' ${t1.name}</p>` + box.innerHTML;
      } else {
        s2++;
        box.innerHTML = `<p>⚽ ${display}' ${t2.name}</p>` + box.innerHTML;
      }

      updateScoreboard(t1, t2, s1, s2);
      updateTable();
    }

    if (minute === 45 + extra1) {
      clearInterval(interval);
      showHalftimeUI(s1, s2, () => {
        simulateSecondHalf(t1, t2, s1, s2, extra2, cb);
      });
    }

  }, 120);
}

// ================= HALBZEIT =================
function showHalftimeUI(score1, score2, resumeCallback) {
  let panel = document.getElementById("halftimePanel");

  panel.style.display = "block";
  panel.querySelector("h3").innerText = `Halbzeit (${score1}:${score2})`;

  window.resumeMatch = resumeCallback;
}

function applyHalftime() {
  selectedTactic = document.getElementById("halfTactic").value;

  let f = document.getElementById("halfFormation").value;
  document.getElementById("formationSelect").value = f;

  document.getElementById("currentTactic").innerText =
    "Taktik: " + selectedTactic;

  document.getElementById("halftimePanel").style.display = "none";

  saveGame();

  if (window.resumeMatch) window.resumeMatch();
}

// ================= SECOND HALF =================
function simulateSecondHalf(t1, t2, s1, s2, extra2, cb) {
  let minute = 45;
  let box = document.getElementById("liveMatch");

  let interval = setInterval(() => {
    minute++;

    let display = minute;

    if (minute > 90)
      display = `90+${minute - 90}`;

    if (Math.random() < getGoalChance(minute, s1, s2)) {
      if (Math.random() < 0.5) {
        s1++;
        box.innerHTML = `<p>⚽ ${display}' ${t1.name}</p>` + box.innerHTML;
      } else {
        s2++;
        box.innerHTML = `<p>⚽ ${display}' ${t2.name}</p>` + box.innerHTML;
      }

      updateScoreboard(t1, t2, s1, s2);
      updateTable();
    }

    if (minute === 90 + extra2) {
      clearInterval(interval);

      updateStats(t1, t2, s1, s2);

      box.innerHTML = `<h3>Endstand: ${s1}:${s2}</h3>` + box.innerHTML;

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
    let s1 = Math.floor(Math.random() * 3);
    let s2 = Math.floor(Math.random() * 3);

    updateStats(t1, t2, s1, s2);

    box.innerHTML += `<div style="font-size:12px">${t1.name} ${s1}:${s2} ${t2.name}</div>`;
  });

  finishMatchday();
}

// ================= STATS =================
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

// ================= FINISH =================
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
    let name = t.name === selectedTeam ? "👉 " + t.name : t.name;

    tb.innerHTML += `
      <tr>
        <td>${name}</td>
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
