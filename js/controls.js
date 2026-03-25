// =========================
// CONTROLS SAFE
// =========================

var tacticModifier = 0;
var formationModifier = 0;
var liveModifier = 0;
var intensityModifier = 0;
var speedMultiplier = 1;

// =========================
// LEAGUE
// =========================

function selectLeague(){

var league = document.getElementById("leagueSelect").value;

if(!league){
alert("Liga wählen");
return;
}

localStorage.setItem("selectedLeague", league);

loadLeague(league);

if(!game.league.teams || game.league.teams.length === 0){
alert("Fehler beim Laden der Liga");
return;
}

generateSchedule();
populateTeamSelect();
updateTable && updateTable();
updateHeader && updateHeader();

game.phase = "idle";
updateMainButton && updateMainButton();
}

// =========================
// TEAM
// =========================

function selectTeam(){

var team = document.getElementById("teamSelect").value;

if(!team){
alert("Team wählen!");
return;
}

game.team.selected = team;

localStorage.setItem("selectedTeam", team);

var panel = document.getElementById("setupPanel");
if(panel) panel.classList.remove("open");

updateHeader && updateHeader();

game.phase = "idle";
updateMainButton && updateMainButton();
}

// =========================
// LIVE EVENT
// =========================

function addLiveEvent(text, minute){

var box = document.getElementById("liveMatch");
if(!box) return;

var p = document.createElement("p");
p.innerHTML = "<strong>" + (minute || 0) + "'</strong> " + text;

box.prepend(p);

if(box.children.length > 50){
box.removeChild(box.lastChild);
}
}

// =========================
// TAKTIK
// =========================

function setTactic(){

var val = document.getElementById("tacticSelect").value;

if(val === "Offensiv") tacticModifier = 0.02;
else if(val === "Defensiv") tacticModifier = -0.015;
else tacticModifier = 0;

addLiveEvent("Taktik geändert");
}

// =========================
// FORMATION
// =========================

function setFormation(){

var val = document.getElementById("formationSelect").value;

if(val === "4-3-3") formationModifier = 0.01;
else if(val === "3-5-2") formationModifier = 0.005;
else if(val === "5-3-2") formationModifier = -0.015;
else formationModifier = 0;

addLiveEvent("Formation geändert");
}

// =========================
// SPEED
// =========================

function setSpeed(e, multi){

speedMultiplier = multi;

document.querySelectorAll(".speed").forEach(function(b){
b.classList.remove("active");
});

e.target.classList.add("active");

if(game.match.isRunning){
restartInterval();
}
}

// =========================
// PAUSE
// =========================

function pauseMatch(){

game.match.isRunning = false;
game.phase = "ready";

updateMainButton && updateMainButton();

addLiveEvent("Spiel pausiert");
}

// =========================
// SETUP TOGGLE
// =========================

function toggleSetup(){

var panel = document.getElementById("setupPanel");
if(!panel) return;

panel.classList.toggle("open");
}
