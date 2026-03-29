// =========================
// 📢 ADS SYSTEM
// =========================

// 👉 Default Ads (Fallback)
const DEFAULT_ADS = [
  {
    name: "Kreisliga Sponsor",
    image: "ads/fallback.png",
    link: "",
    weight: 1
  }
];

// =========================
// 📦 ADMIN ADS LADEN
// =========================
function getAdminAds(){

  try{
    const stored = JSON.parse(localStorage.getItem("ads") || "[]");

    return stored.map(ad => ({
      name: ad.name || "Anzeige",
      image: ad.image || "ads/fallback.png",
      link: ad.link || "",
      start: ad.start || null,
      end: ad.end || null,
      weight: ad.weight || 1
    }));

  } catch(e){
    console.error("❌ Admin Ads Fehler:", e);
    return [];
  }
}

// =========================
// ⏱️ FILTER AKTIVE ADS
// =========================
function getActiveAds(){

  const now = new Date();

  const allAds = [
    ...DEFAULT_ADS,
    ...getAdminAds()
  ];

  return allAds.filter(ad => {

    if(ad.start && new Date(ad.start) > now) return false;
    if(ad.end && new Date(ad.end) < now) return false;

    return true;
  });
}

// =========================
// 🎯 GEWICHTETE AUSWAHL
// =========================
function pickWeightedAd(list){

  if(!list.length) return null;

  const total = list.reduce((sum, ad) => sum + (ad.weight || 1), 0);
  let r = Math.random() * total;

  for(let ad of list){
    r -= (ad.weight || 1);
    if(r <= 0) return ad;
  }

  return list[0];
}

// =========================
// 🧱 BANNER BAUEN
// =========================
function buildAdTrack(){

  const track = document.getElementById("adTrack");

  if(!track){
    console.warn("❌ adTrack nicht gefunden");
    return;
  }

  track.innerHTML = "";

  const active = getActiveAds();

  console.log("📢 Aktive Ads:", active.length);

  if(active.length === 0){
    track.innerHTML = "<span style='color:white'>Keine Werbung</span>";
    return;
  }

  // =========================
  // 👉 NUR EINE AD (realistisch)
  // =========================
  const ad = pickWeightedAd(active);

  const div = document.createElement("div");
  div.className = "adItem";

  const img = document.createElement("img");
  img.src = ad.image;
  img.alt = ad.name;

  // 👉 klickbar machen (optional)
  if(ad.link){
    img.style.cursor = "pointer";
    img.onclick = () => window.open(ad.link, "_blank");
  }

  div.appendChild(img);
  track.appendChild(div);
}

// =========================
// 🚀 START ADS
// =========================
function startAds(){

  console.log("🚀 Ads gestartet");

  if(window.adsInitialized){
    console.log("⚠️ Ads bereits initialisiert");
    return;
  }

  window.adsInitialized = true;

  buildAdTrack();
}

// =========================
// 🔄 OPTIONAL REFRESH
// =========================
function refreshAds(){
  buildAdTrack();
}

// =========================
// 🌍 GLOBAL
// =========================
window.startAds = startAds;
window.refreshAds = refreshAds;
