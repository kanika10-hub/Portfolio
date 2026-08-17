const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');
const calmCursor=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAGNET='a:not(.tile),button',MAGNET_MAX_W=460,MAGNET_MAX_H=180;
let mx=innerWidth/2,my=innerHeight/2,sx=mx,sy=my,rx=mx,ry=my,cursorSeen=false,stuck=null;
function stick(el,box){stuck=el;ring.style.setProperty('--cw',(box.width+20)+'px');ring.style.setProperty('--ch',(box.height+16)+'px');ring.style.setProperty('--crad','2px');document.body.dataset.cursor='stuck'}
function release(){if(!stuck)return;stuck=null;ring.style.removeProperty('--cw');ring.style.removeProperty('--ch');ring.style.removeProperty('--crad');document.body.dataset.cursor=''}
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;if(!cursorSeen){cursorSeen=true;sx=rx=mx;sy=ry=my;document.body.classList.add('cursor-on')}},{passive:true});
addEventListener('pointerover',e=>{const t=e.target instanceof Element?e.target.closest(MAGNET):null;if(t===stuck)return;const box=t&&t.getBoundingClientRect();if(box&&box.width<=MAGNET_MAX_W&&box.height<=MAGNET_MAX_H)stick(t,box);else release()},{passive:true});
function cursorLoop(){let tx=mx,ty=my;if(stuck){const b=stuck.getBoundingClientRect();tx=b.left+b.width/2;ty=b.top+b.height/2}const starEase=calmCursor?1:.5,ringEase=calmCursor?1:.19;sx+=(mx-sx)*starEase;sy+=(my-sy)*starEase;rx+=(tx-rx)*ringEase;ry+=(ty-ry)*ringEase;dot.style.transform=`translate3d(${sx}px,${sy}px,0)`;ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;requestAnimationFrame(cursorLoop)}
requestAnimationFrame(cursorLoop);
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.15});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('.resume-link').forEach(el=>el.addEventListener('click',()=>document.querySelector('.resume-modal').classList.add('open')));
document.querySelector('.close-modal').addEventListener('click',()=>document.querySelector('.resume-modal').classList.remove('open'));
document.querySelector('.resume-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove('open')});
function closeProjectModal(m){m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
document.querySelectorAll('[data-modal]').forEach(btn=>btn.addEventListener('click',()=>{const m=document.getElementById(btn.dataset.modal);if(!m)return;m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.classList.add('modal-open')}));
document.querySelectorAll('.project-modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m||e.target.closest('.project-modal-close'))closeProjectModal(m)}));
addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.project-modal.open').forEach(closeProjectModal)});
document.querySelectorAll('.copy-contact').forEach(button=>button.addEventListener('click',async()=>{
  const value=button.dataset.copy;
  try{
    if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(value);
    else{const field=document.createElement('textarea');field.value=value;field.style.position='fixed';field.style.opacity='0';document.body.appendChild(field);field.select();document.execCommand('copy');field.remove()}
    button.textContent='Copied';
    setTimeout(()=>button.textContent='Copy',1600);
  }catch{button.textContent='Try again';setTimeout(()=>button.textContent='Copy',1600)}
}));
/* Contact form. With CONTACT_ENDPOINT empty the form hands off to the visitor's mail app.
   Paste a form-service POST URL (Formspree, Web3Forms, Getform) below to deliver straight to the inbox. */
const CONTACT_ENDPOINT='';
const CONTACT_EMAIL='kanika.rathore.tech@gmail.com';
const contactForm=document.getElementById('contact-form');
if(contactForm)contactForm.addEventListener('submit',async e=>{
  e.preventDefault();
  const status=contactForm.querySelector('.contact-status'),data=new FormData(contactForm);
  const missing=[...contactForm.querySelectorAll('[required]')].filter(f=>!f.value.trim()||(f.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)));
  contactForm.querySelectorAll('[required]').forEach(f=>f.classList.remove('invalid'));
  if(missing.length){missing.forEach(f=>f.classList.add('invalid'));status.textContent='Please complete the highlighted fields.';missing[0].focus();return}
  const name=data.get('name').trim(),company=data.get('company').trim();
  if(!CONTACT_ENDPOINT){
    const body=`From: ${name}${company?` (${company})`:''}\nEmail: ${data.get('email').trim()}\n\n${data.get('message').trim()}`;
    status.textContent='Opening your mail app…';
    location.href=`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Portfolio enquiry — ${name}`)}&body=${encodeURIComponent(body)}`;
    return;
  }
  status.textContent='Sending…';
  try{
    const res=await fetch(CONTACT_ENDPOINT,{method:'POST',headers:{Accept:'application/json'},body:data});
    if(res.ok){contactForm.reset();status.textContent='Sent — thank you. I’ll reply soon.'}
    else status.textContent=`Something went wrong. Please email ${CONTACT_EMAIL} directly.`;
  }catch{status.textContent=`Something went wrong. Please email ${CONTACT_EMAIL} directly.`}
});
const canvas=document.querySelector('#particles'),ctx=canvas.getContext('2d');
const glitter={particleCount:289,colors:['#90bef5','#1176f0','#90bef5'],speed:2,density:74,starSize:16,focalDepth:6,brightness:.61,intensity:2};
let stars=[],glitterSize={w:0,h:0,dpr:1},last=performance.now(),elapsed=0;
function makeStar(initial=true){const a=Math.random()*Math.PI*2,r=(.2+Math.random()*.8)*(glitter.density/15);return{x:Math.cos(a)*r,y:Math.sin(a)*r,z:initial?Math.random():1,px:NaN,py:NaN,v:.6+Math.random()*.8,color:Math.floor(Math.random()*3),next:elapsed+1+Math.random()*2,flash:0}}
function reset(s){Object.assign(s,makeStar(false))}
function resizeGlitter(){const dpr=Math.min(devicePixelRatio||1,1.5),w=innerWidth,h=innerHeight;if(w===glitterSize.w&&h===glitterSize.h&&dpr===glitterSize.dpr)return;glitterSize={w,h,dpr};canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h)}
function glitterLoop(t){const dt=Math.min(.1,Math.max(.001,(t-last)/1000))*60;last=t;elapsed+=dt/60;const{w,h}=glitterSize,cx=w/2,cy=h/2,scale=Math.min(w,h)*.9,focal=glitter.focalDepth/100;ctx.globalCompositeOperation='destination-out';ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='lighter';for(const s of stars){s.z-=glitter.speed*.0008*s.v*dt;if(s.z<=focal){reset(s);continue}const p=focal/Math.max(s.z,.0001),sx=cx+s.x*p*scale,sy=cy+s.y*p*scale;if(sx<-25||sx>w+25||sy<-25||sy>h+25){reset(s);continue}if(elapsed>s.next&&elapsed>s.flash){s.flash=elapsed+.05+Math.random()*.06;s.next=elapsed+1+Math.random()*3}const flashing=elapsed<s.flash,near=1-s.z,r=Math.min((glitter.starSize*.15)*(.4+Math.min(2.5,p*.6))*(flashing?1.5:1),1+glitter.starSize*.375);const alpha=Math.min(1,(near*.9+.06)*glitter.brightness*(flashing?1:.82));ctx.strokeStyle=glitter.colors[s.color];ctx.fillStyle=glitter.colors[s.color];if(!Number.isNaN(s.px)){ctx.globalAlpha=alpha*.35;ctx.lineWidth=Math.max(.35,r*.35);ctx.beginPath();ctx.moveTo(s.px,s.py);ctx.lineTo(sx,sy);ctx.stroke()}ctx.globalAlpha=alpha;ctx.fillRect(sx-r,sy-r,r*2,r*2);if(flashing){ctx.globalAlpha=alpha*.45;ctx.fillRect(sx-r*1.9,sy-r*.18,r*3.8,r*.36);ctx.fillRect(sx-r*.18,sy-r*1.9,r*.36,r*3.8)}s.px=sx;s.py=sy}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';glitterRaf=requestAnimationFrame(glitterLoop)}
let glitterRaf=null;
stars=Array.from({length:glitter.particleCount},()=>makeStar());resizeGlitter();addEventListener('resize',resizeGlitter);glitterRaf=requestAnimationFrame(glitterLoop);
/* Stop burning frames on a starfield nobody is looking at. */
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){cancelAnimationFrame(glitterRaf);glitterRaf=null}
  else if(!glitterRaf){last=performance.now();glitterRaf=requestAnimationFrame(glitterLoop)}
});
/* The Spline scene is a filtered, blended WebGL canvas — skip painting it once the hero is gone. */
const heroSection=document.querySelector('.hero'),heroSpline=document.querySelector('.hero-spline');
if(heroSection&&heroSpline&&'IntersectionObserver'in window){
  new IntersectionObserver(([e])=>{heroSpline.style.visibility=e.isIntersecting?'visible':'hidden'},{threshold:0}).observe(heroSection);
}
