window.onload = function(){

  // =========================
  // 💾 SAVE LADEN
  // =========================
  if(typeof loadGameState === "function"){
    loadGameState();
  }

  // 🔥 STATE SYNC (WICHTIG!)
  if(window.__GAME_STATE__){
    window.__GAME_STATE__.teams = teams;
    window.__GAME_STATE__.schedule = schedule;
    window.__GAME_STATE__.currentMatchday = currentMatchday;
    window.__GAME_STATE__.selectedTeam = selectedTeam;
    window.__GAME_STATE__.matchdayResults = matchdayResults;
    window.__GAME_STATE__.liveScore = liveScore;
    window.__GAME_STATE__.currentMinute = currentMinute;
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

    // 🔒 nur locken wenn wirklich gewählt
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
    typeof liveScore.t1 === "object" && // 🔥 WICHTIG
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

};
