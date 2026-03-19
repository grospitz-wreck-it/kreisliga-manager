let currentInterval = null;
let matchStartTime = 0;
let matchDuration = 180000; // 3 Minuten
let halftimeDone = false;

function simulateMatchday() {
  if (!selectedTeam) return alert("Team wählen!");
  if (currentMatchday >= schedule.length) return alert("Saison beendet!");

  let matches = schedule[currentMatchday];

  // 👉 USER MATCH finden
  let userMatch = matches.find(m =>
    m[0].name === selectedTeam || m[1].name === selectedTeam
  );

  // 👉 Rest simulieren (ohne Anzeige)
  matches.forEach(match => {
    if (match !== userMatch) simulateQuick(match[0], match[1]);
  });

  // 👉 Live-Spiel starten
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

// ================= LIVE =================
function simulateLiveMatch(t1, t2) {
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

    // ⚽ realistischere Chance
    let chance = 0.015;

    if (Math.random() < chance) {
      if (Math.random() < 0.5) {
        s1++;
        addEvent(`⚽ ${minute}' ${t1.name}`);
      } else {
        s2++;
        addEvent(`⚽ ${minute}' ${t2.name}`);
      }
    }

    updateScoreboard(t1, t2, s1, s2);

    // ⏸ Halbzeit
    if (minute >= 45 && !halftimeDone) {
      halftimeDone = true;
      clearInterval(currentInterval);

      document.getElementById("halftimePanel").style.display = "block";
      return;
    }

    // 🏁 Ende
    if (minute >= 90) {
      clearInterval(currentInterval);
      finishMatch(t1, t2, s1, s2);
    }

  }, 100);
}

// ================= HALBZEIT =================
function applyHalftime() {
  document.getElementById("halftimePanel").style.display = "none";

  matchStartTime = Date.now() - matchDuration / 2;

  currentInterval = setInterval(() => {
    gameLoop();
  }, 100);
}

// ================= FINISH =================
function finishMatch(t1, t2, s1, s2) {
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
