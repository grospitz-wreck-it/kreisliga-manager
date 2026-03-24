// =========================
// 🔥 MATCH ENGINE (STABLE CORE)
// =========================

// ✅ FIX: sauber deklariert
currentInterval = null;
halftimePlayed = false;

// ✅ SAFETY
if(typeof speedMultiplier === "undefined"){
  var speedMultiplier = 1;
}

// =========================
// ▶️ MATCHDAY START
// =========================
function simulateMatchday(){

  console.log("🔥 simulateMatchday");

  // 🔥 HARD RESET
  clearInterval(currentInterval);
  isSimulating = false;

  if(!selectedTeam){
    alert("Team wählen!");
    return;
  }

  if(!schedule || schedule.length === 0){
    alert("Liga nicht geladen!");
    return;
  }

  currentMatchday++;

  let matches = schedule[currentMatchday - 1];
  if(!matches){
    alert("Keine weiteren Spieltage");
    return;
  }

  matchdayResults = [];
  currentMinute = 0;
  halftimePlayed = false;

  const liveBox = document.getElementById("liveMatch");
  if(liveBox) liveBox.innerHTML = "";

  updateTimeline(0);

  // 👉 User Match
  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  if(!userMatch){
    console.error("❌ User Match fehlt");
    return;
  }

  // 👉 andere Matches
  matches.forEach(m => {
    if(m !== userMatch){
      simulateQuick(m[0], m[1]);
    }
  });

  liveScore = {
    t1: userMatch[0],
    t2: userMatch[1],
    s1: 0,
    s2: 0
  };

  updateScoreboard(liveScore.t1, liveScore.t2, 0, 0);

  isSimulating = true;

  startMatchLoop();
}

// =========================
// 🔁 GAME LOOP
// =========================
function startMatchLoop(){

  console.log("⏱️ Loop gestartet");

  clearInterval(currentInterval);

  currentInterval = setInterval(()=>{

    // 🔥 SAFETY
    if(!isSimulating) return;

    currentMinute++;

    updateTimeline(currentMinute);

    simulateMinute();

    // ⏸ HALBZEIT
    if(currentMinute === 45 && !halftimePlayed){

      console.log("⏸ Halbzeit");

      halftimePlayed = true;
      isSimulating = false;

      addLiveEvent("⏸ Halbzeit");

      gameState.phase = "halftime";
      updateMainButton();

      return;
    }

    // 🏁 ENDE
    if(currentMinute >= 90){

      endMatch();
    }

  }, Math.max(100, 1000 / speedMultiplier)); // ✅ FIX: nie NaN / 0
}

// =========================
// ⚡ MINUTE
// =========================
function simulateMinute(){

  if(Math.random() < 0.3){

    let atk = Math.random() > 0.5 ? liveScore.t1 : liveScore.t2;
    let isA = atk === liveScore.t1;

    if(Math.random() < 0.3){

      if(isA) liveScore.s1++;
      else liveScore.s2++;

      addLiveEvent(`⚽ TOR! ${atk.name}`);

      updateScoreboard(
        liveScore.t1,
        liveScore.t2,
        liveScore.s1,
        liveScore.s2
      );

      updateLiveTable(
        liveScore.t1,
        liveScore.t2,
        liveScore.s1,
        liveScore.s2
      );
    }
    else{
      addLiveEvent(`🔥 Chance für ${atk.name}`);
    }
  }
}

// =========================
// ▶️ RESUME
// =========================
function resumeMatch(){

  console.log("▶️ Resume");

  addLiveEvent("▶️ Zweite Halbzeit läuft");

  isSimulating = true;

  gameState.phase = "live";
  updateMainButton();

  startMatchLoop();
}

// =========================
// 🏁 MATCH ENDE
// =========================
async function endMatch(){

  console.log("🏁 Spielende");

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

  addLiveEvent("🏁 Spiel beendet");

  matchdayResults.push({
    home: teamA.name,
    away: teamB.name,
    score1: scoreA,
    score2: scoreB
  });

  try{
    if(typeof generateMatchdayReport === "function"){
      document.getElementById("newsBox").innerHTML =
        generateMatchdayReport(matchdayResults);
    }
  } catch(e){
    console.error("Report Fehler:", e);
  }

  const playerName = localStorage.getItem("playerName") || "Unbekannt";

  await saveScoreToLeaderboard(
    playerName,
    selectedTeam,
    teamA.name === selectedTeam ? scoreA : scoreB,
    currentMatchday
  );

  isSimulating = false;

  gameState.phase = "matchday_ready";
  updateMainButton();

  saveGameState?.();
}

// =========================
// ⚡ QUICK MATCH
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
}
