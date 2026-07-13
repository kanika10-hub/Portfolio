const projectSection=document.querySelector('.projects-scroll');
const projectRail=document.querySelector('.project-rail');
const projectWindow=document.querySelector('.project-window');
const railProgress=document.querySelector('.rail-progress span');
function updateProjectRail(){
  const start=projectSection.offsetTop;
  const travel=projectSection.offsetHeight-innerHeight;
  const progress=Math.max(0,Math.min(1,(scrollY-start)/Math.max(1,travel)));
  const distance=Math.max(0,projectRail.scrollWidth-projectWindow.clientWidth);
  projectRail.style.transform=`translate3d(${-distance*progress}px,0,0)`;
  railProgress.style.width=`${progress*100}%`;
}
addEventListener('scroll',updateProjectRail,{passive:true});
addEventListener('resize',updateProjectRail);updateProjectRail();
