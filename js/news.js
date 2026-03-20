function r(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

// 🧠 Bewertung eines Spiels
function analyzeMatch(m){
  let diff = Math.abs(m.s1 - m.s2);
  let total = m.s1 + m.s2;

  return {
    dominant: diff >= 3,
    close: diff === 0 || diff === 1,
    crazy: total >= 5
  };
}

// 🧠 Einzelspiel-Satz
function buildMatchText(match){

  const team1 = match.home;
  const team2 = match.away;
  const s1 = match.score1;
  const s2 = match.score2;

  let text = `${team1} ${s1}:${s2} ${team2}`;

  // Ergebnis bewerten
  if(s1 > s2){
    text += ` – ${team1} setzt sich durch.`;
  }
  else if(s2 > s1){
    text += ` – ${team2} gewinnt die Partie.`;
  }
  else{
    text += ` – Punkteteilung.`;
  }

  return text;
}

// 🧠 Tabellenanalyse
function buildTableStory(){

  let leader = teams[0];
  let bottom = teams.slice(-2);

  let text = "";

  text += `${leader.name} bleibt weiterhin ${r(words.positive)} und setzt sich an der Tabellenspitze fest. `;

  text += `${bottom[0].name} und ${bottom[1].name} zeigen sich dagegen ${r(words.negative)} und stecken tief im Tabellenkeller fest.`;

  return text;
}

// 📰 HAUPTBERICHT
function generateMatchdayReport(results){

  if(!results || results.length === 0){
    return "Noch keine Spiele gespielt.";
  }

  // 🔥 Sortierung wichtig!
  teams.sort((a,b)=> 
    b.points - a.points || 
    (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst)
  );

  let text = "";

  // 🧠 Headline
  text += `📰 ${r(words.general).toUpperCase()}ER SPIELTAG\n\n`;

  // 🧠 Einleitung
  text += `Der Spieltag bot viele ${r(words.general)} Szenen und zeigte einmal mehr die ${r(words.general)} Qualität der Liga.\n\n`;

  // 🧠 Spiele
  let sample = results.slice(0, 4);
  sample.forEach(m => {
    text += buildMatchText(m) + " ";
  });

  text += "\n\n";

  // 🧠 Tabelle
  text += buildTableStory() + "\n\n";

  // 🧠 Abschluss
  text += `Insgesamt bleibt die Liga ${r(words.general)} und sorgt weiterhin für ${r(words.general)} Unterhaltung.`;

  return text;
}
