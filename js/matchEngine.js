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

  // ✅ FIX: richtiger Index
  let matches = schedule[currentMatchday - 1];

  if(!matches){
    alert("Keine weiteren Spieltage vorhanden");
    return;
  }

  // ✅ FIX: DOM Safety (verhindert silent crashes)
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

  // ✅ FIX: zusätzliche Absicherung
  if(!userMatch[0] || !userMatch[1]){
    console.error("UserMatch kaputt:", userMatch);
    return;
  }

  simulateLiveMatch(userMatch[0], userMatch[1]);
}
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

  // optional (für News etc.)
  matchdayResults.push(
    `${teamA.name} ${goalsA}:${goalsB} ${teamB.name}`
  );
}
