// =========================
// 📢 ADS ENGINE (SUPABASE FINAL PRO)
// =========================

import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { game } from "../core/state.js";
import { SUPABASE_URL, SUPABASE_KEY } from "../config.js";

// =========================
// 🔌 INIT
// =========================
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// =========================
// 📦 STATE
// =========================
let campaignsCache = [];
let adIndex = 0;

// =========================
// 📥 LOAD FROM SUPABASE
// =========================
async function loadCampaigns() {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("active", true);

    if (error) {
      console.error("❌ Supabase Fehler:", error);
      campaignsCache = [];
      return;
    }

    campaignsCache = data || [];

  } catch (e) {
    console.error("❌ Load Fehler:", e);
    campaignsCache = [];
  }
}

// =========================
// 🎯 MATCHING ENGINE
// =========================
function getMatchingAds() {

  const now = Date.now();
  const leagueKey = game.league?.key;
  const teamKey = game.team?.selected;

  return campaignsCache.filter(c => {

    // ⏱️ Zeitraum
    if (c.start_date && now < new Date(c.start_date).getTime()) return false;
    if (c.end_date && now > new Date(c.end_date).getTime()) return false;

    const t = c.targeting || {};

    // 🌍 Global
    if (t.global) return true;

    // fallback
    if (!leagueKey && !teamKey) return true;

    // 🏆 Liga
    if (t.league && t.league === leagueKey) return true;

    // 👕 Team
    if (t.team) {
      if (t.team === "all") return true;
      if (t.team === teamKey) return true;
    }

    return false;
  });
}

// =========================
// 📊 TRACKING (ROBUST)
// =========================
async function trackEvent(campaignId, type) {
  try {
    await supabase.from("ad_events").insert([
      {
        campaign_id: campaignId,
        type: type
      }
    ]);
  } catch (e) {
    console.warn(`Tracking Fehler (${type}):`, e);
  }
}

// =========================
// 🎬 RENDER
// =========================
function renderAds() {

  const el = document.getElementById("adTrack");
  if (!el) return;

  const ads = getMatchingAds();

  if (!ads.length) {
    el.innerHTML = `<div class="leaderboardAd">Keine Werbung</div>`;
    return;
  }

  adIndex = adIndex % ads.length;
  const ad = ads[adIndex];

  // =========================
  // 🎬 DOM RENDER
  // =========================
  el.innerHTML = `
    <div class="leaderboardAd">
      ${ad.link ? `
        <a href="${ad.link}" target="_blank" rel="noopener" data-id="${ad.id}" class="adLink">
          <img src="${ad.image}" alt="Ad" loading="lazy">
        </a>
      ` : `
        <img src="${ad.image}" alt="Ad" loading="lazy">
      `}
    </div>
  `;

  // =========================
  // 👁️ IMPRESSION
  // =========================
  trackEvent(ad.id, "impression");

  // =========================
  // 🖱 CLICK TRACKING
  // =========================
  const linkEl = el.querySelector(".adLink");

  if (linkEl) {
    linkEl.addEventListener("click", () => {
      trackEvent(ad.id, "click");
    }, { once: true });
  }
}

// =========================
// 🔄 ROTATION
// =========================
function rotateAds() {

  const ads = getMatchingAds();
  if (!ads.length) return;

  adIndex = (adIndex + 1) % ads.length;
  renderAds();
}

// =========================
// 🚀 ENGINE START
// =========================
async function startAdEngine() {

  console.log("📢 Ads Engine gestartet (PRO)");

  await loadCampaigns();
  renderAds();

  // 🔁 Rotation + Live Reload
  setInterval(async () => {
    await loadCampaigns(); // 🔥 live update
    rotateAds();
  }, 8000);

  // 📱 wichtig für mobile redraw bugs
  window.addEventListener("resize", renderAds);
  window.addEventListener("focus", renderAds);
}

// =========================
// 📦 EXPORTS
// =========================
export {
  startAdEngine,
  renderAds,
  getMatchingAds
};
