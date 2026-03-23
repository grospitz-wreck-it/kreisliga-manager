window.onload = function(){
   loadGameState();   // 🔥 HIER

   updateTable();
   if(selectedTeam){
   document.getElementById("selectedTeamText").innerText =
   "Dein Team: " + selectedTeam;
  }

  startAds();
  };

  
  // 🔥 Setup-Menü beim Start öffnen
  const setup = document.getElementById("setupPanel");
  if(setup){
    setup.classList.add("open");
  }

  // 🔥 League Select holen
  const select = document.getElementById("leagueSelect");

  // 🔥 Schutz – verhindert Absturz
  if(!select){
    console.error("leagueSelect nicht gefunden");
    return;
  }

  // 🔥 vorher leeren (wichtig bei Reloads)
  select.innerHTML = "";

  // 🔥 Ligen einfügen
  Object.keys(leagues).forEach(l => {
    let option = document.createElement("option");
    option.value = l;
    option.textContent = leagues[l];
    select.appendChild(option);
  });

  // 🔥 Werbung starten (sicher!)
  if(typeof startAds === "function"){
    startAds();
  } else {
    console.warn("Ads nicht geladen");
  }
};
