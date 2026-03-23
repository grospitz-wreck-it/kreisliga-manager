window.onload = function(){

  let playerId = localStorage.getItem("playerId");

if(!playerId){
  playerId = crypto.randomUUID();
  localStorage.setItem("playerId", playerId);
}
  
  // =========================
  // 💾 SAVE LADEN (JETZT RICHTIG!)
  // =========================
  if(typeof loadGameState === "function"){
    loadGameState(); // 🔥 DAS HAT GEFÄHLT!
  }

  // =========================
  // 🔥 SETUP PANEL
  // =========================
  const setup = document.getElementById("setupPanel");

  // 👉 nur öffnen wenn KEIN Team gewählt
  if(setup && !selectedTeam){
    setup.classList.add("open");
  }

  // =========================
  // 🏆 LEAGUE SELECT
  // =========================
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

  // =========================
  // 🔁 UI WIEDERHERSTELLEN
  // =========================

  if(selectedTeam){

    const label = document.getElementById("selectedTeamText");
    if(label){
      label.innerText = "Dein Team: " + selectedTeam;
    }

    const teamSelect = document.getElementById("teamSelect");
    const btn = document.getElementById("btnSelectTeam");

    if(teamSelect) teamSelect.disabled = true;
    if(btn) btn.disabled = true;
  }

  // =========================
  // 📊 TABELLE
  // =========================
  if(typeof updateTable === "function"){
    updateTable();
  }

  // =========================
  // 📅 SPIELTAG
  // =========================
  if(currentMatchday){
    const matchdayEl = document.getElementById("matchday");
    if(matchdayEl){
      matchdayEl.innerText =
        "Spieltag: " + currentMatchday + " / " + (schedule?.length || "?");
    }
  }

  // =========================
  // ▶️ MATCH RESUME (SAFE)
  // =========================
  if(
    liveScore &&
    liveScore.t1 &&
    typeof liveScore.t1 === "object" &&
    currentMinute > 0 &&
    currentMinute < 90
  ){
    console.log("▶️ Resume Match bei Minute", currentMinute);

    if(typeof simulateLiveMatch === "function"){
      simulateLiveMatch(
        liveScore.t1,
        liveScore.t2,
        liveScore.s1,
        liveScore.s2
      );
    }
  }

  // =========================
  // 📢 ADS STARTEN
  // =========================
  if(typeof startAds === "function"){
    startAds();
  } else {
    console.warn("Ads nicht geladen");
  }
if(typeof loadLeaderboard === "function"){
  loadLeaderboard();
}
};
