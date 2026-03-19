window.onload=function(){
  const select=document.getElementById("leagueSelect");
  if(!select) return;

  Object.keys(leagues).forEach(l=>{
    let o=document.createElement("option");
    o.value=l;
    o.textContent=leagues[l];
    select.appendChild(o);
  });
};
