function simulateMatchday() {
  if (!selectedTeam) return alert("Team wählen!");

  let t1 = teams[0];
  let t2 = teams[1];

  let s1 = Math.floor(Math.random()*3);
  let s2 = Math.floor(Math.random()*3);

  addEvent(`${t1.name} ${s1}:${s2} ${t2.name}`);

  t1.goals += s1;
  t2.goals += s2;

  if (s1 > s2) t1.points += 3;
  else if (s2 > s1) t2.points += 3;
  else { t1.points++; t2.points++; }

  updateTable();
}
