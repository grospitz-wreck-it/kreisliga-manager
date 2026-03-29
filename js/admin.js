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

  const type=targetType.value;
  targetFields.innerHTML="";

  if(type==="global") return;

  if(type==="country"){
    targetFields.innerHTML=`
      <select id="countrySelect">
        ${COUNTRIES.sort().map(c=>`<option value="${c}">${c}</option>`).join("")}
      </select>
    `;
  }

  if(type==="state"){
    targetFields.innerHTML=`
      <select id="stateSelect">
        ${STATES.sort().map(s=>`<option value="${s}">${s}</option>`).join("")}
      </select>
    `;
  }

  if(type==="district"){
    targetFields.innerHTML=`<select id="leagueSelect"></select>`;
    loadLeagues();
  }

  if(type==="team"){
    targetFields.innerHTML=`
      <select id="leagueSelect"></select>
      <select id="teamSelect"></select>
    `;
    loadLeagues(true);
  }
}

/* =====================
   🏆 LEAGUES FIX (WICHTIG)
===================== */
function loadLeagues(withTeams=false){

  if(typeof LEAGUES==="undefined"){
    console.warn("❌ LEAGUES fehlt");
    return;
  }

  const leagueSelect=document.getElementById("leagueSelect");
  const teamSelect=document.getElementById("teamSelect");

  if(!leagueSelect) return;

  leagueSelect.innerHTML=`<option value="">Liga wählen</option>`;

  Object.entries(LEAGUES).forEach(([key,league])=>{

    const opt=document.createElement("option");
    opt.value=key;
    opt.textContent=league.name || key;

    leagueSelect.appendChild(opt);
  });

  if(withTeams && teamSelect){

    leagueSelect.onchange=()=>{

      teamSelect.innerHTML=`<option value="">Team wählen</option>`;

      const league=LEAGUES[leagueSelect.value];

      if(!league || !league.teams){
        console.warn("⚠️ Keine Teams gefunden", leagueSelect.value);
        return;
      }

      league.teams.forEach(team=>{

        // 🔥 unterstützt string ODER object
        const name = typeof team === "string" ? team : team.name;

        const opt=document.createElement("option");
        opt.value=name;
        opt.textContent=name;

        teamSelect.appendChild(opt);
      });
    };
  }
}

/* =====================
   💰 CPM
===================== */
function getCPM(type){
  if(type==="team") return 20;
  if(type==="district") return 10;
  if(type==="state") return 5;
  if(type==="country") return 2;
  return 1;
}

/* =====================
   📅 HELPER
===================== */
function getDays(start,end){
  return Math.ceil((end-start)/86400000);
}

/* =====================
   🚀 CREATE CAMPAIGN
===================== */
function createCampaign(){

  const file=image.files[0];
  if(!file) return alert("Bild fehlt");

  const reader=new FileReader();

  reader.onload=function(e){

    const type=targetType.value;

    let targeting={type};

    if(type==="country"){
      targeting.value=countrySelect.value;
    }

    if(type==="state"){
      targeting.value=stateSelect.value;
    }

    if(type==="district"){
      targeting.league=leagueSelect.value;
    }

    if(type==="team"){
      targeting.league=leagueSelect.value;
      targeting.team=teamSelect.value;
    }

    const startVal=document.getElementById("startDate").value;
    const endVal=document.getElementById("endDate").value;

    const start=startVal ? new Date(startVal).getTime() : Date.now();
    const end=endVal ? new Date(endVal).getTime() : (Date.now()+30*86400000);

    const budget=parseFloat(budget.value)||0;
    const cpm=getCPM(type);

    const campaign={
      id:Date.now(),
      name:name.value||"⚠️ Kein Name",
      customer:customer.value||"-",
      budget,
      spent:0,

      typeCampaign:typeCampaign.value,
      type:typeCampaign.value,

      cpm,
      impressionsBooked:(budget/cpm)*1000,
      impressionsDelivered:0,

      donation:parseFloat(donation.value)||0,

      targeting,

      start,
      end,

      image:e.target.result
    };

    const data=getData();
    data.push(campaign);
    saveData(data);

    render();
    resetForm(); // 🔥 NEU
  };

  reader.readAsDataURL(file);
}

/* =====================
   🔄 RESET FORM
===================== */
function resetForm(){

  name.value="";
  customer.value="";
  budget.value="";
  donation.value=0;

  image.value="";

  startDate.value="";
  endDate.value="";

  targetType.value="global";
  updateTargetingUI();
}

/* =====================
   📊 RENDER
===================== */
function render(){

  list.innerHTML="";

  getData().forEach(c=>{

    const donationVal=c.spent*(c.donation/100);
    const days=getDays(c.start,c.end);

    const div=document.createElement("div");
    div.className="adRow";

    div.innerHTML=`
      <div class="adLeft">
        <img src="${c.image}">
        <div>
          <b>${c.name}</b><br>
          <small>${c.customer}</small><br>
          <small>${c.targeting.type}</small><br>
          <small>⏱️ ${days} Tage</small>
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

  if(!confirm("Kampagne löschen?")) return;

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
