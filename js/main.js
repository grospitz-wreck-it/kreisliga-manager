window.onload = function(){

  // =========================
  // 💾 SAVE LADEN
  // =========================
  if(typeof loadGameState === "function"){
    loadGameState();
  }

  // =========================
  // 🔥 SETUP PANEL
  // =========================
  const setup = document.getElementById("setupPanel");
  if(setup){
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

  // neu befüllen (wichtig bei Reload)
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

  // Team anzeigen
if(selectedTeam){
  document.getElementById("selectedTeamText").innerText =
    "Dein Team: " + selectedTeam;
}

    // UI sperren wie vorher
    const teamSelect = document.getElementById("teamSelect");
    const btn = document.getElementById("btnSelectTeam");

    if(teamSelect) teamSelect.disabled = true;
    if(btn) btn.disabled = true;
  

  // Tabelle aktualisieren
  if(typeof updateTable === "function"){
    updateTable();
  }

  // Spieltag anzeigen
  if(currentMatchday){
    const matchdayEl = document.getElementById("matchday");
    if(matchdayEl){
      matchdayEl.innerText =
        "Spieltag: " + currentMatchday + " / " + (schedule?.length || "?");
    }
  }

  // =========================
  // ▶️ OPTIONAL: LIVE MATCH RESUME
  // =========================
  if(liveScore && currentMinute > 0 && currentMinute < 90){

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

};
