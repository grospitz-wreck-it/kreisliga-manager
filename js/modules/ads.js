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

  const track = document.getElementById("adTrack");
  if(!track) return;

  const ads = getMatchingAds();

  if(!ads.length){
    track.innerHTML = `<div class="adFallback">Keine Werbung</div>`;
    return;
  }

  // 👉 aktuelle Ad (Index rotierend)
  if(!window.__adIndex) window.__adIndex = 0;

  const ad = ads[window.__adIndex % ads.length];

  track.innerHTML = `
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

  renderAds();

  // 👉 alle 6 Sekunden wechseln
  setInterval(rotateAds, 6000);
};
