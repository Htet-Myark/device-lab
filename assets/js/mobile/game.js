'use strict';
/* PC Lab Assembly: Phone & Tablet Labs | MIT License | Educational use only. See DISCLAIMER.md */
/* =================== CAMERA VIEWS =================== */
const at=(t,dx,dy,dz)=>[t.clone().add(V3(dx,dy,dz)),t];
const SC=DL.sc, HW=DL.hw, HL=DL.hl, [B0,B1,B2,B3]=DL.batt;
const VIEWS={
  overview:()=>[V3(60,62,96),V3(56,4,8)],
  tech:()=>[V3(30,72,92),V3(60,46,-40)],
  mat:()=>[V3(68,46,52),V3(68,0,12)],
  device:()=>at(L(0,.5,0),0,24*SC,16*SC),
  top:()=>at(L(0,.5,-HL*.62),0,11*SC,8*SC),
  conn:()=>at(L(DL.conns.battConn[0]+1.2*SC,.5,DL.conns.battConn[1]),0,8*SC,6*SC),
  bottom:()=>at(L(0,.5,HL*.72),0,12*SC,9*SC),
  batt:()=>at(L(0,.5,(B1+B3)/2),0,17*SC,12*SC),
  book:()=>at(L(HW,.5,0),0,27*SC,19*SC),
  side:()=>at(L(-HW,.45,DL.sim?DL.sim.z:0),-12,5,7),
  front:()=>at(L(0,.6,1*SC),0,20*SC,20*SC),
};

/* =================== GAME STATE / STEPS =================== */
const S={mode:'practice',i:0,mistakes:0,hints:0,t0:0,timer:null,grounded:false,muted:false,done:false,powered:false};
const PARTS=IS_TAB?['Prepare the workspace','Install the logic board & cameras','Install the charging port & speakers','Install the battery','Install the LCD & front glass','Power on & test']
                  :['Prepare the workspace','Install the logic board & cameras','Install the port, speaker & motor','Install the battery','Fit the display','Insert the SIM & test'];
const PART_VIEW={1:'mat',2:'top',3:'bottom',4:'batt',5:'book',6:'front'};
const PART_START={};
const DEV=IS_TAB?'tablet':'phone';
const PRESS='Line the connector up and press it straight down with a fingertip or a plastic spudger until it clicks. Never use metal tools on these connectors.';
const bay=(p,item,zone,grp,view,title,text,o={})=>({p,type:'drag',item,zones:[zone],view,title,text,
  done:z=>{if(o.keepZone)z.dataset.full='1';else z.remove();dropIn(OBJ[grp],V3(0,1.2*SC,0),550);(o.unlock||[]).forEach(unlock);o.after&&o.after()},...o.extra});
const flex=(p,item,conn,from,view,title,text,wrong,o={})=>({p,type:'drag',item,zones:[conn],view,title,text,wrong,
  done:z=>{z.dataset.full='1';connectFlex(conn,from,o.col)},...o.extra});
const wrongConn=(target,what)=>Object.fromEntries(Object.keys(DL.conns).filter(n=>n!==target).map(n=>[n,`That's the ${CONN_LABEL[n]} connector. The ${what} goes in the connector labelled ${CONN_LABEL[target]}.`]));
const showZ=id=>()=>show(id), hideZ=id=>()=>hide(id);
const fromRight=z=>[HW+.25*SC,DL.wall-.05,z];

const COMMON_START=[
 {p:1,type:'drag',item:'vest',zones:['tech'],view:'tech',title:'Put on the ESD vest',text:'Drag the ESD vest onto the technician. It keeps static from clothing away from the components.',done:wearVest,hintEls:()=>[OBJ.vestHook]},
 {p:1,type:'drag',item:'strap',zones:['ground'],view:'mat',title:'Put on the antistatic wrist strap',text:`Drag the wrist strap to the <b>GND</b> snap on the corner of the mat. A ${DEV}'s logic board and cameras are easily damaged by static.`,done:()=>{S.grounded=true}},
 {p:1,type:'drag',item:'frame',zones:['matSpot'],view:'mat',title:`Lay the ${IS_TAB?'rear case':'frame'} on the mat`,text:`Drag the ${IS_TAB?'tablet rear case':'phone frame'} onto the antistatic mat, back down, so the empty inside faces you.`,done:z=>{z.remove();dropIn(LG,V3(0,6,0),700)}},
 {p:1,type:'button',view:'device',label:'Confirm: no power connected',title:'Make sure there is no power',text:`Check that the ${DEV} is switched off, unplugged, and that the battery is not connected.`,note:`A lithium-ion battery can short-circuit and damage the board, or even catch fire, if it's connected while you work. When you take a ${DEV} apart, disconnect the battery first. When you put one together, connect it last.`},
 bay(2,'board','boardBay','board','top','Place the logic board',`Drag the logic board into the top of the ${IS_TAB?'case':'frame'}. Its screw holes line up with the posts in the ${IS_TAB?'case':'frame'}.`),
 {p:2,type:'screws',view:'top',pts:()=>DL.boardScrews.map(([x,z])=>[L(x,.355,z),'y']),title:'Secure the logic board',text:`Pick up the <b>screwdriver</b> (tap it in the Tools tray or on the desk), then fasten each screw. ${IS_TAB?'Tablet':'Phone'} screws are tiny and come in different lengths, so keep them in order.`},
 bay(2,'rearCam','camBay','camG','top','Fit the rear camera module','Drag the rear camera into its bay so the lenses sit over the camera window in the back.',{unlock:['camFlex']}),
 flex(2,'camFlex','camConn',[ (DL.cam[0]+DL.cam[2])/2,.66,(DL.cam[1]+DL.cam[3])/2],'top','Connect the rear camera',`Press the camera flex onto the connector labelled <b>CAM</b>. ${PRESS}`,wrongConn('camConn','rear camera flex'),{extra:{fig:'press'}}),
 bay(2,'frontCam','fcamBay','fcamG','top','Fit the front camera','Drag the front camera into its slot at the top edge.',{unlock:['fcamFlex']}),
 flex(2,'fcamFlex','fcamConn',[(DL.fcam[0]+DL.fcam[2])/2,.6,(DL.fcam[1]+DL.fcam[3])/2],'top','Connect the front camera','Press the front camera flex onto the connector labelled <b>F-CAM</b>.',wrongConn('fcamConn','front camera flex')),
 bay(3,'portAsm','portBay','portG','bottom','Fit the charging port','Drag the USB-C charging port into the bottom edge so the port lines up with the opening in the frame.',{unlock:['portFlex']}),
 {p:3,type:'screws',view:'bottom',pts:()=>DL.portScrews.map(([x,z])=>[L(x,.55,z),'y']),title:'Secure the charging port',text:'Fasten the charging port with its two screws.'},
 flex(3,'portFlex','portConn',[DL.portFlexX,.3,DL.flexZ+.6],'conn','Connect the charging port flex','Its flex runs up the side to the logic board. Press it onto the connector labelled <b>PORT</b>.',wrongConn('portConn','charging port flex')),
];
const STEPS=IS_TAB?[
 ...COMMON_START,
 bay(3,'speakers','spkBay','spkG','bottom','Fit the speakers','Drag the speaker pair into the two bottom corners of the case.',{keepZone:true,extra:{done:z=>{zones('spkBay').forEach(x=>x.remove());dropIn(OBJ.spkG,V3(0,2,0),550)}}}),
 {p:4,type:'drag',item:'battAdhesive',zones:['battBay'],view:'batt',title:'Apply the battery adhesive',text:'Stick new adhesive pull-tab strips into the battery bay. The tabs let you pull the battery out later without prying it.',done:()=>dropIn(OBJ.battAdh,V3(0,1,0),300)},
 bay(4,'battery','battBay','battG','batt','Place the battery','Lay the two-cell battery onto the adhesive and press it down gently. Don\'t connect it yet.',{unlock:['battPlug'],extra:{note:'Never bend, puncture or pry a lithium-ion battery with metal tools, and never install a swollen one.'}}),
 bay(5,'lcd','lcdBay','lcdG','device','Place the LCD panel','Lay the LCD panel into the case over the battery. Hold it by its edges and keep fingerprints off the face.',{unlock:['lcdFlex'],extra:{onStart:showZ('zLcd'),onEnd:hideZ('zLcd')}}),
 flex(5,'lcdFlex','lcdConn',[DL.conns.lcdConn[0],.68,DL.lcd[1]],'conn','Connect the LCD','Press the LCD flex onto the connector labelled <b>LCD</b>.',wrongConn('lcdConn','LCD flex')),
 {p:5,type:'screws',view:'device',pts:()=>DL.lcdScrews.map(([x,z])=>[L(x,.68,z),'y']),title:'Secure the LCD',text:'Fasten the LCD with its four corner screws.'},
 {p:5,type:'drag',item:'gasket',zones:['rim'],view:'device',onStart:showZ('zRim'),onEnd:hideZ('zRim'),title:'Apply the front-glass adhesive',text:'Lay new adhesive strips around the rim of the case. They hold the front glass on.',done:()=>dropIn(OBJ.gasketG,V3(0,1,0),300)},
 bay(5,'digitizer','dispSide','dispPivot','book','Lay out the front glass','Place the front glass (digitizer) beside the tablet, face down, along its right-hand edge, like an open book.',{unlock:['digiFlex']}),
 flex(5,'digiFlex','digiConn',fromRight(DL.conns.digiConn[1]),'conn','Connect the digitizer','Press the digitizer flex onto the connector labelled <b>DIGI</b>. The digitizer is the touch layer.',wrongConn('digiConn','digitizer flex')),
 flex(5,'battPlug','battConn',[DL.conns.battConn[0],.55,B1],'conn','Connect the battery (last)','With everything else connected, press the battery connector onto <b>BATT</b>.',wrongConn('battConn','battery connector'),{extra:{note:'Connect the battery last. When servicing, it\'s the first thing you disconnect.'}}),
 {p:5,type:'drag',item:'shield',zones:['shieldSpot'],view:'conn',onStart:showZ('zShield'),onEnd:hideZ('zShield'),title:'Fit the connector shield',text:'Lay the metal shield plate over the connectors. It stops them working loose.',done:()=>dropIn(OBJ.shieldG,V3(0,.8,0),300)},
 {p:5,type:'drag',item:'screwShort',zones:['shieldHole'],view:'conn',fig:'screw',alsoUse:['screwLong'],title:'Screw down the shield',text:'Drag the correct screw onto the shield hole. Check the length first.',wrongItems:{screwLong:'Stop! That\'s the 3.6 mm screw. In this hole a long screw punches through the layers of the logic board ("long screw damage") and can kill the device. Use the 1.2 mm screw.'},done:()=>show('shieldScrew')},
 {p:5,type:'click',view:'book',targets:['display'],title:'Close the front glass',text:'Click the front glass to fold it over onto the case, then press around the edges so the adhesive bonds.',done:()=>closeDisplay()},
 {p:6,type:'click',view:'device',targets:['pwrBtn'],title:'Power on',text:'Press the top button to switch the tablet on.',done:powerOn},
 {p:6,type:'button',view:'front',label:'Run the self-test',title:'Test the tablet',text:'Check the touch screen, both cameras, the speakers and charging before you hand the tablet back.'},
]:[
 ...COMMON_START,
 bay(3,'speakers','spkBay','spkG','bottom','Fit the loudspeaker','Drag the loudspeaker into the bottom-right corner of the frame.'),
 bay(3,'taptic','tapBay','tapG','bottom','Fit the vibration motor','Drag the vibration motor into the bottom-left corner. It makes contact through spring contacts, so there\'s no cable.'),
 {p:4,type:'drag',item:'battAdhesive',zones:['battBay'],view:'batt',title:'Apply the battery adhesive',text:'Stick new adhesive pull-tab strips into the battery bay. The tabs let you pull the battery out later without prying it.',done:()=>dropIn(OBJ.battAdh,V3(0,1,0),300)},
 bay(4,'battery','battBay','battG','batt','Place the battery','Lay the battery onto the adhesive and press it down gently. Don\'t connect it yet.',{unlock:['battPlug'],extra:{note:'Never bend, puncture or pry a lithium-ion battery with metal tools, and never install a swollen one.'}}),
 {p:5,type:'drag',item:'gasket',zones:['rim'],view:'device',onStart:showZ('zRim'),onEnd:hideZ('zRim'),title:'Apply the display adhesive',text:'Lay a new adhesive gasket around the rim of the frame. It seals the phone against dust and water, so always replace it.',done:()=>dropIn(OBJ.gasketG,V3(0,1,0),300)},
 bay(5,'display','dispSide','dispPivot','book','Lay out the display','Place the display beside the phone, face down, along its right-hand edge, like an open book. Its flex cables reach across to the board.',{unlock:['dispFlex','touchFlex']}),
 flex(5,'dispFlex','dispConn',fromRight(-2.9),'conn','Connect the display flex',`Press the display flex onto the connector labelled <b>DISP</b>. ${PRESS}`,wrongConn('dispConn','display flex'),{extra:{fig:'press'}}),
 flex(5,'touchFlex','touchConn',fromRight(-2.2),'conn','Connect the touch flex','Press the touch (digitizer) flex onto the connector labelled <b>TOUCH</b>.',wrongConn('touchConn','touch flex')),
 flex(5,'battPlug','battConn',[DL.conns.battConn[0],.62,B1],'conn','Connect the battery (last)','With everything else connected, press the battery connector onto <b>BATT</b>.',wrongConn('battConn','battery connector'),{extra:{note:'Connect the battery last. When servicing, it\'s the first thing you disconnect.'}}),
 {p:5,type:'drag',item:'shield',zones:['shieldSpot'],view:'conn',onStart:showZ('zShield'),onEnd:hideZ('zShield'),title:'Fit the connector shield',text:'Lay the metal shield plate over the connectors. It stops them working loose.',done:()=>dropIn(OBJ.shieldG,V3(0,.8,0),300)},
 {p:5,type:'drag',item:'screwShort',zones:['shieldHole'],view:'conn',fig:'screw',alsoUse:['screwLong'],title:'Screw down the shield',text:'Drag the correct screw onto the shield hole. Check the length first.',wrongItems:{screwLong:'Stop! That\'s the 3.6 mm screw. In this hole a long screw punches through the layers of the logic board ("long screw damage") and can kill the phone. Use the 1.2 mm screw.'},done:()=>show('shieldScrew')},
 {p:5,type:'click',view:'book',targets:['display'],title:'Close the display',text:'Click the display to fold it over onto the frame, then press around the edges so the adhesive bonds.',done:()=>closeDisplay()},
 {p:6,type:'drag',item:'simTray',zones:['simSlot'],view:'side',fig:'sim',title:'Insert the SIM tray',text:'Push the SIM tray into the slot on the left edge. The SIM sits in the tray with its <b>cut corner</b> matching the tray. Click the tray in the parts tray to flip it.',
  check:()=>ITEMS.simTray.o!==0?'The tray is upside down: the SIM would fall out or jam in the slot. Flip it so the cut corner of the SIM matches the tray.':null,
  done:z=>{const p=z.mesh.position;bx(-HW-.02,.34,p.z-.85,-HW+.06,.56,p.z+.85,MAT.steel,LG,.05)}},
 {p:6,type:'click',view:'device',targets:['pwrBtn'],title:'Power on',text:'Press and hold the side button to switch the phone on.',done:powerOn},
 {p:6,type:'button',view:'front',label:'Run the self-test',title:'Test the phone',text:'Check the display, touch, both cameras, speaker, vibration, SIM and charging before you hand the phone back.'},
];
const POST_LINES=()=>IS_TAB?[`${DL.name} self-test`,'',
  'LCD .................... OK','Digitizer (touch) ...... OK','Rear camera ............ OK','Front camera ........... OK',
  'Speakers (L+R) ......... OK','USB-C charging ......... OK','Battery 7.6 V 28.9 Wh .. OK','',
  'All tests passed.','Lab complete. Have your instructor verify your work. ✓']
 :[`${DL.name} self-test`,'',
  'Display ........... OK','Touch ............. OK','Rear camera ....... OK','Front camera ...... OK',
  'Loudspeaker ....... OK','Vibration ......... OK','SIM ............... Detected','USB-C charging .... OK','Battery 3.87 V .... OK','',
  'All tests passed.','Lab complete. Have your instructor verify your work. ✓'];
function powerOn(){
  S.powered=true;OBJ.screen.material=new THREE.MeshBasicMaterial({map:SCR.tex});drawScreen([],true);
  const lines=POST_LINES().slice(0,-1);let k=0;
  setTimeout(()=>{const tick=()=>{if(k<lines.length){k++;drawScreen(lines.slice(0,k));setTimeout(tick,140)}};tick()},1200);
}
const FIGS={
  press:`<svg viewBox="0 0 260 74" width="100%"><rect x="12" y="44" width="70" height="14" rx="2" fill="#2a2d33"/><rect x="18" y="40" width="58" height="5" fill="#e6b83c"/><rect x="14" y="14" width="66" height="18" rx="2" fill="#1b1d21"/><rect x="18" y="30" width="58" height="4" fill="#e6b83c"/><path d="M47 2v8" stroke="#66bb6a" stroke-width="2"/><path d="M42 8l5 5 5-5" fill="#66bb6a"/><text x="96" y="24" fill="#dce6f2" font-size="11.5">Press-fit connector</text><text x="96" y="42" fill="#8a9bb0" font-size="10.5">Line it up, press straight down</text><text x="96" y="58" fill="#ffca28" font-size="10.5">No metal tools, no rocking.</text></svg>`,
  screw:`<svg viewBox="0 0 260 74" width="100%"><rect x="12" y="10" width="12" height="16" rx="2" fill="#c3c9d0"/><rect x="24" y="14" width="12" height="8" fill="#9aa1aa"/><text x="44" y="22" fill="#66bb6a" font-size="11.5">1.2 mm ✓ for shields</text><rect x="12" y="40" width="12" height="16" rx="2" fill="#c3c9d0"/><rect x="24" y="44" width="40" height="8" fill="#9aa1aa"/><text x="72" y="52" fill="#ef5350" font-size="11.5">3.6 mm ✗ long-screw damage</text><text x="12" y="70" fill="#8a9bb0" font-size="10">Compare lengths before every screw goes in.</text></svg>`,
  sim:`<svg viewBox="0 0 260 70" width="100%"><rect x="10" y="16" width="100" height="36" rx="6" fill="#9aa1aa"/><rect x="34" y="20" width="44" height="28" rx="2" fill="#2a2e34"/><path d="M34 20h10l-10 9z" fill="#ffca28"/><rect x="40" y="26" width="30" height="16" fill="#e6b83c"/><text x="122" y="30" fill="#dce6f2" font-size="11.5">SIM: cut corner matches</text><text x="122" y="46" fill="#8a9bb0" font-size="10.5">the tray, gold contacts down.</text></svg>`,
};
const LAB={esd:['board','rearCam','frontCam','display','lcd','digitizer'],esdMsg:`⚡ ESD risk! Put on the antistatic wrist strap before handling the logic board, cameras or display.`,
  bestKey:`benchbuild-${DEV}-best`,figs:FIGS,screwScale:IS_TAB?.6:.42,
  orderMsg:(id,st)=>id==='battery'&&st.item==='battAdhesive'?'Stick the adhesive strips down first. Once the battery is in, you can\'t add them without prying it back out.':null,
  start:()=>{if(ITEMS.simTray)ITEMS.simTray.o=1}};
