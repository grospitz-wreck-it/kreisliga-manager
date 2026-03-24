// =========================
// 🔥 MATCH ENGINE (NEW CORE)
// =========================

currentInterval = null;
let halftimePlayed = false;

// =========================
// ▶️ MATCHDAY START
// =========================
function simulateMatchday(){

  if(isSimulating) return;

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

  // 👉 User Match finden
  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  if(!userMatch){
    console.error("User Match nicht gefunden");
    return;
  }

  // 👉 andere Matches sofort simulieren
  matches.forEach(m => {
    if(m !== userMatch){
      simulateQuick(m[0], m[1]);
    }
  });

  // 👉 Live Setup
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

  clearInterval(currentInterval);

  currentInterval = setInterval(()=>{

    if(!isSimulating) return;

    currentMinute++;

    updateTimeline(currentMinute);

    simulateMinute();

    // ⏸ HALBZEIT
    if(currentMinute === 45 && !halftimePlayed){

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

  }, 1000 / speedMultiplier);
}

// =========================
// ⚡ MINUTE SIMULATION
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
// ▶️ RESUME (2. Halbzeit)
// =========================
function resumeMatch(){

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

  clearInterval(currentInterval);

  let teamA = liveScore.t1;
  let teamB = liveScore.t2;
  let scoreA = liveScore.s1;
  let scoreB = liveScore.s2;

  // 👉 Tabelle aktualisieren
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

  // 👉 Report
  matchdayResults.push({
    home: teamA.name,
    away: teamB.name,
    score1: scoreA,
    score2: scoreB
  });

  if(typeof generateMatchdayReport === "function"){
    document.getElementById("newsBox").innerHTML =
      generateMatchdayReport(matchdayResults);
  }

  // 👉 Leaderboard
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
// ⚡ QUICK MATCH (UNVERÄNDERT)
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
