import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// =====================
// STATE
// =====================
let currentCampaigns = [];
let editId = null;
let chartInstance = null;
let editEventId = null;

// =====================
// HELPER
// =====================
function uuid(){
  return crypto.randomUUID();
}

function updateButton(){
  const btn = document.getElementById("saveBtn");
  if(!btn) return;
  btn.innerText = editId ? "✏️ Aktualisieren" : "💾 Speichern";
}

function copy(text){
  navigator.clipboard.writeText(text);
}

// =====================
// ASSET UI BEHAVIOR
// =====================
function createAssetElement(url, id, type="image"){

  const wrapper = document.createElement("div");
  wrapper.className = "asset";

  const el = document.createElement(type === "video" ? "video" : "img");
  el.src = url;
  if(type === "video") el.controls = true;

  const badge = document.createElement("div");
  badge.className = "assetId";
  badge.innerText = id;

  wrapper.appendChild(el);
  wrapper.appendChild(badge);

  // CLICK → COPY ID
  wrapper.addEventListener("click", (e)=>{
    e.stopPropagation();

    copy(id);

    // TOGGLE FULLSCREEN
    wrapper.classList.toggle("fullscreen");
  });

  return wrapper;
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

const file = document.getElementById("image").files[0];

let imageUrl = null;
let assetId = null;

// =====================
// IMAGE UPLOAD
// =====================
if(file){

  assetId = uuid();
  const fileName = assetId + "_" + file.name;

  const { error } = await supabase
    .storage
    .from("ads")
    .upload(fileName, file);

  if(error){
    console.error(error);
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
    end_date: end
  };

  if(imageUrl){
    updateData.image = imageUrl;
    updateData.asset_id = assetId;
  }

  await supabase
    .from("campaigns")
    .update(updateData)
    .eq("id", editId);

  editId = null;
  alert("✏️ Kampagne aktualisiert");

} else {

  await supabase
    .from("campaigns")
    .insert({
      name,
      customer,
      budget,
      link,
      image: imageUrl,
      asset_id: assetId,
      cpm,
      cpc,
      ad_format: format,
      start_date: start,
      end_date: end,
      active: true
    });

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

const { data } = await supabase
.from("campaigns")
.select("*")
.order("created_at", { ascending: false });

render(data || []);
}

// =====================
// EVENTS (MULTI ASSET)
// =====================
async function createEvent(){

const title = document.getElementById("eventTitle").value;
const description = document.getElementById("eventDescription").value;
const type = document.getElementById("eventType").value;
const probability = Number(document.getElementById("eventProbability").value || 0.5);
const cooldown = Number(document.getElementById("eventCooldown").value || 60);
const sponsor = document.getElementById("eventSponsor").value || null;

const keywords = document.getElementById("eventKeywords").value
  .split(",")
  .map(k => k.trim())
  .filter(Boolean);

const files = document.getElementById("eventMedia").files;

let assets = [];

// MULTI UPLOAD
for(const file of files){

  const id = uuid();
  const fileName = id + "_" + file.name;

  await supabase.storage.from("events").upload(fileName, file);

  const { data } = supabase.storage.from("events").getPublicUrl(fileName);

  assets.push({
    id,
    url: data.publicUrl,
    type: file.type.includes("video") ? "video" : "image"
  });
}

if(editEventId){

  await supabase
    .from("events")
    .update({
      title,
      description,
      type,
      probability,
      cooldown,
      sponsor_campaign_id: sponsor,
      keywords,
      assets
    })
    .eq("id", editEventId);

  editEventId = null;
  alert("✏️ Event aktualisiert");

}else{

  await supabase
    .from("events")
    .insert({
      title,
      description,
      type,
      probability,
      cooldown,
      sponsor_campaign_id: sponsor,
      keywords,
      assets,
      active: true
    });

  alert("✅ Event erstellt");
}

clearEventForm();
loadEvents();
}

// =====================
// LOAD EVENTS
// =====================
async function loadEvents(){

const { data } = await supabase
.from("events")
.select("*")
.order("created_at", { ascending:false });

const container = document.getElementById("eventList");
container.innerHTML = "";

(data || []).forEach(e => {

const div = document.createElement("div");
div.className = "eventRow";

const assetsHTML = document.createElement("div");

(e.assets || []).forEach(a=>{
  assetsHTML.appendChild(createAssetElement(a.url, a.id, a.type));
});

div.innerHTML = `
  <div>
    <strong>${e.title}</strong><br>
    🎯 ${e.type}<br>
    ⚡ ${e.probability}
  </div>
`;

div.appendChild(assetsHTML);

// ACTIONS
const actions = document.createElement("div");

const editBtn = document.createElement("button");
editBtn.innerText = "✏️";
editBtn.onclick = ()=>{
  editEventId = e.id;
  document.getElementById("eventTitle").value = e.title;
  document.getElementById("eventDescription").value = e.description;
};

const delBtn = document.createElement("button");
delBtn.innerText = "🗑️";
delBtn.onclick = async ()=>{
  await supabase.from("events").delete().eq("id", e.id);
  loadEvents();
};

actions.appendChild(editBtn);
actions.appendChild(delBtn);
div.appendChild(actions);

container.appendChild(div);

});
}

// =====================
// RENDER CAMPAIGNS
// =====================
function render(campaigns){

currentCampaigns = campaigns;

const container = document.getElementById("list");
container.innerHTML = "";

campaigns.forEach(c => {

const div = document.createElement("div");
div.className = "adRow";

const asset = c.image
  ? createAssetElement(c.image, c.asset_id || "no-id")
  : "";

div.innerHTML = `
  <div>
    <strong>${c.customer}</strong><br>
    ${c.name}
  </div>
`;

if(asset) div.appendChild(asset);

const actions = document.createElement("div");

const editBtn = document.createElement("button");
editBtn.innerText = "✏️";
editBtn.onclick = ()=>{
  editId = c.id;
  document.getElementById("name").value = c.name;
};

const delBtn = document.createElement("button");
delBtn.innerText = "🗑️";
delBtn.onclick = async ()=>{
  await supabase.from("campaigns").delete().eq("id", c.id);
  loadCampaigns();
};

actions.appendChild(editBtn);
actions.appendChild(delBtn);
div.appendChild(actions);

container.appendChild(div);

});
}

// =====================
// RESET
// =====================
function clearForm(){
["name","customer","budget","link","startDate","endDate","cpm","cpc"]
.forEach(id=>{
  const el=document.getElementById(id);
  if(el) el.value="";
});
document.getElementById("image").value="";
}

function clearEventForm(){
[
  "eventTitle","eventDescription","eventKeywords",
  "eventProbability","eventCooldown","eventSponsor"
].forEach(id=>{
  const el=document.getElementById(id);
  if(el) el.value="";
});
document.getElementById("eventMedia").value="";
}

// =====================
// INIT (OHNE WINDOW)
// =====================
document.addEventListener("DOMContentLoaded", () => {

document.getElementById("saveBtn").addEventListener("click", createCampaign);
document.getElementById("createEventBtn").addEventListener("click", createEvent);

document.getElementById("tabAds").addEventListener("click", ()=>{
  document.getElementById("adsTab").classList.add("active");
  document.getElementById("eventsTab").classList.remove("active");
});

document.getElementById("tabEvents").addEventListener("click", ()=>{
  document.getElementById("eventsTab").classList.add("active");
  document.getElementById("adsTab").classList.remove("active");
  loadEvents();
});

updateButton();
loadCampaigns();

});
