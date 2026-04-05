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
// GLOBAL FIX (für onclick)
// =====================
window.copyToClipboard = (text) => navigator.clipboard.writeText(text);
window.toggleFullscreen = (el) => el.closest(".asset").classList.toggle("fullscreen");
window.editCampaign = (id) => editCampaign(id);
window.deleteCampaign = (id) => deleteCampaign(id);
window.deleteEvent = (id) => deleteEvent(id);

// =====================
// HELPERS
// =====================
function uuid(){
return crypto.randomUUID();
}

function updateButton(){
const btn = document.getElementById("saveBtn");
if(!btn) return;
btn.innerText = editId ? "✏️ Aktualisieren" : "💾 Speichern";
}

function clearForm(){
document.querySelectorAll("#adsTab input, #adsTab textarea").forEach(i => i.value = "");
editId = null;
updateButton();
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
// DELETE / EDIT CAMPAIGN
// =====================
async function deleteCampaign(id){
await supabase.from("campaigns").delete().eq("id", id);
loadCampaigns();
}

function editCampaign(id){
const c = currentCampaigns.find(x => x.id === id);
if(!c) return;

document.getElementById("name").value = c.name;
document.getElementById("customer").value = c.customer;
document.getElementById("budget").value = c.budget;
document.getElementById("link").value = c.link;

editId = id;
updateButton();
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
// RENDER CAMPAIGNS
// =====================
async function render(campaigns){

currentCampaigns = campaigns;

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

// =====================
// TABS
// =====================
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

// =====================
// INIT (einmal!)
// =====================
document.addEventListener("DOMContentLoaded", () => {

document.getElementById("saveBtn")?.addEventListener("click", createCampaign);
document.getElementById("createEventBtn")?.addEventListener("click", createEvent);

document.getElementById("tabAds")?.addEventListener("click", () => switchTab("ads"));
document.getElementById("tabEvents")?.addEventListener("click", () => switchTab("events"));
document.getElementById("tabInsights")?.addEventListener("click", () => switchTab("insights"));

switchTab("ads");
loadCampaigns();
});
