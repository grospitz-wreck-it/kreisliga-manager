// =========================
// 📢 ADS ENGINE (SERVER VERSION)
// =========================

import { game } from "../core/state.js";

const ADS_URL = "/kreisliga-manager/ads/ads.json";

// =========================
// 📦 FETCH ADS (SERVER)
// =========================
let campaignsCache = [];

async function loadCampaigns(){
  try{
    const res = await fetch(ADS_URL + "?t=" + Date.now()); // 🔥 no cache
    const data = await res.json();

    if(Array.isArray(data)){
      campaignsCache = data;
    } else {
      campaignsCache = [];
    }

  } catch(e){
    console.error("❌ Ads konnten nicht geladen werden", e);
    campaignsCache = [];
  }
}

function getCampaigns(){
  return campaignsCache;
}

// =========================
// 🎯 MATCHING (DEIN CODE)
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

    if(c.start && now < c.start) return false;
    if(c.end && now > c.end) return false;

    if(targeting.global) return true;

    if(!leagueKey && !teamKey) return true;

    if(targeting.league && targeting.league === leagueKey) return true;

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
// 🎬 RENDER (STABIL)
// =========================
function renderAds(){

  const el = document.getElementById("adTrack");
  if(!el) return;

  const ads = getMatchingAds();

  if(!ads.length){
    el.innerHTML = `<div class="leaderboardAd">Keine Werbung</div>`;
    return;
  }

  adIndex = adIndex % ads.length;
  const ad = ads[adIndex];

  const image = ad.image;

  el.innerHTML = `
    <div class="leaderboardAd">
      ${ad.link ? `<a href="${ad.link}" target="_blank">` : ""}
        <img src="${image}" alt="Ad" loading="lazy">
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

  adIndex = (adIndex + 1) % ads.length;
  renderAds();
}

// =========================
// 🚀 ENGINE
// =========================
async function startAdEngine(){

  console.log("📢 Ads Engine gestartet");

  await loadCampaigns();     // 🔥 SERVER LADEN
  renderAds();

  setInterval(async () => {
    await loadCampaigns();   // 🔥 regelmäßig aktualisieren
    rotateAds();
  }, 8000);

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
