
// =========================
// 🏆 LEAGUES AUS CSV (FIX FÜR DEIN FORMAT)
// =========================
export function extractLeagues(rows) {

  const leagues = [];

  rows.forEach(row => {

    const leagueName = row.Liga;
    if (!leagueName) return;

    // 👉 alle Team-Spalten dynamisch sammeln
    const teams = Object.keys(row)
      .filter(key => key.startsWith("Team"))
      .map(key => row[key])
      .filter(name => name && name.trim() !== "");

    leagues.push({
      name: leagueName,
      teams: teams
    });
  });

  return leagues;
}
