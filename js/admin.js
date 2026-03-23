function createAd(){

  const title = document.getElementById("adTitle").value;
  const text = document.getElementById("adText").value;

  if(!title || !text){
    alert("Bitte alles ausfüllen");
    return;
  }

  addAd({
    title,
    text,
    active: true
  });

  renderAds();
}

function renderAds(){

  const box = document.getElementById("adList");
  if(!box) return;

  box.innerHTML = "";

  ads.forEach((ad, i) => {

    const div = document.createElement("div");

    div.innerHTML = `
      <strong>${ad.title}</strong><br>
      ${ad.text}<br>
      Status: ${ad.active ? "🟢 aktiv" : "🔴 aus"}<br>
      <button onclick="toggleAd(${i}); renderAds()">Toggle</button>
    `;

    box.appendChild(div);
  });
}
