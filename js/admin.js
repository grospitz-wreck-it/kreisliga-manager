import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "../config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// =====================
// CREATE CAMPAIGN
// =====================
window.createCampaign = async function(){

  const name = document.getElementById("name").value;
  const customer = document.getElementById("customer").value;
  const budget = Number(document.getElementById("budget").value || 0);
  const link = document.getElementById("link").value;

  const startRaw = document.getElementById("startDate").value;
  const endRaw = document.getElementById("endDate").value;

  const start = startRaw ? new Date(startRaw).toISOString() : null;
  const end = endRaw ? new Date(endRaw).toISOString() : null;

  const type = document.getElementById("targetType").value;

  const donationPercent = Number(document.getElementById("donation").value || 0);

  const file = document.getElementById("image").files[0];

  if(!file){
    alert("Bitte Bild auswählen");
    return;
  }

  // =====================
  // 🔥 UPLOAD IMAGE
  // =====================
  const fileName = Date.now() + "_" + file.name;

  const { error: uploadError } = await supabase
    .storage
    .from("ads")
    .upload(fileName, file);

  if(uploadError){
    alert("Upload Fehler");
    console.error(uploadError);
    return;
  }

  const { data } = supabase
    .storage
    .from("ads")
    .getPublicUrl(fileName);

  const imageUrl = data.publicUrl;

  // =====================
  // 💾 SAVE CAMPAIGN
  // =====================
  await supabase.from("campaigns").insert({
    name,
    customer,
    budget,
    link,
    image: imageUrl,
    start_date: start,
    end_date: end,
    donation_percent: donationPercent,
    targeting: {
      global: type === "global"
    },
    active: true
  });

  alert("✅ Kampagne erstellt");

  loadCampaigns();
  clearForm();
};

// =====================
// LOAD CAMPAIGNS
// =====================
async function loadCampaigns(){

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if(error){
    console.error(error);
    return;
  }

  render(data);
}

// =====================
// DELETE
// =====================
window.deleteCampaign = async function(id){

  await supabase
    .from("campaigns")
    .delete()
    .eq("id", id);

  loadCampaigns();
};

// =====================
// RENDER
// =====================
function render(campaigns){

  const container = document.getElementById("list");

  if(!campaigns.length){
    container.innerHTML = "<p>Keine Kampagnen</p>";
    return;
  }

  container.innerHTML = "";

  campaigns.forEach(c => {

    const div = document.createElement("div");
    div.className = "adRow";

    div.innerHTML = `
      <div class="adLeft">
        <img src="${c.image}">
        <div>
          <strong>${c.customer || "-"}</strong><br>
          ${c.name || ""}<br>
          Budget: ${c.budget}€
        </div>
      </div>

      <button class="danger" onclick="deleteCampaign('${c.id}')">
        🗑️
      </button>
    `;

    container.appendChild(div);
  });
}

// =====================
// RESET FORM
// =====================
function clearForm(){
  ["name","customer","budget","link","startDate","endDate"]
    .forEach(id => document.getElementById(id).value = "");

  document.getElementById("image").value = "";
}

// =====================
// INIT
// =====================
window.onload = loadCampaigns;
