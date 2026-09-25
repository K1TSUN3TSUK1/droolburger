window.createGlassPlayer=function(canvas){

const ctx=canvas.getContext('2d');
const original=new Image(),plate=new Image();original.src='assets/glass-original.jpg';plate.src='assets/glass-clean.png';

const W=1080,H=1350,impact=1.15,cycle=12;
let seed=827;function random(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
const shards=Array.from({length:78},(_,i)=>{
 const a=random()*Math.PI*2,s=i<11?48+random()*63:i<34?19+random()*32:3+random()*15;
 const count=i%4===0?3:4+Math.floor(random()*2),phase=random()*6.28;
 const points=Array.from({length:count},(_,j)=>{const q=j/count*Math.PI*2+(random()-.5)*.38,r=s*(.48+random()*.45);return [Math.cos(q)*r,Math.sin(q)*r*(.55+random()*.45)]});
 const x=290+random()*435,y=420+random()*530;
 return {s,r:random()*6.28,spin:(random()-.5)*.47,x,y,dx:Math.cos(a)*(90+random()*275),dy:Math.sin(a)*(70+random()*185),z:random(),phase,tilt:random()*2.2-1.1,tumble:(random()-.5)*.65,thickness:1.5+random()*2,points};
}).sort((a,b)=>a.z-b.z);
const scene=document.createElement('canvas');scene.width=W;scene.height=H;const sceneCtx=scene.getContext('2d');
const cracks=Array.from({length:15},(_,i)=>{const a=i/15*Math.PI*2;return Array.from({length:6},(_,j)=>[365+Math.cos(a+(random()-.5)*.25)*j*90,650+Math.sin(a+(random()-.5)*.25)*j*100])});
function poly(points){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath()}
function pane(){poly([[237,397],[775,344],[775,1045],[240,991]])}
function axe(t){let angle=0,x=0,y=0;if(t<impact){const p=Math.max(0,Math.min(1,(t-.25)/.9));const e=p*p*p;angle=-.36*(1-e);x=-125*(1-e);y=-85*(1-e)}else{const p=Math.min(1,(t-impact)/1.2);angle=.20*p;x=-470*p*p;y=140*p}
ctx.save();ctx.translate(x,y);ctx.translate(-20,980);ctx.rotate(angle);ctx.translate(20,-980);poly([[0,416],[55,430],[108,458],[163,498],[226,547],[278,601],[327,632],[377,652],[373,706],[351,747],[316,785],[276,838],[251,839],[218,781],[183,727],[145,678],[0,907],[0,744],[70,611],[29,595],[45,565],[74,540],[0,480]]);ctx.clip();ctx.drawImage(original,0,0,W,H);ctx.restore()}
function glass(s,t){
 const u=Math.max(0,t-impact-.08);if(!u)return;
 const burst=1-Math.exp(-u*4.1),drift=Math.max(0,u-.65);
 const x=s.x+s.dx*burst+Math.sin(drift*.24+s.phase)*drift*1.5;
 const y=s.y+s.dy*burst+drift*3.5+drift*drift*.4;
 const rx=s.tilt+u*s.tumble,ry=s.phase+u*s.spin,rz=s.r+u*s.spin*.46;
 const cos=Math.cos,sin=Math.sin,depth=.68+s.z*.7;
 function project(p,z=0){let [a,b]=p;let c=b*sin(rx)+z*cos(rx);b=b*cos(rx)-z*sin(rx);let d=a*cos(ry)+c*sin(ry);c=-a*sin(ry)+c*cos(ry);a=d;const perspective=650/(650-c);return [x+(a*cos(rz)-b*sin(rz))*depth*perspective,y+(a*sin(rz)+b*cos(rz))*depth*perspective]}
 const front=s.points.map(p=>project(p)),back=s.points.map(p=>project(p,-s.thickness));
 const facing=Math.abs(cos(rx)*cos(ry)),fresnel=.045+.6*Math.pow(1-facing,4);
 ctx.save();if(s.z>.93)ctx.filter='blur(.6px)';
 // The bevel is a real projected side face, with a green-blue absorption tint.
 front.forEach((p,i)=>{const j=(i+1)%front.length;poly([p,front[j],back[j],back[i]]);ctx.fillStyle='rgba(24,91,112,'+(.36+fresnel*.6)+')';ctx.fill()});
 ctx.save();poly(front);ctx.clip();
 // Offset and magnify the scene through the tilted pane: restrained refraction.
 const shiftX=sin(ry)*(3+s.thickness*1.8),shiftY=sin(rx)*5,mag=1.012+(1-facing)*.038;
 ctx.translate(x+shiftX,y+shiftY);ctx.scale(mag,mag);ctx.drawImage(scene,-x,-y);ctx.restore();
 poly(front);const tint=ctx.createLinearGradient(x-s.s,y-s.s,x+s.s,y+s.s);
 tint.addColorStop(0,'rgba(199,236,248,'+(.04+fresnel*.4)+')');tint.addColorStop(.48,'rgba(88,163,180,.025)');tint.addColorStop(1,'rgba(15,75,97,'+(.035+fresnel*.17)+')');ctx.fillStyle=tint;ctx.fill();
 // A reflected studio strip crosses a shard only at the matching orientation.
 const glint=Math.pow(Math.max(0,cos(ry*.9+rx*.7-.6)),18);
 if(glint>.025){ctx.save();poly(front);ctx.clip();ctx.translate(x,y);ctx.rotate(-.38+sin(ry)*.22);const strip=ctx.createLinearGradient(0,-s.s,0,s.s);strip.addColorStop(0,'rgba(225,246,255,0)');strip.addColorStop(.36,'rgba(225,246,255,0)');strip.addColorStop(.47,'rgba(245,252,255,'+(glint*.52)+')');strip.addColorStop(.52,'rgba(255,255,255,'+(glint*.74)+')');strip.addColorStop(.59,'rgba(225,246,255,0)');strip.addColorStop(1,'rgba(225,246,255,0)');ctx.fillStyle=strip;ctx.fillRect(-s.s*2,-s.s*2,s.s*4,s.s*4);ctx.restore()}
 // Each fractured edge catches light differently; no uniform wireframe outline.
 front.forEach((p,i)=>{const q=front[(i+1)%front.length],dx=q[0]-p[0],dy=q[1]-p[1],len=Math.hypot(dx,dy)||1;const light=Math.max(0,(dx*.55-dy*.84)/len);ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.lineWidth=.45+light*1.15;ctx.strokeStyle=light>.30?'rgba(231,251,255,'+(.13+light*.67)+')':'rgba(14,60,77,.42)';ctx.stroke();if(light>.88&&s.s>30){ctx.beginPath();ctx.moveTo(p[0]+dx*.15,p[1]+dy*.15);ctx.lineTo(p[0]+dx*.38,p[1]+dy*.38);ctx.lineWidth=1.5;ctx.strokeStyle='rgba(255,255,255,.88)';ctx.stroke()}});
 ctx.restore();
}
function render(t){ctx.clearRect(0,0,W,H);ctx.save();const hit=t-impact;if(hit>=0&&hit<.3){ctx.translate(Math.sin(hit*110)*9*(1-hit/.3),Math.cos(hit*91)*5*(1-hit/.3))}ctx.drawImage(plate,0,0,W,H);
// A subtle intact glass surface disappears after impact.
ctx.save();pane();ctx.clip();ctx.fillStyle=`rgba(178,229,255,${t<impact?.075:Math.max(0,.075-(t-impact)*.25)})`;ctx.fillRect(230,340,550,710);
if(hit>=0&&hit<1.1){ctx.globalAlpha=Math.min(1,hit*20)*Math.max(0,1-(hit-.18)/.8);ctx.strokeStyle='#c8f3ff';ctx.lineWidth=1.8;cracks.forEach(line=>{ctx.beginPath();line.slice(0,Math.max(2,Math.ceil(hit*55))).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()})}ctx.restore();axe(t);sceneCtx.clearRect(0,0,W,H);sceneCtx.drawImage(canvas,0,0);shards.forEach(s=>glass(s,t));if(hit>=0&&hit<.13){ctx.fillStyle=`rgba(222,249,255,${.22*(1-hit/.13)})`;ctx.fillRect(0,0,W,H)}ctx.restore();
// Fade back to the start only at the end of each cycle.
if(t>11.3){ctx.globalAlpha=(t-11.3)/.7;ctx.drawImage(plate,0,0,W,H);axe(0);ctx.globalAlpha=1}}

let frameId=0,elapsed=0,last=0,active=false,loaded=false;
const ready=Promise.all([original.decode(),plate.decode()]).then(()=>{loaded=true;render(0)}).catch(()=>{canvas.style.visibility='hidden'});
function frame(now){
 if(!active||!loaded)return;
 if(last)elapsed+=Math.min((now-last)/1000,.06);
 last=now;render(Math.min(elapsed,10.8));
 if(elapsed<10.8)frameId=requestAnimationFrame(frame);
 else{active=false;frameId=0;canvas.dataset.motion='complete'}
}
return {
 ready,
 start(){active=true;elapsed=0;last=0;cancelAnimationFrame(frameId);ready.then(()=>{if(active&&loaded){render(0);frameId=requestAnimationFrame(frame)}})},
 stop(){active=false;cancelAnimationFrame(frameId);frameId=0;elapsed=0;last=0;if(loaded)render(0)},
 still(){active=false;cancelAnimationFrame(frameId);if(loaded)render(4)},
 get time(){return elapsed}
};
};