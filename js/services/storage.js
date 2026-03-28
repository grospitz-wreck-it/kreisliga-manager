function saveGame(){
  localStorage.setItem("save", JSON.stringify(game));
}

function loadGame(){

  const data = localStorage.getItem("save");
  if(data){
    Object.assign(game, JSON.parse(data));
  }
}

window.saveGame = saveGame;
window.loadGame = loadGame;
