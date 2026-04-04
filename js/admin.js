// =====================
// 📦 ADMIN ADS SYSTEM
// =====================
(function(){

const KEY = "ad_v2";

// =====================
// STORAGE
// =====================
function getCampaigns(){
return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function saveCampaigns(data){
localStorage.setItem(KEY, JSON.stringify(data));
}

// =====================
// CREATE CAMPAIGN
// =====================
window.createCampaign = function(){

const name = document.getElementById("name")?.value || "";
const customer = document.getElementById("customer")?.value || "";
const budget = Number(document.getElementById("budget")?.value || 0);
const link = document.getElementById("link")?.value || "";

const startRaw = document.getElementById("startDate")?.value;
const endRaw = document.getElementById("endDate")?.value;

const start = startRaw ? new Date(startRaw).getTime() : null;
const end = endRaw ? new Date(endRaw).getTime() : null;

const type = document.getElementById("targetType")?.value;

const league = document.getElementById("leagueSelectAds")?.value || null;
const team = document.getElementById("teamSelectAds")?.value || "all";

const donationPercent = Number(document.getElementById("donation")?.value || 0);

const imageInput = document.getElementById("image");

if(!imageInput || !imageInput.files[0]){
alert("Bitte Bild hochladen");
return;
}

const reader = new FileReader();

reader.onload = function(e){


const img = new Image();

img.onload = function(){

  // =====================
  // 🔥 AUTO-CROP BANNER (320x90)
  // =====================
  const TARGET_W = 320;
  const TARGET_H = 90;

  const canvas = document.createElement("canvas");
  canvas.width = TARGET_W;
  canvas.height = TARGET_H;

  const ctx = canvas.getContext("2d");

  const imgRatio = img.width / img.height;
  const targetRatio = TARGET_W / TARGET_H;

  let sx, sy, sw, sh;

  if(imgRatio > targetRatio){
    // 👉 zu breit → links/rechts abschneiden
    sh = img.height;
    sw = sh * targetRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    // 👉 zu hoch → oben/unten abschneiden
    sw = img.width;
    sh = sw / targetRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, TARGET_W, TARGET_H);

  const resizedBase64 = canvas.toDataURL("image/webp", 0.4);
  // =====================
  // 💾 SAVE
  // =====================
  const campaign = {
    id: Date.now(),
    name,
    customer,
    budget,
    link,
    start,
    end,
    donationPercent,
    image: resizedBase64,
    impressionsDelivered: 0,
    spent: 0,
    targeting: {
      global: type === "global",
      league: type === "district" ? league : null,
      team: type === "team" ? team : null
    }
  };

  const all = getCampaigns();
  all.push(campaign);
  saveCampaigns(all);

  clearForm();
  render();

  console.log("✅ gespeichert:", campaign);
  alert("Kampagne gespeichert (perfekt zugeschnitten)");
};

img.src = e.target.result;


};

reader.readAsDataURL(imageInput.files[0]);
};

// =====================
// DELETE
// =====================
window.deleteCampaign = function(id){
const all = getCampaigns().filter(c => c.id !== id);
saveCampaigns(all);
render();
};

// =====================
// RESET FORM
// =====================
function clearForm(){

["name","customer","budget","link","startDate","endDate"].forEach(id=>{
const el = document.getElementById(id);
if(el) el.value = "";
});

const img = document.getElementById("image");
if(img) img.value = "";
}

// =====================
// RENDER LIST
// =====================
function render(){

const container = document.getElementById("list");
if(!container) return;

const campaigns = getCampaigns();

if(!campaigns.length){
container.innerHTML = "<p>Keine Kampagnen</p>";
return;
}

container.innerHTML = "";

campaigns.forEach(c => {


const div = document.createElement("div");
div.className = "adRow";

div.innerHTML = `
  <img src="${c.image}" style="height:50px;">
  <strong>${c.customer}</strong>
  <button onclick="deleteCampaign(${c.id})">🗑️</button>
`;

container.appendChild(div);


});
}

// =====================
// INIT
// =====================
window.onload = function(){
render();
};

})();
