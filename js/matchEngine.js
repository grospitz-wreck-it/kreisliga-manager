function generateSchedule(){
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

function restartInterval(){
  clearInterval(currentInterval);
  startInterval();
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
