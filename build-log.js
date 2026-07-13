const buildLogSection=document.querySelector('.build-log-scroll');
const buildLogRail=document.querySelector('.build-log-rail');
const buildLogWindow=document.querySelector('.build-log-window');
const buildLogProgress=document.querySelector('.log-scroll-line span');
let buildTarget=0,buildCurrent=0,buildTicking=false;
function readBuildLog(){const start=buildLogSection.offsetTop,travel=buildLogSection.offsetHeight-innerHeight;buildTarget=Math.max(0,Math.min(1,(scrollY-start)/Math.max(1,travel)));if(!buildTicking){buildTicking=true;requestAnimationFrame(renderBuildLog)}}
function renderBuildLog(){buildCurrent+=(buildTarget-buildCurrent)*.13;const distance=Math.max(0,buildLogRail.scrollHeight-buildLogWindow.clientHeight);buildLogRail.style.transform=`translate3d(0,${-distance*buildCurrent}px,0)`;buildLogProgress.style.height=`${buildCurrent*100}%`;if(Math.abs(buildTarget-buildCurrent)>.0005){requestAnimationFrame(renderBuildLog)}else{buildCurrent=buildTarget;buildTicking=false}}
addEventListener('scroll',readBuildLog,{passive:true});addEventListener('resize',readBuildLog);readBuildLog();
document.querySelectorAll('.project-detail-link').forEach(link=>link.addEventListener('click',event=>event.preventDefault()));
