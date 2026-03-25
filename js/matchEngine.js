// =========================
// 🔥 MATCH ENGINE (FINAL FIXED)
// =========================

// =========================
// 🏆 LEADERBOARD (GLOBAL SAFE)
// =========================
window.saveScoreToLeaderboard = window.saveScoreToLeaderboard || async function(player, team, score, matchday){

  let data = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  data.push({
    player,
    team,
    score,
    matchday,
    date: Date.now()
  });

  localStorage.setItem("leaderboard", JSON.stringify(data));

  console.log("📊 Score gespeichert");
};

// =========================
// 🌍 GLOBAL STATE SAFE
// =========================
window.currentInterval = window.currentInterval || null;
window.halftimePlayed = window.halftimePlayed || false;
window.liveScore = window.liveScore || null;

if(typeof speedMultiplier !== "number" || speedMultiplier <= 0){
  speedMultiplier = 1;
}

// =========================
// 📊 SAFE TIMELINE
// =========================
function updateTimelineSafe(minute){
  try{
    const el = document.getElementById("timeline");
    if(!el) return;

    const percent = Math.min(100, (minute / 90) * 100);
    el.style.width = percent + "%";
  } catch(e){
    console.warn("Timeline Fehler", e);
  }
}

// =========================
// 📊 LIVE TABLE UPDATE
// =========================
function updateLiveTable(team1, team2, goals1, goals2){

  if(typeof updateTable !== "function") return;

  let t1 = {...team1};
  let t2 = {...team2};

  t1.goalsFor += goals1;
  t1.goalsAgainst += goals2;

  t2.goalsFor += goals2;
  t2.goalsAgainst += goals1;

  if(goals1 > goals2){
    t1.points += 3;
  } else if(goals2 > goals1){
    t2.points += 3;
  } else {
    t1.points += 1;
    t2.points += 1;
  }

  updateTable(true, t1, t2);
}

// =========================
// ▶️ MATCHDAY START
// =========================
function simulateMatchday(){

  console.log("🔥 simulateMatchday");

  clearInterval(window.currentInterval);
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
  window.halftimePlayed = false;

  document.getElementById("liveMatch")?.replaceChildren();

  updateTimelineSafe(0);

  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  if(!userMatch){
    console.error("❌ User Match fehlt");
    return;
  }

  matches.forEach(m => {
    if(m !== userMatch){
      simulateQuick(m[0], m[1]);
    }
  });

  window.liveScore = {
    t1: userMatch[0],
    t2: userMatch[1],
    s1: 0,
    s2: 0
  };

  updateScoreboard?.(liveScore.t1, liveScore.t2, 0, 0);

  isSimulating = true;

  startMatchLoop();
}

// =========================
// 🔁 GAME LOOP
// =========================
function startMatchLoop(){

  console.log("⏱️ Loop gestartet");

  clearInterval(window.currentInterval);

  window.currentInterval = setInterval(()=>{

    if(!isSimulating) return;
    if(!window.liveScore) return;

    currentMinute++;

    updateTimelineSafe(currentMinute);

    simulateMinute();

    // ⏸ HALBZEIT
    if(currentMinute === 45 && !window.halftimePlayed){

      window.halftimePlayed = true;
      isSimulating = false;

      addLiveEvent?.("⏸ Halbzeit");

      gameState.phase = "halftime";
      updateMainButton?.();

      return;
    }

    // 🏁 ENDE
    if(currentMinute >= 90){
      endMatch();
    }

  }, Math.max(100, 1000 / speedMultiplier));
}

// =========================
// ⚡ MINUTE SIMULATION
// =========================
function simulateMinute(){

  if(!window.liveScore) return;

  if(Math.random() < 0.3){

    let atk = Math.random() > 0.5 ? liveScore.t1 : liveScore.t2;
    let isA = atk === liveScore.t1;

    if(Math.random() < 0.3){

      if(isA) liveScore.s1++;
      else liveScore.s2++;

      addLiveEvent?.(`⚽ TOR! ${atk.name}`);

      updateScoreboard?.(
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

    } else {
      addLiveEvent?.(`🔥 Chance für ${atk.name}`);
    }
  }
}

// =========================
// ▶️ RESUME
// =========================
function resumeMatch(){

  console.log("▶️ Resume");

  isSimulating = true;

  gameState.phase = "live";
  updateMainButton?.();

  startMatchLoop();
}

// =========================
// 🏁 MATCH ENDE
// =========================
async function endMatch(){

  console.log("🏁 Spielende");

  clearInterval(window.currentInterval);

  if(!window.liveScore) return;

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

  updateTable?.();

  addLiveEvent?.("🏁 Spiel beendet");

  matchdayResults.push({
    home: teamA.name,
    away: teamB.name,
    score1: scoreA,
    score2: scoreB
  });

  try{
    document.getElementById("newsBox").innerHTML =
      generateMatchdayReport?.(matchdayResults) || "";
  } catch(e){
    console.warn("Report Fehler", e);
  }

  await window.saveScoreToLeaderboard(
    localStorage.getItem("playerName") || "Unbekannt",
    selectedTeam,
    teamA.name === selectedTeam ? scoreA : scoreB,
    currentMatchday
  );

  isSimulating = false;

  gameState.phase = "matchday_ready";
  updateMainButton?.();

  saveGameState?.();
}

// =========================
// ⚡ SPEED FIX
// =========================
window.restartInterval = function(){
  if(!isSimulating) return;
  startMatchLoop();
};

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
