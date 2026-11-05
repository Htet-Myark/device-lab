'use strict';
/* PC Lab Assembly | MIT License | Educational use only. See DISCLAIMER.md */
/* Shared by the desktop and laptop labs: DOM helpers and the SVG gradients/patterns used by tray icons. */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

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


document.getElementById('defsSvg').innerHTML=DEFS;
