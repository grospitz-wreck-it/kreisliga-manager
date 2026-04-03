(function(){

const KEY = "ad_v2";

// =====================
// STORAGE
// =====================
function getCampaigns(){
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function saveCampaigns(data){
  localStorage.setItem(KEY, JSON.stringify(data));
}

// =====================
// TARGETING UI (FIXED)
// =====================
window.updateTargetingUI = function(){

  const type = document.getElementById("targetType")?.value;
  const container = document.getElementById("targetFields");

  if(!container) return;

  container.innerHTML = "";

  // 👉 Liga
  if(type === "district"){
    container.innerHTML = `
      <select id="leagueSelectAds" onchange="loadTeamsForLeague()">
        <option value="">Liga wählen</option>
      </select>
    `;
    loadLeagues();
  }

  // 👉 Team
  if(type === "team"){
    container.innerHTML = `
      <select id="leagueSelectAds" onchange="loadTeamsForLeague()">
        <option value="">Liga wählen</option>
      </select>

      <select id="teamSelectAds">
        <option value="all">Alle Teams</option>
      </select>
    `;
    loadLeagues();
  }
};

// =====================
// LEAGUES LADEN
// =====================
function loadLeagues(){

  const select = document.getElementById("leagueSelectAds");

  if(!select || !window.LEAGUES) return;

  select.innerHTML = `<option value="">Liga wählen</option>`;

  Object.entries(LEAGUES).forEach(([key, league]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = league.name;
    select.appendChild(opt);
  });
}

// =====================
// TEAMS LADEN
// =====================
window.loadTeamsForLeague = function(){

  const leagueKey = document.getElementById("leagueSelectAds")?.value;
  const teamSelect = document.getElementById("teamSelectAds");

  if(!leagueKey || !teamSelect) return;

  const league = LEAGUES[leagueKey];
  if(!league) return;

  teamSelect.innerHTML = `<option value="all">Alle Teams</option>`;

  league.teams.forEach(team => {
    const opt = document.createElement("option");
    opt.value = team;
    opt.textContent = team;
    teamSelect.appendChild(opt);
  });
};

// =====================
// CREATE CAMPAIGN (FIXED)
// =====================
window.createCampaign = function(){

  const name = document.getElementById("name")?.value || "";
  const customer = document.getElementById("customer")?.value || "";
  const budget = Number(document.getElementById("budget")?.value || 0);
  const link = document.getElementById("link")?.value || "";

  const startRaw = document.getElementById("startDate")?.value;
  const endRaw = document.getElementById("endDate")?.value;

  const start = startRaw ? new Date(startRaw).getTime() : null;
  const end = endRaw ? new Date(endRaw).getTime() : null;

  const type = document.getElementById("targetType")?.value;

  const league = document.getElementById("leagueSelectAds")?.value || null;
  const team = document.getElementById("teamSelectAds")?.value || "all";

  const donationPercent = Number(document.getElementById("donation")?.value || 0);

  // 🔥 FIX: richtige ID
  const imageInput = document.getElementById("image");

  if(!imageInput || !imageInput.files[0]){
    alert("Bitte Bild hochladen");
    return;
  }

  const reader = new FileReader();

 reader.onload = function(e){

const img = new Image();

img.onload = function(){


const MAX_WIDTH = 320;
const MAX_HEIGHT = 90;

let width = img.width;
let height = img.height;

const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);

width = width * ratio;
height = height * ratio;

const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, width, height);

const resizedBase64 = canvas.toDataURL("image/jpeg", 0.8);

const campaign = {
  id: Date.now(),
  name,
  customer,
  budget,
  link,
  start,
  end,
  donationPercent,
  image: resizedBase64,
  impressionsDelivered: 0,
  spent: 0,
  targeting: {
    global: type === "global",
    league: type === "district" ? league : null,
    team: type === "team" ? team : null
  }
};


img.src = e.target.result;
};


const all = getCampaigns();
all.push(campaign);
saveCampaigns(all);

clearForm();
render();

alert("✅ Kampagne gespeichert (optimiert)");


};

img.src = e.target.result;
};


    const all = getCampaigns();
    all.push(campaign);
    saveCampaigns(all);

    clearForm();
    render();

    alert("✅ Kampagne gespeichert");
  };

  reader.readAsDataURL(imageInput.files[0]);
};

// =====================
// RESET FORM
// =====================
function clearForm(){

  ["name","customer","budget","link","startDate","endDate"].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.value = "";
  });

  const img = document.getElementById("image");
  if(img) img.value = "";

  document.getElementById("targetFields").innerHTML = "";
}

// =====================
// DELETE
// =====================
window.deleteCampaign = function(id){

  const all = getCampaigns().filter(c => c.id !== id);
  saveCampaigns(all);
  render();
};

// =====================
// HELPER
// =====================
function formatDate(ts){
  if(!ts) return "-";
  return new Date(ts).toLocaleDateString();
}

function getDuration(start, end){
  if(!start || !end) return "-";
  const days = Math.round((end - start) / (1000*60*60*24));
  return days + " Tage";
}

// =====================
// RENDER (FIXED)
// =====================
function render(){

  const container = document.getElementById("list"); // 🔥 FIX

  if(!container) return;

  const campaigns = getCampaigns();

  if(!campaigns.length){
    container.innerHTML = "<p>Keine Kampagnen</p>";
    return;
  }

  container.innerHTML = "";

  campaigns.forEach(c => {

    const donationAmount = (c.budget || 0) * ((c.donationPercent || 0)/100);

    const div = document.createElement("div");
    div.className = "adRow";

    div.innerHTML = `
      <div class="adLeft">
        <img src="${c.image}" />
        <div>
          <strong>${c.customer || "Kein Kunde"}</strong><br>
          Budget: ${c.budget}€<br>
          Zeitraum: ${formatDate(c.start)} - ${formatDate(c.end)}<br>
          Dauer: ${getDuration(c.start, c.end)}<br>
          Spende: ${c.donationPercent}% (${donationAmount.toFixed(2)}€)
        </div>
      </div>
      <button onclick="deleteCampaign(${c.id})">🗑️</button>
    `;

    container.appendChild(div);
  });
}

// =====================
// INIT
// =====================
window.onload = function(){
  render();
};

})();
