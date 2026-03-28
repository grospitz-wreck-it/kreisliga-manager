window.onload = async () => {

  initLeagueSelect();

  const loaded = await loadGame();

  if(loaded){
    updateMatchUI("Spielstand geladen");
  } else {
    updateMatchUI("Bereit");
  }
};
