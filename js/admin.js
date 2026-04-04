import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// =====================
// STATE
// =====================
let currentCampaigns = [];
let editId = null;

// =====================
// HELPER
// =====================
function updateButton(){
  const btn = document.getElementById("saveBtn");
  if(!btn) return;
  btn.innerText = editId ? "✏️ Aktualisieren" : "💾 Speichern";
}

// =====================
// CREATE / UPDATE
// =====================
window.createCampaign = async function(){

try{

const name = document.getElementById("name").value;
const customer = document.getElementById("customer").value;
const budget = Number(document.getElementById("budget").value || 0);
const link = document.getElementById("link").value;

const startRaw = document.getElementById("startDate").value;
const endRaw = document.getElementById("endDate").value;

const start = startRaw ? new Date(startRaw).toISOString() : null;
const end = endRaw ? new Date(endRaw).toISOString() : null;

const format = document.getElementById("adFormat").value;
const cpm = Number(document.getElementById("cpm").value || 0);
const cpc = Number(document.getElementById("cpc").value || 0);

const donationPercent = Number(document.getElementById("donation")?.value || 0);

const file = document.getElementById("image").files[0];

let imageUrl = null;

// =====================
// IMAGE UPLOAD
// =====================
if(file){

  const fileName = Date.now() + "_" + file.name;

  const { error: uploadError } = await supabase
    .storage
    .from("ads")
    .upload(fileName, file);

  if(uploadError){
    console.error(uploadError);
    alert("❌ Upload Fehler");
    return;
  }

  const { data } = supabase
    .storage
    .from("ads")
    .getPublicUrl(fileName);

  imageUrl = data.publicUrl;
}

// =====================
// UPDATE
// =====================
if(editId){

  const updateData = {
    name,
    customer,
    budget,
    link,
    cpm,
    cpc,
    ad_format: format,
    start_date: start,
    end_date: end,
    donation_percent: donationPercent
  };

  if(imageUrl) updateData.image = imageUrl;

  const { error } = await supabase
    .from("campaigns")
    .update(updateData)
    .eq("id", editId);

  if(error){
    console.error(error);
    alert("❌ Update Fehler");
    return;
  }

  editId = null;
  alert("✏️ Kampagne aktualisiert");

} else {

  const { error } = await supabase
    .from("campaigns")
    .insert({
      name,
      customer,
      budget,
      link,
      image: imageUrl,
      cpm,
      cpc,
      ad_format: format,
      start_date: start,
      end_date: end,
      donation_percent: donationPercent,
      active: true
    });

  if(error){
    console.error(error);
    alert("❌ Create Fehler");
    return;
  }

  alert("✅ Kampagne erstellt");
}

clearForm();
updateButton();
loadCampaigns();

}catch(e){
  console.error("❌ Fatal:", e);
}

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

render(data || []);
}

// =====================
// LOAD STATS
// =====================
async function loadStats(){

const { data } = await supabase
.from("ad_events")
.select("*");

const stats = {};
const events = data || [];

events.forEach(e => {

if(!stats[e.campaign_id]){
  stats[e.campaign_id] = { impressions:0, clicks:0 };
}

if(e.type === "impression") stats[e.campaign_id].impressions++;
if(e.type === "click") stats[e.campaign_id].clicks++;

});

return { stats, events };
}

// =====================
// KPI UPDATE
// =====================
function updateKPIs(campaigns, stats){

let totalImpr = 0;
let totalClicks = 0;
let totalRevenue = 0;

campaigns.forEach(c => {

const s = stats[c.id] || { impressions:0, clicks:0 };

totalImpr += s.impressions;
totalClicks += s.clicks;

const revenue =
  (s.impressions / 1000) * (c.cpm || 0) +
  (s.clicks * (c.cpc || 0));

totalRevenue += revenue;

});

document.getElementById("kpiImpressions").innerText = totalImpr;
document.getElementById("kpiClicks").innerText = totalClicks;
document.getElementById("kpiRevenue").innerText = totalRevenue.toFixed(2) + "€";
}

// =====================
// FORECAST + BREAKDOWN
// =====================
function updateForecast(campaigns, stats){

let totalRevenue = 0;
let byFormat = {};

campaigns.forEach(c => {

  const s = stats[c.id] || { impressions:0, clicks:0 };

  const revenue =
    (s.impressions / 1000) * (c.cpm || 0) +
    (s.clicks * (c.cpc || 0));

  totalRevenue += revenue;

  const format = c.ad_format || "other";

  if(!byFormat[format]) byFormat[format] = 0;
  byFormat[format] += revenue;

});

// Forecast
const daily = totalRevenue / 30;

document.getElementById("forecastMonth").innerText =
  (daily * 30).toFixed(2) + "€";

document.getElementById("forecastYear").innerText =
  (daily * 365).toFixed(2) + "€";

// Breakdown
const container = document.getElementById("revenueBreakdown");
if(!container) return;

container.innerHTML = "";

Object.entries(byFormat).forEach(([type, value]) => {

  const percent = totalRevenue ? (value / totalRevenue * 100) : 0;

  const div = document.createElement("div");
  div.className = "bar";

  div.innerHTML = `
    <div>${type} – ${value.toFixed(2)}€ (${percent.toFixed(1)}%)</div>
    <div class="barFill" style="width:${percent}%"></div>
  `;

  container.appendChild(div);
});
}

// =====================
// REVENUE PER CAMPAIGN
// =====================
function calcRevenue(c, s){

const impressions = s.impressions || 0;
const clicks = s.clicks || 0;

return (
  (impressions / 1000) * (c.cpm || 0) +
  (clicks * (c.cpc || 0))
).toFixed(2);
}

// =====================
// EDIT
// =====================
window.editCampaign = function(id){

const c = currentCampaigns.find(x => x.id === id);
if(!c) return;

editId = id;

document.getElementById("name").value = c.name || "";
document.getElementById("customer").value = c.customer || "";
document.getElementById("budget").value = c.budget || 0;
document.getElementById("link").value = c.link || "";

document.getElementById("cpm").value = c.cpm || 0;
document.getElementById("cpc").value = c.cpc || 0;
document.getElementById("adFormat").value = c.ad_format || "banner";

if(c.start_date){
  document.getElementById("startDate").value = c.start_date.split("T")[0];
}

if(c.end_date){
  document.getElementById("endDate").value = c.end_date.split("T")[0];
}

updateButton();
window.scrollTo({ top: 0, behavior: "smooth" });
};

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
async function render(campaigns){

currentCampaigns = campaigns;

const stats = await loadStats();

updateKPIs(campaigns, stats);
updateForecast(campaigns, stats);
buildRevenueChart(events, campaigns);

const container = document.getElementById("list");
container.innerHTML = "";

campaigns.forEach(c => {

const s = stats[c.id] || { impressions:0, clicks:0 };
const revenue = calcRevenue(c, s);

const div = document.createElement("div");
div.className = "adRow";

div.innerHTML = `
  <div class="adLeft">
    <img src="${c.image || ""}">
    <div>
      <strong>${c.customer || "-"}</strong><br>
      ${c.name || ""}<br>
      📦 ${c.ad_format || "banner"}<br>
      📊 ${s.impressions} / ${s.clicks}<br>
      💰 ${revenue} €
    </div>
  </div>

  <div>
    <button onclick="editCampaign('${c.id}')">✏️</button>
    <button class="danger" onclick="deleteCampaign('${c.id}')">🗑️</button>
  </div>
`;

container.appendChild(div);

});
}

// =====================
// RESET FORM
// =====================
function clearForm(){

["name","customer","budget","link","startDate","endDate","cpm","cpc"]
.forEach(id => {
const el = document.getElementById(id);
if(el) el.value = "";
});

document.getElementById("image").value = "";
}

// =====================
// INIT
// =====================
window.onload = () => {
  updateButton();
  loadCampaigns();
};
let chartInstance = null;

function buildRevenueChart(events, campaigns){

const ctx = document.getElementById("revenueChart");
if(!ctx) return;

// =====================
// DATA GROUPING
// =====================
const daysMap = {};

events.forEach(e => {

  const date = new Date(e.created_at).toISOString().split("T")[0];

  if(!daysMap[date]) daysMap[date] = 0;

  const campaign = campaigns.find(c => c.id === e.campaign_id);
  if(!campaign) return;

  if(e.type === "impression"){
    daysMap[date] += (campaign.cpm || 0) / 1000;
  }

  if(e.type === "click"){
    daysMap[date] += (campaign.cpc || 0);
  }

});

// last 14 days
const labels = Object.keys(daysMap).slice(-14);
const values = labels.map(d => daysMap[d]);

// destroy old chart
if(chartInstance){
  chartInstance.destroy();
}

// =====================
// CHART
// =====================
chartInstance = new Chart(ctx, {
  type: "line",
  data: {
    labels,
    datasets: [{
      label: "Revenue €",
      data: values,
      tension: 0.3
    }]
  },
  options: {
    responsive:true,
    plugins:{
      legend:{display:false}
    }
  }
});
}
