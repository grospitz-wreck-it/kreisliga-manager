let leagues = {
  "Kreisliga A Herford": [
    { name: "TuS Bruchmühlen", strength: 75 },
    { name: "VfL Holsen", strength: 70 },
    { name: "Bünder SV", strength: 68 },
    { name: "TSG Kirchlengern II", strength: 65 }
  ]
};

function initLeague() {
  teams = leagues["Kreisliga A Herford"].map(t => ({
    ...t,
    points: 0,
    goals: 0
  }));
}
