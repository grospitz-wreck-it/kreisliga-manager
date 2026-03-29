// =========================
// 📦 LOAD ADS
// =========================
function loadAdsFromStorage(){
  const stored = localStorage.getItem("ads");
  if(stored){
    ads = JSON.parse(stored);
  }
}

// =========================
// 💾 SAVE ADS
// =========================
function persistAds(){
  localStorage.setItem("ads", JSON.stringify(ads));
}

// =========================
// 🖼 IMAGE UPLOAD
// =========================
function handleUpload(callback){

  const fileInput = document.getElementById("adImageUpload");
  const file = fileInput.files[0];

  if(!file){
    alert("Bild wählen!");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e){
    callback(e.target.result);
  };

  reader.readAsDataURL(file);
}

// =========================
// ➕ SAVE AD
// =========================
function saveAds() {
  const inputs = document.querySelectorAll(".adInput");
  const ads = [];

  inputs.forEach(input => {
    const value = input.value.trim();
    if (value) ads.push(value);
  });

  localStorage.setItem("kreisliga_ads", JSON.stringify(ads));

  console.log("✅ Ads gespeichert:", ads);

  alert("Ads gespeichert!");
}

// =========================
// 👁 PREVIEW
// =========================
function showPreview(src){

  const box = document.getElementById("preview");
  box.innerHTML = `<img src="${src}">`;
}

// =========================
// 📋 LISTE
// =========================
function renderAds(){

  const box = document.getElementById("adList");
  box.innerHTML = "";

  ads.forEach((ad, index)=>{

    let row = document.createElement("div");
    row.className = "adRow";

    row.innerHTML = `
      <img src="${ad.image}">
      <span>${ad.name}</span>
      <span>Gewicht: ${ad.weight}</span>
      <button onclick="deleteAd(${index})">❌</button>
    `;

    box.appendChild(row);
  });
}

// =========================
// ❌ DELETE
// =========================
function deleteAd(index){

  if(!confirm("Ad löschen?")) return;

  ads.splice(index, 1);

  persistAds();

  renderAds();
}

// =========================
// 🚀 INIT
// =========================
loadAdsFromStorage();
renderAds();
