// =========================
// 🚀 INIT
// =========================
console.log("MAIN START");

window.onload = function(){

  loadGameState();

  initPlayer();
  initLeagueUI();
  bindUI();

  if(typeof initFriendUI === "function"){
    initFriendUI();
  }

  updateHeader();
  updateMainButton();

  updateTable?.();
  loadLeaderboard?.();

  if(typeof startAds === "function"){
    startAds();
  }

  console.log("✅ App vollständig geladen");
};

// =========================
// 🔲 SETUP PANEL
// =========================
function toggleSetup(){
  const panel = document.getElementById("setupPanel");
  const overlay = document.getElementById("overlay");

  const isOpen = panel.classList.contains("open");

  if(isOpen){
    closeSetup();
  } else {
    panel.classList.add("open");
    overlay.classList.add("active");
  }
}

function closeSetup(){
  const panel = document.getElementById("setupPanel");
  const overlay = document.getElementById("overlay");

  panel.classList.remove("open");
  overlay.classList.remove("active");
}

// =========================
// 👤 PLAYER
// =========================
function initPlayer(){

  if(!game.player.name){

    let name = prompt("Manager Name?");
    if(!name){
      name = "Manager_" + Math.floor(Math.random() * 1000);
    }

    game.player.name = name;
    localStorage.setItem("playerName", name);
  }

  const input = document.getElementById("nameInput");
  if(input){
    input.value = game.player.name;
  }
}

// =========================
// 🏟️ LEAGUE UI
// =========================
function initLeagueUI(){

  const select = document.getElementById("leagueSelect");

  if(!select || typeof leagues === "undefined") return;

  select.innerHTML = "";

  Object.entries(leagues).forEach(([key, name]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = name;
    select.appendChild(opt);
  });

  if(game.league.key){
    select.value = game.league.key;
  }
}

// =========================
// 🧾 HEADER
// =========================
function updateHeader(){

  const title = document.getElementById("gameTitle");
  const sub = document.getElementById("leagueTitle");

  if(title) title.innerText = game.player.name;

  if(sub){
    const league = game.league.key || "Keine Liga";
    const team = game.team.selected || "";
    sub.innerText = team ? `${league} • ${team}` : league;
  }
}

// =========================
// ▶️ MAIN ACTION FLOW
// =========================
function handleMainAction(){

  switch(game.phase){

    case "idle":
      startSeason();
      break;

    case "ready":
      simulateMatchday();
      break;

    case "halftime":
      resumeMatch();
      break;

    case "live":
      // Pause
      if(game.match){
        game.match.isRunning = false;
        game.phase = "halftime";
      }
      break;
  }

  updateMainButton();
}

// =========================
// 🔘 BUTTON TEXT
// =========================
function updateMainButton(){

  const btn = document.getElementById("mainActionBtn");
  if(!btn) return;

  if(game.phase === "idle")      btn.innerText = "▶ Liga starten";
  else if(game.phase === "ready")    btn.innerText = "▶ Spieltag";
  else if(game.phase === "halftime") btn.innerText = "▶ 2. Halbzeit";
  else if(game.phase === "live")     btn.innerText = "⏸ Pause";
}
