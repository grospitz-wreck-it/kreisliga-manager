// =========================
// 🔗 UI BINDINGS
// =========================
function bindUI(){

  const leagueSelect = document.getElementById("leagueSelect");
  const teamSelect = document.getElementById("teamSelect");
  const button = document.getElementById("mainButton");
  const tacticSelect = document.getElementById("tacticSelect");

  // 🏆 Liga wählen
  if(leagueSelect){
    leagueSelect.addEventListener("change", (e) => {
      selectLeague(e.target.value);
    });
  }

  // 👕 Team wählen
  if(teamSelect){
    teamSelect.addEventListener("change", (e) => {
      selectTeam(e.target.value);
    });
  }

  // ▶️ Start Button
  if(button){
    button.addEventListener("click", () => {
      handleMainAction();
    });
  }

  // 🧠 Taktik ändern (FIXED)
  if(tacticSelect){
    tacticSelect.addEventListener("change", (e) => {

      const team = getSelectedTeam?.();

      if(!team){
        console.warn("❌ Kein Team ausgewählt");
        return;
      }

      team.tactic = e.target.value;

      console.log("🧠 Neue Taktik:", team.tactic);
    });
  }
}


// =========================
// 🌍 GLOBAL (für alten Code)
// =========================
window.bindUI = bindUI;


// =========================
// 📦 EXPORT (WICHTIG!)
// =========================
export { bindUI };
