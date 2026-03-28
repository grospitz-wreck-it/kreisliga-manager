window.onload = async () => {

  // UI initialisieren
  initLeagueSelect();
  bindUI();

  // 🔥 ERSTE LIGA AUTOMATISCH LADEN
  const firstLeague = Object.keys(LEAGUES)[0];

  if(firstLeague){
    document.getElementById("leagueSelect").value = firstLeague;
    selectLeague(firstLeague);
  }

  // Save laden
  const loaded = await loadGame();

  if(loaded){
    updateMatchUI("Spielstand geladen");
  } else {
    updateMatchUI("Bereit");
  }
};
