window.addEventListener("DOMContentLoaded", () => {

  initLeagueSelect();
  bindUI();

  const leagueSelect = document.getElementById("leagueSelect");

  if(leagueSelect.value){
    selectLeague(leagueSelect.value);
  }

});
