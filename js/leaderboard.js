async function loadLeaderboard(){

  const box = document.getElementById("leaderboardList");
  if(!box) return;

  box.innerHTML = "Lade...";

  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  if(error){
    console.error(error);
    box.innerHTML = "Fehler beim Laden";
    return;
  }

  if(!data || data.length === 0){
    box.innerHTML = "Noch keine Einträge";
    return;
  }

  box.innerHTML = "";

  data.forEach((entry, index) => {

    let row = document.createElement("div");
    row.className = "leaderboard-row";

    row.innerHTML = `
      <span>${index + 1}.</span>
      <span>${entry.name}</span>
      <span>${entry.team}</span>
      <span>${entry.score} Pkt</span>
    `;

    box.appendChild(row);
  });
}
