// ================= STATE =================
let teams = [];
let schedule = [];
let currentMatchday = 0;

let selectedTeam = null;
let selectedTactic = "normal";

let isSimulating = false;

let teamLocked = false;
let leagueLocked = false;

let currentLeague = "Kreisliga A Herford";

// ================= LIGA =================
let leagues = {
  "Kreisliga A Herford": [
    { name: "TuS Bruchmühlen", strength: 75 },
    { name: "VfL Holsen", strength: 70 },
    { name: "Bünder SV", strength: 68 },
    { name: "TSG Kirchlengern II", strength: 65 },
    { name: "SV Löhne-Obernbeck", strength: 64 },
    { name: "TuRa Löhne", strength: 63 },
    { name: "GW Pödinghausen", strength: 62 },
    { name: "SV Enger-Westerenger", strength: 61 },
    { name: "TSV Löhne", strength: 60 },
    { name: "SC Enger", strength: 59 },
    { name: "FC Exter", strength: 58 },
    { name: "SV Rödinghausen III", strength: 57 },
    { name: "SV Oetinghausen", strength: 56 },
    { name: "FA Herringhausen/Eickum", strength: 55 },
    { name: "VfL Herford II", strength: 54 },
    { name: "TuS Hücker-Aschen", strength: 53 }
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

// ================= SCHEDULE (HIN + RÜCK) =================
function generateSchedule() {
  schedule = [];
  let temp = [...teams];

  // HINRUNDE
  for (let i = 0; i < temp.length - 1; i++) {
    let round = [];

    for (let j = 0; j < temp.length / 2; j++) {
      round.push([temp[j], temp[temp.length - 1 - j]]);
    }

    schedule.push(round);
    temp.splice(1, 0, temp.pop());
  }

  // RÜCKRUNDE
  let secondHalf = schedule.map(r =>
    r.map(m => [m[1], m[0]])
  );

  schedule = schedule.concat(secondHalf);
}

// ================= DROPDOWNS =================
function populateLeagueSelect() {
  let s = document.getElementById("leagueSelect");
  s.innerHTML = "";

  Object.keys(leagues).forEach(l => {
    let o = document.createElement("option");
    o.value = l;
    o.textContent = l;
    s.appendChild(o);
  });

  if (leagueLocked) s.disabled = true;
}

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

// ================= ACTIONS =================
function selectLeague() {
  if (leagueLocked) return alert("Liga bereits gewählt!");

  currentLeague = document.getElementById("leagueSelect").value;

  teams = initTeams(leagues[currentLeague]);
  generateSchedule();

  populateTeamSelect();
  updateTable();
}

function selectTeam() {
  if (teamLocked) return alert("Team bereits gewählt!");

  selectedTeam = document.getElementById("teamSelect").value;

  teamLocked = true;
  leagueLocked = true;

  populateLeagueSelect();
  populateTeamSelect();
}

function setTactic() {
  selectedTactic = document.getElementById("tacticSelect").value;

  document.getElementById("currentTactic").innerText =
    "Taktik: " + selectedTactic;
}

// ================= TABLE =================
function updateTable() {
  let tbody = document.querySelector("#table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  teams.sort((a, b) => b.points - a.points);

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

// ================= SCOREBOARD =================
function updateScoreboard(t1, t2, s1, s2) {
  document.getElementById("team1Name").innerText = t1.name;
  document.getElementById("team2Name").innerText = t2.name;
  document.getElementById("score").innerText = s1 + " : " + s2;
}

// ================= MATCHDAY =================
function simulateMatchday() {
  if (!selectedTeam) return alert("Team wählen!");
  if (isSimulating) return;

  isSimulating = true;

  let matches = schedule[currentMatchday];

  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  simulateLiveMatch(userMatch[0], userMatch[1], () => {
    simulateOthers(matches.filter(m => m !== userMatch));
  });
}

// ================= LIVE MATCH =================
function simulateLiveMatch(t1, t2, cb) {
  let s1 = 0, s2 = 0;
  let minute = 0;

  let box = document.getElementById("liveMatch");
  box.innerHTML = "";

  updateScoreboard(t1, t2, s1, s2);

  let i = setInterval(() => {
    minute++;

    let chance = 0.06 + (t1.form + t2.form) * 0.005;

    if (Math.random() < chance) {
      if (Math.random() < 0.5) {
        s1++;
        addEvent(`⚽ ${minute}' ${t1.name}`);
      } else {
        s2++;
        addEvent(`⚽ ${minute}' ${t2.name}`);
      }

      updateScoreboard(t1, t2, s1, s2);
      updateTable();
    }

    if (minute === 45) {
      clearInterval(i);
      showHalftime(t1, t2, s1, s2, cb);
    }

  }, 100);
}

// ================= EVENT =================
function addEvent(text) {
  let box = document.getElementById("liveMatch");

  let p = document.createElement("p");
  p.textContent = text;

  box.prepend(p);
}

// ================= HALBZEIT =================
function showHalftime(t1, t2, s1, s2, cb) {
  document.getElementById("halftimePanel").style.display = "block";

  window.resumeMatch = () => secondHalf(t1, t2, s1, s2, cb);
}

function applyHalftime() {
  selectedTactic = document.getElementById("halfTactic").value;

  document.getElementById("halftimePanel").style.display = "none";

  if (window.resumeMatch) window.resumeMatch();
}

// ================= SECOND HALF =================
function secondHalf(t1, t2, s1, s2, cb) {
  let minute = 45;

  let i = setInterval(() => {
    minute++;

    if (Math.random() < 0.07) {
      if (Math.random() < 0.5) {
        s1++;
        addEvent(`⚽ ${minute}' ${t1.name}`);
      } else {
        s2++;
        addEvent(`⚽ ${minute}' ${t2.name}`);
      }

      updateScoreboard(t1, t2, s1, s2);
      updateTable();
    }

    if (minute === 90) {
      clearInterval(i);

      updateStats(t1, t2, s1, s2);

      addEvent(`Endstand: ${s1}:${s2}`);

      setTimeout(cb, 800);
    }

  }, 100);
}

// ================= OTHER MATCHES =================
function simulateOthers(matches) {
  matches.forEach(([t1, t2]) => {
    let s1 = Math.floor(Math.random() * 3);
    let s2 = Math.floor(Math.random() * 3);

    updateStats(t1, t2, s1, s2);
  });

  finishMatchday();
}

// ================= STATS =================
function updateStats(t1, t2, s1, s2) {
  t1.goals += s1;
  t2.goals += s2;

  if (s1 > s2) {
    t1.points += 3;
    t1.form++;
    t2.form--;
  } else if (s2 > s1) {
    t2.points += 3;
    t2.form++;
    t1.form--;
  } else {
    t1.points++;
    t2.points++;
  }
}

// ================= FINISH =================
function finishMatchday() {
  currentMatchday++;
  isSimulating = false;

  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday + " / " + schedule.length;

  updateTable();
}

// ================= INIT =================
populateLeagueSelect();

teams = initTeams(leagues[currentLeague]);
generateSchedule();
populateTeamSelect();
updateTable();

document.getElementById("matchday").innerText =
  "Spieltag: 0 / " + schedule.length;
