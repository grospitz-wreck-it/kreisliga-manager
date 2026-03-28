function bindUI(){

  document.getElementById("mainButton")
    .addEventListener("click", handleMainAction);

  document.getElementById("leagueSelect")
    .addEventListener("change", (e) => {
      selectLeague(e.target.value);
    });

  document.getElementById("teamSelect")
    .addEventListener("change", (e) => {
      selectTeam(e.target.value);
    });
}

window.bindUI = bindUI;
