function createTable(){

  game.table = game.league.teams.map(t => ({
    name: t.name,
    pts: 0,
    gd: 0,
    scored: 0,
    conceded: 0,
    played: 0
  }));
}

// =========================
// 📊 UPDATE TABLE
// =========================
function updateTable(home, away, goalsHome, goalsAway){

  const h = game.table.find(t => t.name === home.name);
  const a = game.table.find(t => t.name === away.name);

  // 🔥 SAFETY CHECK
  if(!h || !a){
    console.error("❌ Team nicht in Tabelle gefunden", home, away);
    return;
  }

  h.played++;
  a.played++;

  h.scored += goalsHome;
  h.conceded += goalsAway;

  a.scored += goalsAway;
  a.conceded += goalsHome;

  h.gd = h.scored - h.conceded;
  a.gd = a.scored - a.conceded;

  if(goalsHome > goalsAway){
    h.pts += 3;
  } else if(goalsAway > goalsHome){
    a.pts += 3;
  } else {
    h.pts += 1;
    a.pts += 1;
  }

  sortTable();
}

function sortTable(){
  game.table.sort((a,b) =>
    b.pts - a.pts || b.gd - a.gd
  );
}

// =========================
// 🖥 RENDER
// =========================
function renderTable(){

  const el = document.getElementById("table");
  if(!el) return;

  el.innerHTML = "";

  game.table.forEach((t,i) => {

    const div = document.createElement("div");

    let marker = "";

    if(i === 0) marker = "⬆️";
    if(i >= 14) marker = "⬇️";

    div.innerText =
      `${i+1}. ${t.name} ${t.pts}P (${t.gd}) ${marker}`;

    el.appendChild(div);
  });
}

window.createTable = createTable;
window.updateTable = updateTable;
window.renderTable = renderTable;
