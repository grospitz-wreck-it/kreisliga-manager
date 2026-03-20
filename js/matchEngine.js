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

  lockTeam();

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


function simulateQuick(t1, t2){
  let s1 = Math.floor(Math.random()*3);
  let s2 = Math.floor(Math.random()*3);

  t1.goals += s1;
  t2.goals += s2;

  if(s1 > s2) t1.points += 3;
  else if(s2 > s1) t2.points += 3;
  else {
    t1.points++;
    t2.points++;
  }
}


function simulateLiveMatch(t1, t2){
  if(currentInterval) clearInterval(currentInterval);

  isSimulating = true;
  substitutions = 5;
  liveModifier = 0;
  currentMinute = 0;

  document.getElementById("liveMatch").innerHTML = "";

  liveScore = { t1, t2, s1: 0, s2: 0 };

  updateScoreboard(t1, t2, 0, 0);

  startInterval();
}


function startInterval(){
  clearInterval(currentInterval);

  let intervalTime = 1000 / speedMultiplier;

  currentInterval = setInterval(() => {

    currentMinute++;

    let rand = Math.random();

    if(rand < 0.05 + liveModifier){
      if(Math.random() < 0.5){
        liveScore.s1++;
        addEvent("⚽ " + currentMinute + "' " + liveScore.t1.name);
      } else {
        liveScore.s2++;
        addEvent("⚽ " + currentMinute + "' " + liveScore.t2.name);
      }
    }
    else if(rand < 0.10){
      addEvent("🟨 " + currentMinute + "' Gelbe Karte");
    }
    else if(rand < 0.15){
      addEvent("💥 " + currentMinute + "' Große Chance");
    }
    else if(rand < 0.20){
      addEvent("🧤 " + currentMinute + "' Parade");
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
      addEvent("⏸️ Halbzeit");
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


function finishMatch(){
  isSimulating = false;

  let { t1, t2, s1, s2 } = liveScore;

  addEvent("🏁 Endstand: " + s1 + ":" + s2);

  t1.goals += s1;
  t2.goals += s2;

  if(s1 > s2) t1.points += 3;
  else if(s2 > s1) t2.points += 3;
  else {
    t1.points++;
    t2.points++;
  }

  currentMatchday++;

  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday + " / " + schedule.length;

  updateTable();
  document.getElementById("startBtn").disabled = false;
}
