(function(){

const KEY = "ad_v2";

let campaigns = [];
let editId = null;

// =====================
// STORAGE
// =====================
function load(){
  campaigns = JSON.parse(localStorage.getItem(KEY) || "[]");
}

function save(){
  localStorage.setItem(KEY, JSON.stringify(campaigns));
}

// =====================
// IMAGE
// =====================
function readImage(file){
  return new Promise(resolve=>{
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// =====================
// TARGETING UI
// =====================
window.updateTargetingUI = function(){

  const type = document.getElementById("targetType").value;

  document.getElementById("leagueWrap").style.display = "none";
  document.getElementById("teamWrap").style.display = "none";

  if(type === "league"){
    document.getElementById("leagueWrap").style.display = "block";
    fillLeagues();
  }

  if(type === "team"){
    document.getElementById("leagueWrap").style.display = "block";
    document.getElementById("teamWrap").style.display = "block";
    fillLeagues();
  }
};

// =====================
// LEAGUES
// =====================
function fillLeagues(){

  const select = document.getElementById("leagueSelectAdmin");
  select.innerHTML = `<option value="">Liga wählen</option>`;

  Object.keys(window.LEAGUES || {}).forEach(key=>{
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = window.LEAGUES[key].name;
    select.appendChild(opt);
  });
}

window.onLeagueChange = function(){

  const leagueKey = document.getElementById("leagueSelectAdmin").value;
  const teamSelect = document.getElementById("teamSelectAdmin");

  teamSelect.innerHTML = `<option value="ALL">Alle Teams</option>`;

  if(!leagueKey) return;

  const league = window.LEAGUES[leagueKey];

  league.teams.forEach(t=>{
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    teamSelect.appendChild(opt);
  });
};

// =====================
// CREATE / UPDATE
// =====================
window.createCampaign = async function(){

  const name = document.getElementById("name").value;
  const customer = document.getElementById("customer").value;
  const link = document.getElementById("link").value;
  const budget = parseFloat(document.getElementById("budget").value) || 0;

  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  const targetType = document.getElementById("targetType").value;
  const league = document.getElementById("leagueSelectAdmin").value;
  const team = document.getElementById("teamSelectAdmin").value;

  const file = document.getElementById("imageUpload").files[0];

  let image = "";

  if(editId){
    const existing = campaigns.find(c => c.id === editId);
    image = existing?.image || "";
  }

  if(file){
    image = await readImage(file);
  }

  if(!image){
    alert("Bitte Bild hochladen");
    return;
  }

  const targeting = {};

  if(targetType === "global"){
    targeting.country = true;
  }

  if(targetType === "league"){
    targeting.district = league;
  }

  if(targetType === "team"){
    targeting.district = league;
    if(team !== "ALL"){
      targeting.team = team;
    }
  }

  const campaign = {
    id: editId || Date.now(),
    name,
    customer,
    link,
    budget,
    image,
    targeting,
    start: start ? new Date(start).getTime() : null,
    end: end ? new Date(end).getTime() : null,
    impressionsDelivered: 0
  };

  if(editId){
    campaigns = campaigns.map(c => c.id === editId ? campaign : c);
  } else {
    campaigns.push(campaign);
  }

  save();
  clearForm();
  render();

  editId = null;
};

// =====================
// DELETE
// =====================
window.deleteCampaign = function(id){
  campaigns = campaigns.filter(c => c.id !== id);
  save();
  render();
};

// =====================
// EDIT
// =====================
window.editCampaign = function(id){

  const c = campaigns.find(x => x.id === id);
  if(!c) return;

  editId = id;

  document.getElementById("name").value = c.name;
  document.getElementById("customer").value = c.customer;
  document.getElementById("link").value = c.link;
  document.getElementById("budget").value = c.budget;

  if(c.start){
    document.getElementById("startDate").value = new Date(c.start).toISOString().split("T")[0];
  }

  if(c.end){
    document.getElementById("endDate").value = new Date(c.end).toISOString().split("T")[0];
  }

  if(c.targeting?.team){
    document.getElementById("targetType").value = "team";
    updateTargetingUI();
    document.getElementById("leagueSelectAdmin").value = c.targeting.district;
    onLeagueChange();
    document.getElementById("teamSelectAdmin").value = c.targeting.team;
  }
};

// =====================
// CLEAR
// =====================
function clearForm(){
  document.querySelectorAll("input").forEach(i=>i.value="");
}

// =====================
// RENDER
// =====================
function render(){

  const box = document.getElementById("campaignList");
  box.innerHTML = "";

  campaigns.forEach(c=>{

    const div = document.createElement("div");
    div.className = "adRow";

    const duration = (c.start && c.end)
      ? Math.ceil((c.end - c.start) / (1000*60*60*24)) + " Tage"
      : "-";

    div.innerHTML = `
      <img src="${c.image}" style="height:60px">
      <div>
        <b>${c.customer}</b><br>
        Budget: ${c.budget}€<br>
        Laufzeit: ${duration}
      </div>
      <button onclick="editCampaign(${c.id})">✏️</button>
      <button onclick="deleteCampaign(${c.id})">❌</button>
    `;

    box.appendChild(div);
  });
}

// =====================
// INIT
// =====================
window.onload = function(){
  load();
  render();
};

})();
