// =========================
// 🌍 GLOBAL STATE (SAFE)
// =========================

if(!window.__GAME_STATE__){

  window.__GAME_STATE__ = {

    teams: [],
    schedule: [],
    currentMatchday: 0,
    selectedTeam: null,
    teamLocked: false,

    isSimulating: false,
    currentInterval: null,
    currentMinute: 0,
    matchdayResults: [],
    speedMultiplier: 1,

    liveModifier: 0,
    tacticModifier: 0,
    formationModifier: 0,
    substitutions: 5,

    liveScore: { t1:null, t2:null, s1:0, s2:0 }
  };

}

// =========================
// 🔗 SHORTCUTS
// =========================

let teams = window.__GAME_STATE__.teams;
let schedule = window.__GAME_STATE__.schedule;
let currentMatchday = window.__GAME_STATE__.currentMatchday;
let selectedTeam = window.__GAME_STATE__.selectedTeam;
let teamLocked = window.__GAME_STATE__.teamLocked;

let isSimulating = window.__GAME_STATE__.isSimulating;
let currentInterval = window.__GAME_STATE__.currentInterval;
let currentMinute = window.__GAME_STATE__.currentMinute;
let matchdayResults = window.__GAME_STATE__.matchdayResults;
let speedMultiplier = window.__GAME_STATE__.speedMultiplier;

let liveModifier = window.__GAME_STATE__.liveModifier;
let tacticModifier = window.__GAME_STATE__.tacticModifier;
let formationModifier = window.__GAME_STATE__.formationModifier;
let substitutions = window.__GAME_STATE__.substitutions;

// 🔥 FIX: richtige Variable deklarieren
let liveScore = window.__GAME_STATE__.liveScore;


// =========================
// 🏆 LIGEN
// =========================

const leagues = {
  herford: "Kreisliga Herford",
  luebbecke: "Kreisliga A Lübbecke",
  bielefeld: "Kreisliga A Bielefeld"
};


// =========================
// 💾 SAVE GAME STATE
// =========================

function saveGameState(){

  const state = {
    teams,
    schedule,
    currentMatchday,
    selectedTeam,
    matchdayResults,
    liveScore,
    currentMinute
  };

  localStorage.setItem("gameState", JSON.stringify(state));

  console.log("💾 Game gespeichert");
}


// =========================
// 📦 LOAD GAME STATE
// =========================

function loadGameState(){

  const saved = localStorage.getItem("gameState");

  if(!saved){
    console.log("Kein Save gefunden");
    return;
  }

  try{
    const state = JSON.parse(saved);

    teams = state.teams || teams;
    schedule = state.schedule || schedule;
    currentMatchday = state.currentMatchday || 0;
    selectedTeam = state.selectedTeam || null;
    matchdayResults = state.matchdayResults || [];

    // 🔥 FIX: sauberer fallback
    liveScore = state.liveScore || { t1:null, t2:null, s1:0, s2:0 };

    currentMinute = state.currentMinute || 0;

    console.log("📦 Game geladen");

  } catch(e){
    console.error("Save kaputt:", e);
  }
}
