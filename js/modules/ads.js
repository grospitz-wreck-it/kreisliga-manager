(function(){

const KEY = "ad_v2";

// =====================
// 📦 STORAGE
// =====================
function getCampaigns(){
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function saveCampaigns(data){
  localStorage.setItem(KEY, JSON.stringify(data));
}

// =====================
// 🎮 GAME CONTEXT
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
// 💰 CPM LOGIK
// =====================
function getCPM(targeting){
  if(!targeting) return 1;

  if(targeting.type === "team") return 20;
  if(targeting.type === "district") return 10;
  if(targeting.type === "state") return 5;
  if(targeting.type === "country") return 2;

  return 1;
}

// =====================
// ⏱️ PACING
// =====================
function shouldServe(c){

  if(!c.start || !c.end) return true;

  const total = (c.end - c.start);
  const passed = (Date.now() - c.start);

  if(total <= 0) return true;

  const expected = (passed / total) * (c.impressionsBooked || 0);

  return (c.impressionsDelivered || 0) <= expected * 1.2;
}

// =====================
// 🎯 TARGET MATCH
// =====================
function match(c, ctx){

  const t = c.targeting;

  // 🔥 NEUES SYSTEM
  if(t && t.type){

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
// 🚚 DELIVERY ENGINE
// =====================
function serveAd(){

  let campaigns = getCampaigns();
  const ctx = getGameContext();

  campaigns = campaigns.filter(c => {

    // Zeitraum prüfen
    if(c.start && Date.now() < c.start) return false;
    if(c.end && Date.now() > c.end) return false;

    // TKP Limit
    const isTKP = c.type === "TKP" || c.typeCampaign === "TKP";

    if(isTKP && c.impressionsDelivered >= c.impressionsBooked){
      return false;
    }

    // Pacing
    if(!shouldServe(c)) return false;

    return true;
  });

  // Targeting anwenden
  campaigns = campaigns.filter(c => match(c, ctx));

  if(!campaigns.length) return null;

  // Zufällige Auswahl
  const c = campaigns[Math.floor(Math.random() * campaigns.length)];

  // Tracking
  c.impressionsDelivered = (c.impressionsDelivered || 0) + 1;

  const isTKP = c.type === "TKP" || c.typeCampaign === "TKP";

  if(isTKP){
    const cpm = c.cpm || getCPM(c.targeting);
    c.spent = (c.spent || 0) + (cpm / 1000);
  }

  // Speichern
  const all = getCampaigns().map(x => x.id === c.id ? c : x);
  saveCampaigns(all);

  return c;
}

// =====================
// 🖼️ RENDER (MULTI ADS)
// =====================
function renderAds(){

  const track = document.getElementById("adTrack");
  if(!track) return;

  let output = "";

  // 👉 Anzahl Ads gleichzeitig
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
// 🔁 AUTO ROTATION
// =====================
setInterval(renderAds, 4000);

// =====================
// 🚀 INIT
// =====================
window.startAds = function() {

  if (window.adsInitialized) return;
  window.adsInitialized = true;

  console.log("📢 Ads gestartet (FINAL)");

  renderAds();
};

// =====================
// 🎮 GAME HOOKS
// =====================
window.onMatchStart = renderAds;
window.onHalftime = renderAds;
window.onMatchEnd = renderAds;

})();
