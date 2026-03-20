window.onload = function(){

  const select = document.getElementById("leagueSelect");

  // 🔥 Schutz – verhindert kompletten Absturz
  if(!select){
    console.error("leagueSelect nicht gefunden");
    return;
  }

  // 🔥 vorher leeren (wichtig bei Reloads)
  select.innerHTML = "";

  Object.keys(leagues).forEach(l => {
    let option = document.createElement("option");
    option.value = l;
    option.textContent = leagues[l];
    select.appendChild(option);
  });

};
