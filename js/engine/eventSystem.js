// =========================
// 🎮 EVENT SYSTEM
// =========================

import { resolveEvent } from "./eventResolver.js";
import { EVENT_REGISTRY } from "./eventRegistry.js";
import { game } from "../core/state.js";

// aktive Events (Buffs etc.)
const activeEvents = [];

function triggerEvent(eventId, context){

  const def = EVENT_REGISTRY[eventId];
  if(!def) return;

  // speichern
  const eventObj = {
    id: eventId,
    minute: game.match.live.minute,
    duration: def.duration || 0,
    data: context
  };

  activeEvents.push(eventObj);

  // Event Chain
  const next = resolveEvent(eventId, context);

  if(next){
    triggerEvent(next, context);
  }
}

// =========================
// ⏳ UPDATE (jede Minute)
// =========================
function updateEvents(){

  for(let i = activeEvents.length - 1; i >= 0; i--){

    const e = activeEvents[i];

    if(e.duration > 0){
      e.duration--;

      if(e.duration <= 0){
        activeEvents.splice(i, 1);
      }
    }
  }
}

// =========================
// 📊 MODIFIER ABFRAGE
// =========================
function getActiveModifiers(){

  return activeEvents
    .map(e => EVENT_REGISTRY[e.id]?.modifier)
    .filter(Boolean);
}

export {
  triggerEvent,
  updateEvents,
  getActiveModifiers
};
