const KEY="ad_v2";

let editId = null;

/* GLOBAL */
window.updateTargetingUI = updateTargetingUI;
window.createCampaign = createCampaign;
window.del = del;
window.editCampaign = editCampaign;

/* STORAGE */
function getData(){
  return JSON.parse(localStorage.getItem(KEY)||"[]");
}

function saveData(d){
  localStorage.setItem(KEY,JSON.stringify(d));
}

/* TARGETING */
function updateTargetingUI(){

  const type=targetType.value;
  targetFields.innerHTML="";

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

/* LEAGUES */
function loadLeagues(withTeams=false){

  if(!window.LEAGUES) return;

  const ls=document.getElementById("leagueSelect");
  const ts=document.getElementById("teamSelect");

  ls.innerHTML=`<option value="">Liga wählen</option>`;

  Object.entries(LEAGUES).forEach(([key,l])=>{
    const opt=document.createElement("option");
    opt.value=key;
    opt.textContent=l.name;
    ls.appendChild(opt);
  });

  if(withTeams){
    ls.onchange=()=>{
      ts.innerHTML=`<option value="">Team wählen</option>`;
      const league=LEAGUES[ls.value];
      if(!league) return;

      league.teams.forEach(t=>{
        const name=typeof t==="string"?t:t.name;
        const opt=document.createElement("option");
        opt.value=name;
        opt.textContent=name;
        ts.appendChild(opt);
      });
    };
  }
}

/* CREATE / UPDATE */
function createCampaign(){

  const file=image.files[0];

  const save = (img)=>{

    const type=targetType.value;

    let targeting={type};

    if(type==="district"){
      targeting.league=leagueSelect?.value;
    }

    if(type==="team"){
      targeting.league=leagueSelect?.value;
      targeting.team=teamSelect?.value;
    }

    const budget=parseFloat(budget.value)||0;
    const donationPercent=parseInt(donation.value)||0;

    const start=new Date(startDate.value||Date.now()).getTime();
    const end=new Date(endDate.value||Date.now()+30*86400000).getTime();

    let data=getData();

    if(editId){

      const c=data.find(x=>x.id===editId);

      Object.assign(c,{
        name:name.value,
        customer:customer.value,
        link:link.value,
        budget,
        donationPercent,
        donationAmount: budget*(donationPercent/100),
        targeting,
        start,
        end,
        image: img || c.image
      });

      editId=null;
      formTitle.innerText="Neue Kampagne";
      saveBtn.innerText="💾 Speichern";

    }else{

      data.push({
        id:Date.now(),
        name:name.value,
        customer:customer.value,
        link:link.value,
        budget,
        spent:0,
        type:typeCampaign.value,
        cpm:5,
        impressionsBooked:(budget/5)*1000,
        impressionsDelivered:0,
        donationPercent,
        donationAmount: budget*(donationPercent/100),
        targeting,
        start,
        end,
        image:img
      });
    }

    saveData(data);
    render();
    resetForm();
  };

  if(file){
    const reader=new FileReader();
    reader.onload=e=>save(e.target.result);
    reader.readAsDataURL(file);
  }else{
    save(null);
  }
}

/* EDIT */
function editCampaign(id){

  const c=getData().find(x=>x.id===id);
  if(!c) return;

  editId=id;

  name.value=c.name;
  customer.value=c.customer;
  budget.value=c.budget;
  link.value=c.link;

  startDate.value=new Date(c.start).toISOString().split("T")[0];
  endDate.value=new Date(c.end).toISOString().split("T")[0];

  donation.value=c.donationPercent;

  targetType.value=c.targeting.type;
  updateTargetingUI();

  setTimeout(()=>{
    if(c.targeting.league){
      leagueSelect.value=c.targeting.league;
    }
    if(c.targeting.team && teamSelect){
      leagueSelect.dispatchEvent(new Event("change"));
      teamSelect.value=c.targeting.team;
    }
  },100);

  formTitle.innerText="✏️ Kampagne bearbeiten";
  saveBtn.innerText="💾 Aktualisieren";
}

/* DELETE */
function del(id){
  let d=getData();
  d=d.filter(x=>x.id!==id);
  saveData(d);
  render();
}

/* RESET */
function resetForm(){
  document.querySelectorAll("input").forEach(i=>{
    if(i.type!=="file") i.value="";
  });
  donation.value="0";
  editId=null;
}

/* RENDER */
function render(){

  list.innerHTML="";

  getData().forEach(c=>{

    const donationAmount = c.donationAmount ?? (c.budget*(c.donationPercent||0)/100);

    const div=document.createElement("div");
    div.className="adRow";

    div.innerHTML=`
      <div class="adLeft">
        <img src="${c.image}">
        <div>
          <b>${c.name}</b><br>
          ${c.customer}<br>
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

window.onload=render;
