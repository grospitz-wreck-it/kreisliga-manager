async function loadLeaderboard(){

  console.log("🚀 Lade Leaderboard...");

  const box = document.getElementById("leaderboard");

  if(!box){
    console.error("❌ leaderboard nicht gefunden");
    return;
  }

  box.innerHTML = "Lade Daten...";

  const { data, error } = await supabaseClient
    .from("leaderboard")
    .select("*");

  console.log("📊 Antwort:", data);

  if(error){
    console.error("❌ Leaderboard Fehler:", error);
    box.innerHTML = "Fehler: " + error.message;
    return;
  }

  if(!data || data.length === 0){
    box.innerHTML = "Noch keine Einträge";
    return;
  }

  // =========================
  // 🧠 BESTEN SCORE PRO SPIELER
  // =========================
  const bestPerPlayer = Object.values(
    data.reduce((acc, entry) => {

      if(
        !acc[entry.player_id] ||
        acc[entry.player_id].score < entry.score
      ){
        acc[entry.player_id] = entry;
      }

      return acc;

    }, {})
  );

  // =========================
  // 📈 SORTIEREN
  // =========================
  bestPerPlayer.sort((a, b) => b.score - a.score);

  // =========================
  // 🏆 TOP 10
  // =========================
  const top10 = bestPerPlayer.slice(0, 10);

  box.innerHTML = "";

  top10.forEach((entry, i) => {

    let div = document.createElement("div");

    // 🥇 Eigener Spieler hervorheben
    if(entry.player_id === playerId){
      div.style.background = "gold";
      div.style.color = "black";
      div.style.fontWeight = "bold";
    }

    div.innerHTML = `
      <strong>#${i+1}</strong> 
      ${entry.name || "Unbekannt"} 
      (${entry.team}) - 
      ${entry.score} Punkte
    `;

    box.appendChild(div);
  });

  // =========================
  // 🏆 EIGENER RANG (JETZT RICHTIG!)
  // =========================
  const myRank = bestPerPlayer.findIndex(e => e.player_id === playerId);

  if(myRank !== -1){

    const rankDiv = document.createElement("div");

    rankDiv.innerHTML = `👉 Dein Rang: #${myRank + 1}`;
    rankDiv.style.marginTop = "10px";
    rankDiv.style.fontWeight = "bold";

    box.appendChild(rankDiv);
  }
}


// 👉 AUTO LOAD BEIM START
document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard();
});
