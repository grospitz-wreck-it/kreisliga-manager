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
// 🎨 UI
// =========================
function updateNameUI(){
  const input = document.getElementById("nameInput");
  if(input) input.value = playerName;
}

// =========================
// 🆕 HEADER
// =========================
function updateHeader(){

  const league = localStorage.getItem("selectedLeague") || "Keine Liga";
  const team = localStorage.getItem("selectedTeam") || "";

  document.getElementById("gameTitle")?.textContent = playerName || "Kreisliga Manager";
  document.getElementById("leagueTitle")?.textContent =
    team ? `${league} • ${team}` : league;
}

// =========================
// 🚀 SAISON START
// =========================
function startSeason(){

  console.log("🏁 Saison gestartet");

  currentMatchday = 0;

  generateSchedule?.();

  gameState.phase = "matchday_ready";

  updateMatchdayUI();
  updateMainButton();
}

// =========================
// ▶️ MATCH START (FIXED CLEAN)
// =========================
function startMatch(){

  console.log("⚽ Spiel startet");

  if(typeof simulateMatchday === "function"){
    simulateMatchday();
  } else {
    console.error("❌ simulateMatchday fehlt");
  }

  gameState.phase = "live";
  updateMainButton();
}

// =========================
// ▶️ RESUME (ENGINE ONLY)
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
      window.resumeMatch?.(); // 👉 direkt Engine nutzen
      break;

    case "live":
      isSimulating = false; // simple pause
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
    (schedule?.length || 30);
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
  document.getElementById("friendCodeDisplay")?.innerText = friendCode;
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
