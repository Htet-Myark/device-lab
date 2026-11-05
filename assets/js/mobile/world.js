'use strict';
/* PC Lab Assembly: Phone & Tablet Labs | MIT License | Educational use only. See DISCLAIMER.md */
/* =================== BUILD THE DEVICE ===================
   Everything lives in LG on the antistatic mat. Local units are cm, y is up.
   The device lies on its back with the front open; the display is added last and
   closes over it like a book (hinged along the right-hand edge). Top of the device = -z. */
const LP=V3(68,.25,13);
const LG=new THREE.Group();scene.add(LG);LG.position.copy(LP);LG.visible=false;
const L=(x,y,z)=>LG.localToWorld(V3(x,y,z));
const DL=IS_TAB?{
  name:'BenchTab 11',hw:8.9,hl:12.4,wall:.7,sc:1.9,
  board:[-6.2,-12.0,8.5,-9.1],cam:[-8.55,-12.0,-6.6,-10.0],fcam:[-0.8,-12.3,0.8,-11.8],
  batt:[-8.5,-8.7,8.2,8.6],port:[-1.0,11.4,1.0,12.2],portFlexX:8.45,spk:[[-8.5,9.0,-4.5,12.0],[4.5,9.0,8.5,12.0]],
  conns:{camConn:[-5.6,-10.6],fcamConn:[1.6,-11.2],battConn:[-3.0,-9.5],lcdConn:[-1.6,-9.5],digiConn:[-0.2,-9.5],portConn:[7.6,-9.5]},cw:1.0,cd:.5,
  boardScrews:[[-5.8,-11.7],[3,-11.7],[8.1,-11.7],[8.1,-9.45],[-5.8,-9.45]],portScrews:[[-1.6,11.85],[1.6,11.85]],
  shield:[-3.7,-9.85,0.45,-9.15],hole:[0.25,-9.5],lcd:[-8.55,-8.85,8.55,8.9],lcdScrews:[[-8.35,-8.65],[8.35,-8.65],[-8.35,8.7],[8.35,8.7]],
  pwr:{x:6,z:-12.4},sim:null,flexZ:-6,
}:{
  name:'BenchPhone 6',hw:3.6,hl:7.5,wall:.75,sc:1,
  board:[-1.0,-7.1,3.2,-2.1],cam:[-3.2,-7.1,-1.35,-5.0],fcam:[-1.2,-7.35,0.2,-6.85],
  batt:[-3.2,-1.7,2.55,4.9],port:[-1.0,6.35,1.0,7.2],portFlexX:2.95,spk:[[1.2,5.1,3.25,6.3]],tap:[-3.2,5.1,-1.2,6.3],
  conns:{camConn:[-0.5,-5.8],fcamConn:[0.7,-6.4],battConn:[-0.35,-2.5],dispConn:[0.55,-2.5],touchConn:[1.45,-2.5],portConn:[2.45,-2.5]},cw:.7,cd:.45,
  boardScrews:[[-0.7,-6.85],[2.9,-6.85],[2.9,-3.1],[-0.7,-3.4]],portScrews:[[-1.35,6.8],[1.35,6.8]],
  shield:[-1.0,-2.85,2.95,-2.15],hole:[-0.85,-2.5],pwr:{x:3.6,z:-3.4},sim:{z:-1.2},flexZ:-2.6,
};
const FY=.25;   // inside floor height
const LMAT={
  shell:std({color:IS_TAB?0x8c9199:0x3b4048,roughness:.3,metalness:.85,map:TEX.brush}),
  inner:std({color:0x2a2e35,roughness:.6,metalness:.4}),
  ribbon:std({color:0xd9a441,roughness:.4,metalness:.25}),
  glass:std({color:0x07080a,roughness:.08,metalness:.3}),
  lcd:std({color:0xc9ced4,roughness:.35,metalness:.6}),
  adhesive:new THREE.MeshStandardMaterial({color:0xf2f2f2,roughness:.7,transparent:true,opacity:.85}),
  lens:std({color:0x0b1a2c,roughness:.05,metalness:.6}),
};
const box=(r,y0,y1,mat,par,rad)=>bx(r[0],y0,r[1],r[2],y1,r[3],mat,par,rad);
const ctr=(r,y)=>[(r[0]+r[2])/2,y,(r[1]+r[3])/2], siz=(r,h)=>[Math.abs(r[2]-r[0]),h,Math.abs(r[3]-r[1])];
const SCR={c:document.createElement('canvas')};SCR.c.width=IS_TAB?720:420;SCR.c.height=IS_TAB?1000:860;
SCR.tex=new THREE.CanvasTexture(SCR.c);SCR.tex.colorSpace=THREE.SRGBColorSpace;
function drawScreen(lines,logo){const g=SCR.c.getContext('2d'),w=SCR.c.width,h=SCR.c.height;g.fillStyle='#000';g.fillRect(0,0,w,h);g.textAlign='center';
  if(logo){g.fillStyle='#4fc3f7';g.font=`bold ${IS_TAB?72:46}px Arial`;g.fillText(IS_TAB?'BenchTab':'BenchPhone',w/2,h*.46);g.fillStyle='#8a9bb0';g.font=`${IS_TAB?28:20}px Arial`;g.fillText('Starting…',w/2,h*.53)}
  else{g.textAlign='left';g.fillStyle='#cfd8e3';g.font=`${IS_TAB?26:17}px Consolas, monospace`;lines.forEach((l,k)=>g.fillText(l,w*.07,h*.12+k*(IS_TAB?44:31)))}
  SCR.tex.needsUpdate=true}
/* zones that would cover other zones only exist while their step is active (show/hide the group) */
function zoneGroup(id){const g=reg(id,new THREE.Group());LG.add(g);g.visible=false;return g}
const CONN_LABEL={camConn:'CAM',fcamConn:'F-CAM',battConn:'BATT',dispConn:'DISP',touchConn:'TOUCH',portConn:'PORT',lcdConn:'LCD',digiConn:'DIGI'};

function buildDevice(){
  const G=LG,{hw,hl,wall}=DL,t=.25;
  /* back glass + mid-frame floor + walls */
  bx(-hw,0,-hl,hw,.12,hl,LMAT.shell,G,IS_TAB?.6:.9);
  bx(-hw+.15,.12,-hl+.15,hw-.15,FY,hl-.15,LMAT.inner,G);
  bx(-hw,.12,-hl,hw,wall,-hl+t,LMAT.shell,G);bx(-hw,.12,hl-t,hw,wall,hl,LMAT.shell,G);
  bx(-hw,.12,-hl,-hw+t,wall,hl,LMAT.shell,G);bx(hw-t,.12,-hl,hw,wall,hl,LMAT.shell,G);
  box(DL.cam,FY-.01,FY+.01,MAT.matte,G);                                             // camera window in the back
  const port=new THREE.Group();G.add(port);const pz=DL.port[3];bx(-.45*DL.sc,.3,hl-.02,.45*DL.sc,.55,hl+.01,MAT.matte,port,.1);
  /* side buttons */
  const pb=reg('pwrBtn',new THREE.Group());G.add(pb);
  if(IS_TAB){pb.position.set(DL.pwr.x,.45,-hl-.08);bx(-1.2,-.12,-.08,1.2,.12,.08,LMAT.shell,pb,.06);hitBox(pb,[0,0,-.3],[3.2,1.2,1.2])}
  else{pb.position.set(hw+.08,.45,DL.pwr.z);bx(-.08,-.12,-.9,.08,.12,.9,LMAT.shell,pb,.06);hitBox(pb,[.3,0,0],[1.2,1.2,2.6])}
  clickable(pb,'pwrBtn');pb.visible=false;
  if(DL.sim){bx(-hw-.01,.32,DL.sim.z-.9,-hw+.05,.58,DL.sim.z+.9,MAT.matte,G);const h=cyl(.05,.05,MAT.black,G,'x');h.position.set(-hw-.01,.45,DL.sim.z+1.05);
    new Zone('simSlot',G,[-hw-.5,.45,DL.sim.z],[1.2,1.2,2.4])}
  /* drop zones in the frame */
  new Zone('boardBay',G,ctr(DL.board,.5),siz(DL.board,.8));
  new Zone('camBay',G,ctr(DL.cam,.55),siz(DL.cam,.8));
  new Zone('fcamBay',G,ctr(DL.fcam,.75),siz(DL.fcam,.6));
  new Zone('portBay',G,ctr(DL.port,.5),siz(DL.port,.7));
  DL.spk.forEach((r,i)=>new Zone('spkBay',G,ctr(r,.5),siz(r,.7),{i}));
  if(DL.tap)new Zone('tapBay',G,ctr(DL.tap,.5),siz(DL.tap,.7));
  new Zone('battBay',G,ctr(DL.batt,.5),siz(DL.batt,.8));
  /* ---------- logic board (hidden until placed) ---------- */
  const mb=reg('board',new THREE.Group());G.add(mb);mb.visible=false;
  box(DL.board,.27,.35,MAT.pcb,mb);
  const [bx0,bz0,bx1,bz1]=DL.board,cx=(bx0+bx1)/2,cz=(bz0+bz1)/2;
  bx(cx-.7*DL.sc,.35,cz-.6*DL.sc,cx+.5*DL.sc,.45,cz+.4*DL.sc,MAT.black,mb,.03);                    // SoC
  bx(cx+.7*DL.sc,.35,cz-.6*DL.sc,cx+1.4*DL.sc,.42,cz+.1*DL.sc,MAT.black,mb,.03);                   // storage
  for(let k=0;k<14;k++){const x=rnd(bx0+.2,bx1-.2),z=rnd(bz0+.2,bz1-.2);bx(x-.06,.35,z-.04,x+.06,.39,z+.04,MAT.grey,mb)}
  const sh=bx(cx-1.1*DL.sc,.45,cz-.8*DL.sc,cx+.9*DL.sc,.5,cz+.6*DL.sc,MAT.steel,mb,.03);                // RF shield can
  DL.boardScrews.forEach(([x,z])=>{const r=cyl(.16*DL.sc,.02,MAT.chrome,mb);r.position.set(x,.355,z)});
  for(const n in DL.conns){const [x,z]=DL.conns[n];bx(x-DL.cw/2,.35,z-DL.cd/2,x+DL.cw/2,.43,z+DL.cd/2,MAT.black,mb,.02);
    const lb=label(CONN_LABEL[n],V3(0,0,0),.9*DL.sc);scene.remove(lb);mb.add(lb);lb.position.set(x,IS_TAB?.9:.75,z+(IS_TAB?-.7:-.45));lb.userData.connLabel=1;
    new Zone(n,mb,[x,.55,z],[DL.cw+.15,.5,DL.cd+.2])}
  /* ---------- parts that get installed (hidden) ---------- */
  const cam=reg('camG',new THREE.Group());G.add(cam);cam.visible=false;
  box(DL.cam,FY,.68,MAT.black,cam,.15);
  const [c0,c1,c2,c3]=DL.cam,lr=Math.min(c2-c0,c3-c1)*.2;
  [[.3,.3],[.7,.3],[.3,.72]].forEach(([u,v])=>{const l=cyl(lr,.06,LMAT.lens,cam);l.position.set(c0+(c2-c0)*u,.7,c1+(c3-c1)*v)});
  const fc=reg('fcamG',new THREE.Group());G.add(fc);fc.visible=false;box(DL.fcam,.5,.66,MAT.black,fc,.1);
  const fl=cyl(.14*DL.sc,.03,LMAT.lens,fc);fl.position.set(ctr(DL.fcam,0)[0]-.3*DL.sc,.68,ctr(DL.fcam,0)[2]);
  const pg=reg('portG',new THREE.Group());G.add(pg);pg.visible=false;
  box(DL.port,FY,.55,MAT.alu,pg,.1);bx(-.4*DL.sc,.32,DL.port[3]-.1,.4*DL.sc,.5,DL.port[3]+.02,MAT.matte,pg,.08);
  bx(DL.portFlexX-.15,FY,DL.flexZ+.6,DL.portFlexX+.15,FY+.02,DL.port[1]+.2,LMAT.ribbon,pg);          // flex strip up the side
  const sp=reg('spkG',new THREE.Group());G.add(sp);sp.visible=false;
  DL.spk.forEach(r=>{box(r,FY,.6,MAT.black,sp,.1);const m=mesh(new THREE.PlaneGeometry(Math.abs(r[2]-r[0])*.8,Math.abs(r[3]-r[1])*.7),texMat(TEX.mesh,{roughness:.7}),sp,{cast:false});m.rotation.x=-Math.PI/2;m.position.set(...ctr(r,.605))});
  if(DL.tap){const tg=reg('tapG',new THREE.Group());G.add(tg);tg.visible=false;box(DL.tap,FY,.6,MAT.alu,tg,.12)}
  const ad=reg('battAdh',new THREE.Group());G.add(ad);ad.visible=false;
  const [b0,b1,b2,b3]=DL.batt;for(const f of [.25,.75]){const x=b0+(b2-b0)*f;bx(x-.35*DL.sc,FY,b1+.3,x+.35*DL.sc,FY+.02,b3-.3,LMAT.adhesive,ad)}
  const bt=reg('battG',new THREE.Group());G.add(bt);bt.visible=false;
  box(DL.batt,FY+.02,IS_TAB?.55:.62,MAT.black,bt,.15);if(IS_TAB)bx(-.05,.56,b1+.2,.05,.565,b3-.2,MAT.grey,bt);
  const bl=mesh(new THREE.PlaneGeometry((b2-b0)*.55,(b3-b1)*.3),texMat(ctex(512,256,g=>{g.fillStyle='#eceff2';g.fillRect(0,0,512,256);g.fillStyle='#111';g.font='bold 54px Arial';g.fillText('Li-ion',30,80);g.font='bold 40px Arial';g.fillText(IS_TAB?'7.6 V  28.9 Wh':'3.87 V  12.7 Wh',30,150);g.font='26px Arial';g.fillStyle='#b71c1c';g.fillText('⚠ Do not puncture or bend',30,215)})),bt,{cast:false});
  bl.rotation.x=-Math.PI/2;bl.position.set((b0+b2)/2,(IS_TAB?.55:.62)+.005,(b1+b3)/2);
  /* tablet LCD (sits over the battery) */
  if(IS_TAB){const lc=reg('lcdG',new THREE.Group());G.add(lc);lc.visible=false;box(DL.lcd,.58,.68,LMAT.lcd,lc,.08);box([DL.lcd[0]+.4,DL.lcd[1]+.4,DL.lcd[2]-.4,DL.lcd[3]-.4],.68,.685,MAT.white,lc);
    new Zone('lcdBay',zoneGroup('zLcd'),ctr(DL.lcd,.7),siz(DL.lcd,.5))}
  /* connector shield + hole */
  const sg=reg('shieldG',new THREE.Group());G.add(sg);sg.visible=false;box(DL.shield,.6,.64,MAT.steel,sg,.02);
  new Zone('shieldSpot',zoneGroup('zShield'),ctr(DL.shield,.75),siz(DL.shield,.4));
  const hz=new Zone('shieldHole',sg,[DL.hole[0],.8,DL.hole[1]],[.5*DL.sc,.5,.5*DL.sc]);
  reg('shieldScrew',cyl(.13*DL.sc,.05,MAT.chrome,sg)).position.set(DL.hole[0],.66,DL.hole[1]);OBJ.shieldScrew.visible=false;
  /* adhesive gasket around the rim */
  const gk=reg('gasketG',new THREE.Group());G.add(gk);gk.visible=false;
  for(const [x0,z0,x1,z1] of [[-hw,-hl,hw,-hl+t],[-hw,hl-t,hw,hl],[-hw,-hl,-hw+t,hl],[hw-t,-hl,hw,hl]])bx(x0,wall,z0,x1,wall+.02,z1,LMAT.adhesive,gk);
  new Zone('rim',zoneGroup('zRim'),[0,wall+.15,0],[hw*2+.4,.3,hl*2+.4]);
  /* display (phone) / front glass (tablet): hinged on the right edge, lies open beside the device */
  const dp=reg('dispPivot',new THREE.Group());G.add(dp);dp.position.set(hw,wall,0);dp.rotation.z=Math.PI;dp.visible=false;
  bx(-2*hw,0,-hl,0,.2,hl,LMAT.glass,dp,IS_TAB?.5:.85);
  const scr=reg('screen',mesh(new THREE.PlaneGeometry(2*hw-.5*DL.sc,2*hl-(IS_TAB?1.2:.9)),LMAT.glass,dp,{cast:false}));scr.rotation.x=-Math.PI/2;scr.position.set(-hw,.205,0);
  hitBox(dp,[-hw,.1,0],[2*hw,.6,2*hl]);clickable(dp,'display');
  new Zone('dispSide',G,[hw+hw+.3,.4,0],[2*hw,.8,2*hl]);
}
/* a flex cable from `from` (local point) into connector n */
function connectFlex(n,from,col){
  const [x,z]=DL.conns[n],g=new THREE.Group();LG.add(g);
  const pts=[V3(...from),V3((from[0]+x)/2,Math.max(from[1],.75),(from[2]+z)/2),V3(x,.62,z)];
  const t=tube(pts,.05*DL.sc,col||LMAT.ribbon,g,24);CABLES.push(t);
  const p=bx(x-DL.cw/2+.03,.43,z-DL.cd/2+.03,x+DL.cw/2-.03,.56,z+DL.cd/2-.03,MAT.black,g,.02);p.position.y+=.4;tweenTo(p,{pos:V3(p.position.x,p.position.y-.4,p.position.z),dur:300});
  OBJ.board.children.forEach(c=>{if(c.userData.connLabel&&Math.abs(c.position.x-x)<.01&&Math.abs(c.position.z-z-(IS_TAB?-.7:-.45))<.01)c.visible=false});
  return g;
}
function closeDisplay(done){const d=OBJ.dispPivot;LG.children.forEach(c=>{if(c.userData&&c.isSprite)c.visible=false});
  OBJ.board.children.forEach(c=>{if(c.userData.connLabel)c.visible=false});
  show('pwrBtn');tween(1100,k=>d.rotation.z=Math.PI*(1-ease(k)),done)}
