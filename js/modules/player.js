// =========================
// 👤 PLAYER MODULE
// =========================
import { game } from "../core/state.js";
import { saveGame } from "../services/storage.js";
import { updateHeader } from "../ui/ui.js";

console.log("PLAYER MODULE");

// =========================
// 👤 INIT PLAYER (für UI)
// =========================
function initPlayer(){

if(!game.player){
game.player = { name: "" };
}

const input = document.getElementById("nameInput");

if(input){
input.value = game.player.name || "";
}

updateHeader();
}

// =========================
// 👤 SET NAME (NEU!)
// =========================
function setPlayerName(name){

if(!name || !name.trim()){
console.warn("❌ Ungültiger Name");
return;
}

game.player.name = name.trim();

saveGame();
updateHeader();

console.log("👤 Player gesetzt:", game.player.name);
}

// =========================
// ✏️ NAME ÄNDERN (UI)
// =========================
function changeName(){

const input = document.getElementById("nameInput");
if(!input) return;

setPlayerName(input.value);
}

// =========================
// 📦 EXPORTS
// =========================
export {
initPlayer,
setPlayerName,
changeName
};
