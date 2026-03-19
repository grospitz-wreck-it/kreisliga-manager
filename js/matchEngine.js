let schedule = [];
let isSimulating = false;
let currentInterval = null;
let matchStartTime = 0;
let matchDuration = 180000; // 3 Minuten
let halftimeDone = false;

// ================= SPIELPLAN =================
function generateSchedule() {
  schedule = [];

  let temp = [...teams];

  if (temp.length % 2 !== 0) {
    temp.push({ name: "SPIELFREI" });
  }

  let n = temp.length;

  for (let round = 0; round < n - 1; round++) {
    let matchday = [];

    for (let i = 0; i < n / 2; i++) {
      let home = temp[i];
      let away = temp[n - 1 - i];

      if (home.name !== "SPIELFREI" && away.name !== "SPIELFREI") {
        matchday.push([home, away]);
      }
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

  if (!userMatch) {
    alert("Dein Team hat kein Spiel!");
    return;
  }

  // andere Spiele schnell simulieren
  matches.forEach(match => {
    if (match !== userMatch) simulateQuick(match[0], match[1]);
  });

  simulateLiveMatch(userMatch[0], userMatch[1]);
}

// ================= SCHNELLSIM =================
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
  isSimulating = true;

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

    // ⚽ realistische Chance
    if (Math.random() < 0.008) {
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

// ================= ENDE =================
function finishMatch(t1, t2, s1, s2) {
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
}
