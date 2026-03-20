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

  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday + " / " + schedule.length;

  document.getElementById("startBtn").innerText = "⏸ Spiel läuft";
  document.getElementById("startBtn").disabled = true;

  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  if(!userMatch){
    console.error("User-Match nicht gefunden!", selectedTeam);
    return;
  }

  matches.forEach(m => {
    if(m !== userMatch){
      simulateQuick(m[0], m[1]);
    }
  });

  simulateLiveMatch(userMatch[0], userMatch[1]);
}
