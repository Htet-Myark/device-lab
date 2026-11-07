'use strict';
/* Device Lab | MIT License | Educational use only. See DISCLAIMER.md */
/* ---------------- drag & drop ---------------- */
let D=null;
function startDrag(e,id,src){
  e.preventDefault();
  D={id,src,x0:e.clientX,y0:e.clientY,moved:false,ghost:null,over:null};
  window.addEventListener('pointermove',onMove);
  window.addEventListener('pointerup',onUp,{once:true});
  window.addEventListener('pointercancel',onCancel,{once:true});
}
/* touch: the browser took the gesture over (e.g. tray scroll), so drop nothing and clean up */
function onCancel(){
  window.removeEventListener('pointermove',onMove); window.removeEventListener('pointerup',onUp);
  const d=D; D=null; svg.classList.remove('dragging'); if(!d) return;
  d.over&&d.over.classList.remove('over'); d.ghost&&d.ghost.remove();
}
function zoneAt(x,y){for(const e of document.elementsFromPoint(x,y)){if(e.dataset&&e.dataset.zone)return e}return null}
function onMove(e){
  if(!D) return;
  if(!D.moved){
    if(Math.hypot(e.clientX-D.x0,e.clientY-D.y0)<6) return;
    D.moved=true; const it=ITEMS[D.id];
    D.ghost=document.createElement('div'); D.ghost.className='ghost';
    D.ghost.innerHTML=icon(it)+`<span>${it.name}</span>`; document.body.appendChild(D.ghost);
    svg.classList.add('dragging'); sfx('tick');
  }
  D.ghost.style.left=e.clientX+'px'; D.ghost.style.top=e.clientY+'px';
  const z=zoneAt(e.clientX,e.clientY);
  if(z!==D.over){D.over&&D.over.classList.remove('over');D.over=z;z&&z.classList.add('over')}
}
function onUp(e){
  window.removeEventListener('pointermove',onMove); window.removeEventListener('pointercancel',onCancel);
  const d=D; D=null; svg.classList.remove('dragging'); if(!d) return;
  d.over&&d.over.classList.remove('over');
  if(d.moved){
    d.ghost.remove();
    if(d.src==='svg'){S.suppress=true;setTimeout(()=>S.suppress=false,50)}
    svg.classList.add('dragging'); const z=zoneAt(e.clientX,e.clientY); svg.classList.remove('dragging');
    handleDrop(d.id,z);
  }else if(d.src==='tray'){
    const it=ITEMS[d.id];
    if(it.rot){it.o=(it.o+1)%it.rot;sfx('tick');renderTray();applyHints()}
    else info(`Drag the ${it.name.toLowerCase()} onto the bench.`);
  }
}
svg.addEventListener('pointerdown',e=>{
  if(S.done) return;
  const d=e.target.closest('[data-drag]');
  if(d&&cur()&&cur().item===d.dataset.drag) startDrag(e,d.dataset.drag,'svg');
});
svg.addEventListener('click',e=>{
  if(S.suppress||S.done) return;
  const t=e.target.closest('[data-click]'); if(!t) return;
  handleClick(t.dataset.click,t);
});

/* ---------------- UI ---------------- */
function renderTray(){
  const p=curPart();
  const list=Object.values(ITEMS).filter(it=>it.part===p&&!it.used&&!it.locked);
  $('#tray').innerHTML=list.length?list.map(it=>`<div class="titem" data-id="${it.id}"><div class="ic">${icon(it)}</div><div class="nm">${it.name}${it.rot?'<small>↻ click to '+(it.id==='cpu'?'rotate':'flip')+'</small>':''}</div></div>`).join('')
    :`<div class="empty">Nothing to drag for this step. Follow the instruction on the right${cur()&&cur().p===2&&cur().item==='mbAsm'?' and drag the motherboard itself':''}.</div>`;
  $$('#tray .titem').forEach(n=>n.addEventListener('pointerdown',e=>startDrag(e,n.dataset.id,'tray')));
}
const FIGS={
  cpu:`<svg viewBox="0 0 260 80" width="100%"><rect x="10" y="8" width="64" height="64" rx="3" fill="#2e333b" stroke="#8b939e"/><rect x="18" y="16" width="48" height="48" fill="url(#pins)"/><path d="M12 70h12L12 58z" fill="#e6b83c"/><text x="84" y="34" fill="#dce6f2" font-size="12">Socket: Pin 1 ◣</text><text x="84" y="52" fill="#8a9bb0" font-size="11">gold triangle bottom-left.</text><text x="84" y="68" fill="#8a9bb0" font-size="11">Match the CPU's triangle to it.</text></svg>`,
  ram:`<svg viewBox="0 0 260 70" width="100%"><rect x="10" y="10" width="160" height="22" fill="#1f6b3a"/><rect x="10" y="28" width="160" height="5" fill="#d4af37"/><rect x="58" y="28" width="7" height="6" fill="#0b1118"/><rect x="10" y="42" width="160" height="12" fill="#2a5ab0"/><rect x="59" y="38" width="5" height="6" fill="#ffca28"/><text x="180" y="26" fill="#dce6f2" font-size="11">notch</text><text x="180" y="52" fill="#ffca28" font-size="11">slot key</text><text x="10" y="68" fill="#8a9bb0" font-size="10.5">Key sits left of centre: the notch must too.</text></svg>`,
};
function render(){
  const st=cur(), p=curPart();
  $('#hPart').textContent=`${p}/7`;
  $('#hStep').textContent=`${Math.min(S.i+1,STEPS.length)}/${STEPS.length}`;
  $('#hMis').textContent=S.mistakes;
  $('#hScore').textContent=score();
  const g=$('#hGround'); g.textContent=S.grounded?'⚡ Grounded':'⚡ Not grounded'; g.classList.toggle('grounded',S.grounded);
  $('#parts').innerHTML=PARTS.map((t,k)=>{const n=k+1,tot=STEPS.filter(s=>s.p===n).length,dn=STEPS.filter((s,j)=>s.p===n&&j<S.i).length;
    return `<li class="${n<p||S.done?'done':n===p?'cur':''}"><span class="n">${n<p||S.done?'✓':n}</span><span>${t}<br><small style="color:var(--muted)">${dn}/${tot} steps</small></span></li>`}).join('');
  $('#prog').style.width=(S.i/STEPS.length*100)+'%';
  if(st){
    const stepNo=STEPS.filter((s,j)=>s.p===st.p&&j<=S.i).length, tot=STEPS.filter(s=>s.p===st.p).length;
    let h=`<div class="card"><div class="k">Part ${st.p} · Step ${stepNo} of ${tot}</div><h3>${val(st.title)}</h3><p>${val(st.text)}</p>`;
    if(st.type==='screws'||(st.type==='click'&&st.targets.length>1)) h+=`<p style="color:var(--muted);font-size:12px">${st.clicked.size} / ${st.targets.length} done</p>`;
    if(st.fig) h+=`<div class="fig">${FIGS[st.fig]}</div>`;
    if(st.type==='button') h+=`<button class="primary" id="stepBtn">${st.label}</button>`;
    if(st.note) h+=`<div class="note">⚠ Note: ${st.note}</div>`;
    $('#stepCard').innerHTML=h+'</div>';
    const b=$('#stepBtn'); if(b) b.onclick=()=>{const err=st.check&&st.check();if(err) return mistake(err);complete()};
  }
  renderTray(); applyHints();
}
function hintTargets(){
  const st=cur(); if(!st) return [];
  let els=[];
  if(st.type==='drag'){
    els=$$('[data-zone]').filter(z=>st.zones.includes(z.dataset.zone)&&!z.dataset.full);
    const ti=$(`.titem[data-id="${st.item}"]`); ti&&els.push(ti);
  }else if(st.type==='click'||st.type==='screws'){
    els=st.targets.filter(t=>!st.clicked.has(t)).map(t=>$(`[data-click="${t}"]`)).filter(Boolean);
  }else if(st.type==='button'){const b=$('#stepBtn');b&&els.push(b)}
  if(st.hintEls) els.push(...st.hintEls().filter(Boolean));
  if(st.hintExtra) els.push(...st.hintExtra());
  return els;
}
let hintTimer=null;
function applyHints(force){
  $$('.hint').forEach(e=>e.classList.remove('hint'));$$('.hintel').forEach(e=>e.classList.remove('hintel'));
  if(S.mode!=='practice'&&!force) return;
  hintTargets().forEach(e=>e.classList.add(e.dataset&&(e.dataset.zone||e.dataset.click)||e.classList.contains('titem')?'hint':'hintel'));
}
$('#bHint').onclick=()=>{
  if(S.done||S.mode!=='challenge') return;
  S.hints++; toast('💡 Hint used (−25 points)','',1800); render();
  applyHints(true); clearTimeout(hintTimer); hintTimer=setTimeout(()=>applyHints(),3500);
};
document.addEventListener('keydown',e=>{if(e.key==='h'||e.key==='H')$('#bHint').click()});
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

/* ---------------- finish ---------------- */
function finish(){
  S.done=true; clearInterval(S.timer); render(); applyHints();
  const dual=S.ram.length===2&&S.ram[0]%2===S.ram[1]%2;
  const lines=[
    'BenchBIOS v2.6  (C) Bench Build Labs','',
    'CPU .................................. OK',
    `Memory: 2 x 8 GB ..................... OK  ${dual?'[dual channel]':'[single channel: tip, use matching-colour slots]'}`,
    'CPU_FAN .............................. 1480 RPM',
    `SATA${S.sata.hdd}: Hard disk drive ................ OK`,
    `SATA${S.sata.odd}: Optical drive .................. OK`,
    'PCIe x16: Video adapter .............. OK',
    'PCIe x1 : Ethernet adapter ........... Link up',
    'PCIe x1 : Wireless adapter ........... OK (antenna attached)',
    'Front panel: PWR RST PLED HDD SPK USB AUDIO ... OK',
    `PSU input: ${S.region.v} V ................... OK`,'',
    'POST complete. *beep*','Lab complete. Have your instructor verify your work. ✓'];
  $('#endO').classList.remove('hidden');
  const post=$('#post'); post.textContent=''; let k=0;
  const tick=()=>{if(k<lines.length){post.textContent+=lines[k++]+'\n';sfx('tick');setTimeout(tick,180)}else showResults()};
  setTimeout(tick,400);
}
function showResults(){
  sfx('ok');
  const sc=score(), t=elapsed();
  const rank=sc>=950?'🏅 Master Technician':sc>=820?'🎖 Certified Technician':sc>=650?'🔧 Apprentice Technician':'🧯 Needs Supervision';
  $('#rank').textContent=rank; $('#rScore').textContent=sc; $('#rMis').textContent=S.mistakes; $('#rHint').textContent=S.mode==='practice'?'—':S.hints; $('#rTime').textContent=fmt(t);
  let msg=`Mode: ${S.mode}.`;
  if(S.mode==='challenge'){const b=JSON.parse(localStorage.getItem('benchbuild-best')||'null');
    if(!b||sc>b.score||(sc===b.score&&t<b.time)){localStorage.setItem('benchbuild-best',JSON.stringify({score:sc,time:t}));msg+=' 🎉 New best score!'}
    else msg+=` Best: ${b.score} in ${fmt(b.time)}.`}
  $('#rBest').textContent=msg; $('#res').style.display='block';
}

/* ---------------- start ---------------- */
function start(mode){
  S.mode=mode; S.region=REGIONS[Math.floor(Math.random()*REGIONS.length)];
  S.volt=Math.random()<.5?'115':'230'; if(S.volt===S.region.v&&Math.random()<.7) S.volt=S.volt==='115'?'230':'115';
  ITEMS.cpu.o=1+Math.floor(Math.random()*3); ITEMS.ram1.o=1; ITEMS.ram2.o=Math.round(Math.random());
  ITEMS.cpled.o=Math.round(Math.random()); ITEMS.chdd.o=Math.round(Math.random());
  buildScene(); $('#voltTxt').textContent=S.volt+'V';
  $('#bHint').style.display=mode==='practice'?'none':'';
  $('#startO').classList.add('hidden');
  S.t0=Date.now(); S.timer=setInterval(()=>$('#hTime').textContent=fmt(elapsed()),1000);
  enterStep(); render(); banner('Part 1',PARTS[0]);
}
$$('.mode').forEach(b=>b.onclick=()=>start(b.dataset.mode));
(()=>{const b=JSON.parse(localStorage.getItem('benchbuild-best')||'null');if(b)$('#bestTxt').textContent=`Challenge best: ${b.score} pts in ${fmt(b.time)}`})();
buildScene();
