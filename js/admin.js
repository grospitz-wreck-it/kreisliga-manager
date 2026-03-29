const KEY="ad_v2";

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
   TARGETING UI
===================== */
function updateTargetingUI(){

  const type=document.getElementById("targetType").value;
  const container=document.getElementById("targetFields");

  container.innerHTML="";

  if(type==="district"){
    container.innerHTML=`<select id="leagueSelect"></select>`;
    loadLeagues();
  }

  if(type==="team"){
    container.innerHTML=`
      <select id="leagueSelect"></select>
      <select id="teamSelect"></select>
    `;
    loadLeagues(true);
  }
}

/* =====================
   LEAGUES (ROBUST)
===================== */
function loadLeagues(withTeams=false){

  if(!window.LEAGUES){
    console.warn("❌ LEAGUES nicht geladen");
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
   CREATE CAMPAIGN
===================== */
function createCampaign(){

  const file=document.getElementById("image").files[0];
  if(!file) return alert("Bild fehlt");

  const reader=new FileReader();

  reader.onload=function(e){

    const type=document.getElementById("targetType").value;

    let targeting={type};

    if(type==="district"){
      targeting.league=document.getElementById("leagueSelect")?.value || null;
    }

    if(type==="team"){
      targeting.league=document.getElementById("leagueSelect")?.value || null;
      targeting.team=document.getElementById("teamSelect")?.value || null;
    }

    const budget=parseFloat(document.getElementById("budget").value)||0;
    const donationPercent=parseInt(document.getElementById("donation").value)||0;

    const startVal=document.getElementById("startDate").value;
    const endVal=document.getElementById("endDate").value;

    const start=startVal ? new Date(startVal).getTime() : Date.now();
    const end=endVal ? new Date(endVal).getTime() : Date.now()+30*86400000;

    const cpm=5;

    const campaign={
      id:Date.now(),

      name:document.getElementById("name").value || "⚠️ Kein Name",
      customer:document.getElementById("customer").value || "-",
      link:document.getElementById("link").value || "",

      budget,
      spent:0,

      typeCampaign:document.getElementById("typeCampaign").value,
      type:document.getElementById("typeCampaign").value,

      cpm,
      impressionsBooked:(budget/cpm)*1000,
      impressionsDelivered:0,

      // 💚 Spende vom Gesamtbudget
      donationPercent,
      donationAmount: budget * (donationPercent/100),

      targeting,

      start,
      end,

      image:e.target.result
    };

    const data=getData();
    data.push(campaign);
    saveData(data);

    render();
    resetForm();
  };

  reader.readAsDataURL(file);
}

/* =====================
   RESET FORM
===================== */
function resetForm(){

  document.getElementById("name").value="";
  document.getElementById("customer").value="";
  document.getElementById("budget").value="";
  document.getElementById("link").value="";

  document.getElementById("startDate").value="";
  document.getElementById("endDate").value="";

  document.getElementById("donation").value="0";
  document.getElementById("image").value="";

  document.getElementById("targetType").value="global";
  document.getElementById("targetFields").innerHTML="";
}

/* =====================
   RENDER
===================== */
function render(){

  const list=document.getElementById("list");
  list.innerHTML="";

  getData().forEach(c=>{

    const days=Math.ceil((c.end-c.start)/86400000);

    const div=document.createElement("div");
    div.className="adRow";

    div.innerHTML=`
      <div class="adLeft">
        <img src="${c.image}">
        <div>
          <b>${c.name}</b><br>
          ${c.customer}<br>
          ⏱️ ${days} Tage<br>
          💚 ${c.donationPercent}% = €${c.donationAmount.toFixed(2)}
        </div>
      </div>

      <div>
        <button onclick="del(${c.id})">❌</button>
      </div>
    `;

    list.appendChild(div);
  });
}

/* =====================
   DELETE
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
  render();
};
