
// =========================
// 🧭 HEADER UPDATE
// =========================
import { game } from "../core/state.js";

function updateHeader(){

const nameEl = document.getElementById("headerName");
const teamEl = document.getElementById("headerTeam");

if(nameEl){
nameEl.textContent = game.player?.name || "Manager";
}

if(teamEl){
teamEl.textContent = game.team?.selected || "Kein Team";
}
}

export { updateHeader };


// =========================
// 🔄 UI UPDATE
// =========================
function updateUI(){

const scoreEl = document.getElementById("score");
const matchEl = document.getElementById("match");
const progress = document.getElementById("progressFill");

if(!scoreEl || !matchEl || !progress) return;

const match = game.match.current;
const live  = game.match.live;

const seasonYear = game.season.year;
const matchday = game.league.currentRound + 1;

// 👉 Kein Spiel aktiv
if(!match){
scoreEl.textContent = "0 : 0";
matchEl.textContent = `Saison ${seasonYear} | Kein Spiel aktiv`;
progress.style.width = "0%";
return;
}

// 👉 Score
scoreEl.textContent =
`${live.score.home} : ${live.score.away}`;

// 👉 Match Info
matchEl.textContent =
`Saison ${seasonYear} | Spieltag ${matchday} | ` +
`${match.home.name} vs ${match.away.name} | ${live.minute}'`;

// 👉 Fortschritt
const percent = Math.min((live.minute / 90) * 100, 100);
progress.style.width = percent + "%";
}

// =========================
// 🎮 MATCH VIEW
// =========================
function renderCurrentMatch(){

const el = document.getElementById("currentMatch");
if(!el) return;

const match = game.match.current;

if(!match){
el.innerHTML = "Kein Spiel aktiv";
return;
}

el.innerHTML = `     <h3>${match.home.name} vs ${match.away.name}</h3>
  `;
}

// =========================
// 📡 LIVE FEED
// =========================
function renderLiveFeed(){

const el = document.getElementById("liveFeed");
if(!el) return;

const events = game.match.live.events;

el.innerHTML = events
.map(e => `<p>${e}</p>`)
.join("");
}

// =========================
// 📅 SPIELPLAN
// =========================
function renderSchedule(){

const el = document.getElementById("schedule");
if(!el) return;

const roundIndex = game.league.currentRound;
const round = game.league.schedule[roundIndex];

if(!round){
el.innerHTML = "Kein Spielplan";
return;
}

let html = `<h3>Spieltag ${roundIndex + 1}</h3>`;

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
// 📦 EXPORTS
// =========================
export {
updateUI,
renderCurrentMatch,
renderLiveFeed,
renderSchedule
};
