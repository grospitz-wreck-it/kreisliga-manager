async function loadLeaderboard(){

  const box = document.getElementById("leaderboard");

  if(!box){
  console.error("❌ #leaderboard nicht gefunden!");
  return;
  }
  box.innerHTML = "Lade Daten...";

  const { data, error } = await supabaseClient
    .from("leaderboard")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  if(error){
    console.error("Leaderboard Fehler:", error);
    box.innerHTML = "Fehler beim Laden";
    return;
  }

  if(!data || data.length === 0){
    box.innerHTML = "Noch keine Einträge";
    return;
  }

  // 🔥 Anzeige bauen
  box.innerHTML = "";

  data.forEach((entry, i) => {

    let div = document.createElement("div");

    div.innerHTML = `
      <strong>#${i+1}</strong> 
      ${entry.name || "Unbekannt"} 
      (${entry.team}) - 
      ${entry.score} Punkte
    `;

    box.appendChild(div);
  });
}
