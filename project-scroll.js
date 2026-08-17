const projectSection=document.querySelector('.projects-scroll');
const projectRail=document.querySelector('.project-rail');
const projectWindow=document.querySelector('.project-window');
const railProgress=document.querySelector('.rail-progress span');
let currentProgress=0,targetProgress=0,rafId=null;
/* Geometry is read once here instead of on every scroll event and every frame —
   offsetTop/offsetHeight/scrollWidth each force a synchronous layout. */
let railStart=0,railTravel=1,railDistance=0;
function measureProjectRail(){
  if(!projectSection||!projectRail||!projectWindow)return;
  railStart=projectSection.offsetTop;
  railTravel=Math.max(1,projectSection.offsetHeight-innerHeight);
  railDistance=Math.max(0,projectRail.scrollWidth-projectWindow.clientWidth);
  updateProjectRail();
}
function updateProjectRail(){
  if(!projectSection)return;
  targetProgress=Math.max(0,Math.min(1,(scrollY-railStart)/railTravel));
  if(!rafId)rafId=requestAnimationFrame(renderProjectRail);
}
function drawProjectRail(){
  projectRail.style.transform=`translate3d(${-railDistance*currentProgress}px,0,0)`;
  if(railProgress)railProgress.style.width=`${currentProgress*100}%`;
}
function renderProjectRail(){
  const drag=targetProgress-currentProgress;
  currentProgress+=drag*.14;
  if(Math.abs(drag)>.0004){drawProjectRail();rafId=requestAnimationFrame(renderProjectRail)}
  else{currentProgress=targetProgress;drawProjectRail();rafId=null}
}
addEventListener('scroll',updateProjectRail,{passive:true});
addEventListener('resize',measureProjectRail);
addEventListener('load',measureProjectRail);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measureProjectRail);
measureProjectRail();
