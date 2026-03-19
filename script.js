let teams = [];
let schedule = [];
let currentMatchday = 0;
let selectedTeam = null;
let selectedTactic = "normal";
let lastResults = [];
let isSimulating = false;
let teamLocked = false;

let leagues = {
  "Kreisliga A": [
    { name: "Team A", strength: 70 },
    { name: "Team B", strength: 65 },
    { name: "Team C", strength: 60 },
    { name: "Team D", strength: 55 }
  ],
  "Kreisliga B": [
    { name: "Team E", strength: 50 },
    { name: "Team F", strength: 48 },
    { name: "Team G", strength: 45 },
    { name: "Team H", strength: 43 }
  ]
};

let currentLeague = "Kreisliga A";

// INIT
function initTeams(rawTeams) {
  return rawTeams.map(t => ({
    ...t,
    points: 0,
    goals: 0,
    tactic: ["normal","offensive","defensive"][Math.floor(Math.random()*3)]
  }));
}

// Laden
function loadGame() {
  let saved = localStorage.getItem("kreisligaSave");

  if (saved) {
    let data = JSON.parse(saved);

    teams = data.teams;
    currentMatchday = data.currentMatchday;
    selectedTeam = data.selectedTeam;
    selectedTactic = data.selectedTactic;
    teamLocked = data.teamLocked;
    currentLeague = data.currentLeague;
    lastResults = data.lastResults;

    generateSchedule();
  } else {
    createNewGame();
  }
}

// Neue Liga
function createNewGame() {
  teams = initTeams(leagues[currentLeague]);
  currentMatchday = 0;
  selectedTeam = null;
  selectedTactic = "normal";
  teamLocked = false;
  lastResults = [];

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
    teamLocked,
    currentLeague,
    lastResults
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

// Taktik (inkl KI)
function applyTactic(team, score) {
  let tactic = team.name === selectedTeam ? selectedTactic : team.tactic;

  if (tactic === "offensive") return score + 1;
  if (tactic === "defensive") return Math.max(0, score - 1);

  return score;
}

// Spieltag
function simulateMatchday() {
  if (isSimulating) return;
  if (currentMatchday >= schedule.length) return alert("Saison beendet!");

  isSimulating = true;
  lastResults = [];

  playMatches(schedule[currentMatchday], 0);
}

// Spiele
function playMatches(matches, index) {
  if (index >= matches.length) {
    currentMatchday++;
    isSimulating = false;
    saveGame();
    updateAll();
    return;
  }

  let [t1, t2] = matches[index];
  simulateLiveMatch(t1, t2, () => playMatches(matches, index + 1));
}

// Live Match
function simulateLiveMatch(t1, t2, cb) {
  let minute = 0, s1 = 0, s2 = 0;
  let box = document.getElementById("liveMatch");

  let isUserMatch = (t1.name === selectedTeam || t2.name === selectedTeam);

  box.innerHTML = `<p class="${isUserMatch ? 'highlight':''}">
    ${t1.name} vs ${t2.name}
  </p>`;

  let i = setInterval(() => {
    minute++;

    if (Math.random() < 0.15) {
      let a1 = t1.strength + Math.random()*20;
      let a2 = t2.strength + Math.random()*20;

      if (a1 > a2) {
        s1++;
        box.innerHTML += `<p class="${t1.name===selectedTeam?'highlight':''}">
        ⚽ ${minute}' ${t1.name}</p>`;
      } else {
        s2++;
        box.innerHTML += `<p class="${t2.name===selectedTeam?'highlight':''}">
        ⚽ ${minute}' ${t2.name}</p>`;
      }
    }

    if (minute >= 90) {
      clearInterval(i);

      s1 = applyTactic(t1, s1);
      s2 = applyTactic(t2, s2);

      t1.goals += s1;
      t2.goals += s2;

      if (s1 > s2) t1.points += 3;
      else if (s2 > s1) t2.points += 3;
      else { t1.points++; t2.points++; }

      box.innerHTML += `<p><b>Endstand: ${s1}:${s2}</b></p><hr>`;

      lastResults.push({team1:t1.name,team2:t2.name,score1:s1,score2:s2});

      setTimeout(cb, 600);
    }

    box.scrollTop = box.scrollHeight;

  }, 100);
}

// UI Updates
function updateAll() {
  updateTable();
  updateResults();
  updateMatchdayDisplay();
}

// Tabelle
function updateTable() {
  teams.sort((a,b)=>b.points-a.points);
  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  teams.forEach(t=>{
    let name = t.name===selectedTeam ? "👉 "+t.name : t.name;
    tbody.innerHTML += `<tr>
      <td>${name}</td><td>${t.points}</td><td>${t.goals}</td>
    </tr>`;
  });
}

// Ergebnisse
function updateResults() {
  let div = document.getElementById("results");
  div.innerHTML = "";

  lastResults.forEach(r=>{
    let line = `${r.team1} ${r.score1}:${r.score2} ${r.team2}`;
    if (r.team1===selectedTeam||r.team2===selectedTeam)
      line = "👉 "+line;
    div.innerHTML += `<p>${line}</p>`;
  });
}

// Anzeige
function updateMatchdayDisplay() {
  document.getElementById("matchday").innerText =
    "Spieltag: "+currentMatchday;
}

// Dropdowns
function populateTeamSelect() {
  let s = document.getElementById("teamSelect");
  s.innerHTML = "";
  teams.forEach(t=>{
    let o=document.createElement("option");
    o.value=t.name; o.textContent=t.name;
    s.appendChild(o);
  });
  if (teamLocked) s.disabled = true;
}

function populateLeagueSelect() {
  let s = document.getElementById("leagueSelect");
  s.innerHTML = "";
  Object.keys(leagues).forEach(l=>{
    let o=document.createElement("option");
    o.value=l; o.textContent=l;
    s.appendChild(o);
  });
}

// Aktionen
function selectTeam() {
  if (teamLocked) return alert("Team bereits gewählt!");
  selectedTeam = document.getElementById("teamSelect").value;
  teamLocked = true;
  saveGame();
  populateTeamSelect();
}

function setTactic() {
  selectedTactic = document.getElementById("tacticSelect").value;
  document.getElementById("currentTactic").innerText =
    "Taktik: "+selectedTactic;
  saveGame();
}

function selectLeague() {
  if (teamLocked) return alert("Neue Liga nur vor Start möglich!");
  currentLeague = document.getElementById("leagueSelect").value;
  createNewGame();
  populateTeamSelect();
  updateAll();
}

// INIT
loadGame();
populateTeamSelect();
populateLeagueSelect();
updateAll();

document.getElementById("currentTactic").innerText =
  "Taktik: "+selectedTactic;
