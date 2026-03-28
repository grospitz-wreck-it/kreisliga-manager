// =========================
// ⚽ MATCH STATE
// =========================
const matchState = {
  minute: 0,
  half: 1,
  running: false,
  score: {
    home: 0,
    away: 0
  }
};

window.matchState = matchState;

// =========================
// ▶️ BUTTON LOGIK
// =========================
function handleMainAction(){

  if(game.phase === "idle"){
    startMatch();
  } else if(game.phase === "live"){
    endMatch();
  }
}

window.handleMainAction = handleMainAction;

// =========================
// 🔍 SPIEL FINDEN (ROBUST)
// =========================
function findPlayerMatch(){

  const round = game.league.schedule?.[game.league.currentRound];
  const myName = game.team.selected?.name;

  if(!round || !myName){
    console.error("❌ Kein Spieltag oder Team fehlt");
    return null;
  }

  for(let match of round){

    // 🔥 unterstützt BEIDES (string oder objekt)
    const homeName = typeof match.home === "string" ? match.home : match.home.name;
    const awayName = typeof match.away === "string" ? match.away : match.away.name;

    if(homeName === myName || awayName === myName){
      console.log("✅ Spiel gefunden:", homeName, "vs", awayName);

      // 🔥 sicherstellen: wir haben OBJEKTE
      const homeObj = typeof match.home === "string"
        ? game.league.teams.find(t => t.name === match.home)
        : match.home;

      const awayObj = typeof match.away === "string"
        ? game.league.teams.find(t => t.name === match.away)
        : match.away;

      match.home = homeObj;
      match.away = awayObj;

      return match;
    }
  }

  console.error("❌ Dein Team ist NICHT im Spieltag!");
  return null;
}

// =========================
// ⚽ SPIELTAG SIMULIEREN
// =========================
function simulateMatchday(){

  const round = game.league.schedule?.[game.league.currentRound];

  if(!round){
    console.error("❌ Kein Spieltag vorhanden");
    return;
  }

  round.forEach(match => {

    const homeName = typeof match.home === "string" ? match.home : match.home.name;
    const awayName = typeof match.away === "string" ? match.away : match.away.name;

    const isPlayerMatch =
      homeName === game.team.selected?.name ||
      awayName === game.team.selected?.name;

    if(isPlayerMatch){
      return;
    }

    const homeObj = typeof match.home === "string"
      ? game.league.teams.find(t => t.name === match.home)
      : match.home;

    const awayObj = typeof match.away === "string"
      ? game.league.teams.find(t => t.name === match.away)
      : match.away;

    const result = simulateMatch(homeObj, awayObj);

    match.result = result;

    updateTable(homeObj, awayObj, result.home, result.away);
  });

  console.log("📊 Spieltag simuliert");
}

// =========================
// 🤖 SIMULATION
// =========================
function simulateMatch(home, away){

  const diff = home.strength - away.strength;

  const gHome = Math.max(0, Math.round(Math.random()*2 + diff*0.02));
  const gAway = Math.max(0, Math.round(Math.random()*2 - diff*0.02));

  return { home: gHome, away: gAway };
}

// =========================
// 🚀 START MATCH (FIXED)
// =========================
function startMatch(){

  console.log("=== START MATCH ===");

  simulateMatchday();

  const match = findPlayerMatch();

  if(!match){
    alert("❌ Spiel konnte nicht gefunden werden!");
    return;
  }

  game.match.current = match;
  game.phase = "live";

  matchState.minute = 0;
  matchState.half = 1;
  matchState.running = true;

  matchState.score.home = 0;
  matchState.score.away = 0;

  console.log("🚀 Starte:", match.home.name, "vs", match.away.name);

  clearLiveFeed?.();

  runMatchLoop();
}

window.startMatch = startMatch;

// =========================
// ⏱️ MATCH LOOP
// =========================
function runMatchLoop(){

  const interval = setInterval(() => {

    if(!matchState.running){
      clearInterval(interval);
      return;
    }

    matchState.minute++;

    if(matchState.minute === 46){
      matchState.half = 2;
      addLiveEvent?.("⏸️ Halbzeit");
    }

    if(matchState.minute > 90){
      matchState.running = false;
      clearInterval(interval);
      endMatch();
      return;
    }

    simulateLiveEvent();
    updateUI?.();

  }, 500);
}

// =========================
// 🎯 EVENTS
// =========================
function simulateLiveEvent(){

  const rand = Math.random();
  const home = game.match.current.home;
  const away = game.match.current.away;

  if(rand < 0.08){
    if(Math.random() < 0.5){
      matchState.score.home++;
      addLiveEvent?.(`⚽ ${home.name}`);
    } else {
      matchState.score.away++;
      addLiveEvent?.(`⚽ ${away.name}`);
    }
  } else if(rand < 0.3){
    addLiveEvent?.("🔥 Chance");
  } else if(rand < 0.5){
    addLiveEvent?.("🟨 Foul");
  }
}

// =========================
// 🛑 ENDE
// =========================
function endMatch(){

  const match = game.match.current;

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

  game.league.currentRound++;

  game.phase = "idle";

  saveGame?.();

  console.log("🏁 Spiel beendet");
}

window.endMatch = endMatch;
