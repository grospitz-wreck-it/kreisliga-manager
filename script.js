let teams = [];
let schedule = [];
let currentMatchday = 0;
let selectedTeam = null;
let selectedTactic = "normal";
let isSimulating = false;

let teamLocked = false;
let leagueLocked = false;

let leagues = {
  "Kreisliga A Herford": [
    { name: "TuS Bruchmühlen", strength: 75 },
    { name: "VfL Holsen", strength: 70 },
    { name: "Bünder SV", strength: 68 },
    { name: "TSG Kirchlengern II", strength: 65 }
  ]
};

let currentLeague = "Kreisliga A Herford";

// INIT
function initTeams(raw) {
  return raw.map(t => ({
    ...t,
    points: 0,
    goals: 0
  }));
}

// SCHEDULE
function generateSchedule() {
  schedule = [];
  let temp = [...teams];

  for (let i = 0; i < temp.length - 1; i++) {
    let round = [];
    for (let j = 0; j < temp.length / 2; j++) {
      round.push([temp[j], temp[temp.length - 1 - j]]);
    }
    schedule.push(round);
    temp.splice(1, 0, temp.pop());
  }
}

// SCOREBOARD
function updateScoreboard(t1, t2, s1, s2) {
  document.getElementById("team1Name").innerText = t1.name;
  document.getElementById("team2Name").innerText = t2.name;
  document.getElementById("score").innerText = s1 + " : " + s2;
}

// MATCH
function simulateMatchday() {
  if (!selectedTeam) return alert("Team wählen!");
  if (isSimulating) return;

  isSimulating = true;

  let match = schedule[currentMatchday].find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  simulateLiveMatch(match[0], match[1]);
}

function simulateLiveMatch(t1, t2) {
  let s1 = 0, s2 = 0;
  let minute = 0;
  let box = document.getElementById("liveMatch");

  box.innerHTML = "";
  updateScoreboard(t1, t2, s1, s2);

  let i = setInterval(() => {
    minute++;

    if (Math.random() < 0.08) {
      if (Math.random() < 0.5) {
        s1++;
        box.innerHTML = `<p>⚽ ${minute}' ${t1.name}</p>` + box.innerHTML;
      } else {
        s2++;
        box.innerHTML = `<p>⚽ ${minute}' ${t2.name}</p>` + box.innerHTML;
      }

      updateScoreboard(t1, t2, s1, s2);
    }

    if (minute === 45) {
      clearInterval(i);
      showHalftime(t1, t2, s1, s2);
    }

  }, 120);
}

// HALBZEIT
function showHalftime(t1, t2, s1, s2) {
  document.getElementById("halftimePanel").style.display = "block";

  window.resumeMatch = () => secondHalf(t1, t2, s1, s2);
}

function applyHalftime() {
  selectedTactic = document.getElementById("halfTactic").value;
  document.getElementById("halftimePanel").style.display = "none";
  window.resumeMatch();
}

// SECOND HALF
function secondHalf(t1, t2, s1, s2) {
  let minute = 45;
  let box = document.getElementById("liveMatch");

  let i = setInterval(() => {
    minute++;

    if (Math.random() < 0.08) {
      if (Math.random() < 0.5) {
        s1++;
        box.innerHTML = `<p>⚽ ${minute}' ${t1.name}</p>` + box.innerHTML;
      } else {
        s2++;
        box.innerHTML = `<p>⚽ ${minute}' ${t2.name}</p>` + box.innerHTML;
      }

      updateScoreboard(t1, t2, s1, s2);
    }

    if (minute === 90) {
      clearInterval(i);

      box.innerHTML = `<h3>Endstand: ${s1}:${s2}</h3>` + box.innerHTML;

      isSimulating = false;
      currentMatchday++;
    }

  }, 120);
}

// TEAM SELECT
function populateTeamSelect() {
  let s = document.getElementById("teamSelect");
  s.innerHTML = "";

  teams.forEach(t => {
    let o = document.createElement("option");
    o.value = t.name;
    o.textContent = t.name;
    s.appendChild(o);
  });
}

function selectTeam() {
  if (teamLocked) return;

  let s = document.getElementById("teamSelect");
  selectedTeam = s.value;

  teamLocked = true;
}

// INIT
teams = initTeams(leagues[currentLeague]);
generateSchedule();
populateTeamSelect();
