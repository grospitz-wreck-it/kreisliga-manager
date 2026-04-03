// =========================
// 📦 STORAGE / ADS (MODULE)
// =========================
import { game } from "../core/state.js";

// =========================
// 📦 DATA
// =========================
function getCampaigns(){
return JSON.parse(localStorage.getItem("ad_v2") || "[]");
}

// =========================
// 🎯 MATCHING
// =========================
function getMatchingAds(){

const now = Date.now();

const leagueKey = game.league?.key;
const teamKey   = game.team?.selected;

return getCampaigns().filter(c => {

// 🕒 Zeitraum
if(c.start && now < c.start) return false;
if(c.end && now > c.end) return false;

// 🌍 GLOBAL
if(c.targeting?.global) return true;

// ⚠️ kein Spielstatus → trotzdem anzeigen
if(!leagueKey && !teamKey) return true;

// 🏆 Liga
if(c.targeting?.league === leagueKey) return true;

// 👕 Team
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
function renderAds(){

const el = document.getElementById("adTrack");
if(!el) return;

const ads = getMatchingAds();

console.log("ADS:", ads);

if(!ads.length){
el.innerHTML = `<div class="leaderboardAd">Keine Werbung</div>`;
return;
}

const ad = ads[Math.floor(Math.random() * ads.length)];

el.innerHTML = `    <div class="leaderboardAd">
      ${ad.link ?`<a href="${ad.link}" target="_blank">`: ""}         <img src="${ad.image}">
      ${ad.link ?`</a>`: ""}     </div>
 `;
}

// =========================
// 🔄 ROTATION
// =========================
let adIndex = 0;

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

console.log("📢 Leaderboard Ads gestartet");

renderAds();

setInterval(renderAds, 10000);
setInterval(rotateAds, 6000);
}

// =========================
// 📦 EXPORTS
// =========================
export {
startAdEngine,
renderAds,
getMatchingAds
};
