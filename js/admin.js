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
// TARGETING UI
// =====================
window.updateTargetingUI = function(){

  const type = document.getElementById("targetingType")?.value;

  const leagueWrap = document.getElementById("leagueWrap");
  const teamWrap = document.getElementById("teamWrap");

  if(leagueWrap) leagueWrap.style.display = "none";
  if(teamWrap) teamWrap.style.display = "none";

  if(type === "league"){
    if(leagueWrap) leagueWrap.style.display = "block";
  }

  if(type === "team"){
    if(leagueWrap) leagueWrap.style.display = "block";
    if(teamWrap) teamWrap.style.display = "block";
  }
};

// =====================
// LEAGUES LADEN
// =====================
function loadLeagues(){

  const select = document.getElementById("leagueSelectAds");

  if(!select){
    console.error("❌ leagueSelectAds fehlt im HTML");
    return;
  }

  if(!window.LEAGUES){
    console.error("❌ LEAGUES nicht geladen");
    return;
  }

  select.innerHTML = `<option value="">Liga wählen</option>`;

  Object.entries(LEAGUES).forEach(([key, league]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = league.name;
    select.appendChild(opt);
  });

  console.log("✅ Ligen geladen");
}

// =====================
// TEAMS LADEN
// =====================
window.loadTeamsForLeague = function(){

  const leagueKey = document.getElementById("leagueSelectAds")?.value;
  const teamSelect = document.getElementById("teamSelectAds");

  if(!leagueKey){
    console.warn("⚠️ Keine Liga gewählt");
    return;
  }

  if(!teamSelect){
    console.error("❌ teamSelectAds fehlt");
    return;
  }

  const league = LEAGUES[leagueKey];

  if(!league){
    console.error("❌ Liga nicht gefunden:", leagueKey);
    return;
  }

  teamSelect.innerHTML = `<option value="all">Alle Teams</option>`;

  league.teams.forEach(team => {
    const opt = document.createElement("option");
    opt.value = team;
    opt.textContent = team;
    teamSelect.appendChild(opt);
  });

  console.log("✅ Teams geladen:", league.teams.length);
};

// =====================
// CREATE CAMPAIGN
// =====================
window.createCampaign = function(){

  const name = document.getElementById("name")?.value || "";
  const customer = document.getElementById("customer")?.value || "";
  const budget = Number(document.getElementById("budget")?.value || 0);
  const link = document.getElementById("link")?.value || "";

  const start = new Date(document.getElementById("startDate")?.value).getTime();
  const end = new Date(document.getElementById("endDate")?.value).getTime();

  const type = document.getElementById("targetingType")?.value;
  const league = document.getElementById("leagueSelectAds")?.value;
  const team = document.getElementById("teamSelectAds")?.value;

  const donationPercent = Number(document.getElementById("donation")?.value || 0);

  const imageInput = document.getElementById("imageUpload");

  if(!imageInput || !imageInput.files[0]){
    alert("Bitte Bild hochladen");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e){

    const campaign = {
      id: Date.now(),
      name,
      customer,
      budget,
      link,
      start,
      end,
      donationPercent,
      image: e.target.result,
      impressionsDelivered: 0,
      spent: 0,
      targeting: {
        global: type === "global",
        league: type === "league" ? league : null,
        team: type === "team" ? team : null
      }
    };

    const all = getCampaigns();
    all.push(campaign);
    saveCampaigns(all);

    clearForm();
    render();
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

  const img = document.getElementById("imageUpload");
  if(img) img.value = "";
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
  const d = new Date(ts);
  return d.toLocaleDateString();
}

function getDuration(start, end){
  if(!start || !end) return "-";
  const days = Math.round((end - start) / (1000*60*60*24));
  return days + " Tage";
}

// =====================
// RENDER
// =====================
function render(){

  const container = document.getElementById("campaignList");
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
      <img src="${c.image}" />
      <div>
        <strong>${c.customer || "Kein Kunde"}</strong><br>
        Budget: ${c.budget}€<br>
        Zeitraum: ${formatDate(c.start)} - ${formatDate(c.end)}<br>
        Dauer: ${getDuration(c.start, c.end)}<br>
        Spende: ${c.donationPercent}% (${donationAmount.toFixed(2)}€)
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
  loadLeagues();
  render();
};

})();
