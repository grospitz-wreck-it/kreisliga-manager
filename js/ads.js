// 🔥 Werbe-Kampagnen
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

// 🔥 Aktives Banner ermitteln
function getActiveAds(){
  const now = new Date();

  return ads.filter(ad => {
    let start = new Date(ad.start);
    let end = new Date(ad.end);
    return now >= start && now <= end;
  });
}

// 🔥 Rotation
function rotateAds(){

  const container = document.getElementById("adBanner");
  if(!container) return;

  let active = getActiveAds();
  if(active.length === 0){
    container.innerHTML = "Keine Werbung";
    return;
  }

  let ad = active[Math.floor(Math.random() * active.length)];

  let img = document.createElement("img");
  img.src = ad.image;
  img.style.width = "100%";
  img.style.borderRadius = "10px";

  container.innerHTML = "";

  if(ad.link){
    let a = document.createElement("a");
    a.href = ad.link;
    a.target = "_blank";
    a.appendChild(img);
    container.appendChild(a);
  } else {
    container.appendChild(img);
  }
}

// 🔥 Startfunktion (die main.js aufruft!)
function startAds(){
  rotateAds();
  setInterval(rotateAds, 8000);
}
