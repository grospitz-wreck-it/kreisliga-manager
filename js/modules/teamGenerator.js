// =========================
// 🏆 LEAGUES AUS CSV
// =========================
export function extractLeagues(rows) {

  const leaguesMap = {};

  rows.forEach(row => {

    // 👉 flexibel für verschiedene CSV Header
    const leagueName = row.liga || row.league || row.Liga;
    const teamName = row.team || row.Team;

    if (!leagueName || !teamName) return;

    if (!leaguesMap[leagueName]) {
      leaguesMap[leagueName] = {
        name: leagueName,
        teams: []
      };
    }

    leaguesMap[leagueName].teams.push(teamName);
  });

  return Object.values(leaguesMap);
}
