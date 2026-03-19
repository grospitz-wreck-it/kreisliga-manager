window.onload = function () {

  let leagueSelect = document.getElementById("leagueSelect");

  Object.keys(leagues).forEach(l => {
    let o = document.createElement("option");
    o.value = l;
    o.textContent = l;
    leagueSelect.appendChild(o);
  });

  document.getElementById("matchday").innerText =
    "Spieltag: 0 / 0";
};
