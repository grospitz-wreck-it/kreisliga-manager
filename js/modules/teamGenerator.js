
// =========================
// 🏆 LEAGUES AUS CSV (FIX FÜR DEIN FORMAT)
// =========================
export function extractLeagues(rows) {

  const leagues = [];

  rows.forEach(row => {

    const leagueName = row.Liga;
    if (!leagueName) return;

    const teams = [];

    for (let i = 1; i <= 16; i++) {
      const key = "Team" + i;
      const name = row[key];

      if (name && name.trim() !== "") {
        teams.push({
          name: name.trim()
        });
      }
    }

    leagues.push({
      name: leagueName,
      teams: teams
    });
  });

  return leagues;
}
