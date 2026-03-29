const STORAGE_KEY = "kreisliga_ads";

function startAds() {
if (window.adsInitialized) return;
window.adsInitialized = true;

console.log("📢 Ads gestartet");

buildAdTrack();
}

function buildAdTrack() {
const track = document.getElementById("adTrack");
if (!track) return;

track.innerHTML = "";

let ads = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// 📅 Nur aktive Ads filtern
const today = new Date().toISOString().split("T")[0];

ads = ads.filter(ad => {
if (ad.start && ad.start > today) return false;
if (ad.end && ad.end < today) return false;
return true;
});

if (!ads.length) {
track.innerHTML = "<span style='color:white'>Keine Werbung aktiv</span>";
return;
}

// 🎯 Gewichtung berücksichtigen
const weightedAds = [];

ads.forEach(ad => {
const w = ad.weight || 1;
for (let i = 0; i < w; i++) {
weightedAds.push(ad);
}
});

// 👉 Max 5 Ads anzeigen (UI sauber halten)
const selectedAds = weightedAds.slice(0, 5);

selectedAds.forEach(ad => {
const div = document.createElement("div");
div.className = "adItem";

```
const img = document.createElement("img");
img.src = ad.image;

if (ad.link) {
  const a = document.createElement("a");
  a.href = ad.link;
  a.target = "_blank";
  a.appendChild(img);
  div.appendChild(a);
} else {
  div.appendChild(img);
}

track.appendChild(div);
```

});
}
