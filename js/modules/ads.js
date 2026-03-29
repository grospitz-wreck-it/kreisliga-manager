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
// GAME CONTEXT (ANPASSBAR)
// =====================
function getGameContext(){
  return {
    global: true,
    country: true,

    // 👉 später mit echten Daten verbinden
    state: window.currentState || null,
    district: window.currentDistrict || null,
    team: window.selectedTeam || null
  };
}

// =====================
// CPM LOGIK
// =====================
function getCPM(t){
  if(t.team) return 20;
  if(t.district) return 10;
  if(t.state) return 5;
  if(t.country) return 2;
  return 1;
}

// =====================
// PACING
// =====================
function shouldServe(c){
  const total = (c.end - c.start);
  const passed = (Date.now() - c.start);

  if(total <= 0) return true;

  const expected = (passed / total) * c.impressionsBooked;

  return c.impressionsDelivered <= expected * 1.2;
}

// =====================
// TARGET MATCH
// =====================
function match(c, ctx){

  if(c.targeting?.team) return !!ctx.team;
  if(c.targeting?.district) return !!ctx.district;
  if(c.targeting?.state) return !!ctx.state;
  if(c.targeting?.country) return !!ctx.country;

  return true;
}

// =====================
// DELIVERY ENGINE
// =====================
function serveAd(){

  let campaigns = getCampaigns();
  const ctx = getGameContext();

  campaigns = campaigns.filter(c => {

    // Zeitraum
    if(c.start && Date.now() < c.start) return false;
    if(c.end && Date.now() > c.end) return false;

    // TKP Stop
    if(c.type === "TKP" && c.impressionsDelivered >= c.impressionsBooked){
      return false;
    }

    // Pacing
    if(!shouldServe(c)) return false;

    return true;
  });

  // Targeting
  campaigns = campaigns.filter(c => match(c, ctx));

  if(!campaigns.length) return null;

  const c = campaigns[Math.floor(Math.random() * campaigns.length)];

  // Tracking
  c.impressionsDelivered = (c.impressionsDelivered || 0) + 1;

  if(c.type === "TKP"){
    c.spent = (c.spent || 0) + (c.cpm / 1000);
  }

  // speichern
  const all = getCampaigns().map(x => x.id === c.id ? c : x);
  saveCampaigns(all);

  return c;
}

// =====================
// RENDER (MULTI ADS)
// =====================
function renderAds(){

  const track = document.getElementById("adTrack");
  if(!track) return;

  let output = "";

  // 👉 Anzahl Ads gleichzeitig (wie vorher)
  for(let i=0;i<3;i++){
    const ad = serveAd();

    if(ad){
      output += `
        <div class="adItem">
          ${ad.link ? `<a href="${ad.link}" target="_blank">` : ""}
          <img src="${ad.image}">
          ${ad.link ? `</a>` : ""}
        </div>
      `;
    }
  }

  if(!output){
    output = "<span style='color:white'>Keine Werbung aktiv</span>";
  }

  track.innerHTML = output;
}

// =====================
// AUTO ROTATION
// =====================
setInterval(renderAds, 4000);

// =====================
// INIT (WICHTIG!)
// =====================
window.startAds = function() {
  if (window.adsInitialized) return;
  window.adsInitialized = true;

  console.log("📢 Ads gestartet (V2)");

  renderAds();
};

// =====================
// GAME HOOKS
// =====================
window.onMatchStart = function(){
  renderAds();
};

window.onHalftime = function(){
  renderAds();
};

window.onMatchEnd = function(){
  renderAds();
};

})();
