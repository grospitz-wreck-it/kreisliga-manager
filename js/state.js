let teams = [];
let schedule = [];
let currentMatchday = 0;
let selectedTeam = null;

let isSimulating = false;
let currentInterval = null;
let matchStartTime = 0;
let matchDuration = 180000; // 3 Minuten

let halftimeDone = false;

let liveModifier = 0;
let substitutions = 5;
