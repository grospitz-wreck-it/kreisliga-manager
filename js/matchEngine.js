// ❗ KEIN let schedule hier!!!

function generateSchedule() {
  schedule = [];

  let temp = [...teams];
  let n = temp.length;

  for (let round = 0; round < n - 1; round++) {
    let matchday = [];

    for (let i = 0; i < n / 2; i++) {
      matchday.push([temp[i], temp[n - 1 - i]]);
    }

    schedule.push(matchday);

    let last = temp.pop();
    temp.splice(1, 0, last);
  }

  // Rückrunde
  let secondHalf = schedule.map(day =>
    day.map(match => [match[1], match[0]])
  );

  schedule = schedule.concat(secondHalf);
}

function simulateMatchday() {
  if (!selectedTeam) return alert("Team wählen!");
  if (currentMatchday >= schedule.length) return alert("Saison beendet!");

  let matches = schedule[currentMatchday];

  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  matches.forEach(match => {
    if (match !== userMatch) simulateQuick(match[0], match[1]);
  });

  simulateLiveMatch(userMatch[0], userMatch[1]);
}

function simulateQuick(t1, t2) {
  let s1 = Math.floor(Math.random() * 3);
  let s2 = Math.floor(Math.random() * 3);

  t1.goals += s1;
  t2.goals += s2;

  if (s1 > s2) t1.points += 3;
  else if (s2 > s1) t2.points += 3;
  else { t1.points++; t2.points++; }
}

function simulateLiveMatch(t1, t2) {
  isSimulating = true;
  substitutions = 5;

  let s1 = 0, s2 = 0;
  let box = document.getElementById("liveMatch");
  box.innerHTML = "";

  halftimeDone = false;
  matchStartTime = Date.now();

  updateScoreboard(t1, t2, s1, s2);

  currentInterval = setInterval(() => {
    let elapsed = Date.now() - matchStartTime;
    let minute = Math.floor((elapsed / matchDuration) * 90);
    if (minute > 90) minute = 90;

    updateTimeline(minute);

    // ⚽ realistischere Tore
    if (Math.random() < 0.006 + liveModifier) {
      if (Math.random() < 0.5) {
        s1++;
        addEvent(`⚽ ${minute}' ${t1.name}`);
      } else {
        s2++;
        addEvent(`⚽ ${minute}' ${t2.name}`);
      }
    }

    updateScoreboard(t1, t2, s1, s2);

    // Halbzeit
    if (minute >= 45 && !halftimeDone) {
      halftimeDone = true;
      clearInterval(currentInterval);
      document.getElementById("halftimePanel").style.display = "block";
      return;
    }

    // Ende
    if (minute >= 90) {
      clearInterval(currentInterval);
      finishMatch(t1, t2, s1, s2);
    }

  }, 100);
}

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
