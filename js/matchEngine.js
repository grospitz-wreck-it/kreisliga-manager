// ================= SPIELPLAN =================
function generateSchedule() {
  schedule = [];

  let temp = [...teams];
  let n = temp.length;

  for (let r = 0; r < n - 1; r++) {
    let day = [];

    for (let i = 0; i < n / 2; i++) {
      day.push([temp[i], temp[n - 1 - i]]);
    }

    schedule.push(day);

    let last = temp.pop();
    temp.splice(1, 0, last);
  }

  // Rückrunde
  let second = schedule.map(d =>
    d.map(m => [m[1], m[0]])
  );

  schedule = schedule.concat(second);
}

// ================= SPIELTAG =================
function simulateMatchday() {

  if (isSimulating) {
    console.log("Spiel läuft bereits");
    return;
  }

  if (!selectedTeam) {
    alert("Team wählen!");
    return;
  }

  if (currentMatchday >= schedule.length) {
    alert("Saison beendet!");
    return;
  }

  document.getElementById("startBtn").disabled = true;

  let matches = schedule[currentMatchday];

  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  // andere Spiele simulieren
  matches.forEach(m => {
    if (m !== userMatch) simulateQuick(m[0], m[1]);
  });

  simulateLiveMatch(userMatch[0], userMatch[1]);
}

// ================= QUICK MATCH =================
function simulateQuick(t1, t2) {
  let s1 = Math.floor(Math.random() * 3);
  let s2 = Math.floor(Math.random() * 3);

  t1.goals += s1;
  t2.goals += s2;

  if (s1 > s2) t1.points += 3;
  else if (s2 > s1) t2.points += 3;
  else {
    t1.points++;
    t2.points++;
  }
}

// ================= LIVE MATCH =================
function simulateLiveMatch(t1, t2) {

  // alte Intervalle stoppen
  if (currentInterval) {
    clearInterval(currentInterval);
  }

  isSimulating = true;
  halftimeDone = false;
  substitutions = 5;
  liveModifier = 0;
  // 🔥 globaler Spielstand
  liveScore = {
    t1: t1,
    t2: t2,
    s1: 0,
    s2: 0
  };

  let minute = 0;

  let box = document.getElementById("liveMatch");
  box.innerHTML = "";

  updateScoreboard(t1, t2, 0, 0);

  currentInterval = setInterval(() => {
    minute++;

    // ⚽ realistische Torchance
    if (Math.random() < 0.04) {
      if (Math.random() < 0.5) {
        liveScore.s1++;
        addEvent(`⚽ ${minute}' ${t1.name}`);
      } else {
        liveScore.s2++;
        addEvent(`⚽ ${minute}' ${t2.name}`);
      }
    }

    updateScoreboard(t1, t2, liveScore.s1, liveScore.s2);
    updateTimeline(minute);

    // Halbzeit
    if (minute === 45) {
      clearInterval(currentInterval);
      document.getElementById("halftimePanel").style.display = "block";
      return;
    }

    // Ende
    if (minute >= 90) {
      clearInterval(currentInterval);
      finishMatch(liveScore.t1, liveScore.t2, liveScore.s1, liveScore.s2);
    }

  }, matchDuration / 90);
}

// ================= HALBZEIT =================
function resumeMatch() {

  document.getElementById("halftimePanel").style.display = "none";

  if (currentInterval) {
    clearInterval(currentInterval);
  }

  let minute = 45;

  currentInterval = setInterval(() => {
    minute++;

    if (Math.random() < 0.04) {
      if (Math.random() < 0.5) {
        liveScore.s1++;
        addEvent(`⚽ ${minute}' ${liveScore.t1.name}`);
      } else {
        liveScore.s2++;
        addEvent(`⚽ ${minute}' ${liveScore.t2.name}`);
      }
    }

    updateScoreboard(
      liveScore.t1,
      liveScore.t2,
      liveScore.s1,
      liveScore.s2
    );

    updateTimeline(minute);

    if (minute >= 90) {
      clearInterval(currentInterval);
      finishMatch(
        liveScore.t1,
        liveScore.t2,
        liveScore.s1,
        liveScore.s2
      );
    }

  }, matchDuration / 90);
}

// ================= ENDE =================
function finishMatch(t1, t2, s1, s2) {

  if (!isSimulating) return;

  isSimulating = false;

  addEvent(`🏁 Endstand: ${s1}:${s2}`);

  t1.goals += s1;
  t2.goals += s2;

  if (s1 > s2) t1.points += 3;
  else if (s2 > s1) t2.points += 3;
  else {
    t1.points++;
    t2.points++;
  }

  currentMatchday++;

  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday + " / " + schedule.length;

  updateTable();

  // Button wieder aktivieren
  document.getElementById("startBtn").disabled = false;
}
