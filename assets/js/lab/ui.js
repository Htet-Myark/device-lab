'use strict';
/* Device Lab | MIT License | Educational use only. See DISCLAIMER.md */
/* =================== UI =================== */
function renderTray(){
  const p=curPart();
  const list=Object.values(ITEMS).filter(it=>it.part===p&&!it.used&&!it.locked);
  const held=S.tool==='screwdriver';
  const tools=`<div class="traysec">Tools</div><div class="titem tool${held?' active':''}" id="toolSd"><div class="ic">${icon(ITEMS.screwdriver)}</div><div class="nm">${ITEMS.screwdriver.name}<small>${held?'✓ in hand · tap to put down':'tap to pick up'}</small></div></div><div class="traysec">Parts</div>`;
  $('#tray').innerHTML=tools+(list.length?list.map(it=>`<div class="titem" data-id="${it.id}"><div class="ic">${icon(it)}</div><div class="nm">${it.name}${it.rot?'<small>↻ click to '+(it.rotLabel||'flip')+'</small>':''}</div></div>`).join('')
    :`<div class="empty">Nothing to drag for this step. Follow the instruction on the right.</div>`);
  $$('#tray .titem[data-id]').forEach(n=>n.addEventListener('pointerdown',e=>startDrag(e,n.dataset.id,'tray')));
  $('#toolSd').addEventListener('click',()=>toggleDriver());
}
function render(){
  const st=cur(), p=curPart();
  $('#hPart').textContent=`${p}/${PARTS.length}`;
  $('#hStep').textContent=`${Math.min(S.i+1,STEPS.length)}/${STEPS.length}`;
  $('#hMis').textContent=S.mistakes; $('#hScore').textContent=score();
  const g=$('#hGround'); g.textContent=S.grounded?'⚡ Grounded':'⚡ Not grounded'; g.classList.toggle('grounded',S.grounded);
  $('#parts').innerHTML=PARTS.map((t,k)=>{const n=k+1,tot=STEPS.filter(s=>s.p===n).length,dn=STEPS.filter((s,j)=>s.p===n&&j<S.i).length;
    return `<li class="${n<p||S.done?'done':n===p?'cur':''}"><span class="n">${n<p||S.done?'✓':n}</span><span>${t}<br><small style="color:var(--muted)">${dn}/${tot} steps</small></span></li>`}).join('');
  $('#prog').style.width=(S.i/STEPS.length*100)+'%';
  if(st){
    const stepNo=STEPS.filter((s,j)=>s.p===st.p&&j<=S.i).length, tot=STEPS.filter(s=>s.p===st.p).length;
    let h=`<div class="card"><div class="k">Part ${st.p} · Step ${stepNo} of ${tot}</div><h3>${val(st.title)}</h3><p>${val(st.text)}</p>`;
    if(st.type==='screws'||(st.type==='click'&&st.targets.length>1)) h+=`<p style="color:var(--muted);font-size:12px">${st.clicked.size} / ${st.targets.length} done</p>`;
    if(needsDriver(st)) h+=`<p style="font-size:12.5px;color:${S.tool==='screwdriver'?'#66bb6a':'#ffca28'}">${S.tool==='screwdriver'?'🪛 Screwdriver in hand':'🪛 Needs the screwdriver. Tap it in the Tools tray first.'}</p>`;
    if(st.fig) h+=`<div class="fig">${LAB.figs[st.fig]}</div>`;
    if(st.type==='button') h+=`<button class="primary" id="stepBtn">${st.label}</button>`;
    if(st.note) h+=`<div class="note">⚠ Note: ${st.note}</div>`;
    $('#stepCard').innerHTML=h+'</div>';
    const b=$('#stepBtn'); if(b) b.onclick=()=>{const err=st.check&&st.check();if(err) return mistake(err);complete()};
  }
  renderTray(); applyHints();
}
$('#bHint').onclick=()=>{if(S.done||S.mode!=='challenge')return;S.hints++;toast('💡 Hint used (−25 points)','',1800);hintUntil=performance.now()+3500;render();setTimeout(()=>applyHints(),3600)};
$('#bView').onclick=()=>goView(cur()?(cur().view||PART_VIEW[cur().p]):'front');
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.tool)toggleDriver(false);if(e.key==='h'||e.key==='H')$('#bHint').click();if(e.key==='v'||e.key==='V')$('#bView').click()});
$('#bRestart').onclick=()=>location.reload();
$('#bMute').onclick=()=>{S.muted=!S.muted;$('#bMute').textContent=S.muted?'🔇':'🔊'};
let toastT=null;
function toast(msg,kind='',ms=2200){const t=$('#toast');t.textContent=msg;t.className='toast show '+kind;clearTimeout(toastT);toastT=setTimeout(()=>t.className='toast '+kind,ms)}
function banner(k,t){$('#bnK').textContent=k;$('#bnT').textContent=t;const b=$('#banner');b.classList.add('show');setTimeout(()=>b.classList.remove('show'),1600)}
const score=()=>Math.max(0,1000-40*S.mistakes-25*S.hints);
const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
const elapsed=()=>Math.floor((Date.now()-S.t0)/1000);
let AC=null;
function sfx(k){
  if(S.muted) return;
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const notes={ok:[[660,0],[990,.08]],bad:[[160,0],[120,.12]],tick:[[1400,0]]}[k];
    notes.forEach(([f,d])=>{const o=AC.createOscillator(),g=AC.createGain();o.type=k==='bad'?'sawtooth':'sine';o.frequency.value=f;
      g.gain.setValueAtTime(k==='tick'?.04:.08,AC.currentTime+d);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d+(k==='tick'?.05:.18));
      o.connect(g).connect(AC.destination);o.start(AC.currentTime+d);o.stop(AC.currentTime+d+.2)});
  }catch(e){}
}
function finish(){
  S.done=true; clearInterval(S.timer); render(); applyHints();
  const lines=POST_LINES();
  setTimeout(()=>{
    $('#endO').classList.remove('hidden');
    const post=$('#post'); post.textContent=''; let k=0;
    const tick=()=>{if(k<lines.length){post.textContent+=lines[k++]+'\n';sfx('tick');setTimeout(tick,180)}else showResults()};
    setTimeout(tick,300);
  },2200);
}
function showResults(){
  sfx('ok');
  const sc=score(), t=elapsed();
  const rank=sc>=950?'🏅 Master Technician':sc>=820?'🎖 Certified Technician':sc>=650?'🔧 Apprentice Technician':'🧯 Needs Supervision';
  $('#rank').textContent=rank; $('#rScore').textContent=sc; $('#rMis').textContent=S.mistakes; $('#rHint').textContent=S.mode==='practice'?'—':S.hints; $('#rTime').textContent=fmt(t);
  let msg=`Mode: ${S.mode}.`;
  if(S.mode==='challenge'){const b=JSON.parse(localStorage.getItem(LAB.bestKey)||'null');
    if(!b||sc>b.score||(sc===b.score&&t<b.time)){localStorage.setItem(LAB.bestKey,JSON.stringify({score:sc,time:t}));msg+=' 🎉 New best score!'}
    else msg+=` Best: ${b.score} in ${fmt(b.time)}.`}
  $('#rBest').textContent=msg; $('#res').style.display='block';
}

/* =================== LOOP =================== */
const clock=new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);
  const now=performance.now(), dt=clock.getDelta();
  const fin=[];for(const t of TW.slice()){const k=Math.min(1,(now-t.t0)/t.dur);t.fn(ease(k));if(k>=1)fin.push(t)}fin.forEach(t=>{const i=TW.indexOf(t);if(i>=0)TW.splice(i,1);t.done&&t.done()});
  const pulse=.5+.5*Math.sin(now/180);
  CLICK.forEach(o=>{const on=hintSet.has(o);o.traverse(m=>{if(m.isMesh&&m.material&&m.material.emissive&&!m.userData.hit){m.material.emissive.setRGB(on?.08*pulse:0,on?.45*pulse:0,on?.7*pulse:0)}});
    if(o.userData.screw){o.userData.screw.halo.material.opacity=.45+.45*pulse}});
  ZONES.forEach(z=>{if(z.mesh.material.opacity>0&&z!==overZone)z.mesh.material.opacity=.12+.12*pulse});
  const fl=now<FLASH.until;CABLES.forEach(c=>{if(c.material&&c.material.emissive)c.material.emissive.setRGB(0,fl?.25*pulse:0,0)});
  LAB.tick&&LAB.tick(dt,now);
  updateTech(Math.min(dt,.05),now);
  controls.update(); renderer.render(scene,camera);
}

/* =================== START =================== */
function start(mode){
  S.mode=mode;
  LAB.start&&LAB.start();
  $('#bHint').style.display=mode==='practice'?'none':'';
  $('#startO').classList.add('hidden');
  S.t0=Date.now(); S.timer=setInterval(()=>$('#hTime').textContent=fmt(elapsed()),1000);
  enterStep(); render(); banner('Part 1',PARTS[0]);
}
$$('.mode').forEach(b=>b.onclick=()=>start(b.dataset.mode));
(()=>{const b=JSON.parse(localStorage.getItem(LAB.bestKey)||'null');if(b)$('#bestTxt').textContent=`Challenge best: ${b.score} pts in ${fmt(b.time)}`})();
