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
// GAME CONTEXT (FIXED)
// =====================
function getGameContext(){
  return {
    country: "DE",

    // 👉 entspricht deiner League-Struktur
    district: window.game?.league?.key || null,

    // 👉 GANZES OBJEKT!
    team: window.game?.team?.selected || null
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

  if(!c.start || !c.end) return true;

  const total = (c.end - c.start);
  const passed = (Date.now() - c.start);

  if(total <= 0) return true;

  const expected = (passed / total) * (c.impressionsBooked || 1);

  return (c.impressionsDelivered || 0) <= expected * 1.2;
}

// =====================
// TARGET MATCH (FIXED)
// =====================
function match(c, ctx){

  if(c.targeting?.team){
    return ctx.team && ctx.team.name === c.targeting.team;
  }

  if(c.targeting?.district){
    return ctx.district === c.targeting.district;
  }

  if(c.targeting?.state){
    return ctx.state === c.targeting.state;
  }

  if(c.targeting?.country){
    return true;
  }

  return true;
}

// =====================
// DELIVERY ENGINE (FIXED)
// =====================
function pickCampaign(campaigns){

  if(!campaigns.length) return null;

  return campaigns[Math.floor(Math.random() * campaigns.length)];
}

// =====================
// SERVE AD (FIXED)
// =====================
window.serveAd = function(){

  let campaigns = getCampaigns();
  const ctx = getGameContext();

  campaigns = campaigns.filter(c => {

    // 🔥 MUSS EIN BILD HABEN
    if(!c.image) return false;

    // Zeitraum
    if(c.start && Date.now() < c.start) return false;
    if(c.end && Date.now() > c.end) return false;

    // TKP Stop
    if(c.type === "TKP" && c.impressionsBooked){
      if((c.impressionsDelivered || 0) >= c.impressionsBooked){
        return false;
      }
    }

    // Pacing
    if(!shouldServe(c)) return false;

    // Targeting
    if(!match(c, ctx)) return false;

    return true;
  });

  if(!campaigns.length) return null;

  const selected = pickCampaign(campaigns);

  if(!selected) return null;

  // =====================
  // TRACKING
  // =====================
  selected.impressionsDelivered = (selected.impressionsDelivered || 0) + 1;

  if(selected.type === "TKP"){
    const cpm = selected.cpm || getCPM(selected.targeting || {});
    selected.spent = (selected.spent || 0) + (cpm / 1000);
  }

  // =====================
  // SAVE BACK
  // =====================
  const all = getCampaigns().map(c => 
    c.id === selected.id ? selected : c
  );

  saveCampaigns(all);

  return selected;
};

// =====================
// MULTI RENDER (NEU – STABIL)
// =====================
window.renderAds = function(){

  const track = document.getElementById("adTrack");
  if(!track) return;

  let html = "";

  for(let i = 0; i < 3; i++){

    const ad = serveAd();

    if(ad){

      const img = ad.image || "https://via.placeholder.com/200x80?text=Ad";

      html += `
        <div class="adItem">
          ${ad.link ? `<a href="${ad.link}" target="_blank">` : ""}
          <img src="${img}" style="height:60px;object-fit:contain">
          ${ad.link ? `</a>` : ""}
        </div>
      `;
    }
  }

  if(!html){
    html = "<span style='color:white'>Keine Werbung aktiv</span>";
  }

  track.innerHTML = html;
};

// =====================
// AUTO ROTATION
// =====================
setInterval(()=>{
  if(window.renderAds){
    renderAds();
  }
}, 4000);

// =====================
// INIT
// =====================
window.startAds = function(){
  if(window.adsInitialized) return;
  window.adsInitialized = true;

  console.log("📢 Ads gestartet (FULL)");

  renderAds();
};

// =====================
// GAME HOOKS
// =====================
window.onMatchStart = renderAds;
window.onHalftime = renderAds;
window.onMatchEnd = renderAds;

})();
