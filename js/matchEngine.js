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

  // 🔥 FIX: Events resetten
  const liveBox = document.getElementById("liveMatch");
  if(liveBox){
    liveBox.innerHTML = "";
  }

  // 🔥 FIX: Timeline reset
  updateTimeline(0);

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

  matchdayResults.push(
    `${teamA.name} ${goalsA}:${goalsB} ${teamB.name}`
  );
}


// =========================
// 🎮 LIVE MATCH
// =========================

let matchCards = {}; // 🔥 NEU

function simulateLiveMatch(teamA, teamB){

  let scoreA = 0;
  let scoreB = 0;

  // 🔥 Karten reset
  matchCards = {
    [teamA.name]: 0,
    [teamB.name]: 0
  };

  liveScore = { t1: teamA, t2: teamB, s1: scoreA, s2: scoreB };

  updateScoreboard(teamA, teamB, scoreA, scoreB);

  currentInterval = setInterval(() => {

    currentMinute++;

    updateTimeline(currentMinute);

    // =========================
    // 🔥 NEUES REALISTISCHES EVENT SYSTEM
    // =========================
    if(Math.random() < 0.3){

      let attackBoost = tacticModifier + formationModifier + liveModifier;

      let attackingTeam = (Math.random() + attackBoost > 0.5) ? "A" : "B";

      let atk = attackingTeam === "A" ? teamA : teamB;
      let def = attackingTeam === "A" ? teamB : teamA;

      let type = Math.random();

      // 🚫 Abseits
      if(type < 0.08){
        addEvent(`🚫 Abseits von ${atk.name}`);
      }

      // 🟨 Foul + Freistoß
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

      // 🟥 Rot direkt
      else if(type < 0.21){
        addEvent(`🟥 Platzverweis für ${def.name}`);
      }

      // 📐 Ecke
      else if(type < 0.32){

        addEvent(`📐 Ecke für ${atk.name}`);

        if(Math.random() < 0.15){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ Kopfballtor nach Ecke! ${atk.name}`);
        } else {
          addEvent(`🧤 geklärt von ${def.name}`);
        }
      }

      // ⚽ Elfmeter
      else if(type < 0.38){

        addEvent(`⚠️ Foul im Strafraum! Elfmeter für ${atk.name}`);

        if(Math.random() < 0.75){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ Elfmeter verwandelt! ${atk.name}`);
        } else {
          addEvent(`❌ Elfmeter verschossen!`);
        }
      }

      // 🔥 Große Chance
      else if(type < 0.55){

        addEvent(`🔥 Riesenchance für ${atk.name}`);

        if(Math.random() < 0.45){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ TOR! ${atk.name}`);
        } else {
          addEvent(`😱 Knapp vorbei!`);
        }
      }

      // 🎯 Schuss
      else{

        addEvent(`🎯 Schuss von ${atk.name}`);

        if(Math.random() < 0.2){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ TOR! ${atk.name}`);
        }
      }

      // 🔥 Score speichern für Restart
      liveScore.s1 = scoreA;
      liveScore.s2 = scoreB;

      updateScoreboard(teamA, teamB, scoreA, scoreB);
    }

    // =========================
    // 🏁 SPIELENDE
    // =========================
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
// ⚡ SPEED FIX
// =========================

window.restartInterval = function(){

  if(!isSimulating) return;

  clearInterval(currentInterval);

  simulateLiveMatch(
    liveScore.t1,
    liveScore.t2
  );
}
