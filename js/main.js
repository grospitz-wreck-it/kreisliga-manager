// =========================
// 🚀 INIT
// =========================
console.log("MAIN START");

window.onload = function(){

  loadGameState?.();

  initPlayer?.();
  initLeagueUI?.();

  bindUI();

  initFriendUI?.();

  updateHeader?.();
  updateMainButton?.();
  updateTable?.();
  loadLeaderboard?.();

  startAds?.();

  console.log("✅ App vollständig geladen");
};

  // 🔥 MAIN BUTTON FIX (Mobile + Desktop)
  const btn = document.getElementById("mainButton");

  if(btn){
    let lastTap = 0;

    function safeClick(){
      const now = Date.now();
      if(now - lastTap < 300) return;
      lastTap = now;

      handleMainAction();
    }

    btn.addEventListener("click", safeClick);
    btn.addEventListener("touchstart", safeClick);
  }

  console.log("✅ App vollständig geladen");
});


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
// ▶️ FLOW (ENGINE GESTEUERT)
// =========================
function handleMainAction(){

  console.log("🟡 Phase:", game.phase);

  switch(game.phase){

    case "idle":
      startSeason(); // 🔥 kommt aus ENGINE
      break;

    case "ready":
      simulateMatchday();
      break;

    case "halftime":
      resumeMatch();
      return;

    case "live":
      console.log("⛔ Spiel läuft bereits");
      return;
  }

  updateMainButton();
}


// =========================
// 🔘 BUTTON UI
// =========================
function updateMainButton(){

  const btn = document.getElementById("mainButton");
  if(!btn) return;

  btn.disabled = false;

  switch(game.phase){

    case "idle":
      btn.innerText = "▶ Saison starten";
      break;

    case "ready":
      btn.innerText = "▶ Nächstes Spiel";
      break;

    case "halftime":
      btn.innerText = "▶ 2. Halbzeit";
      break;

    case "live":
      btn.innerText = "⏳ Spiel läuft...";
      btn.disabled = true;
      break;
  }
}


// =========================
// ⚙️ SETUP PANEL
// =========================
function toggleSetup(){
  const panel = document.getElementById("setupPanel");
  const overlay = document.getElementById("overlay");

  panel.classList.add("open");
  overlay.classList.add("active");
}

function closeSetup(){
  const panel = document.getElementById("setupPanel");
  const overlay = document.getElementById("overlay");

  panel.classList.remove("open");
  overlay.classList.remove("active");
}
