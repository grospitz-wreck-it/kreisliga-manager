window.onload = () => {

  loadGame();

  initUI();

  bindUI();

  console.log("✅ READY");
};

function handleMainAction(){

  switch(game.phase){

    case "setup":
      generateSchedule();
      game.phase = "ready";
      break;

    case "ready":
      startMatch();
      break;

    case "halftime":
      resumeMatch();
      break;
  }
}
