// =========================
// 👤 PLAYER SYSTEM
// =========================
let playerId = localStorage.getItem("playerId");
if(!playerId){
  playerId = crypto.randomUUID();
  localStorage.setItem("playerId", playerId);
}

let playerName = localStorage.getItem("playerName");
let lastNameChange = localStorage.getItem("lastNameChange");
let playerTitle = localStorage.getItem("playerTitle") || "Freizeitkicker";

// =========================
// 🎮 GAME STATE (GLOBAL FIX)
// =========================
window.gameState = window.gameState || { phase: "idle" };
let gameState = window.gameState;

// =========================
// 🆕 LEAGUE
// =========================
let currentLeague = localStorage.getItem("selectedLeague") || null;

// =========================
// 🔍 VALIDATION
// =========================
const bannedWords = [
  "nazi","hitler","ss","reich",
  "sex","porn","xxx","fick","fuck","hure","bitch",
  "admin","moderator","support",
  "polizei","fbi","cia"
];

function isValidName(name){
  if(!name || name.length < 3) return false;
  if(name.length > 20) return false;

  const lower = name.toLowerCase();
  if(bannedWords.some(word => lower.includes(word))) return false;
  if(/^\d+$/.test(name)) return false;

  return true;
}

function canChangeName(){
  if(!lastNameChange) return true;
  return (Date.now() - parseInt(lastNameChange)) > 60000;
}

// =========================
// 👤 INIT NAME
// =========================
function initPlayerName(){

  if(!playerName){
    let name = prompt("Wie heißt du Manager?");
    if(!isValidName(name)){
      name = "Manager_" + Math.floor(Math.random() * 1000);
    }
    playerName = name;
    localStorage.setItem("playerName", playerName);
  }

  updateNameUI();
  updateHeader();
}

// =========================
// 🎨 UI
// =========================
function updateNameUI(){
  const input = document.getElementById("nameInput");
  if(input) input.value = playerName;
}

// =========================
// 🆕 HEADER (FIXED)
// =========================
function updateHeader(){

  const league = localStorage.getItem("selectedLeague") || "Keine Liga";
  const team = localStorage.getItem("selectedTeam") || "";

  const titleEl = document.getElementById("gameTitle");
  const subEl = document.getElementById("leagueTitle");

  if(titleEl){
    titleEl.textContent = playerName || "Kreisliga Manager";
  }

  if(subEl){
    subEl.textContent = team ? `${league} • ${team}` : league;
  }
}

// =========================
// 🚀 SAISON START
// =========================
function startSeason(){

  console.log("🏁 Saison gestartet");

  currentMatchday = 0;

  if(typeof generateSchedule === "function"){
    generateSchedule();
  }

  gameState.phase = "matchday_ready";

  updateMatchdayUI();
  updateMainButton();
}

// =========================
// ▶️ MATCH START (CLEAN)
// =========================
function startMatch(){

  console.log("⚽ Spiel startet");

  if(typeof simulateMatchday === "function"){
    simulateMatchday();
  } else {
    console.error("❌ simulateMatchday fehlt");
    return;
  }

  gameState.phase = "live";
  updateMainButton();
}

// =========================
// ▶️ RESUME (ENGINE HANDLES)
// =========================
function resumeMatch(){

  console.log("▶️ Resume");

  if(typeof window.resumeMatch === "function"){
    window.resumeMatch();
  }

  gameState.phase = "live";
  updateMainButton();
}

// =========================
// 🎮 MAIN BUTTON
// =========================
function handleMainAction(){

  console.log("STATE:", gameState.phase);

  switch(gameState.phase){

    case "idle":
      startSeason();
      break;

    case "matchday_ready":
      startMatch();
      break;

    case "halftime":
      if(typeof window.resumeMatch === "function"){
        window.resumeMatch();
      }
      gameState.phase = "live";
      break;

    case "live":
      // simple pause
      window.isSimulating = false;
      gameState.phase = "halftime";
      break;
  }

  updateMainButton();
}

// =========================
// 🔄 BUTTON TEXT
// =========================
function updateMainButton(){

  const btn = document.getElementById("mainActionBtn");
  if(!btn) return;

  btn.classList.remove("pause");

  if(gameState.phase === "idle"){
    btn.innerText = "▶ Saison starten";
  }
  else if(gameState.phase === "matchday_ready"){
    btn.innerText = "▶ Nächster Spieltag";
  }
  else if(gameState.phase === "halftime"){
    btn.innerText = "▶ 2. Halbzeit";
  }
  else if(gameState.phase === "live"){
    btn.innerText = "⏸ Pause";
    btn.classList.add("pause");
  }
}

// =========================
// 📅 MATCHDAY UI
// =========================
function updateMatchdayUI(){

  const el = document.getElementById("matchday");
  if(!el) return;

  el.innerText =
    "Spieltag: " +
    (currentMatchday || 0) +
    " / " +
    (schedule ? schedule.length : 30);
}

// =========================
// 👥 FRIENDS
// =========================
let friendCode = localStorage.getItem("friendCode");

if(!friendCode){
  friendCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  localStorage.setItem("friendCode", friendCode);
}

function initFriendUI(){
  const el = document.getElementById("friendCodeDisplay");
  if(el) el.innerText = friendCode;
}

// =========================
// 🚀 APP START
// =========================
window.onload = function(){

  console.log("🚀 App gestartet");

  if(typeof loadGameState === "function") loadGameState();
  if(typeof updateTable === "function") updateTable();
  if(typeof startAds === "function") startAds();
  if(typeof loadLeaderboard === "function") loadLeaderboard();

  initPlayerName();
  updateHeader();
  initFriendUI();
  updateMatchdayUI();
  updateMainButton();

  const select = document.getElementById("leagueSelect");

  if(select && typeof leagues !== "undefined"){

    select.innerHTML = "";

    Object.keys(leagues).forEach(l => {
      let option = document.createElement("option");
      option.value = l;
      option.textContent = leagues[l];
      select.appendChild(option);
    });
  }
};
// =========================
// 🧱 UI FUNCTION SAFE BUNDLE
// =========================

// 📱 SETUP PANEL
function toggleSetup(){
  document.getElementById("setupPanel")?.classList.toggle("open");
  document.getElementById("overlay")?.classList.toggle("active");
}

function closeSetup(){
  document.getElementById("setupPanel")?.classList.remove("open");
  document.getElementById("overlay")?.classList.remove("active");
}

// 📑 TABS
function openTab(evt, tabId){

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tabContent").forEach(c => c.classList.remove("active"));

  if(evt && evt.currentTarget){
    evt.currentTarget.classList.add("active");
  }

  const tab = document.getElementById(tabId);
  if(tab) tab.classList.add("active");
}

// 🏆 LEAGUE SELECT
function selectLeague(){

  const select = document.getElementById("leagueSelect");
  if(!select) return;

  const leagueKey = select.value;

  localStorage.setItem("selectedLeague", leagueKey);

  if(typeof loadLeague === "function"){
    loadLeague(leagueKey);
  }

  updateHeader?.();
}

// ⚽ TEAM SELECT
function selectTeam(teamName){

  localStorage.setItem("selectedTeam", teamName);

  window.selectedTeam = teamName;

  updateHeader?.();

  alert("Team gewählt: " + teamName);
}

// ✏️ NAME CHANGE (SAFE WRAPPER)
async function changeName(){

  const inputEl = document.getElementById("nameInput");
  if(!inputEl) return;

  const input = inputEl.value.trim();

  if(typeof isValidName === "function" && !isValidName(input)){
    alert("Ungültiger Name!");
    return;
  }

  if(typeof canChangeName === "function" && !canChangeName()){
    alert("Nur 1x pro Minute!");
    return;
  }

  playerName = input;
  localStorage.setItem("playerName", playerName);
  localStorage.setItem("lastNameChange", Date.now());

  updateHeader?.();
}

// 👥 FRIENDS
function copyFriendCode(){
  navigator.clipboard.writeText(friendCode || "");
  alert("Code kopiert!");
}

function joinFriendCode(){

  const input = document.getElementById("friendCodeInput")?.value.trim().toUpperCase();
  if(!input) return;

  localStorage.setItem("friendCode", input);
  location.reload();
}

// ⚡ SPEED CONTROL
function setSpeed(speed){

  if(!speed || speed <= 0) return;

  window.speedMultiplier = speed;

  if(typeof window.restartInterval === "function"){
    window.restartInterval();
  }

  console.log("⏩ Speed:", speed);
}
