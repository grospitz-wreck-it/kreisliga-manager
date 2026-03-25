async function loadLeaderboard(){

var box = document.getElementById("leaderboard");

if(!box){
console.error("leaderboard nicht gefunden");
return;
}

box.innerHTML = "Lade Daten...";

var res = await supabaseClient
.from("leaderboard")
.select("*");

var data = res.data;
var error = res.error;

if(error){
console.error("Leaderboard Fehler:", error);
box.innerHTML = "Fehler: " + error.message;
return;
}

if(!data || data.length === 0){
box.innerHTML = "Noch keine Einträge";
return;
}

// Beste Scores pro Spieler
var bestPerPlayer = Object.values(
data.reduce(function(acc, entry){

```
  if(
    !acc[entry.player_id] ||
    acc[entry.player_id].score < entry.score
  ){
    acc[entry.player_id] = entry;
  }

  return acc;

}, {})
```

);

// Sortieren
bestPerPlayer.sort(function(a, b){
return b.score - a.score;
});

var top10 = bestPerPlayer.slice(0, 10);

box.innerHTML = "";

top10.forEach(function(entry, i){

```
var div = document.createElement("div");

// Highlight eigener Spieler
if(entry.player_id === game.player.id){
  div.style.background = "gold";
  div.style.color = "black";
  div.style.fontWeight = "bold";
  div.style.borderRadius = "6px";
  div.style.padding = "4px";
}

div.style.marginBottom = "6px";

var html = "";
html += "<strong>#" + (i+1) + "</strong> ";
html += "<span style='color:" + (entry.color || "#fff") + "'>";
html += entry.name ? entry.name : "Unbekannt";
html += "</span>";
html += "<br><small>(" + entry.team + ")</small> - ";
html += "<strong>" + entry.score + "</strong> Punkte";

div.innerHTML = html;

box.appendChild(div);
```

});

var myRank = bestPerPlayer.findIndex(function(e){
return e.player_id === game.player.id;
});

if(myRank !== -1){
var rankDiv = document.createElement("div");
rankDiv.innerHTML = "Dein Rang: #" + (myRank + 1);
rankDiv.style.marginTop = "10px";
rankDiv.style.fontWeight = "bold";
box.appendChild(rankDiv);
}
}
