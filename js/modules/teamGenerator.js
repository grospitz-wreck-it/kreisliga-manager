export function extractTeams(data) {
  const teams = [];

  data.forEach(row => {
    Object.keys(row).forEach(key => {
      if (key.startsWith("Team") && row[key]) {
        teams.push({
          name: row[key],
          liga: row["Liga"],
          kreis: row["Kreis"]
        });
      }
    });
  });

  return teams;
}
