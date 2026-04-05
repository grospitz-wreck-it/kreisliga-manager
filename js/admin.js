import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// =====================
// STATE
// =====================
let currentCampaigns = [];
let editId = null;
let chartInstance = null;

let currentEvents = [];
let editEventId = null;

// =====================
// HELPERS
// =====================
function uuid(){
  return crypto.randomUUID();
}

function copyToClipboard(text){
  navigator.clipboard.writeText(text);
}

function toggleFullscreen(el){
  el.closest(".asset").classList.toggle("fullscreen");
}

function updateButton(){
  const btn = document.getElementById("saveBtn");
  if(!btn) return;
  btn.innerText = editId ? "✏️ Aktualisieren" : "💾 Speichern";
}

// =====================
// CREATE / UPDATE CAMPAIGN
// =====================
async function createCampaign(){

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

const files = document.getElementById("image").files;

let assets = [];

// =====================
// MULTI ASSET UPLOAD
// =====================
for(const file of files){

  const id = uuid();
  const fileName = `${id}_${file.name}`;

  const { error: uploadError } = await supabase
    .storage
    .from("ads")
    .upload(fileName, file);

  if(uploadError){
    console.error(uploadError);
    continue;
  }

  const { data } = supabase
    .storage
    .from("ads")
    .getPublicUrl(fileName);

  assets.push({
    id,
    url: data.publicUrl,
    type: file.type.includes("video") ? "video" : "image"
  });
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
    end_date: end
  };

  if(assets.length){
    updateData.assets = assets;
  }

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
      cpm,
      cpc,
      ad_format: format,
      start_date: start,
      end_date: end,
      assets,
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

}

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
// KPI
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
// FORECAST
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

const daily = totalRevenue / 30;

document.getElementById("forecastMonth").innerText =
  (daily * 30).toFixed(2) + "€";

document.getElementById("forecastYear").innerText =
  (daily * 365).toFixed(2) + "€";
}

// =====================
// CHART
// =====================
function buildRevenueChart(events, campaigns){

const ctx = document.getElementById("revenueChart");
if(!ctx) return;

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

const labels = Object.keys(daysMap).slice(-14);
const values = labels.map(d => daysMap[d]);

if(chartInstance){
  chartInstance.destroy();
}

chartInstance = new Chart(ctx, {
  type: "line",
  data: {
    labels,
    datasets: [{
      label: "Revenue €",
      data: values,
      tension: 0.3
    }]
  }
});
}

// =====================
// RENDER CAMPAIGNS
// =====================
async function render(campaigns){

currentCampaigns = campaigns;

const { stats, events } = await loadStats();

updateKPIs(campaigns, stats);
updateForecast(campaigns, stats);

if(events && events.length){
  buildRevenueChart(events, campaigns);
}

const container = document.getElementById("list");
container.innerHTML = "";

campaigns.forEach(c => {

const assets = c.assets || [];

const assetHTML = assets.map(a=>`
<div class="asset">
  ${a.type==="video"
    ? `<video src="${a.url}" onclick="toggleFullscreen(this)" muted></video>`
    : `<img src="${a.url}" onclick="toggleFullscreen(this)">`
  }
  <button class="assetIdBtn" onclick="copyToClipboard('${a.id}')">ID</button>
</div>
`).join("");

const div = document.createElement("div");
div.className = "adRow";

div.innerHTML = `
<div class="adLeft">
  <div class="assetRow">${assetHTML}</div>
  <div>
    <strong>${c.customer}</strong><br>
    ${c.name}<br>
    📦 ${c.ad_format}
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
// EVENTS
// =====================
async function createEvent(){

const title = document.getElementById("eventTitle").value;
const description = document.getElementById("eventDescription").value;

const files = document.getElementById("eventMedia").files;

let assets = [];

for(const file of files){

  const id = uuid();
  const fileName = `${id}_${file.name}`;

  await supabase.storage.from("events").upload(fileName, file);

  const { data } = supabase.storage.from("events").getPublicUrl(fileName);

  assets.push({
    id,
    url: data.publicUrl,
    type: file.type.includes("video") ? "video" : "image"
  });
}

await supabase.from("events").insert({
  title,
  description,
  assets
});

loadEvents();
}

async function loadEvents(){

const { data } = await supabase.from("events").select("*");

const container = document.getElementById("eventList");
container.innerHTML = "";

(data || []).forEach(e => {

const assets = e.assets || [];

const assetHTML = assets.map(a=>`
<div class="asset">
  <img src="${a.url}" onclick="toggleFullscreen(this)">
  <button class="assetIdBtn" onclick="copyToClipboard('${a.id}')">ID</button>
</div>
`).join("");

const div = document.createElement("div");
div.className = "eventRow";

div.innerHTML = `
<div>
  <strong>${e.title}</strong>
</div>

<div class="assetRow">${assetHTML}</div>

<div>
  <button onclick="deleteEvent('${e.id}')">🗑️</button>
</div>
`;

container.appendChild(div);

});
}

window.deleteEvent = async function(id){
await supabase.from("events").delete().eq("id", id);
loadEvents();
};

// =====================
// INIT (OHNE window)
// =====================
document.getElementById("saveBtn").addEventListener("click", createCampaign);
document.getElementById("createEventBtn").addEventListener("click", createEvent);

document.getElementById("tabAds").onclick = () => switchTab("ads");
document.getElementById("tabEvents").onclick = () => switchTab("events");

function switchTab(tab){

document.querySelectorAll(".tabContent").forEach(t => t.classList.remove("active"));
document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));

function switchTab(tab){

  document.querySelectorAll(".tabContent").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));

  if(tab === "ads"){
    document.getElementById("adsTab").classList.add("active");
    document.getElementById("tabAds").classList.add("active");
  }

  if(tab === "events"){
    document.getElementById("eventsTab").classList.add("active");
    document.getElementById("tabEvents").classList.add("active");
    loadEvents();
  }

  if(tab === "insights"){
    document.getElementById("insightsTab").classList.add("active");
    document.getElementById("tabInsights").classList.add("active");
  }
}
}

loadCampaigns();
// =====================
// EVENT BINDINGS FIX
// =====================
document.addEventListener("DOMContentLoaded", () => {

  // Campaign
  const saveBtn = document.getElementById("saveBtn");
  if(saveBtn) saveBtn.addEventListener("click", createCampaign);

  // Event
  const eventBtn = document.getElementById("createEventBtn");
  if(eventBtn) eventBtn.addEventListener("click", createEvent);

  // Tabs
  const tabAds = document.getElementById("tabAds");
  const tabEvents = document.getElementById("tabEvents");
  const tabInsights = document.getElementById("tabInsights");

  if(tabAds) tabAds.onclick = () => switchTab("ads");
  if(tabEvents) tabEvents.onclick = () => switchTab("events");
  if(tabInsights) tabInsights.onclick = () => switchTab("insights");

});
