// =========================
// 📢 ADS ENGINE (CLEAN)
// =========================
alert("renderAds läuft");
const ads = getMatchingAds();
alert("Ads: " + ads.length);
import { game } from "../core/state.js";

const KEY = "ad_v2";

// =========================
// 📦 DATA
// =========================
function getCampaigns(){
return JSON.parse(localStorage.getItem(KEY) || "[]");
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

// 👉 kaputte Einträge skippen
if(!c || typeof c !== "object") return false;

// 👉 targeting absichern
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
// 🎬 RENDER
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

  // 👉 aktuelles Ad wählen
  adIndex = adIndex % ads.length;
  const ad = ads[adIndex];

  // 👉 Container reset (wichtig!)
  el.innerHTML = `<div class="leaderboardAd"></div>`;
  const wrapper = el.querySelector(".leaderboardAd");

  // 👉 Image sauber erstellen (iOS safe)
  const img = document.createElement("img");
  img.src = ad.image;
  img.alt = "Ad";
  img.loading = "eager"; // 🔥 wichtig für iPhone

  // 👉 optional klickbar
  if(ad.link){
    const a = document.createElement("a");
    a.href = ad.link;
    a.target = "_blank";
    a.appendChild(img);
    wrapper.appendChild(a);
  } else {
    wrapper.appendChild(img);
  }

  // 👉 Debug (optional)
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

// 👉 initial render
renderAds();

// 👉 Rotation
setInterval(rotateAds, 8000);

// 👉 Resize sauber EINMAL
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
