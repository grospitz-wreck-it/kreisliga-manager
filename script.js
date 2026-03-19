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

let liveModifier = 0;
let momentum = 0;
let substitutions = 3;

// ================= LIGEN =================
let leagues = {
  "Kreisliga A Herford": [
    { name: "Team A", strength: 75 },
    { name: "Team B", strength: 70 },
    { name: "Team C", strength: 68 },
    { name: "Team D", strength: 65 },
    { name: "Team E", strength: 64 },
    { name: "Team F", strength: 63 },
    { name: "Team G", strength: 62 },
    { name: "Team H", strength: 61 },
    { name: "Team I", strength: 60 },
    { name: "Team J", strength: 59 },
    { name: "Team K", strength: 58 },
    { name: "Team L", strength: 57 },
    { name: "Team M", strength: 56 },
    { name: "Team N", strength: 55 },
    { name: "Team O", strength: 54 },
    { name: "Team P", strength: 53 }
  ],
  "Kreisliga B": [
    { name: "Team Q", strength: 60 },
    { name: "Team R", strength: 58 },
    { name: "Team S", strength: 56 },
    { name: "Team T", strength: 54 }
  ]
};

// ================= INIT =================
function initTeams(raw) {
  return raw.map(t => ({
    ...t,
    points: 0,
    goals: 0,
    form: 0,
    yellow: 0,
    red: 0,
    injured: false
  }));
}

// ================= SCHEDULE =================
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

  let secondHalf = schedule.map(r =>
    r.map(m => [m[1], m[0]])
  );

  schedule = schedule.concat(secondHalf);
}

// ================= LIVE CONTROL =================
function setLiveMode(mode) {
  if (mode === "attack") liveModifier = 0.03;
  if (mode === "calm") liveModifier = -0.02;
}

// ================= SUBSTITUTIONS =================
function makeSub() {
  if (substitutions <= 0) return;

  substitutions--;
  document.getElementById("subsLeft").innerText =
    "Wechsel: " + substitutions;

  addEvent("🔁 Wechsel durchgeführt");
  liveModifier += 0.015;
}

// ================= MATCHDAY =================
function simulateMatchday() {
  if (!selectedTeam) return alert("Team wählen!");
  if (isSimulating) return;

  substitutions = 3;
  momentum = 0;
  liveModifier = 0;

  document.getElementById("subsLeft").innerText = "Wechsel: 3";

  isSimulating = true;

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
  let s1 = 0, s2 = 0;
  let minute = 0;

  let box = document.getElementById("liveMatch");
  box.innerHTML = "";

  let i = setInterval(() => {
    minute++;

    // Momentum Shift
    if (Math.random() < 0.05) {
      momentum += Math.random() < 0.5 ? 1 : -1;
    }

    let chance = 0.02 + liveModifier + (momentum * 0.005);

    // Druck bei Rückstand
    if (s1 < s2) chance += 0.01;
    if (s2 < s1) chance += 0.01;

    // TOR
    if (Math.random() < chance) {
      if (Math.random() < 0.5) {
        s1++;
        addEvent(`⚽ ${minute}' ${t1.name}`);
      } else {
        s2++;
        addEvent(`⚽ ${minute}' ${t2.name}`);
      }
    }

    // FOUL / KARTEN
    if (Math.random() < 0.025) {
      let team = Math.random() < 0.5 ? t1 : t2;

      if (team.yellow === 1 && Math.random() < 0.3) {
        addEvent(`🟨🟥 ${minute}' ${team.name}`);
        team.red++;
      } else if (Math.random() < 0.1) {
        addEvent(`🟥 ${minute}' ${team.name}`);
        team.red++;
      } else {
        addEvent(`🟨 ${minute}' ${team.name}`);
        team.yellow = 1;
      }
    }

    // VERLETZUNG
    if (Math.random() < 0.004) {
      let team = Math.random() < 0.5 ? t1 : t2;
      team.injured = true;
      substitutions = Math.max(0, substitutions - 1);

      document.getElementById("subsLeft").innerText =
        "Wechsel: " + substitutions;

      addEvent(`🚑 Verletzung bei ${team.name}`);
    }

    updateScoreboard(t1, t2, s1, s2);
    updateTable();

    if (minute === 45) {
      clearInterval(i);
      showHalftime(t1, t2, s1, s2, cb);
    }

  }, 120);
}

// ================= EVENTS =================
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
  window.resumeMatch();
}

// ================= SECOND HALF =================
function secondHalf(t1, t2, s1, s2, cb) {
  let minute = 45;

  let i = setInterval(() => {
    minute++;

    let chance = 0.025 + liveModifier + (momentum * 0.005);

    if (Math.random() < chance) {
      if (Math.random() < 0.5) s1++;
      else s2++;
    }

    updateScoreboard(t1, t2, s1, s2);
    updateTable();

    if (minute === 90) {
      clearInterval(i);

      updateStats(t1, t2, s1, s2);
      addEvent(`Endstand: ${s1}:${s2}`);

      setTimeout(cb, 800);
    }

  }, 120);
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

// ================= SAISON ENDE =================
function endSeason() {
  teams.sort((a,b)=>b.points-a.points);

  addEvent(`🏆 Meister: ${teams[0].name}`);

  let choice = confirm("Neue Saison starten?");
  if (choice) location.reload();
}

// ================= FINISH =================
function finishMatchday() {
  currentMatchday++;
  isSimulating = false;

  if (currentMatchday >= schedule.length) {
    endSeason();
  }

  updateTable();
}

// ================= TABLE =================
function updateTable() {
  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  teams.sort((a,b)=>b.points-a.points);

  teams.forEach(t=>{
    let name = t.name===selectedTeam ? "👉 "+t.name : t.name;

    tbody.innerHTML += `
      <tr>
        <td>${name}</td>
        <td>${t.points}</td>
        <td>${t.goals}</td>
      </tr>`;
  });
}

// ================= INIT =================
function populateLeagueSelect() {
  let s = document.getElementById("leagueSelect");
  Object.keys(leagues).forEach(l=>{
    let o=document.createElement("option");
    o.value=l;
    o.textContent=l;
    s.appendChild(o);
  });
}

function populateTeamSelect() {
  let s = document.getElementById("teamSelect");
  s.innerHTML="";
  teams.forEach(t=>{
    let o=document.createElement("option");
    o.value=t.name;
    o.textContent=t.name;
    s.appendChild(o);
  });
}

function selectTeam() {
  selectedTeam = document.getElementById("teamSelect").value;
  teamLocked = true;
  leagueLocked = true;
}

// START
populateLeagueSelect();
teams = initTeams(leagues[currentLeague]);
generateSchedule();
populateTeamSelect();
updateTable();
