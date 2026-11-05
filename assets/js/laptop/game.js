'use strict';
/* PC Lab Assembly: Laptop Lab | MIT License | Educational use only. See DISCLAIMER.md */
/* =================== CAMERA VIEWS =================== */
const at=(t,dx,dy,dz)=>[t.clone().add(V3(dx,dy,dz)),t];
const VIEWS={
  overview:()=>[V3(60,62,96),V3(56,4,8)],
  tech:()=>[V3(30,72,92),V3(60,46,-40)],
  mat:()=>[V3(68,46,52),V3(68,0,12)],
  laptop:()=>at(L(0,1.5,0),0,38,28),
  board:()=>at(L(-2.5,1.5,-4),0,25,19),
  front:()=>at(L(2.5,1.5,2.2),0,14,12),
  edp:()=>at(L(-4,1.5,-10),0,14,15),
  cpu:()=>at(L(3,1.6,-6),0,15,12),
  ram:()=>at(L(-11,1.5,-6.5),3,15,12),
  m2:()=>at(L(-7,1.5,-1.4),0,14,11),
  wifi:()=>at(L(-4,1.6,-2),0,10,10),
  ant:()=>at(L(-5,1.6,-6),0,18,17),
  battery:()=>at(L(0,1.5,5),0,24,18),
  cover:()=>[V3(46,44,66),V3(46,0,12)],
  open:()=>[V3(68,34,66),V3(68,8,6)],
  side:()=>[V3(100,9,20),V3(84,1.6,8.8)],
};
/* =================== GAME STATE / STEPS =================== */
const S={mode:'practice',i:0,mistakes:0,hints:0,t0:0,timer:null,grounded:false,ram:[],lastRam:0,muted:false,done:false,powered:false,flipped:false};
const PARTS=['Prepare the workspace','Install the system board','Install the cooling system','Install memory & storage','Install wireless & audio','Install the battery','Close up & power on'];
const PART_VIEW={1:'mat',2:'board',3:'cpu',4:'ram',5:'m2',6:'battery',7:'laptop'};
const ESD_ITEMS=['mobo','ram1','ram2','ssd','wifi'];

const ribbonCheck=id=>()=>ITEMS[id].o!==0?'The contacts are facing up! A ribbon inserted upside down makes no contact, so the keyboard or touchpad will be dead. Click the cable in the tray to flip it, gold contacts down.':null;
function ramCheck(id){return z=>{if(z.dataset.full)return 'That slot already has a module in it.';if(ITEMS[id].o!==0)return 'The notch doesn\'t line up with the key in the slot. Flip the module (click it in the tray). Never force a SO-DIMM in backwards.'}}
function ramDone(z){const i=+z.dataset.i;z.dataset.full='1';S.ram.push(i);S.lastRam=i;const m=OBJ['ram-'+i];m.rotation.x=-.5;dropIn(m,V3(0,2,0),450)}
function ramPress(){const m=OBJ['ram-'+S.lastRam];tweenTo(m,{rotX:0,dur:280})}
const m2Screw=(i,title,text)=>({p:i?5:4,type:'click',needsDriver:true,view:i?'wifi':'m2',targets:['m2s-'+i],title,text,onEach:unscrew});
const m2Fasten=(x,title)=>({p:x>-5?5:4,type:'screws',view:x>-5?'wifi':'m2',pts:()=>[[L(x,1.58,-1.4),'y']],title,text:'Put the retaining screw back in to hold the card flat against the standoff. Don\'t overtighten it.'});
let NUMS=[];
function numberScrews(){NUMS=HS_SCREWS.map(([x,z],k)=>label(String(k+1),L(x,3.1,z+.2),2.4))}
function clearNumbers(){NUMS.forEach(s=>scene.remove(s));NUMS=[]}
const pressCover=()=>{hide('coverGhost');const c=OBJ.coverG,t0=c.position.clone();
  tween(900,k=>{const e=ease(k);c.position.lerpVectors(t0,LG.position,e);c.position.y+=Math.sin(Math.PI*e)*12},()=>{LG.attach(c)})};

const STEPS=[
 {p:1,type:'drag',item:'vest',zones:['tech'],view:'tech',title:'Put on the ESD vest',text:'Drag the ESD vest onto the technician. It keeps static from clothing away from the components.',note:'An ESD smock or vest is standard practice in electronics labs.',done:wearVest,hintEls:()=>[OBJ.vestHook]},
 {p:1,type:'drag',item:'strap',zones:['ground'],view:'mat',title:'Put on the antistatic wrist strap',text:'Drag the wrist strap to the <b>GND</b> snap on the corner of the mat. Laptop boards are packed tightly and every chip on them is static-sensitive.',done:()=>{S.grounded=true}},
 {p:1,type:'drag',item:'chassis',zones:['matSpot'],view:'mat',title:'Lay the laptop base on the mat',text:'Drag the laptop base onto the antistatic mat. It goes <b>upside down</b> with the lid closed underneath, so the empty inside faces you.',done:z=>{z.remove();dropIn(LG,V3(0,8,0),700)}},
 {p:1,type:'button',view:'laptop',label:'Confirm: no power connected',title:'Make sure there is no power',text:'Check that the AC adapter is unplugged and no battery is connected before you work inside the laptop.',note:'A laptop battery can still short and damage the board even when the laptop is switched off. When you take a laptop apart, disconnect the battery first. When you put one together, connect it last.'},
 {p:2,type:'drag',item:'mobo',zones:['mbBay'],view:'laptop',title:'Place the system board',text:'Drag the system board into the base. Its screw holes line up with the bosses in the base.',done:z=>{z.remove();dropIn(OBJ.mb,V3(0,6,0),700)}},
 {p:2,type:'screws',view:'board',pts:()=>MB_SCREWS.map(([x,z])=>[L(x,1.3,z),'y']),title:'Secure the system board',text:'Pick up the <b>screwdriver</b> (tap it in the Tools tray or on the desk), then fasten each screw marked on the board.',note:'Laptop screws come in different lengths. Keep track of where each one came from: a long screw in a short hole can punch up through the keyboard deck.'},
 {p:2,type:'click',view:'front',targets:['kbLatch'],title:'Open the keyboard connector',text:'The keyboard plugs into a <b>ZIF</b> (zero insertion force) connector beside the label KB. Click its black latch to flip it up.',done:()=>setLatch('kbLatch',true)},
 {p:2,type:'drag',item:'kbRibbon',zones:['kbZif'],view:'front',fig:'ribbon',wrong:{tpZif:'That\'s the small touchpad (TP) connector. The wide keyboard ribbon goes in KB.'},title:'Insert the keyboard ribbon cable',text:'Slide the keyboard ribbon into the open connector with the <b>gold contacts facing down</b> toward the pins. Click the cable in the tray to flip it.',check:ribbonCheck('kbRibbon'),done:()=>{hide('kbLoose');show('kbOn')}},
 {p:2,type:'click',view:'front',targets:['kbLatch'],title:'Close the keyboard latch',text:'Click the latch to press it back down. That clamps the ribbon in place.',note:'Never pull a ribbon out with the latch closed. It tears the contacts.',done:()=>setLatch('kbLatch',false)},
 {p:2,type:'drag',item:'tpRibbon',zones:['tpZif'],view:'front',fig:'ribbon',wrong:{kbZif:'That\'s the keyboard (KB) connector. The narrow touchpad ribbon goes in TP.'},title:'Insert the touchpad ribbon cable',text:'The touchpad connector (TP) is already open. Slide the touchpad ribbon in with the gold contacts facing down.',check:ribbonCheck('tpRibbon'),done:()=>{hide('tpLoose');show('tpOn')}},
 {p:2,type:'click',view:'front',targets:['tpLatch'],title:'Close the touchpad latch',text:'Click the latch to lock the touchpad ribbon.',done:()=>setLatch('tpLatch',false)},
 {p:2,type:'drag',item:'edp',zones:['edpConn'],view:'edp',wrong:{battConn:'That\'s the battery connector. The display cable goes in the eDP socket at the back edge, near the hinge.'},title:'Connect the display cable',text:'The <b>eDP</b> cable comes out of the hinge from the screen. Press it straight down into the eDP socket at the back edge of the board.',done:()=>{hide('edpLoose');show('edpOn')}},
 {p:3,type:'drag',item:'paste',zones:['cpuDie'],view:'cpu',title:'Apply thermal compound',text:'Apply a small amount of thermal compound to the shiny CPU die.',note:'Laptop CPUs are soldered to the board (BGA), so there is no socket or Pin 1 to line up. Before you re-paste a used laptop, wipe off the old compound with isopropyl alcohol.',done:()=>dropIn(OBJ.lPaste,V3(0,2,0),300)},
 {p:3,type:'drag',item:'heatsink',zones:['cpuDie'],view:'cpu',title:'Fit the heat pipe & fan assembly',text:'Lower the cooling assembly onto the CPU so its copper plate covers the die and the four screws line up with the holes around it.',done:()=>{dropIn(OBJ.hs,V3(0,5,0),800);unlock('fanCable')}},
 {p:3,type:'screws',order:true,view:'cpu',pts:()=>HS_SCREWS.map(([x,z])=>[L(x,1.68,z),'y']),onStart:numberScrews,onEnd:clearNumbers,title:'Tighten the heat-sink screws in order',text:'The screws are numbered. Tighten them in order <b>1 → 2 → 3 → 4</b>, corner to opposite corner, so the plate presses down evenly on the die.'},
 {p:3,type:'drag',item:'fanCable',zones:['fanHdr'],view:'board',wrong:{spkHdr:'That\'s the speaker header (SPK). The fan plugs into the header labelled FAN.',battConn:'That\'s the battery connector. The fan plugs into the small header labelled FAN.'},title:'Connect the fan cable',text:'Plug the fan cable into the header labelled <b>FAN</b>. A fan that isn\'t plugged in means the laptop overheats and shuts down.',done:z=>{z.dataset.full='1';show('fanWire')}},
 {p:4,type:'drag',item:'ram1',zones:['ram'],view:'ram',fig:'ram',title:'Insert the first SO-DIMM',text:'Line the notch up with the key in the slot. Click the module in the tray to flip it, then slide it into a slot at an angle.',check:ramCheck('ram1'),done:ramDone},
 {p:4,type:'click',view:'ram',tgt:()=>['ram-'+S.lastRam],title:'Press the module down',text:'Laptop memory goes in at about 30° and then hinges down. Click the module to press it flat until the side clips snap over it.',done:ramPress},
 {p:4,type:'drag',item:'ram2',zones:['ram'],view:'ram',fig:'ram',title:'Insert the second SO-DIMM',text:'Install the second module in the other slot the same way: notch lined up, in at an angle.',check:ramCheck('ram2'),done:ramDone},
 {p:4,type:'click',view:'ram',tgt:()=>['ram-'+S.lastRam],title:'Press the second module down',text:'Click the module to press it flat until both clips lock.',done:ramPress},
 m2Screw(0,'Remove the M.2 retaining screw','Unscrew the small screw on the standoff at the end of the long <b>M.2 SSD</b> slot. It holds the drive down later.'),
 {p:4,type:'drag',item:'ssd',zones:['m2ssd'],view:'m2',wrong:{m2wifi:'That\'s the short E-key slot for the Wi-Fi card. An M.2 SSD is M-keyed and 80 mm long, so it goes in the M.2 SSD slot.'},title:'Insert the M.2 SSD',text:'Slide the SSD into the long <b>M-key</b> slot, then lay it flat on the standoff. The notch in the gold edge only fits one way.',done:()=>dropIn(OBJ.ssdG,V3(0,1.5,0),450)},
 m2Fasten(-6.0,'Secure the SSD'),
 m2Screw(1,'Remove the Wi-Fi retaining screw','Unscrew the retaining screw at the end of the short <b>WLAN (E key)</b> slot.'),
 {p:5,type:'drag',item:'wifi',zones:['m2wifi'],view:'wifi',wrong:{m2ssd:'That slot already holds the SSD, and it\'s M-keyed. The Wi-Fi card is E-keyed and goes in the short WLAN slot.'},title:'Insert the M.2 Wi-Fi card',text:'Slide the Wi-Fi card into the short <b>WLAN (E key)</b> slot and lay it flat.',done:()=>dropIn(OBJ.wifiG,V3(0,1.5,0),450)},
 m2Fasten(-1.6,'Secure the Wi-Fi card'),
 {p:5,type:'drag',item:'antMain',zones:['antMain'],view:'wifi',wrong:{antAux:'Swapped! The black lead is MAIN and goes on the terminal marked MAIN (black ▲). With the leads swapped, Wi-Fi range and speed drop.'},title:'Connect the MAIN antenna lead',text:'The antenna leads come out of the hinge from the screen. Snap the <b>black</b> lead onto the terminal marked <b>MAIN</b>.',done:()=>{hide('antMainLoose');show('antMainOn')}},
 {p:5,type:'drag',item:'antAux',zones:['antAux'],view:'wifi',wrong:{antMain:'That terminal already has the MAIN lead. The white AUX lead goes on the terminal marked AUX.'},title:'Connect the AUX antenna lead',text:'Snap the <b>white</b> lead onto the terminal marked <b>AUX</b>. Press straight down until it clicks.',note:'Press antenna connectors on and lift them off straight. Don\'t pull them sideways: they break easily.',done:()=>{hide('antAuxLoose');show('antAuxOn')}},
 {p:5,type:'drag',item:'speakers',zones:['spkBay'],view:'battery',title:'Fit the speakers',text:'Drag the speaker pair into the front corners of the base.',done:()=>{dropIn(OBJ.spkG,V3(0,3,0),500);unlock('spkCable')}},
 {p:5,type:'drag',item:'spkCable',zones:['spkHdr'],view:'front',wrong:{fanHdr:'That\'s the fan header. The speaker cable goes in SPK, at the front edge of the board.',battConn:'That\'s the battery connector. The speaker cable goes in the small SPK header.'},title:'Connect the speakers',text:'Plug the speaker cable into the header labelled <b>SPK</b>.',done:z=>{z.dataset.full='1';show('spkWire')}},
 {p:6,type:'drag',item:'battery',zones:['battBay'],view:'battery',title:'Place the battery',text:'Drag the battery into the bay at the front of the base. Don\'t connect it yet.',note:'Check the battery for swelling first. A swollen Li-ion battery must not be installed.',done:()=>{dropIn(OBJ.battG,V3(0,4,0),600);unlock('battPlug')}},
 {p:6,type:'screws',view:'battery',pts:()=>BATT_SCREWS.map(([x,z])=>[L(x,1.9,z),'y']),title:'Secure the battery',text:'Fasten the battery to the base with its two screws.'},
 {p:6,type:'drag',item:'battPlug',zones:['battConn'],view:'front',wrong:{spkHdr:'That\'s the speaker header. The battery cable goes in the wide BATT connector.',fanHdr:'That\'s the fan header. The battery cable goes in the wide BATT connector.'},title:'Connect the battery (last)',text:'With everything else connected, plug the battery cable into the <b>BATT</b> connector. Push it in straight and evenly.',done:z=>{z.dataset.full='1';show('battWire')}},
 {p:6,type:'button',view:'board',label:'Verify connections',title:'Verify the connections',text:'Check that every connector is fully seated: keyboard, touchpad, display, fan, antennas, speakers and battery.',done:()=>{FLASH.until=performance.now()+1500}},
 {p:7,type:'click',view:'cover',targets:['coverGhost'],title:'Fit the bottom cover',text:'Click the outline to put the bottom cover on. Press around the edges so all the clips engage.',done:pressCover},
 {p:7,type:'screws',view:'laptop',pts:()=>COVER_SCREWS.map(([x,z])=>[L(x,2.45,z),'y']),title:'Secure the bottom cover',text:'Fasten the bottom cover screws.'},
 {p:7,type:'click',view:'laptop',targets:['laptopHit'],onStart:()=>show('laptopHit'),title:'Turn the laptop over',text:'Click the laptop to turn it right side up and open the lid.',done:()=>{S.flipped=true;flipLaptop(()=>goView('side'))}},
 {p:7,type:'drag',item:'charger',zones:['usbcPD'],view:'side',onStart:()=>setTimeout(portLabels,2800),wrong:{usbcData:'This USB-C port has no ⚡ symbol, so it carries data only and won\'t charge the laptop. Use the port marked with the lightning bolt.',hdmi:'That\'s the HDMI video output.',usbA:'That\'s a USB-A data port. The adapter plugs into the USB-C port marked ⚡.'},title:'Connect the power adapter',text:'Plug the USB-C power adapter into the USB-C port marked <b>⚡</b> (Power Delivery). Not every USB-C port can charge.',done:(z,it)=>plugCharger(z)},
 {p:7,type:'click',view:'open',targets:['pwrBtnL'],title:'Power on & verify',text:'Press the power button above the keyboard and watch the POST on the screen.',done:powerOn},
];
const PART_START={7:()=>{show('coverGhost');goView('cover')}};
let LABELS=[];
function portLabels(){
  [['usbcPD','USB-C ⚡'],['usbcData','USB-C'],['hdmi','HDMI'],['usbA','USB']].forEach(([n,t],k)=>{const z=zone1(n);if(!z)return;const p=z.world();LABELS.push(label(t,V3(p.x+.6,p.y+1.3+(k%2)*1.1,p.z),1.7))});
}
function plugCharger(z){
  const p=z.world();show('brick');
  const g=new THREE.Group();scene.add(g);
  bx(p.x,p.y-.5,p.z-.7,p.x+1.8,p.y+.5,p.z+.7,MAT.white,g,.2);bx(p.x-.5,p.y-.15,p.z-.38,p.x,p.y+.15,p.z+.38,MAT.steel,g);
  g.position.x=3;tweenTo(g,{pos:V3(0,0,0),dur:350});
  const c=tube([V3(p.x+1.8,p.y,p.z),V3(p.x+5,p.y,p.z+.5),V3(p.x+9,.5,p.z+8),V3(97,.5,36),V3(100,1.2,37)],.22,MAT.white,scene,60);CABLES.push(c);
  const led=OBJ.chgLed;led.material.color.set(0xffa000);led.material.emissive.set(0xffa000);led.material.emissiveIntensity=2.5;
  LABELS.forEach(l=>l.visible=false);
}
const POST_LINES=()=>['BenchBook BIOS v1.4  (C) Bench Build Labs','',
  'CPU (BGA, soldered) ................. OK',
  'Fan ................................. 2900 RPM',
  `Memory: 2 x 8 GB SO-DIMM ............ OK  ${S.ram.length===2?'[dual channel]':''}`,
  'M.2 NVMe SSD (M key) ................ 512 GB OK',
  'M.2 Wi-Fi (E key) ................... OK  MAIN+AUX',
  'Keyboard ............................ OK',
  'Touchpad ............................ OK',
  'Internal display (eDP) .............. OK',
  'Speakers ............................ OK',
  'Battery 54 Wh ....................... Charging (USB-C PD 65 W)','',
  'POST complete.','Lab complete. Have your instructor verify your work. ✓'];
function powerOn(){
  S.powered=true;
  const led=OBJ.pwrLedL;led.material.color.set(0xffffff);led.material.emissive.set(0xffffff);led.material.emissiveIntensity=3;
  OBJ.chgLed.material.emissive.set(0xffffff);OBJ.chgLed.material.color.set(0xffffff);
  OBJ.screen.material=new THREE.MeshBasicMaterial({map:SCR.tex});
  drawScreen([],true);
  const lines=POST_LINES().slice(0,-1);let k=0;
  setTimeout(()=>{const tick=()=>{if(k<lines.length){k++;drawScreen(lines.slice(0,k));setTimeout(tick,150)}};tick()},1100);
}
const FIGS={
  ribbon:`<svg viewBox="0 0 260 80" width="100%"><rect x="10" y="44" width="70" height="16" fill="#2a2d33"/><g fill="#e6b83c">${[...Array(10)].map((_,k)=>`<rect x="${14+k*6.5}" y="54" width="3" height="5"/>`).join("")}</g><rect x="10" y="14" width="70" height="12" fill="#d9a441"/><g fill="#f7de8a">${[...Array(10)].map((_,k)=>`<rect x="${14+k*6.5}" y="24" width="3" height="3"/>`).join("")}</g><path d="M45 30v10" stroke="#66bb6a" stroke-width="2"/><path d="M41 37l4 5 4-5" fill="#66bb6a"/><text x="92" y="22" fill="#dce6f2" font-size="11.5">Ribbon: gold contacts face DOWN</text><text x="92" y="56" fill="#ffca28" font-size="11.5">ZIF connector: pins face UP</text><text x="92" y="74" fill="#8a9bb0" font-size="10.5">Open the latch first, close it after.</text></svg>`,
  ram:`<svg viewBox="0 0 260 70" width="100%"><rect x="10" y="10" width="160" height="22" fill="#1f6b3a"/><rect x="10" y="28" width="160" height="5" fill="#d4af37"/><rect x="58" y="28" width="7" height="6" fill="#0b1118"/><rect x="10" y="42" width="160" height="12" fill="#2a2d33"/><rect x="59" y="38" width="5" height="6" fill="#ffca28"/><text x="180" y="26" fill="#dce6f2" font-size="11">notch</text><text x="180" y="52" fill="#ffca28" font-size="11">slot key</text><text x="10" y="68" fill="#8a9bb0" font-size="10.5">The key is off-centre: the notch must match it.</text></svg>`,
};
const LAB={esd:ESD_ITEMS,esdMsg:'⚡ ESD risk! Put on the antistatic wrist strap before handling the board, memory or M.2 cards.',bestKey:'benchbuild-laptop-best',figs:FIGS,
  orderMsg:(id,st)=>id==='heatsink'&&st.item==='paste'?'Apply thermal compound before fitting the heat sink, or the CPU will overheat.':null,
  tick:dt=>{if(S.powered)OBJ.lFan.rotation.y+=dt*30},
  start:()=>{ITEMS.kbRibbon.o=1;ITEMS.tpRibbon.o=Math.round(Math.random());ITEMS.ram1.o=1;ITEMS.ram2.o=Math.round(Math.random())}};
