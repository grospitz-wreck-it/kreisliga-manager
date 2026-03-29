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
// GAME CONTEXT
// =====================
function getGameContext(){
  return {
    country: "DE",
    state: null,
    district: window.game?.league?.key || null,

    // ❗ GANZES OBJEKT, NICHT .name
    team: window.game?.team?.selected || null
  };
}
// =====================
// MATCHING (FIXED)
// =====================
function match(c, ctx){

  if(!c.targeting) return true;

  const t = c.targeting;

  if(t.type === "global") return true;

  if(t.type === "district"){
    return t.league === ctx.league;
  }

  if(t.type === "team"){

    // ganze Liga
    if(!t.team){
      return t.league === ctx.league;
    }

    // einzelnes Team
    return (
      t.league === ctx.league &&
      t.team === ctx.team
    );
  }

  return true;
}

// =====================
// ENGINE
// =====================
function serveAd(){

  let campaigns = getCampaigns();
  const ctx = getGameContext();

  campaigns = campaigns.filter(c => {

    if(c.start && Date.now() < c.start) return false;
    if(c.end && Date.now() > c.end) return false;

    if(c.type === "TKP" &&
       c.impressionsDelivered >= c.impressionsBooked){
      return false;
    }

    return true;
  });

  campaigns = campaigns.filter(c => match(c, ctx));

  if(!campaigns.length) return null;

  const c = campaigns[Math.floor(Math.random() * campaigns.length)];

  c.impressionsDelivered = (c.impressionsDelivered || 0) + 1;

  if(c.type === "TKP"){
    c.spent = (c.spent || 0) + (c.cpm / 1000);
  }

  const updated = getCampaigns().map(x =>
    x.id === c.id ? c : x
  );

  saveCampaigns(updated);

  return c;
}

// =====================
// RENDER
// =====================
function renderAds(){

  const track = document.getElementById("adTrack");
  if(!track) return;

  let campaigns = getCampaigns();
  const ctx = getGameContext();

  // 🔥 Filter wie in serveAd – aber OHNE Verbrauch
  campaigns = campaigns.filter(c => {

    if(c.start && Date.now() < c.start) return false;
    if(c.end && Date.now() > c.end) return false;

    if(c.type === "TKP" &&
       c.impressionsDelivered >= c.impressionsBooked){
      return false;
    }

    return match(c, ctx);
  });

  if(!campaigns.length){
    track.innerHTML = "<span style='color:white'>Keine Werbung aktiv</span>";
    return;
  }

  // 👉 max 3 anzeigen
  const selected = campaigns.slice(0,3);

  let output = "";

  selected.forEach(c => {

    const imgSrc = c.image || "https://via.placeholder.com/200x80?text=Ad";

    output += `
      <div class="adItem">
        ${c.link ? `<a href="${c.link}" target="_blank">` : ""}
        <img src="${imgSrc}" style="max-height:80px;">
        ${c.link ? `</a>` : ""}
      </div>
    `;

    // 👉 Tracking HIER statt in serveAd
    c.impressionsDelivered = (c.impressionsDelivered || 0) + 1;

    if(c.type === "TKP"){
      c.spent = (c.spent || 0) + (c.cpm / 1000);
    }
  });

  saveCampaigns(campaigns);

  track.innerHTML = output;
}
// =====================
// INIT
// =====================
window.startAds = function(){

  if(window.adsInitialized) return;
  window.adsInitialized = true;

  console.log("📢 Ads gestartet");

  renderAds();
  setInterval(renderAds, 4000);
};

})();
