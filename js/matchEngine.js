// =========================
// 🔥 MATCH ENGINE (FINAL FIXED)
// =========================

// ⚠️ KEINE globalen Variablen doppelt deklarieren!
// currentInterval, speedMultiplier etc. kommen aus state.js

let matchCards = {};
let halftimePlayed = false;

// =========================
// ▶️ SPIELTAG STARTEN
// =========================

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
  if(liveBox) liveBox.innerHTML = "";

  updateTimeline(0);

  const halftime = document.getElementById("halftimePanel");
  if(halftime) halftime.style.display = "none";

  currentMatchday++;

  let matches = schedule[currentMatchday - 1];

  if(!matches){
    alert("Keine weiteren Spieltage vorhanden");
    return;
  }

  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday + " / " + schedule.length;

  const startBtn = document.getElementById("startBtn");
  if(startBtn){
    startBtn.innerText = "⏸ Spiel läuft";
    startBtn.disabled = true;
  }

  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  if(!userMatch){
    console.error("User-Match nicht gefunden!");
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
// 🎮 LIVE MATCH
// =========================

function simulateLiveMatch(teamA, teamB, scoreA = liveScore.s1, scoreB = liveScore.s2){

  // 🔥 nur beim ersten Start reset
  if(currentMinute === 0){
    matchCards = {
      [teamA.name]: 0,
      [teamB.name]: 0
    };
    halftimePlayed = false;
  }

  liveScore = { t1: teamA, t2: teamB, s1: scoreA, s2: scoreB };

  updateScoreboard(teamA, teamB, scoreA, scoreB);

  clearInterval(currentInterval);

  currentInterval = setInterval(() => {

    currentMinute++;
    updateTimeline(currentMinute);

    // ⏸ HALBZEIT
    if(currentMinute === 45 && !halftimePlayed){

      halftimePlayed = true;

      clearInterval(currentInterval);
      isSimulating = false;

      addEvent("⏸ Halbzeit");

      const panel = document.getElementById("halftimePanel");
      if(panel) panel.style.display = "block";

      return;
    }

    // 🔥 EVENTS
    if(Math.random() < 0.3){

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

        if(Math.random() < 0.12){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ Freistoßtor! ${atk.name}`);
        }
      }
      else if(type < 0.32){
        addEvent(`📐 Ecke für ${atk.name}`);

        if(Math.random() < 0.15){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ Tor nach Ecke! ${atk.name}`);
        }
      }
      else{
        addEvent(`🔥 Chance für ${atk.name}`);

        if(Math.random() < 0.25){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ TOR! ${atk.name}`);
        }
      }

      liveScore.s1 = scoreA;
      liveScore.s2 = scoreB;

      updateScoreboard(teamA, teamB, scoreA, scoreB);
    }

    // 🏁 SPIELENDE
    if(currentMinute >= 90){

      clearInterval(currentInterval);

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

      // 📰 REPORT
      try{
        if(typeof generateMatchdayReport === "function"){
          document.getElementById("newsBox").innerText =
            generateMatchdayReport(matchdayResults);
        }
      } catch(e){
        console.error("Report Fehler:", e);
      }

      isSimulating = false;

      document.getElementById("startBtn").innerText = "▶ Nächster Spieltag";
      document.getElementById("startBtn").disabled = false;

      addEvent("🏁 Spiel beendet");
    }

  }, 1000 / speedMultiplier);
}


// =========================
// ▶️ 2. HALBZEIT
// =========================

function resumeMatch(){

  document.getElementById("halftimePanel").style.display = "none";

  addEvent("▶️ Zweite Halbzeit läuft");

  isSimulating = true;

  simulateLiveMatch(
    liveScore.t1,
    liveScore.t2,
    liveScore.s1,
    liveScore.s2
  );
}


// =========================
// ⚡ SPEED FIX (FINAL)
// =========================

window.restartInterval = function(){

  if(!isSimulating) return;

  clearInterval(currentInterval);

  simulateLiveMatch(
    liveScore.t1,
    liveScore.t2,
    liveScore.s1,
    liveScore.s2
  );
};
