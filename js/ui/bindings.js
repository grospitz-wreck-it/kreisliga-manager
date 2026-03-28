function bindUI(){

  const leagueSelect = document.getElementById("leagueSelect");
  const teamSelect = document.getElementById("teamSelect");
  const button = document.getElementById("mainButton");

  // =========================
  // 🏆 Liga wählen
  // =========================
  leagueSelect.addEventListener("change", (e) => {

    const key = e.target.value;

    selectLeague(key);
  });

  // =========================
  // 👕 Team wählen
  // =========================
  teamSelect.addEventListener("change", (e) => {

    const teamName = e.target.value;

    selectTeam(teamName);
  });

  // =========================
  // ▶️ Start Button
  // =========================
  button.addEventListener("click", () => {
    handleMainAction();
  });
}
document.getElementById("tacticSelect").addEventListener("change", (e) => {
  if(game.team.selected){
    game.team.selected.tactic = e.target.value;
  }
});
// =========================
// 🎮 TAKTIK ÄNDERN
// =========================
const tacticSelect = document.getElementById("tacticSelect");

if(tacticSelect){
  tacticSelect.addEventListener("change", (e) => {

    if(!game.team.selected){
      console.warn("❌ Kein Team ausgewählt");
      return;
    }

    game.team.selected.tactic = e.target.value;

    console.log("🧠 Neue Taktik:", game.team.selected.tactic);
  });
}
window.bindUI = bindUI;
