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

  // 🔥 FIX: begrenzte Größe
  const MAX_WIDTH = 320;
  const MAX_HEIGHT = 90;

  let width = img.width;
  let height = img.height;

  const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);

  width *= ratio;
  height *= ratio;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  const resizedBase64 = canvas.toDataURL("image/jpeg", 0.8);

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
  alert("Kampagne gespeichert");
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
