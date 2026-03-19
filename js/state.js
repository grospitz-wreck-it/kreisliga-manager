let teams = [];
let schedule = [];
let currentMatchday = 0;
let selectedTeam = null;

let isSimulating = false;
let currentInterval = null;
let currentMinute = 0;

let speedMultiplier = 1; // 🔥 NEU echte Geschwindigkeit

let liveModifier = 0;
let substitutions = 5;

let liveScore = { t1:null, t2:null, s1:0, s2:0 };

const leagues = { herford: "Kreisliga Herford" };
