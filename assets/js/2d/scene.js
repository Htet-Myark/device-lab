'use strict';
/* PC Lab Assembly | MIT License | Educational use only. See DISCLAIMER.md */
/* ---------------- SVG scene ---------------- */
function el(tag,attrs={},parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function show(id){const e=document.getElementById(id);e&&e.classList.remove('off')}
function hide(id){const e=document.getElementById(id);e&&e.classList.add('off')}
const mbPt=(x,y)=>[x+MBX,y+MBY];
const zone=(name,x,y,w,h,extra='')=>`<rect class="zone" data-zone="${name}" x="${x}" y="${y}" width="${w}" height="${h}" rx="4" ${extra}/>`;

function coilPath(x1,y1,x2,y2,loops=12,r=5){
  const L=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/L,uy=(y2-y1)/L,px=-uy,py=ux;let d='';
  const N=loops*14;
  for(let k=0;k<=N;k++){const t=k/N,a=t*loops*Math.PI*2,
    x=x1+(x2-x1)*t+px*r*Math.sin(a)+ux*r*.6*Math.cos(a),
    y=y1+(y2-y1)*t+py*r*Math.sin(a)+uy*r*.6*Math.cos(a);
    d+=(k?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}
  return d;
}
const DEFS=`<defs>
 <filter id="sh" x="-20%" y="-20%" width="150%" height="150%"><feDropShadow dx="2.5" dy="3.5" stdDeviation="3" flood-color="#000" flood-opacity=".6"/></filter>
 <filter id="sh2" x="-30%" y="-30%" width="170%" height="170%"><feDropShadow dx="1" dy="1.6" stdDeviation="1" flood-color="#000" flood-opacity=".65"/></filter>
 <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .45 -.05" result="a"/><feComposite in="a" in2="SourceGraphic" operator="in" result="g"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="g"/></feMerge></filter>
 <filter id="brush" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".003 .8" numOctaves="2" seed="9" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .22 -.04" result="a"/><feComposite in="a" in2="SourceGraphic" operator="in" result="g"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="g"/></feMerge></filter>
 <linearGradient id="gSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f6874"/><stop offset=".55" stop-color="#454c56"/><stop offset="1" stop-color="#30353d"/></linearGradient>
 <linearGradient id="gSteelH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8c949e"/><stop offset=".45" stop-color="#e3e7eb"/><stop offset=".7" stop-color="#a8b0b9"/><stop offset="1" stop-color="#78808a"/></linearGradient>
 <radialGradient id="gInt" cx=".35" cy=".22" r=".95"><stop offset="0" stop-color="#2b323c"/><stop offset=".6" stop-color="#171b21"/><stop offset="1" stop-color="#0b0d11"/></radialGradient>
 <linearGradient id="gPcb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f5f3f"/><stop offset=".5" stop-color="#174b31"/><stop offset="1" stop-color="#0f3824"/></linearGradient>
 <linearGradient id="gPcbB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c2f52"/><stop offset="1" stop-color="#101c33"/></linearGradient>
 <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7de8a"/><stop offset=".5" stop-color="#c9982c"/><stop offset="1" stop-color="#e9c55c"/></linearGradient>
 <linearGradient id="gBrass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d58a"/><stop offset=".5" stop-color="#b8892a"/><stop offset="1" stop-color="#8a6418"/></linearGradient>
 <linearGradient id="gAlu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset=".5" stop-color="#b0b8c1"/><stop offset="1" stop-color="#d6dbe1"/></linearGradient>
 <radialGradient id="gChrome" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#c3c9d0"/><stop offset="1" stop-color="#626973"/></radialGradient>
 <radialGradient id="gCap" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".55" stop-color="#9aa1aa"/><stop offset="1" stop-color="#555c65"/></radialGradient>
 <linearGradient id="gBlack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#363b43"/><stop offset="1" stop-color="#16191d"/></linearGradient>
 <linearGradient id="gShroud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a515b"/><stop offset=".35" stop-color="#2a2f36"/><stop offset="1" stop-color="#121418"/></linearGradient>
 <linearGradient id="gRam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b1e23"/><stop offset=".5" stop-color="#4b525c"/><stop offset="1" stop-color="#1b1e23"/></linearGradient>
 <linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bcd6f0" stop-opacity=".16"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".06"/><stop offset="1" stop-color="#bcd6f0" stop-opacity=".0"/></linearGradient>
 <radialGradient id="gBlade" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#3a3f47"/><stop offset="1" stop-color="#121418"/></radialGradient>
 <linearGradient id="gMat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46698f"/><stop offset="1" stop-color="#34557a"/></linearGradient>
 <pattern id="pins" width="3.4" height="3.4" patternUnits="userSpaceOnUse"><rect width="3.4" height="3.4" fill="#2a2d33"/><circle cx="1.7" cy="1.7" r=".75" fill="#e2b950"/></pattern>
 <pattern id="mesh" width="6" height="5.2" patternUnits="userSpaceOnUse"><rect width="6" height="5.2" fill="#1d2128"/><circle cx="1.5" cy="1.3" r="1.2" fill="#050608"/><circle cx="4.5" cy="3.9" r="1.2" fill="#050608"/></pattern>
 <pattern id="honey" width="7" height="12.12" patternUnits="userSpaceOnUse"><path d="M3.5 0L7 2v4L3.5 8 0 6V2z M3.5 8V12.12" fill="none" stroke="#5a616b" stroke-width=".9"/></pattern>
 <pattern id="finsV" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#c6cdd5"/><rect width="1.5" height="4" fill="#5f6873"/></pattern>
 <pattern id="finsH" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#c6cdd5"/><rect width="4" height="1.5" fill="#5f6873"/></pattern>
 <pattern id="matgrid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#88a9cc" stroke-opacity=".18" stroke-width=".8"/></pattern>
 <pattern id="braid" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="#1d2025"/><rect width="2.2" height="5" fill="#3a3f47"/></pattern>
 <pattern id="vents" width="12" height="6" patternUnits="userSpaceOnUse"><rect x="1" y="1.5" width="10" height="2.4" rx="1.2" fill="#0a0c0f"/></pattern>
</defs>`;

function buildScene(){
  const caps=(pts)=>pts.map(([x,y])=>`<g filter="url(#sh2)"><circle cx="${x}" cy="${y}" r="4.3" fill="url(#gCap)"/><path d="M${x-2.4} ${y}h4.8M${x} ${y-2.4}v4.8" stroke="#6b727b" stroke-width=".7"/></g>`).join('');
  const holes=(cols,rows,x0,y0,d,s)=>{let o='';for(let a=0;a<cols;a++)for(let b=0;b<rows;b++)o+=`<rect x="${x0+a*d}" y="${y0+b*d}" width="${s}" height="${s}" fill="#050505"/>`;return o};
  const gpins=(cols,rows,x0,y0,d)=>{let o='';for(let a=0;a<cols;a++)for(let b=0;b<rows;b++)o+=`<rect x="${x0+a*d}" y="${y0+b*d}" width="2.2" height="2.2" fill="url(#gGold)"/>`;return o};
  const header=(x,y,w,h,cols,rows,d,lab,lx=x)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="#0d0e10" stroke="#30343a" filter="url(#sh2)"/>${gpins(cols,rows,x+3,y+3,d)}<text x="${lx}" y="${y-3}" class="silk">${lab}</text>`;

  const covers=SLOTS.map((s,i)=>{const y=MBY+s.y-15;return `<g id="cover-${i}" data-click="cover-${i}" filter="url(#sh2)"><rect x="23" y="${y}" width="14" height="30" rx="1" fill="url(#gSteelH)" stroke="#6c747e"/><rect x="26" y="${y+4}" width="3" height="22" rx="1.5" fill="#20242a"/><rect x="31" y="${y+4}" width="3" height="22" rx="1.5" fill="#20242a"/></g>`}).join('');

  const caseArt=`<g id="case">
   <rect x="18" y="8" width="614" height="616" rx="10" fill="url(#gSteel)" filter="url(#brush)" stroke="#7a838f" stroke-width="1.5"/>
   <rect x="40" y="24" width="570" height="586" rx="4" fill="url(#gInt)"/>
   <rect x="52" y="140" width="362" height="432" rx="8" fill="none" stroke="#ffffff" stroke-opacity=".04" stroke-width="3"/>
   ${[180,290,400,500].map(y=>`<rect x="420" y="${y}" width="18" height="74" rx="9" fill="#050608" stroke="#24282e" stroke-width="3.5"/>`).join('')}
   <text x="50" y="602" class="lbl" fill="#5d6876">◀ REAR</text><text x="548" y="602" class="lbl" fill="#5d6876">FRONT ▶</text>
   <rect x="22" y="158" width="16" height="146" rx="1" fill="#040506" stroke="#2b3038"/>
   <rect x="44" y="30" width="184" height="108" rx="4" fill="none" stroke="#4a525d" stroke-dasharray="6 4"/>
   <text x="98" y="88" class="lbl" fill="#4a525d">PSU BAY</text>
   <rect x="44" y="139" width="186" height="4" fill="url(#gSteelH)" opacity=".7"/>
   <g filter="url(#sh2)"><rect x="466" y="28" width="144" height="110" fill="#1b1f25" stroke="#646d78"/>
     <rect x="466" y="28" width="144" height="4" fill="url(#gSteelH)" opacity=".6"/><rect x="466" y="81" width="144" height="4" fill="url(#gSteelH)" opacity=".6"/><rect x="466" y="134" width="144" height="4" fill="url(#gSteelH)" opacity=".6"/>
     ${[505,545,585].map(x=>`<circle cx="${x}" cy="56" r="2" fill="#050608"/><circle cx="${x}" cy="108" r="2" fill="#050608"/>`).join('')}</g>
   <text x="478" y="152" class="lbl" font-size="10" fill="#5d6876">5.25" BAYS</text>
   <g filter="url(#sh2)"><rect x="478" y="296" width="132" height="138" fill="#1b1f25" stroke="#646d78"/>
     ${[296,341,386,430].map(y=>`<rect x="478" y="${y}" width="132" height="4" fill="url(#gSteelH)" opacity=".6"/>`).join('')}</g>
   <text x="484" y="448" class="lbl" font-size="10" fill="#5d6876">3.5" BAYS</text>
   <rect x="610" y="24" width="20" height="586" fill="url(#gBlack)" filter="url(#grain)"/>
   <rect x="612" y="300" width="16" height="290" rx="2" fill="url(#mesh)"/>
   <rect x="611" y="86" width="18" height="48" rx="2" fill="url(#gBlack)" stroke="#3f454e"/>
   <g id="bayCover" data-click="bayCover"><rect x="611" y="31" width="18" height="48" rx="2" fill="url(#gBlack)" stroke="#555c66"/><rect x="613" y="52" width="14" height="2" fill="#4a5059"/></g>
   <rect x="613" y="235" width="14" height="8" rx="1" fill="#c3c9d0"/><rect x="615" y="237" width="10" height="3" fill="#1e63c9"/>
   <rect x="613" y="247" width="14" height="8" rx="1" fill="#c3c9d0"/><rect x="615" y="249" width="10" height="3" fill="#1e63c9"/>
   <circle cx="620" cy="266" r="3.4" fill="#0a0a0a" stroke="#7cb342" stroke-width="1.2"/><circle cx="620" cy="278" r="3.4" fill="#0a0a0a" stroke="#ec407a" stroke-width="1.2"/>
   <g id="pwrBtn" data-click="pwrBtn"><circle cx="620" cy="198" r="8.5" fill="url(#gChrome)"/><circle cx="620" cy="198" r="6.5" fill="#22262c"/><path d="M620 193.5v4.5M616.8 195.6a4.6 4.6 0 1 0 6.4 0" stroke="#a9b3bf" fill="none" stroke-width="1.2" stroke-linecap="round"/></g>
   <circle id="pwrLed" cx="620" cy="214" r="2.4" fill="#2a2a2a"/><circle id="hddLed" cx="620" cy="222" r="2.4" fill="#2a2a2a"/>
   ${covers}
   <g id="ioShield" class="off"><rect x="22" y="158" width="16" height="146" fill="url(#gSteelH)" filter="url(#brush)"/><g fill="#0a0b0d"><rect x="25" y="166" width="10" height="18" rx="1"/><rect x="25" y="190" width="10" height="24" rx="1"/><rect x="25" y="220" width="10" height="20" rx="1"/><rect x="25" y="246" width="10" height="16" rx="1"/><circle cx="30" cy="284" r="5"/></g></g>
   <g id="psu" class="off">
     <rect x="44" y="30" width="184" height="108" rx="3" fill="url(#gBlack)" filter="url(#sh)"/>
     <rect x="44" y="30" width="184" height="108" rx="3" fill="url(#gBlack)" filter="url(#grain)"/>
     <rect x="44" y="30" width="184" height="2" fill="#5b626c"/>
     <rect x="56" y="40" width="116" height="62" rx="2" fill="#eceff2"/>
     <text x="62" y="51" font-size="8" font-weight="700" fill="#111" font-family="Arial">ATX POWER SUPPLY</text>
     <text x="62" y="61" font-size="9.5" font-weight="800" fill="#111" font-family="Arial">500W</text><text x="96" y="61" font-size="5" fill="#333" font-family="Arial">80 PLUS BRONZE</text>
     <rect x="62" y="65" width="104" height="22" fill="none" stroke="#555" stroke-width=".5"/>
     <path d="M62 72h104M62 79h104M80 65v22M98 65v22M116 65v22M134 65v22M150 65v22" stroke="#555" stroke-width=".4"/>
     <text x="63" y="70.5" font-size="3.6" fill="#222" font-family="Arial">DC OUT  +3.3V   +5V    +12V   −12V   +5VSB</text>
     <text x="63" y="77.5" font-size="3.6" fill="#222" font-family="Arial">MAX     20A     20A    40A    0.3A   2.5A</text>
     <text x="62" y="96" font-size="4.2" fill="#333" font-family="Arial">AC INPUT 115/230V~  50-60Hz</text>
     <rect x="58" y="110" width="110" height="20" fill="url(#vents)"/>
     <rect x="150" y="132" width="56" height="10" rx="3" fill="#0b0c0e"/>
     <text x="182" y="94" font-size="5.5" fill="#aab3be" font-family="Arial" font-weight="700">115V/230V</text>
     <g id="volt" data-click="volt"><rect x="180" y="98" width="38" height="30" rx="3" fill="#1a1c20" stroke="#555"/><rect x="183" y="101" width="32" height="24" rx="2" fill="#c62828" stroke="#ef9a9a" stroke-width=".6"/><text id="voltTxt" x="199" y="117" text-anchor="middle" fill="#fff" font-size="11" font-weight="800" font-family="Arial">115V</text></g>
   </g>
   <g id="caseDyn"></g>
   ${zone('psuBay',42,28,190,114)}${zone('ioCut',16,150,30,162)}
   ${zone('bay525',468,30,142,50)}
   ${BAY35.map((y,i)=>zone('bay35',480,y,128,40,`data-i="${i}"`)).join('')}
   ${zone('mbCase',60,150,340,410)}
  </g>`;

  const mat=`<g id="mat">
   <text x="660" y="112" class="lbl">ANTISTATIC MAT</text>
   <rect x="645" y="122" width="348" height="498" rx="10" fill="url(#gMat)" filter="url(#sh)"/>
   <rect x="645" y="122" width="348" height="498" rx="10" fill="url(#gMat)" filter="url(#grain)"/>
   <rect x="653" y="130" width="332" height="482" rx="6" fill="url(#matgrid)" stroke="#5f84ab" stroke-opacity=".5"/>
   <rect x="648" y="172" width="340" height="410" rx="6" fill="none" stroke="#a9c6e6" stroke-opacity=".5" stroke-dasharray="8 6"/>
   <text x="818" y="380" text-anchor="middle" class="lbl" fill="#a9c6e6" opacity=".6">MOTHERBOARD GOES HERE</text>
   <g filter="url(#sh2)"><circle cx="968" cy="146" r="9" fill="url(#gChrome)"/><circle cx="968" cy="146" r="4" fill="#7b828b" stroke="#444"/></g><text x="950" y="168" class="t-p" font-size="7.5" fill="#cfe0f2">GND 1MΩ</text>
   <g id="strapOn" class="off">
     <path d="${coilPath(968,146,948,46,11,5)}" stroke="#1c1f24" stroke-width="2.2" fill="none"/>
     <path d="${coilPath(968,146,948,46,11,5)}" stroke="#9aa3ad" stroke-width=".7" fill="none" transform="translate(-.6 -.6)"/>
     <ellipse cx="948" cy="34" rx="20" ry="10" fill="none" stroke="#244f9e" stroke-width="7"/>
     <ellipse cx="948" cy="34" rx="20" ry="10" fill="none" stroke="#5a8bdc" stroke-width="7" stroke-dasharray="1.5 2" opacity=".6"/>
     <rect x="940" y="40" width="16" height="9" rx="2" fill="url(#gChrome)" stroke="#555"/>
     <text x="880" y="40" class="t-p" fill="#66bb6a">grounded ✓</text></g>
   ${zone('matSpot',648,172,340,410,'id="matSpot"')}
   ${zone('ground',948,126,40,40)}
  </g>`;

  const ramSlots=[0,1,2,3].map(i=>{const x=240+i*16,c=i%2?'#a3abb5':'#1e2126';return `<rect x="${x}" y="30" width="9" height="182" rx="1" fill="${c}" stroke="#0a0b0c" stroke-width=".8" filter="url(#sh2)"/><rect x="${x+3.5}" y="34" width="2" height="174" fill="#050505"/><path d="M${x+1} 150h7" stroke="#c9a227" stroke-width="2.2"/><rect x="${x-1.5}" y="22" width="12" height="9" rx="1.5" fill="#e8eaed" stroke="#9aa1aa"/><rect x="${x-1.5}" y="211" width="12" height="9" rx="1.5" fill="#e8eaed" stroke="#9aa1aa"/>`}).join('');
  const ramSticks=[0,1,2,3].map(i=>{const x=237+i*16;return `<g id="ram-${i}" class="off" filter="url(#sh2)"><rect x="${x}" y="24" width="15" height="194" rx="1.5" fill="url(#gRam)" stroke="#0b0c0e"/><rect x="${x+6.5}" y="30" width="2" height="182" fill="#c9ced5" opacity=".75"/><rect x="${x+2}" y="60" width="11" height="30" rx="1" fill="#b71c1c" opacity=".75"/><text x="${x+8}" y="140" font-size="5" fill="#9aa1aa" font-family="Arial" transform="rotate(90 ${x+8} 140)">DDR 8GB</text></g>`}).join('');
  const pcie=SLOTS.map((s,i)=>s.kind==='x16'
    ?`<g filter="url(#sh2)"><rect x="48" y="${s.y-5.5}" width="${s.x2-46}" height="11" rx="1" fill="url(#gSteelH)" stroke="#5f6772"/><rect x="51" y="${s.y-1.5}" width="${s.x2-52}" height="3" fill="#060606"/><rect x="${s.x2-4}" y="${s.y-6}" width="8" height="12" rx="1.5" fill="#1e2126" stroke="#555"/></g><text x="${s.x2+8}" y="${s.y+3}" class="silk">PCIE_X16_${i+1}</text>`
    :`<g filter="url(#sh2)"><rect x="50" y="${s.y-4}" width="${s.x2-50}" height="8.5" rx="1" fill="#16181b" stroke="#3d4249"/><rect x="53" y="${s.y-1}" width="${s.x2-56}" height="2.5" fill="#000"/></g><text x="${s.x2+6}" y="${s.y+3}" class="silk">PCIE_X1_${i+1}</text>`).join('');
  const traces=[...Array(7)].map((_,k)=>`<path d="M196 ${72+k*4}H${226+k*2}V${236+k*2}H${300}"/>`).join('')+[...Array(6)].map((_,k)=>`<path d="M${120+k*5} 136V${190-k*3}H${40}"/>`).join('')+[...Array(5)].map((_,k)=>`<path d="M${230+k*4} 300V${360+k*3}H${320}"/>`).join('');

  const mb=`<g id="mb" class="off" style="transform:translate(${MAT[0]}px,${MAT[1]}px)" data-drag="mbAsm">
   <rect width="340" height="410" rx="4" fill="url(#gPcb)" filter="url(#sh)"/>
   <rect width="340" height="410" rx="4" fill="url(#gPcb)" filter="url(#grain)"/>
   <g stroke="#3fa772" stroke-opacity=".22" fill="none" stroke-width=".9">${traces}</g>
   ${HOLES.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="url(#gCap)"/><circle cx="${x}" cy="${y}" r="3" fill="#07090b"/>`).join('')}
   <g filter="url(#sh2)"><path d="M2 12h36v140h-36z" fill="url(#gBlack)"/><path d="M6 20l28 20M6 50l28 20M6 80l28 20M6 110l28 20" stroke="#4a5059" stroke-width="1.2"/><text x="20" y="146" text-anchor="middle" font-size="5" fill="#8a929c" font-family="Arial" font-weight="700">I/O</text></g>
   <g>${[20,32,52,64].map(y=>`<rect x="0" y="${y}" width="5" height="8" fill="#1e63c9"/>`).join('')}<rect x="0" y="80" width="5" height="14" fill="#c3c9d0"/><circle cx="2" cy="110" r="3" fill="#81c784"/><circle cx="2" cy="122" r="3" fill="#f48fb1"/></g>
   <g filter="url(#sh2)"><rect x="46" y="50" width="18" height="96" rx="2" fill="url(#finsH)" stroke="#6b737c"/><rect x="112" y="24" width="86" height="15" rx="2" fill="url(#finsV)" stroke="#6b737c"/></g>
   ${caps([[82,60],[82,76],[82,92],[82,108],[82,124],[96,140]])}
   <rect x="58" y="8" width="34" height="18" rx="1.5" fill="#141518" stroke="#3a3e44" filter="url(#sh2)"/>${holes(4,2,61.5,11.5,7.8,5.5)}<text x="58" y="35" class="silk">ATX_12V</text>
   <g id="socketG" filter="url(#sh2)">
     <rect x="116" y="56" width="78" height="78" rx="2" fill="#16181b" stroke="#3a3f47"/>
     <rect x="124" y="64" width="62" height="62" fill="#26292e"/>
     <rect x="126" y="66" width="58" height="58" fill="url(#pins)"/>
     <path d="M118 132h12l-12-12z" fill="url(#gGold)"/>
     <path id="plate" d="M118 58h74v74h-74z M127 67v56h56v-56z" fill="url(#gSteelH)" fill-rule="evenodd" stroke="#59616c"/>
     <rect x="203" y="53" width="9" height="6" rx="1" fill="url(#gSteelH)" stroke="#59616c"/>
   </g>
   ${[[106,46],[204,46],[106,144],[204,144]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4.5" fill="url(#gCap)"/><circle cx="${x}" cy="${y}" r="2.6" fill="#050608"/>`).join('')}
   <g id="cpuChip" class="off" filter="url(#sh2)"><rect x="127" y="67" width="56" height="56" rx="2" fill="#1f6b46" stroke="#0e3220"/><path d="M134 72h42v4h4v38h-4v4h-42v-4h-4v-38h4z" fill="url(#gAlu)" stroke="#8b939d"/><text x="155" y="94" text-anchor="middle" font-size="6" fill="#6b737c" font-family="Arial" font-weight="700">CPU</text><text x="155" y="101" text-anchor="middle" font-size="3.6" fill="#7b838c" font-family="Consolas">3.40GHZ  LGA</text><path d="M128 122h8l-8-8z" fill="url(#gGold)"/></g>
   <g id="paste" class="off"><ellipse cx="155" cy="95" rx="8" ry="6.5" fill="#bfc4ca"/><ellipse cx="153" cy="93" rx="4" ry="2.6" fill="#eef0f2"/></g>
   <g id="lever" data-click="lever"><rect x="196" y="52" width="20" height="88" fill="transparent"/><line id="leverBar" x1="207" y1="134" x2="207" y2="58" stroke="url(#gSteelH)" stroke-width="4.5" stroke-linecap="round" filter="url(#sh2)"/></g>
   <g id="cooler" class="off">
     <g filter="url(#sh)"><rect x="100" y="40" width="110" height="110" rx="16" fill="#121417" stroke="#2c3036"/></g>
     <circle cx="155" cy="95" r="51" fill="url(#gAlu)"/>
     <g stroke="#6f7882" stroke-width="1">${[...Array(60)].map((_,k)=>{const a=k*6*Math.PI/180;return `<line x1="${(155+22*Math.cos(a)).toFixed(1)}" y1="${(95+22*Math.sin(a)).toFixed(1)}" x2="${(155+51*Math.cos(a)).toFixed(1)}" y2="${(95+51*Math.sin(a)).toFixed(1)}"/>`}).join('')}</g>
     <circle cx="155" cy="95" r="45" fill="#0c0d10" opacity=".9"/>
     <g fill="url(#gBlade)" stroke="#050505" stroke-width=".6">${[...Array(7)].map((_,k)=>`<path d="M155 95C158 80 168 66 186 62C188 74 180 88 166 96Z" transform="rotate(${k*360/7} 155 95)"/>`).join('')}</g>
     <circle cx="155" cy="95" r="15" fill="#15171a" stroke="#000"/><circle cx="155" cy="95" r="11" fill="url(#gAlu)"/><text x="155" y="97" text-anchor="middle" font-size="4.5" fill="#444" font-family="Arial" font-weight="700">COOLER</text>
     ${[[106,46],[204,46],[106,144],[204,144]].map(([x,y],i)=>`<circle class="ret" data-click="ret-${i}" cx="${x}" cy="${y}" r="7" fill="#f2f2f2" stroke="#111" stroke-width="2.5" filter="url(#sh2)"/>`).join('')}
   </g>
   <g id="fanWire" class="off"><path d="M196 62C214 52 210 36 225 28" stroke="#0e0f11" stroke-width="3" fill="none"/><path d="M196 62C214 52 210 36 225 28" stroke="#6b737c" stroke-width=".8" fill="none" stroke-dasharray="1.5 1.5"/></g>
   <rect x="215" y="22" width="20" height="9" rx="1" fill="#eeeeee" stroke="#9a9a9a" filter="url(#sh2)"/>${gpins(4,1,217.5,25.5,4.5)}<text x="212" y="18" class="silk">CPU_FAN</text>
   <rect x="8" y="168" width="20" height="9" rx="1" fill="#eeeeee" stroke="#9a9a9a" filter="url(#sh2)"/>${gpins(4,1,10.5,171.5,4.5)}<text x="6" y="164" class="silk">SYS_FAN</text>
   ${ramSlots}<text x="238" y="232" class="silk">DIMM A1 A2 B1 B2</text>
   <rect x="312" y="58" width="24" height="114" rx="2" fill="#141518" stroke="#3a3e44" filter="url(#sh2)"/>${holes(2,12,316,62,9.2,7)}<text x="300" y="186" class="silk">ATX_24P</text>
   <g filter="url(#sh)"><rect x="255" y="245" width="46" height="46" rx="4" fill="url(#gAlu)" stroke="#7c8693"/><rect x="255" y="245" width="46" height="46" rx="4" fill="url(#gAlu)" filter="url(#brush)"/><path d="M260 252h36M260 258h36M260 278h36M260 284h36" stroke="#8b949e" stroke-width="1.2"/><text x="278" y="271" text-anchor="middle" font-size="7" font-weight="700" fill="#7b848e" font-family="Arial">PCH</text></g>
   <g filter="url(#sh2)"><circle cx="160" cy="196" r="11" fill="url(#gChrome)"/><circle cx="160" cy="196" r="8.5" fill="none" stroke="#9aa1aa" stroke-width=".6"/><text x="160" y="198" text-anchor="middle" font-size="4.2" fill="#444" font-family="Arial">CR2032 +</text></g>
   <g filter="url(#sh2)"><rect x="110" y="271" width="100" height="14" rx="2" fill="url(#gAlu)"/><rect x="110" y="271" width="100" height="14" rx="2" fill="url(#gAlu)" filter="url(#brush)"/><text x="160" y="281" text-anchor="middle" font-size="6.5" fill="#6b737c" font-family="Arial" font-weight="700">M.2</text></g>
   ${[0,1].map(i=>`<g filter="url(#sh2)"><path d="M300 ${300+i*16}h32v12h-32z" fill="#0f1012" stroke="#3a3e44"/><path d="M304 ${303+i*16}h22v4h-4v3h-18z" fill="#000"/></g><text x="282" y="${309+i*16}" class="silk">SATA${i}</text>`).join('')}
   ${pcie}
   <rect x="236" y="345" width="18" height="16" rx="1" fill="#16181b"/><text x="238" y="370" class="silk" font-size="5">SIO</text>
   ${header(20,386,36,14,8,2,4.4,'F_AUDIO')}${header(160,386,36,14,8,2,4.4,'F_USB')}${header(214,388,24,10,4,1,5,'SPK',212)}${header(262,386,40,14,5,2,7.5,'F_PANEL')}
   <g id="ramSticks">${ramSticks}</g>
   <g id="cards"></g>
   ${zone('cpu',114,54,82,82)}${zone('cpufan',210,18,30,20)}${zone('sysfan',2,160,32,22)}
   ${[0,1,2,3].map(i=>zone('ram',236+i*16,24,16,194,`data-i="${i}"`)).join('')}
   ${zone('eps',54,4,42,26)}${zone('atx24',308,54,32,122)}
   ${[0,1].map(i=>zone('sata',296,297+i*16,40,15,`data-i="${i}"`)).join('')}
   ${SLOTS.map((s,i)=>zone('slot',44,s.y-10,s.x2-38,21,`data-i="${i}" data-kind="${s.kind}"`)).join('')}
  </g>`;

  const thumb=(i,y)=>`<g id="pscrew-${i}" data-click="pscrew-${i}" filter="url(#sh2)"><circle cx="30" cy="${y}" r="8" fill="url(#gChrome)"/><circle cx="30" cy="${y}" r="8" fill="none" stroke="#5a616b" stroke-width="1.6" stroke-dasharray="1.2 1.2"/><circle cx="30" cy="${y}" r="3.2" fill="#9aa1aa"/></g>`;
  const panel=`<g id="panel" data-click="panel">
     <rect x="40" y="16" width="570" height="600" rx="6" fill="#0a0d12" fill-opacity=".82" stroke="#1b1f25" stroke-width="7"/>
     <path d="M47 23H260L60 609H47Z" fill="url(#gGlass)"/><path d="M330 23H372L170 609H128Z" fill="#ffffff" fill-opacity=".035"/>
     <text x="325" y="590" text-anchor="middle" class="lbl" fill="#55606d">TEMPERED GLASS SIDE PANEL</text>
     ${thumb(0,548)}${thumb(1,596)}</g>
   <g id="panelGhost" class="off" data-click="panelGhost"><rect x="40" y="16" width="570" height="600" rx="6" fill="rgba(79,195,247,.06)" stroke="#4fc3f7" stroke-width="2" stroke-dasharray="10 6"/><text x="325" y="320" text-anchor="middle" class="lbl" fill="#4fc3f7">CLICK TO ATTACH SIDE PANEL</text></g>`;

  svg.innerHTML=DEFS+caseArt+mat+mb+`<g id="cables" filter="url(#sh2)"></g><g id="screws"></g>`+panel+`<g id="screwsTop"></g><g id="fpInset" class="off"></g><g id="rearInset" class="off"></g>`;
  buildFp();
}

/* front-panel zoom inset */
const FP={ 'fp-hdd':'HDD LED','fp-reset':'RESET SW','fp-pled':'POWER LED','fp-pwr':'POWER SW','fp-spk':'SPEAKER','fp-usb':'F_USB','fp-audio':'F_AUDIO'};
function buildFp(){
  const pin=(x,y,on=true)=>`<rect x="${x}" y="${y}" width="12" height="12" fill="#0b0c0e" stroke="#2a2d32"/>`+(on?`<rect x="${x+3.5}" y="${y+3.5}" width="5" height="5" fill="url(#gGold)" filter="url(#sh2)"/>`:`<circle cx="${x+6}" cy="${y+6}" r="1.4" fill="#2a2d32"/>`);
  let s=`<rect x="650" y="24" width="342" height="600" rx="12" fill="#0e131b" stroke="#2c3644"/>
  <rect x="660" y="80" width="322" height="500" rx="8" fill="url(#gPcb)"/><rect x="660" y="80" width="322" height="500" rx="8" fill="url(#gPcb)" filter="url(#grain)"/>
  <g stroke="#3fa772" stroke-opacity=".2" fill="none">${[...Array(8)].map((_,k)=>`<path d="M670 ${250+k*6}H960"/>`).join('')}</g>
  <text x="668" y="52" class="t-h">Zoomed in: motherboard headers</text>
  <text x="668" y="70" class="t-s">Front-panel leads come from the case front. Read the labels!</text>
  <text x="700" y="104" class="t-l">F_PANEL</text>
  <rect x="704" y="132" width="180" height="78" rx="2" fill="#0b0c0e" filter="url(#sh2)"/>
  <g fill="none" stroke-width="1.4"><rect x="702" y="122" width="56" height="44" rx="4" stroke="#7bd88f"/><rect x="782" y="122" width="56" height="44" rx="4" stroke="#7fb8ff"/><rect x="702" y="180" width="56" height="44" rx="4" stroke="#d29bff"/><rect x="782" y="180" width="56" height="44" rx="4" stroke="#ff8a80"/></g>
  <text x="730" y="133" class="t-p" text-anchor="middle">HDD_LED</text><text x="810" y="133" class="t-p" text-anchor="middle">RESET</text>
  ${pin(712,140)}${pin(736,140)}${pin(792,140)}${pin(816,140)}${pin(866,140,false)}
  ${pin(712,186)}${pin(736,186)}${pin(792,186)}${pin(816,186)}${pin(866,186)}
  <text x="718" y="163" class="t-p" text-anchor="middle" fill="#ffca28">+</text><text x="742" y="163" class="t-p" text-anchor="middle" fill="#ffca28">−</text>
  <text x="718" y="183" class="t-p" text-anchor="middle" fill="#ffca28">+</text><text x="742" y="183" class="t-p" text-anchor="middle" fill="#ffca28">−</text>
  <text x="730" y="220" class="t-p" text-anchor="middle">PLED</text><text x="810" y="220" class="t-p" text-anchor="middle">PWR_SW</text>
  <text x="872" y="133" class="t-p" text-anchor="middle">key</text><text x="872" y="220" class="t-p" text-anchor="middle">NC</text>
  <text x="700" y="270" class="t-l">SPEAKER</text><rect x="708" y="278" width="104" height="16" fill="#0b0c0e"/>${[0,1,2,3].map(k=>pin(710+k*26,280)).join('')}
  <text x="700" y="336" class="t-l">F_USB (USB 2.0)</text><rect x="708" y="344" width="130" height="40" fill="#0b0c0e"/>${[0,1,2,3,4].map(k=>pin(710+k*26,346)+pin(710+k*26,370,k!==4)).join('')}
  <text x="700" y="430" class="t-l">F_AUDIO (HD Audio)</text><rect x="708" y="438" width="130" height="40" fill="#0b0c0e"/>${[0,1,2,3,4].map(k=>pin(710+k*26,440)+pin(710+k*26,464,k!==3)).join('')}
  <rect x="664" y="514" width="314" height="62" rx="6" fill="#0e131b" opacity=".85"/>
  <text x="672" y="532" class="t-s">+ marks the positive pin. LED leads are polarised;</text>
  <text x="672" y="548" class="t-s">switches and speaker work either way round.</text>
  <text x="672" y="568" class="t-s">Click a lead in the tray to flip it.</text>
  <g id="fpConn"></g>
  ${zone('fp-hdd',700,118,60,50)}${zone('fp-reset',780,118,60,50)}${zone('fp-pled',700,176,60,50)}${zone('fp-pwr',780,176,60,50)}
  ${zone('fp-spk',700,272,118,30)}${zone('fp-usb',700,338,140,52)}${zone('fp-audio',700,432,140,52)}`;
  $('#fpInset').innerHTML=s;
}
function fpConnect(zoneName,it){
  const g=$('#fpConn');
  const box={'fp-hdd':[708,136,40,22],'fp-reset':[788,136,40,22],'fp-pled':[708,182,40,22],'fp-pwr':[788,182,40,22],'fp-spk':[706,276,104,22],'fp-usb':[706,342,130,46],'fp-audio':[706,436,130,46]}[zoneName];
  const col=it.fp?it.fp[1]:(it.hdr[0]==='USB'?'#1e63c9':'#d0d0d0');
  const wire=col==='#f4f4f4'?'#e0e0e0':col;
  const [x,y,w,h]=box, cy=y+h/2;
  g.insertAdjacentHTML('beforeend',`<g filter="url(#sh2)">
    <path d="M${x+w} ${cy-3}C${x+w+60} ${cy-3} 930 ${cy+7} 992 ${cy+7}" stroke="${wire}" stroke-width="2.4" fill="none"/>
    <path d="M${x+w} ${cy+3}C${x+w+60} ${cy+3} 930 ${cy+13} 992 ${cy+13}" stroke="${it.fp?'#f0f0f0':'#222'}" stroke-width="2.4" fill="none"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#gBlack)" stroke="#555"/>
    <text x="${x+w/2}" y="${cy+3}" text-anchor="middle" font-size="7.5" font-weight="700" fill="#f2f2f2" font-family="Arial">${it.fp?it.fp[0]:it.hdr[0]}</text></g>`);
  const k=$$('#cables .fpw').length;
  const tgt={'fp-usb':mbPt(178,393),'fp-audio':mbPt(38,393),'fp-spk':mbPt(226,393)}[zoneName]||mbPt(282,393);
  el('path',{class:'fpw',d:`M610 ${470+k*8}C540 ${480+k*8} ${tgt[0]+30} ${tgt[1]+20} ${tgt[0]} ${tgt[1]}`,stroke:wire,'stroke-width':2,fill:'none'},$('#cables'));
  el('rect',{x:tgt[0]-5,y:tgt[1]-4,width:10,height:8,rx:1,fill:'#111',stroke:'#555'},$('#cables'));
}

/* rear view inset */
function buildRear(){
  const g=$('#rearInset');
  const usb=(x,y)=>`<rect x="${x}" y="${y}" width="26" height="11" rx="1" fill="url(#gSteelH)" stroke="#5b636d"/><rect x="${x+2}" y="${y+2}" width="22" height="7" fill="#050505"/><rect x="${x+3}" y="${y+2.5}" width="20" height="3" fill="#1e63c9"/>`;
  const hdmi=(x,y)=>`<path d="M${x} ${y}h30v8l-4 4h-22l-4-4z" fill="url(#gSteelH)" stroke="#5b636d"/><path d="M${x+2} ${y+2}h26v5l-3 3h-20l-3-3z" fill="#050505"/>`;
  const rj=(x,y)=>`<rect x="${x}" y="${y}" width="20" height="18" rx="1" fill="url(#gSteelH)" stroke="#5b636d"/><path d="M${x+3} ${y+3}h14v10h-4v3h-6v-3h-4z" fill="#050505"/><rect x="${x+1.5}" y="${y+1.5}" width="3" height="2" fill="#7cfc6a"/><rect x="${x+15.5}" y="${y+1.5}" width="3" height="2" fill="#ffb300"/>`;
  let s=`<rect x="650" y="24" width="342" height="600" rx="12" fill="#0e131b" stroke="#2c3644"/>
  <text x="668" y="52" class="t-h">Rear view of the case</text>
  <rect x="700" y="66" width="200" height="548" rx="6" fill="url(#gSteel)" filter="url(#sh)"/>
  <rect x="700" y="66" width="200" height="548" rx="6" fill="url(#gSteel)" filter="url(#brush)"/>
  <rect x="790" y="196" width="100" height="168" fill="url(#vents)" opacity=".85"/>
  <g filter="url(#sh2)"><rect x="708" y="76" width="184" height="100" rx="3" fill="url(#gBlack)"/></g>
  <rect x="708" y="76" width="184" height="100" rx="3" fill="url(#gBlack)" filter="url(#grain)"/>
  <circle cx="846" cy="126" r="38" fill="#08090b"/><circle cx="846" cy="126" r="38" fill="url(#honey)"/><circle cx="846" cy="126" r="38" fill="none" stroke="#6b737d" stroke-width="2.5"/>
  ${[[714,82],[886,82],[714,170],[886,170]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="url(#gChrome)"/>`).join('')}
  <path d="M720 102h44v22l-8 8h-28l-8-8z" fill="#050505" stroke="#666"/><g fill="url(#gSteelH)"><rect x="729" y="110" width="4" height="12"/><rect x="740" y="106" width="4" height="10"/><rect x="751" y="110" width="4" height="12"/></g>
  <g id="r-switch" data-click="r-switch"><rect x="774" y="104" width="18" height="28" rx="2" fill="#0c0c0c" stroke="#666"/><rect x="776" y="106" width="14" height="24" rx="1.5" fill="#202226"/><text id="rSwTxt" x="783" y="122" text-anchor="middle" fill="#ddd" font-size="12" font-weight="700">O</text></g>
  <g filter="url(#sh2)"><rect x="708" y="188" width="76" height="176" rx="1" fill="url(#gSteelH)"/></g><rect x="708" y="188" width="76" height="176" rx="1" fill="url(#gSteelH)" filter="url(#brush)"/>
  <circle cx="726" cy="206" r="8.5" fill="#6a3c8f" stroke="#333"/><path d="M726 197.5a8.5 8.5 0 0 1 0 17z" fill="#2e7d32"/><g fill="#111">${[[723,203],[729,203],[722,208],[730,208],[726,210]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".9"/>`).join('')}</g>
  ${usb(716,226)}${usb(748,226)}${usb(716,246)}${usb(748,246)}
  ${hdmi(716,278)}${rj(754,274)}
  ${[['#64b5f6',724],['#81c784',744],['#f48fb1',764]].map(([c,x])=>`<circle cx="${x}" cy="320" r="6" fill="${c}"/><circle cx="${x}" cy="320" r="3" fill="#0a0a0a"/>`).join('')}`;
  let lab=`<text x="742" y="150" class="t-p" text-anchor="middle">AC IN</text><text x="783" y="150" class="t-p" text-anchor="middle">I/O</text>
   <text x="792" y="210" class="t-p">PS/2</text><text x="792" y="244" class="t-p">USB ×4</text><text x="792" y="280" class="t-p">HDMI · LAN</text><text x="792" y="292" class="t-p" fill="#8a9bb0">(onboard)</text><text x="792" y="324" class="t-p">Audio</text>
   <text x="708" y="392" class="t-p" fill="#cfd8e3">EXPANSION SLOTS</text>`;
  let z='';
  SLOTS.forEach((sl,i)=>{
    const y=402+i*44, card=S.slots[i];
    if(card){
      s+=`<g filter="url(#sh2)"><rect x="708" y="${y}" width="156" height="32" rx="1" fill="url(#gSteelH)" stroke="#6b737d"/></g><circle cx="856" cy="${y+16}" r="3" fill="url(#gChrome)"/>`;
      if(card==='nic'){s+=rj(724,y+7);lab+=`<text x="870" y="${y+20}" class="t-p">NIC</text>`;z+=zone('r-nic',718,y+3,34,26)}
      if(card==='wifi'){s+=[732,762].map(x=>`<circle cx="${x}" cy="${y+16}" r="7" fill="url(#gGold)" stroke="#7a5f15"/><circle cx="${x}" cy="${y+16}" r="2.5" fill="#3a2b08"/>`).join('');lab+=`<text x="870" y="${y+20}" class="t-p">Wi-Fi</text>`;z+=zone('r-wifi',720,y+3,56,26)}
      if(card==='gpu'){s+=hdmi(722,y+10)+`<path d="M762 ${y+10}h20v12h-16l-4-4z" fill="#050505" stroke="#5b636d"/><path d="M790 ${y+10}h20v12h-16l-4-4z" fill="#050505" stroke="#5b636d"/><rect x="822" y="${y+6}" width="26" height="20" fill="url(#vents)"/>`;lab+=`<text x="870" y="${y+14}" class="t-p">Video</text><text x="870" y="${y+25}" class="t-p">card</text>`;z+=zone('r-gpu-video',716,y+4,44,24)}
    }else if(S.covers[i]){s+=`<g filter="url(#sh2)"><rect x="708" y="${y}" width="156" height="32" rx="1" fill="url(#gSteelH)" stroke="#6b737d"/></g><rect x="716" y="${y+10}" width="132" height="12" fill="url(#vents)"/><circle cx="856" cy="${y+16}" r="3" fill="url(#gChrome)"/>`}
    else{s+=`<rect x="708" y="${y}" width="156" height="32" rx="1" fill="#030405" stroke="#444"/>`;lab+=`<text x="786" y="${y+20}" class="t-p" text-anchor="middle" fill="#ef9a9a">open slot (no cover)</text>`}
  });
  z+=zone('r-psu',716,96,52,40)+zone('r-ps2',716,196,20,20);
  [0,1,2,3].forEach(k=>z+=zone('r-usb',714+(k%2)*32,223+Math.floor(k/2)*20,30,17,`data-i="${k}"`));
  z+=zone('r-onboard-video',712,274,38,20)+zone('r-lan',750,270,28,26);
  g.innerHTML=s+`<g id="rearConn"></g>`+lab+z;
}
function rearPlug(z,it){
  const b=z.getBBox(), cx=b.x+b.width/2, cy=b.y+b.height/2;
  const g=$('#rearConn');
  if(it.id==='antenna'){
    g.insertAdjacentHTML('beforeend',[[-14,-28],[16,22]].map(([dx,rot])=>`<g transform="rotate(${rot} ${cx+dx} ${cy})" filter="url(#sh)"><rect x="${cx+dx-4}" y="${cy-6}" width="8" height="7" fill="url(#gGold)"/><rect x="${cx+dx-4.5}" y="${cy-52}" width="9" height="47" rx="4.5" fill="url(#gBlack)" stroke="#000"/><rect x="${cx+dx-3.5}" y="${cy-14}" width="7" height="6" fill="#2a2d32"/></g>`).join(''));
    return;
  }
  const spec={monitor:['#15171a',5,22,14],keyboard:['#2a2e35',4,18,12],mouse:['#2a2e35',4,18,12],ethernet:['#1565c0',4.5,16,14],power:['#101113',7,30,24]}[it.id];
  const [col,w,pw,ph]=spec;
  const boot=it.id==='ethernet'?'#5aa0f0':col;
  g.insertAdjacentHTML('beforeend',`<g filter="url(#sh2)">
    <path d="M${cx+pw/2} ${cy}C930 ${cy} 945 ${cy+8} 992 ${cy+8}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>
    <path d="M${cx+pw/2} ${cy-w/4}C930 ${cy-w/4} 945 ${cy+8-w/4} 992 ${cy+8-w/4}" stroke="#fff" stroke-opacity=".15" stroke-width="1" fill="none"/>
    <path d="M${cx-pw/2} ${cy-ph/2}h${pw-6}l6 ${ph/4}v${ph/2}l-6 ${ph/4}h-${pw-6}z" fill="${boot}" stroke="#000" stroke-opacity=".6"/>
    <rect x="${cx-pw/2+2}" y="${cy-ph/2+2}" width="${pw*.45}" height="2" rx="1" fill="#fff" opacity=".18"/></g>
    <text x="988" y="${cy}" text-anchor="end" class="t-p" fill="#8a9bb0">${it.name.split(' (')[0]}</text>`);
}
