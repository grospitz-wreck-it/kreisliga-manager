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

  const el = document.getElementById("adTrack");
  if(!el) return;

  adsCache = getMatchingAds();

  if(!adsCache.length){
    el.innerHTML = `<div style="color:#fff">Keine Werbung</div>`;
    return;
  }

  el.innerHTML = `
    <div class="adsSlider">
      ${adsCache.map(a => `
        <div class="adSlide">
          ${a.link ? `<a href="${a.link}" target="_blank">` : ""}
            <img src="${a.image}">
          ${a.link ? `</a>` : ""}
        </div>
      `).join("")}
    </div>
  `;

  currentIndex = 0;
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
