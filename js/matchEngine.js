let currentInterval = null;
let matchStartTime = 0;
let matchDuration = 180000; // 3 Minuten
let halftimeDone = false;

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

  console.log("Aktueller Spieltag:", currentMatchday);
  console.log("Dein Team:", selectedTeam);

  // 👉 DEBUG SAFE MATCH
  let userMatch = null;

  for (let m of matches) {
    if (m[0].name === selectedTeam || m[1].name === selectedTeam) {
      userMatch = m;
      break;
    }
  }

  if (!userMatch) {
    console.error("Team nicht gefunden im Spieltag!", selectedTeam);
    alert("Fehler: Dein Team hat kein Spiel!");
    return;
  }

  // Rest simulieren
  matches.forEach(match => {
    if (match !== userMatch) simulateQuick(match[0], match[1]);
  });

  simulateLiveMatch(userMatch[0], userMatch[1]);
}

  // 👉 Live-Spiel starten
  simulateLiveMatch(userMatch[0], userMatch[1]);
}

function simulateLiveMatch(t1, t2) {
  let s1 = 0, s2 = 0;
  let box = document.getElementById("liveMatch");
  box.innerHTML = "";

  halftimeDone = false;
  matchStartTime = Date.now();

  let yellowCards = {};
  let redCards = {};
  let injuries = {};

  updateScoreboard(t1, t2, s1, s2);

  currentInterval = setInterval(() => {

    let elapsed = Date.now() - matchStartTime;
    let minute = Math.floor((elapsed / matchDuration) * 90);
    if (minute > 90) minute = 90;

    updateTimeline(minute);

    // 🧠 Druck-System
    let pressure1 = s1 < s2 ? 0.003 : 0;
    let pressure2 = s2 < s1 ? 0.003 : 0;

    // ⚖️ Stärke + Druck
    let attack1 = t1.strength / 100 + pressure1;
    let attack2 = t2.strength / 100 + pressure2;

    // ⚽ TORCHANCE (viel seltener!)
    if (Math.random() < 0.008) {
      if (Math.random() < attack1 / (attack1 + attack2)) {
        s1++;
        addEvent(`⚽ ${minute}' ${t1.name}`);
      } else {
        s2++;
        addEvent(`⚽ ${minute}' ${t2.name}`);
      }
    }

    // 🎯 CHANCEN
    if (Math.random() < 0.01) {
      addEvent(`🔥 ${minute}' Großchance`);
    }

    // 🚩 ABSEITS
    if (Math.random() < 0.008) {
      addEvent(`🚩 ${minute}' Abseits`);
    }

    // 🥅 ECKE
    if (Math.random() < 0.01) {
      addEvent(`🔄 ${minute}' Ecke`);
    }

    // 🟨 FOUL / KARTE
    if (Math.random() < 0.006) {
      let team = Math.random() < 0.5 ? t1 : t2;

      if (!yellowCards[team.name]) yellowCards[team.name] = 0;

      // direkt rot selten
      if (Math.random() < 0.05) {
        redCards[team.name] = true;
        addEvent(`🟥 ${minute}' Rot für ${team.name}`);
      } else {
        yellowCards[team.name]++;
        addEvent(`🟨 ${minute}' Gelb für ${team.name}`);

        if (yellowCards[team.name] >= 2) {
          redCards[team.name] = true;
          addEvent(`🟥 ${minute}' Gelb-Rot für ${team.name}`);
        }
      }
    }

    // 🤕 VERLETZUNG (selten)
    if (Math.random() < 0.002) {
      let team = Math.random() < 0.5 ? t1 : t2;
      injuries[team.name] = true;
      addEvent(`🤕 ${minute}' Verletzung bei ${team.name}`);
    }

    updateScoreboard(t1, t2, s1, s2);

    // ⏸ HALBZEIT
    if (minute >= 45 && !halftimeDone) {
      halftimeDone = true;
      clearInterval(currentInterval);
      document.getElementById("halftimePanel").style.display = "block";
      return;
    }

    // 🏁 ENDE
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
