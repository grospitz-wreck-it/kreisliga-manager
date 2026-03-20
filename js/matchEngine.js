function generateSchedule(){
  schedule = [];
  let temp = [...teams];
  let n = temp.length;

  for(let r=0; r<n-1; r++){
    let day = [];
    for(let i=0; i<n/2; i++){
      day.push([temp[i], temp[n-1-i]]);
    }
    schedule.push(day);

    let last = temp.pop();
    temp.splice(1, 0, last);
  }

  let second = schedule.map(d => d.map(m => [m[1], m[0]]));
  schedule = schedule.concat(second);
}

function simulateMatchday(){

  if(isSimulating) return;

  if(!selectedTeam){
    alert("Team wählen!");
    return;
  }

  matchdayResults = [];

  currentMatchday++;

  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday + " / " + schedule.length;

  document.getElementById("startBtn").innerText = "⏸ Spiel läuft";
  document.getElementById("startBtn").disabled = true;

  let matches = schedule[currentMatchday];

  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  matches.forEach(m => {
    if(m !== userMatch){
      simulateQuick(m[0], m[1]);
    }
  });

  simulateLiveMatch(userMatch[0], userMatch[1]);
}

// 🔥 QUICK SIM (angepasst realistischer)
function simulateQuick(t1, t2){

  let base = Math.random();

  let s1 = Math.floor(base * 3);
  let s2 = Math.floor(Math.random() * 3);

  // weniger Tore insgesamt
  if(Math.random() < 0.4){
    s1 = Math.floor(Math.random()*2);
    s2 = Math.floor(Math.random()*2);
  }

  matchdayResults.push({
    home: t1.name,
    away: t2.name,
    score1: s1,
    score2: s2
  });

  updateStats(t1, t2, s1, s2);
}

function simulateLiveMatch(t1, t2){

  clearInterval(currentInterval);

  isSimulating = true;
  substitutions = 5;
  liveModifier = 0;
  currentMinute = 0;

  // 🔥 NEU
  t1.players = 11;
  t2.players = 11;
  t1.yellow = 0;
  t2.yellow = 0;

  document.getElementById("liveMatch").innerHTML = "";

  liveScore = { t1, t2, s1: 0, s2: 0 };

  updateScoreboard(t1, t2, 0, 0);

  startInterval();
}

// 🔥 TAKTIK EINFLUSS
function getTacticModifier(){

  let tactic = document.getElementById("tacticSelect").value;

  if(tactic === "Offensiv") return 0.02;
  if(tactic === "Defensiv") return -0.015;

  return 0;
}

function startInterval(){

  clearInterval(currentInterval);

  let intervalTime = 1000 / speedMultiplier;

  currentInterval = setInterval(() => {

    currentMinute++;

    let tacticMod = getTacticModifier();
    let rand = Math.random();

    // 🔥 TOR (reduziert!)
    if(rand < 0.025 + liveModifier + tacticMod){

      let attackingTeam = Math.random() < 0.5 ? liveScore.t1 : liveScore.t2;

      // 🔥 Unterzahl schwächt Team
      let weakness = attackingTeam.players < 11 ? 0.5 : 1;

      if(Math.random() < weakness){

        if(attackingTeam === liveScore.t1){
          liveScore.s1++;
        } else {
          liveScore.s2++;
        }

        addEvent("⚽ " + currentMinute + "' Tor für " + attackingTeam.name);
      }
    }

    // 🟨 GELB
    else if(rand < 0.08){

      let team = Math.random() < 0.5 ? liveScore.t1 : liveScore.t2;
      team.yellow++;

      addEvent("🟨 " + currentMinute + "' Gelbe Karte");

      // 🔥 GELB-ROT
      if(team.yellow >= 2 && Math.random() < 0.3){
        team.players--;
        addEvent("🟥 Gelb-Rot! " + team.name + " in Unterzahl");
      }
    }

    // 🔴 ROT (sehr selten)
    else if(rand < 0.095){
      let team = Math.random() < 0.5 ? liveScore.t1 : liveScore.t2;
      team.players--;
      addEvent("🟥 Rote Karte für " + team.name);
    }

    // 🩹 VERLETZUNG
    else if(rand < 0.11){

      let team = Math.random() < 0.5 ? liveScore.t1 : liveScore.t2;

      if(substitutions > 0){
        substitutions--;
        addEvent("🩹 Verletzung – Wechsel notwendig");
      } else {
        team.players--;
        addEvent("🩹 Keine Wechsel mehr – Unterzahl!");
      }

      document.getElementById("subCount").innerText="Wechsel: "+substitutions;
    }

    // ⚠️ FOUL
    else if(rand < 0.18){
      addEvent("⚠️ Foulspiel im Mittelfeld");
    }

    // 🎯 ELFMETER (sehr selten)
    else if(rand < 0.195){

      let team = Math.random() < 0.5 ? liveScore.t1 : liveScore.t2;

      addEvent("🎯 Elfmeter!");

      if(Math.random() < 0.75){
        if(team === liveScore.t1){
          liveScore.s1++;
        } else {
          liveScore.s2++;
        }
        addEvent("⚽ Elfmeter verwandelt!");
      } else {
        addEvent("❌ Elfmeter vergeben!");
      }
    }

    updateScoreboard(
      liveScore.t1,
      liveScore.t2,
      liveScore.s1,
      liveScore.s2
    );

    updateTimeline(currentMinute);

    if(currentMinute === 45){
      clearInterval(currentInterval);
      isSimulating = false;
      document.getElementById("halftimePanel").style.display = "block";
      return;
    }

    if(currentMinute >= 90){
      clearInterval(currentInterval);
      finishMatch();
    }

  }, intervalTime);
}

function restartInterval(){
  startInterval();
}

function resumeMatch(){
  document.getElementById("halftimePanel").style.display = "none";
  isSimulating = true;
  startInterval();
}

// 🔥 ZENTRALE STATS LOGIK (NEU)
function updateStats(t1, t2, s1, s2){

  t1.played++;
  t2.played++;

  t1.goalsFor += s1;
  t1.goalsAgainst += s2;

  t2.goalsFor += s2;
  t2.goalsAgainst += s1;

  if(s1 > s2){
    t1.points += 3;
    t1.wins++;
    t2.losses++;
  }
  else if(s2 > s1){
    t2.points += 3;
    t2.wins++;
    t1.losses++;
  }
  else{
    t1.points++;
    t2.points++;
    t1.draws++;
    t2.draws++;
  }
}

function finishMatch(){

  isSimulating = false;

  let { t1, t2, s1, s2 } = liveScore;

  addEvent("🏁 Endstand: " + s1 + ":" + s2);

  matchdayResults.push({
    home: t1.name,
    away: t2.name,
    score1: s1,
    score2: s2
  });

  updateStats(t1, t2, s1, s2);

  updateTable();

  if(typeof generateMatchdayReport === "function"){
    let report = generateMatchdayReport(matchdayResults);

    let box = document.getElementById("newsBox");
    if(box){
      box.innerHTML = `<p>${report.replace(/\n/g,"<br>")}</p>`;
    }
  }

  document.getElementById("startBtn").innerText = "▶ Nächstes Spiel starten";
  document.getElementById("startBtn").disabled = false;
}
