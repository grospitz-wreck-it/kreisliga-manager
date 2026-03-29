// =========================
// 🔐 LOGIN
// =========================
const ADMIN_PASSWORD = "1234";

function login(){
  const val = document.getElementById("adminPass").value;

  if(val === ADMIN_PASSWORD){
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";

    renderAds();
    loadLeagues();

  } else {
    alert("Falsches Passwort");
  }
}

// =========================
// 📦 STORAGE
// =========================
const KEY = "ad_v2";

function getAds(){
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function saveAds(data){
  localStorage.setItem(KEY, JSON.stringify(data));
}

// =========================
// 🔥 LEAGUES LADEN
// =========================
function loadLeagues(){

  if(!window.LEAGUES){
    console.warn("LEAGUES fehlt");
    return;
  }

  const leagueSelect = document.getElementById("leagueSelect");
  const teamSelect = document.getElementById("teamSelect");

  leagueSelect.innerHTML = `<option value="">-- Liga wählen --</option>`;

  Object.keys(LEAGUES).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = LEAGUES[key].name;
    leagueSelect.appendChild(opt);
  });

  leagueSelect.addEventListener("change", () => {

    const key = leagueSelect.value;
    teamSelect.innerHTML = `<option value="">-- Team wählen --</option>`;

    if(!key) return;

    LEAGUES[key].teams.forEach(team => {
      const opt = document.createElement("option");
      opt.value = team;
      opt.textContent = team;
      teamSelect.appendChild(opt);
    });

  });
}

// =========================
// 💰 CPM LOGIK
// =========================
function getCPM(t){
  if(t.team) return 20;
  if(t.district) return 10;
  if(t.state) return 5;
  if(t.country) return 2;
  return 1;
}

// =========================
// ➕ KAMPAGNE ERSTELLEN
// =========================
function createCampaign(){

  const file = document.getElementById("image").files[0];
  if(!file) return alert("Bild fehlt");

  const reader = new FileReader();

  reader.onload = function(e){

    const targeting = {
      global: global.checked,
      country: country.checked,
      state: state.checked,
      district: district.checked,
      team: team.checked
    };

    const leagueId = leagueSelect.value;
    const teamId = teamSelect.value;

    const budgetVal = parseFloat(budget.value) || 0;
    const cpm = getCPM(targeting);

    const campaign = {
      id: Date.now(),
      name: name.value,
      customer: customer.value,
      budget: budgetVal,
      spent: 0,
      type: type.value,
      cpm,
      impressionsBooked: (budgetVal / cpm) * 1000,
      impressionsDelivered: 0,
      donation: parseFloat(donation.value) || 0,
      targeting,

      // 🔥 echtes Targeting
      leagueId,
      teamId,

      start: Date.now(),
      end: Date.now() + 1000 * 60 * 60 * 24 * 30,
      image: e.target.result
    };

    const data = getAds();
    data.push(campaign);
    saveAds(data);

    renderAds();
    clearForm();

    console.log("✅ Kampagne erstellt", campaign);
  };

  reader.readAsDataURL(file);
}

// =========================
// 🧹 RESET
// =========================
function clearForm(){
  name.value = "";
  customer.value = "";
  budget.value = "";
  donation.value = 0;
  image.value = "";
}

// =========================
// 🗑️ DELETE
// =========================
function deleteAd(id){
  let data = getAds();
  data = data.filter(a => a.id !== id);
  saveAds(data);
  renderAds();
}

// =========================
// 📊 PACING
// =========================
function shouldServe(c){
  const totalDays = (c.end - c.start) / 86400000;
  const passedDays = (Date.now() - c.start) / 86400000;
  const expected = (passedDays / totalDays) * c.impressionsBooked;

  return c.impressionsDelivered <= expected * 1.2;
}

// =========================
// 🎯 MATCHING
// =========================
function match(c, ctx){

  if(c.teamId){
    return c.teamId === ctx.team;
  }

  if(c.leagueId){
    return c.leagueId === ctx.league;
  }

  if(c.targeting.team) return ctx.team;
  if(c.targeting.district) return ctx.district;
  if(c.targeting.state) return ctx.state;
  if(c.targeting.country) return ctx.country;

  return true;
}

// =========================
// 🚀 DELIVERY ENGINE
// =========================
function serveAd(ctx={global:true}){

  let data = getAds();

  data = data.filter(c => {
    if(c.type === "TKP"){
      if(c.impressionsDelivered >= c.impressionsBooked) return false;
    }
    return shouldServe(c);
  });

  data = data.filter(c => match(c, ctx));

  if(!data.length) return null;

  const c = data[Math.floor(Math.random() * data.length)];

  c.impressionsDelivered++;

  if(c.type === "TKP"){
    c.spent += c.cpm / 1000;
  }

  saveAds(data);

  return c;
}

// =========================
// 📊 UI
// =========================
function renderAds(){

  const data = getAds();
  const list = document.getElementById("adList");

  list.innerHTML = "";

  let total = 0;
  let donationSum = 0;

  data.forEach(c => {

    const donationVal = c.spent * (c.donation / 100);

    total += c.spent;
    donationSum += donationVal;

    const div = document.createElement("div");
    div.className = "box";

    div.innerHTML = `
      <b>${c.name}</b><br>
      Kunde: ${c.customer}<br>
      Budget: €${c.budget}<br>
      Spend: €${c.spent.toFixed(2)}<br>
      Impressions: ${c.impressionsDelivered}/${Math.floor(c.impressionsBooked)}<br>
      Liga: ${c.leagueId || "Global"}<br>
      Team: ${c.teamId || "-"}<br>
      💚 Spende: €${donationVal.toFixed(2)}<br>
      <button onclick="deleteAd(${c.id})">❌</button>
    `;

    list.appendChild(div);
  });

  const stats = document.createElement("div");
  stats.className = "box";

  stats.innerHTML = `
    <h3>💰 Gesamt</h3>
    Umsatz: €${total.toFixed(2)}<br>
    Spenden: €${donationSum.toFixed(2)}
  `;

  list.appendChild(stats);
}
