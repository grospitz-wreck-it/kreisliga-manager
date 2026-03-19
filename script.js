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

let gameSpeed = 120;
let currentInterval = null;

let matchDuration = 180000; // 3 Minuten
let matchStartTime = 0;
let halftimeDone = false;

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

// ================= UI =================
function updateTimeline(minute) {
  let percent = (minute / 90) * 100;
  document.getElementById("timelineBar").style.width = percent + "%";
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

    tbody.innerHTML += `
      <tr>
        <td>${name}</td>
        <td>${t.points}</td>
        <td>${t.goals}</td>
      </tr>`;
  });
}

function updateSubsUI() {
  let el = document.getElementById("subsLeft");
  if (el) el.innerText = "Wechsel: " + substitutions;
}

// ================= BUTTONS =================
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

function setSpeed(speed) {
  gameSpeed = speed;
}

function fastForward() {
  gameSpeed = 30;
}

// ================= ACTIONS =================
function makeSub() {
  if (substitutions <= 0) return;

  substitutions--;
  updateSubsUI();
  liveModifier += 0.01;

  addEvent("🔁 Wechsel");
}

// ================= MATCHDAY =================
function simulateMatchday() {
  if (!selectedTeam) return alert("Team wählen!");
  if (isSimulating) return;

  substitutions = 3;
  momentum = 0;
  liveModifier = 0;
  halftimeDone = false;

  updateSubsUI();

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
  let box = document.getElementById("liveMatch");
  box.innerHTML = "";

  matchStartTime = Date.now();

  currentInterval = setInterval(() => {

    let elapsed = Date.now() - matchStartTime;
    let minute = Math.floor((elapsed / matchDuration) * 90);
    if (minute > 90) minute = 90;

    updateTimeline(minute);

    let chance = 0.01 + liveModifier + (momentum * 0.003);

    if (Math.random() < chance) {
      if (Math.random() < 0.5) {
        s1++;
        addEvent(`⚽ ${minute}' ${t1.name}`);
      } else {
        s2++;
        addEvent(`⚽ ${minute}' ${t2.name}`);
      }
    }

    // Karten
    if (Math.random() < 0.015) {
      let team = Math.random() < 0.5 ? t1 : t2;

      if (team.yellow === 1 && Math.random() < 0.2) {
        addEvent(`🟨🟥 ${minute}' ${team.name}`);
        team.red++;
      } else {
        addEvent(`🟨 ${minute}' ${team.name}`);
        team.yellow = 1;
      }
    }

    // Verletzung (selten)
    if (Math.random() < 0.002) {
      let team = Math.random() < 0.5 ? t1 : t2;

      if (!team.injured) {
        team.injured = true;
        substitutions = Math.max(0, substitutions - 1);
        updateSubsUI();
        addEvent(`🚑 ${minute}' Verletzung`);
      }
    }

    updateScoreboard(t1, t2, s1, s2);
    updateTable();

    if (minute >= 45 && !halftimeDone) {
      halftimeDone = true;
      clearInterval(currentInterval);
      showHalftime(t1, t2, s1, s2, cb);
      return;
    }

    if (elapsed >= matchDuration) {
      clearInterval(currentInterval);

      updateStats(t1, t2, s1, s2);
      addEvent(`Endstand: ${s1}:${s2}`);

      setTimeout(cb, 800);
    }

  }, gameSpeed);
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
  matchStartTime = Date.now() - (matchDuration / 2);

  currentInterval = setInterval(() => {

    let elapsed = Date.now() - matchStartTime;
    let minute = Math.floor((elapsed / matchDuration) * 90);

    updateTimeline(minute);

    let chance = 0.012 + liveModifier;

    if (Math.random() < chance) {
      if (Math.random() < 0.5) s1++;
      else s2++;
    }

    updateScoreboard(t1, t2, s1, s2);
    updateTable();

    if (elapsed >= matchDuration) {
      clearInterval(currentInterval);

      updateStats(t1, t2, s1, s2);
      addEvent(`Endstand: ${s1}:${s2}`);

      setTimeout(cb, 800);
    }

  }, gameSpeed);
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

  if (s1 > s2) t1.points += 3;
  else if (s2 > s1) t2.points += 3;
  else { t1.points++; t2.points++; }
}

// ================= FINISH =================
function finishMatchday() {
  currentMatchday++;
  isSimulating = false;

  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday + " / " + schedule.length;

  updateTable();
}

// ================= TEAM =================
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

// ================= INIT =================
teams = initTeams(leagues[currentLeague]);
generateSchedule();
populateTeamSelect();
updateTable();

document.getElementById("matchday").innerText =
  "Spieltag: 0 / " + schedule.length;
