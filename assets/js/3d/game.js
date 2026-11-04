'use strict';
/* PC Lab Assembly | MIT License | Educational use only. See DISCLAIMER.md */
/* =================== CAMERA VIEWS =================== */
const VIEWS={
  overview:()=>[V3(42,62,112),V3(42,20,0)],
  tech:()=>[V3(30,72,92),V3(60,46,-40)],
  caseFront:()=>[V3(52,42,84),V3(22,22,3)],
  rear:()=>[V3(-66,28,38),V3(2,24,8)],
  psuRear:()=>[V3(-26,44,18),V3(1.5,39.5,7)],
  mat:()=>[V3(68,46,52),V3(68,0,12)],
  socket:()=>{const t=mbMatW(160,92,1);return [t.clone().add(V3(0,30,15)),t]},
  board:()=>{const t=mbMatW(170,160,0);return [t.clone().add(V3(0,34,22)),t]},
  tray:()=>[V3(34,30,52),V3(17,20,0)],
  ioIn:()=>[V3(24,34,40),V3(3,29,3)],
  drives:()=>[V3(50,40,56),V3(38,30,8)],
  front:()=>[V3(82,32,44),V3(46,32,9)],
  cards:()=>[V3(38,28,50),V3(9,18,5)],
  cables:()=>[V3(46,40,62),V3(22,24,4)],
  header:()=>{const t=mbCaseW(175,392,.5);return [t.clone().add(V3(2,6,24)),t]},
};
let curView='overview';
function goView(name,dur=900){
  if(!VIEWS[name]) return; curView=name;
  const [p,t]=VIEWS[name](); const p0=camera.position.clone(),t0=controls.target.clone();
  tween(dur,k=>{camera.position.lerpVectors(p0,p,k);controls.target.lerpVectors(t0,t,k)},null,'cam');
}

/* =================== GAME STATE / STEPS =================== */
const S={mode:'practice',i:0,mistakes:0,hints:0,t0:0,timer:null,grounded:false,volt:'115',region:null,
  ram:[],slots:[null,null,null,null],covers:[true,true,true,true],lastSlot:0,hddY:0,sata:{},muted:false,done:false,powered:false};
const PARTS=['Install the Power Supply','Install the Motherboard','Install the Drives','Install Adapter Cards','Install Internal Cables','Install Front Panel Cables','Complete the Computer Assembly'];
const PART_VIEW={1:'caseFront',2:'mat',3:'drives',4:'cards',5:'cables',6:'header',7:'rear'};
const FP={'fp-hdd':'HDD LED','fp-reset':'RESET SW','fp-pled':'POWER LED','fp-pwr':'POWER SW','fp-spk':'SPEAKER','fp-usb':'F_USB','fp-audio':'F_AUDIO'};
const val=v=>typeof v==='function'?v():v;
const cur=()=>STEPS[S.i];
const curPart=()=>cur()?cur().p:7;
function unlock(id){ITEMS[id].locked=false}

function setLever(open){const lp=OBJ.leverPivot,pp=OBJ.platePivot;tweenTo(lp,{rotX:open?1.9:0,dur:450});tweenTo(pp,{rotY:open?-1.75:0,dur:600})}
function ramCheck(id){return z=>{if(z.dataset.full)return 'That slot already has a module in it.';if(ITEMS[id].o!==0)return 'The notch doesn\'t line up with the key in the slot. Flip the module (click it in the tray). Never force RAM in backwards.'}}
function ramDone(z){const i=+z.dataset.i;z.dataset.full='1';S.ram.push(i);dropIn(OBJ['ram-'+i],V3(0,0,4));}
function moveMb(){
  const g=mbG;delete g.userData.drag;zone1('mbCase')&&zone1('mbCase').remove();
  const p0=g.position.clone(),r0=g.rotation.x;
  tween(1400,k=>{const e=ease(k);g.position.lerpVectors(p0,MB_CASE,e);g.position.y+=Math.sin(Math.PI*e)*16;g.rotation.x=r0*(1-e)});
}
function cardCheck(id,z){
  const i=+z.dataset.i;
  if(z.dataset.full) return 'That slot is already in use.';
  if(id==='gpu'&&z.dataset.kind!=='x16') return 'The video card needs a full-length PCIe x16 slot.';
  if(id!=='gpu'&&z.dataset.kind==='x16') return {soft:true,msg:'It would fit, but save the x16 slots for the video card. Use a short PCIe x1 slot.'};
  if(S.covers[i]) return 'The slot cover is still in place. Click the matching cover on the back of the case to remove it first.';
}
const PSU_OUT=(y,z)=>V3(15.6,y,z);
function fpConnect(zn,it){
  const z=zone1(zn).world();const col=it.fp?it.fp[1]:(it.hdr[0]==='USB'?'#1e63c9':'#d0d0d0');const wire=std({color:new THREE.Color(col==='#f4f4f4'?'#e0e0e0':col),roughness:.45});
  const sz={'fp-usb':[2.7,1.2,.9],'fp-audio':[2.7,1.2,.9],'fp-spk':[2,.7,.9]}[zn]||[1.1,.55,.9];
  const p=plug([z.x,z.y,z.z+.15],sz,it.hdr&&it.hdr[0]==='USB'?MAT.blue:MAT.black);
  p.position.z+=1.5;tweenTo(p,{pos:V3(z.x,z.y,z.z+.15),dur:350});
  const k=CABLES.filter(c=>c.userData.fp).length;
  const c=addCable([[45.6,3+k*.5,6+k*.6],[40,2.5+k*.4,7],[z.x+3,z.y-1.2,z.z+3],[z.x,z.y,z.z+.6]],.07,wire);c.userData.fp=1;
}
function rearPlug(z,it){
  const p=z.world();
  if(it.id==='antenna'){[[-.0,-.5],[0,.5]].forEach(([dy,tilt],k)=>{const a=new THREE.Group();scene.add(a);a.position.set(p.x-.4,p.y,p.z+(k?1.7:-1.7));a.rotation.x=tilt*.6;
      const st=cyl(.35,.6,MAT.gold,a,'x');const rod=cyl(.45,9,MAT.black,a,'y',16);rod.position.set(-.5,4.6,0);CABLES.push(rod)});return}
  const spec={monitor:[1.6,.9,1.9,.22,MAT.cable],keyboard:[1.6,.7,1.45,.16,MAT.cable],mouse:[1.6,.7,1.45,.14,MAT.cable],ethernet:[2,1.3,1.6,.18,std({color:0x2f80ed,roughness:.4})],power:[2.6,2.7,3,.32,MAT.cable]}[it.id];
  const [len,h,w,r,m]=spec;
  const body=plug([p.x-len/2-.1,p.y,p.z],[len,h,w],it.id==='ethernet'?std({color:0x8ec5ff,transparent:true,opacity:.85,roughness:.2}):MAT.black);
  addCable([[p.x-len,p.y,p.z],[p.x-len-3,p.y-1,p.z],[p.x-9,Math.max(1,p.y-12),p.z+3],[p.x-16,.4,p.z+6+rnd(-3,3)],[p.x-34,.4,p.z+8+rnd(-6,6)]],r,m);
}

const fpStep=(item,zn,title,text)=>({p:6,type:'drag',item,zones:[zn],title,text,view:'header',
  wrongFn:z=>z.startsWith('fp-')?`Those pins are ${FP[z]}. Read the labels printed beside the header.`:null,
  check:ITEMS[item].fp&&ITEMS[item].fp[2]?()=>ITEMS[item].o!==0?'Polarity reversed: the + lead must go on the + pin, or the LED won\'t light. Click the lead in the tray to flip it.':null:null,
  done:()=>fpConnect(zn,ITEMS[item])});
const cardStep=(id,label)=>({p:4,type:'drag',item:id,zones:['slot'],view:'cards',title:`Install the ${label}`,
  text:`Click a <b>slot cover</b> on the inside of the rear wall to remove it, then drag the ${label} into a compatible expansion slot. ${id==='gpu'?'A video card needs a <b>PCIe x16</b> slot.':'A <b>PCIe x1</b> slot is enough.'}`,
  check:z=>cardCheck(id,z),done:z=>installCard(id,+z.dataset.i),hintExtra:()=>[0,1,2,3].filter(i=>S.covers[i]).map(i=>OBJ['cover-'+i])});
const bracketStep=label=>({p:4,type:'screws',view:'cards',pts:()=>[[V3(2.06,35.55-SLOTS[S.lastSlot].y*K,13.3),'z']],title:`Secure the ${label}`,text:'Screw the card\'s mounting bracket to the case.'});

const STEPS=[
 {p:1,type:'click',needsDriver:true,view:'rear',targets:['pscrew-0','pscrew-1'],title:'Remove the side panel screws',text:'Pick up the <b>screwdriver</b> (tap it in the Tools tray or on the desk), then click the two screws on the back edge of the case to unscrew them.',onEach:id=>{const o=OBJ[id];driveAnim(o.position.clone().add(V3(-.6,0,0)),new THREE.Quaternion().setFromUnitVectors(V3(0,0,1),V3(-1,0,0)),-2.5);tweenTo(o,{pos:o.position.clone().add(V3(-3,0,0)),dur:400,done:()=>o.visible=false})}},
 {p:1,type:'click',view:'caseFront',targets:['panel'],title:'Remove the side panel',text:'Click the glass side panel to slide it off the case.',done:()=>{const p=OBJ.panelG;tweenTo(p,{pos:V3(-6,0,18),dur:700,done:()=>p.visible=false})}},
 {p:1,type:'drag',item:'psu',zones:['psuBay'],view:'caseFront',title:'Install the power supply',text:'Drag the power supply into the PSU bay at the top rear of the case, lining its screw holes up with the case.',done:z=>{z.remove();dropIn(OBJ.psu,V3(0,0,14),700)}},
 {p:1,type:'screws',view:'rear',pts:[[V3(1.25,37.1,1.1),'-x'],[V3(1.25,43.9,1.1),'-x'],[V3(1.25,37.1,14.9),'-x'],[V3(1.25,43.9,14.9),'-x']],title:'Secure the power supply',text:'Click each screw on the back of the case to fasten the PSU.'},
 {p:1,type:'button',view:'psuRear',label:'Confirm voltage setting',allowVolt:true,title:'Set the voltage selection switch',
  text:()=>`This lab is in <b>${S.region.name}</b>. Click the red slider on the back of the PSU to toggle between 115 V and 230 V, then confirm.`,
  note:'Many modern PSUs are auto-ranging and have no switch. If yours has one, it must match your local mains voltage.',
  check:()=>S.volt!==S.region.v?`Wrong voltage! ${S.region.name} uses ${S.region.v==='230'?'220–240 V':'100–127 V'} mains. ${S.volt==='115'?'A PSU set to 115 V on 230 V mains can be destroyed.':'A PSU set to 230 V on 115 V mains may not power on.'}`:null,
  hintEls:()=>[OBJ.volt]},
 {p:2,type:'drag',item:'mobo',zones:['matSpot'],view:'mat',title:'Lay out the parts on the antistatic mat',text:'Drag the motherboard onto the antistatic mat. The CPU, cooler and RAM go on here, before the board goes into the case.',done:z=>{z.remove();dropIn(mbG,V3(0,8,0),700)}},
 {p:2,type:'drag',item:'vest',zones:['tech'],view:'tech',title:'Put on the ESD vest',text:'Drag the ESD vest onto the technician. It keeps static from clothing away from the components.',note:'An ESD smock or vest is standard practice in electronics labs, but it isn\'t one of the numbered lab steps.',done:wearVest,hintEls:()=>[OBJ.vestHook]},
 {p:2,type:'drag',item:'strap',zones:['ground'],view:'mat',title:'Put on the antistatic wrist strap',text:'Drag the wrist strap to the <b>GND</b> snap on the corner of the mat. The band goes on the technician\'s wrist. Ground yourself before you touch the CPU or RAM.',done:()=>{S.grounded=true}},
 {p:2,type:'click',view:'socket',targets:['lever'],title:'Open the CPU socket',text:'Click the load lever beside the socket to release it and lift the load plate.',note:'These are general steps for an LGA socket. Your CPU and motherboard may differ, so always follow the manufacturer\'s instructions.',done:()=>setLever(true)},
 {p:2,type:'drag',item:'cpu',zones:['cpu'],view:'socket',fig:'cpu',title:'Install the CPU (align Pin 1)',text:'Find Pin 1. The <b>gold triangle</b> on the CPU must sit over the socket\'s gold triangle. Click the CPU in the tray to rotate it, then drop it in.',note:'The CPU can be damaged if it is installed incorrectly. Never force it.',
  check:()=>ITEMS.cpu.o!==0?'Pin 1 is misaligned! Forcing the CPU in would bend the socket pins. Click it in the tray to rotate it.':null,done:()=>dropIn(OBJ.cpuChip,V3(0,0,3))},
 {p:2,type:'click',view:'socket',targets:['lever'],title:'Close the load plate',text:'Click the lever to lower the load plate and lock the lever under its retention tab.',done:()=>setLever(false)},
 {p:2,type:'drag',item:'paste',zones:['cpu'],view:'socket',title:'Apply thermal compound',text:'Apply a small, pea-sized amount of thermal compound to the centre of the CPU.',note:'Only needed if the heat sink doesn\'t already have compound applied.',done:()=>dropIn(OBJ.paste,V3(0,0,2),300)},
 {p:2,type:'drag',item:'cooler',zones:['cpu'],view:'socket',title:'Place the heat sink / fan',text:'Line the cooler\'s four push-pins up with the holes around the socket and set it onto the CPU.',done:()=>{dropIn(OBJ.cooler,V3(0,0,7),800);unlock('fanplug')}},
 {p:2,type:'click',view:'socket',targets:['ret-0','ret-1','ret-2','ret-3'],title:'Lock the cooler push-pins',text:'Click each of the four push-pins to press it down and lock the cooler. Work diagonally.',onEach:(id)=>{const o=OBJ[id];tweenTo(o,{pos:o.position.clone().add(V3(0,0,-.45)),dur:200});OBJ['retTop'+id.slice(-1)].material.color.set(0x5f6670)}},
 {p:2,type:'drag',item:'fanplug',zones:['cpufan'],view:'socket',wrong:{sysfan:'That\'s SYS_FAN. The CPU cooler belongs on CPU_FAN. Many boards won\'t boot or control the fan otherwise. Check the motherboard manual.'},title:'Plug in the CPU fan',text:'Plug the cooler\'s fan cable into the correct fan header. Read the labels printed on the board.',done:z=>{show('fanWire');z.dataset.full='1'}},
 {p:2,type:'drag',item:'ram1',zones:['ram'],view:'board',fig:'ram',title:'Install the RAM',text:'Line up the notch on the module with the key in the slot. Click the module in the tray to flip it, then press it into a slot until the latches close.',check:ramCheck('ram1'),done:ramDone},
 {p:2,type:'drag',item:'ram2',zones:['ram'],view:'board',fig:'ram',title:'Install the second RAM module',text:'Install the additional module the same way. Tip: matching-colour slots run in dual-channel mode.',check:ramCheck('ram2'),done:ramDone},
 {p:2,type:'screws',kind:'standoff',view:'tray',pts:()=>HOLES.map(([x,y])=>[V3(4.5+x*K,35.55-y*K,0.02),'z']),title:'Install the motherboard standoffs',text:'Click each marked hole on the motherboard tray to screw in a brass standoff. Standoffs stop the board shorting against the case.'},
 {p:2,type:'drag',item:'ioshield',zones:['ioCut'],view:'ioIn',title:'Install the I/O connector plate',text:'Drag the I/O shield into the rectangular opening in the back of the case.',done:z=>{z.remove();dropIn(OBJ.ioShield,V3(3,0,0),400)}},
 {p:2,type:'drag',item:'mbAsm',zones:['mbCase'],view:'overview',title:'Place the motherboard in the case',text:'Drag the motherboard from the mat into the case (grab it anywhere on the board). Its rear ports slide into the I/O shield and its holes line up with the standoffs.',done:moveMb,hintEls:()=>[mbG]},
 {p:2,type:'screws',view:'caseFront',pts:()=>HOLES.map(([x,y])=>[V3(4.5+x*K,35.55-y*K,0.7+T),'z']),title:'Secure the motherboard',text:'Fasten the motherboard to each standoff.'},
 {p:3,type:'drag',item:'hdd',zones:['bay35'],view:'drives',title:'Install the hard disk drive',text:'Slide the hard drive into a 3.5" drive bay until its screw holes line up.',done:z=>placeHdd(+z.dataset.i)},
 {p:3,type:'screws',view:'drives',pts:()=>[[V3(35.5,S.hddY+1.5,13.85),'z'],[V3(43.5,S.hddY+1.5,13.85),'z']],title:'Secure the hard disk drive',text:'Fasten the drive to the cage with the drive screws.'},
 {p:3,type:'click',view:'front',targets:['bayCover'],title:'Remove the 5.25" bay cover',text:'Click the blanking cover on the top 5.25" bay at the front of the case.',done:()=>{const o=OBJ.bayCover;tweenTo(o,{pos:V3(6,2,4),dur:500,done:()=>o.visible=false})}},
 {p:3,type:'drag',item:'odd',zones:['bay525'],view:'front',title:'Install the optical drive',text:'Insert the optical drive from the front until its face is flush with the case and the screw holes line up.',done:placeOdd},
 {p:3,type:'screws',view:'drives',pts:[[V3(35.5,42.5,18.25),'z'],[V3(43.5,42.5,18.25),'z']],title:'Secure the optical drive',text:'Fasten the optical drive with the drive screws.'},
 cardStep('nic','wired NIC'),bracketStep('wired NIC'),
 cardStep('wifi','wireless NIC'),bracketStep('wireless NIC'),
 cardStep('gpu','video adapter card'),bracketStep('video adapter card'),
 {p:5,type:'drag',item:'atx24',zones:['atx24'],view:'cables',wrong:{eps:'That\'s the 8-pin CPU power socket. The 24-pin main connector goes in the long socket on the right edge of the board.'},title:'Connect the 24-pin motherboard power',text:'Align the main power connector with the 24-pin socket and press until the clip clicks.',
  done:z=>{z.dataset.full='1';const c=z.world();plug([c.x,c.y,c.z+.9],[1.9,8.7,1.4]);addCable([PSU_OUT(37.6,9),V3(20,36.7,4.5),V3(27.5,36.3,2.2),V3(31.2,33,1.3),V3(31.4,29,1.6),V3(c.x+1.8,c.y,c.z+2.4),V3(c.x+.3,c.y,c.z+2.3)],.75,MAT.braid)}},
 {p:5,type:'drag',item:'eps8',zones:['eps'],view:'cables',wrong:{atx24:'Wrong socket! The 8-pin CPU power connector goes into ATX_12V near the top of the board.'},title:'Connect the auxiliary (CPU) power',text:'Plug the 4/8-pin auxiliary power connector into ATX_12V near the CPU until it clicks.',
  done:z=>{z.dataset.full='1';const c=z.world();plug([c.x,c.y,c.z+.9],[2.7,1.5,1.3]);addCable([V3(9,36.3,9),V3(c.x-.5,c.y+.6,c.z+5),V3(c.x,c.y,c.z+1.5)],.4,MAT.braid)}},
 ...['satapwrA','satapwrB'].map((id,k)=>({p:5,type:'drag',item:id,zones:['hddPwr','oddPwr'],view:'drives',title:k?'Connect power to the other drive':'Connect power to a drive',text:'Plug a SATA power connector into the hard disk drive and the optical drive (one each). Power is the <b>wider</b> port.',
  wrong:{hddData:'That\'s the narrow 7-pin data port. SATA power is the wider 15-pin connector.',oddData:'That\'s the narrow 7-pin data port. SATA power is the wider 15-pin connector.'},
  check:z=>z.dataset.full?'That drive already has power.':null,
  done:z=>{z.dataset.full='1';const c=z.world();plug([c.x-.3,c.y,c.z],[.7,1.1,3.4]);const hdd=z.dataset.zone==='hddPwr';
    addCable(hdd?[PSU_OUT(37.2,5),V3(20,36.6,2.6),V3(31.2,31,1.2),V3(31.4,25.5,1.6),V3(32,c.y+.5,3.5),V3(c.x-1.4,c.y,c.z)]:[PSU_OUT(43.5,5),V3(22,44.5,5.5),V3(29.5,42.6,5.5),V3(c.x-1.4,c.y,c.z)],.22,MAT.cable)}})),
 {p:5,type:'drag',item:'pcie',zones:['gpuPwr'],view:'cables',title:'Connect the video card power',text:'Plug the PCIe power connector into the socket on the top edge of the video card.',note:'Only needed if your video card has a PCIe power connector.',
  done:z=>{const c=z.world();plug([c.x,c.y+.6,c.z],[1.7,1.0,1.1]);addCable([PSU_OUT(37,13),V3(21,36.6,3.2),V3(31.2,26,1.3),V3(31.3,18,2.5),V3(c.x+3,c.y+3.5,c.z+.5),V3(c.x,c.y+1.2,c.z)],.35,MAT.braid)}},
 ...[['sataA','sataAend',''],['sataB','sataBend',' #2']].flatMap(([a,b,n])=>[
  {p:5,type:'drag',item:a,zones:['sata'],view:'cables',title:`Plug in SATA data cable${n} at the motherboard`,text:'Align the SATA data cable with a free SATA port on the motherboard and push it in. SATA cables are keyed (L-shaped) so they only fit one way.',
   check:z=>z.dataset.full?'That SATA port is already used.':null,
   done:z=>{z.dataset.full='1';S.sata[a]=+z.dataset.i;const c=z.world();S.sata[a+'pt']=c;plug([c.x+.9,c.y,c.z],[1,1.0,.6],MAT.sata);unlock(b)}},
  {p:5,type:'drag',item:b,zones:['hddData','oddData'],view:'cables',title:`Connect SATA cable${n} to a drive`,text:'Plug the other end of the data cable into a drive\'s narrow, L-shaped data port.',
   wrong:{hddPwr:'That\'s the wide power port. The data cable goes in the narrow L-shaped port.',oddPwr:'That\'s the wide power port. The data cable goes in the narrow L-shaped port.'},
   check:z=>z.dataset.full?'That drive already has a data cable.':null,
   done:z=>{z.dataset.full='1';S.sata[z.dataset.zone==='hddData'?'hdd':'odd']=S.sata[a];const c=z.world(),s=S.sata[a+'pt'];plug([c.x-.3,c.y,c.z],[.7,1,1.3],MAT.sata);
     addCable([V3(s.x+1.4,s.y,s.z),V3(s.x+3,s.y+.5,s.z+3),V3(c.x-3,c.y-2,c.z+3),V3(c.x-.7,c.y,c.z)],.16,MAT.sata)}}]),
 {p:5,type:'button',view:'cables',label:'Verify connections',title:'Verify the connections',text:'Check that every connector is fully seated: 24-pin, CPU power, drive power and data, video card power and the CPU fan.',note:'The fan power step was done in Part 2 when the cooler went on.',done:()=>{FLASH.until=performance.now()+1500}},
 fpStep('creset','fp-reset','Connect the reset switch','Press the RESET SW lead onto the RST pins of the F_PANEL header.'),
 fpStep('cpwr','fp-pwr','Connect the power switch','Press the POWER SW lead onto the PWR pins.'),
 fpStep('cpled','fp-pled','Connect the power LED','Press the POWER LED lead onto the PLED pins. Mind the + / − polarity.'),
 fpStep('chdd','fp-hdd','Connect the HDD LED','Press the HDD LED lead onto the HDD pins. Mind the + / − polarity.'),
 fpStep('cspk','fp-spk','Connect the speaker','Press the speaker lead onto the SPK header.'),
 fpStep('cusb','fp-usb','Connect the front USB','Plug the front USB connector into F_USB. The missing pin keys it.'),
 fpStep('caudio','fp-audio','Connect the front audio','Plug the HD Audio connector into F_AUDIO.'),
 {p:6,type:'button',view:'header',label:'Verify connections',title:'Verify the front-panel connections',text:'Check every lead is fully seated on the correct pins.',note:'If an LED or switch doesn\'t work at first power-on, remove that connector, turn it around and reconnect it.'},
 {p:7,type:'click',view:'caseFront',targets:['panelGhost'],title:'Attach the side panel',text:'Click the outline to put the glass side panel back on.',done:()=>{hide('panelGhost');const p=OBJ.panelG;p.visible=true;tweenTo(p,{pos:V3(0,0,0),dur:700})}},
 {p:7,type:'screws',view:'rear',pts:[[V3(1.15,4,19.6),'-x','thumb'],[V3(1.15,42,19.6),'-x','thumb']],title:'Secure the side panel',text:'Fasten the two thumbscrews on the back edge.'},
 {p:7,type:'drag',item:'monitor',zones:['r-gpu-video'],view:'rear',wrong:{'r-onboard-video':'With a video card installed, plug the monitor into the card. The onboard port is usually disabled.'},title:'Attach the monitor cable',text:'Plug the monitor cable into the video port and tighten its connector.',done:(z,it)=>{z.dataset.full='1';rearPlug(z,it)}},
 ...['keyboard','mouse'].map(id=>({p:7,type:'drag',item:id,zones:['r-usb','r-ps2'],view:'rear',title:`Attach the ${id}`,text:`Plug the ${id} cable into a free USB (or PS/2) port.`,check:z=>z.dataset.full?'That port is already in use.':null,done:(z,it)=>{z.dataset.full='1';rearPlug(z,it)}})),
 {p:7,type:'drag',item:'ethernet',zones:['r-nic','r-lan'],view:'rear',title:'Attach the Ethernet cable',text:'Plug the network cable into an Ethernet port. The NIC you installed is a good choice.',done:(z,it)=>{z.dataset.full='1';rearPlug(z,it)}},
 {p:7,type:'drag',item:'antenna',zones:['r-wifi'],view:'rear',title:'Attach the wireless antenna',text:'Screw the antennas onto the wireless NIC\'s connectors.',done:(z,it)=>rearPlug(z,it)},
 {p:7,type:'drag',item:'power',zones:['r-psu'],view:'rear',title:'Attach the power cable',text:'Plug the AC power cable into the power socket on the power supply.',done:(z,it)=>rearPlug(z,it)},
 {p:7,type:'click',view:'psuRear',targets:['r-switch'],title:'Switch on the power supply',text:'Flip the PSU rocker switch on the back to I (on).',done:()=>{OBJ.rocker.rotation.z=.18}},
 {p:7,type:'click',view:'front',targets:['pwrBtn'],title:'Power on & verify',text:'Press the power button on the front of the case and watch the POST.',done:powerOn},
];
const PART_START={7:()=>{show('panelGhost');rearLabels()}};
let LABELS=[];
function rearLabels(){
  const add=(t,z,dy=0,w)=>{if(!z)return;const p=z.world();LABELS.push(label(t,V3(p.x-1.8,p.y+.2+dy,p.z+(w||0)),2.4))};
  add('PS/2',zone1('r-ps2'),.6,-2.4);add('USB ×4',zone1('r-usb',1),.2,-3);
  add('HDMI (onboard)',zone1('r-onboard-video'),0,-3.6);add('LAN (onboard)',zone1('r-lan'),0,-3.6);
  add('NIC',zone1('r-nic'),0,-2.6);add('Wi-Fi',zone1('r-wifi'),0,-4.4);add('Video card',zone1('r-gpu-video'),0,-3.4);
}
function powerOn(){
  S.powered=true;LABELS.forEach(l=>l.visible=false);
  OBJ.pwrLed.material.color.set(0x4fc3f7);OBJ.pwrLed.material.emissive.set(0x4fc3f7);OBJ.pwrLed.material.emissiveIntensity=3;
  OBJ.hddLed.material.emissive.set(0xffa000);
}
const FLASH={until:0};

/* =================== SCREWS FOR STEPS =================== */
function enterStep(){
  const st=cur(); if(!st) return;
  st.clicked=new Set();
  if(st.type==='screws'){
    st.targets=[];st.objs=[];
    val(st.pts).forEach((p,k)=>{const id=`scr${S.i}_${k}`;st.targets.push(id);st.objs.push(makeScrew(p[0],p[1],p[2]||st.kind||'screw',id))});
  }
  goView(st.view||PART_VIEW[st.p]);
}

/* =================== FLOW =================== */
function complete(z,it){
  const st=cur();
  if(z&&z.world) reachTo(z.world());
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
  if(!z) return; flushTweens();
  const zn=z.dataset.zone, st=cur(), it=ITEMS[id];
  if(['cpu','ram1','ram2'].includes(id)&&!S.grounded) return mistake('⚡ ESD risk! Put on the antistatic wrist strap before handling the CPU or RAM.');
  if(st.type==='drag'&&st.item===id){
    if(st.zones.includes(zn)){const r=st.check&&st.check(z);if(r){if(r.soft)return info(r.msg);return mistake(r)}return complete(z,it)}
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
function handleClick(id,o){
  flushTweens(); const st=cur();
  if(id==='tool-sd') return toggleDriver();
  if(needsDriver(st)&&st.targets.includes(id)&&!st.clicked.has(id)&&S.tool!=='screwdriver'){sfx('bad');return toast('🪛 You need the screwdriver for this. Tap it in the Tools tray (or on the desk) first.','bad',3000)}
  if(st&&st.allowVolt&&id==='volt'){S.volt=S.volt==='115'?'230':'115';setVoltVisual();sfx('tick');return}
  if(id.startsWith('cover-')&&curPart()===4){
    const i=+id.split('-')[1];
    if(S.covers[i]){S.covers[i]=false;const c=OBJ[id];tweenTo(c,{pos:V3(8,0,6),dur:500,done:()=>c.visible=false});sfx('tick');toast(`Slot cover removed (${SLOTS[i].kind==='x16'?'PCIe x16':'PCIe x1'} slot)`,'',1800);render()}
    return;
  }
  if(st&&(st.type==='click'||st.type==='screws')&&st.targets.includes(id)){
    if(st.clicked.has(id)) return;
    st.clicked.add(id);
    if(st.type==='screws'){tightenScrew(o);sfx('tick')}
    if(st.type!=='screws'&&!st.needsDriver) reachTo(new THREE.Box3().setFromObject(o).getCenter(V3(0,0,0)));
    st.onEach&&st.onEach(id,o);
    if(st.clicked.size===st.targets.length) return setTimeout(()=>complete(),st.type==='screws'?380:0);
    if(st.onEach) sfx('tick');
    render(); return;
  }
  if(id.startsWith('scr')||id.startsWith('ret-')) return;
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
  window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp,{once:true});
}
function setOver(z){if(overZone===z)return;overZone=z;applyHints()}
function onMove(e){
  if(!D) return;
  if(!D.moved){if(Math.hypot(e.clientX-D.x0,e.clientY-D.y0)<6)return;D.moved=true;const it=ITEMS[D.id];
    D.ghost=document.createElement('div');D.ghost.className='ghost';D.ghost.innerHTML=icon(it)+`<span>${it.name}</span>`;document.body.appendChild(D.ghost);sfx('tick')}
  D.ghost.style.left=e.clientX+'px';D.ghost.style.top=e.clientY+'px';
  setOver(zoneAt(e.clientX,e.clientY));
}
function onUp(e){
  window.removeEventListener('pointermove',onMove);const d=D;D=null;controls.enabled=true;if(!d)return;setOver(null);
  if(d.moved){d.ghost.remove();handleDrop(d.id,zoneAt(e.clientX,e.clientY))}
  else if(d.src==='tray'){const it=ITEMS[d.id];if(it.rot){it.o=(it.o+1)%it.rot;sfx('tick');renderTray();applyHints()}else info(`Drag the ${it.name.toLowerCase()} onto the 3D bench.`)}
}
let down=null;
renderer.domElement.addEventListener('pointerdown',e=>{
  if(S.done) return; down={x:e.clientX,y:e.clientY};
  const st=cur();
  if(st&&st.item==='mbAsm'&&mbG.userData.drag&&setRay(e.clientX,e.clientY)&&ray.intersectObject(mbG,true).length){controls.enabled=false;startDrag(e,'mbAsm','scene')}
},{capture:true});
renderer.domElement.addEventListener('pointerup',e=>{
  if(!down||S.done) return; const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y); down=null;
  if(moved>5||D) return;
  const o=clickAt(e.clientX,e.clientY); if(o) handleClick(o.userData.click,o);
});
renderer.domElement.addEventListener('pointermove',e=>{if(D||down)return;const o=clickAt(e.clientX,e.clientY);renderer.domElement.style.cursor=o?'pointer':(S.tool?'crosshair':(cur()&&cur().item==='mbAsm'&&mbG.userData.drag?'grab':''))});

/* =================== HINTS =================== */
let hintSet=new Set(), hintUntil=0;
function hintTargets(){
  const st=cur();if(!st)return{zones:[],objs:[],tray:null};
  const r={zones:[],objs:[],tray:null};
  if(st.type==='drag'){r.zones=ZONES.filter(z=>st.zones.includes(z.dataset.zone)&&!z.dataset.full&&isShown(z.mesh));r.tray=st.item}
  else if(needsDriver(st)&&S.tool!=='screwdriver'){r.objs=[OBJ.sdDesk];r.tool=true}
  else if(st.type==='click'||st.type==='screws'){r.objs=st.targets.filter(t=>!st.clicked.has(t)).map(t=>OBJ[t]).filter(Boolean)}
  if(st.hintEls) r.objs.push(...st.hintEls().filter(Boolean));
  if(st.hintExtra) r.objs.push(...st.hintExtra().filter(Boolean));
  return r;
}
function applyHints(force){
  $$('.hint').forEach(e=>e.classList.remove('hint'));
  ZONES.forEach(z=>z.mesh.material.opacity=0);hintSet=new Set();
  const on=S.mode==='practice'||force||performance.now()<hintUntil;
  if(on){const h=hintTargets();h.zones.forEach(z=>{z.mesh.material.color.set(0x4fc3f7);z.mesh.material.opacity=.2});h.objs.forEach(o=>hintSet.add(o));
    if(h.tray){const ti=$(`.titem[data-id="${h.tray}"]`);ti&&ti.classList.add('hint')}
    if(h.tool){const ti=$('.titem.tool');ti&&ti.classList.add('hint')}
    const b=$('#stepBtn');if(b&&cur().type==='button')b.classList.add('hint')}
  if(overZone){overZone.mesh.material.color.set(0x66bb6a);overZone.mesh.material.opacity=.38}
}
