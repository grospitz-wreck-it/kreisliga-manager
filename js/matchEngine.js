// =========================
// 🔥 MATCH ENGINE (LIVE + STABLE)
// =========================

let matchCards = {};
let halftimePlayed = false;

// =========================
// 🔥 LIVE TABLE UPDATE
// =========================
function updateLiveTable(team1, team2, goals1, goals2){

  if(!team1 || !team2) return;

  let t1 = {...team1};
  let t2 = {...team2};

  // 👉 nur Anzeige (kein echtes State!)
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

  if(typeof updateTable === "function"){
    updateTable(true, t1, t2);
  }
}

// =========================
// 🏆 LEADERBOARD SAVE
// =========================
async function saveScoreToLeaderboard(name, team, score, matchday){

  if(typeof supabase === "undefined"){
    console.warn("Supabase nicht geladen");
    return;
  }

  const { error } = await supabaseClient
    .from("leaderboard")
    .insert([{
      name,
      team,
      score,
      matchday,
      league: currentLeague || localStorage.getItem("selectedLeague"),
      player_id: playerId,
      friend_code: friendCode,
      color: playerColor,
      title: getPlayerTitle(score)
    }]);

  if(error){
    console.error("❌ Fehler beim Speichern:", error);
  }
}

// =========================
// ▶️ SPIELTAG
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
  liveScore = { t1:null, t2:null, s1:0, s2:0 };
  currentMinute = 0;
  halftimePlayed = false;

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

  // 👉 andere Spiele direkt berechnen
  matches.forEach(m => {
    if(m !== userMatch){
      simulateQuick(m[0], m[1]);
    }
  });

  updateTable();
  saveGameState();

  isSimulating = true;

  simulateLiveMatch(userMatch[0], userMatch[1], 0, 0);
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
function simulateLiveMatch(teamA, teamB, scoreA = 0, scoreB = 0){

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

  currentInterval = setInterval(async () => {

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

      saveGameState();
      return;
    }

    // 🔥 EVENTS
    if(Math.random() < 0.3){

      let atk = Math.random() > 0.5 ? teamA : teamB;

      let isA = atk === teamA;

      if(Math.random() < 0.3){

        if(isA) scoreA++; else scoreB++;

        addEvent(`⚽ TOR! ${atk.name}`);

        // 🔥 LIVE TABLE UPDATE
        updateLiveTable(teamA, teamB, scoreA, scoreB);
      }
      else{
        addEvent(`🔥 Chance für ${atk.name}`);
      }

      liveScore.s1 = scoreA;
      liveScore.s2 = scoreB;

      updateScoreboard(teamA, teamB, scoreA, scoreB);
    }

    // 🏁 ENDE
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

      updateTable(); // 🔥 final echte Tabelle

      const playerName = localStorage.getItem("playerName") || "Unbekannt";

      await saveScoreToLeaderboard(
        playerName,
        selectedTeam,
        teamA.name === selectedTeam ? scoreA : scoreB,
        currentMatchday
      );

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

      isSimulating = false;

      document.getElementById("startBtn").innerText = "▶ Nächster Spieltag";
      document.getElementById("startBtn").disabled = false;

      addEvent("🏁 Spiel beendet");

      saveGameState();
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
};
