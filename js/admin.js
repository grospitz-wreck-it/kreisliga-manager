const ADMIN_PASSWORD = "1234"; // später ändern!

let ads = JSON.parse(localStorage.getItem("ads") || "[]");

function login(){
  const val = document.getElementById("adminPass").value;

  if(val === ADMIN_PASSWORD){
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    renderAds();
  } else {
    alert("Falsches Passwort");
  }
}

// =========================
// ➕ AD HINZUFÜGEN
// =========================

function addAd(){

  const ad = {
    id: Date.now(),
    title: document.getElementById("adTitle").value,
    text: document.getElementById("adText").value,
    link: document.getElementById("adLink").value
  };

  ads.push(ad);
  saveAds();

  renderAds();
}

// =========================
// 🗑️ LÖSCHEN
// =========================

function deleteAd(id){
  ads = ads.filter(a => a.id !== id);
  saveAds();
  renderAds();
}

// =========================
// 💾 SAVE
// =========================

function saveAds(){
  localStorage.setItem("ads", JSON.stringify(ads));
}

// =========================
// 📋 RENDER
// =========================

function renderAds(){

  const box = document.getElementById("adList");
  box.innerHTML = "";

  ads.forEach(ad => {

    let div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.margin = "10px";
    div.style.padding = "10px";

    div.innerHTML = `
      <strong>${ad.title}</strong><br>
      ${ad.text}<br>
      <a href="${ad.link}" target="_blank">${ad.link}</a><br>
      <button onclick="deleteAd(${ad.id})">❌ Löschen</button>
    `;

    box.appendChild(div);
  });
}
