const STORAGE_KEY = "kreisliga_ads";

// 📦 Alle Ads laden
function getAds() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// 💾 Speichern
function saveAds(ads) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
}

// ➕ Neue Ad speichern
function saveAd() {
  const name = document.getElementById("adName").value;
  const link = document.getElementById("adLink").value;
  const start = document.getElementById("adStart").value;
  const end = document.getElementById("adEnd").value;
  const weight = parseInt(document.getElementById("adWeight").value) || 1;
  const file = document.getElementById("adImageUpload").files[0];

  if (!file) {
    alert("Bitte Bild auswählen");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const ads = getAds();

    const newAd = {
      id: Date.now(),
      name,
      link,
      start,
      end,
      weight,
      image: e.target.result // 👉 Base64
    };

    ads.push(newAd);
    saveAds(ads);

    renderAds();
    clearForm();

    console.log("✅ Ad gespeichert", newAd);
  };

  reader.readAsDataURL(file);
}

// 🧹 Formular leeren
function clearForm() {
  document.getElementById("adName").value = "";
  document.getElementById("adLink").value = "";
  document.getElementById("adStart").value = "";
  document.getElementById("adEnd").value = "";
  document.getElementById("adWeight").value = 1;
  document.getElementById("adImageUpload").value = "";
}

// 🖼️ Vorschau + Liste
function renderAds() {
  const ads = getAds();
  const list = document.getElementById("adList");

  list.innerHTML = "";

  ads.forEach(ad => {
    const div = document.createElement("div");
    div.style.marginBottom = "10px";

    div.innerHTML = `
      <strong>${ad.name}</strong><br>
      <img src="${ad.image}" style="height:50px"><br>
      <button onclick="deleteAd(${ad.id})">❌ Löschen</button>
    `;

    list.appendChild(div);
  });
}

// ❌ Löschen
function deleteAd(id) {
  let ads = getAds();
  ads = ads.filter(ad => ad.id !== id);
  saveAds(ads);
  renderAds();
}

// 🚀 Init
window.onload = renderAds;
