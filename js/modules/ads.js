// =========================
// 📦 STORAGE
// =========================
function getCampaigns(){
  return JSON.parse(localStorage.getItem("ad_v2") || "[]");
}

// =========================
// 🎯 MATCHING
// =========================
function getMatchingAds(ctx){

  const now = Date.now();

  return getCampaigns().filter(c => {

    if(!c) return false;

    if(c.start && now < c.start) return false;
    if(c.end && now > c.end) return false;

    if(c.targeting?.global) return true;

    if(c.targeting?.league === ctx.league) return true;

    if(c.targeting?.team){
      return c.targeting.team === ctx.team || c.targeting.team === "all";
    }

    return false;
  });
}

// =========================
// 🎬 RENDER
// =========================
function renderAds(){

  const el = document.getElementById("adTrack");
  if(!el) return;

  const ads = getMatchingAds({
    league: game.league.key,
    team: game.team.selected
  });

  if(!ads.length){
    el.innerHTML = `<div style="color:#fff">Keine Werbung</div>`;
    return;
  }

  // 👉 Loop erzeugen
  const loop = [...ads, ...ads];

  el.innerHTML = `
    <div class="ads">
      ${loop.map(a => `
        <a href="${a.link || '#'}" target="_blank">
          <img src="${a.image}">
        </a>
      `).join("")}
    </div>
  `;
}

// =========================
// 🎨 STYLES (LEAN)
// =========================
function injectStyles(){

  if(document.getElementById("ads-css")) return;

  const s = document.createElement("style");
  s.id = "ads-css";

  s.innerHTML = `
    #adTrack{
      overflow:hidden;
      background:#111;
      height:70px;
      display:flex;
      align-items:center;
    }

    .ads{
      display:flex;
      gap:40px;
      animation:scroll 25s linear infinite;
    }

    .ads img{
      height:50px;
      transition:.3s;
    }

    .ads img:hover{
      transform:scale(1.05);
    }

    @keyframes scroll{
      from{transform:translateX(0)}
      to{transform:translateX(-50%)}
    }
  `;

  document.head.appendChild(s);
}

// =========================
// 🚀 START
// =========================
window.startAdEngine = function(){

  injectStyles();
  renderAds();

  setInterval(renderAds, 10000);
};
