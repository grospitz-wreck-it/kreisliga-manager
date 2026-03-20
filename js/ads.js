// =========================
// 📢 ADS SYSTEM (LED BANDE)
// =========================

// 🔥 Werbeanzeigen
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


// =========================
// 🧠 AKTIVE ADS FILTERN
// =========================
function getActiveAds(){

  const now = new Date();

  return ads.filter(ad => {

    // 🔥 keine Laufzeit → immer aktiv
    if(!ad.start || !ad.end) return true;

    let start = new Date(ad.start);
    let end = new Date(ad.end);

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

}


// =========================
// 🚀 START
// =========================
function startAds(){

  console.log("Ads gestartet");

  buildAdTrack();

}
