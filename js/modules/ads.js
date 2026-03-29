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

  return getCampaigns().filter(c => {

    if(c.start && now < c.start) return false;
    if(c.end && now > c.end) return false;

    if(c.targeting?.global) return true;

    if(c.targeting?.league === game.league.key) return true;

    if(c.targeting?.team){
      return c.targeting.team === game.team.selected || c.targeting.team === "all";
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

  renderAds();

  // 👉 alle 5s wechseln
  setInterval(rotateAds, 5000);

  // 👉 alle 20s neu laden (falls neue Kampagnen)
  setInterval(renderAds, 20000);
};
