let leagues = {
  "Kreisliga A Herford": [
    { name: "TuS Bruchmühlen", strength: 75 },
    { name: "VfL Holsen", strength: 72 },
    { name: "Bünder SV", strength: 70 },
    { name: "TSG Kirchlengern II", strength: 68 },
    { name: "SV Löhne-Obernbeck", strength: 67 },
    { name: "TuRa Löhne", strength: 66 },
    { name: "GW Pödinghausen", strength: 65 },
    { name: "SV Enger-Westerenger", strength: 64 },
    { name: "TSV Löhne", strength: 63 },
    { name: "SC Enger", strength: 62 },
    { name: "FC Exter", strength: 61 },
    { name: "SV Rödinghausen III", strength: 60 },
    { name: "SV Oetinghausen", strength: 59 },
    { name: "FA Herringhausen/Eickum", strength: 58 },
    { name: "VfL Herford II", strength: 57 },
    { name: "TuS Hücker-Aschen", strength: 56 }
  ]
};

function initLeague() {
  teams = leagues["Kreisliga A Herford"].map(t => ({
    ...t,
    points: 0,
    goals: 0
  }));
}
