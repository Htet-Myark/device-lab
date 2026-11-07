'use strict';
/* Device Lab | MIT License | Educational use only. See DISCLAIMER.md */
/* ---------------- step helpers ---------------- */
function setLever(open){
  $('#leverBar').setAttribute('transform',open?'rotate(65 207 134)':'');
  $('#plate').setAttribute('transform',open?'translate(-6,-58) ':'');
  $('#plate').setAttribute('opacity',open?'.45':'1');
}
function unlock(id){ITEMS[id].locked=false}
function ramCheck(id){return z=>{
  if(z.dataset.full) return 'That slot already has a module in it.';
  if(ITEMS[id].o!==0) return 'The notch doesn\'t line up with the key in the slot. Flip the module (click it in the tray). Never force RAM in backwards.';
}}
function ramDone(z){const i=+z.dataset.i;show('ram-'+i);z.dataset.full=1;S.ram.push(i)}
function moveMb(){
  const mb=$('#mb'); mb.style.transform=`translate(${MBX}px,${MBY}px)`; mb.removeAttribute('data-drag');
  $('[data-zone=mbCase]').remove();
}
function placeHdd(i){
  const y=BAY35[i]; S.hddY=y; $$('[data-zone=bay35]').forEach(z=>z.remove());
  $('#caseDyn').insertAdjacentHTML('beforeend',`<g id="hdd"><g filter="url(#sh)"><rect x="484" y="${y+2}" width="122" height="36" rx="2" fill="url(#gAlu)" stroke="#7d858f"/></g>
   <rect x="484" y="${y+2}" width="122" height="36" rx="2" fill="url(#gAlu)" filter="url(#brush)"/>
   <rect x="528" y="${y+6}" width="58" height="28" rx="1.5" fill="#f4f5f7" stroke="#c7ccd2"/>
   <text x="532" y="${y+14}" font-size="5.5" font-weight="700" fill="#222" font-family="Arial">HARD DRIVE 1TB</text>
   <text x="532" y="${y+20}" font-size="3.6" fill="#555" font-family="Arial">SATA 6Gb/s · 7200 RPM</text>
   <g fill="#222">${[...Array(16)].map((_,k)=>`<rect x="${533+k*2.6}" y="${y+24}" width="${k%3?1:1.8}" height="7"/>`).join('')}</g>
   ${[[497,y+8],[497,y+32],[594,y+8],[594,y+32]].map(([x,yy])=>`<circle cx="${x}" cy="${yy}" r="2.4" fill="url(#gChrome)"/>`).join('')}
   <rect x="485" y="${y+5}" width="8" height="14" fill="#0b0b0b"/><rect x="487" y="${y+7}" width="2" height="10" fill="url(#gGold)"/>
   <rect x="485" y="${y+23}" width="8" height="10" fill="#0b0b0b"/><rect x="487" y="${y+25}" width="2" height="6" fill="url(#gGold)"/>
   ${zone('hddPwr',474,y+2,26,18)}${zone('hddData',474,y+21,26,15)}</g>`);
}
function placeOdd(){
  $('[data-zone=bay525]').remove();
  $('#caseDyn').insertAdjacentHTML('beforeend',`<g id="odd"><g filter="url(#sh)"><rect x="474" y="33" width="136" height="44" rx="1.5" fill="url(#gBlack)" stroke="#4a5059"/></g>
   <rect x="474" y="33" width="136" height="44" rx="1.5" fill="url(#gBlack)" filter="url(#brush)"/>
   <text x="500" y="72" font-size="6" fill="#7d8691" font-family="Arial" font-weight="700" letter-spacing="1">DVD-RW</text>
   <rect x="610" y="33" width="19" height="44" fill="#141619" stroke="#3c424a"/><rect x="611" y="44" width="17" height="1.2" fill="#3c424a"/><rect x="615" y="62" width="9" height="4" rx="1" fill="#2a2e34"/><circle cx="626" cy="70" r="1.3" fill="#6f6"/>
   <rect x="475" y="37" width="8" height="15" fill="#0b0b0b"/><rect x="477" y="39" width="2" height="11" fill="url(#gGold)"/>
   <rect x="475" y="58" width="8" height="10" fill="#0b0b0b"/><rect x="477" y="60" width="2" height="6" fill="url(#gGold)"/>
   ${zone('oddPwr',466,34,26,20)}${zone('oddData',466,55,26,16)}</g>`);
}
function cardCheck(id,z){
  const i=+z.dataset.i;
  if(z.dataset.full) return 'That slot is already in use.';
  if(id==='gpu'&&z.dataset.kind!=='x16') return 'The video card needs a full-length PCIe x16 slot.';
  if(id!=='gpu'&&z.dataset.kind==='x16') return {soft:true,msg:'It would fit, but save the x16 slots for the video card. Use a short PCIe x1 slot.'};
  if(S.covers[i]) return 'The slot cover is still in place. Click the matching cover on the back of the case to remove it first.';
}
function installCard(id,i){
  S.slots[i]=id; S.lastSlot=i; $(`[data-zone=slot][data-i="${i}"]`).dataset.full=1;
  const y=SLOTS[i].y; let s=`<g id="card-${id}"><rect x="-36" y="${y-17}" width="7" height="${id==='gpu'?44:34}" fill="url(#gSteelH)" stroke="#6b737d" filter="url(#sh2)"/>`;
  if(id==='gpu') s+=`<g filter="url(#sh)"><path d="M-30 ${y-15}H214L220 ${y-9}V${y+19}L214 ${y+25}H-30Z" fill="url(#gShroud)" stroke="#555d68"/></g>
    <path d="M10 ${y-15}L28 ${y+3}H150L168 ${y-15}" fill="none" stroke="#5c6470" stroke-width="1.2"/><path d="M28 ${y+3}L18 ${y+21}M150 ${y+3}L160 ${y+21}" stroke="#3a4049"/>
    <rect x="34" y="${y+18}" width="110" height="2.2" rx="1" fill="#4fc3f7" opacity=".85"/>
    <text x="89" y="${y-2}" text-anchor="middle" font-size="8" fill="#9aa3ad" font-family="Arial" font-weight="700" letter-spacing="2.5">GRAPHICS</text>
    <rect x="-30" y="${y+21}" width="244" height="4" fill="#1a1d22"/>
    <rect x="199" y="${y-14}" width="16" height="9" rx="1" fill="#0b0b0b" stroke="#555"/>${zone('gpuPwr',192,y-20,30,18)}`;
  if(id==='nic') s+=`<g filter="url(#sh2)"><rect x="-30" y="${y-10}" width="100" height="19" rx="1.5" fill="url(#gPcb)" stroke="#0c2c1c"/></g>
    <rect x="-24" y="${y-7}" width="16" height="13" fill="url(#gSteelH)"/><rect x="2" y="${y-6}" width="13" height="11" fill="#151515"/><rect x="22" y="${y-5}" width="10" height="8" fill="#2a2a2a"/>
    ${[40,48,56].map(x=>`<circle cx="${x}" cy="${y}" r="2.6" fill="url(#gCap)"/>`).join('')}<rect x="8" y="${y+7}" width="50" height="2.6" fill="url(#gGold)"/><text x="62" y="${y-3}" font-size="4.5" fill="#cfe3d6" font-family="Consolas">GbE</text>`;
  if(id==='wifi') s+=`<g filter="url(#sh2)"><rect x="-30" y="${y-10}" width="92" height="19" rx="1.5" fill="url(#gPcbB)" stroke="#0a1426"/></g>
    <rect x="4" y="${y-7}" width="30" height="13" rx="1" fill="url(#gAlu)"/><text x="19" y="${y+1}" text-anchor="middle" font-size="4.5" fill="#555" font-family="Arial" font-weight="700">Wi-Fi</text>
    <path d="M-24 ${y-3}C-10 ${y-8} -4 ${y-2} 4 ${y-3}M-24 ${y+3}C-10 ${y+8} -4 ${y+2} 4 ${y+1}" stroke="#111" stroke-width="1.6" fill="none"/><rect x="6" y="${y+7}" width="40" height="2.6" fill="url(#gGold)"/>`;
  $('#cards').insertAdjacentHTML('beforeend',s+'</g>');
  hide('cover-'+i);
}
function addCable(d,color,w,cls=''){
  const g=$('#cables');
  const p=el('path',{d,stroke:color,'stroke-width':w,fill:'none','stroke-linecap':'round',class:'cab '+cls},g);
  if(w>=6) el('path',{d,stroke:'url(#braid)','stroke-width':w-2,fill:'none','stroke-linecap':'round',opacity:.7},g);
  el('path',{d,stroke:'#ffffff','stroke-opacity':.16,'stroke-width':Math.max(.8,w/5),fill:'none','stroke-linecap':'round',transform:`translate(${-w/5} ${-w/5})`},g);
  return p;
}
function plugRect(x,y,w,h,fill='#111'){
  el('rect',{x,y,width:w,height:h,rx:1.5,fill,stroke:'#000','stroke-opacity':.7},$('#cables'));
  el('rect',{x:x+1,y:y+1,width:Math.max(1,w-2),height:Math.min(2,h/4),rx:.8,fill:'#fff',opacity:.14},$('#cables'));
}
const DRIVE={hddPwr:()=>[489,S.hddY+12],hddData:()=>[489,S.hddY+28],oddPwr:()=>[479,44],oddData:()=>[479,63]};
function sataPortPt(i){return mbPt(316,306+i*16)}

/* ---------------- steps ---------------- */
const fpStep=(item,zn,title,text)=>({p:6,type:'drag',item,zones:[zn],title,text,
  wrongFn:z=>z.startsWith('fp-')?`Those pins are ${FP[z]}. Read the labels printed beside the header.`:null,
  check:ITEMS[item].fp&&ITEMS[item].fp[2]?()=>ITEMS[item].o!==0?'Polarity reversed: the + lead must go on the + pin, or the LED won\'t light. Click the lead in the tray to flip it.':null:null,
  done:()=>fpConnect(zn,ITEMS[item])});
const cardStep=(id,label)=>({p:4,type:'drag',item:id,zones:['slot'],title:`Install the ${label}`,
  text:`Click a <b>slot cover</b> on the back of the case to remove it, then drag the ${label} into a compatible expansion slot. ${id==='gpu'?'A video card needs a <b>PCIe x16</b> slot.':'A <b>PCIe x1</b> slot is enough.'}`,
  check:z=>cardCheck(id,z),done:z=>installCard(id,+z.dataset.i),hintExtra:()=>$$('[id^=cover-]:not(.off)')});
const bracketStep=label=>({p:4,type:'screws',pts:()=>[[30,MBY+SLOTS[S.lastSlot].y-9]],title:`Secure the ${label}`,text:'Screw the card\'s mounting bracket to the case.'});

const STEPS=[
 {p:1,type:'click',targets:['pscrew-0','pscrew-1'],title:'Remove the side panel screws',text:'Click the two thumbscrews on the rear edge of the case to remove them.',onEach:id=>hide(id)},
 {p:1,type:'click',targets:['panel'],title:'Remove the side panel',text:'Click the side panel to slide it off the case.',done:()=>hide('panel')},
 {p:1,type:'drag',item:'psu',zones:['psuBay'],title:'Install the power supply',text:'Drag the power supply into the PSU bay at the top rear of the case, lining its screw holes up with the case.',done:()=>{show('psu');$('[data-zone=psuBay]').remove()}},
 {p:1,type:'screws',pts:[[30,40],[30,70],[30,100],[30,130]],title:'Secure the power supply',text:'Click each screw on the back of the case to fasten the PSU.'},
 {p:1,type:'button',label:'Confirm voltage setting',allowVolt:true,title:'Set the voltage selection switch',
  text:()=>`This lab is in <b>${S.region.name}</b>. Click the red switch on the PSU to toggle between 115 V and 230 V, then confirm.`,
  note:'Many modern PSUs are auto-ranging and have no switch. If yours has one, it must match your local mains voltage.',
  check:()=>S.volt!==S.region.v?`Wrong voltage! ${S.region.name} uses ${S.region.v==='230'?'220–240 V':'100–127 V'} mains. ${S.volt==='115'?'A PSU set to 115 V on 230 V mains can be destroyed.':'A PSU set to 230 V on 115 V mains may not power on.'}`:null,
  hintEls:()=>[$('#volt')]},
 // Part 2
 {p:2,type:'drag',item:'mobo',zones:['matSpot'],title:'Lay out the parts on the antistatic mat',text:'Drag the motherboard onto the antistatic mat. The CPU, cooler and RAM go on here, before the board goes into the case.',done:()=>{show('mb');$('#matSpot').remove()}},
 {p:2,type:'drag',item:'strap',zones:['ground'],title:'Put on the antistatic wrist strap',text:'Drag the wrist strap to the <b>GND</b> snap on the mat. Ground yourself before you touch the CPU or RAM.',done:()=>{show('strapOn');S.grounded=true}},
 {p:2,type:'click',targets:['lever'],title:'Open the CPU socket',text:'Click the load lever beside the socket to release it and lift the load plate.',note:'These are general steps for an LGA socket. Your CPU and motherboard may differ, so always follow the manufacturer\'s instructions.',done:()=>setLever(true)},
 {p:2,type:'drag',item:'cpu',zones:['cpu'],fig:'cpu',title:'Install the CPU (align Pin 1)',text:'Find Pin 1. The <b>gold triangle</b> on the CPU must sit over the socket\'s triangle (bottom-left). Click the CPU in the tray to rotate it, then drop it in.',note:'The CPU can be damaged if it is installed incorrectly. Never force it.',
  check:()=>ITEMS.cpu.o!==0?'Pin 1 is misaligned! Forcing the CPU in would bend the socket pins. Click it in the tray to rotate it.':null,done:()=>show('cpuChip')},
 {p:2,type:'click',targets:['lever'],title:'Close the load plate',text:'Click the lever to lower the load plate and lock the lever under its retention tab.',done:()=>setLever(false)},
 {p:2,type:'drag',item:'paste',zones:['cpu'],title:'Apply thermal compound',text:'Apply a small, pea-sized amount of thermal compound to the centre of the CPU.',note:'Only needed if the heat sink doesn\'t already have compound applied.',done:()=>show('paste')},
 {p:2,type:'drag',item:'cooler',zones:['cpu'],title:'Place the heat sink / fan',text:'Line the cooler\'s retainers up with the four holes around the socket and set it onto the CPU.',done:()=>{show('cooler');hide('lever');unlock('fanplug')}},
 {p:2,type:'click',targets:['ret-0','ret-1','ret-2','ret-3'],title:'Tighten the cooler retainers',text:'Click each of the four retainer pins to lock the cooler down.',onEach:(id,t)=>t.classList.add('locked')},
 {p:2,type:'drag',item:'fanplug',zones:['cpufan'],wrong:{sysfan:'That\'s SYS_FAN. The CPU cooler belongs on CPU_FAN. Many boards won\'t boot or control the fan otherwise. Check the motherboard manual.'},title:'Plug in the CPU fan',text:'Plug the cooler\'s fan cable into the correct fan header. Check the labels printed on the board.',done:z=>{show('fanWire');z.dataset.full=1}},
 {p:2,type:'drag',item:'ram1',zones:['ram'],fig:'ram',title:'Install the RAM',text:'Line up the notch on the module with the key in the slot. Click the module in the tray to flip it, then press it into a slot until the side tabs lock.',check:ramCheck('ram1'),done:ramDone},
 {p:2,type:'drag',item:'ram2',zones:['ram'],fig:'ram',title:'Install the second RAM module',text:'Install the additional module the same way. Tip: matching-colour slots run in dual-channel mode.',check:ramCheck('ram2'),done:ramDone},
 {p:2,type:'screws',kind:'standoff',layer:'caseDyn',pts:HOLES.map(([x,y])=>mbPt(x,y)),title:'Install the motherboard standoffs',text:'Click each marked hole in the case to screw in a brass standoff. Standoffs stop the board shorting against the case.'},
 {p:2,type:'drag',item:'ioshield',zones:['ioCut'],title:'Install the I/O connector plate',text:'Drag the I/O shield into the rectangular opening at the back of the case.',done:()=>{show('ioShield');$('[data-zone=ioCut]').remove()}},
 {p:2,type:'drag',item:'mbAsm',zones:['mbCase'],title:'Place the motherboard in the case',text:'Drag the motherboard from the mat into the case. Its rear ports line up with the I/O shield and its holes with the standoffs.',done:moveMb,hintEls:()=>[$('#mb')]},
 {p:2,type:'screws',pts:HOLES.map(([x,y])=>mbPt(x,y)),title:'Secure the motherboard',text:'Fasten the motherboard to each standoff.'},
 // Part 3
 {p:3,type:'drag',item:'hdd',zones:['bay35'],title:'Install the hard disk drive',text:'Slide the hard drive into a 3.5" bay from inside the case until the screw holes line up.',done:z=>placeHdd(+z.dataset.i)},
 {p:3,type:'screws',pts:()=>[[520,S.hddY+20],[596,S.hddY+20]],title:'Secure the hard disk drive',text:'Fasten the drive to the bay with the drive screws.'},
 {p:3,type:'click',targets:['bayCover'],title:'Remove the 5.25" bay cover',text:'Click the blanking cover on the top 5.25" bay at the front of the case.',done:()=>hide('bayCover')},
 {p:3,type:'drag',item:'odd',zones:['bay525'],title:'Install the optical drive',text:'Insert the optical drive from the front until its face is flush with the case and the screw holes line up.',done:placeOdd},
 {p:3,type:'screws',pts:[[540,55],[596,55]],title:'Secure the optical drive',text:'Fasten the optical drive with the drive screws.'},
 // Part 4
 cardStep('nic','wired NIC'),bracketStep('wired NIC'),
 cardStep('wifi','wireless NIC'),bracketStep('wireless NIC'),
 cardStep('gpu','video adapter card'),bracketStep('video adapter card'),
 // Part 5
 {p:5,type:'drag',item:'atx24',zones:['atx24'],wrong:{eps:'That\'s the 8-pin CPU power socket. The 24-pin main connector goes in the long socket on the right edge of the board.'},title:'Connect the 24-pin motherboard power',text:'Align the main power connector with the 24-pin socket and press until the clip clicks.',
  done:z=>{z.dataset.full=1;const[x,y]=mbPt(324,58);addCable(`M215 128C330 128 ${x} 150 ${x} ${y+4}`,'#25282e',14);plugRect(x-12,y,24,114,'#1b1b1b')}},
 {p:5,type:'drag',item:'eps8',zones:['eps'],wrong:{atx24:'Wrong socket! The 8-pin CPU power connector goes into ATX_12V near the top of the board.'},title:'Connect the auxiliary (CPU) power',text:'Plug the 4/8-pin auxiliary power connector into ATX_12V near the CPU until it clicks.',
  done:z=>{z.dataset.full=1;const[x,y]=mbPt(75,8);addCable(`M110 140C110 150 ${x} 145 ${x} ${y+2}`,'#25282e',9);plugRect(x-17,y,34,18,'#1b1b1b')}},
 ...['satapwrA','satapwrB'].map((id,k)=>({p:5,type:'drag',item:id,zones:['hddPwr','oddPwr'],title:k?'Connect power to the other drive':'Connect power to a drive',text:'Plug a SATA power connector into the hard disk drive and the optical drive (one each). Power is the <b>wider</b> port.',
  wrong:{hddData:'That\'s the narrow 7-pin data port. SATA power is the wider 15-pin connector.',oddData:'That\'s the narrow 7-pin data port. SATA power is the wider 15-pin connector.'},
  check:z=>z.dataset.full?'That drive already has power.':null,
  done:z=>{z.dataset.full=1;const[x,y]=DRIVE[z.dataset.zone]();addCable(z.dataset.zone==='hddPwr'?`M215 140C300 200 420 ${y} ${x} ${y}`:`M228 70C330 70 420 ${y} ${x} ${y}`,'#1a1c20',4.5);plugRect(x-4,y-7,10,14)}})),
 {p:5,type:'drag',item:'pcie',zones:['gpuPwr'],title:'Connect the video card power',text:'Plug the PCIe power connector into the socket on the top edge of the video card.',note:'Only needed if your video card has a PCIe power connector.',
  done:z=>{const y=SLOTS[S.slots.indexOf('gpu')].y;const[x,yy]=mbPt(207,y-13);addCable(`M200 140C285 170 285 ${yy-60} ${x} ${yy}`,'#25282e',8);plugRect(x-8,yy-2,16,9,'#1b1b1b')}},
 ...[['sataA','sataAend',''],['sataB','sataBend',' #2']].flatMap(([a,b,n])=>[
  {p:5,type:'drag',item:a,zones:['sata'],title:`Plug in SATA data cable${n} at the motherboard`,text:'Align the SATA data cable with a free SATA port on the motherboard and push it in. SATA cables are keyed (L-shaped) so they only fit one way.',
   check:z=>z.dataset.full?'That SATA port is already used.':null,
   done:z=>{z.dataset.full=1;S.sata[a]=+z.dataset.i;const[x,y]=sataPortPt(+z.dataset.i);plugRect(x-14,y-5,14,10,'#b71c1c');unlock(b)}},
  {p:5,type:'drag',item:b,zones:['hddData','oddData'],title:`Connect SATA cable${n} to a drive`,text:'Plug the other end of the data cable into a drive\'s narrow, L-shaped data port.',
   wrong:{hddPwr:'That\'s the wide power port. The data cable goes in the narrow L-shaped port.',oddPwr:'That\'s the wide power port. The data cable goes in the narrow L-shaped port.'},
   check:z=>z.dataset.full?'That drive already has a data cable.':null,
   done:z=>{z.dataset.full=1;S.sata[z.dataset.zone==='hddData'?'hdd':'odd']=S.sata[a];const[x0,y0]=sataPortPt(S.sata[a]);const[x,y]=DRIVE[z.dataset.zone]();addCable(`M${x0} ${y0}C${x0+70} ${y0} ${x-60} ${y} ${x} ${y}`,'#c62828',4);plugRect(x-4,y-5,10,10,'#b71c1c')}}]),
 {p:5,type:'button',label:'Verify connections',title:'Verify the connections',text:'Check that every connector is fully seated: 24-pin, CPU power, drive power and data, video card power and the CPU fan.',note:'The fan power step was done in Part 2 when the cooler went on.',done:()=>$$('#cables .cab').forEach(p=>{p.classList.remove('flash');void p.getBBox();p.classList.add('flash')})},
 // Part 6
 fpStep('creset','fp-reset','Connect the reset switch','Press the RESET SW lead onto the RESET pins of the F_PANEL header.'),
 fpStep('cpwr','fp-pwr','Connect the power switch','Press the POWER SW lead onto the PWR_SW pins.'),
 fpStep('cpled','fp-pled','Connect the power LED','Press the POWER LED lead onto the PLED pins. Mind the + / − polarity.'),
 fpStep('chdd','fp-hdd','Connect the HDD LED','Press the HDD LED lead onto the HDD_LED pins. Mind the + / − polarity.'),
 fpStep('cspk','fp-spk','Connect the speaker','Press the speaker lead onto the SPEAKER header.'),
 fpStep('cusb','fp-usb','Connect the front USB','Plug the front USB connector into F_USB. The missing pin keys it.'),
 fpStep('caudio','fp-audio','Connect the front audio','Plug the HD Audio connector into F_AUDIO.'),
 {p:6,type:'button',label:'Verify connections',title:'Verify the front-panel connections',text:'Check every lead is fully seated on the correct pins.',note:'If an LED or switch doesn\'t work at first power-on, remove that connector, turn it around and reconnect it.'},
 // Part 7
 {p:7,type:'click',targets:['panelGhost'],title:'Attach the side panel',text:'Click the outline to put the side panel back on.',done:()=>{hide('panelGhost');show('panel')}},
 {p:7,type:'screws',layer:'screwsTop',pts:[[30,548],[30,596]],title:'Secure the side panel',text:'Fasten the panel screws on the rear edge.'},
 {p:7,type:'drag',item:'monitor',zones:['r-gpu-video'],wrong:{'r-onboard-video':'With a video card installed, plug the monitor into the card. The onboard port is usually disabled.'},title:'Attach the monitor cable',text:'Plug the monitor cable into the video port (see the rear view on the right) and tighten its connector.',done:(z,it)=>{z.dataset.full=1;rearPlug(z,it)}},
 ...['keyboard','mouse'].map(id=>({p:7,type:'drag',item:id,zones:['r-usb','r-ps2'],title:`Attach the ${id}`,text:`Plug the ${id} cable into a free USB (or PS/2) port.`,check:z=>z.dataset.full?'That port is already in use.':null,done:(z,it)=>{z.dataset.full=1;rearPlug(z,it)}})),
 {p:7,type:'drag',item:'ethernet',zones:['r-nic','r-lan'],title:'Attach the Ethernet cable',text:'Plug the network cable into an Ethernet port. The NIC you installed is a good choice.',done:(z,it)=>{z.dataset.full=1;rearPlug(z,it)}},
 {p:7,type:'drag',item:'antenna',zones:['r-wifi'],title:'Attach the wireless antenna',text:'Screw the antenna onto the wireless NIC\'s antenna connectors.',done:(z,it)=>rearPlug(z,it)},
 {p:7,type:'drag',item:'power',zones:['r-psu'],title:'Attach the power cable',text:'Plug the AC power cable into the power socket on the power supply.',done:(z,it)=>rearPlug(z,it)},
 {p:7,type:'click',targets:['r-switch'],title:'Switch on the power supply',text:'Flip the PSU rocker switch on the back to I (on).',done:()=>{$('#rSwTxt').textContent='I';$('#rSwTxt').setAttribute('fill','#66bb6a')}},
 {p:7,type:'click',targets:['pwrBtn'],title:'Power on & verify',text:'Press the power button on the front of the case and watch the POST.',done:()=>{$('#pwrLed').setAttribute('fill','#4fc3f7');$('#hddLed').setAttribute('fill','#ffb300')}},
];
const PARTS=['Install the Power Supply','Install the Motherboard','Install the Drives','Install Adapter Cards','Install Internal Cables','Install Front Panel Cables','Complete the Computer Assembly'];
const PART_START={6:()=>{hide('mat');show('fpInset')},7:()=>{hide('mat');hide('fpInset');buildRear();show('rearInset');show('panelGhost')}};
const val=v=>typeof v==='function'?v():v;
const cur=()=>STEPS[S.i];
const curPart=()=>cur()?cur().p:7;

/* ---------------- screws ---------------- */
function enterStep(){
  const st=cur(); if(!st) return;
  st.clicked=new Set();
  if(st.type==='screws'){
    const g=document.getElementById(st.layer||'screws'); st.targets=[];
    val(st.pts).forEach((p,k)=>{
      const id=`scr${S.i}_${k}`; st.targets.push(id);
      const s=el('g',{class:(st.kind||'screw')+' screw loose','data-click':id,transform:`translate(${p[0]} ${p[1]})`},g);
      el('circle',{r:10,class:'halo'},s);
      if(st.kind==='standoff'){el('circle',{r:5,class:'ring',fill:'none',stroke:'#ffca28','stroke-width':1.5},s);const hx=el('g',{class:'hex',filter:'url(#sh2)'},s);el('path',{d:'M-6 0L-3-5.2H3L6 0 3 5.2H-3Z',fill:'url(#gBrass)',stroke:'#6b4c10'},hx);el('circle',{r:2.3,fill:'#2a1d05'},hx);}
      else{const h=el('g',{class:'head',filter:'url(#sh2)'},s);el('circle',{r:5.5,fill:'url(#gChrome)',stroke:'#4a5059','stroke-width':.8},h);el('path',{d:'M-3 0H3M0-3V3',stroke:'#3a3f46','stroke-width':1.6,'stroke-linecap':'round'},h);}
    });
  }
}

/* ---------------- game flow ---------------- */
function complete(z,it){
  const st=cur();
  st.done&&st.done(z,it);
  if(st.item&&ITEMS[st.item]) ITEMS[st.item].used=true;
  sfx('ok'); toast('✓ '+val(st.title),'good');
  const prevPart=st.p; S.i++;
  if(!cur()) return finish();
  if(cur().p!==prevPart){PART_START[cur().p]&&PART_START[cur().p]();banner(`Part ${cur().p}`,PARTS[cur().p-1])}
  enterStep(); render();
}
function mistake(msg){S.mistakes++;sfx('bad');toast('✗ '+msg,'bad',4200);render()}
function info(msg){sfx('tick');toast(msg,'',2600)}

function handleDrop(id,z){
  if(!z) return;
  const zn=z.dataset.zone, st=cur(), it=ITEMS[id];
  if(['cpu','ram1','ram2'].includes(id)&&!S.grounded) return mistake('⚡ ESD risk! Put on the antistatic wrist strap before handling the CPU or RAM.');
  if(st.type==='drag'&&st.item===id){
    if(st.zones.includes(zn)){
      const r=st.check&&st.check(z);
      if(r){ if(r.soft) return info(r.msg); return mistake(r); }
      return complete(z,it);
    }
    const w=(st.wrong&&st.wrong[zn])||(st.wrongFn&&st.wrongFn(zn));
    return w?mistake(w):info(`That's not where the ${it.name.toLowerCase()} goes.`);
  }
  const fut=STEPS.find((s,k)=>k>S.i&&s.item===id);
  if(fut&&fut.zones.includes(zn)){
    if(id==='cooler'&&st.item==='paste') return mistake('Apply thermal compound before mounting the cooler, or the CPU will overheat.');
    return mistake(`Out of order! The lab procedure says to do this first: “${val(st.title)}”.`);
  }
  info(`That's not where the ${it.name.toLowerCase()} goes.`);
}

function handleClick(id,t){
  const st=cur();
  if(st&&st.allowVolt&&id==='volt'){S.volt=S.volt==='115'?'230':'115';$('#voltTxt').textContent=S.volt+'V';sfx('tick');return}
  if(id.startsWith('cover-')&&curPart()===4){
    const i=+id.split('-')[1];
    if(S.covers[i]){S.covers[i]=false;hide(id);sfx('tick');toast(`Slot cover removed (${SLOTS[i].kind==='x16'?'PCIe x16':'PCIe x1'} slot)`,'',1800);render()}
    return;
  }
  if(st&&(st.type==='click'||st.type==='screws')&&st.targets.includes(id)){
    if(st.clicked.has(id)) return;
    st.clicked.add(id);
    if(st.type==='screws'){t.classList.remove('loose');t.classList.add('tight');sfx('tick')}
    st.onEach&&st.onEach(id,t);
    if(st.clicked.size===st.targets.length) return setTimeout(()=>complete(),st.type==='screws'?250:0);
    if(st.onEach) sfx('tick');
    render(); return;
  }
  if(id.startsWith('scr')||id.startsWith('ret-')) return;
  info(`Not now. Current step: “${val(st.title)}”.`);
}
