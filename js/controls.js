// =========================
// ⚙️ CONTROLS FIXED
// =========================

// 🔥 globale Variable (Engine nutzt die gleiche!)
window.speedMultiplier = window.speedMultiplier || 1;


// =========================
// 🚀 SPEED
// =========================
function setSpeed(speed){

  if(![1,3,5].includes(speed)) return;

  window.speedMultiplier = speed;

  console.log("⚡ Speed gesetzt auf:", speed);
}


// =========================
// 🎮 OPTIONAL: LIVE MODES
// =========================
function setLiveMode(mode){
  console.log("Live Mode:", mode);
}

function setTactic(){
  console.log("Taktik geändert");
}

function setFormation(){
  console.log("Formation geändert");
}

function makeSub(){
  console.log("Wechsel durchgeführt");
}

function setIntensity(val){
  console.log("Intensität:", val);
}
