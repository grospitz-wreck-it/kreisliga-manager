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

  addEvent(`--- Spieltag ${currentMatchday + 1} ---`);

  matches.forEach(match => {
    let t1 = match[0];
    let t2 = match[1];

    let s1 = Math.floor(Math.random() * 3);
    let s2 = Math.floor(Math.random() * 3);

    addEvent(`${t1.name} ${s1}:${s2} ${t2.name}`);

    t1.goals += s1;
    t2.goals += s2;

    if (s1 > s2) t1.points += 3;
    else if (s2 > s1) t2.points += 3;
    else { t1.points++; t2.points++; }
  });

  currentMatchday++;

  document.getElementById("matchday").innerText =
    "Spieltag: " + currentMatchday + " / " + schedule.length;

  updateTable();
}
