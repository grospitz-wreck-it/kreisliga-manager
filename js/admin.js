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
// 🎮 GAME CONTEXT (NEU)
// =====================
function getGameContext(){
  return {
    country: "Deutschland", // default
    state: window.currentState || null,
    league: window.currentLeagueId || null,
    team: window.currentTeamId || null
  };
}

// =====================
// CPM LOGIK (BLEIBT)
// =====================
function getCPM(t){
  if(t?.type === "team") return 20;
  if(t?.type === "district") return 10;
  if(t?.type === "state") return 5;
  if(t?.type === "country") return 2;
  return 1;
}

// =====================
// PACING (BLEIBT)
// =====================
function shouldServe(c){
  const total = (c.end - c.start);
  const passed = (Date.now() - c.start);

  if(total <= 0) return true;

  const expected = (passed / total) * (c.impressionsBooked || 0);

  return (c.impressionsDelivered || 0) <= expected * 1.2;
}

// =====================
// 🎯 TARGET MATCH (NEU + ALT SUPPORT)
// =====================
function match(c, ctx){

  const t = c.targeting;

  // 🔥 NEUES SYSTEM
  if(t?.type){

    if(t.type === "global") return true;

    if(t.type === "country"){
      return ctx.country === t.value;
    }

    if(t.type === "state"){
      return ctx.state === t.value;
    }

    if(t.type === "district"){
      return ctx.league === t.league;
    }

    if(t.type === "team"){
      return ctx.team === t.team;
    }
  }

  // 🧯 FALLBACK (ALTES SYSTEM)
  if(t?.team) return !!ctx.team;
  if(t?.district) return !!ctx.league;
  if(t?.state) return !!ctx.state;
  if(t?.country) return !!ctx.country;

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
    if((c.type === "TKP" || c.typeCampaign === "TKP") &&
       c.impressionsDelivered >= c.impressionsBooked){
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

  const isTKP = c.type === "TKP" || c.typeCampaign === "TKP";

  if(isTKP){
    const cpm = c.cpm || getCPM(c.targeting);
    c.spent = (c.spent || 0) + (cpm / 1000);
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
// INIT
// =====================
window.startAds = function() {
  if (window.adsInitialized) return;
  window.adsInitialized = true;

  console.log("📢 Ads gestartet (V3)");

  renderAds();
};

// =====================
// 🎮 GAME HOOKS
// =====================
window.onMatchStart = renderAds;
window.onHalftime = renderAds;
window.onMatchEnd = renderAds;

})();
