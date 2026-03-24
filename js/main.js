// =========================
// 👤 PLAYER SYSTEM (FINAL)
// =========================

let playerId = localStorage.getItem("playerId");
if(!playerId){
  playerId = crypto.randomUUID();
  localStorage.setItem("playerId", playerId);
}

let playerName = localStorage.getItem("playerName");
let lastNameChange = localStorage.getItem("lastNameChange");

// 🎨 Farbe + Titel
let playerColor = localStorage.getItem("playerColor") || "#00ffcc";
let playerTitle = localStorage.getItem("playerTitle") || "Freizeitkicker";

// =========================
// 🆕 LEAGUE FIX
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

  if(bannedWords.some(word => lower.includes(word))){
    return false;
  }

  if(/^\d+$/.test(name)) return false;

  return true;
}

// =========================
// ⏱️ COOLDOWN
// =========================
function canChangeName(){
  if(!lastNameChange) return true;

  const diff = Date.now() - parseInt(lastNameChange);
  return diff > 60000;
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
  const panel = document.getElementById("setupPanel");
  const overlay = document.getElementById("overlay");

  if(!panel || !overlay) return;

  panel.classList.toggle("open");
  overlay.classList.toggle("active");
}

function closeSetup(){
  const panel = document.getElementById("setupPanel");
  const overlay = document.getElementById("overlay");

  if(!panel || !overlay) return;

  panel.classList.remove("open");
  overlay.classList.remove("active");
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
// 👉 SWIPE
// =========================
window.addEventListener("load", () => {

  const panel = document.getElementById("setupPanel");
  if(!panel) return;

  let startX = 0;

  panel.addEventListener("touchstart", (e)=>{
    startX = e.touches[0].clientX;
  });

  panel.addEventListener("touchmove", (e)=>{
    let diff = e.touches[0].clientX - startX;

    if(diff > 0){
      panel.style.transform = `translateX(${diff}px)`;
    }
  });

  panel.addEventListener("touchend", (e)=>{
    let diff = e.changedTouches[0].clientX - startX;

    if(diff > 100){
      closeSetup();
    } else {
      panel.style.transform = "";
    }
  });

});

// =========================
// ESC SUPPORT
// =========================
document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape"){
    closeSetup();
  }
});

// =========================
// 🎨 UI UPDATE
// =========================
function updateNameUI(){

  const input = document.getElementById("nameInput");
  if(input) input.value = playerName;

  const colorInput = document.getElementById("colorInput");
  if(colorInput) colorInput.value = playerColor;
}

// =========================
// ✏️ NAME ÄNDERN
// =========================
async function changeName(){

  const input = document.getElementById("nameInput").value.trim();

  if(!isValidName(input)){
    alert("Ungültiger Name!");
    return;
  }

  if(!canChangeName()){
    alert("Du kannst deinen Namen nur 1x pro Minute ändern!");
    return;
  }

  const { data } = await supabaseClient
    .from("leaderboard")
    .select("name")
    .eq("name", input);

  if(data && data.length > 0){
    alert("Name bereits vergeben!");
    return;
  }

  playerName = input;
  lastNameChange = Date.now();

  localStorage.setItem("playerName", playerName);
  localStorage.setItem("lastNameChange", lastNameChange);

  alert("Name gespeichert!");

  updateHeader();
  loadLeaderboard();
}

// =========================
// 🎨 FARBE ÄNDERN
// =========================
function changeColor(){

  const color = document.getElementById("colorInput").value;

  playerColor = color;
  localStorage.setItem("playerColor", color);

  loadLeaderboard();
}

// =========================
// 🏅 TITEL SYSTEM
// =========================
function getPlayerTitle(score){
  if(score >= 50) return "Schwalbengott";
  if(score >= 30) return "Kampfschwein";
  if(score >= 15) return "Platzwart";
  return "Freizeitkicker";
}

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

  if(titleEl){
    titleEl.textContent = playerName || "Kreisliga Manager";
  }

  if(subEl){
    subEl.textContent = team ? `${league} • ${team}` : league;
  }
}

// =========================
// 🚀 APP START
// =========================
window.onload = function(){

  console.log("🚀 App gestartet");

  if(typeof loadGameState === "function"){
    loadGameState();
  }

  const setup = document.getElementById("setupPanel");
  if(setup && !selectedTeam){
    setup.classList.add("open");
  }

  const select = document.getElementById("leagueSelect");
  if(!select){
    console.error("leagueSelect nicht gefunden");
    return;
  }

  select.innerHTML = "";

  Object.keys(leagues).forEach(l => {
    let option = document.createElement("option");
    option.value = l;
    option.textContent = leagues[l];
    select.appendChild(option);
  });

  if(selectedTeam){
    const label = document.getElementById("selectedTeamText");
    if(label) label.innerText = "Dein Team: " + selectedTeam;

    const teamSelect = document.getElementById("teamSelect");
    const btn = document.getElementById("btnSelectTeam");

    if(teamSelect) teamSelect.disabled = true;
    if(btn) btn.disabled = true;
  }

  if(typeof updateTable === "function"){
    updateTable();
  }

  // 🔥 MATCHDAY FIX
  updateMatchdayUI();

  if(typeof startAds === "function"){
    startAds();
  }

  if(typeof loadLeaderboard === "function"){
    loadLeaderboard();
  }

  initPlayerName();
  updateHeader();
  initFriendUI();
};

// =========================
// 🆕 MATCHDAY UI FIX
// =========================
function updateMatchdayUI(){

  const el = document.getElementById("matchday");
  if(!el) return;

  el.innerText = "Spieltag: " + (currentMatchday || 0) + " / " + (schedule?.length || 0);
}

// =========================
// 🆕 MATCHDAY WRAPPER
// =========================
function simulateMatchdayWrapper(){

  if(typeof simulateMatchday === "function"){
    simulateMatchday();
  }

  // 🔥 WICHTIG
  if(typeof updateTable === "function"){
    updateTable();
  }

  updateMatchdayUI();
}

// =========================
// 👥 FRIEND UI
// =========================
function initFriendUI(){
  const codeEl = document.getElementById("friendCodeDisplay");
  if(codeEl){
    codeEl.innerText = friendCode;
  }
}

function copyFriendCode(){
  navigator.clipboard.writeText(friendCode);
  alert("Freundescode kopiert!");
}

function joinFriendCode(){
  const input = document.getElementById("friendCodeInput").value.trim().toUpperCase();
  if(!input) return;

  localStorage.setItem("friendCode", input);
  location.reload();
}
