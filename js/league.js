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

  // 🔵 Kreisliga A Lübbecke
  if (name === "luebbecke") {
    teams = [
      { name: "Gehlenbeck", points: 0, goals: 0 },
      { name: "TuSpo Rahden", points: 0, goals: 0 },
      { name: "TG Espelkamp", points: 0, goals: 0 },
      { name: "SuS Holzhausen", points: 0, goals: 0 },
      { name: "FC Lübbecke II", points: 0, goals: 0 },
      { name: "FC Oppenwehe", points: 0, goals: 0 },
      { name: "TuS Stemwede", points: 0, goals: 0 },
      { name: "Union Varl", points: 0, goals: 0 },
      { name: "SSV Ströhen", points: 0, goals: 0 },
      { name: "Fabbenstedt", points: 0, goals: 0 },
      { name: "TuS Tengern II", points: 0, goals: 0 },
      { name: "Tonnenheide", points: 0, goals: 0 },
      { name: "Pr Espelkamp II", points: 0, goals: 0 },
      { name: "TuS Levern", points: 0, goals: 0 },
      { name: "Isenstedt", points: 0, goals: 0 },
      { name: "TuRa Espelk.", points: 0, goals: 0 }
    ];
  }

  // 🟢 Kreisliga A Bielefeld
  if (name === "bielefeld") {
    teams = [
      { name: "TuS Jöllenbeck", points: 0, goals: 0 },
      { name: "SC Bielefeld", points: 0, goals: 0 },
      { name: "BV Werther", points: 0, goals: 0 },
      { name: "SG Oesterweg", points: 0, goals: 0 },
      { name: "TuS 08 Senne I", points: 0, goals: 0 },
      { name: "Schildesche", points: 0, goals: 0 },
      { name: "SV Häger", points: 0, goals: 0 },
      { name: "Oldentrup", points: 0, goals: 0 },
      { name: "TuS Jöllen. II", points: 0, goals: 0 },
      { name: "SC Peckeloh II", points: 0, goals: 0 },
      { name: "Kosova Bi", points: 0, goals: 0 },
      { name: "Ubbedissen", points: 0, goals: 0 },
      { name: "TuS Ost Bie.", points: 0, goals: 0 },
      { name: "Amshausen", points: 0, goals: 0 },
      { name: "TuS Quelle", points: 0, goals: 0 },
      { name: "Gadderbaum", points: 0, goals: 0 }
    ];
  }

  // 🔥 RESET (sehr wichtig)
  currentMatchday = 0;
  schedule = [];
}
