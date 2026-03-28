// =========================
// 🔄 UI UPDATE
// =========================
function updateUI(){

  const scoreEl = document.getElementById("score");
  const matchEl = document.getElementById("match");
  const progress = document.getElementById("progressFill");

  if(!scoreEl || !matchEl || !progress){
    console.warn("⚠️ UI Elemente fehlen");
    return;
  }

  const match = game.match.current;

  if(!match) return;

  // ⚽ Score
  scoreEl.textContent =
    matchState.score.home + " : " + matchState.score.away;

  // ⏱️ Zeit + Teams
  matchEl.textContent =
    `${match.home.name} vs ${match.away.name} | ${matchState.minute}'`;

  // 📊 Fortschritt
  const percent = (matchState.minute / 90) * 100;
  progress.style.width = percent + "%";
}

// =========================
// 🎮 AKTUELLES SPIEL
// =========================
function renderCurrentMatch(){

  const el = document.getElementById("currentMatch");

  if(!el) return;

  const match = game.match.current;

  if(!match){
    el.innerHTML = "Kein Spiel aktiv";
    return;
  }

  el.innerHTML = `
    <b>${match.home.name}</b> vs <b>${match.away.name}</b>
  `;
}
function renderLiveFeed(){

  const el = document.getElementById("liveFeed");

  if(!el) return;

  el.innerHTML = matchState.events
    .map(e => `<p>${e}</p>`)
    .join("");
}

window.renderLiveFeed = renderLiveFeed;
// =========================
// 📅 SPIELPLAN
// =========================
function renderSchedule(){

  const el = document.getElementById("schedule");

  if(!el) return;

  const round = game.league.schedule?.[game.league.currentRound];

  if(!round){
    el.innerHTML = "Kein Spielplan";
    return;
  }

  let html = `<h3>Spieltag ${game.league.currentRound + 1}</h3>`;

  round.forEach(match => {

    const result = match.result
      ? `${match.result.home}:${match.result.away}`
      : "-:-";

    html += `
      <div>
        ${match.home.name} vs ${match.away.name} (${result})
      </div>
    `;
  });

  el.innerHTML = html;
}

// =========================
// 🌍 GLOBAL
// =========================
window.updateUI = updateUI;
window.renderSchedule = renderSchedule;
window.renderCurrentMatch = renderCurrentMatch;

function renderCurrentMatch(){

  const el = document.getElementById("currentMatch");

  if(!el) return;

  const match = game.match.current;

  if(!match){
    el.innerHTML = "Kein Spiel aktiv";
    return;
  }

  el.innerHTML = `
    <h3>${match.home.name} vs ${match.away.name}</h3>
  `;
}

function renderSchedule(){

  const el = document.getElementById("schedule");

  if(!el) return;

  const round = game.league.schedule?.[game.league.currentRound];

  if(!round){
    el.innerHTML = "Kein Spielplan";
    return;
  }

  let html = `<h3>Spieltag ${game.league.currentRound + 1}</h3>`;

  round.forEach(match => {

    const result = match.result
      ? `${match.result.home}:${match.result.away}`
      : "-:-";

    html += `
      <div>
        ${match.home.name} vs ${match.away.name} (${result})
      </div>
    `;
  });

  el.innerHTML = html;
}

// 🔥 GLOBAL
window.updateUI = updateUI;
window.renderSchedule = renderSchedule;
window.renderCurrentMatch = renderCurrentMatch;
