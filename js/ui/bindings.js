function bindUI(){

  console.log("🔗 bindUI aktiv");

  // =========================
  // ▶ MAIN BUTTON
  // =========================
  const mainBtn = document.getElementById("mainButton");

  if(mainBtn){
    mainBtn.addEventListener("click", () => {

      if(typeof window.handleMainAction === "function"){
        window.handleMainAction();
      } else {
        console.error("❌ handleMainAction fehlt");
      }

    });
  }


  // =========================
  // ☰ MENU
  // =========================
  document.getElementById("menuBtn")
    ?.addEventListener("click", toggleSetup);

  document.getElementById("overlay")
    ?.addEventListener("click", closeSetup);


  // =========================
  // 🏆 LEAGUE SELECT
  // =========================
  const leagueSelect = document.getElementById("leagueSelect");

  leagueSelect?.addEventListener("change", (e) => {

    const key = e.target.value;

    console.log("🏆 Liga gewählt:", key);

    if(typeof window.selectLeague === "function"){
      window.selectLeague(key);

      // 🔥 DIREKT UI UPDATEN
      populateTeamSelect?.();
      updateTable?.();
      updateHeader?.();

    } else {
      console.error("❌ selectLeague fehlt");
    }
  });


  // =========================
  // ⚽ TEAM SELECT
  // =========================
  const teamSelect = document.getElementById("teamSelect");

  teamSelect?.addEventListener("change", (e) => {

    const team = e.target.value;

    console.log("⚽ Team gewählt:", team);

    if(typeof window.selectTeam === "function"){
      window.selectTeam(team);

      updateHeader?.();

    } else {
      console.error("❌ selectTeam fehlt");
    }
  });


  // =========================
  // ⚡ SPEED BUTTONS
  // =========================
  document.querySelectorAll(".speedControl button")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        const val = Number(btn.innerText.replace("x",""));

        if(typeof window.setSpeed === "function"){
          window.setSpeed(val);
        }

      });

    });


  // =========================
  // 📑 TABS (TABELLE / SPIELPLAN)
  // =========================
  document.querySelectorAll(".tableTabs .tab").forEach(tab => {

    tab.addEventListener("click", () => {

      // Tabs reset
      document.querySelectorAll(".tableTabs .tab")
        .forEach(t => t.classList.remove("active"));

      tab.classList.add("active");

      // Inhalte
      document.querySelectorAll(".tabContent")
        .forEach(c => c.classList.remove("active"));

      const target = document.getElementById(tab.dataset.tab);
      target?.classList.add("active");

      // Spielplan rendern
      if(tab.dataset.tab === "scheduleTab"){
        renderSchedule?.();
      }

    });

  });

}
// 🌍 EXPORT
window.bindUI = bindUI;
