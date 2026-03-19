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

  matches.forEach(m => {
    if (m !== userMatch) simulateQuick(m[0], m[1]);
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
  else {
    t1.points++;
    t2.points++;
  }
}

function simulateLiveMatch(t1, t2) {
  let box = document.getElementById("liveMatch");

  let s1 = Math.floor(Math.random() * 3);
  let s2 = Math.floor(Math.random() * 3);

  box.innerHTML = `
    <b>${t1.name} vs ${t2.name}</b><br>
    Endstand: ${s1}:${s2}
  `;

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
