// =========================
// 📢 ADS SYSTEM (LED BANDE)
// =========================

// 🔥 Werbeanzeigen (Fallback / Default)
let ads = [
  {
    name: "Sponsor A",
    image: "ads/ad1.jpg",
    link: "https://ausbildung.hettich.com/",
    start: "2026-01-01",
    end: "2026-12-31",
    weight: 1
  },
  {
    name: "Sponsor B",
    image: "ads/ad2.jpg",
    link: "https://www.haecker-kuechen.com/de/karriere",
    start: "2026-01-01",
    end: "2026-12-31",
    weight: 1
  }
];
// 🔥 LOCAL STORAGE LADEN
const storedAds = localStorage.getItem("ads");
if(storedAds){
  ads = JSON.parse(storedAds);
}


// =========================
// 🔥 NEU: ADMIN ADS LADEN
// =========================
function getAdminAds(){

  try{
    const stored = JSON.parse(localStorage.getItem("ads") || "[]");

    // 🔥 Mapping auf dein bestehendes Format
    return stored.map(ad => ({
      name: ad.title || "Anzeige",
      image: ad.image || "ads/fallback.png", // optional später erweitern
      link: ad.link || "",
      start: null,
      end: null,
      weight: 1
    }));

  } catch(e){
    console.error("Admin Ads Fehler:", e);
    return [];
  }
}


// =========================
// 🧠 AKTIVE ADS FILTERN
// =========================
function getActiveAds(){

  const now = new Date();

  // 🔥 NEU: beide Quellen kombinieren
  let allAds = [...ads, ...getAdminAds()];

  return allAds.filter(ad => {

    // 🔥 keine Laufzeit → immer aktiv
    if(!ad.start || !ad.end) return true;

    let start = new Date(ad.start);
    let end = new Date(ad.end);

    // ✅ FIX: ungültige Daten abfangen
    if(isNaN(start) || isNaN(end)){
      console.warn("Ungültiges Datum bei Ad:", ad.name);
      return true;
    }

    return now >= start && now <= end;
  });
}


// =========================
// ⚖️ GEWICHTUNG (BONUS)
// =========================
function expandAdsByWeight(list){

  let expanded = [];

  list.forEach(ad => {
    let w = ad.weight || 1;

    for(let i = 0; i < w; i++){
      expanded.push(ad);
    }
  });

  return expanded;
}


// =========================
// 🎞 LED BANDE ERZEUGEN
// =========================
function buildAdTrack(){

  const track = document.getElementById("adTrack");
  if(!track){
    console.warn("adTrack fehlt im HTML");
    return;
  }

  track.innerHTML = "";

  let active = [];

  // 🔥 sicherer Zugriff
  if(typeof getActiveAds === "function"){
    active = getActiveAds();
  } else {
    active = ads;
  }

  // 🔥 Gewichtung anwenden
  active = expandAdsByWeight(active);

  // ✅ DEBUG (hilft extrem)
  console.log("Aktive Ads:", active.length);

  if(active.length === 0){
    track.innerHTML = "<span style='color:white'>Keine Werbung</span>";
    return;
  }

  // 🔥 doppeln für Endlos-Loop
  let fullList = [...active, ...active];

  fullList.forEach(ad => {

    let item = document.createElement("div");
    item.className = "adItem";

    let img = document.createElement("img");
    img.src = ad.image;
    img.alt = ad.name || "Werbung";

    // 🔥 Fallback bei Fehler
    img.onerror = function(){
      this.src = "ads/fallback.png";
    };

    // 🔥 Klickbar machen (optional)
    if(ad.link){
      let a = document.createElement("a");
      a.href = ad.link;
      a.target = "_blank";

      // 🔥 zukünftiges Tracking vorbereiten
      a.onclick = () => {
        console.log("Ad Click:", ad.name);
      };

      a.appendChild(img);
      item.appendChild(a);
    } else {
      item.appendChild(img);
    }

    track.appendChild(item);
  });

  // ✅ FIX: kleine Verzögerung für CSS Animation (Render Bug vermeiden)
  requestAnimationFrame(() => {
    track.style.animation = "none";
    track.offsetHeight;
    track.style.animation = "";
  });
}


// =========================
// 🔄 ADS NEU LADEN (NEU, aber safe)
// =========================
function refreshAds(){
  buildAdTrack();
}


// =========================
// 🚀 START
// =========================
function startAds(){

  console.log("Ads gestartet");

  // ✅ FIX: mehrfaches Starten verhindern
  if(window.adsInitialized){
    console.log("Ads bereits initialisiert");
    return;
  }

  window.adsInitialized = true;

  buildAdTrack();

  // 🔁 optional später auto-refresh (zukunftssicher)
  // setInterval(buildAdTrack, 60000);
}
