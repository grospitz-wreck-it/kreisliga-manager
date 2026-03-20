function createTeam(name){
  return {
    name: name,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    played: 0
  };
}

function loadLeague(name) {

  // ✅ sauberer Reset
  teams = [];
  schedule = [];
  currentMatchday = 0;

  if (name === "herford") {
    teams = [
      createTeam("Bünder SV"),
      createTeam("SC Herford"),
      createTeam("TuS Bruchmühlen"),
      createTeam("SV Rödinghausen II"),
      createTeam("FC Exter"),
      createTeam("SV Enger-Westerenger"),
      createTeam("TuRa Löhne"),
      createTeam("FC Herford"),
      createTeam("TSV Löhne"),
      createTeam("SV Oetinghausen"),
      createTeam("SC Vlotho"),
      createTeam("SV Bischofshagen"),
      createTeam("TuS Hunnebrock"),
      createTeam("SV Hiddenhausen"),
      createTeam("FC Schweicheln"),
      createTeam("RW Kirchlengern II")
    ];
  }

  if (name === "luebbecke") {
    teams = [
      createTeam("Gehlenbeck"),
      createTeam("TuSpo Rahden"),
      createTeam("TG Espelkamp"),
      createTeam("SuS Holzhausen"),
      createTeam("FC Lübbecke II"),
      createTeam("FC Oppenwehe"),
      createTeam("TuS Stemwede"),
      createTeam("Union Varl"),
      createTeam("SSV Ströhen"),
      createTeam("Fabbenstedt"),
      createTeam("TuS Tengern II"),
      createTeam("Tonnenheide"),
      createTeam("Pr Espelkamp II"),
      createTeam("TuS Levern"),
      createTeam("Isenstedt"),
      createTeam("TuRa Espelk.")
    ];
  }

  if (name === "bielefeld") {
    teams = [
      createTeam("TuS Jöllenbeck"),
      createTeam("SC Bielefeld"),
      createTeam("BV Werther"),
      createTeam("SG Oesterweg"),
      createTeam("TuS 08 Senne I"),
      createTeam("Schildesche"),
      createTeam("SV Häger"),
      createTeam("Oldentrup"),
      createTeam("TuS Jöllen. II"),
      createTeam("SC Peckeloh II"),
      createTeam("Kosova Bi"),
      createTeam("Ubbedissen"),
      createTeam("TuS Ost Bie."),
      createTeam("Amshausen"),
      createTeam("TuS Quelle"),
      createTeam("Gadderbaum")
    ];
  }

  console.log("Teams geladen:", teams.length);
}
