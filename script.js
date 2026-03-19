let teams = [];
let schedule = [];
let currentMatchday = 0;
let selectedTeam = null;
let selectedTactic = "normal";
let lastResults = [];
let isSimulating = false;

let teamLocked = false;
let leagueLocked = false;

// SOUND
let audioCtx = null;
let crowdNode = null;

// LIGEN
let leagues = {
  "Kreisliga A": [
    { name: "Team A", strength: 70 },
    { name: "Team B", strength: 65 },
    { name: "Team C", strength: 60 },
    { name: "Team D", strength: 55 }
  ]
};

let currentLeague = "Kreisliga A";

// INIT
function initTeams(raw) {
  return raw.map(t => ({
    ...t,
    points: 0,
    goals: 0,
    form: 0,
    tactic: ["normal","offensive","defensive"][Math.floor(Math.random()*3)]
  }));
}

// LOAD
function loadGame() {
  let saved = localStorage.getItem("kreisligaSave");
  if (saved) {
    let d = JSON.parse(saved);
    teams = d.teams;
    currentMatchday = d.currentMatchday;
    selectedTeam = d.selectedTeam;
    selectedTactic = d.selectedTactic;
    teamLocked = d.teamLocked;
    leagueLocked = d.leagueLocked;
    currentLeague = d.currentLeague;
    lastResults = d.lastResults;
    generateSchedule();
  } else createNewGame();
}

// NEW GAME
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

// SAVE
function saveGame() {
  localStorage.setItem("kreisligaSave", JSON.stringify({
    teams,currentMatchday,selectedTeam,selectedTactic,
    teamLocked,leagueLocked,currentLeague,lastResults
  }));
}

// SCHEDULE
function generateSchedule() {
  schedule = [];
  let temp = [...teams];
  for (let i=0;i<temp.length-1;i++){
    let m=[];
    for(let j=0;j<temp.length/2;j++){
      m.push([temp[j],temp[temp.length-1-j]]);
    }
    schedule.push(m);
    temp.splice(1,0,temp.pop());
  }
}

// SOUND (angenehm)
function startSound() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  let noise = audioCtx.createBufferSource();
  let buffer = audioCtx.createBuffer(1, audioCtx.sampleRate*2, audioCtx.sampleRate);
  let data = buffer.getChannelData(0);

  for (let i=0;i<data.length;i++) {
    data[i] = (Math.random()*2-1) * 0.2;
  }

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
  if (crowdNode) {
    try { crowdNode.stop(); } catch {}
    crowdNode = null;
  }
}

// MATCHDAY
function simulateMatchday() {
  if (isSimulating) return;
  if (currentMatchday >= schedule.length) return alert("Saison beendet!");

  isSimulating = true;
  lastResults = [];

  startSound();

  let matches = schedule[currentMatchday];

  // USER MATCH zuerst finden
  let userMatchIndex = matches.findIndex(
    m => m[0].name===selectedTeam || m[1].name===selectedTeam
  );

  if (userMatchIndex !== -1) {
    let userMatch = matches.splice(userMatchIndex,1)[0];
    simulateLiveMatch(userMatch[0], userMatch[1], () => {
      simulateOtherMatches(matches);
    });
  } else {
    simulateOtherMatches(matches);
  }
}

// ANDERE SPIELE
function simulateOtherMatches(matches) {
  let box = document.getElementById("liveMatch");
  box.innerHTML += "<hr><small>Andere Spiele:</small>";

  matches.forEach(([t1,t2])=>{
    let s1 = randomGoals(t1);
    let s2 = randomGoals(t2);

    updateStats(t1,t2,s1,s2);

    box.innerHTML += `<div style="font-size:12px">${t1.name} ${s1}:${s2} ${t2.name}</div>`;
  });

  finishMatchday();
}

// LIVE MATCH MIT HALBZEIT
function simulateLiveMatch(t1,t2,cb){
  let min=0,s1=0,s2=0;
  let box=document.getElementById("liveMatch");

  box.innerHTML=`<h2>${t1.name} vs ${t2.name}</h2>`;

  let inter=setInterval(()=>{
    min++;

    if(Math.random()<0.08){ // weniger Tore!
      if(Math.random()<0.5){
        s1++;
        box.innerHTML+=`<p>⚽ ${min}' ${t1.name}</p>`;
      }else{
        s2++;
        box.innerHTML+=`<p>⚽ ${min}' ${t2.name}</p>`;
      }

      updateTable(); // LIVE UPDATE
    }

    // HALBZEIT
    if(min===45){
      clearInterval(inter);

      let change = confirm(`Halbzeit!\n${s1}:${s2}\nTaktik ändern?`);

      if(change){
        let newTactic = prompt("normal / offensive / defensive", selectedTactic);
        if(newTactic) selectedTactic = newTactic;
      }

      setTimeout(()=>simulateLiveMatch2(t1,t2,s1,s2,cb),1000);
    }

  },120);
}

function simulateLiveMatch2(t1,t2,s1,s2,cb){
  let min=45;
  let box=document.getElementById("liveMatch");

  let inter=setInterval(()=>{
    min++;

    if(Math.random()<0.08){
      if(Math.random()<0.5){
        s1++;
        box.innerHTML+=`<p>⚽ ${min}' ${t1.name}</p>`;
      }else{
        s2++;
        box.innerHTML+=`<p>⚽ ${min}' ${t2.name}</p>`;
      }

      updateTable();
    }

    if(min>=90){
      clearInterval(inter);

      updateStats(t1,t2,s1,s2);

      box.innerHTML+=`<h3>Endstand: ${s1}:${s2}</h3>`;

      lastResults.push({team1:t1.name,team2:t2.name,score1:s1,score2:s2});

      setTimeout(cb,1000);
    }

  },120);
}

// REALISTISCHERE TORE
function randomGoals(team){
  let base = team.strength/100 + team.form*0.1;
  return Math.random() < base ? Math.floor(Math.random()*2) : 0;
}

// FORM SYSTEM
function updateStats(t1,t2,s1,s2){
  t1.goals+=s1;
  t2.goals+=s2;

  if(s1>s2){
    t1.points+=3;
    t1.form+=0.2;
    t2.form-=0.2;
  }else if(s2>s1){
    t2.points+=3;
    t2.form+=0.2;
    t1.form-=0.2;
  }else{
    t1.points++; t2.points++;
  }
}

// ENDE
function finishMatchday(){
  currentMatchday++;
  isSimulating=false;
  stopSound();
  saveGame();
  updateAll();
}

// UI bleibt gleich
function updateAll(){updateTable();updateResults();updateMatchdayDisplay();}
function updateTable(){
  teams.sort((a,b)=>b.points-a.points);
  let tb=document.querySelector("#table tbody");
  tb.innerHTML="";
  teams.forEach(t=>{
    let name=t.name===selectedTeam?"👉 "+t.name:t.name;
    tb.innerHTML+=`<tr><td>${name}</td><td>${t.points}</td><td>${t.goals}</td></tr>`;
  });
}
function updateResults(){
  let d=document.getElementById("results");
  d.innerHTML="";
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
