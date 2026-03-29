// =========================
// 📦 STORAGE
// =========================
function getCampaigns(){
  return JSON.parse(localStorage.getItem("ad_v2") || "[]");
}

// =========================
// 🎯 MATCHING
// =========================
function getMatchingAds(){

  const now = Date.now();

  return getCampaigns().filter(c => {

    if(c.start && now < c.start) return false;
    if(c.end && now > c.end) return false;

    if(c.targeting?.global) return true;

    if(c.targeting?.league === game.league.key) return true;

    if(c.targeting?.team){
      return c.targeting.team === game.team.selected || c.targeting.team === "all";
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

  const ads = getMatchingAds();

  if(!ads.length){
    el.innerHTML = `<div style="color:#fff">Keine Werbung</div>`;
    return;
  }

  // 👉 Zufällige Reihenfolge für Variation
  const shuffled = ads.sort(() => Math.random() - 0.5);

  // 👉 max 5 gleichzeitig anzeigen
  const visible = shuffled.slice(0, 5);

  const loop = [...visible, ...visible];

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
// 🎨 STYLES
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
      animation:scroll 20s linear infinite;
    }

    .ads img{
      height:50px;
      transition:.3s;
      filter:brightness(.95);
    }

    .ads img:hover{
      transform:scale(1.08);
      filter:brightness(1.1);
    }

    @keyframes scroll{
      from{transform:translateX(0)}
      to{transform:translateX(-50%)}
    }
  `;

  document.head.appendChild(s);
}

// =========================
// 🚀 ENGINE
// =========================
window.startAdEngine = function(){

  console.log("📢 Ad Engine gestartet");

  injectStyles();

  // 👉 initial
  renderAds();

  // 👉 alle 8s neue Ads rein (wie Rotation)
  setInterval(renderAds, 8000);
};
