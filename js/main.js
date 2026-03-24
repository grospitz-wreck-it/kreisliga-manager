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
// 🆕 🔥 LEAGUE FIX (NEU – WICHTIG)
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
  updateHeader(); // 🔥 NEU
}

// =========================
// 📱 SETUP PANEL CONTROL
// =========================
function toggleSetup(){

  const panel = document.getElementById("setupPanel");
  const overlay = document.getElementById("overlay");

  panel.classList.toggle("open");
  overlay.classList.toggle("active");
}

function closeSetup(){

  const panel = document.getElementById("setupPanel");
  const overlay = document.getElementById("overlay");

  panel.classList.remove("open");
  overlay.classList.remove("active");
}

// ESC Support (Desktop + Android Back Gefühl)
document.addEventListener("keydown", (e) => {
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

  updateHeader(); // 🔥 NEU
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
// 🆕 AAA HEADER UPDATE
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

  // 🔥 LEAGUE DEBUG (optional)
  console.log("Aktuelle Liga:", currentLeague);

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

  if(currentMatchday){
    const matchdayEl = document.getElementById("matchday");
    if(matchdayEl){
      matchdayEl.innerText =
        "Spieltag: " + currentMatchday + " / " + (schedule?.length || "?");
    }
  }

  if(
    liveScore &&
    liveScore.t1 &&
    typeof liveScore.t1 === "object" &&
    currentMinute > 0 &&
    currentMinute < 90
  ){
    if(typeof simulateLiveMatch === "function"){
      simulateLiveMatch(
        liveScore.t1,
        liveScore.t2,
        liveScore.s1,
        liveScore.s2
      );
    }
  }

  if(typeof startAds === "function"){
    startAds();
  }

  if(typeof loadLeaderboard === "function"){
    loadLeaderboard();
  }

  // 👤 NAME INIT
  initPlayerName();

  // 🔥 HEADER INIT (NEU)
  updateHeader();

  initFriendUI();
};

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
