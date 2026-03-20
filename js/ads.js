// 🔥 Werbe-Kampagnen
// 🔥 Ads definieren
let ads = [
  { image: "ads/ad1.jpg", link: "https://ausbildung.hettich.com/" },
  { image: "ads/ad2.jpg", link: "https://www.haecker-kuechen.com/de/karriere" }
];

// 🔥 LED Bande bauen
function buildAdTrack(){

  const track = document.getElementById("adTrack");
  if(!track) return;

  track.innerHTML = "";

  let active = getActiveAds();

  // 🔥 fallback
  if(active.length === 0){
    track.innerHTML = "<span style='color:white'>Keine Werbung</span>";
    return;
  }

  // 🔥 doppeln für Endlos-Loop!
  let fullList = [...active, ...active];

  fullList.forEach(ad => {

    let item = document.createElement("div");
    item.className = "adItem";

    let img = document.createElement("img");
    img.src = ad.image;

    img.onerror = function(){
      this.src = "ads/fallback.png";
    };

    if(ad.link){
      let a = document.createElement("a");
      a.href = ad.link;
      a.target = "_blank";
      a.appendChild(img);
      item.appendChild(a);
    } else {
      item.appendChild(img);
    }

    track.appendChild(item);
  });

}

// 🔥 Startfunktion
function startAds(){
  buildAdTrack();
}



