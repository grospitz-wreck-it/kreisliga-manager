window.onload=function(){
  let select=document.getElementById("leagueSelect");
  Object.keys(leagues).forEach(l=>{
    let o=document.createElement("option");
    o.value=l;
    o.textContent=leagues[l];
    select.appendChild(o);
  });
};
