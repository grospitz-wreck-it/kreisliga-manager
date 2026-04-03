import { on } from "./events.js";
import { EVENTS } from "./events.constants.js";
import { game } from "../core/state.js";

// =========================
// 📡 EVENT → STATE SYNC
// =========================

// 🔥 ALLE MATCH EVENTS
on(EVENTS.MATCH_EVENT, (event) => {

  if(!window.game) return;

  // letztes Event speichern
  game.events.last = event;

  // History erweitern
  game.events.history.unshift(event);

  // Limit (Performance)
  if(game.events.history.length > 200){
    game.events.history.pop();
  }

  // 🔥 LIVE MATCH SYNC
  if(game.match?.live){
    game.match.live.events.unshift(event);

    if(game.match.live.events.length > 25){
      game.match.live.events.pop();
    }
  }

});


// =========================
// 🏁 MATCH START
// =========================
on(EVENTS.GAME_START, () => {

  if(!game.match?.live) return;

  game.match.live.minute = 0;
  game.match.live.running = true;
  game.match.live.events = [];
});


// =========================
// 🔁 STATE UPDATE
// =========================
on(EVENTS.STATE_CHANGED, (data) => {

  if(!game.match?.live) return;

  if(data.minute !== undefined){
    game.match.live.minute = data.minute;
  }

  if(data.score){
    game.match.live.score = data.score;
  }

});


// =========================
// 🏁 MATCH ENDE
// =========================
on(EVENTS.MATCH_FINISHED, () => {

  if(!game.match?.live) return;

  game.match.live.running = false;
});
