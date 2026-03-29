(function(){

const KEY = "ad_v2";

let campaigns = [];

// =====================
// STORAGE
// =====================
function load(){
  campaigns = JSON.parse(localStorage.getItem(KEY) || "[]");
}

function save(){
  localStorage.setItem(KEY, JSON.stringify(campaigns));
}

// =====================
// IMAGE HELPER
// =====================
function readImage(file){
  return new Promise((resolve)=>{
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}

// =====================
// CREATE / UPDATE
// =====================
window.createCampaign = async function(){

  const name = document.getElementById("name").value;
  const customer = document.getElementById("customer").value;
  const link = document.getElementById("link").value;
  const budget = parseFloat(document.getElementById("budget").value) || 0;

  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const imageFile = document.getElementById("imageUpload").files[0];

  let image = "";

  // 👉 WICHTIG: IMAGE WIRD JETZT IMMER GESETZT
  if(imageFile){
    image = await readImage(imageFile);
  }

  const campaign = {
    id: Date.now(),
    name,
    customer,
    link,
    budget,
    image, // 🔥 FIX
    start: startDate ? new Date(startDate).getTime() : null,
    end: endDate ? new Date(endDate).getTime() : null,

    targeting: {
      country: true // default global
    },

    impressionsDelivered: 0
  };

  campaigns.push(campaign);
  save();

  clearForm();
  render();
};

// =====================
// DELETE
// =====================
window.deleteCampaign = function(id){
  campaigns = campaigns.filter(c => c.id !== id);
  save();
  render();
};

// =====================
// CLEAR FORM
// =====================
function clearForm(){
  document.getElementById("name").value = "";
  document.getElementById("customer").value = "";
  document.getElementById("link").value = "";
  document.getElementById("budget").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("imageUpload").value = "";
}

// =====================
// RENDER
// =====================
function render(){

  const box = document.getElementById("campaignList");
  if(!box) return;

  box.innerHTML = "";

  campaigns.forEach(c => {

    const div = document.createElement("div");
    div.className = "adRow";

    const img = c.image 
      ? `<img src="${c.image}" style="height:50px">`
      : "❌ Kein Bild";

    div.innerHTML = `
      ${img}
      <div>
        <strong>${c.customer || "Ohne Kunde"}</strong><br>
        Budget: ${c.budget}€<br>
        Laufzeit: ${formatDate(c.start)} - ${formatDate(c.end)}
      </div>
      <button onclick="deleteCampaign(${c.id})">❌</button>
    `;

    box.appendChild(div);
  });
}

// =====================
// HELPERS
// =====================
function formatDate(ts){
  if(!ts) return "-";
  const d = new Date(ts);
  return d.toLocaleDateString();
}

// =====================
// INIT
// =====================
window.onload = function(){
  load();
  render();
};

})();
