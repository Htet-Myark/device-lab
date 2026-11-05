'use strict';
/* PC Lab Assembly: Laptop Lab | MIT License | Educational use only. See DISCLAIMER.md */
/* ---------------- items ---------------- */
const ITEMS={
  vest:{name:'ESD vest (smock)',part:1},
  strap:{name:'Antistatic wrist strap',part:1},
  chassis:{name:'Laptop base (keyboard & palm rest)',part:1},
  mobo:{name:'System board',part:2},
  kbRibbon:{name:'Keyboard ribbon cable',part:2,rot:2,icon:'ribbon'},
  tpRibbon:{name:'Touchpad ribbon cable',part:2,rot:2,icon:'ribbon'},
  edp:{name:'Display cable (eDP)',part:2},
  paste:{name:'Thermal compound',part:3},
  heatsink:{name:'Heat pipe & fan assembly',part:3},
  fanCable:{name:'Fan cable',part:3,locked:true},
  ram1:{name:'SO-DIMM module',part:4,rot:2,icon:'sodimm'},
  ram2:{name:'SO-DIMM module',part:4,rot:2,icon:'sodimm'},
  ssd:{name:'M.2 NVMe SSD (2280)',part:4},
  wifi:{name:'M.2 Wi-Fi card (2230)',part:5},
  antMain:{name:'Antenna lead: MAIN (black)',part:5,icon:'ant',col:'#1b1d21'},
  antAux:{name:'Antenna lead: AUX (white)',part:5,icon:'ant',col:'#e8e8e8'},
  speakers:{name:'Speaker pair',part:5},
  spkCable:{name:'Speaker cable',part:5,locked:true},
  battery:{name:'Battery (Li-ion)',part:6},
  battPlug:{name:'Battery connector',part:6,locked:true},
  charger:{name:'USB-C power adapter (65 W)',part:7},
  screwdriver:{name:'Phillips #0 screwdriver',part:0,tool:true},
};
for(const k in ITEMS){ITEMS[k].id=k;ITEMS[k].o=0;ITEMS[k].used=false}

function orientCss(it){
  if(!it.rot) return '';
  if(it.icon==='sodimm') return it.o?'transform:scaleX(-1)':'';
  if(it.icon==='ribbon') return it.o?'transform:scaleY(-1)':'';
  return '';
}
function icon(it){
  const W=x=>`<svg viewBox="0 0 80 50" width="80" height="50" style="${orientCss(it)};overflow:visible"><g filter="url(#sh2)">${x}</g></svg>`;
  const t=it.icon||it.id;
  switch(t){
    case 'vest':return W(`<path d="M24 4h9l7 7 7-7h9l9 9-7 9v24H22V22l-7-9z" fill="#24499c" stroke="#0f2a5e"/><path d="M40 11v35" stroke="#c9ced5" stroke-width="1.4"/><g stroke="#6f8fd6" stroke-width=".5" opacity=".7"><path d="M22 26h36M22 34h36M30 12v34M50 12v34"/></g><circle cx="50" cy="22" r="4.5" fill="#ffd54f"/><text x="50" y="24" font-size="4" text-anchor="middle" font-weight="700" fill="#222">ESD</text>`);
    case 'strap':return W(`<path d="${coilPath(40,30,72,28,6,4)}" stroke="#1c1f24" stroke-width="1.6" fill="none"/><ellipse cx="22" cy="25" rx="13" ry="13" fill="none" stroke="#244f9e" stroke-width="6.5"/><ellipse cx="22" cy="25" rx="13" ry="13" fill="none" stroke="#5a8bdc" stroke-width="6.5" stroke-dasharray="1.5 2" opacity=".6"/><rect x="31" y="20" width="9" height="10" rx="2" fill="url(#gChrome)"/><path d="M70 24l8-4v12l-8-4z" fill="#c62828"/>`);
    case 'chassis':return W(`<path d="M6 12h68l4 28H2z" fill="url(#gSteel)" stroke="#2a2f36"/><path d="M10 15h60l2 15H8z" fill="#1d2025"/>${[...Array(24)].map((_,k)=>`<rect x="${11+(k%12)*4.9}" y="${16.5+Math.floor(k/12)*6}" width="4" height="4.6" rx=".6" fill="#2c3037"/>`).join('')}<rect x="30" y="32" width="20" height="6.5" rx="1" fill="#3a414b"/>`);
    case 'mobo':return W(`<path d="M3 9h74v22H48v10H3z" fill="url(#gPcb)" stroke="#0e3220"/><rect x="40" y="13" width="12" height="10" fill="#1f6b46" stroke="#0e3220"/><rect x="43" y="15" width="6" height="5" fill="#2a2e34"/><rect x="7" y="12" width="26" height="6" fill="#141518"/><rect x="7" y="21" width="26" height="6" fill="#141518"/><rect x="7" y="31" width="24" height="7" fill="#101c33"/><rect x="58" y="24" width="8" height="4" fill="#efefef"/><circle cx="8" cy="36" r="1.6" fill="url(#gChrome)"/><circle cx="73" cy="12" r="1.6" fill="url(#gChrome)"/>`);
    case 'ribbon':return W(`<path d="M4 18h46v14H4z" fill="#d9a441" fill-opacity=".9"/><path d="M50 18h20v14H50z" fill="#1b1d21"/><g fill="url(#gGold)">${[...Array(8)].map((_,k)=>`<rect x="${52+k*2.2}" y="20" width="1.2" height="10"/>`).join('')}</g><rect x="50" y="18" width="20" height="3" fill="#2f6fd6"/><text x="26" y="28" text-anchor="middle" font-size="6" font-weight="700" fill="#5a3a08" font-family="Arial">${it.id==='kbRibbon'?'KB':'TP'}</text>`);
    case 'edp':return W(`<path d="M0 27C20 27 24 22 46 22" stroke="#15171a" stroke-width="5" fill="none"/><path d="M0 27C20 27 24 22 46 22" stroke="#4a515b" stroke-width="1" stroke-dasharray="2 2" fill="none"/><rect x="46" y="15" width="24" height="13" rx="1.5" fill="url(#gSteelH)" stroke="#5b636d"/><rect x="50" y="18" width="16" height="6" fill="#111"/><rect x="58" y="10" width="10" height="5" fill="#c62828"/><text x="58" y="38" text-anchor="middle" font-size="6.5" font-weight="700" fill="#dce6f2" font-family="Arial">eDP</text>`);
    case 'paste':return W(`<rect x="10" y="19" width="44" height="12" rx="3" fill="#e9edf1" fill-opacity=".85" stroke="#9aa1aa"/><rect x="14" y="21.5" width="32" height="7" rx="1" fill="#9ca3ab"/><rect x="54" y="22" width="14" height="6" fill="#c3c9d0"/><path d="M68 25h7" stroke="#c3c9d0" stroke-width="2"/><rect x="3" y="16" width="7" height="18" rx="1" fill="#5f6670"/><rect x="0" y="23" width="4" height="4" fill="#5f6670"/>`);
    case 'heatsink':return W(`<rect x="6" y="18" width="18" height="14" rx="1" fill="#c87a45" stroke="#7a4420"/><path d="M15 25H52" stroke="#c87a45" stroke-width="4" stroke-linecap="round"/><rect x="48" y="9" width="6" height="32" fill="url(#finsV)"/><circle cx="66" cy="25" r="12" fill="#121417"/><g fill="url(#gBlade)" stroke="#000" stroke-width=".3">${[...Array(9)].map((_,k)=>`<path d="M66 25C67 20 70 16 75 15C75 19 72 23 69 26Z" transform="rotate(${k*40} 66 25)"/>`).join('')}</g><circle cx="66" cy="25" r="3" fill="url(#gAlu)"/><g fill="#9aa1aa"><circle cx="5" cy="16" r="2"/><circle cx="25" cy="34" r="2"/><circle cx="25" cy="16" r="2"/><circle cx="5" cy="34" r="2"/></g>`);
    case 'fanCable':return W(`${['#d32f2f','#111','#fdd835','#1e63c9'].map((c,k)=>`<path d="M0 ${20+k*2.6}C20 ${20+k*2.6} 26 ${22+k*1.4} 46 ${22+k*1.4}" stroke="${c}" stroke-width="1.6" fill="none"/>`).join('')}<rect x="46" y="18" width="18" height="12" rx="1" fill="#efefef" stroke="#999"/>${[0,1,2,3].map(k=>`<rect x="${48.5+k*3.6}" y="22" width="2" height="4" fill="#000"/>`).join('')}`);
    case 'sodimm':return W(`<rect x="4" y="12" width="72" height="24" rx="1.5" fill="url(#gPcb)"/>${[0,1,2,3].map(k=>`<rect x="${8+k*16}" y="15" width="12" height="11" rx="1" fill="#16191d"/>`).join('')}<text x="40" y="32" text-anchor="middle" font-size="5" fill="#cfe8d8" font-family="Arial" font-weight="700">SO-DIMM 8GB</text><rect x="4" y="35" width="72" height="5" fill="url(#gGold)"/><rect x="32" y="34.5" width="4" height="6" fill="#0f151e"/><path d="M4 18h-2v8h2M76 18h2v8h-2" fill="#0f151e"/>`);
    case 'ssd':return W(`<rect x="2" y="17" width="76" height="16" rx="1.5" fill="url(#gPcb)"/><rect x="2" y="17" width="5" height="16" fill="url(#gGold)"/><rect x="4" y="22" width="1.6" height="5" fill="#0f151e"/><rect x="12" y="19" width="14" height="12" rx="1" fill="#16191d"/><rect x="30" y="19" width="16" height="12" rx="1" fill="#16191d"/><rect x="50" y="19" width="16" height="12" rx="1" fill="#16191d"/><path d="M78 21a4 4 0 0 0 0 8" fill="#0b0d10"/><text x="58" y="27" text-anchor="middle" font-size="4.4" fill="#aab4be" font-family="Arial" font-weight="700">NVMe</text>`);
    case 'wifi':return W(`<rect x="22" y="13" width="36" height="24" rx="1.5" fill="url(#gPcbB)"/><rect x="22" y="13" width="5" height="24" fill="url(#gGold)"/><rect x="24" y="17" width="1.6" height="5" fill="#0f151e"/><rect x="24" y="28" width="1.6" height="3" fill="#0f151e"/><rect x="30" y="16" width="18" height="18" rx="1" fill="url(#gAlu)"/><circle cx="52" cy="19" r="2.6" fill="url(#gGold)"/><circle cx="52" cy="31" r="2.6" fill="url(#gGold)"/><text x="39" y="27" text-anchor="middle" font-size="4.5" fill="#555" font-family="Arial" font-weight="700">Wi-Fi</text><path d="M58 21a4 4 0 0 0 0 8" fill="#0b0d10"/>`);
    case 'ant':{const c=it.col;return W(`<path d="M0 28C20 28 30 22 54 24" stroke="${c==='#e8e8e8'?'#bdbdbd':'#000'}" stroke-width="3.2" fill="none"/><path d="M0 28C20 28 30 22 54 24" stroke="${c}" stroke-width="2" fill="none"/><circle cx="60" cy="24" r="6" fill="url(#gGold)" stroke="#8a6418"/><circle cx="60" cy="24" r="2.2" fill="#6b4f12"/><text x="40" y="40" text-anchor="middle" font-size="7" font-weight="700" fill="#dce6f2" font-family="Arial">${it.id==='antMain'?'MAIN':'AUX'}</text>`)}
    case 'speakers':return W(`<rect x="4" y="14" width="26" height="20" rx="3" fill="url(#gBlack)" stroke="#555"/><rect x="50" y="14" width="26" height="20" rx="3" fill="url(#gBlack)" stroke="#555"/><rect x="8" y="18" width="18" height="12" rx="2" fill="url(#mesh)"/><rect x="54" y="18" width="18" height="12" rx="2" fill="url(#mesh)"/><path d="M30 24C40 30 40 30 50 24" stroke="#d32f2f" stroke-width="1.4" fill="none"/><path d="M30 26C40 32 40 32 50 26" stroke="#111" stroke-width="1.4" fill="none"/>`);
    case 'spkCable':return W(`<path d="M0 22C20 22 26 24 48 24" stroke="#d32f2f" stroke-width="1.8" fill="none"/><path d="M0 26C20 26 26 27 48 27" stroke="#111" stroke-width="1.8" fill="none"/><rect x="48" y="19" width="12" height="11" rx="1" fill="#efefef" stroke="#999"/><rect x="51" y="23" width="2" height="3" fill="#000"/><rect x="55" y="23" width="2" height="3" fill="#000"/><text x="54" y="40" text-anchor="middle" font-size="6" font-weight="700" fill="#dce6f2" font-family="Arial">SPK</text>`);
    case 'battery':return W(`<rect x="3" y="11" width="74" height="28" rx="2.5" fill="url(#gBlack)" stroke="#000"/><rect x="8" y="15" width="44" height="20" rx="1.5" fill="#e9edf1"/><text x="30" y="23" text-anchor="middle" font-size="5" font-weight="700" fill="#222" font-family="Arial">Li-ion 11.55V</text><text x="30" y="31" text-anchor="middle" font-size="6.5" font-weight="900" fill="#222" font-family="Arial">54 Wh</text><rect x="58" y="18" width="12" height="14" rx="1" fill="#2a2e34"/><path d="M62 21l-2 5h3l-2 5" stroke="#ffca28" stroke-width="1.2" fill="none"/>`);
    case 'battPlug':return W(`${['#d32f2f','#d32f2f','#111','#111','#fdd835','#f2f2f2'].map((c,k)=>`<path d="M0 ${17+k*2.6}H40" stroke="${c}" stroke-width="1.8"/>`).join('')}<rect x="40" y="14" width="26" height="20" rx="1.5" fill="#efefef" stroke="#999"/>${[...Array(6)].map((_,k)=>`<rect x="${43+k*3.6}" y="21" width="2" height="6" fill="#000"/>`).join('')}`);
    case 'charger':return W(`<rect x="2" y="10" width="30" height="30" rx="5" fill="#eceff2" stroke="#9aa1aa"/><text x="17" y="28" text-anchor="middle" font-size="7" font-weight="900" fill="#555" font-family="Arial">65W</text><path d="M32 25C44 25 46 25 56 25" stroke="#e8e8e8" stroke-width="3.5"/><rect x="56" y="20" width="12" height="10" rx="2" fill="#eceff2" stroke="#9aa1aa"/><rect x="68" y="21.5" width="8" height="7" rx="3.5" fill="url(#gSteelH)"/>`);
    case 'screwdriver':return W(`<g transform="rotate(-28 40 25)"><rect x="4" y="19" width="30" height="12" rx="5" fill="#c62828"/><rect x="8" y="19" width="2" height="12" fill="#8e1b1b"/><rect x="14" y="19" width="2" height="12" fill="#8e1b1b"/><rect x="20" y="19" width="2" height="12" fill="#8e1b1b"/><rect x="32" y="21" width="5" height="8" rx="1" fill="#1a1a1a"/><rect x="37" y="23.5" width="34" height="3" fill="url(#gSteelH)"/><path d="M71 23.5l5 1.5-5 1.5z" fill="#9aa1aa"/></g>`);
  }
  return W('');
}
