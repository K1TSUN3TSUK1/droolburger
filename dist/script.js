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
if(statement){let animation;const strip=statement.firstElementChild;track(statement,()=>{animation=strip.animate([{transform:'translateX(0)'},{transform:'translateX(-180px)'}],{duration:4500,easing:'cubic-bezier(.2,.65,.3,1)',fill:'both'});animation.finished.then(()=>{statement.dataset.motion='complete'}).catch(()=>{})},()=>animation?.cancel())}

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
