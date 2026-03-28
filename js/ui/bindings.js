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
const leagueSelect = document.getElementById("leagueSelect");

leagueSelect?.addEventListener("change", (e) => {
  const key = e.target.value;

  console.log("🏆 Liga gewählt:", key);

  if(typeof window.selectLeague === "function"){
    window.selectLeague(key);
  } else {
    console.error("❌ selectLeague fehlt");
  }
});
// 🌍 EXPORT
window.bindUI = bindUI;
