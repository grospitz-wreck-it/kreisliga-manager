// =========================
// 🌍 GLOBAL STATE (SAFE)
// =========================

// 👉 verhindert doppelte Initialisierung
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
// 🔗 SHORTCUTS (GLOBAL VARS)
// =========================

// 👉 Zugriff wie vorher möglich (kein Refactor nötig)

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

window.liveScore = window.__GAME_STATE__.liveScore;

// =========================
// 🏆 LIGEN
// =========================

const leagues = {
  herford: "Kreisliga Herford",
  luebbecke: "Kreisliga A Lübbecke",
  bielefeld: "Kreisliga A Bielefeld"
};
