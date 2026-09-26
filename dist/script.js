const header=document.querySelector('.site-header');
const toggle=document.querySelector('.nav-toggle');
function closeMenu(){header.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false')}
toggle.addEventListener('click',()=>{const open=!header.classList.contains('menu-open');header.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open))});
document.querySelectorAll('#navigation a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const motionItems=new Map();
function activate(item){
  if(item.active||document.hidden||reducedMotion.matches)return;
  item.active=true;item.element.dataset.motion='playing';item.start();
}
function deactivate(item){
  if(!item.active)return;
  item.active=false;item.stop();item.element.dataset.motion='idle';
}
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    const item=motionItems.get(entry.target);
    if(!entry.isIntersecting)deactivate(item);
    else if(entry.intersectionRatio>=.28)activate(item);
  });
},{threshold:[0,.28],rootMargin:'0px 0px -3% 0px'});
function track(element,start,stop){
  const item={element,start,stop,active:false};motionItems.set(element,item);observer.observe(element);
}

document.querySelectorAll('.motion-reveal').forEach(element=>{
  let animation;
  track(element,()=>{
    const base=getComputedStyle(element).transform;
    animation=element.animate([{opacity:.15,transform:'translateY(28px) '+(base==='none'?'':base)},{opacity:1,transform:base}],{duration:950,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
    animation.finished.then(()=>{element.dataset.motion='complete'}).catch(()=>{});
  },()=>{animation?.cancel()});
});

const video=document.querySelector('#drool-film');
if(video){
  let run=0;
  track(video,()=>{
    const token=++run;video.currentTime=0;video.muted=true;
    video.play().then(()=>{if(token!==run||document.hidden)video.pause()}).catch(()=>{video.dataset.motion='poster'});
  },()=>{run++;video.pause();video.currentTime=0});
  video.addEventListener('ended',()=>{video.dataset.motion='complete'});
}

const glass=document.querySelector('#glass-canvas');
if(glass&&window.createGlassPlayer){
  const player=window.createGlassPlayer(glass);
  track(glass,()=>player.start(),()=>player.stop());
  player.ready.then(()=>{if(reducedMotion.matches)player.still()});
}

const statement=document.querySelector('.statement');
// A curved opening mask unfolds into the full photograph or film.
function openingShape(bend){
 const points=[];
 for(let edge=0;edge<4;edge++)for(let j=0;j<16;j++){
  const t=j/16,wave=Math.sin(t*Math.PI);
  let x,y;
  if(edge===0){x=t*100+bend*(6-11*t);y=bend*(18-15*t+wave*10)}
  if(edge===1){x=100+bend*(-5-6*t-wave*10);y=t*100+bend*(3-12*t)}
  if(edge===2){x=(1-t)*100+bend*(-11+14*t);y=100+bend*(-9-9*t-wave*10)}
  if(edge===3){x=bend*(3+3*t+wave*14);y=(1-t)*100+bend*(-18+36*t)}
  points.push(`${x}% ${y}%`);
 }
 return `polygon(${points.join(',')})`;
}
document.querySelectorAll('.film video').forEach(media=>{
 // Video already has a playback observer; animate its containing figure instead.
 const target=media.tagName==='VIDEO'?media.closest('.film'):media;
 let opening;
 track(target,()=>{
  opening=media.animate([
   {clipPath:openingShape(1),transform:'perspective(1000px) rotateY(-13deg) rotateZ(-5deg) scale(.78)',filter:'saturate(.45) brightness(.65)',offset:0},
   {clipPath:openingShape(.45),transform:'perspective(1000px) rotateY(5deg) rotateZ(2deg) scale(.94)',filter:'saturate(.8) brightness(.9)',offset:.55},
   {clipPath:openingShape(0),transform:'perspective(1000px) rotateY(0deg) rotateZ(0deg) scale(1)',filter:'saturate(1) brightness(1)',offset:1}
  ],{duration:1600,easing:'cubic-bezier(.2,.65,.25,1)',fill:'both'});
 },()=>opening?.cancel());
});
if(statement){let animation;const strip=statement.firstElementChild;track(statement,()=>{animation=strip.animate([{transform:'translateX(0)'},{transform:'translateX(-50%)'}],{duration:11500,easing:'linear',iterations:Infinity})},()=>{animation?.cancel();strip.style.transform='translateX(0)'})}

function resetMotion(){
  observer.disconnect();
  motionItems.forEach(item=>{
    deactivate(item);
    if(!document.hidden&&!reducedMotion.matches)observer.observe(item.element);
  });
}
document.addEventListener('visibilitychange',resetMotion);
reducedMotion.addEventListener('change',resetMotion);
window.addEventListener('pagehide',resetMotion);
window.addEventListener('pageshow',resetMotion);
