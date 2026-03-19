let teams = [];
let schedule = [];
let currentMatchday = 0;

let selectedTeam = null;
let selectedTactic = "normal";

let isSimulating = false;
let teamLocked = false;

let liveModifier = 0;
let substitutions = 3;

let gameSpeed = 120;
let currentInterval = null;
let gameLoop = null;

let matchDuration = 180000;
let matchStartTime = 0;
let halftimeDone = false;

// TEAMS
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

  let second = schedule.map(r => r.map(m => [m[1], m[0]]));
  schedule = schedule.concat(second);
}

// UI
function updateTimeline(minute) {
  document.getElementById("timelineBar").style.width =
    (minute / 90) * 100 + "%";
}

function updateScoreboard(t1, t2, s1, s2) {
  document.getElementById("team1Name").innerText = t1.name;
  document.getElementById("team2Name").innerText = t2.name;
  document.getElementById("score").innerText = s1 + " : " + s2;
}

function updateTable() {
  let tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  teams.sort((a,b)=>b.points-a.points);

  teams.forEach(t=>{
    let name = t.name===selectedTeam ? "👉 "+t.name : t.name;

    tbody.innerHTML += `<tr>
      <td>${name}</td>
      <td>${t.points}</td>
      <td>${t.goals}</td>
    </tr>`;
  });
}

// BUTTONS
function setLiveMode(mode) {
  liveModifier = 0;

  document.getElementById("btnAttack").classList.remove("activeBtn");
  document.getElementById("btnCalm").classList.remove("activeBtn");

  if (mode === "attack") {
    liveModifier = 0.02;
    document.getElementById("btnAttack").classList.add("activeBtn");
  }

  if (mode === "calm") {
    liveModifier = -0.015;
    document.getElementById("btnCalm").classList.add("activeBtn");
  }
}

function setSpeed(e, speed) {
  gameSpeed = speed;

  document.querySelectorAll(".speedBtn").forEach(b =>
    b.classList.remove("activeBtn")
  );

  e.target.classList.add("activeBtn");

  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = setInterval(gameLoop, gameSpeed);
  }
}

function fastForward() {
  setSpeed({target:null}, 30);
}

// MATCH
function simulateMatchday() {
  if (!selectedTeam) return alert("Team wählen!");
  if (isSimulating) return;

  substitutions = 3;
  halftimeDone = false;
  isSimulating = true;

  let matches = schedule[currentMatchday];

  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  simulateLiveMatch(userMatch[0], userMatch[1]);
}

function simulateLiveMatch(t1, t2) {
  let s1 = 0, s2 = 0;
  let box = document.getElementById("liveMatch");
  box.innerHTML = "";

  matchStartTime = Date.now();

  gameLoop = function() {
    let elapsed = Date.now() - matchStartTime;
    let minute = Math.floor((elapsed / matchDuration) * 90);
    if (minute > 90) minute = 90;

    updateTimeline(minute);

    let chance = 0.01 + liveModifier;

    if (Math.random() < chance) {
      if (Math.random() < 0.5) {
        s1++;
        addEvent(`⚽ ${minute}' ${t1.name}`);
      } else {
        s2++;
        addEvent(`⚽ ${minute}' ${t2.name}`);
      }
    }

    updateScoreboard(t1, t2, s1, s2);
    updateTable();

    if (minute >= 45 && !halftimeDone) {
      halftimeDone = true;
      clearInterval(currentInterval);
      document.getElementById("halftimePanel").style.display = "block";
      window.resume = () => secondHalf(t1, t2, s1, s2);
      return;
    }

    if (elapsed >= matchDuration) {
      clearInterval(currentInterval);
      finishMatch(t1, t2, s1, s2);
    }
  };

  currentInterval = setInterval(gameLoop, gameSpeed);
}

function secondHalf(t1, t2, s1, s2) {
  document.getElementById("halftimePanel").style.display = "none";
  matchStartTime = Date.now() - matchDuration / 2;

  currentInterval = setInterval(gameLoop, gameSpeed);
}

function applyHalftime() {
  selectedTactic = document.getElementById("halfTactic").value;
  window.resume();
}

function addEvent(text) {
  let box = document.getElementById("liveMatch");
  let p = document.createElement("p");
  p.textContent = text;
  box.prepend(p);
}

function finishMatch(t1, t2, s1, s2) {
  t1.goals += s1;
  t2.goals += s2;

  if (s1 > s2) t1.points += 3;
  else if (s2 > s1) t2.points += 3;
  else { t1.points++; t2.points++; }

  addEvent(`Endstand: ${s1}:${s2}`);

  currentMatchday++;
  isSimulating = false;

  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday + " / " + schedule.length;

  updateTable();
}

// TEAM
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
  if (teamLocked) return;
  selectedTeam = document.getElementById("teamSelect").value;
  teamLocked = true;
}

function setTactic() {
  selectedTactic = document.getElementById("tacticSelect").value;
  document.getElementById("currentTactic").innerText =
    "Taktik: " + selectedTactic;
}

// INIT
teams = initTeams(leagues["Kreisliga A Herford"]);
generateSchedule();
populateTeamSelect();
updateTable();

document.getElementById("matchday").innerText =
  "Spieltag: 0 / " + schedule.length;
