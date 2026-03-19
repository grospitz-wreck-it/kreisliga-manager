let teams = [];
let schedule = [];
let currentMatchday = 0;
let selectedTeam = null;
let selectedTactic = "normal";
let lastResults = [];
let isSimulating = false;

let teamLocked = false;
let leagueLocked = false;

// 🔊 SOUND
let audioCtx = null;
let crowdSound = null;
let chantSound = null;

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

// INIT TEAMS
function initTeams(raw) {
  return raw.map(t => ({
    ...t,
    points: 0,
    goals: 0,
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
  } else {
    createNewGame();
  }
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

// SOUND
function startSound() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  crowdSound = playCrowd(audioCtx);
  chantSound = playChantPulse(audioCtx);
}

function playCrowd(ctx) {
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = 0.05;

  noise.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
  return noise;
}

function playChantPulse(ctx) {
  const gain = ctx.createGain();
  gain.gain.value = 0.1;

  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.value = 200;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 2;

  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.1;

  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  lfo.start();

  return {osc,lfo};
}

function stopSound() {
  try { crowdSound.stop(); } catch {}
  try { chantSound.osc.stop(); chantSound.lfo.stop(); } catch {}
}

// TACTIC
function applyTactic(team, score) {
  let t = team.name===selectedTeam ? selectedTactic : team.tactic;
  if (t==="offensive") return score+1;
  if (t==="defensive") return Math.max(0,score-1);
  return score;
}

// MATCHDAY
function simulateMatchday() {
  if (isSimulating) return;
  if (currentMatchday >= schedule.length) return alert("Saison beendet!");

  startSound(); // 🔊 SOUND START

  isSimulating = true;
  lastResults = [];
  playMatches(schedule[currentMatchday],0);
}

// PLAY
function playMatches(matches,i){
  if(i>=matches.length){
    currentMatchday++;
    isSimulating=false;
    stopSound(); // 🔊 SOUND STOP
    saveGame();
    updateAll();
    return;
  }
  let [t1,t2]=matches[i];
  simulateLiveMatch(t1,t2,()=>playMatches(matches,i+1));
}

// LIVE MATCH
function simulateLiveMatch(t1,t2,cb){
  let min=0,s1=0,s2=0;
  let box=document.getElementById("liveMatch");
  let isUser=(t1.name===selectedTeam||t2.name===selectedTeam);

  box.innerHTML=`<p class="${isUser?'highlight':''}">${t1.name} vs ${t2.name}</p>`;

  let inter=setInterval(()=>{
    min++;

    if(Math.random()<0.15){
      if(Math.random()<0.5){
        s1++;
        box.innerHTML+=`<p class="${t1.name===selectedTeam?'highlight':''}">⚽ ${min}' ${t1.name}</p>`;
      }else{
        s2++;
        box.innerHTML+=`<p class="${t2.name===selectedTeam?'highlight':''}">⚽ ${min}' ${t2.name}</p>`;
      }
    }

    if(min>=90){
      clearInterval(inter);

      s1=applyTactic(t1,s1);
      s2=applyTactic(t2,s2);

      t1.goals+=s1;
      t2.goals+=s2;

      if(s1>s2)t1.points+=3;
      else if(s2>s1)t2.points+=3;
      else{t1.points++;t2.points++;}

      box.innerHTML+=`<p><b>Endstand: ${s1}:${s2}</b></p><hr>`;
      lastResults.push({team1:t1.name,team2:t2.name,score1:s1,score2:s2});
      setTimeout(cb,600);
    }

    box.scrollTop=box.scrollHeight;

  },100);
}

// UI
function updateAll(){
  updateTable();
  updateResults();
  updateMatchdayDisplay();
}

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
    let line=`${r.team1} ${r.score1}:${r.score2} ${r.team2}`;
    if(r.team1===selectedTeam||r.team2===selectedTeam) line="👉 "+line;
    d.innerHTML+=`<p>${line}</p>`;
  });
}

function updateMatchdayDisplay(){
  document.getElementById("matchday").innerText="Spieltag: "+currentMatchday;
}

// DROPDOWNS
function populateTeamSelect(){
  let s=document.getElementById("teamSelect");
  s.innerHTML="";
  teams.forEach(t=>{
    let o=document.createElement("option");
    o.value=t.name; o.textContent=t.name;
    s.appendChild(o);
  });
  if(teamLocked)s.disabled=true;
}

function populateLeagueSelect(){
  let s=document.getElementById("leagueSelect");
  s.innerHTML="";
  Object.keys(leagues).forEach(l=>{
    let o=document.createElement("option");
    o.value=l; o.textContent=l;
    s.appendChild(o);
  });
  if(leagueLocked)s.disabled=true;
}

// ACTIONS
function selectTeam(){
  if(teamLocked)return alert("Team bereits gewählt!");
  selectedTeam=document.getElementById("teamSelect").value;
  teamLocked=true;
  leagueLocked=true;
  saveGame();
  populateTeamSelect();
  populateLeagueSelect();
}

function setTactic(){
  selectedTactic=document.getElementById("tacticSelect").value;
  document.getElementById("currentTactic").innerText="Taktik: "+selectedTactic;
  saveGame();
}

function selectLeague(){
  if(leagueLocked)return alert("Liga bereits gestartet!");
  currentLeague=document.getElementById("leagueSelect").value;
  createNewGame();
  populateTeamSelect();
  updateAll();
}

// INIT
loadGame();
populateTeamSelect();
populateLeagueSelect();
updateAll();
document.getElementById("currentTactic").innerText="Taktik: "+selectedTactic;
