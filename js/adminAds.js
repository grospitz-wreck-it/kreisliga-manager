(function(){

const STORAGE_KEY = "kreisliga_ads";

// =====================
// LOAD ADS (DEIN SYSTEM)
// =====================
function getAds(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// =====================
// FILTER (DATUM)
// =====================
function getActiveAds(){

  const ads = getAds();
  const today = new Date().toISOString().split("T")[0];

  return ads.filter(ad => {
    if (ad.start && ad.start > today) return false;
    if (ad.end && ad.end < today) return false;
    return true;
  });
}

// =====================
// RENDER (MEHRERE ADS)
// =====================
function renderAds(){

  const track = document.getElementById("adTrack");
  if(!track) return;

  let ads = getActiveAds();

  if(!ads.length){
    track.innerHTML = "<span style='color:white'>Keine Werbung aktiv</span>";
    return;
  }

  // 🔥 Zufällige Ads mischen
  ads = ads.sort(() => 0.5 - Math.random());

  // 👉 max 3 anzeigen
  const selected = ads.slice(0, 3);

  let html = "";

  selected.forEach(ad => {
    html += `
      <div class="adItem">
        ${ad.link ? `<a href="${ad.link}" target="_blank">` : ""}
        <img src="${ad.image}">
        ${ad.link ? `</a>` : ""}
      </div>
    `;
  });

  track.innerHTML = html;
}

// =====================
// AUTO ROTATION
// =====================
setInterval(renderAds, 4000);

// =====================
// INIT
// =====================
window.startAds = function(){
  if(window.adsInitialized) return;
  window.adsInitialized = true;

  console.log("📢 Ads gestartet (Legacy System)");

  renderAds();
};

// =====================
// GAME HOOKS
// =====================
window.onMatchStart = renderAds;
window.onHalftime = renderAds;
window.onMatchEnd = renderAds;

})();
