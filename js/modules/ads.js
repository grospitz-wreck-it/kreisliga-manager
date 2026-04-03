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

if(!ads.length){
el.innerHTML = `<div class="leaderboardAd">Keine Werbung</div>`;
return;
}

const isMobile = window.innerWidth <= 600;
// 👉 einmal hinzufügen
window.addEventListener("resize", () => {
renderAds();
});
// 👉 nutzt jetzt sicheren Index
adIndex = adIndex % ads.length;
const ad = ads[adIndex];


const image = isMobile && ad.imageMobile
? ad.imageMobile
: ad.image;

el.innerHTML = `

  <div class="leaderboardAd">
    ${ad.link ? `<a href="${ad.link}" target="_blank">` : ""}
      <img src="${image}" alt="Ad">
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
function startAdEngine(){

console.log("📢 Ads gestartet");

renderAds();

// 👉 NUR EINE LOGIK
setInterval(rotateAds, 8000);

}


// =========================
// 📦 EXPORTS
// =========================
export {
startAdEngine,
renderAds,
getMatchingAds
};
