function bindUI(){

  console.log("🔗 bindUI aktiv");

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

  document.getElementById("menuBtn")
    ?.addEventListener("click", toggleSetup);

  document.getElementById("overlay")
    ?.addEventListener("click", closeSetup);

  document.getElementById("selectLeagueBtn")
    ?.addEventListener("click", selectLeague);

  document.getElementById("selectTeamBtn")
    ?.addEventListener("click", selectTeam);
}

// 🌍 EXPORT
window.bindUI = bindUI;
