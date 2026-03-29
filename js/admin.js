const KEY = "ad_v2";

let editId = null;

// =====================
// GLOBAL EXPORTS
// =====================
window.updateTargetingUI = updateTargetingUI;
window.createCampaign = createCampaign;
window.del = del;
window.editCampaign = editCampaign;

// =====================
// STORAGE
// =====================
function getData(){
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function saveData(data){
  localStorage.setItem(KEY, JSON.stringify(data));
}

// =====================
// TARGETING UI
// =====================
function updateTargetingUI(){

  const type = document.getElementById("targetType").value;
  const container = document.getElementById("targetFields");

  container.innerHTML = "";

  if(type === "district"){
    container.innerHTML = `<select id="leagueSelect"></select>`;
    loadLeagues();
  }

  if(type === "team"){
    container.innerHTML = `
      <select id="leagueSelect"></select>
      <select id="teamSelect"></select>
    `;
    loadLeagues(true);
  }
}

// =====================
// LEAGUES LADEN
// =====================
function loadLeagues(withTeams = false){

  if(!window.LEAGUES) return;

  const ls = document.getElementById("leagueSelect");
  const ts = document.getElementById("teamSelect");

  ls.innerHTML = `<option value="">Liga wählen</option>`;

  Object.entries(LEAGUES).forEach(([key, l])=>{
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = l.name;
    ls.appendChild(opt);
  });

  if(withTeams){

    ls.onchange = ()=>{

      // 🔥 Default: ganze Liga
      ts.innerHTML = `<option value="ALL">Alle Teams</option>`;

      const league = LEAGUES[ls.value];
      if(!league) return;

      league.teams.forEach(t=>{
        const name = typeof t === "string" ? t : t.name;

        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;

        ts.appendChild(opt);
      });
    };
  }
}

// =====================
// CREATE / UPDATE
// =====================
function createCampaign(){

  const file = document.getElementById("image").files[0];

  const save = (img)=>{

    // 🔥 FIX: Reihenfolge korrekt
    const budget = parseFloat(document.getElementById("budget").value) || 0;
    const donationPercent = parseInt(document.getElementById("donation").value) || 0;
    const donationAmount = budget * (donationPercent / 100);

    const type = document.getElementById("targetType").value;

    let targeting = { type };

    if(type === "district"){
      targeting.league = document.getElementById("leagueSelect")?.value;
    }

    if(type === "team"){

      const teamVal = document.getElementById("teamSelect")?.value;

      targeting.league = document.getElementById("leagueSelect")?.value;

      // 🔥 "ALLE TEAMS" = kein Teamfilter
      if(teamVal && teamVal !== "ALL"){
        targeting.team = teamVal;
      }
    }

    const start = new Date(
      document.getElementById("startDate").value || Date.now()
    ).getTime();

    const end = new Date(
      document.getElementById("endDate").value || Date.now() + 30*86400000
    ).getTime();

    let data = getData();

    if(editId){

      const c = data.find(x => x.id === editId);

      Object.assign(c,{
        name: document.getElementById("name").value,
        customer: document.getElementById("customer").value,
        link: document.getElementById("link").value,
        budget,
        donationPercent,
        donationAmount,
        targeting,
        start,
        end,
        image: img || c.image
      });

      editId = null;

      document.getElementById("formTitle").innerText = "Neue Kampagne";
      document.getElementById("saveBtn").innerText = "💾 Speichern";

    }else{

      data.push({
        id: Date.now(),
        name: document.getElementById("name").value,
        customer: document.getElementById("customer").value,
        link: document.getElementById("link").value,
        budget,
        spent: 0,
        type: document.getElementById("typeCampaign").value,
        cpm: 5,
        impressionsBooked: (budget / 5) * 1000,
        impressionsDelivered: 0,
        donationPercent,
        donationAmount,
        targeting,
        start,
        end,
        image: img
      });
    }

    saveData(data);
    render();
    resetForm();
  };

  if(file){
    const reader = new FileReader();
    reader.onload = e => save(e.target.result);
    reader.readAsDataURL(file);
  }else{
    save(null);
  }
}

// =====================
// EDIT
// =====================
function editCampaign(id){

  const c = getData().find(x => x.id === id);
  if(!c) return;

  editId = id;

  name.value = c.name;
  customer.value = c.customer;
  budget.value = c.budget;
  link.value = c.link;

  startDate.value = new Date(c.start).toISOString().split("T")[0];
  endDate.value = new Date(c.end).toISOString().split("T")[0];

  donation.value = c.donationPercent || 0;

  targetType.value = c.targeting.type;
  updateTargetingUI();

  setTimeout(()=>{

    if(c.targeting.league){
      leagueSelect.value = c.targeting.league;
    }

    if(c.targeting.team && teamSelect){
      leagueSelect.dispatchEvent(new Event("change"));
      teamSelect.value = c.targeting.team;
    }

  },100);

  document.getElementById("formTitle").innerText = "✏️ Kampagne bearbeiten";
  document.getElementById("saveBtn").innerText = "💾 Aktualisieren";
}

// =====================
// DELETE
// =====================
function del(id){
  let data = getData();
  data = data.filter(x => x.id !== id);
  saveData(data);
  render();
}

// =====================
// RESET FORM
// =====================
function resetForm(){

  document.querySelectorAll("input").forEach(i=>{
    if(i.type !== "file") i.value = "";
  });

  document.getElementById("donation").value = "0";

  const tf = document.getElementById("targetFields");
  if(tf) tf.innerHTML = "";

  editId = null;
}

// =====================
// RENDER
// =====================
function render(){

  const list = document.getElementById("list");
  list.innerHTML = "";

  getData().forEach(c=>{

    const donationAmount =
      c.donationAmount ??
      (c.budget * (c.donationPercent || 0) / 100);

    const div = document.createElement("div");
    div.className = "adRow";

    const teamLabel = c.targeting.team || "Alle Teams";

    div.innerHTML = `
      <div class="adLeft">
        <img src="${c.image}">
        <div>
          <b>${c.name}</b><br>
          ${c.customer}<br>
          🎯 ${c.targeting.type} (${teamLabel})<br>
          💚 ${c.donationPercent}% (€${donationAmount.toFixed(2)})
        </div>
      </div>

      <div>
        <button onclick="editCampaign(${c.id})">✏️</button>
        <button onclick="del(${c.id})">❌</button>
      </div>
    `;

    list.appendChild(div);
  });
}

// =====================
// INIT
// =====================
window.onload = render;
