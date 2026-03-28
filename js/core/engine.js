// =========================
// ⚽ MATCH STATE
// =========================
const matchState = {
  minute: 0,
  half: 1,
  running: false,
  score: { home: 0, away: 0 }
};

window.matchState = matchState;

// =========================
// ▶️ BUTTON
// =========================
function handleMainAction(){

  console.log("BUTTON CLICK");
  console.log("Phase:", game.phase);

  if(game.phase !== "live"){
    startMatch();
  } else {
    endMatch();
  }
}

window.handleMainAction = handleMainAction;

// =========================
// 🔍 SPIEL FINDEN
// =========================
function findPlayerMatch(){

  const round = game.league.schedule?.[game.league.currentRound];
  const myName = game.team.selected;

  console.log("=== FIND MATCH ===");
  console.log("Mein Team:", myName);
  console.log("Spieltag:", round);

  if(!round){
    console.error("❌ Kein Spieltag!");
    return null;
  }

  for(let match of round){

    console.log("Check:", match.home.name, "vs", match.away.name);

    if(match.home.name === myName || match.away.name === myName){
      console.log("✅ GEFUNDEN!");
      return match;
    }
  }

  console.error("❌ NICHT GEFUNDEN!");
  return null;
}

// =========================
// ⚽ SPIELTAG SIMULIEREN
// =========================
function simulateMatchday(){

  const round = game.league.schedule?.[game.league.currentRound];

  if(!round){
    console.error("❌ Kein Spieltag");
    return;
  }

  round.forEach(match => {

    if(
      match.home.name === game.team.selected ||
      match.away.name === game.team.selected
    ){
      return;
    }

    const result = simulateMatch(match.home, match.away);

    match.result = result;

    updateTable(
      match.home,
      match.away,
      result.home,
      result.away
    );
  });

  console.log("📊 Spieltag simuliert");
}

// =========================
// 🤖 SIMULATION
// =========================
function simulateMatch(home, away){

  const diff = home.strength - away.strength;

  return {
    home: Math.max(0, Math.round(Math.random()*2 + diff*0.02)),
    away: Math.max(0, Math.round(Math.random()*2 - diff*0.02))
  };
}

// =========================
// 🚀 START MATCH
// =========================
function startMatch(){

  console.log("=== START MATCH ===");

  // 🔥 HARD RESET
  game.phase = "idle";

  simulateMatchday();

  let match = findPlayerMatch();

  // 🔥 NOTFALL: ERSTES SPIEL NEHMEN
  if(!match){
    console.warn("⚠️ Fallback: nehme erstes Spiel");
    match = game.league.schedule?.[game.league.currentRound]?.[0];
  }

  if(!match){
    alert("❌ GAR KEIN SPIEL VORHANDEN");
    return;
  }

  game.match.current = match;
  game.phase = "live";

  matchState.minute = 0;
  matchState.half = 1;
  matchState.running = true;

  matchState.score.home = 0;
  matchState.score.away = 0;

  console.log("🚀 STARTET JETZT:", match.home.name, "vs", match.away.name);

  runMatchLoop();
}

window.startMatch = startMatch;

// =========================
// ⏱️ LOOP
// =========================
function runMatchLoop(){

  console.log("⏱️ MATCH LOOP START");

  const interval = setInterval(() => {

    if(!matchState.running){
      clearInterval(interval);
      return;
    }

    matchState.minute++;

    console.log("Minute:", matchState.minute);

    if(matchState.minute === 46){
      matchState.half = 2;
      console.log("Halbzeit");
    }

    if(matchState.minute > 90){
      matchState.running = false;
      clearInterval(interval);
      endMatch();
      return;
    }

  }, 300);
}

// =========================
// 🛑 ENDE
// =========================
function endMatch(){

  console.log("🏁 ENDE");

  const match = game.match.current;

  if(match){
    match.result = {
      home: matchState.score.home,
      away: matchState.score.away
    };

    updateTable(
      match.home,
      match.away,
      matchState.score.home,
      matchState.score.away
    );
  }

  game.league.currentRound++;
  game.phase = "idle";
}

window.endMatch = endMatch;
