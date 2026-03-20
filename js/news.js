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
function buildMatchText(m){
  let a = analyzeMatch(m);

  // Gewinner / Verlierer bestimmen
  let winner = m.s1 > m.s2 ? m.t1.name : m.t2.name;
  let loser  = m.s1 > m.s2 ? m.t2.name : m.t1.name;

  // Unentschieden
  if(m.s1 === m.s2){
    return `${m.t1.name} und ${m.t2.name} trennten sich ${m.s1}:${m.s2} nach einem ${r(words.general)} Spiel.`;
  }

  // Dominanter Sieg
  if(a.dominant){
    return `${winner} zeigte sich ${r(words.positive)} und ließ ${loser} beim ${m.s1}:${m.s2} kaum eine Chance.`;
  }

  // Verrücktes Spiel
  if(a.crazy){
    return `Das ${m.s1}:${m.s2} zwischen ${m.t1.name} und ${m.t2.name} entwickelte sich zu einem ${r(words.crazy)} Spiel mit vielen Momenten im ${r(words.general)} Stil.`;
  }

  // Normales Spiel
  return `${winner} gewann ${m.s1}:${m.s2} gegen ${loser} und überzeugte mit ${r(words.positive)}, während ${loser} teilweise ${r(words.negative)} wirkte.`;
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
