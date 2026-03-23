// =========================
// 🔥 MATCH ENGINE (REFACTORED CLEAN VERSION)
// =========================

let matchCards = {};
let halftimePlayed = false;

// =========================
// 🏆 LEADERBOARD SERVICE
// =========================

async function saveScore(name, team, score, matchday){
  try{
    if(typeof supabaseClient === "undefined"){
      console.warn("Supabase Client fehlt");
      return;
    }

    const { error } = await supabaseClient
      .from("leaderboard")
      .insert([{ name, team, score, matchday }]);

    if(error) throw error;

    console.log("🏆 Score gespeichert!");

  } catch(e){
    console.error("❌ Leaderboard Fehler:", e);
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

  resetMatchState();

  currentMatchday++;

  const matches = schedule[currentMatchday - 1];

  if(!matches){
    alert("Keine weiteren Spieltage vorhanden");
    return;
  }

  updateMatchdayUI();

  const userMatch = findUserMatch(matches);

  if(!userMatch){
    console.error("User-Match nicht gefunden!");
    return;
  }

  simulateOtherMatches(matches, userMatch);

  updateTable();
  saveGameState();

  isSimulating = true;

  simulateLiveMatch(userMatch[0], userMatch[1]);
}


// =========================
// 🧹 RESET
// =========================

function resetMatchState(){
  matchdayResults = [];
  liveScore = { t1:null, t2:null, s1:0, s2:0 };
  currentMinute = 0;
  halftimePlayed = false;

  const liveBox = document.getElementById("liveMatch");
  if(liveBox) liveBox.innerHTML = "";

  updateTimeline(0);

  const halftime = document.getElementById("halftimePanel");
  if(halftime) halftime.style.display = "none";
}


// =========================
// 🔍 USER MATCH FINDEN
// =========================

function findUserMatch(matches){
  return matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );
}


// =========================
// ⚡ ANDERE SPIELE
// =========================

function simulateOtherMatches(matches, userMatch){
  matches.forEach(m => {
    if(m !== userMatch){
      simulateQuick(m[0], m[1]);
    }
  });
}


// =========================
// ⚡ SCHNELLSIMULATION
// =========================

function simulateQuick(teamA, teamB){

  const goalsA = Math.floor(Math.random() * 5);
  const goalsB = Math.floor(Math.random() * 5);

  applyMatchStats(teamA, teamB, goalsA, goalsB);

  matchdayResults.push({
    home: teamA.name,
    away: teamB.name,
    score1: goalsA,
    score2: goalsB
  });
}


// =========================
// 📊 STATS UPDATE
// =========================

function applyMatchStats(teamA, teamB, scoreA, scoreB){

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
    teamA.points++;
    teamB.points++;
    teamA.draws++;
    teamB.draws++;
  }
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

    if(currentMinute === 45 && !halftimePlayed){
      halftimePlayed = true;
      clearInterval(currentInterval);
      isSimulating = false;
      addEvent("⏸ Halbzeit");
      document.getElementById("halftimePanel").style.display = "block";
      saveGameState();
      return;
    }

    handleRandomEvents(teamA, teamB);

    if(currentMinute >= 90){

      clearInterval(currentInterval);

      applyMatchStats(teamA, teamB, scoreA, scoreB);

      updateTable();

      await saveScore(
        selectedTeam || "Unbekannt",
        selectedTeam,
        teamA.name === selectedTeam ? scoreA : scoreB,
        currentMatchday
      );

      finalizeMatch(teamA, teamB, scoreA, scoreB);
    }

  }, 1000 / speedMultiplier);
}


// =========================
// 🔥 EVENTS
// =========================

function handleRandomEvents(teamA, teamB){

  if(Math.random() >= 0.3) return;

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
      if(attackingTeam === "A"){
        liveScore.s1++;
      } else {
        liveScore.s2++;
      }

      addEvent(`⚽ Tor nach Ecke! ${atk.name}`);
    }
  }
  else{
    addEvent(`🔥 Chance für ${atk.name}`);

    if(Math.random() < 0.3){
      if(attackingTeam === "A"){
        liveScore.s1++;
      } else {
        liveScore.s2++;
      }

      addEvent(`⚽ TOR! ${atk.name}`);
    }
  }

  updateScoreboard(teamA, teamB, liveScore.s1, liveScore.s2);
}`);
  }
  else if(type < 0.3){
    addEvent(`📐 Ecke für ${atk.name}`);
  }
  else{
    addEvent(`🔥 Chance für ${atk.name}`);
  }
}


// =========================
// 🏁 MATCH ENDE
// =========================

function finalizeMatch(teamA, teamB, scoreA, scoreB){

  matchdayResults.push({
    home: teamA.name,
    away: teamB.name,
    score1: scoreA,
    score2: scoreB
  });

  try{
    if(typeof generateMatchdayReport === "function"){
      document.getElementById("newsBox").innerText =
        generateMatchdayReport(matchdayResults);
    }
  } catch(e){
    console.error("Report Fehler:", e);
  }

  isSimulating = false;

  const btn = document.getElementById("startBtn");
  btn.innerText = "▶ Nächster Spieltag";
  btn.disabled = false;

  addEvent("🏁 Spiel beendet");

  saveGameState();
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
