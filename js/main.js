window.onload = function(){

  // =========================
  // 💾 SAVE LADEN
  // =========================
  function loadGameState(){

  const saved = localStorage.getItem("gameState");

  if(!saved){
    console.log("Kein Save gefunden");
    return;
  }

  try{
    const state = JSON.parse(saved);

    // 🔥 WICHTIG: Arrays NICHT ersetzen
    if(state.teams){
      teams.length = 0;
      teams.push(...state.teams);
    }

    if(state.schedule){
      schedule.length = 0;
      schedule.push(...state.schedule);
    }

    currentMatchday = state.currentMatchday || 0;
    selectedTeam = state.selectedTeam || null;
    matchdayResults = state.matchdayResults || [];

    liveScore = state.liveScore || { t1:null, t2:null, s1:0, s2:0 };
    currentMinute = state.currentMinute || 0;

    console.log("📦 Game geladen", state);

  } catch(e){
    console.error("Save kaputt:", e);
  }
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
