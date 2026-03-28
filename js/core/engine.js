let interval = null;

function startMatch(){

  const match = getCurrentMatch();

  game.match.current = {
    ...match,
    minute: 0,
    homeGoals: 0,
    awayGoals: 0,
    running: true
  };

  game.phase = "live";

  startLoop();
}

function startLoop(){

  clearInterval(interval);

  interval = setInterval(tick, 1000 / game.settings.speed);
}

function tick(){

  const m = game.match.current;
  if(!m || !m.running) return;

  m.minute++;

  if(Math.random() < 0.05){
    m.homeGoals++;
  }

  if(m.minute === 45){
    pauseMatch("halftime");
  }

  if(m.minute >= 90){
    finishMatch();
  }

  updateUI();
}

function pauseMatch(type){
  game.match.current.running = false;
  game.phase = type;
  clearInterval(interval);
}

function resumeMatch(){
  game.match.current.running = true;
  game.phase = "live";
  startLoop();
}

function finishMatch(){

  const m = game.match.current;

  saveResult(m);

  game.phase = "ready";
  clearInterval(interval);

  game.league.currentMatchday++;
}

function setSpeed(val){
  game.settings.speed = val;
  if(game.match.current?.running) startLoop();
}

window.startMatch = startMatch;
window.resumeMatch = resumeMatch;
window.setSpeed = setSpeed;
