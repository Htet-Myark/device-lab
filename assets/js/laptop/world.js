'use strict';
/* PC Lab Assembly: Laptop Lab | MIT License | Educational use only. See DISCLAIMER.md */
/* =================== BUILD THE LAPTOP ===================
   Everything lives in LG, a group sitting on the antistatic mat. Local units are cm, y is up.
   The base starts upside down with the lid closed underneath it, so the inside faces the camera.
   The hinge runs along the back edge (z = -11); the palm rest is at the front (z = +11). */
const LP=V3(68,.25,13);
const LG=new THREE.Group();scene.add(LG);LG.position.copy(LP);LG.visible=false;
const L=(x,y,z)=>LG.localToWorld(V3(x,y,z));
const MB_SCREWS=[[-14.6,2.0],[-6.8,-9.9],[9.4,-9.9],[9.4,1.9],[-5.8,-5.2]];
const HS_SCREWS=[[-.6,-7.4],[3.6,-3.8],[3.6,-7.4],[-.6,-3.8]];          // tightening order 1-2-3-4 (diagonal)
const COVER_SCREWS=[[-15,-10],[0,-10.2],[15,-10],[-15,10],[0,10.2],[15,10]];
const BATT_SCREWS=[[-8.5,4.7],[8.5,4.7]];
const PORTS=[['usbcPD',-7.6,'c'],['usbcData',-5.9,'c'],['hdmi',-3.7,'hdmi'],['usbA',-1.0,'a']];

const LMAT={
  shell:std({color:0x4a4f57,roughness:.32,metalness:.8,map:TEX.brush}),
  inner:std({color:0x24272d,roughness:.75,metalness:.15}),
  ribbon:std({color:0xd9a441,roughness:.4,metalness:.25}),
  silicon:std({color:0x2b3d52,roughness:.12,metalness:.6}),
  substrate:std({color:0x1f6b46,roughness:.45,metalness:.1}),
  beige:std({color:0xe8dfc8,roughness:.5}),
  key:std({color:0x1a1c20,roughness:.55}),
  screenOff:std({color:0x06080b,roughness:.38,metalness:.2}),
  wireW:std({color:0xe8e8e8,roughness:.45}),
  wireR:std({color:0xd32f2f,roughness:.45}),
};

/* ---------- textures ---------- */
const PX=50;   // board texture: 50 px per cm
TEX.lbBoard=ctex(25.2*PX,13*PX,(g,w,h)=>{
  const P=(x,z)=>[(x+15.2)*PX,(z+10.4)*PX];
  const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#1f5f3f');gr.addColorStop(1,'#11402a');g.fillStyle=gr;g.fillRect(0,0,w,h);
  for(let i=0;i<6000;i++){g.fillStyle=`rgba(0,0,0,${rnd(.02,.08)})`;g.fillRect(rnd(0,w),rnd(0,h),2,2)}
  g.strokeStyle='rgba(90,200,140,.22)';g.lineWidth=2.2;
  const path=pts=>{g.beginPath();pts.forEach((p,k)=>{const [x,y]=P(...p);k?g.lineTo(x,y):g.moveTo(x,y)});g.stroke()};
  for(let k=0;k<9;k++)path([[-7.2,-9.4+k*.3],[-2.2+k*.1,-9.4+k*.3],[-1+k*.1,-7.2]]);
  for(let k=0;k<7;k++)path([[3.9,-6.6+k*.3],[8.2,-6.6+k*.3],[8.2+k*.15,-3.6]]);
  for(let k=0;k<6;k++)path([[-6.4,-1.6+k*.25],[-5.6,-1.6+k*.25]]);
  for(let k=0;k<8;k++)path([[.4+k*.3,-4.1],[.4+k*.3,-2.6],[2.6+k*.3,1.4]]);
  for(let i=0;i<260;i++){g.fillStyle='rgba(200,170,90,.55)';g.beginPath();g.arc(rnd(0,w),rnd(0,h),1.6,0,7);g.fill()}
  MB_SCREWS.forEach(([x,z])=>{const [a,b]=P(x,z);g.fillStyle='#c9ced4';g.beginPath();g.arc(a,b,18,0,7);g.fill();g.fillStyle='#0b0d0f';g.beginPath();g.arc(a,b,9,0,7);g.fill()});
  g.fillStyle='rgba(238,246,240,.88)';g.textAlign='center';g.textBaseline='middle';
  const t=(s,x,z,px=22)=>{g.font=`bold ${px}px Arial`;const [a,b]=P(x,z);g.fillText(s,a,b)};
  t('DIMM_A',-11.1,-8.3,26);t('DIMM_B',-11.1,-4.8,26);
  t('M.2 SSD  (M key)',-10.2,-1.4,24);t('WLAN (E)',-3.3,-.05,18);
  t('U1  CPU (BGA)',1.5,-3.3,20);t('FAN',9,-3.9);t('SPK',8.1,1.05);t('BATT',-4.6,1.05);t('TP',0,1.2);t('KB',4.4,1.15);t('eDP',-2.75,-9.15);
  t('BENCHBOOK LB-14',5.7,-1.8,30);t('REV 1.0',5.7,-1.15,18);
  g.strokeStyle='rgba(238,246,240,.55)';g.lineWidth=2;
  const [a0,b0]=P(-.9,-7.7),[a1,b1]=P(3.9,-3.5);g.strokeRect(a0,b0,a1-a0,b1-b0);
});
TEX.lbWifi=ctex(300,220,(g,w,h)=>{g.fillStyle='#15284a';g.fillRect(0,0,w,h);
  g.fillStyle='#e6eef7';g.font='bold 34px Arial';g.textAlign='right';g.textBaseline='middle';g.fillText('MAIN',196,50);g.fillText('AUX',196,170);
  g.fillStyle='#111';g.beginPath();g.moveTo(206,40);g.lineTo(206,60);g.lineTo(196+22,50);g.fill();
  g.fillStyle='#fff';g.beginPath();g.moveTo(206,160);g.lineTo(206,180);g.lineTo(196+22,170);g.fill();});
TEX.lbSsd=ctex(800,220,(g,w,h)=>{g.fillStyle='#174b31';g.fillRect(0,0,w,h);g.fillStyle='#1b1d21';g.fillRect(120,20,640,180);
  g.fillStyle='#e6eef7';g.font='bold 46px Arial';g.fillText('NVMe SSD  512 GB',150,90);g.font='30px Arial';g.fillStyle='#9fb0c2';g.fillText('M.2 2280 · PCIe Gen4 x4',150,150)});
TEX.lbBatt=ctex(1024,340,(g,w,h)=>{g.fillStyle='#16181b';g.fillRect(0,0,w,h);g.fillStyle='#eceff2';g.fillRect(60,40,620,260);
  g.fillStyle='#111';g.font='bold 52px Arial';g.fillText('Li-ion BATTERY',90,110);g.font='bold 40px Arial';g.fillText('11.55 V  4680 mAh  54 Wh',90,175);
  g.font='26px Arial';g.fillStyle='#b71c1c';g.fillText('⚠ Do not puncture, crush or short-circuit.',90,235);g.fillStyle='#333';g.fillText('Disconnect before servicing.',90,272);
  g.fillStyle='#ffca28';g.font='bold 120px Arial';g.fillText('⚡',780,220)});
TEX.lbCover=ctex(1024,704,(g,w,h)=>{g.fillStyle='#4a4f57';g.fillRect(0,0,w,h);
  for(let i=0;i<2000;i++){const v=rnd(90,140)|0;g.strokeStyle=`rgba(${v},${v},${v},.25)`;g.beginPath();const y=rnd(0,h);g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
  g.fillStyle='#0b0c0e';for(let r=0;r<6;r++)for(let c=0;c<16;c++)g.fillRect(620+c*24,26+r*26,14,16);           // fan vents (above the fan)
  g.fillStyle='#d5d9de';g.fillRect(360,460,300,120);g.fillStyle='#222';g.font='bold 26px Arial';g.fillText('BenchBook LB-14',380,500);g.font='20px Arial';g.fillText('Model LB14 · 20V ⎓ 3.25A',380,535);g.fillText('S/N BB-LB-04417',380,565)});
const SCR={c:document.createElement('canvas')};SCR.c.width=1024;SCR.c.height=640;
SCR.tex=new THREE.CanvasTexture(SCR.c);SCR.tex.colorSpace=THREE.SRGBColorSpace;
function drawScreen(lines,logo){const g=SCR.c.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,1024,640);
  if(logo){g.fillStyle='#4fc3f7';g.font='bold 70px Arial';g.textAlign='center';g.fillText('BenchBook',512,300);g.font='26px Arial';g.fillStyle='#8a9bb0';g.fillText('Press F2 for setup',512,360);g.textAlign='left'}
  else{g.fillStyle='#cfd8e3';g.font='24px Consolas, monospace';lines.forEach((l,k)=>g.fillText(l,40,56+k*34))}
  SCR.tex.needsUpdate=true}

/* ---------- build ---------- */
function buildLaptop(){
  const G=LG;
  /* lid (closed underneath) on a hinge pivot */
  const lid=reg('lid',new THREE.Group());G.add(lid);lid.position.set(0,.3,-11);
  bx(-16,-.3,0,16,.3,22,LMAT.shell,lid,.25);
  mesh(new THREE.PlaneGeometry(31.2,21.2),MAT.matte,lid,{cast:false}).position.set(0,.305,11);
  const scr=reg('screen',mesh(new THREE.PlaneGeometry(29.2,18.6),LMAT.screenOff,lid,{cast:false}));scr.rotation.set(-Math.PI/2,0,Math.PI);scr.position.set(0,.31,10.9);
  lid.children[1].rotation.x=-Math.PI/2;
  for(const x of [-10,10]){const h=cyl(.42,4,MAT.black,G,'x');h.position.set(x,.35,-11)}
  /* keyboard deck (outer face points down for now) */
  bx(-16,.62,-11,16,1.0,11,LMAT.shell,G,.3);
  const keys=[];for(let r=0;r<5;r++)for(let c=0;c<14;c++)keys.push([-12.35+c*1.9,.56,-9.2+r*1.9]);
  const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1.6,.12,1.6),LMAT.key,keys.length+1),m4=new THREE.Matrix4();
  keys.forEach(([x,y,z],k)=>{m4.makeTranslation(x,y,z);im.setMatrixAt(k,m4)});
  m4.compose(V3(0,.56,.3),new THREE.Quaternion(),V3(6,1,1));im.setMatrixAt(keys.length,m4);G.add(im);
  const tp=mesh(new THREE.PlaneGeometry(10,6),std({color:0x3a3f47,roughness:.35,metalness:.5}),G,{cast:false});tp.rotation.x=Math.PI/2;tp.position.set(0,.615,5.5);
  const pb=reg('pwrBtnL',new THREE.Group());G.add(pb);pb.position.set(-12.5,.58,-10.3);pb.visible=false;
  cyl(.55,.1,MAT.black,pb);reg('pwrLedL',mesh(new THREE.SphereGeometry(.12,10,10),MAT.led.clone(),pb)).position.set(0,-.06,0);hitBox(pb,[0,0,0],[1.8,.8,1.8]);clickable(pb,'pwrBtnL');
  /* walls of the base (open side up) */
  bx(-16,1,-11,16,2.2,-10.7,LMAT.shell,G);bx(-16,1,10.7,16,2.2,11,LMAT.shell,G);
  bx(-16,1,-10.7,-15.7,2.2,10.7,LMAT.shell,G);bx(15.7,1,-10.7,16,2.2,10.7,LMAT.shell,G);
  bx(-15.7,1,-10.7,15.7,1.02,10.7,LMAT.inner,G);
  for(let k=0;k<6;k++)bx(-9.2,1.02,4.4+k*1.1,9.2,1.08,4.5+k*1.1,LMAT.inner,G);               // battery bay ribs
  MB_SCREWS.forEach(([x,z])=>{const b=cyl(.45,.18,MAT.black,G);b.position.set(x,1.1,z)});
  /* side ports (left wall) + charging LED */
  for(const [,z,k] of PORTS){
    if(k==='c'){bx(-16.05,1.42,z-.45,-15.95,1.68,z+.45,MAT.matte,G,.1)}
    else if(k==='hdmi'){bx(-16.05,1.35,z-.75,-15.95,1.75,z+.75,MAT.matte,G,.05)}
    else{bx(-16.05,1.3,z-.65,-15.95,1.8,z+.65,MAT.matte,G,.05);bx(-16.06,1.55,z-.5,-15.9,1.62,z+.5,MAT.blue,G)}
  }
  const bolt=mesh(new THREE.PlaneGeometry(.7,.7),texMat(ctex(64,64,g=>{g.fillStyle='#ffca28';g.font='bold 54px Arial';g.textAlign='center';g.fillText('⚡',32,52)}),{transparent:true}),G,{cast:false});
  bolt.rotation.y=-Math.PI/2;bolt.position.set(-16.06,1.95,-7.6);bolt.rotation.x=Math.PI;
  reg('chgLed',mesh(new THREE.SphereGeometry(.13,10,10),MAT.led.clone(),G)).position.set(-16.05,1.55,-9.1);
  new Zone('mbBay',G,[-2.6,1.5,-3.9],[25.2,1.2,13]);
  new Zone('battBay',G,[0,1.5,7.3],[18.4,1.4,6.2]);
  [[12.85,8.2],[-12.85,8.2]].forEach(([x,z],i)=>new Zone('spkBay',G,[x,1.5,z],[5.2,1.4,4.4],{i}));
  PORTS.forEach(([n,z])=>new Zone(n,G,[-16.4,1.55,z],[1.2,1.1,1.3]));

  /* ribbons and cables that belong to the base: loose first, connected versions hidden */
  for(const [n,x0,x1] of [['kb',2.7,6.1],['tp',-.9,.9]]){
    bx(x0-.1,1.02,3.0,x1+.1,1.03,3.3,MAT.matte,G);
    reg(n+'Loose',bx(x0,1.03,3.15,x1,1.06,n==='kb'?7.2:6.2,LMAT.ribbon,G));
    const on=reg(n+'On',new THREE.Group());G.add(on);on.visible=false;
    bx(x0,1.03,3.1,x1,1.44,3.16,LMAT.ribbon,on);bx(x0,1.4,n==='kb'?1.75:1.85,x1,1.44,3.16,LMAT.ribbon,on);
  }
  const wire=(id,pts,r,m)=>{const t=tube(pts.map(p=>V3(...p)),r,m,G,60);reg(id,t);CABLES.push(t);return t};
  wire('edpLoose',[[-2.8,2.2,-10.85],[-2.8,2.75,-11.6],[-2.4,.4,-13.2],[-.5,.06,-15]],.3,MAT.cable);
  const eo=reg('edpOn',new THREE.Group());G.add(eo);eo.visible=false;
  const et=tube([V3(-2.8,2.2,-10.85),V3(-2.8,2.05,-10.45),V3(-2.75,1.7,-10.05),V3(-2.75,1.65,-10)],.3,MAT.cable,eo,30);CABLES.push(et);
  bx(-3.9,1.5,-10.3,-1.6,1.7,-9.7,MAT.steel,eo,.05);bx(-3.2,1.7,-10.2,-2.3,1.78,-9.4,MAT.red,eo);
  wire('antMainLoose',[[-6.4,2.2,-10.85],[-6.5,2.7,-11.5],[-7,.3,-13.4],[-9.2,.05,-15.6]],.11,MAT.cable);
  wire('antAuxLoose',[[-7.2,2.2,-10.85],[-7.3,2.7,-11.5],[-8.4,.3,-13],[-11.2,.05,-14.4]],.11,LMAT.wireW);

  /* ---------- system board ---------- */
  const mb=reg('mb',new THREE.Group());G.add(mb);mb.visible=false;
  bx(-15.2,1.15,-10.4,10,1.3,2.6,MAT.pcb,mb);
  const dec=mesh(new THREE.PlaneGeometry(25.2,13),texMat(TEX.lbBoard,{roughness:.5,metalness:.12}),mb,{cast:false});dec.rotation.x=-Math.PI/2;dec.position.set(-2.6,1.302,-3.9);
  bx(-.8,1.3,-7,3.8,1.38,-4.2,LMAT.substrate,mb);bx(.5,1.38,-6.3,2.5,1.5,-4.9,LMAT.silicon,mb);
  for(let k=0;k<10;k++){const x=rnd(-.6,3.6),z=k%2?-7.3:-3.9;bx(x-.12,1.3,z-.08,x+.12,1.38,z+.08,MAT.grey,mb)}
  for(let k=0;k<6;k++)bx(5+k*.8,1.3,-7.4,5.6+k*.8,1.62,-6.8,MAT.black,mb,.05);                 // VRM chokes
  /* SO-DIMM slots (side by side) */
  [[-10.2],[-6.6]].forEach(([z],i)=>{
    bx(-14.6,1.3,z,-7.6,1.7,z+.5,MAT.black,mb,.05);
    for(const x of [-14.8,-7.4]){bx(x-.12,1.3,z+2.6,x+.12,1.75,z+3.1,MAT.steel,mb)}
    const m=reg('ram-'+i,new THREE.Group());mb.add(m);m.position.set(-11.1,1.55,z+.45);m.visible=false;
    bx(-3.35,-.05,-.1,3.35,.05,2.7,MAT.pcb,m);bx(-3.35,-.06,-.1,3.35,.06,.2,MAT.gold,m);
    for(let c=0;c<4;c++)bx(-3+c*1.6,.05,.5,-1.8+c*1.6,.16,2.2,MAT.black,m,.03);
    hitBox(m,[0,.2,1.3],[6.8,.8,3]);clickable(m,'ram-'+i);
    new Zone('ram',mb,[-11.1,1.65,z+1.9],[7,1,3.1],{i});
  });
  /* M.2 slots: SSD (M key, 2280) and Wi-Fi (E key, 2230), each with a standoff and a retaining screw */
  [['m2ssd',-14.8,-6.0],['m2wifi',-5.4,-1.6]].forEach(([n,x0,xs],i)=>{
    bx(x0,1.3,-2.6,x0+.7,1.65,-.2,MAT.black,mb,.04);
    const so=cyl(.28,.25,MAT.brass,mb,'y',6);so.position.set(xs,1.42,-1.4);
    const s=reg('m2s-'+i,new THREE.Group());mb.add(s);s.position.set(xs,1.58,-1.4);
    const hd=cyl(.32,.14,MAT.chrome,s);hd.position.y=.07;bx(-.22,.13,-.03,.22,.16,.03,MAT.matte,s);bx(-.03,.13,-.22,.03,.16,.22,MAT.matte,s);
    hitBox(s,[0,.2,0],[1.4,1,1.4]);clickable(s,'m2s-'+i);
    new Zone(n,mb,[(x0+xs)/2,1.65,-1.4],[xs-x0+.4,1,2.6]);
  });
  /* headers and connectors along the front edge, eDP at the back */
  bx(8.4,1.3,-3.4,9.6,1.6,-2.8,MAT.white,mb);bx(7.6,1.3,1.6,8.6,1.55,2.2,MAT.white,mb);
  bx(2.4,1.3,1.6,6.4,1.45,2.3,MAT.black,mb);bx(-1.2,1.3,1.7,1.2,1.42,2.3,MAT.black,mb);
  bx(-6.2,1.3,1.6,-3.0,1.62,2.3,LMAT.beige,mb);bx(-4,1.3,-10.3,-1.5,1.5,-9.7,MAT.steel,mb);
  for(const [id,x,w,open] of [['kbLatch',4.4,4,false],['tpLatch',0,2.4,true]]){
    const l=new THREE.Group();mb.add(l);l.position.set(x,1.45,1.62);
    bx(-w/2,0,0,w/2,.08,.5,MAT.matte,l);hitBox(l,[0,.2,.3],[w+.6,.9,1.2]);clickable(l,id);if(open)l.rotation.x=-1.3;
  }
  new Zone('cpuDie',mb,[1.5,1.8,-5.6],[4.6,1,3]);
  new Zone('fanHdr',mb,[9,1.7,-3.1],[1.6,1,1]);new Zone('spkHdr',mb,[8.1,1.7,1.9],[1.4,1,1]);
  new Zone('kbZif',mb,[4.4,1.7,1.95],[4.2,1,1.1]);new Zone('tpZif',mb,[0,1.7,2.0],[2.6,1,1.1]);
  new Zone('battConn',mb,[-4.6,1.7,1.95],[3.4,1,1.1]);new Zone('edpConn',mb,[-2.75,1.7,-10],[2.8,1,1]);

  /* ---------- parts that get installed (hidden) ---------- */
  reg('lPaste',mesh(new THREE.SphereGeometry(.45,16,10),MAT.grey,G)).scale.set(1,.3,1);OBJ.lPaste.position.set(1.5,1.52,-5.6);OBJ.lPaste.visible=false;
  const hs=reg('hs',new THREE.Group());G.add(hs);hs.visible=false;
  bx(0,1.5,-6.8,3,1.62,-4.4,MAT.copper,hs);bx(-.9,1.62,-7.7,3.9,1.68,-3.5,MAT.steel,hs);
  tube([V3(1.5,1.74,-5.6),V3(5,1.78,-6.6),V3(8.8,1.78,-8.1),V3(10.7,1.78,-8.1)],.35,MAT.copper,hs,40);
  const fins=new THREE.InstancedMesh(new THREE.BoxGeometry(.9,1,.12),MAT.alu,16);for(let k=0;k<16;k++){m4.makeTranslation(10.7,1.6,-10.3+k*.28);fins.setMatrixAt(k,m4)}hs.add(fins);
  const fan=new THREE.Group();hs.add(fan);fan.position.set(13.2,1.5,-8.1);
  cyl(2.3,.9,MAT.black,fan,'y',36);const top=cyl(2.35,.06,MAT.matte,fan,'y',36);top.position.y=.48;
  const blades=reg('lFan',new THREE.Group());fan.add(blades);blades.position.y=.52;
  for(let k=0;k<11;k++){const b=bx(.3,-.02,-.08,1.9,.02,.08,MAT.blade,blades);b.parent.remove(b);const p=new THREE.Group();p.add(b);p.rotation.y=k*Math.PI*2/11;b.rotation.x=.4;blades.add(p)}
  cyl(.5,.06,MAT.alu,blades);
  const fw=reg('fanWire',new THREE.Group());G.add(fw);fw.visible=false;
  [MAT.red,MAT.black,std({color:0xfdd835}),MAT.blue].forEach((m,k)=>{const t=tube([V3(11.6+k*.12,1.6,-5.8),V3(10.4,1.55,-4.2),V3(9.1+k*.12,1.62,-3.3)],.05,m,fw,20);CABLES.push(t)});
  bx(8.6,1.6,-3.35,9.4,1.85,-2.85,MAT.white,fw);
  /* SSD & Wi-Fi modules */
  const ssd=reg('ssdG',new THREE.Group());G.add(ssd);ssd.visible=false;
  bx(-14.2,1.5,-2.5,-6.2,1.58,-.3,MAT.pcb,ssd);bx(-14.4,1.49,-2.5,-14.1,1.59,-.3,MAT.gold,ssd);
  const sl=mesh(new THREE.PlaneGeometry(8,2.2),texMat(TEX.lbSsd),ssd,{cast:false});sl.rotation.x=-Math.PI/2;sl.position.set(-10.2,1.585,-1.4);
  const wf=reg('wifiG',new THREE.Group());G.add(wf);wf.visible=false;
  bx(-4.8,1.5,-2.5,-1.8,1.58,-.3,MAT.pcbBlue,wf);bx(-5,1.49,-2.5,-4.7,1.59,-.3,MAT.gold,wf);
  const wl=mesh(new THREE.PlaneGeometry(3,2.2),texMat(TEX.lbWifi),wf,{cast:false});wl.rotation.x=-Math.PI/2;wl.position.set(-3.3,1.585,-1.4);
  bx(-4.6,1.58,-2.3,-3.5,1.7,-.5,MAT.alu,wf);
  for(const z of [-2,-.8]){const c=cyl(.24,.1,MAT.gold,wf);c.position.set(-2.5,1.63,z)}
  new Zone('antMain',wf,[-2.5,1.95,-2.0],[.95,.9,.95]);new Zone('antAux',wf,[-2.5,1.95,-.8],[.95,.9,.95]);
  for(const [id,z,m,dz] of [['antMainOn',-2,MAT.cable,0],['antAuxOn',-.8,LMAT.wireW,.35]]){
    const g=reg(id,new THREE.Group());G.add(g);g.visible=false;
    const t=tube([V3(-6.4-dz*2,2.2,-10.85),V3(-6.6-dz,1.85,-9.9),V3(-6.4-dz,1.85,-4.5),V3(-3.4,1.82,z-.3),V3(-2.55,1.72,z)],.11,m,g,40);CABLES.push(t);
    const s=cyl(.3,.16,MAT.gold,g);s.position.set(-2.5,1.72,z);
  }
  /* speakers */
  const spk=reg('spkG',new THREE.Group());G.add(spk);spk.visible=false;
  for(const s of [1,-1]){const b=bx(s*10.4,1.02,6.2,s*15.3,1.75,10.2,MAT.black,spk,.2);
    const gr=mesh(new THREE.PlaneGeometry(4,3),texMat(TEX.mesh,{roughness:.7}),spk,{cast:false});gr.rotation.x=-Math.PI/2;gr.position.set(s*12.85,1.76,8.2)}
  const lnk=tube([V3(-12.6,1.2,10.2),V3(-10,1.12,10.5),V3(10,1.12,10.5),V3(12.6,1.2,10.2)],.07,MAT.cable,spk,40);CABLES.push(lnk);
  const sw=reg('spkWire',new THREE.Group());G.add(sw);sw.visible=false;
  [MAT.red,MAT.black].forEach((m,k)=>{const t=tube([V3(11.4+k*.15,1.5,6.2),V3(10.2,1.4,3.6),V3(8+k*.15,1.62,1.95)],.06,m,sw,24);CABLES.push(t)});
  bx(7.7,1.55,1.65,8.5,1.8,2.15,MAT.white,sw);
  /* battery */
  const bt=reg('battG',new THREE.Group());G.add(bt);bt.visible=false;
  bx(-9,1.08,4.2,9,1.9,10.2,MAT.black,bt,.2);
  const bl=mesh(new THREE.PlaneGeometry(15,5),texMat(TEX.lbBatt,{roughness:.6}),bt,{cast:false});bl.rotation.x=-Math.PI/2;bl.position.set(-.8,1.905,7.3);
  BATT_SCREWS.forEach(([x,z])=>bx(x-.6,1.7,z-.5,x+.6,1.9,z+.5,MAT.steel,bt));
  const bw=reg('battWire',new THREE.Group());G.add(bw);bw.visible=false;
  [MAT.red,MAT.red,MAT.black,MAT.black].forEach((m,k)=>{const x=-5.6+k*.6;const t=tube([V3(x,1.5,4.2),V3(x,1.55,3.1),V3(x,1.7,2.05)],.07,m,bw,16);CABLES.push(t)});
  bx(-6.1,1.62,1.65,-3.1,1.88,2.25,LMAT.beige,bw);
  /* bottom cover: starts on the desk, left of the mat */
  const cv=reg('coverG',new THREE.Group());scene.add(cv);cv.position.set(26,-2.2,13);
  bx(-16,2.2,-11,16,2.45,11,LMAT.shell,cv,.2);
  const cd=mesh(new THREE.PlaneGeometry(32,22),texMat(TEX.lbCover,{roughness:.4,metalness:.7}),cv,{cast:false});cd.rotation.x=-Math.PI/2;cd.position.set(0,2.455,0);
  for(const z of [-9.2,9.2])bx(-13,2.45,z-.35,13,2.62,z+.35,MAT.rubber,cv,.15);
  const gh=reg('coverGhost',new THREE.Group());G.add(gh);gh.visible=false;
  mesh(new THREE.BoxGeometry(32,.25,22),MAT.ghost,gh,{cast:false}).position.set(0,2.33,0);hitBox(gh,[0,2.4,0],[32,.8,22]);clickable(gh,'coverGhost');
  const fh=reg('laptopHit',new THREE.Group());G.add(fh);fh.visible=false;hitBox(fh,[0,1.4,0],[32.5,3.4,22.5]);clickable(fh,'laptopHit');
  /* charger brick on the desk */
  const ch=reg('brick',new THREE.Group());scene.add(ch);ch.position.set(100,0,40);ch.visible=false;
  bx(-3,0,-3,3,2.6,3,MAT.white,ch,.6);
}
function setLatch(id,open){tweenTo(OBJ[id],{rotX:open?-1.3:0,dur:300})}
const QUP=new THREE.Quaternion().setFromUnitVectors(V3(0,0,1),V3(0,1,0));
function unscrew(id){const o=OBJ[id];driveAnim(o.getWorldPosition(V3(0,0,0)),QUP,-2.5);tweenTo(o,{pos:o.position.clone().add(V3(0,2.5,0)),dur:450,done:()=>o.visible=false})}
/* turn the laptop over (roll about the front-back axis) and open the lid */
function flipLaptop(done){
  scene.children.filter(o=>o.userData.screw).forEach(o=>LG.attach(o));
  hide('laptopHit');
  const y0=LG.position.y,y1=LP.y+2.65;
  tween(1600,k=>{const e=ease(k);LG.position.y=y0+(y1-y0)*e+Math.sin(Math.PI*e)*14;LG.rotation.z=Math.PI*e},()=>{
    show('pwrBtnL');tween(1000,k=>OBJ.lid.rotation.x=1.85*ease(k),done)});
}
