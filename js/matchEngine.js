function generateSchedule(){
    } else if(r<0.10){
      addEvent(`🟨 ${currentMinute}' Gelb`);
    } else if(r<0.15){
      addEvent(`💥 Chance`);
    }

    updateScoreboard(liveScore.t1,liveScore.t2,liveScore.s1,liveScore.s2);
    updateTimeline(currentMinute);

    if(currentMinute===45){
      clearInterval(currentInterval);
      isSimulating=false;
      document.getElementById("halftimePanel").style.display="block";
      return;
    }

    if(currentMinute>=90){
      clearInterval(currentInterval);
      finishMatch();
    }

  }, intervalTime);
}

function restartInterval(){
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

  t1.goals+=s1; t2.goals+=s2;

  if(s1>s2) t1.points+=3;
  else if(s2>s1) t2.points+=3;
  else { t1.points++; t2.points++; }

  currentMatchday++;

  document.getElementById("matchday").innerText=
    "Spieltag: "+currentMatchday+" / "+schedule.length;

  updateTable();
}
