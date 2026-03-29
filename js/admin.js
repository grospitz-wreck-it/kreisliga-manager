const KEY = "ad_v2";

/* =====================
   GLOBAL (für HTML)
===================== */
window.updateTargetingUI = updateTargetingUI;
window.createCampaign = createCampaign;
window.del = del;

/* =====================
   STORAGE
===================== */
function getData(){
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function saveData(data){
  localStorage.setItem(KEY, JSON.stringify(data));
}

/* =====================
   TARGETING UI
===================== */
function updateTargetingUI(){

  const type = document.getElementById("targetType").value;
  const container = document.getElementById("targetFields");

  container.innerHTML = "";

  if(type === "district"){
    container.innerHTML = `<select id="leagueSelect"></select>`;
    loadLeagues();
  }

  if(type === "team"){
    container.innerHTML = `
      <select id="leagueSelect"></select>
      <select id="teamSelect"></select>
    `;
    loadLeagues(true);
  }
}

/* =====================
   LEAGUES
===================== */
function loadLeagues(withTeams=false){

  if(!window.LEAGUES){
    console.error("❌ league.js nicht geladen");
    alert("league.js fehlt!");
    return;
  }

  const leagueSelect = document.getElementById("leagueSelect");
  const teamSelect = document.getElementById("teamSelect");

  leagueSelect.innerHTML = `<option value="">Liga wählen</option>`;

  Object.keys(LEAGUES).forEach(key => {

    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = LEAGUES[key].name;

    leagueSelect.appendChild(opt);
  });

  if(withTeams){

    leagueSelect.onchange = () => {

      teamSelect.innerHTML = `<option value="">Team wählen</option>`;

      const league = LEAGUES[leagueSelect.value];
      if(!league) return;

      league.teams.forEach(team => {

        const name = typeof team === "string" ? team : team.name;

        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;

        teamSelect.appendChild(opt);
      });
    };
  }
}

/* =====================
   CREATE CAMPAIGN
===================== */
function createCampaign(){

  const file = document.getElementById("image").files[0];
  if(!file) return alert("Bild fehlt");

  const reader = new FileReader();

  reader.onload = function(e){

    const type = document.getElementById("targetType").value;

    let targeting = { type };

    if(type === "district"){
      targeting.league = document.getElementById("leagueSelect")?.value;
    }

    if(type === "team"){
      targeting.league = document.getElementById("leagueSelect")?.value;
      targeting.team = document.getElementById("teamSelect")?.value;
    }

    const budget = parseFloat(document.getElementById("budget").value) || 0;
    const donationPercent = parseInt(document.getElementById("donation").value) || 0;

    const start = new Date(document.getElementById("startDate").value || Date.now()).getTime();
    const end = new Date(document.getElementById("endDate").value || Date.now()+30*86400000).getTime();

    const campaign = {
      id: Date.now(),

      name: document.getElementById("name").value,
      customer: document.getElementById("customer").value,
      link: document.getElementById("link").value,

      budget,
      spent: 0,

      type: document.getElementById("typeCampaign").value,

      cpm: 5,
      impressionsBooked: (budget/5)*1000,
      impressionsDelivered: 0,

      donationPercent,
      donationAmount: budget * (donationPercent/100),

      targeting,
      start,
      end,

      image: e.target.result
    };

    const data = getData();
    data.push(campaign);
    saveData(data);

    console.log("✅ gespeichert", campaign);

    render();
    resetForm();
  };

  reader.readAsDataURL(file);
}

/* =====================
   RESET
===================== */
function resetForm(){
  document.querySelectorAll("input").forEach(i=>{
    if(i.type !== "file") i.value = "";
  });
  document.getElementById("donation").value = "0";
}

/* =====================
   RENDER
===================== */
function render(){

  const list = document.getElementById("list");
  list.innerHTML = "";

  getData().forEach(c => {

    const div = document.createElement("div");
    div.className = "adRow";

    div.innerHTML = `
      <div>
        <img src="${c.image}">
        <b>${c.name}</b><br>
        ${c.customer}<br>
        💚 ${c.donationPercent}% (€${c.donationAmount.toFixed(2)})
      </div>

      <button onclick="del(${c.id})">❌</button>
    `;

    list.appendChild(div);
  });
}

/* =====================
   DELETE
===================== */
function del(id){

  if(!confirm("Löschen?")) return;

  let data = getData();
  data = data.filter(x => x.id !== id);

  saveData(data);
  render();
}

/* =====================
   INIT
===================== */
window.onload = function(){
  render();
};
