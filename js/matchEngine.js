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
