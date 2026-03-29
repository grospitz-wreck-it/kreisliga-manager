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
    league: window.game?.league?.key || null,
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
