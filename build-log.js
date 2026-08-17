const buildLogSection=document.querySelector('.build-log-scroll');
const buildLogRail=document.querySelector('.build-log-rail');
const buildLogWindow=document.querySelector('.build-log-window');
const buildLogProgress=document.querySelector('.log-scroll-line span');
let buildTarget=0,buildCurrent=0,buildRaf=null;
/* Same as the project rail: measure once, never inside the scroll/frame path. */
let logStart=0,logTravel=1,logDistance=0;
function measureBuildLog(){
  if(!buildLogSection||!buildLogRail||!buildLogWindow)return;
  logStart=buildLogSection.offsetTop;
  logTravel=Math.max(1,buildLogSection.offsetHeight-innerHeight);
  logDistance=Math.max(0,buildLogRail.scrollHeight-buildLogWindow.clientHeight);
  readBuildLog();
}
function readBuildLog(){
  if(!buildLogSection)return;
  buildTarget=Math.max(0,Math.min(1,(scrollY-logStart)/logTravel));
  if(!buildRaf)buildRaf=requestAnimationFrame(renderBuildLog);
}
function drawBuildLog(){
  buildLogRail.style.transform=`translate3d(0,${-logDistance*buildCurrent}px,0)`;
  if(buildLogProgress)buildLogProgress.style.height=`${buildCurrent*100}%`;
}
function renderBuildLog(){
  const drag=buildTarget-buildCurrent;
  buildCurrent+=drag*.14;
  if(Math.abs(drag)>.0004){drawBuildLog();buildRaf=requestAnimationFrame(renderBuildLog)}
  else{buildCurrent=buildTarget;drawBuildLog();buildRaf=null}
}
addEventListener('scroll',readBuildLog,{passive:true});
addEventListener('resize',measureBuildLog);
addEventListener('load',measureBuildLog);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measureBuildLog);
measureBuildLog();
