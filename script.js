let teams = [];
let schedule = [];
let currentMatchday = 0;
let selectedTeam = null;
let selectedTactic = "normal";
let lastResults = [];
let isSimulating = false;

let teamLocked = false;
let leagueLocked = false;

let audioCtx = null;
let crowdNode = null;

// REAL LIGA
let leagues = {
  "Kreisliga A Herford": [
    { name: "TuS Bruchmühlen", strength: 75 },
    { name: "SV Enger-Westerenger", strength: 72 },
    { name: "VfL Holsen", strength: 70 },
    { name: "Bünder SV", strength: 68 },
    { name: "TSV Löhne", strength: 66 },
    { name: "SV Löhne-Obernbeck", strength: 64 },
    { name: "SC Enger", strength: 62 },
    { name: "FA Herringhausen/Eickum", strength: 60 }
  ]
};

let currentLeague = "Kreisliga A Herford";

// INIT
function initTeams(raw) {
  return raw.map(t => ({
    ...t,
    points: 0,
    goals: 0,
    form: 0,
    tactic: "normal"
  }));
}

// LOAD / SAVE
function loadGame() {
  let s = localStorage.getItem("kreisligaSave");
  if (s) {
    let d = JSON.parse(s);
    Object.assign(window, d);
    generateSchedule();
  } else createNewGame();
}

function saveGame() {
  localStorage.setItem("kreisligaSave", JSON.stringify({
    teams,currentMatchday,selectedTeam,selectedTactic,
    teamLocked,leagueLocked,currentLeague,lastResults
  }));
}

// NEW
function createNewGame() {
  teams = initTeams(leagues[currentLeague]);
  currentMatchday = 0;
  lastResults = [];
  generateSchedule();
  saveGame();
}

// SCHEDULE (30 Spieltage)
function generateSchedule() {
  schedule = [];
  let temp = [...teams];

  for (let i = 0; i < temp.length - 1; i++) {
    let m = [];
    for (let j = 0; j < temp.length / 2; j++) {
      m.push([temp[j], temp[temp.length - 1 - j]]);
    }
    schedule.push(m);
    temp.splice(1, 0, temp.pop());
  }

  let returnRound = schedule.map(d => d.map(m => [m[1], m[0]]));
  schedule = [...schedule, ...returnRound, ...schedule];
  schedule = schedule.slice(0, 30);
}

// SOUND
function startSound() {
  if (!audioCtx) audioCtx = new AudioContext();

  let buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
  let data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.2;
  }

  let noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  let filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;

  let gain = audioCtx.createGain();
  gain.gain.value = 0.15;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start();
  crowdNode = noise;
}

function stopSound() {
  if (crowdNode) crowdNode.stop();
}

// FORMATION BONUS
function getFormationBonus() {
  let f = document.getElementById("formationSelect")?.value;
  if (f === "433") return 0.15;
  if (f === "532") return -0.1;
  return 0;
}

// GOALS
function randomGoals(team) {
  let base = (team.strength / 100) + (team.form * 0.1) + getFormationBonus();
  let g = 0;
  if (Math.random() < base) g++;
  if (Math.random() < base * 0.4) g++;
  return g;
}

// MATCHDAY
function simulateMatchday() {
  if (isSimulating) return;
  if (currentMatchday >= schedule.length) return alert("Saison beendet!");

  isSimulating = true;
  lastResults = [];
  startSound();

  let matches = schedule[currentMatchday];
  let userMatch = matches.find(m => m[0].name===selectedTeam || m[1].name===selectedTeam);

  simulateLiveMatch(userMatch[0], userMatch[1], () => {
    simulateOthers(matches.filter(m=>m!==userMatch));
  });
}

// LIVE MATCH
function simulateLiveMatch(t1,t2,cb){
  let min=0,s1=0,s2=0;
  let box=document.getElementById("liveMatch");
  box.innerHTML=`<h2>${t1.name} vs ${t2.name}</h2>`;

  let i=setInterval(()=>{
    min++;

    if(Math.random()<0.08){
      if(Math.random()<0.5){s1++; box.innerHTML+=`<p>⚽ ${min}' ${t1.name}</p>`;}
      else{s2++; box.innerHTML+=`<p>⚽ ${min}' ${t2.name}</p>`;}
      updateTable();
    }

    if(min===45){
      clearInterval(i);

      if(confirm(`Halbzeit ${s1}:${s2} ändern?`)){
        selectedTactic = prompt("normal/offensive/defensive",selectedTactic)||selectedTactic;
        let f = prompt("442/433/532","442");
        if(f) document.getElementById("formationSelect").value=f;
      }

      setTimeout(()=>simulateSecondHalf(t1,t2,s1,s2,cb),1000);
    }

  },120);
}

function simulateSecondHalf(t1,t2,s1,s2,cb){
  let min=45;
  let box=document.getElementById("liveMatch");

  let i=setInterval(()=>{
    min++;

    if(Math.random()<0.08){
      if(Math.random()<0.5){s1++; box.innerHTML+=`<p>⚽ ${min}' ${t1.name}</p>`;}
      else{s2++; box.innerHTML+=`<p>⚽ ${min}' ${t2.name}</p>`;}
      updateTable();
    }

    if(min>=90){
      clearInterval(i);

      updateStats(t1,t2,s1,s2);
      box.innerHTML+=`<h3>Endstand: ${s1}:${s2}</h3>`;

      lastResults.push({team1:t1.name,team2:t2.name,score1:s1,score2:s2});

      setTimeout(cb,1000);
    }

  },120);
}

// OTHERS
function simulateOthers(matches){
  let box=document.getElementById("liveMatch");
  box.innerHTML+="<hr><small>Andere Spiele:</small>";

  matches.forEach(([t1,t2])=>{
    let s1=randomGoals(t1);
    let s2=randomGoals(t2);
    updateStats(t1,t2,s1,s2);
    box.innerHTML+=`<div style="font-size:12px">${t1.name} ${s1}:${s2} ${t2.name}</div>`;
  });

  finishMatchday();
}

// STATS
function updateStats(t1,t2,s1,s2){
  t1.goals+=s1; t2.goals+=s2;

  if(s1>s2){t1.points+=3; t1.form+=0.2; t2.form-=0.2;}
  else if(s2>s1){t2.points+=3; t2.form+=0.2; t1.form-=0.2;}
  else{t1.points++; t2.points++;}
}

// FINISH
function finishMatchday(){
  currentMatchday++;
  isSimulating=false;
  stopSound();
  saveGame();
  updateAll();
}

// UI
function updateAll(){updateTable();updateResults();updateMatchdayDisplay();}
function updateTable(){
  teams.sort((a,b)=>b.points-a.points);
  let tb=document.querySelector("#table tbody");
  tb.innerHTML="";
  teams.forEach(t=>{
    let n=t.name===selectedTeam?"👉 "+t.name:t.name;
    tb.innerHTML+=`<tr><td>${n}</td><td>${t.points}</td><td>${t.goals}</td></tr>`;
  });
}
function updateResults(){
  let d=document.getElementById("results"); d.innerHTML="";
  lastResults.forEach(r=>{
    d.innerHTML+=`<p>${r.team1} ${r.score1}:${r.score2} ${r.team2}</p>`;
  });
}
function updateMatchdayDisplay(){
  document.getElementById("matchday").innerText="Spieltag: "+currentMatchday;
}

// INIT
loadGame();
populateTeamSelect();
populateLeagueSelect();
updateAll();
