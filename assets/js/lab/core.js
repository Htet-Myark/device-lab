'use strict';
/* Device Lab | MIT License | Educational use only. See DISCLAIMER.md */
/* Shared lab engine: step flow, drag & drop, clicks and hints.
   Each lab defines VIEWS, S, PARTS, PART_VIEW, PART_START, STEPS and a LAB object of hooks before this file loads:
   LAB.esd (items that need grounding), LAB.orderMsg(id,step) (special out-of-order message), LAB.bestKey, LAB.figs, LAB.tick(dt), LAB.start(). */
let curView='overview';
function goView(name,dur=900){
  if(!VIEWS[name]) return; curView=name;
  const [p,t]=VIEWS[name](); const p0=camera.position.clone(),t0=controls.target.clone();
  tween(dur,k=>{camera.position.lerpVectors(p0,p,k);controls.target.lerpVectors(t0,t,k)},null,'cam');
}

const val=v=>typeof v==='function'?v():v;
const cur=()=>STEPS[S.i];
const curPart=()=>cur()?cur().p:PARTS.length;
function unlock(id){ITEMS[id].locked=false}
const FLASH={until:0};

/* =================== STEP ENTRY =================== */
function enterStep(){
  const st=cur(); if(!st) return;
  st.clicked=new Set();
  if(st.tgt) st.targets=st.tgt();
  if(st.type==='screws'){
    st.targets=[];st.objs=[];
    val(st.pts).forEach((p,k)=>{const id=`scr${S.i}_${k}`;st.targets.push(id);{const o=makeScrew(p[0],p[1],p[2]||st.kind||'screw',id);if(LAB.screwScale)o.scale.setScalar(LAB.screwScale);st.objs.push(o)}});
  }
  st.onStart&&st.onStart();
  goView(st.view||PART_VIEW[st.p]);
}

/* =================== FLOW =================== */
function complete(z,it){
  const st=cur();
  if(z&&z.world) reachTo(z.world());
  st.done&&st.done(z,it);
  st.onEnd&&st.onEnd();
  if(st.item&&ITEMS[st.item]) ITEMS[st.item].used=true;
  (st.alsoUse||[]).forEach(i=>ITEMS[i].used=true);
  sfx('ok'); toast('✓ '+val(st.title),'good');
  const prevPart=st.p; S.i++;
  if(!cur()) return finish();
  if(cur().p!==prevPart){PART_START[cur().p]&&PART_START[cur().p]();banner(`Part ${cur().p}`,PARTS[cur().p-1])}
  enterStep(); render();
}
function mistake(msg){S.mistakes++;sfx('bad');toast('✗ '+msg,'bad',4200);render()}
function info(msg){sfx('tick');toast(msg,'',2600)}
function handleDrop(id,z){
  if(!z) return; flushTweens();
  const zn=z.dataset.zone, st=cur(), it=ITEMS[id];
  if((LAB.esd||[]).includes(id)&&!S.grounded) return mistake(LAB.esdMsg||'⚡ ESD risk! Put on the antistatic wrist strap before handling static-sensitive parts.');
  if(st.type==='drag'&&st.wrongItems&&st.wrongItems[id]&&st.zones.includes(zn)) return mistake(st.wrongItems[id]);
  if(st.type==='drag'&&st.item===id){
    if(st.zones.includes(zn)){const r=st.check&&st.check(z);if(r){if(r.soft)return info(r.msg);return mistake(r)}return complete(z,it)}
    const w=st.wrong&&st.wrong[zn];
    return w?mistake(w):info(`That's not where the ${it.name.toLowerCase()} goes.`);
  }
  const fut=STEPS.find((s,k)=>k>S.i&&s.item===id);
  if(fut&&fut.zones.includes(zn)){
    const om=LAB.orderMsg&&LAB.orderMsg(id,st); if(om) return mistake(om);
    return mistake(`Out of order! The lab procedure says to do this first: “${val(st.title)}”.`);
  }
  info(`That's not where the ${it.name.toLowerCase()} goes.`);
}
function handleClick(id,o){
  flushTweens(); const st=cur();
  if(id==='tool-sd') return toggleDriver();
  if(needsDriver(st)&&st.targets.includes(id)&&!st.clicked.has(id)&&S.tool!=='screwdriver'){sfx('bad');return toast('🪛 You need the screwdriver for this. Tap it in the Tools tray (or on the desk) first.','bad',3000)}
  if(st&&(st.type==='click'||st.type==='screws')&&st.targets.includes(id)){
    if(st.clicked.has(id)) return;
    if(st.order&&id!==st.targets[st.clicked.size]) return mistake(`Wrong order! Tighten screw ${st.clicked.size+1} next. Tightening the screws out of order tilts the plate, so it presses unevenly on the die and can crack it.`);
    st.clicked.add(id);
    if(st.type==='screws'){tightenScrew(o);sfx('tick')}
    if(st.type!=='screws'&&!st.needsDriver) reachTo(new THREE.Box3().setFromObject(o).getCenter(V3(0,0,0)));
    st.onEach&&st.onEach(id,o);
    if(st.clicked.size===st.targets.length) return setTimeout(()=>complete(),st.type==='screws'?380:0);
    if(st.onEach) sfx('tick');
    render(); return;
  }
  if(id.startsWith('scr')) return;
  info(`Not now. Current step: “${val(st.title)}”.`);
}

/* =================== POINTER: drag, drop, click =================== */
const ray=new THREE.Raycaster(), ndc=new THREE.Vector2();
function setRay(cx,cy){const r=renderer.domElement.getBoundingClientRect();if(cx<r.left||cx>r.right||cy<r.top||cy>r.bottom)return false;ndc.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);ray.setFromCamera(ndc,camera);return true}
function zoneAt(cx,cy){if(!setRay(cx,cy))return null;const list=ZONES.filter(z=>isShown(z.mesh)).map(z=>z.mesh);const h=ray.intersectObjects(list,false);return h.length?h[0].object.userData.zone:null}
function clickAt(cx,cy){if(!setRay(cx,cy))return null;const h=ray.intersectObjects(CLICK.filter(o=>isShown(o)),true);for(const x of h){let o=x.object;while(o&&!o.userData.click)o=o.parent;if(o)return o}return null}
let D=null, overZone=null;
function startDrag(e,id,src){
  e.preventDefault();
  D={id,src,x0:e.clientX,y0:e.clientY,moved:false,ghost:null};
  window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp,{once:true});window.addEventListener('pointercancel',onCancel,{once:true});
}
function onCancel(){window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onUp);const d=D;D=null;controls.enabled=true;if(d&&d.ghost)d.ghost.remove();setOver(null)}
function setOver(z){if(overZone===z)return;overZone=z;applyHints()}
function onMove(e){
  if(!D) return;
  if(!D.moved){if(Math.hypot(e.clientX-D.x0,e.clientY-D.y0)<6)return;D.moved=true;const it=ITEMS[D.id];
    D.ghost=document.createElement('div');D.ghost.className='ghost';D.ghost.innerHTML=icon(it)+`<span>${it.name}</span>`;document.body.appendChild(D.ghost);sfx('tick')}
  D.ghost.style.left=e.clientX+'px';D.ghost.style.top=e.clientY+'px';
  setOver(zoneAt(e.clientX,e.clientY));
}
function onUp(e){
  window.removeEventListener('pointermove',onMove);window.removeEventListener('pointercancel',onCancel);const d=D;D=null;controls.enabled=true;if(!d)return;setOver(null);
  if(d.moved){d.ghost.remove();handleDrop(d.id,zoneAt(e.clientX,e.clientY))}
  else if(d.src==='tray'){const it=ITEMS[d.id];if(it.rot){it.o=(it.o+1)%it.rot;sfx('tick');renderTray();applyHints()}else info(`Drag the ${it.name.toLowerCase()} onto the 3D bench.`)}
}
let down=null;
const active=new Set(); let multi=false;
renderer.domElement.addEventListener('pointerdown',e=>{active.add(e.pointerId);if(active.size>1){multi=true;return}if(S.done)return;down={x:e.clientX,y:e.clientY}},{capture:true});
renderer.domElement.addEventListener('pointercancel',e=>{active.delete(e.pointerId);if(!active.size){multi=false;down=null}});
renderer.domElement.addEventListener('pointerup',e=>{
  active.delete(e.pointerId); if(multi){if(!active.size){multi=false;down=null}return}
  if(!down||S.done) return; const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y); down=null;
  if(moved>(e.pointerType==='touch'?12:5)||D) return;
  const o=clickAt(e.clientX,e.clientY); if(o) handleClick(o.userData.click,o);
});
renderer.domElement.addEventListener('pointermove',e=>{if(D||down)return;const o=clickAt(e.clientX,e.clientY);renderer.domElement.style.cursor=o?'pointer':(S.tool?'crosshair':'')});

/* =================== HINTS =================== */
let hintSet=new Set(), hintUntil=0;
function hintTargets(){
  const st=cur();if(!st)return{zones:[],objs:[],tray:null};
  const r={zones:[],objs:[],tray:null};
  if(st.type==='drag'){r.zones=ZONES.filter(z=>st.zones.includes(z.dataset.zone)&&!z.dataset.full&&isShown(z.mesh));r.tray=st.item}
  else if(needsDriver(st)&&S.tool!=='screwdriver'){r.objs=[OBJ.sdDesk];r.tool=true}
  else if(st.type==='click'||st.type==='screws'){r.objs=st.targets.filter(t=>!st.clicked.has(t)).map(t=>OBJ[t]).filter(Boolean);if(st.order)r.objs=r.objs.slice(0,1)}
  if(st.hintEls) r.objs.push(...st.hintEls().filter(Boolean));
  return r;
}
function applyHints(force){
  $$('.hint').forEach(e=>e.classList.remove('hint'));
  ZONES.forEach(z=>z.mesh.material.opacity=0);hintSet=new Set();
  const on=S.mode==='practice'||force||performance.now()<hintUntil;
  if(on){const h=hintTargets();h.zones.forEach(z=>{z.mesh.material.color.set(0x4fc3f7);z.mesh.material.opacity=.2});h.objs.forEach(o=>hintSet.add(o));
    if(h.tray){const ti=$(`.titem[data-id="${h.tray}"]`);ti&&ti.classList.add('hint')}
    if(h.tool){const ti=$('.titem.tool');ti&&ti.classList.add('hint')}
    const b=$('#stepBtn');if(b&&cur()&&cur().type==='button')b.classList.add('hint')}
  if(overZone){overZone.mesh.material.color.set(0x66bb6a);overZone.mesh.material.opacity=.38}
}

