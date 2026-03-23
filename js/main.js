// =========================
// 🌍 GLOBAL PLAYER DATA
// =========================
let playerId = localStorage.getItem("playerId");
if(!playerId){
  playerId = crypto.randomUUID();
  localStorage.setItem("playerId", playerId);
}

let friendCode = localStorage.getItem("friendCode");
if(!friendCode){
  friendCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  localStorage.setItem("friendCode", friendCode);
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

  // 🏆 Leaderboard starten
  if(typeof loadLeaderboard === "function"){
    loadLeaderboard();
  }

  // 👥 Friend UI init
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
