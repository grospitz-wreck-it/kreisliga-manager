const KEY="ad_v2";

/* =====================
   🌍 GEO DATA
===================== */
const COUNTRIES=["Deutschland","Österreich","Schweiz"];
const STATES=["Bayern","NRW","Hessen","Niedersachsen","Sachsen","Berlin"];

/* =====================
   STORAGE
===================== */
function getData(){
  return JSON.parse(localStorage.getItem(KEY)||"[]");
}

function saveData(d){
  localStorage.setItem(KEY,JSON.stringify(d));
}

/* =====================
   🎯 TARGETING UI
===================== */
function updateTargetingUI(){

  const type=document.getElementById("targetType").value;
  const container=document.getElementById("targetFields");

  container.innerHTML="";

  if(type==="global") return;

  if(type==="country"){
    container.innerHTML=`
      <select id="countrySelect">
        ${COUNTRIES.sort().map(c=>`<option value="${c}">${c}</option>`).join("")}
      </select>
    `;
  }

  if(type==="state"){
    container.innerHTML=`
      <select id="stateSelect">
        ${STATES.sort().map(s=>`<option value="${s}">${s}</option>`).join("")}
      </select>
    `;
  }

  if(type==="district"){
    container.innerHTML=`<select id="leagueSelect"></select>`;
    loadLeagues();
  }

  if(type==="team"){
    container.innerHTML=`
      <select id="leagueSelect"></select>
      <select id="teamSelect"></select>
    `;
    loadLeagues();
  }
}

/* =====================
   🏆 LEAGUES LADEN
===================== */
function loadLeagues(){

  if(typeof LEAGUES==="undefined"){
    console.warn("❌ LEAGUES nicht geladen");
    return;
  }

  const leagueSelect=document.getElementById("leagueSelect");
  const teamSelect=document.getElementById("teamSelect");

  if(!leagueSelect) return;

  leagueSelect.innerHTML=`<option value="">Liga wählen</option>`;

  Object.keys(LEAGUES).forEach(key=>{
    const opt=document.createElement("option");
    opt.value=key;
    opt.textContent=LEAGUES[key].name;
    leagueSelect.appendChild(opt);
  });

  if(teamSelect){
    leagueSelect.onchange=()=>{

      teamSelect.innerHTML=`<option value="">Team wählen</option>`;

      const league=LEAGUES[leagueSelect.value];
      if(!league) return;

      league.teams.forEach(team=>{
        const opt=document.createElement("option");
        opt.value=team;
        opt.textContent=team;
        teamSelect.appendChild(opt);
      });
    };
  }
}

/* =====================
   💰 CPM LOGIK
===================== */
function getCPM(type){
  if(type==="team") return 20;
  if(type==="district") return 10;
  if(type==="state") return 5;
  if(type==="country") return 2;
  return 1;
}

/* =====================
   🚀 CREATE CAMPAIGN
===================== */
function createCampaign(){

  const file=document.getElementById("image").files[0];
  if(!file) return alert("Bild fehlt");

  const reader=new FileReader();

  reader.onload=function(e){

    const type=document.getElementById("targetType").value;

    let targeting={type};

    if(type==="country"){
      targeting.value=document.getElementById("countrySelect").value;
    }

    if(type==="state"){
      targeting.value=document.getElementById("stateSelect").value;
    }

    if(type==="district"){
      targeting.league=document.getElementById("leagueSelect").value;
    }

    if(type==="team"){
      targeting.league=document.getElementById("leagueSelect").value;
      targeting.team=document.getElementById("teamSelect").value;
    }

    const budget=parseFloat(document.getElementById("budget").value)||0;
    const days=parseInt(document.getElementById("duration").value)||30;

    const cpm=getCPM(type);

    const campaign={
      id:Date.now(),
      name:document.getElementById("name").value || "⚠️ Kein Name",
      customer:document.getElementById("customer").value || "-",
      budget:budget,
      spent:0,

      // 🔥 wichtig für kompatibilität
      typeCampaign:document.getElementById("typeCampaign").value,
      type:document.getElementById("typeCampaign").value,

      cpm,
      impressionsBooked:(budget/cpm)*1000,
      impressionsDelivered:0,

      donation:parseFloat(document.getElementById("donation").value)||0,

      targeting,

      start:Date.now(),
      end:Date.now()+days*86400000,

      image:e.target.result
    };

    const data=getData();
    data.push(campaign);
    saveData(data);

    render();
  };

  reader.readAsDataURL(file);
}

/* =====================
   📊 RENDER UI
===================== */
function render(){

  const list=document.getElementById("list");
  list.innerHTML="";

  const data=getData();

  data.forEach(c=>{

    const donationVal=c.spent*(c.donation/100);

    const div=document.createElement("div");
    div.className="adRow";

    div.innerHTML=`
      <div class="adLeft">
        <img src="${c.image}">
        <div>
          <b>${c.name}</b><br>
          <small>${c.customer}</small><br>
          <small>${c.targeting.type}</small>
        </div>
      </div>

      <div>
        €${c.spent.toFixed(2)}<br>
        💚 ${donationVal.toFixed(2)}€<br>
        <button class="danger" onclick="del(${c.id})">❌</button>
      </div>
    `;

    list.appendChild(div);
  });
}

/* =====================
   ❌ DELETE
===================== */
function del(id){
  let d=getData();
  d=d.filter(x=>x.id!==id);
  saveData(d);
  render();
}

/* =====================
   INIT
===================== */
window.onload=function(){
  updateTargetingUI();
  render();
};
