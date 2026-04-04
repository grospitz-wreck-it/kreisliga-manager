export function extractLeagues(data) {
  const leagues = [];

  data.forEach(row => {

    const league = {
      name: row["Liga"],
      kreis: row["Kreis"],
      bundesland: row["Bundesland"],
      teams: []
    };

    Object.keys(row).forEach(key => {
      if (key.startsWith("Team") && row[key]) {
        league.teams.push({
          name: row[key],
          liga: row["Liga"],
          kreis: row["Kreis"]
        });
      }
    });

    // 👉 nur hinzufügen wenn Teams existieren
    if (league.teams.length > 0) {
      leagues.push(league);
    }

  });

  return leagues;
}
