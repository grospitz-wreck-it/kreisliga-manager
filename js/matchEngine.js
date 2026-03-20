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

  // 🔥 andere Spiele sofort simulieren
  matches.forEach(m => {
    if(m !== userMatch){
      simulateQuick(m[0], m[1]);
    }
  });

  // 🔥 Tabelle direkt aktualisieren (wichtig!)
  updateTable();

  if(!userMatch[0] || !userMatch[1]){
    console.error("UserMatch kaputt:", userMatch);
    return;
  }

  // 🔥 Live-Spiel starten
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
// 🎮 LIVE MATCH (FEHLTE STABIL)
// =========================

function simulateLiveMatch(teamA, teamB){

  let scoreA = 0;
  let scoreB = 0;

  updateScoreboard(teamA, teamB, scoreA, scoreB);

  const interval = setInterval(() => {

    currentMinute++;

    // 🔥 Timeline updaten
    updateTimeline(currentMinute);

    // 🔥 Zufällige Events
    if(Math.random() < 0.08){

      let attackBoost = tacticModifier + formationModifier + liveModifier;

      if(Math.random() + attackBoost > 0.5){
        scoreA++;
        addEvent("⚽ Tor für " + teamA.name);
      } else {
        scoreB++;
        addEvent("⚽ Tor für " + teamB.name);
      }

      updateScoreboard(teamA, teamB, scoreA, scoreB);
    }

    // 🔥 Spielende
    if(currentMinute >= 90){

      clearInterval(interval);

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
