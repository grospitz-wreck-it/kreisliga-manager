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

  const match = game.match?.current;

  const seasonYear = game.season?.year ?? 1;
  const matchday = (game.league?.currentRound ?? 0) + 1;

  // ❌ KEIN MATCH
  if(!match){
    scoreEl.textContent = "0 : 0";
    matchEl.textContent = `Saison ${seasonYear} | Kein Spiel aktiv`;
    progress.style.width = "0%";
    return;
  }

  // ⚽ SCORE
  scoreEl.textContent =
    matchState.score.home + " : " + matchState.score.away;

  // 📅 INFO
  matchEl.textContent =
    `Saison ${seasonYear} | Spieltag ${matchday} | ` +
    `${match.home.name} vs ${match.away.name} | ${matchState.minute}'`;

  // 📊 PROGRESS
  const percent = Math.min((matchState.minute / 90) * 100, 100);
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
    <h3>${match.home.name} vs ${match.away.name}</h3>
  `;
}


// =========================
// 📡 LIVE FEED
// =========================
function renderLiveFeed(){

  const el = document.getElementById("liveFeed");
  if(!el) return;

  el.innerHTML = matchState.events
    .map(e => `<p>${e}</p>`)
    .join("");
}


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
// 🌍 GLOBAL (EINMAL!)
// =========================
window.updateUI = updateUI;
window.renderSchedule = renderSchedule;
window.renderCurrentMatch = renderCurrentMatch;
window.renderLiveFeed = renderLiveFeed;
