// =========================
// 📢 ADS ENGINE (CLEAN)
// =========================
import { game } from "../core/state.js";

// 🔥 WICHTIG: ganz oben!
const KEY = "ad_v2";

// =========================
// 📦 DATA
// =========================
function getCampaigns(){
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch(e){
    console.warn("❌ Ads konnten nicht geladen werden:", e);
    return [];
  }
}

// =========================
// 🎯 MATCHING
// =========================
function getMatchingAds(){

  const now = Date.now();
  const leagueKey = game.league?.key;
  const teamKey   = game.team?.selected;

  const campaigns = getCampaigns();

  if(!Array.isArray(campaigns)) return [];

  return campaigns.filter(c => {

    if(!c || typeof c !== "object") return false;

    const targeting = c.targeting || {};

    // 🕒 Zeitraum
    if(c.start && now < c.start) return false;
    if(c.end && now > c.end) return false;

    // 🌍 GLOBAL
    if(targeting.global) return true;

    // 👉 kein Spielstatus → alles anzeigen
    if(!leagueKey && !teamKey) return true;

    // 🏆 Liga
    if(targeting.league && targeting.league === leagueKey) return true;

    // 👕 Team
    if(targeting.team){
      if(targeting.team === "all") return true;
      if(targeting.team === teamKey) return true;
    }

    return false;
  });
}

// =========================
// 🔄 STATE
// =========================
let adIndex = 0;

// =========================
// 🎬 RENDER (iPhone SAFE)
// =========================
function renderAds(){

  const el = document.getElementById("adTrack");
  if(!el) return;

  const ads = getMatchingAds();

  // ❌ keine Ads
  if(!ads.length){
    el.innerHTML = `<div class="leaderboardAd">Keine Werbung</div>`;
    return;
  }

  // 👉 aktuelles Ad
  adIndex = adIndex % ads.length;
  const ad = ads[adIndex];

  // 👉 Container reset
  el.innerHTML = `<div class="leaderboardAd"></div>`;
  const wrapper = el.querySelector(".leaderboardAd");

  // 👉 Image (URL-basiert!)
  const img = document.createElement("img");
  img.src = ad.image; // 🔥 erwartet jetzt "ads/xyz.jpg"
  img.alt = "Ad";
  img.loading = "eager";

  // 👉 Klickbar
  if(ad.link){
    const a = document.createElement("a");
    a.href = ad.link;
    a.target = "_blank";
    a.appendChild(img);
    wrapper.appendChild(a);
  } else {
    wrapper.appendChild(img);
  }

  console.log("📢 Ad gerendert:", ad.name || ad.id);
}

// =========================
// 🔄 ROTATION
// =========================
function rotateAds(){

  const ads = getMatchingAds();
  if(!ads.length) return;

  adIndex = (adIndex + 1) % ads.length;
  renderAds();
}

// =========================
// 🚀 ENGINE
// =========================
function startAdEngine(){

  console.log("📢 Ads Engine gestartet");

  // 👉 initial
  renderAds();

  // 👉 Rotation
  setInterval(rotateAds, 8000);

  // 👉 Resize (iPhone fix)
  window.addEventListener("resize", renderAds);
}

// =========================
// 📦 EXPORTS
// =========================
export {
  startAdEngine,
  renderAds,
  getMatchingAds
};
