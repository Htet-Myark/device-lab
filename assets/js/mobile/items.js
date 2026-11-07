'use strict';
/* Device Lab: Phone & Tablet Labs | MIT License | Educational use only. See DISCLAIMER.md */
/* The page sets window.DEVICE to 'phone' or 'tablet' before the scripts load. */
const DEVICE=window.DEVICE==='tablet'?'tablet':'phone';
const IS_TAB=DEVICE==='tablet';
/* ---------------- items ---------------- */
const ITEMS=IS_TAB?{
  vest:{name:'ESD vest (smock)',part:1},
  strap:{name:'Antistatic wrist strap',part:1},
  frame:{name:'Tablet rear case',part:1},
  board:{name:'Logic board',part:2},
  rearCam:{name:'Rear camera module',part:2},
  camFlex:{name:'Rear camera flex',part:2,locked:true,icon:'flex'},
  frontCam:{name:'Front camera',part:2},
  fcamFlex:{name:'Front camera flex',part:2,locked:true,icon:'flex'},
  portAsm:{name:'USB-C charging port',part:3},
  portFlex:{name:'Charging port flex',part:3,locked:true,icon:'flex'},
  speakers:{name:'Speaker modules (pair)',part:3},
  battAdhesive:{name:'Battery adhesive strips',part:4,icon:'adhesive'},
  battery:{name:'Battery (2-cell Li-ion)',part:4},
  lcd:{name:'LCD panel',part:5},
  lcdFlex:{name:'LCD flex cable',part:5,locked:true,icon:'flex'},
  battPlug:{name:'Battery connector',part:5,locked:true,icon:'battPlug'},
  shield:{name:'Connector shield plate',part:5},
  screwShort:{name:'Shield screw, 1.2 mm',part:5,icon:'screwS'},
  screwLong:{name:'Shield screw, 3.6 mm',part:5,icon:'screwL'},
  gasket:{name:'Front-glass adhesive',part:5,icon:'adhesive'},
  digitizer:{name:'Front glass (digitizer)',part:5,icon:'display'},
  digiFlex:{name:'Digitizer flex cable',part:5,locked:true,icon:'flex'},
  screwdriver:{name:'Phillips #000 screwdriver',part:0,tool:true},
}:{
  vest:{name:'ESD vest (smock)',part:1},
  strap:{name:'Antistatic wrist strap',part:1},
  frame:{name:'Phone frame (mid-frame & back glass)',part:1},
  board:{name:'Logic board',part:2},
  rearCam:{name:'Rear camera module',part:2},
  camFlex:{name:'Rear camera flex',part:2,locked:true,icon:'flex'},
  frontCam:{name:'Front camera',part:2},
  fcamFlex:{name:'Front camera flex',part:2,locked:true,icon:'flex'},
  portAsm:{name:'USB-C charging port',part:3},
  portFlex:{name:'Charging port flex',part:3,locked:true,icon:'flex'},
  speakers:{name:'Loudspeaker',part:3},
  taptic:{name:'Vibration motor',part:3},
  battAdhesive:{name:'Battery adhesive strips',part:4,icon:'adhesive'},
  battery:{name:'Battery (Li-ion)',part:4},
  display:{name:'Display assembly',part:5},
  dispFlex:{name:'Display flex cable',part:5,locked:true,icon:'flex'},
  touchFlex:{name:'Touch (digitizer) flex',part:5,locked:true,icon:'flex'},
  battPlug:{name:'Battery connector',part:5,locked:true,icon:'battPlug'},
  shield:{name:'Connector shield plate',part:5},
  screwShort:{name:'Shield screw, 1.2 mm',part:5,icon:'screwS'},
  screwLong:{name:'Shield screw, 3.6 mm',part:5,icon:'screwL'},
  gasket:{name:'Display adhesive gasket',part:5,icon:'adhesive'},
  simTray:{name:'SIM tray',part:6,rot:2},
  screwdriver:{name:'Phillips #000 screwdriver',part:0,tool:true},
};
for(const k in ITEMS){ITEMS[k].id=k;ITEMS[k].o=0;ITEMS[k].used=false}

function orientCss(it){return it.rot&&it.o?'transform:scaleX(-1)':''}
function icon(it){
  const W=x=>`<svg viewBox="0 0 80 50" width="80" height="50" style="${orientCss(it)};overflow:visible"><g filter="url(#sh2)">${x}</g></svg>`;
  const t=it.icon||it.id;
  const dev=(w,h,inner)=>`<rect x="${40-w/2}" y="${25-h/2}" width="${w}" height="${h}" rx="${IS_TAB?3:5}" fill="url(#gSteel)" stroke="#2a2f36"/>${inner||''}`;
  switch(t){
    case 'vest':return W(`<path d="M24 4h9l7 7 7-7h9l9 9-7 9v24H22V22l-7-9z" fill="#24499c" stroke="#0f2a5e"/><path d="M40 11v35" stroke="#c9ced5" stroke-width="1.4"/><circle cx="50" cy="22" r="4.5" fill="#ffd54f"/><text x="50" y="24" font-size="4" text-anchor="middle" font-weight="700" fill="#222">ESD</text>`);
    case 'strap':return W(`<path d="${coilPath(40,30,72,28,6,4)}" stroke="#1c1f24" stroke-width="1.6" fill="none"/><ellipse cx="22" cy="25" rx="13" ry="13" fill="none" stroke="#244f9e" stroke-width="6.5"/><rect x="31" y="20" width="9" height="10" rx="2" fill="url(#gChrome)"/><path d="M70 24l8-4v12l-8-4z" fill="#c62828"/>`);
    case 'frame':return W(IS_TAB?dev(64,44,`<rect x="12" y="7" width="56" height="36" rx="1" fill="#1d2025"/><rect x="13" y="8" width="6" height="6" rx="1.5" fill="#0b0c0e"/>`):dev(26,46,`<rect x="29" y="4" width="22" height="42" rx="3" fill="#1d2025"/><rect x="30" y="5" width="7" height="7" rx="2" fill="#0b0c0e"/>`));
    case 'board':return W(IS_TAB?`<rect x="4" y="16" width="72" height="16" rx="1.5" fill="url(#gPcb)"/><rect x="30" y="19" width="12" height="10" fill="#2a2e34"/><rect x="50" y="20" width="8" height="8" fill="url(#gAlu)"/>`:`<path d="M30 4h22v28H40v14H30z" fill="url(#gPcb)" stroke="#0e3220"/><rect x="38" y="9" width="10" height="9" fill="#2a2e34"/><rect x="33" y="22" width="6" height="6" fill="url(#gAlu)"/>`);
    case 'rearCam':return W(`<rect x="24" y="12" width="32" height="26" rx="5" fill="#16191d" stroke="#555"/><circle cx="33" cy="20" r="5.5" fill="#0b1a2c" stroke="#8a929c"/><circle cx="47" cy="20" r="5.5" fill="#0b1a2c" stroke="#8a929c"/><circle cx="33" cy="31" r="5.5" fill="#0b1a2c" stroke="#8a929c"/><circle cx="47" cy="31" r="2.2" fill="#ffd54f"/>`);
    case 'frontCam':return W(`<rect x="20" y="18" width="40" height="14" rx="7" fill="#16191d" stroke="#555"/><circle cx="32" cy="25" r="4" fill="#0b1a2c" stroke="#8a929c"/><circle cx="46" cy="25" r="2" fill="#333"/>`);
    case 'flex':return W(`<path d="M2 22h48v6H2z" fill="#d9a441"/><rect x="50" y="18" width="16" height="14" rx="1.5" fill="#1b1d21"/><rect x="52" y="20" width="12" height="10" fill="url(#gGold)" opacity=".8"/><rect x="66" y="21" width="6" height="8" fill="#2a2e34"/>`);
    case 'portAsm':return W(`<rect x="10" y="20" width="60" height="10" fill="#d9a441"/><rect x="30" y="14" width="20" height="16" rx="3" fill="url(#gAlu)" stroke="#5b636d"/><rect x="34" y="19" width="12" height="6" rx="3" fill="#111"/><circle cx="16" cy="25" r="2.5" fill="url(#gChrome)"/><circle cx="64" cy="25" r="2.5" fill="url(#gChrome)"/>`);
    case 'speakers':return W(IS_TAB?`<rect x="4" y="15" width="28" height="20" rx="3" fill="url(#gBlack)"/><rect x="48" y="15" width="28" height="20" rx="3" fill="url(#gBlack)"/><rect x="8" y="19" width="20" height="12" fill="url(#mesh)"/><rect x="52" y="19" width="20" height="12" fill="url(#mesh)"/>`:`<rect x="18" y="12" width="44" height="26" rx="4" fill="url(#gBlack)"/><rect x="24" y="17" width="32" height="16" rx="2" fill="url(#mesh)"/>`);
    case 'taptic':return W(`<rect x="16" y="16" width="48" height="18" rx="3" fill="url(#gAlu)" stroke="#5b636d"/><path d="M24 25h32" stroke="#7d858f" stroke-width="2" stroke-dasharray="3 2"/>`);
    case 'adhesive':return W(`<rect x="8" y="12" width="64" height="7" rx="2" fill="#f2f2f2" opacity=".9" stroke="#bbb"/><rect x="8" y="27" width="64" height="7" rx="2" fill="#f2f2f2" opacity=".9" stroke="#bbb"/><rect x="66" y="10" width="10" height="11" rx="2" fill="#1e63c9"/><rect x="66" y="25" width="10" height="11" rx="2" fill="#1e63c9"/>`);
    case 'battery':return W(`<rect x="${IS_TAB?4:14}" y="9" width="${IS_TAB?72:52}" height="32" rx="2" fill="#141518" stroke="#000"/>${IS_TAB?'<path d="M40 9v32" stroke="#2c3037" stroke-width="2"/>':''}<rect x="${IS_TAB?10:20}" y="14" width="30" height="13" rx="1" fill="#eceff2"/><text x="${IS_TAB?25:35}" y="23" text-anchor="middle" font-size="6" font-weight="900" fill="#222" font-family="Arial">Li-ion</text><path d="M${IS_TAB?60:52} 18l-3 7h4l-3 7" stroke="#ffca28" stroke-width="1.6" fill="none"/>`);
    case 'battPlug':return W(`<path d="M0 25H44" stroke="#d9a441" stroke-width="7"/><rect x="44" y="17" width="20" height="16" rx="1.5" fill="#1b1d21"/><rect x="47" y="20" width="14" height="10" fill="url(#gGold)" opacity=".8"/>`);
    case 'display':case 'lcd':return W(IS_TAB?`<rect x="8" y="7" width="64" height="36" rx="${t==='lcd'?1:3}" fill="${t==='lcd'?'#c9ced4':'#0b0c0e'}" stroke="#5b636d"/><rect x="11" y="10" width="58" height="30" fill="${t==='lcd'?'#e6eaee':'#141922'}"/>`:`<rect x="27" y="3" width="26" height="44" rx="5" fill="#0b0c0e" stroke="#5b636d"/><rect x="29" y="6" width="22" height="38" rx="3" fill="#141922"/><path d="M53 22h12" stroke="#d9a441" stroke-width="4"/>`);
    case 'shield':return W(`<rect x="18" y="14" width="44" height="22" rx="2" fill="url(#gSteelH)" stroke="#5b636d"/><circle cx="24" cy="20" r="2.2" fill="#2a2e34"/><circle cx="56" cy="30" r="2.2" fill="#2a2e34"/>`);
    case 'screwS':case 'screwL':{const l=t==='screwS'?8:26;return W(`<rect x="22" y="18" width="10" height="14" rx="2" fill="url(#gChrome)"/><path d="M25 25h4M27 23v4" stroke="#333"/><rect x="32" y="22" width="${l}" height="6" fill="url(#gSteelH)"/>${[...Array(Math.floor(l/3))].map((_,k)=>`<path d="M${33+k*3} 22l2 6" stroke="#6b737d"/>`).join('')}<text x="62" y="44" text-anchor="middle" font-size="8" font-weight="700" fill="#ffca28" font-family="Arial">${t==='screwS'?'1.2 mm':'3.6 mm'}</text>`)}
    case 'simTray':return W(`<rect x="8" y="18" width="60" height="14" rx="3" fill="url(#gSteelH)" stroke="#5b636d"/><rect x="26" y="20" width="24" height="10" rx="1" fill="#2a2e34"/><path d="M26 20h5l-5 4z" fill="#ffca28"/><rect x="28" y="22" width="18" height="6" fill="url(#gGold)"/><circle cx="62" cy="25" r="1.6" fill="#333"/>`);
    case 'screwdriver':return W(`<g transform="rotate(-28 40 25)"><rect x="4" y="20" width="30" height="10" rx="4" fill="#1e63c9"/><rect x="34" y="23" width="6" height="4" fill="#1a1a1a"/><rect x="40" y="24" width="32" height="2" fill="url(#gSteelH)"/></g>`);
  }
  return W('');
}
