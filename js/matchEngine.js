// =========================
// 🔥 MATCH ENGINE (CLEAN FINAL FIXED)
// =========================

let matchCards = {};
let halftimePlayed = false;


// =========================
// 🏆 LEADERBOARD SAVE (GLOBAL!)
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
    player_id: playerId,
    league: currentLeague,
    friend_code: friendCode,
    color: playerColor,
    title: getPlayerTitle(score)
  }]);

  if(error){
    console.error("❌ Fehler beim Speichern:", error);
  } else {
    console.log("🏆 Score gespeichert!");
  }
}


// =========================
// ▶️ SPIELTAG STARTEN
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

  // 🔥 RESET
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

  if(!userMatch){
    console.error("User-Match nicht gefunden!");
    return;
  }

  // ⚡ andere Spiele
  matches.forEach(m => {
    if(m !== userMatch){
      simulateQuick(m[0], m[1]);
    }
  });

  updateTable();

  // 💾 SAVE
  saveGameState();

  isSimulating = true;

  simulateLiveMatch(userMatch[0], userMatch[1], 0, 0);
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

  // ✅ FIX: async hinzugefügt
  currentInterval = setInterval(async () => {

    currentMinute++;
    updateTimeline(currentMinute);

    // =========================
    // ⏸ HALBZEIT
    // =========================
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

    // =========================
    // 🔥 EVENTS
    // =========================
    if(Math.random() < 0.3){

      let attackBoost = tacticModifier + formationModifier + liveModifier;
      let attackingTeam = (Math.random() + attackBoost > 0.5) ? "A" : "B";

      let atk = attackingTeam === "A" ? teamA : teamB;

      let type = Math.random();

      if(type < 0.1){
        addEvent(`🚫 Abseits von ${atk.name}`);
      }
      else if(type < 0.3){
        addEvent(`📐 Ecke für ${atk.name}`);
        if(Math.random() < 0.2){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ Tor nach Ecke! ${atk.name}`);
        }
      }
      else{
        addEvent(`🔥 Chance für ${atk.name}`);
        if(Math.random() < 0.3){
          if(attackingTeam === "A") scoreA++; else scoreB++;
          addEvent(`⚽ TOR! ${atk.name}`);
        }
      }

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

      // ✅ FIX: saubere Nutzung deiner Funktion
      await saveScoreToLeaderboard(
        selectedTeam || "Unbekannt",
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

      // 📰 REPORT
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

      // 💾 FINAL SAVE
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

  saveGameState();

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
