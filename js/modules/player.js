// =========================
// 👤 PLAYER MODULE
// =========================
import { game } from "../core/state.js";
import { updateHeader } from "../ui/ui.js";

console.log("PLAYER MODULE");

// =========================
// 👤 INIT PLAYER
// =========================
function initPlayer(){

if(!game.player){
game.player = {};
}

if(!game.player.name){

```
const saved = localStorage.getItem("playerName");

if(saved){
  game.player.name = saved;
} else {

  let name = prompt("Manager Name?");
  if(!name){
    name = "Manager_" + Math.floor(Math.random() * 1000);
  }

  game.player.name = name;
  localStorage.setItem("playerName", name);
}
```

}

const input = document.getElementById("nameInput");
if(input){
input.value = game.player.name;
}

console.log("👤 Player:", game.player.name);
}

// =========================
// ✏️ NAME ÄNDERN
// =========================
function changeName(){

const input = document.getElementById("nameInput");
if(!input) return;

const name = input.value.trim();
if(!name) return;

game.player.name = name;
localStorage.setItem("playerName", name);

updateHeader?.();
}

// =========================
// 📦 EXPORTS
// =========================
export {
initPlayer,
changeName
};
