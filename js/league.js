function loadLeague(name) {

  if (name === "herford") {
    teams = [
      { name: "Bünder SV", points: 0, goals: 0 },
      { name: "SC Herford", points: 0, goals: 0 },
      { name: "TuS Bruchmühlen", points: 0, goals: 0 },
      { name: "SV Rödinghausen II", points: 0, goals: 0 },
      { name: "FC Exter", points: 0, goals: 0 },
      { name: "SV Enger-Westerenger", points: 0, goals: 0 },
      { name: "TuRa Löhne", points: 0, goals: 0 },
      { name: "FC Herford", points: 0, goals: 0 },
      { name: "TSV Löhne", points: 0, goals: 0 },
      { name: "SV Oetinghausen", points: 0, goals: 0 },
      { name: "SC Vlotho", points: 0, goals: 0 },
      { name: "SV Bischofshagen", points: 0, goals: 0 },
      { name: "TuS Hunnebrock", points: 0, goals: 0 },
      { name: "SV Hiddenhausen", points: 0, goals: 0 },
      { name: "FC Schweicheln", points: 0, goals: 0 },
      { name: "RW Kirchlengern II", points: 0, goals: 0 }
    ];
  }

  // 🔥 RESET (sehr wichtig)
  currentMatchday = 0;
  schedule = [];
}
