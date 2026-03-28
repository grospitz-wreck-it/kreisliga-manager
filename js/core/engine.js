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
// ▶️ HAUPTAKTION BUTTON
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
// ⚽ KOMPLETTEN SPIELTAG SIMULIEREN
// =========================
function simulateMatchday(){

  const schedule = game.league.schedule;
  const roundIndex = game.league.currentRound;

  if(!schedule || !schedule[roundIndex]){
    console.error("❌ Kein Spielplan vorhanden oder falscher Spieltag");
    return;
  }

  const matches = schedule[roundIndex];

  console.log("👉 Dein Team:", game.team.selected);
  console.log("👉 Spiele:", matches);

  game.match.current = null; // 🔥 reset wichtig!

  matches.forEach(match => {

    // 🔥 WICHTIG: Namen vergleichen
    const homeName = match.home.name;
    const awayName = match.away.name;
    const myName = game.team.selected?.name;

    console.log("Check:", homeName, "vs", myName, "|", awayName, "vs", myName);

    const isPlayerMatch =
      homeName === myName ||
      awayName === myName;

    if(isPlayerMatch){
      console.log("✅ DEIN SPIEL GEFUNDEN");
      game.match.current = match;
      return;
    }

    // 👉 andere Spiele simulieren
    const result = simulateMatch(match.home, match.away);

    match.result = result;

    updateTable(match.home, match.away, result.home, result.away);
  });

  if(!game.match.current){
    console.error("❌ KEIN SPIEL FÜR DICH GEFUNDEN!");
  }
}

// =========================
// 🤖 MATCH SIMULATION
// =========================
function simulateMatch(home, away){

  const strengthDiff = home.strength - away.strength;

  const baseGoalsHome = Math.random() * 2 + (strengthDiff * 0.02);
  const baseGoalsAway = Math.random() * 2 - (strengthDiff * 0.02);

  const goalsHome = Math.max(0, Math.round(baseGoalsHome));
  const goalsAway = Math.max(0, Math.round(baseGoalsAway));

  return {
    home: goalsHome,
    away: goalsAway
  };
}

// =========================
// 🚀 MATCH STARTEN
// =========================
function startMatch(){

  simulateMatchday();

  const match = game.match.current;

  if(!match){
    alert("❌ Dein Spiel wurde nicht gefunden!");
    console.error("Problem: Team nicht im Spieltag");
    return;
  }

  game.phase = "live";

  matchState.minute = 0;
  matchState.half = 1;
  matchState.running = true;

  matchState.score.home = 0;
  matchState.score.away = 0;

  console.log("🚀 Starte Spiel:", match.home.name, "vs", match.away.name);

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

    // Halbzeit
    if(matchState.minute === 46){
      matchState.half = 2;
      addLiveEvent?.("⏸️ Halbzeit");
    }

    // Spielende
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
// 🎯 LIVE EVENTS
// =========================
function simulateLiveEvent(){

  const rand = Math.random();

  const home = game.match.current.home;
  const away = game.match.current.away;

  if(rand < 0.08){

    if(Math.random() < 0.5){
      matchState.score.home++;
      addLiveEvent?.(`⚽ ${home.name} trifft!`);
    } else {
      matchState.score.away++;
      addLiveEvent?.(`⚽ ${away.name} trifft!`);
    }

  } else if(rand < 0.25){
    addLiveEvent?.("🔥 Gute Chance!");
  } else if(rand < 0.40){
    addLiveEvent?.("🟨 Foul im Mittelfeld");
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
