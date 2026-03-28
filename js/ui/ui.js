function updateUI(){

  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("time");

  if(!scoreEl || !timeEl) return;

  scoreEl.textContent =
    matchState.score.home + " : " + matchState.score.away;

  timeEl.textContent = matchState.minute + "'";
}

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
