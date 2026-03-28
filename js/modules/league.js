// =========================
// 🏆 LEAGUE MODULE
// =========================
console.log("LEAGUE MODULE");

// =========================
// 📚 LIGEN DATEN (MASTER)
// =========================
const LEAGUES = {

  herford: {
    name: "Kreisliga Herford",
    teams: [
      "SC Herford",
      "SV Enger-Westerenger",
      "TuS Bruchmühlen",
      "FC Exter",
      "VfL Holsen",
      "SV Rödinghausen II",
      "TuS Hunnebrock",
      "FC Löhne-Gohfeld",
      "SV Oetinghausen",
      "TuS Bardüttingdorf",
      "FC Schweicheln",
      "SV Bünde",
      "TuS Dünne",
      "RW Kirchlengern II",
      "SC Hiddenhausen",
      "SV Eidinghausen"
    ]
  },

  luebbecke: {
    name: "Kreisliga Lübbecke",
    teams: [
      "TuS Nettelstedt",
      "FC Preußisch Oldendorf",
      "SV Börninghausen",
      "TuS Dielingen",
      "VfL Frotheim",
      "TuS Gehlenbeck",
      "SV Hüllhorst",
      "FC Lübbecke",
      "TuS Tengern II",
      "SV Oberbauerschaft",
      "FC Oppenwehe",
      "TuS Stemwede",
      "SV Schnathorst",
      "FC Blasheim",
      "TuS Alswede",
      "SV Rahden"
    ]
  },

  bielefeld: {
    name: "Kreisliga Bielefeld",
    teams: [
      "VfB Fichte Bielefeld",
      "TuS Brake",
      "SV Brackwede",
      "TSV Altenhagen",
      "TuS Dornberg",
      "VfL Ummeln",
      "SV Gadderbaum",
      "TuS Jöllenbeck",
      "SC Babenhausen",
      "FC Türk Sport",
      "SV Ubbedissen",
      "TuS Hillegossen",
      "SC Hoberge-Uerentrup",
      "SV Quelle",
      "TuS Ost",
      "FC Heepen"
    ]
  }

};

// =========================
// 🧠 LIGA LADEN
// =========================
function loadLeague(key){

  console.log("📥 loadLeague:", key);

  const league = LEAGUES[key];
  if(!league){
    console.error("❌ Liga nicht gefunden");
    return;
  }

  // Teams als Objekte erzeugen
  game.league.teams = league.teams.map(name => ({
    name,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0
  }));

  game.league.key = key;
  game.league.currentMatchday = 0;
  game.league.schedule = [];

  console.log("✅ Teams geladen:", game.league.teams);

  // UI Updates
  window.populateTeamSelect?.();
  window.updateTable?.();
  window.updateHeader?.();

}

// =========================
// 🎮 USER ACTIONS
// =========================
function selectLeague(){

  const select = document.getElementById("leagueSelect");
  if(!select) return;

  const key = select.value;

  console.log("SELECTED KEY:", key);
  console.log("LEAGUE EXISTS:", LEAGUES[key]);

  if(!LEAGUES[key]){
    console.error("❌ Ungültiger League Key:", key);
    return;
  }

  loadLeague(key);
}

// =========================
// 🌍 EXPORTS
// =========================
window.LEAGUES = LEAGUES;
window.loadLeague = loadLeague;
window.selectLeague = selectLeague;
window.selectTeam = selectTeam;
