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
// 🎬 RENDER LEADERBOARD
// =========================
function renderAds(){

  const el = document.getElementById("adTrack");
  if(!el) return;

  const ads = getMatchingAds();

  if(!ads.length){
    el.innerHTML = `<div class="leaderboardAd" style="color:#fff">Keine Werbung</div>`;
    return;
  }

  // 👉 nur eine Ad gleichzeitig für echtes Leaderboard
  const ad = ads[Math.floor(Math.random() * ads.length)];

  el.innerHTML = `
    <div class="leaderboardAd">
      ${ad.link ? `<a href="${ad.link}" target="_blank">` : ""}
        <img src="${ad.image}">
      ${ad.link ? `</a>` : ""}
    </div>
  `;
}

// =========================
// 🔄 ROTATION
// =========================
function rotateAds(){
  const ads = getMatchingAds();
  if(!ads.length) return;

  window.__adIndex = (window.__adIndex || 0) + 1;

  renderAds();
}

// =========================
// 🚀 ENGINE
// =========================
window.startAdEngine = function(){

  console.log("📢 Leaderboard Ads gestartet");

  // 🔥 SOFORT erstes Ad rendern
  renderAds();

  // 🔄 regelmäßig neu laden
  setInterval(renderAds, 10000);

  // 🔄 Rotation (falls mehrere Ads)
  setInterval(rotateAds, 6000);
};
