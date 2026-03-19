// nutzt state.js Variablen!

function simulateMatchday() {
  if (!selectedTeam) {
    alert("Team wählen!");
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

  // andere Spiele schnell
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
  else { t1.points++; t2.points++; }
}

// ================= LIVE MATCH =================
function simulateLiveMatch(t1, t2) {
  let box = document.getElementById("liveMatch");
  box.innerHTML = "";

  let s1 = 0;
  let s2 = 0;
  let minute = 0;

  isSimulating = true;

  let interval = setInterval(() => {
    minute++;

    // ⚽ realistischere Chance
    let baseChance = 0.08;

    if (Math.random() < baseChance) {
      let attack1 = t1.strength + Math.random() * 20;
      let attack2 = t2.strength + Math.random() * 20;

      if (attack1 > attack2) {
        s1++;
        addEvent(`⚽ ${minute}' ${t1.name}`);
      } else {
        s2++;
        addEvent(`⚽ ${minute}' ${t2.name}`);
      }
    }

    updateScoreboard(t1, t2, s1, s2);
    updateTimeline(minute);

    // Halbzeit
    if (minute === 45) {
      addEvent("⏸ Halbzeit");
      clearInterval(interval);

      document.getElementById("halftimePanel").style.display = "block";

      return;
    }

    // Ende
    if (minute >= 90) {
      clearInterval(interval);
      finishMatch(t1, t2, s1, s2);
    }

  }, 100);
}

// ================= HALBZEIT FORTSETZEN =================
function continueSecondHalf(t1, t2, s1, s2, minuteStart) {

  let interval = setInterval(() => {
    minuteStart++;

    let baseChance = 0.08;

    if (Math.random() < baseChance) {
      if (Math.random() < 0.5) {
        s1++;
        addEvent(`⚽ ${minuteStart}' ${t1.name}`);
      } else {
        s2++;
        addEvent(`⚽ ${minuteStart}' ${t2.name}`);
      }
    }

    updateScoreboard(t1, t2, s1, s2);
    updateTimeline(minuteStart);

    if (minuteStart >= 90) {
      clearInterval(interval);
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
function resumeMatch() {
  document.getElementById("halftimePanel").style.display = "none";

  matchStartTime = Date.now() - matchDuration / 2;

  currentInterval = setInterval(() => {
    let elapsed = Date.now() - matchStartTime;
    let minute = Math.floor((elapsed / matchDuration) * 90);

    updateTimeline(minute);
  }, 100);
}
