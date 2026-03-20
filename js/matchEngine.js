function simulateMatchday(){

  if(isSimulating) return;

  if(!selectedTeam){
    alert("Team wählen!");
    return;
  }

  if(!schedule || schedule.length === 0){
    alert("Liga nicht korrekt geladen!");
    return;
  }

  matchdayResults = [];

  const liveBox = document.getElementById("liveMatch");
  if(liveBox){
    liveBox.innerHTML = "";
  }

  updateTimeline(0);

  const halftime = document.getElementById("halftimePanel");
  if(halftime){
    halftime.style.display = "none";
  }

  currentMatchday++;

  let matches = schedule[currentMatchday - 1];

  if(!matches){
    alert("Keine weiteren Spieltage vorhanden");
    return;
  }

  const matchdayEl = document.getElementById("matchday");
  const startBtn = document.getElementById("startBtn");

  if(matchdayEl){
    matchdayEl.innerText =
      "Spieltag: " + currentMatchday + " / " + schedule.length;
  }

  if(startBtn){
    startBtn.innerText = "⏸ Spiel läuft";
    startBtn.disabled = true;
  }

  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  if(!userMatch){
    console.error("User-Match nicht gefunden!", selectedTeam, matches);
    return;
  }

  matches.forEach(m => {
    if(m !== userMatch){
      simulateQuick(m[0], m[1]);
    }
  });

  updateTable();

  isSimulating = true;
  currentMinute = 0;

  simulateLiveMatch(userMatch[0], userMatch[1]);
}


// =========================
// ⚡ SCHNELLSIMULATION
// =========================

function simulateQuick(teamA, teamB){

  let goalsA = Math.floor(Math.random() * 5);
  let goalsB = Math.floor(Math.random() * 5);

  teamA.played++;
  teamB.played++;

  teamA.goalsFor += goalsA;
  teamA.goalsAgainst += goalsB;

  teamB.goalsFor += goalsB;
  teamB.goalsAgainst += goalsA;

  if(goalsA > goalsB){
    teamA.points += 3;
    teamA.wins++;
    teamB.losses++;
  }
  else if(goalsB > goalsA){
    teamB.points += 3;
    teamB.wins++;
    teamA.losses++;
  }
  else{
    teamA.points += 1;
    teamB.points += 1;
    teamA.draws++;
    teamB.draws++;
  }

  matchdayResults.push({
    home: teamA.name,
    away: teamB.name,
    score1: goalsA,
    score2: goalsB
  });
}


// =========================
// 🎮 LIVE MATCH (FIXED CORE)
// =========================

let matchCards = {};
let halftimePlayed = false;
let currentInterval = null;
let liveScore = null;

function simulateLiveMatch(teamA, teamB){

  if(currentMinute === 0){
    matchCards = {
      [teamA.name]: 0,
      [teamB.name]: 0
    };
    halftimePlayed = false;
  }

  // 🔥 SCORE NICHT RESETTEN
  if(!liveScore){
    liveScore = { t1: teamA, t2: teamB, s1: 0, s2: 0 };
  }

  updateScoreboard(teamA, teamB, liveScore.s1, liveScore.s2);

  startMatchInterval();
}


// =========================
// 🔥 INTERVAL STEUERUNG (NEU)
// =========================

function startMatchInterval(){

  clearInterval(currentInterval);

  currentInterval = setInterval(() => {

    currentMinute++;
    updateTimeline(currentMinute);

    // ⏸ Halbzeit
    if(currentMinute === 45 && !halftimePlayed){

      halftimePlayed = true;

      clearInterval(currentInterval);
      isSimulating = false;

      addEvent("⏸ Halbzeit");

      const panel = document.getElementById("halftimePanel");
      if(panel){
        panel.style.display = "block";
      }

      return;
    }

    // 🔥 EVENTS
    if(Math.random() < 0.3){

      let teamA = liveScore.t1;
      let teamB = liveScore.t2;

      let attackBoost = tacticModifier + formationModifier + liveModifier;
      let attackingTeam = (Math.random() + attackBoost > 0.5) ? "A" : "B";

      let atk = attackingTeam === "A" ? teamA : teamB;
      let def = attackingTeam === "A" ? teamB : teamA;

      let type = Math.random();

      if(type < 0.08){
        addEvent(`🚫 Abseits von ${atk.name}`);
      }
      else if(type < 0.18){
        addEvent(`🟨 Foul von ${def.name}`);
        addEvent(`🎯 Freistoß für ${atk.name}`);
      }
      else if(type < 0.32){
        addEvent(`📐 Ecke für ${atk.name}`);
      }
      else{
        if(Math.random() < 0.3){
          if(attackingTeam === "A") liveScore.s1++;
          else liveScore.s2++;

          addEvent(`⚽ TOR für ${atk.name}`);
        }
      }

      updateScoreboard(
        liveScore.t1,
        liveScore.t2,
        liveScore.s1,
        liveScore.s2
      );
    }

    // 🏁 SPIELENDE
    if(currentMinute >= 90){

      clearInterval(currentInterval);

      let teamA = liveScore.t1;
      let teamB = liveScore.t2;

      let scoreA = liveScore.s1;
      let scoreB = liveScore.s2;

      teamA.played++;
      teamB.played++;

      teamA.goalsFor += scoreA;
      teamA.goalsAgainst += scoreB;

      teamB.goalsFor += scoreB;
      teamB.goalsAgainst += scoreA;

      if(scoreA > scoreB){
        teamA.points += 3;
        teamA.wins++;
        teamB.losses++;
      }
      else if(scoreB > scoreA){
        teamB.points += 3;
        teamB.wins++;
        teamA.losses++;
      }
      else{
        teamA.points += 1;
        teamB.points += 1;
        teamA.draws++;
        teamB.draws++;
      }

      updateTable();

      matchdayResults.push({
        home: teamA.name,
        away: teamB.name,
        score1: scoreA,
        score2: scoreB
      });

      // REPORT
      const box = document.getElementById("newsBox");
      if(box && typeof generateMatchdayReport === "function"){
        box.innerText = generateMatchdayReport(matchdayResults);
      }

      isSimulating = false;
      liveScore = null;

      const startBtn = document.getElementById("startBtn");
      if(startBtn){
        startBtn.innerText = "▶ Nächster Spieltag";
        startBtn.disabled = false;
      }

      addEvent("🏁 Spiel beendet");
    }

  }, 1000 / speedMultiplier);
}


// =========================
// ▶️ 2. HALBZEIT
// =========================

function resumeMatch(){

  const panel = document.getElementById("halftimePanel");
  if(panel){
    panel.style.display = "none";
  }

  addEvent("▶️ Zweite Halbzeit läuft");

  isSimulating = true;

  startMatchInterval(); // 🔥 WICHTIG
}


// =========================
// ⚡ SPEED FIX (FINAL)
// =========================

window.restartInterval = function(){

  if(!isSimulating) return;

  startMatchInterval(); // 🔥 KEIN RESET MEHR
};
