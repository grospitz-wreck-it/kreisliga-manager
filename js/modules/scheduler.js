function generateSchedule(){

  const originalTeams = game.league.teams;

  // 🔥 WICHTIG: Kopie erstellen
  let teams = [...originalTeams];

  const rounds = [];

  // Bei ungerader Zahl Dummy-Team
  if(teams.length % 2 !== 0){
    teams.push({ name: "BYE" });
  }

  const totalRounds = teams.length - 1;
  const half = teams.length / 2;

  // =========================
  // 🔁 HINRUNDE
  // =========================
  for(let i = 0; i < totalRounds; i++){

    const round = [];

    for(let j = 0; j < half; j++){

      const home = teams[j];
      const away = teams[teams.length - 1 - j];

      if(home.name !== "BYE" && away.name !== "BYE"){
        round.push({
          home,
          away,
          result: null
        });
      }
    }

    // 🔄 Rotation (ohne erstes Team)
    teams.splice(1, 0, teams.pop());

    rounds.push(round);
  }

  // =========================
  // 🔁 RÜCKRUNDE
  // =========================
  const returnRounds = rounds.map(round =>
    round.map(match => ({
      home: match.away,
      away: match.home,
      result: null
    }))
  );

  game.league.schedule = [...rounds, ...returnRounds];

  game.league.currentRound = 0;

  console.log("📅 Spielplan erstellt:", game.league.schedule.length, "Spieltage");
}

window.generateSchedule = generateSchedule;
