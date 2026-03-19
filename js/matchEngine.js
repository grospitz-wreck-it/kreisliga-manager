// ⚠️ KEINE GLOBALS HIER DEFINIEREN!

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
  if (!selectedTeam) {
    alert("Team wählen!");
    return;
  }

  if (!schedule || schedule.length === 0) {
    alert("Spielplan fehlt!");
    return;
  }

  if (currentMatchday >= schedule.length) {
    alert("Saison beendet!");
    return;
  }

  let matches = schedule[currentMatchday];

  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  matches.forEach(m => {
    if (m !== userMatch) simulateQuick(m[0], m[1]);
  });

  simulateLiveMatch(userMatch[0], userMatch[1]);
}

// ================= QUICK =================
function simulateQuick(t1, t2) {
  let s1 = Math.floor(Math.random() * 3);
  let s2 = Math.floor(Math.random() * 3);

  t1.goals += s1;
  t2.goals += s2;

  if (s1 > s2) t1.points += 3;
  else if (s2 > s1) t2.points += 3;
  else { t1.points++; t2.points++; }
}

// ================= LIVE =================
function simulateLiveMatch(t1, t2) {
  let box = document.getElementById("liveMatch");
  box.innerHTML = "";

  let s1 = 0, s2 = 0;
  let minute = 0;

  isSimulating = true;

  currentInterval = setInterval(() => {
    minute++;

    // ⚽ realistische Tore
    if (Math.random() < 0.05) {
      if (Math.random() < 0.5) {
        s1++;
        addEvent(`⚽ ${minute}' ${t1.name}`);
      } else {
        s2++;
        addEvent(`⚽ ${minute}' ${t2.name}`);
      }
    }

    updateScoreboard(t1, t2, s1, s2);
    updateTimeline(minute);

    if (minute === 45) {
      clearInterval(currentInterval);
      document.getElementById("halftimePanel").style.display = "block";
      return;
    }

    if (minute >= 90) {
      clearInterval(currentInterval);
      finishMatch(t1, t2, s1, s2);
    }

  }, 100);
}

// ================= ENDE =================
function finishMatch(t1, t2, s1, s2) {
  isSimulating = false;

  addEvent(`🏁 Endstand: ${s1}:${s2}`);

  t1.goals += s1;
  t2.goals += s2;

  if (s1 > s2) t1.points += 3;
  else if (s2 > s1) t2.points += 3;
  else { t1.points++; t2.points++; }

  currentMatchday++;

  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday + " / " + schedule.length;

  updateTable();
}

// ================= HALBZEIT =================
function resumeMatch() {
  document.getElementById("halftimePanel").style.display = "none";

  matchStartTime = Date.now() - matchDuration / 2;

  currentInterval = setInterval(() => {
    let elapsed = Date.now() - matchStartTime;
    let minute = Math.floor((elapsed / matchDuration) * 90);

    updateTimeline(minute);
  }, 100);
}
