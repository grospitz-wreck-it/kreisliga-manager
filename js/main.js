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

// ❌ Farbe entfernt (wie gewünscht)
let playerTitle = localStorage.getItem("playerTitle") || "Freizeitkicker";

// =========================
// 🆕 GAME STATE (NEU)
// =========================
let gameState = window.gameState || {
  phase: "idle" // idle | matchday_ready | live | halftime
};

// =========================
// 🆕 LEAGUE
// =========================
let currentLeague = localStorage.getItem("selectedLeague") || null;

// =========================
// 🛑 BLACKLIST
// =========================
const bannedWords = [
  "nazi","hitler","ss","reich",
  "sex","porn","xxx","fick","fuck","hure","bitch",
  "admin","moderator","support",
  "polizei","fbi","cia"
];

// =========================
// 🔍 NAME VALIDATION
// =========================
function isValidName(name){
  if(!name || name.length < 3) return false;
  if(name.length > 20) return false;

  const lower = name.toLowerCase();

  if(bannedWords.some(word => lower.includes(word))) return false;
  if(/^\d+$/.test(name)) return false;

  return true;
}

// =========================
// ⏱️ COOLDOWN
// =========================
function canChangeName(){
  if(!lastNameChange) return true;
  return (Date.now() - parseInt(lastNameChange)) > 60000;
}

// =========================
// 👤 INIT NAME
// =========================
async function initPlayerName(){

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
// 📱 PANEL CONTROL
// =========================
function toggleSetup(){
  document.getElementById("setupPanel")?.classList.toggle("open");
  document.getElementById("overlay")?.classList.toggle("active");
}

function closeSetup(){
  document.getElementById("setupPanel")?.classList.remove("open");
  document.getElementById("overlay")?.classList.remove("active");
}

// =========================
// 📑 TABS
// =========================
function openTab(evt, tabId){
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tabContent").forEach(c => c.classList.remove("active"));

  evt.currentTarget.classList.add("active");
  document.getElementById(tabId).classList.add("active");
}

// =========================
// 🎨 UI UPDATE
// =========================
function updateNameUI(){
  const input = document.getElementById("nameInput");
  if(input) input.value = playerName;
}

// =========================
// ✏️ NAME ÄNDERN
// =========================
async function changeName(){

  const input = document.getElementById("nameInput").value.trim();

  if(!isValidName(input)) return alert("Ungültiger Name!");
  if(!canChangeName()) return alert("Nur 1x pro Minute!");

  const { data } = await supabaseClient
    .from("leaderboard")
    .select("name")
    .eq("name", input);

  if(data?.length > 0){
    return alert("Name bereits vergeben!");
  }

  playerName = input;
  lastNameChange = Date.now();

  localStorage.setItem("playerName", playerName);
  localStorage.setItem("lastNameChange", lastNameChange);

  updateHeader();
  loadLeaderboard();
}

// =========================
// 🏅 TITEL
// =========================
function getPlayerTitle(score){
  if(score >= 50) return "Schwalbengott";
  if(score >= 30) return "Kampfschwein";
  if(score >= 15) return "Platzwart";
  return "Freizeitkicker";
}

// =========================
// 👥 FRIEND SYSTEM
// =========================
let friendCode = localStorage.getItem("friendCode");
if(!friendCode){
  friendCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  localStorage.setItem("friendCode", friendCode);
}

// =========================
// 🆕 HEADER UPDATE
// =========================
function updateHeader(){

  const league = localStorage.getItem("selectedLeague") || "Keine Liga";
  const team = localStorage.getItem("selectedTeam") || "";

  const titleEl = document.getElementById("gameTitle");
  const subEl = document.getElementById("leagueTitle");

  if(titleEl) titleEl.textContent = playerName || "Kreisliga Manager";
  if(subEl) subEl.textContent = team ? `${league} • ${team}` : league;
}

// =========================
// 🎮 ⭐ PRIMARY BUTTON SYSTEM
// =========================
function handleMainAction(){

  if (gameState.phase === "idle") {
    startSeason?.();
    gameState.phase = "matchday_ready";
  }

  else if (gameState.phase === "matchday_ready") {
    simulateMatchdayWrapper();
    gameState.phase = "live";
  }

  else if (gameState.phase === "halftime") {
    resumeMatch?.();
    gameState.phase = "live";
  }

  else if (gameState.phase === "live") {
    pauseMatch?.();
  }

  updateMainButton();
}

// =========================
// 🔄 BUTTON UPDATE
// =========================
function updateMainButton(){

  const btn = document.getElementById("mainActionBtn");
  if(!btn) return;

  btn.classList.remove("pause");

  if (gameState.phase === "idle") {
    btn.innerText = "▶ Saison starten";
  }

  else if (gameState.phase === "matchday_ready") {
    btn.innerText = "▶ Nächster Spieltag";
  }

  else if (gameState.phase === "halftime") {
    btn.innerText = "▶ 2. Halbzeit starten";
  }

  else if (gameState.phase === "live") {
    btn.innerText = "⏸ Pause";
    btn.classList.add("pause");
  }
}

// =========================
// 🆕 MATCHDAY UI
// =========================
function updateMatchdayUI(){
  const el = document.getElementById("matchday");
  if(!el) return;

  el.innerText = "Spieltag: " + (currentMatchday || 0) + " / " + (schedule?.length || 30);
}

// =========================
// 🆕 MATCHDAY WRAPPER
// =========================
function simulateMatchdayWrapper(){

  simulateMatchday?.();
  updateTable?.();
  updateMatchdayUI();

  gameState.phase = "matchday_ready";
  updateMainButton();
}

// =========================
// 📊 MOMENTUM SYSTEM (NEU)
// =========================
function updateMomentum(value){
  const bar = document.getElementById("momentumBar");
  if(bar){
    bar.style.width = value + "%";
  }
}

// =========================
// ⚡ SPEED UI FIX
// =========================
function setSpeed(e, speed){
  document.querySelectorAll(".speed").forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");

  if(typeof window.setGameSpeed === "function"){
    setGameSpeed(speed);
  }
}

// =========================
// 👥 FRIEND UI
// =========================
function initFriendUI(){
  const el = document.getElementById("friendCodeDisplay");
  if(el) el.innerText = friendCode;
}

function copyFriendCode(){
  navigator.clipboard.writeText(friendCode);
  alert("Code kopiert!");
}

function joinFriendCode(){
  const input = document.getElementById("friendCodeInput").value.trim().toUpperCase();
  if(!input) return;

  localStorage.setItem("friendCode", input);
  location.reload();
}

// =========================
// 🚀 APP START
// =========================
window.onload = function(){

  console.log("🚀 App gestartet");

  loadGameState?.();
  updateTable?.();
  startAds?.();
  loadLeaderboard?.();

  initPlayerName();
  updateHeader();
  initFriendUI();
  updateMatchdayUI();
  updateMainButton();

  const select = document.getElementById("leagueSelect");
  if(select){
    select.innerHTML = "";
    Object.keys(leagues).forEach(l => {
      let option = document.createElement("option");
      option.value = l;
      option.textContent = leagues[l];
      select.appendChild(option);
    });
  }
};
