import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// =====================
// STATE
// =====================
const state = {
  campaigns: [],
  events: [],
  stats: {},
  editCampaignId: null,
  chart: null
};

// =====================
// HELPERS
// =====================
const uuid = () => crypto.randomUUID();

const copy = (text) => navigator.clipboard.writeText(text);

const toggleFullscreen = (el) => {
  el.closest(".asset").classList.toggle("fullscreen");
};

const qs = (id) => document.getElementById(id);

// =====================
// STORAGE HELPERS
// =====================
async function uploadFiles(bucket, files){
  const assets = [];

  for(const file of files){
    const id = uuid();
    const fileName = `${id}_${file.name}`;

    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if(error){
      console.error(error);
      continue;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    assets.push({
      id,
      url: data.publicUrl,
      type: file.type.includes("video") ? "video" : "image"
    });
  }

  return assets;
}

// =====================
// CAMPAIGNS
// =====================
async function saveCampaign(){

  const assets = await uploadFiles("ads", qs("image").files);

  const payload = {
    name: qs("name").value,
    customer: qs("customer").value,
    budget: Number(qs("budget").value || 0),
    link: qs("link").value,
    ad_format: qs("adFormat").value,
    cpm: Number(qs("cpm").value || 0),
    cpc: Number(qs("cpc").value || 0),
    start_date: qs("startDate").value || null,
    end_date: qs("endDate").value || null,
    active: true
  };

  if(state.editCampaignId){
    if(assets.length) payload.assets = assets;

    await supabase
      .from("campaigns")
      .update(payload)
      .eq("id", state.editCampaignId);

    state.editCampaignId = null;

  } else {

    payload.assets = assets;

    await supabase
      .from("campaigns")
      .insert(payload);
  }

  clearCampaignForm();
  loadCampaigns();
}

function editCampaign(id){
  const c = state.campaigns.find(x => x.id === id);
  if(!c) return;

  qs("name").value = c.name;
  qs("customer").value = c.customer;
  qs("budget").value = c.budget;
  qs("link").value = c.link;

  state.editCampaignId = id;
}

async function deleteCampaign(id){
  await supabase.from("campaigns").delete().eq("id", id);
  loadCampaigns();
}

// =====================
// EVENTS
// =====================
async function saveEvent(){

  const assets = await uploadFiles("events", qs("eventMedia").files);

  await supabase.from("events").insert({
    title: qs("eventTitle").value,
    description: qs("eventDescription").value,
    keywords: qs("eventKeywords").value,
    type: qs("eventType").value,
    probability: Number(qs("eventProbability").value || 0),
    cooldown: Number(qs("eventCooldown").value || 0),
    sponsor: qs("eventSponsor").value,
    assets
  });

  loadEvents();
}

async function deleteEvent(id){
  await supabase.from("events").delete().eq("id", id);
  loadEvents();
}

// =====================
// LOADERS
// =====================
async function loadCampaigns(){
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  state.campaigns = data || [];

  await loadStats();
  renderCampaigns();
  updateKPIs();
  updateForecast();
}

async function loadEvents(){
  const { data } = await supabase.from("events").select("*");
  state.events = data || [];
  renderEvents();
}

async function loadStats(){
  const { data } = await supabase.from("ad_events").select("*");

  const stats = {};

  (data || []).forEach(e => {
    if(!stats[e.campaign_id]){
      stats[e.campaign_id] = { impressions:0, clicks:0 };
    }
    if(e.type === "impression") stats[e.campaign_id].impressions++;
    if(e.type === "click") stats[e.campaign_id].clicks++;
  });

  state.stats = stats;
  buildChart(data || []);
}

// =====================
// KPI + FORECAST
// =====================
function updateKPIs(){

  let impr=0, clicks=0, revenue=0;

  state.campaigns.forEach(c => {
    const s = state.stats[c.id] || { impressions:0, clicks:0 };

    impr += s.impressions;
    clicks += s.clicks;

    revenue +=
      (s.impressions/1000)*(c.cpm||0) +
      (s.clicks*(c.cpc||0));
  });

  qs("kpiImpressions").innerText = impr;
  qs("kpiClicks").innerText = clicks;
  qs("kpiRevenue").innerText = revenue.toFixed(2)+"€";
}

function updateForecast(){

  let revenue = 0;

  state.campaigns.forEach(c => {
    const s = state.stats[c.id] || { impressions:0, clicks:0 };

    revenue +=
      (s.impressions/1000)*(c.cpm||0) +
      (s.clicks*(c.cpc||0));
  });

  const daily = revenue/30;

  qs("forecastMonth").innerText = (daily*30).toFixed(2)+"€";
  qs("forecastYear").innerText = (daily*365).toFixed(2)+"€";
}

// =====================
// CHART
// =====================
function buildChart(events){

  const ctx = qs("revenueChart");
  if(!ctx) return;

  const map = {};

  events.forEach(e=>{
    const d = e.created_at?.split("T")[0];
    if(!map[d]) map[d]=0;

    const c = state.campaigns.find(x=>x.id===e.campaign_id);
    if(!c) return;

    if(e.type==="impression") map[d]+=(c.cpm||0)/1000;
    if(e.type==="click") map[d]+=(c.cpc||0);
  });

  const labels = Object.keys(map).slice(-14);
  const values = labels.map(l=>map[l]);

  if(state.chart) state.chart.destroy();

  state.chart = new Chart(ctx,{
    type:"line",
    data:{ labels, datasets:[{ data:values, label:"Revenue €"}]}
  });
}

// =====================
// RENDER
// =====================
function renderCampaigns(){

  const el = qs("list");
  el.innerHTML = "";

  state.campaigns.forEach(c=>{

    const assets = (c.assets||[]).map(a=>`
      <div class="asset">
        ${a.type==="video"
          ? `<video src="${a.url}" data-action="fullscreen" muted></video>`
          : `<img src="${a.url}" data-action="fullscreen">`
        }
<button class="assetIdBtn" data-action="copy" data-id="${a.id}" title="Click to copy">
  ${a.id.slice(0,6)}
</button>      </div>
    `).join("");

    el.innerHTML += `
      <div class="adRow">
        <div class="adLeft">
          <div class="assetRow">${assets}</div>
          <div>
            <strong>${c.customer}</strong><br>
            ${c.name}<br>
            📦 ${c.ad_format}
          </div>
        </div>
        <div>
          <button data-action="editCampaign" data-id="${c.id}">✏️</button>
          <button class="danger" data-action="deleteCampaign" data-id="${c.id}">🗑️</button>
        </div>
      </div>
    `;
  });
}

function renderEvents(){

  const el = qs("eventList");
  el.innerHTML = "";

  state.events.forEach(e=>{

    const assets = (e.assets||[]).map(a=>`
      <div class="asset">
        ${a.type==="video"
          ? `<video src="${a.url}" data-action="fullscreen" muted></video>`
          : `<img src="${a.url}" data-action="fullscreen">`
        }
<button class="assetIdBtn" data-action="copy" data-id="${a.id}" title="Click to copy">
  ${a.id.slice(0,6)}
</button>      </div>
    `).join("");

    el.innerHTML += `
      <div class="eventRow">
        <div><strong>${e.title}</strong></div>
        <div class="assetRow">${assets}</div>
        <div>
          <button class="danger" data-action="deleteEvent" data-id="${e.id}">🗑️</button>
        </div>
      </div>
    `;
  });
}

// =====================
// EVENTS (CLICK HANDLER)
// =====================
document.addEventListener("click",(e)=>{

  const a = e.target.dataset.action;
  if(!a) return;

  if(a==="copy") copy(e.target.dataset.id);
  if(a==="fullscreen") toggleFullscreen(e.target);

  if(a==="deleteCampaign") deleteCampaign(e.target.dataset.id);
  if(a==="editCampaign") editCampaign(e.target.dataset.id);
  if(a==="deleteEvent") deleteEvent(e.target.dataset.id);

});

// =====================
// TABS
// =====================
function switchTab(tab){

  document.querySelectorAll(".tabContent").forEach(t=>t.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach(b=>b.classList.remove("active"));

  qs(tab+"Tab").classList.add("active");
  qs("tab"+tab.charAt(0).toUpperCase()+tab.slice(1)).classList.add("active");

  if(tab==="events") loadEvents();
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded",()=>{

  qs("saveBtn").addEventListener("click", saveCampaign);
  qs("createEventBtn").addEventListener("click", saveEvent);

  qs("tabAds").onclick=()=>switchTab("ads");
  qs("tabEvents").onclick=()=>switchTab("events");
  qs("tabInsights").onclick=()=>switchTab("insights");

  loadCampaigns();
});

// =====================
// FORM RESET
// =====================
function clearCampaignForm(){
  document.querySelectorAll("#adsTab input").forEach(i=>i.value="");
}
