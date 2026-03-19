function generateSchedule(){
    if(rand<0.04+liveModifier){
      if(Math.random()<0.5){
        liveScore.s1++;
        addEvent(`⚽ ${currentMinute}' Tor ${liveScore.t1.name}`);
      } else {
        liveScore.s2++;
        addEvent(`⚽ ${currentMinute}' Tor ${liveScore.t2.name}`);
      }
    } else if(rand<0.08){
      addEvent(`🟨 ${currentMinute}' Gelbe Karte`);
    } else if(rand<0.1){
      addEvent(`💥 ${currentMinute}' Große Chance`);
    } else if(rand<0.12){
      addEvent(`🧤 ${currentMinute}' Starke Parade`);
    }

    updateScoreboard(liveScore.t1,liveScore.t2,liveScore.s1,liveScore.s2);
    updateTimeline(currentMinute);

    if(currentMinute===45){
      clearInterval(currentInterval);
      isSimulating=false;
      document.getElementById("halftimePanel").style.display="block";
      addEvent("⏸️ Halbzeit");
      return;
    }

    if(currentMinute>=90){
      clearInterval(currentInterval);
      finishMatch();
    }

  },matchDuration/90);
}

function resumeMatch(){
  document.getElementById("halftimePanel").style.display="none";
  isSimulating=true;
  startInterval();
}

function finishMatch(){
  isSimulating=false;

  let {t1,t2,s1,s2}=liveScore;

  addEvent(`🏁 Endstand: ${s1}:${s2}`);

  t1.goals+=s1; t2.goals+=s2;

  if(s1>s2) t1.points+=3;
  else if(s2>s1) t2.points+=3;
  else { t1.points++; t2.points++; }

  currentMatchday++;

  document.getElementById("matchday").innerText=
    "Spieltag: "+currentMatchday+" / "+schedule.length;

  updateTable();
  document.getElementById("startBtn").disabled=false;
}
