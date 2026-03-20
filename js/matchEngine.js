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

  if(!userMatch[0] || !userMatch[1]){
    console.error("UserMatch kaputt:", userMatch);
    return;
  }

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

let matchCards = {};
let halftimePlayed = false;

function simulateLiveMatch(teamA, teamB, scoreA = liveScore?.s1 || 0, scoreB = liveScore?.s2 || 0){

  if(currentMinute === 0){
    matchCards = {
      [teamA.name]: 0,
      [teamB.name]: 0
    };
    halftimePlayed = false;
  }

  liveScore = { t1: teamA, t2: teamB, s1: scoreA, s2: scoreB };

  updateScoreboard(teamA, teamB, scoreA, scoreB);

  // 🔥 FIX: immer vorher clearen
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

        if(Math.random() < 0.4){

          matchCards[def.name]++;

          if(matchCards[def.name] === 2 && Math.random() < 0.5){
            addEvent(`🟨🟥 Gelb-Rot für ${def.name}`);
          }
          else{
            addEvent(`🟨 Gelbe Karte für ${def.name}`);
          }
        }

        addEvent(`🎯 Freistoß für ${atk.name}`);

        if(Math.random() < 0.12){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ Traumtor per Freistoß! ${atk.name}`);
        }
      }

      else if(type < 0.21){
        addEvent(`🟥 Platzverweis für ${def.name}`);
      }

      else if(type < 0.32){

        addEvent(`📐 Ecke für ${atk.name}`);

        if(Math.random() < 0.15){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ Kopfballtor nach Ecke! ${atk.name}`);
        } else {
          addEvent(`🧤 geklärt von ${def.name}`);
        }
      }

      else if(type < 0.38){

        addEvent(`⚠️ Foul im Strafraum! Elfmeter für ${atk.name}`);

        if(Math.random() < 0.75){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ Elfmeter verwandelt! ${atk.name}`);
        } else {
          addEvent(`❌ Elfmeter verschossen!`);
        }
      }

      else if(type < 0.55){

        addEvent(`🔥 Riesenchance für ${atk.name}`);

        if(Math.random() < 0.45){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ TOR! ${atk.name}`);
        } else {
          addEvent(`😱 Knapp vorbei!`);
        }
      }

      else{

        addEvent(`🎯 Schuss von ${atk.name}`);

        if(Math.random() < 0.2){
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

      let report = "⚠️ Spielbericht konnte nicht generiert werden.";

      try{
        if(typeof generateMatchdayReport === "function"){
          report = generateMatchdayReport(matchdayResults);
        }
      } catch(e){
        console.error(e);
      }

      const box = document.getElementById("newsBox");
      if(box){
        box.innerText = report;
      }

      isSimulating = false;

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

  simulateLiveMatch(
    liveScore.t1,
    liveScore.t2,
    liveScore.s1,
    liveScore.s2
  );
}


// =========================
// ⚡ SPEED FIX
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
}
