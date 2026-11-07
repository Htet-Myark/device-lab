'use strict';
/* Device Lab | MIT License | Educational use only. See DISCLAIMER.md */
/* ---------------- items ---------------- */
const ITEMS={
  psu:{name:'Power supply (ATX)',part:1},
  mobo:{name:'Motherboard',part:2},
  vest:{name:'ESD vest (smock)',part:2},
  strap:{name:'Antistatic wrist strap',part:2},
  cpu:{name:'CPU',part:2,rot:4},
  paste:{name:'Thermal compound',part:2},
  cooler:{name:'Heat sink / fan assembly',part:2},
  fanplug:{name:'Cooler fan cable',part:2,locked:true},
  ram1:{name:'RAM module',part:2,rot:2,icon:'ram'},
  ram2:{name:'RAM module',part:2,rot:2,icon:'ram'},
  ioshield:{name:'I/O shield',part:2},
  mbAsm:{name:'Motherboard',part:99,icon:'mobo'},
  hdd:{name:'Hard disk drive (3.5")',part:3},
  odd:{name:'Optical drive (5.25")',part:3},
  nic:{name:'Network card (NIC)',part:4},
  wifi:{name:'Wireless NIC',part:4},
  gpu:{name:'Video adapter card',part:4},
  atx24:{name:'24-pin main power',part:5},
  eps8:{name:'8-pin CPU (aux) power',part:5},
  satapwrA:{name:'SATA power connector',part:5,icon:'satapwr'},
  satapwrB:{name:'SATA power connector',part:5,icon:'satapwr'},
  pcie:{name:'PCIe 6+2-pin power',part:5},
  sataA:{name:'SATA data cable #1',part:5,icon:'sata'},
  sataAend:{name:'SATA cable #1, free end',part:5,icon:'sata',locked:true},
  sataB:{name:'SATA data cable #2',part:5,icon:'sata'},
  sataBend:{name:'SATA cable #2, free end',part:5,icon:'sata',locked:true},
  cpwr:{name:'POWER SW lead',part:6,fp:['PWR SW','#e53935',false]},
  creset:{name:'RESET SW lead',part:6,fp:['RESET','#1e88e5',false]},
  cpled:{name:'POWER LED lead',part:6,fp:['PLED','#8e24aa',true],rot:2},
  chdd:{name:'HDD LED lead',part:6,fp:['HDD','#43a047',true],rot:2},
  cspk:{name:'Speaker lead',part:6,fp:['SPEAKER','#f4f4f4',false,4]},
  cusb:{name:'Front USB connector',part:6,icon:'hdr',hdr:['USB','#1e63c9']},
  caudio:{name:'Front HD Audio connector',part:6,icon:'hdr',hdr:['AUDIO','#222']},
  monitor:{name:'Monitor cable (HDMI)',part:7},
  screwdriver:{name:'Phillips screwdriver',part:0,tool:true},
  keyboard:{name:'Keyboard (USB)',part:7},
  mouse:{name:'Mouse (USB)',part:7},
  ethernet:{name:'Ethernet cable',part:7},
  antenna:{name:'Wireless antenna',part:7},
  power:{name:'AC power cable',part:7},
};
for(const k in ITEMS){ITEMS[k].id=k;ITEMS[k].o=0;ITEMS[k].used=false}

function orientCss(it){
  if(!it.rot) return '';
  if(it.id==='cpu') return `transform:rotate(${it.o*90}deg)`;
  if(it.icon==='ram') return it.o?'transform:scaleX(-1)':'';
  return '';
}
function icon(it){
  const W=x=>`<svg viewBox="0 0 80 50" width="80" height="50" style="${orientCss(it)};overflow:visible"><g filter="url(#sh2)">${x}</g></svg>`;
  const t=it.icon||it.id;
  const holes=(cols,rows,x0,y0,d,s)=>{let o='';for(let a=0;a<cols;a++)for(let b=0;b<rows;b++)o+=`<rect x="${x0+a*d}" y="${y0+b*d}" width="${s}" height="${s}" fill="#000"/>`;return o};
  const sleeve=(y,w,len=30)=>`<path d="M0 ${y}H${len}" stroke="#1d2025" stroke-width="${w}"/><path d="M0 ${y}H${len}" stroke="url(#braid)" stroke-width="${w-2}"/>`;
  if(it.fp){
    const [lab,col,pol,n=2]=it.fp, w=n*8+6, x=60-w, wire=col==='#f4f4f4'?'#e0e0e0':col;
    let s=`<path d="M0 26C15 26 20 22 ${x} 22" stroke="${wire}" stroke-width="2.2" fill="none"/><path d="M0 31C15 31 20 28 ${x} 28" stroke="#eee" stroke-width="2.2" fill="none"/>`;
    s+=`<rect x="${x}" y="15" width="${w}" height="17" rx="1.5" fill="url(#gBlack)" stroke="#555"/><text x="${x+w/2}" y="44" text-anchor="middle" font-size="8.5" font-weight="700" fill="#dce6f2" font-family="Arial">${lab}</text>`;
    if(pol){const a=it.o?'−':'+',b=it.o?'+':'−';s+=`<text x="${x+6}" y="27" font-size="10" fill="#ffca28" text-anchor="middle" font-weight="700">${a}</text><text x="${x+w-6}" y="27" font-size="10" fill="#ffca28" text-anchor="middle" font-weight="700">${b}</text>`}
    return W(s);
  }
  switch(t){
    case 'psu':return W(`<rect x="6" y="5" width="68" height="40" rx="2.5" fill="url(#gBlack)"/><circle cx="50" cy="25" r="15" fill="#08090b"/><circle cx="50" cy="25" r="15" fill="url(#honey)"/><circle cx="50" cy="25" r="15" fill="none" stroke="#6b737d" stroke-width="1.5"/><rect x="11" y="10" width="16" height="12" rx="1.5" fill="#050505" stroke="#555"/><rect x="12" y="28" width="8" height="11" rx="1" fill="#c62828"/>`);
    case 'mobo':return W(`<rect x="6" y="3" width="68" height="44" rx="2" fill="url(#gPcb)"/><rect x="8" y="6" width="8" height="20" fill="#1d2025"/><rect x="26" y="8" width="16" height="16" fill="url(#gSteelH)"/><rect x="29" y="11" width="10" height="10" fill="url(#pins)"/><rect x="18" y="8" width="5" height="18" fill="url(#finsH)"/><g fill="#1e2126"><rect x="50" y="6" width="2.5" height="22"/><rect x="58" y="6" width="2.5" height="22"/></g><g fill="#a3abb5"><rect x="54" y="6" width="2.5" height="22"/><rect x="62" y="6" width="2.5" height="22"/></g><rect x="12" y="33" width="44" height="3.5" fill="url(#gSteelH)"/><rect x="12" y="40" width="18" height="3" fill="#111"/><rect x="66" y="8" width="5" height="18" fill="#141518"/>`);
    case 'vest':return W(`<path d="M24 4h9l7 7 7-7h9l9 9-7 9v24H22V22l-7-9z" fill="#24499c" stroke="#0f2a5e"/><path d="M40 11v35" stroke="#c9ced5" stroke-width="1.4"/><g stroke="#6f8fd6" stroke-width=".5" opacity=".7"><path d="M22 26h36M22 34h36M30 12v34M50 12v34"/></g><circle cx="50" cy="22" r="4.5" fill="#ffd54f"/><text x="50" y="24" font-size="4" text-anchor="middle" font-weight="700" fill="#222">ESD</text>`);
    case 'strap':return W(`<path d="${coilPath(40,30,72,28,6,4)}" stroke="#1c1f24" stroke-width="1.6" fill="none"/><ellipse cx="22" cy="25" rx="13" ry="13" fill="none" stroke="#244f9e" stroke-width="6.5"/><ellipse cx="22" cy="25" rx="13" ry="13" fill="none" stroke="#5a8bdc" stroke-width="6.5" stroke-dasharray="1.5 2" opacity=".6"/><rect x="31" y="20" width="9" height="10" rx="2" fill="url(#gChrome)"/><path d="M70 24l8-4v12l-8-4z" fill="#c62828"/>`);
    case 'cpu':return W(`<g transform="translate(40 25)"><rect x="-21" y="-21" width="42" height="42" rx="2" fill="#1f6b46" stroke="#0e3220"/><path d="M-16 -17h32v4h4v26h-4v4h-32v-4h-4v-26h4z" fill="url(#gAlu)" stroke="#8b939d"/><text x="0" y="2" text-anchor="middle" font-size="6" fill="#6b737c" font-family="Arial" font-weight="700">CPU</text><path d="M-20 20h8l-8-8z" fill="url(#gGold)"/></g>`);
    case 'paste':return W(`<rect x="10" y="19" width="44" height="12" rx="3" fill="#e9edf1" fill-opacity=".85" stroke="#9aa1aa"/><rect x="14" y="21.5" width="32" height="7" rx="1" fill="#9ca3ab"/><rect x="54" y="22" width="14" height="6" fill="#c3c9d0"/><path d="M68 25h7" stroke="#c3c9d0" stroke-width="2"/><rect x="3" y="16" width="7" height="18" rx="1" fill="#5f6670"/><rect x="0" y="23" width="4" height="4" fill="#5f6670"/>`);
    case 'cooler':return W(`<rect x="16" y="2" width="48" height="46" rx="8" fill="#121417"/><circle cx="40" cy="25" r="21" fill="url(#gAlu)"/><circle cx="40" cy="25" r="18" fill="#0c0d10"/><g fill="url(#gBlade)" stroke="#000" stroke-width=".4">${[...Array(7)].map((_,k)=>`<path d="M40 25C41 19 45 13 53 12C54 17 50 23 44 26Z" transform="rotate(${k*360/7} 40 25)"/>`).join('')}</g><circle cx="40" cy="25" r="5" fill="url(#gAlu)"/>`);
    case 'fanplug':return W(`${sleeve(29,4,44)}<rect x="44" y="21" width="22" height="13" rx="1" fill="#efefef" stroke="#999"/>${holes(4,1,47,26,4.5,2.4)}`);
    case 'ram':return W(`<rect x="3" y="10" width="74" height="24" rx="1.5" fill="url(#gBlack)"/><path d="M3 15h74" stroke="#5a616b"/><rect x="10" y="17" width="24" height="9" rx="1" fill="#b71c1c" opacity=".8"/><text x="58" y="25" text-anchor="middle" font-size="6" fill="#9aa1aa" font-family="Arial" font-weight="700">DDR 8GB</text><rect x="3" y="33" width="74" height="5" fill="url(#gGold)"/><g fill="#7a5f15">${[...Array(18)].map((_,k)=>`<rect x="${5+k*4}" y="33" width=".6" height="5"/>`).join('')}</g><rect x="24" y="32.5" width="4" height="6" fill="#0f151e"/>`);
    case 'ioshield':return W(`<rect x="4" y="11" width="72" height="28" rx="1" fill="url(#gSteelH)"/><g fill="#0a0b0d"><rect x="9" y="16" width="10" height="18" rx="1"/><rect x="23" y="16" width="13" height="7" rx="1"/><rect x="23" y="27" width="13" height="7" rx="1"/><rect x="40" y="16" width="11" height="11" rx="1"/><circle cx="60" cy="25" r="4"/><circle cx="70" cy="25" r="4"/></g>`);
    case 'hdd':return W(`<rect x="7" y="5" width="66" height="40" rx="2.5" fill="url(#gAlu)" stroke="#7d858f"/><rect x="28" y="10" width="40" height="30" rx="1.5" fill="#f4f5f7" stroke="#c7ccd2"/><text x="31" y="18" font-size="5" font-weight="700" fill="#222" font-family="Arial">HARD DRIVE</text><g fill="#222">${[...Array(12)].map((_,k)=>`<rect x="${32+k*2.8}" y="27" width="${k%3?1:1.8}" height="9"/>`).join('')}</g><circle cx="13" cy="11" r="2" fill="url(#gChrome)"/><circle cx="13" cy="39" r="2" fill="url(#gChrome)"/>`);
    case 'odd':return W(`<rect x="3" y="11" width="74" height="28" rx="1.5" fill="url(#gBlack)"/><rect x="3" y="11" width="74" height="10" fill="#202328"/><rect x="5" y="17" width="58" height="1.2" fill="#3c424a"/><rect x="64" y="25" width="9" height="4" rx="1" fill="#2a2e34"/><circle cx="68" cy="33" r="1.3" fill="#6f6"/><text x="10" y="33" font-size="5.5" fill="#7d8691" font-family="Arial" font-weight="700">DVD-RW</text>`);
    case 'nic':return W(`<rect x="3" y="9" width="62" height="25" rx="1.5" fill="url(#gPcb)"/><rect x="65" y="4" width="6" height="42" fill="url(#gSteelH)"/><rect x="58" y="14" width="13" height="12" fill="url(#gSteelH)" stroke="#5b636d"/><rect x="60" y="16" width="9" height="7" fill="#000"/><rect x="22" y="15" width="13" height="12" fill="#151515"/><circle cx="44" cy="20" r="3" fill="url(#gCap)"/><rect x="12" y="34" width="26" height="5" fill="url(#gGold)"/>`);
    case 'wifi':return W(`<rect x="3" y="9" width="62" height="25" rx="1.5" fill="url(#gPcbB)"/><rect x="65" y="4" width="6" height="42" fill="url(#gSteelH)"/><rect x="18" y="13" width="26" height="16" rx="1" fill="url(#gAlu)"/><text x="31" y="23" text-anchor="middle" font-size="5" fill="#555" font-family="Arial" font-weight="700">Wi-Fi</text><circle cx="74" cy="14" r="3.5" fill="url(#gGold)"/><circle cx="74" cy="34" r="3.5" fill="url(#gGold)"/><rect x="12" y="34" width="22" height="5" fill="url(#gGold)"/>`);
    case 'gpu':return W(`<path d="M1 6H64L68 10V32L64 36H1Z" fill="url(#gShroud)" stroke="#555d68"/><circle cx="19" cy="21" r="12" fill="#0c0d10"/><circle cx="46" cy="21" r="12" fill="#0c0d10"/><g fill="url(#gBlade)" stroke="#000" stroke-width=".3">${[19,46].map(c=>[...Array(7)].map((_,k)=>`<path d="M${c} 21C${c+1} 16 ${c+4} 11 ${c+10} 11C${c+10} 15 ${c+7} 19 ${c+3} 22Z" transform="rotate(${k*360/7} ${c} 21)"/>`).join('')).join('')}</g><circle cx="19" cy="21" r="3.5" fill="url(#gAlu)"/><circle cx="46" cy="21" r="3.5" fill="url(#gAlu)"/><rect x="68" y="3" width="6" height="43" fill="url(#gSteelH)"/><rect x="8" y="36" width="46" height="5" fill="url(#gGold)"/><rect x="54" y="6.5" width="9" height="5" fill="#000"/>`);
    case 'atx24':return W(`${sleeve(25,14,26)}<rect x="26" y="13" width="50" height="24" rx="1.5" fill="#141518" stroke="#3a3e44"/>${holes(12,2,28.5,15.5,4,3)}<rect x="45" y="10" width="10" height="3" fill="#141518"/>`);
    case 'eps8':return W(`${sleeve(25,9,36)}<rect x="36" y="14" width="26" height="22" rx="1.5" fill="#141518" stroke="#3a3e44"/>${holes(4,2,38.5,16.5,6,4.5)}<rect x="45" y="11" width="8" height="3" fill="#141518"/>`);
    case 'pcie':return W(`${sleeve(25,8,34)}<rect x="34" y="15" width="22" height="20" rx="1.5" fill="#141518" stroke="#3a3e44"/>${holes(3,2,36.5,17.5,6.5,4.5)}<rect x="57" y="15" width="8" height="20" rx="1.5" fill="#141518" stroke="#3a3e44"/>${holes(1,2,59,17.5,6.5,4)}`);
    case 'satapwr':return W(`${['#fdd835','#111','#111','#d32f2f','#f2f2f2'].map((c,k)=>`<path d="M0 ${18+k*3}H40" stroke="${c}" stroke-width="2"/>`).join('')}<path d="M40 14h24v6h-19v14h-5z" fill="#141518" stroke="#3a3e44"/>`);
    case 'sata':return W(`<path d="M0 26H44" stroke="#b71c1c" stroke-width="5"/><path d="M0 25H44" stroke="#ef9a9a" stroke-width="1" opacity=".5"/><path d="M44 18h18v5h-13v10h-5z" fill="#c62828" stroke="#7f1010"/><rect x="47" y="15" width="12" height="2" fill="url(#gSteelH)"/>`);
    case 'hdr':{const [l]=it.hdr;const blue=l==='USB';return W(`${[0,1,2,3].map(k=>`<path d="M0 ${19+k*3}C15 ${19+k*3} 20 ${18+k*3} 34 ${18+k*3}" stroke="${['#e53935','#fafafa','#43a047','#222'][k]}" stroke-width="1.8" fill="none"/>`).join('')}<rect x="34" y="12" width="34" height="22" rx="1.5" fill="${blue?'#1e4fa0':'url(#gBlack)'}" stroke="#555"/><text x="51" y="26" text-anchor="middle" font-size="7.5" font-weight="700" fill="#f2f2f2" font-family="Arial">${l}</text>`)}
    case 'monitor':return W(`<path d="M0 25H42" stroke="#15171a" stroke-width="6"/><path d="M42 18h14l4 3v8l-4 3H42z" fill="#202328"/><path d="M60 19h12v12h-12z" fill="url(#gSteelH)"/><rect x="62" y="22" width="8" height="5" fill="#000"/>`);
    case 'keyboard':return W(`<rect x="2" y="16" width="62" height="24" rx="3" fill="url(#gBlack)"/>${[...Array(30)].map((_,k)=>`<rect x="${5+(k%10)*5.8}" y="${19+Math.floor(k/10)*6}" width="4.6" height="4.6" rx=".8" fill="#2c3037" stroke="#000" stroke-width=".3"/>`).join('')}<path d="M64 24H72" stroke="#2a2e35" stroke-width="2"/><rect x="72" y="21" width="7" height="6" fill="url(#gSteelH)"/>`);
    case 'mouse':return W(`<path d="M34 6C24 6 21 14 21 24C21 36 26 44 34 44S47 36 47 24C47 14 44 6 34 6Z" fill="url(#gBlack)" stroke="#555"/><path d="M34 6V20M21 20H47" stroke="#555" stroke-width=".8"/><rect x="32.5" y="11" width="3" height="6" rx="1.5" fill="#777"/><path d="M47 22C60 22 60 14 72 14" stroke="#2a2e35" stroke-width="2" fill="none"/><rect x="72" y="11" width="7" height="6" fill="url(#gSteelH)"/>`);
    case 'ethernet':return W(`<path d="M0 25H44" stroke="#1565c0" stroke-width="5"/><path d="M44 17h10l4 4v8l-4 4H44z" fill="#5aa0f0" fill-opacity=".85"/><rect x="58" y="18" width="14" height="14" fill="#cfe3ff" fill-opacity=".8" stroke="#90b4e0"/>${[...Array(5)].map((_,k)=>`<rect x="${60+k*2.4}" y="19" width="1.2" height="5" fill="url(#gGold)"/>`).join('')}`);
    case 'antenna':return W(`<rect x="35.5" y="2" width="9" height="36" rx="4.5" fill="url(#gBlack)" stroke="#000"/><rect x="36.5" y="30" width="7" height="6" fill="#2a2d32"/><rect x="35" y="38" width="10" height="9" fill="url(#gGold)"/>`);
    case 'screwdriver':return W(`<g transform="rotate(-28 40 25)"><rect x="4" y="19" width="30" height="12" rx="5" fill="#c62828"/><rect x="8" y="19" width="2" height="12" fill="#8e1b1b"/><rect x="14" y="19" width="2" height="12" fill="#8e1b1b"/><rect x="20" y="19" width="2" height="12" fill="#8e1b1b"/><rect x="32" y="21" width="5" height="8" rx="1" fill="#1a1a1a"/><rect x="37" y="23.5" width="34" height="3" fill="url(#gSteelH)"/><path d="M71 23.5l5 1.5-5 1.5z" fill="#9aa1aa"/></g>`);
    case 'power':return W(`<path d="M0 25H44" stroke="#101113" stroke-width="7"/><path d="M44 13h22l6 5v14l-6 5H44z" fill="url(#gBlack)" stroke="#000"/><g fill="#000"><rect x="51" y="19" width="3" height="11"/><rect x="60" y="19" width="3" height="11"/></g>`);
  }
  return W('');
}


