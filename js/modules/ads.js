// =========================
// 📦 STORAGE
// =========================
function getCampaigns(){
  return JSON.parse(localStorage.getItem("ad_v2") || "[]");
}

// =========================
// 🎯 MATCHING
// =========================
function getMatchingAds(){

  const now = Date.now();

  const leagueKey = window.game?.league?.key;
  const teamKey   = window.game?.team?.selected;

  return getCampaigns().filter(c => {

    // 🕒 Zeitraum
    if(c.start && now < c.start) return false;
    if(c.end && now > c.end) return false;

    // 🌍 GLOBAL (immer anzeigen)
    if(c.targeting?.global) return true;

    // ⚠️ WENN KEIN GAME GESETZT → trotzdem anzeigen!
    if(!leagueKey && !teamKey) return true;

    // 🏆 LIGA
    if(c.targeting?.league && c.targeting.league === leagueKey) return true;

    // 👕 TEAM
    if(c.targeting?.team){
      if(c.targeting.team === "all") return true;
      if(c.targeting.team === teamKey) return true;
    }

    return false;
  });
}

// =========================
// 🎬 RENDER
// =========================
let currentIndex = 0;
let adsCache = [];

function renderAds(){

  const track = document.getElementById("adTrack");
  if(!track) return;

  const ads = getMatchingAds();

  if(!ads.length){
    track.innerHTML = `<div style="color:#fff">Keine Werbung</div>`;
    return;
  }

  // 🔥 loop für smooth scroll
  const loop = [...ads, ...ads];

  track.innerHTML = `
    <div class="adSlider">
      ${loop.map(ad => `
        <div class="adSlide">
          ${ad.link ? `<a href="${ad.link}" target="_blank">` : ""}
            <img src="${ad.image || 'https://via.placeholder.com/300x70?text=Ad'}">
          ${ad.link ? `</a>` : ""}
        </div>
      `).join("")}
    </div>
  `;
}
// =========================
// 🔁 ROTATION
// =========================
function rotateAds(){

  const slider = document.querySelector(".adsSlider");
  if(!slider || adsCache.length <= 1) return;

  currentIndex++;

  if(currentIndex >= adsCache.length){
    currentIndex = 0;
  }

  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// =========================
// 🚀 ENGINE
// =========================
window.startAdEngine = function(){

  console.log("📢 Ad Engine gestartet");

  const waitForGame = setInterval(() => {

    if(!window.game){
      console.log("⏳ warte auf game...");
      return;
    }

    clearInterval(waitForGame);

    console.log("✅ game erkannt → starte ads");

    renderAds();

    setInterval(rotateAds, 5000);
    setInterval(renderAds, 20000);

  }, 500);
};
window.serveAd = function(){
  return getMatchingAds();
};
