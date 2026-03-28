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
// 🔍 SPIEL FINDEN
// =========================
function findPlayerMatch(){

  const round = game.league.schedule?.[game.league.currentRound];
  const myName = game.team.selected;

  if(!round){
    console.error("❌ Kein Spieltag vorhanden");
    return null;
  }

  if(!myName){
    console.error("❌ Kein Team ausgewählt");
    return null;
  }

  const match = round.find(m =>
    m.home.name === myName ||
    m.away.name === myName
  );

  if(!match){
    console.error("❌ Team nicht im Spieltag!");
    console.log("Mein Team:", myName);
    console.log("Spiele:", round);
    return null;
  }

  return match;
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

  const myName = game.team.selected;

  round.forEach(match => {

    const isPlayerMatch =
      match.home.name === myName ||
      match.away.name === myName;

    // 👉 eigenes Spiel überspringen
    if(isPlayerMatch){
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
// 🤖 MATCH SIMULATION
// =========================
function simulateMatch(home, away){

  const diff = home.strength - away.strength;

  const goalsHome = Math.max(0, Math.round(Math.random() * 2 + diff * 0.02));
  const goalsAway = Math.max(0, Math.round(Math.random() * 2 - diff * 0.02));

  return {
    home: goalsHome,
    away: goalsAway
  };
}

// =========================
// 🚀 MATCH STARTEN
// =========================
function startMatch(){

  console.log("=== START MATCH ===");

  simulateMatchday();

  const match = findPlayerMatch();

  if(!match){
    alert("❌ Dein Spiel wurde nicht gefunden!");
    return;
  }

  game.match.current = match;
  game.phase = "live";

  matchState.minute = 0;
  matchState.half = 1;
  matchState.running = true;

  matchState.score.home = 0;
  matchState.score.away = 0;

  console.log("🚀 Spiel startet:", match.home.name, "vs", match.away.name);

  clearLiveFeed?.();

  runMatchLoop();
}

window.startMatch = startMatch;

// =========================
// ⏱️ MATCH LOOP (2x45)
// =========================
function runMatchLoop(){

  const interval = setInterval(() => {

    if(!matchState.running){
      clearInterval(interval);
      return;
    }

    matchState.minute++;

    // 👉 Halbzeit
    if(matchState.minute === 46){
      matchState.half = 2;
      addLiveEvent?.("⏸️ Halbzeit");
    }

    // 👉 Spielende
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
// 🎯 LIVE EVENTS (Basis)
// =========================
function simulateLiveEvent(){

  const rand = Math.random();

  const home = game.match.current.home;
  const away = game.match.current.away;

  // ⚽ TOR (selten)
  if(rand < 0.08){

    if(Math.random() < 0.5){
      matchState.score.home++;
      addLiveEvent?.(`⚽ ${home.name} trifft!`);
    } else {
      matchState.score.away++;
      addLiveEvent?.(`⚽ ${away.name} trifft!`);
    }

  }

  // 🔥 Chance
  else if(rand < 0.25){
    addLiveEvent?.("🔥 Große Chance!");
  }

  // 🟨 Foul
  else if(rand < 0.45){
    addLiveEvent?.("🟨 Foul im Mittelfeld");
  }

  // 🚩 Abseits (neu leicht drin)
  else if(rand < 0.55){
    addLiveEvent?.("🚩 Abseits!");
  }
}

// =========================
// 🛑 MATCH ENDE
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
