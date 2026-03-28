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

window.bindUI = bindUI;
