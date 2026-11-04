'use strict';
/* PC Lab Assembly | MIT License | Educational use only. See DISCLAIMER.md */
/* =================== BUILD THE WORLD =================== */
const caseG=new THREE.Group();scene.add(caseG);
function buildDesk(){
  const d=mesh(new THREE.BoxGeometry(260,3,86),[MAT.wood,MAT.wood,MAT.wood,MAT.wood,MAT.wood,MAT.wood],scene);d.position.set(40,-1.5,17);
  for(const [x,z] of [[-86,-22],[166,-22],[-86,56],[166,56]]) bx(x-2.5,-90,z-2.5,x+2.5,-3,z+2.5,std({color:0x2a2d33,roughness:.5,metalness:.6}),scene);
  const floor=mesh(new THREE.PlaneGeometry(600,400),std({color:0x1a1c21,roughness:.95}),scene,{cast:false});floor.rotation.x=-Math.PI/2;floor.position.set(40,-90,20);
  d.material=MAT.wood;
  const wall=mesh(new THREE.PlaneGeometry(400,160),std({color:0x23262d,roughness:.9}),scene,{cast:false});wall.position.set(40,20,-76);wall.scale.set(1,1.4,1);
  const peg=mesh(new THREE.PlaneGeometry(150,64),texMat(TEX.peg,{roughness:.9}),scene,{cast:false});peg.position.set(10,48,-75.5);
  const hook=cyl(.5,6,MAT.chrome,scene,'z');hook.position.set(112,66,-73);
  const hv=reg('vestHook',mesh(new RoundedBoxGeometry(34,46,2.4,3,1.2),texMat(TEX.vest,{roughness:.85}),scene));hv.position.set(112,42,-73.5);
  const hl=mesh(new THREE.PlaneGeometry(7,7),texMat(TEX.esd,{transparent:true}),hv,{cast:false});hl.position.set(8,8,1.25);
  // antistatic mat
  const m=bx(50,0,-8,86,.25,36,MAT.mat,scene,.12);m.castShadow=false;
  const snap=new THREE.Group();scene.add(snap);snap.position.set(83.5,.25,-5.2);cyl(.8,.25,MAT.chrome,snap).position.y=.12;cyl(.35,.3,MAT.steel,snap).position.y=.3;
  new Zone('ground',scene,[83.5,1.2,-5.2],[4,3,4]);
  new Zone('matSpot',scene,[67,1.2,12.5],[28,2.5,33]);
  // a small screw tray & screwdriver for flavour
  const tray=bx(90,0,22,100,.9,30,MAT.black,scene,.3);
  for(let k=0;k<7;k++){const s=cyl(.3,.2,MAT.chrome,scene);s.position.set(91.5+rnd(0,7),1,23.5+rnd(0,5))}
  const sd=reg('sdDesk',new THREE.Group());scene.add(sd);sd.position.set(18,0.9,30);sd.rotation.y=.25;
  const handle=cyl(.9,9,MAT.red,sd,'x',20);handle.position.x=0;const shaft=cyl(.22,10,MAT.chrome,sd,'x',12);shaft.position.x=9.5;hitBox(sd,[5,0,0],[22,3,3]);clickable(sd,'tool-sd');
}
function buildCase(){
  const c=caseG;
  bx(1.4,0,-2.6,47.4,1,20.2,MAT.casePaint,c,.3);            // bottom
  bx(1.4,45,-2.6,47.4,46,20.2,MAT.casePaint,c,.3);          // top
  bx(1.4,0,-2.6,47.4,46,-2.2,MAT.casePaint,c);              // far side panel
  bx(1.8,1,-.3,46,45,0,MAT.caseInner,c);                    // motherboard tray
  for(const [x,z] of [[5,-1],[43,-1],[5,18],[43,18]]){const f=cyl(1.4,1,MAT.rubber,c);f.position.set(x,-.0,z)}
  // rear wall with cut-outs
  const sh=new THREE.Shape();sh.moveTo(-2.6,1);sh.lineTo(20.2,1);sh.lineTo(20.2,45);sh.lineTo(-2.6,45);sh.lineTo(-2.6,1);
  const hole=(z0,y0,z1,y1)=>{const h=new THREE.Path();h.moveTo(z0,y0);h.lineTo(z0,y1);h.lineTo(z1,y1);h.lineTo(z1,y0);h.lineTo(z0,y0);sh.holes.push(h)};
  hole(.5,36.4,15.5,44.6); hole(.7,23.6,5.2,35.2);
  SLOTS.forEach(s=>{const y=35.55-s.y*K;hole(1,y-.95,12.6,y+.95)});
  hole(.7,3,12.6,7.4); // lower spare slot area
  const rw=mesh(new THREE.ExtrudeGeometry(sh,{depth:.2,bevelEnabled:false}),MAT.casePaint,c);rw.rotation.y=-Math.PI/2;rw.position.x=1.6;
  bx(1.42,3,.7,1.58,7.4,12.6,MAT.steel,c);                // fixed blank
  // front bezel
  const fs=new THREE.Shape();fs.moveTo(-2.6,0);fs.lineTo(20.2,0);fs.lineTo(20.2,46);fs.lineTo(-2.6,46);fs.lineTo(-2.6,0);
  const fh=new THREE.Path();fh.moveTo(3,40.6);fh.lineTo(3,44.4);fh.lineTo(17.6,44.4);fh.lineTo(17.6,40.6);fh.lineTo(3,40.6);fs.holes.push(fh);
  const fb=mesh(new THREE.ExtrudeGeometry(fs,{depth:1.4,bevelEnabled:false}),MAT.black,c);fb.rotation.y=-Math.PI/2;fb.position.x=47.4;
  const meshPlate=mesh(new THREE.PlaneGeometry(19,32),texMat(TEX.mesh,{roughness:.7}),c);meshPlate.rotation.y=Math.PI/2;meshPlate.position.set(47.42,18,8.8);
  bx(47.4,36.8,3,47.6,40.3,17.6,MAT.black,c,.1);           // second 5.25" blank
  const bc=reg('bayCoverG',new THREE.Group());c.add(bc);bx(47.4,40.65,3.05,47.7,44.35,17.55,MAT.black,bc,.12);bx(47.7,42.3,4,47.75,42.5,16.5,MAT.casePaint,bc);clickable(bc,'bayCover');
  // front I/O & power button
  const pb=new THREE.Group();c.add(pb);pb.position.set(47.5,31.9,8.8);const ring=cyl(.95,.25,MAT.chrome,pb,'x');const btn=cyl(.75,.32,MAT.casePaint,pb,'x');btn.position.x=.05;hitBox(pb,[.2,0,0],[.8,2.4,2.4]);clickable(pb,'pwrBtn');
  reg('pwrLed',mesh(new THREE.SphereGeometry(.18,12,12),MAT.led.clone(),c)).position.set(47.55,30.4,8.8);
  reg('hddLed',mesh(new THREE.SphereGeometry(.18,12,12),MAT.led.clone(),c)).position.set(47.55,30.4,10);
  for(const z of [5.2,6.8]){bx(47.3,29,z-.6,47.5,29.5,z+.6,MAT.steel,c);bx(47.45,29.1,z-.5,47.52,29.4,z+.5,MAT.blue,c)}
  for(const [z,m] of [[11.4,MAT.green],[12.6,MAT.red]]){const j=cyl(.32,.1,m,c,'x');j.position.set(47.5,29.25,z)}
  // drive cages
  for(const z of [2.5,18.1]) bx(30.5,36.2,z,46,45,z+.12,MAT.steel,c);
  bx(30.5,40.45,2.5,46,40.55,18.2,MAT.steel,c);bx(30.5,36.2,2.5,46,36.3,18.2,MAT.steel,c);
  for(const z of [2.5,13.7]) bx(32.4,14,z,46,24.7,z+.12,MAT.steel,c);
  for(const y of [14,17.45,20.95,24.6]) bx(32.4,y,2.5,46,y+.1,13.8,MAT.steel,c);
  // grommets
  for(const y of [32,24,16,8]) bx(30.6,y-2.5,-.05,31.8,y+2.5,.12,MAT.rubber,c,.5);
  // PSU support
  bx(15.6,36,.2,16.2,36.4,15.5,MAT.steel,c);
  // slot covers (removable)
  SLOTS.forEach((s,i)=>{const y=35.55-s.y*K;const g=reg('cover-'+i,new THREE.Group());c.add(g);
    const p=bx(1.6,y-.93,1,1.72,y+.93,12.5,texMat(TEX.vents,{metalness:.8,roughness:.35}),g);
    bx(1.72,y-.93,12.1,2.8,y+.93,12.5,MAT.steel,g);hitBox(g,[2.2,y,6.5],[1.6,1.9,11.5]);clickable(g,'cover-'+i)});
  // I/O shield (hidden)
  const io=reg('ioShield',new THREE.Group());c.add(io);io.visible=false;bx(1.42,23.65,.72,1.58,35.15,5.18,texMat(TEX.io,{metalness:.85,roughness:.3}),io);
  // zones
  new Zone('psuBay',c,[8.5,40.5,8],[14,8.4,15]);
  new Zone('ioCut',c,[1.5,29.4,2.95],[2,11.6,4.6]);
  new Zone('bay525',c,[39,42.5,10.3],[16,3.8,14.6]);
  BAYS35.forEach((b,i)=>new Zone('bay35',c,[39,(b.y0+b.y1)/2,8.1],[13,3,10.2],{i}));
  new Zone('mbCase',c,[4.5+12.75,35.55-15.4,1.2],[25.5,30.7,2]);
  // glass side panel + rear thumbscrews
  const pn=reg('panelG',new THREE.Group());c.add(pn);
  mesh(new THREE.BoxGeometry(45.9,45.4,.4),MAT.glass,pn,{cast:false}).position.set(24.4,23,20.4);
  for(const [x0,y0,x1,y1] of [[1.4,.2,47.4,1.2],[1.4,44.8,47.4,45.8],[1.4,.2,2.4,45.8],[46.4,.2,47.4,45.8]]) bx(x0,y0,20.2,x1,y1,20.65,MAT.black,pn);
  hitBox(pn,[24.4,23,20.5],[45,45,.8]);clickable(pn,'panel');
  const gh=reg('panelGhost',new THREE.Group());c.add(gh);gh.visible=false;mesh(new THREE.BoxGeometry(45.9,45.4,.4),MAT.ghost,gh,{cast:false}).position.set(24.4,23,20.4);hitBox(gh,[24.4,23,20.5],[45,45,1]);clickable(gh,'panelGhost');
  [4,42].forEach((y,i)=>{const t=new THREE.Group();c.add(t);t.position.set(1.15,y,19.6);const k=cyl(.75,.55,MAT.chrome,t,'x',18);const s=cyl(.3,.6,MAT.steel,t,'x');s.position.x=.4;hitBox(t,[0,0,0],[1.4,2,2]);clickable(t,'pscrew-'+i)});
}

/* ---------- PSU ---------- */
function buildPSU(){
  const p=reg('psu',new THREE.Group());caseG.add(p);p.visible=false;
  const mats=[MAT.black,texMat(TEX.psuRear,{roughness:.7}),MAT.black,MAT.black,texMat(TEX.psuLabel,{roughness:.6}),MAT.black];
  const body=mesh(new RoundedBoxGeometry(13.95,8.1,15,3,.25),MAT.black,p);body.position.set(8.43,40.5,8);
  // decal planes (rounded box UVs are per-face too, but planes give crisper text)
  const rear=mesh(new THREE.PlaneGeometry(15,8.1),mats[1],p,{cast:false});rear.rotation.y=-Math.PI/2;rear.position.set(1.44,40.5,8);
  const side=mesh(new THREE.PlaneGeometry(13.6,8),mats[4],p,{cast:false});side.position.set(8.43,40.5,15.51);
  // AC socket
  const ac=new THREE.Group();p.add(ac);bx(1.0,40.2,2.1,1.45,42.9,4.9,MAT.matte,ac,.2);for(const [y,z] of [[41.9,2.8],[41.9,4.2],[41.0,3.5]])bx(.98,y-.25,z-.12,1.05,y+.25,z+.12,MAT.steel,ac);
  // rocker switch
  const rs=new THREE.Group();p.add(rs);bx(1.05,40.5,6.0,1.45,42.5,7.6,MAT.matte,rs,.12);
  const rock=reg('rocker',bx(.95,40.65,6.15,1.1,42.35,7.45,MAT.black,rs,.1));rock.rotation.z=-.18;hitBox(rs,[1,41.5,6.8],[1,2.6,2.2]);clickable(rs,'r-switch');
  // voltage selector
  const vs=new THREE.Group();p.add(vs);bx(1.1,37.1,6.0,1.45,38.3,7.6,MAT.matte,vs);
  const slider=reg('voltSlider',bx(1.0,37.25,6.1,1.12,38.15,6.8,MAT.red,vs));hitBox(vs,[1.1,37.7,6.8],[1,1.8,2.6]);clickable(vs,'volt');
  const vt=reg('voltLabel',new THREE.Mesh(new THREE.PlaneGeometry(2.6,.9),new THREE.MeshBasicMaterial({transparent:true})));vt.rotation.y=-Math.PI/2;vt.position.set(1.4,37.7,3.8);p.add(vt);
  // cable bundle stubs
  bx(15.4,37,4,15.9,39.5,12,MAT.cable,p,.3);
  new Zone('r-psu',p,[.7,41.5,3.5],[1.2,3.4,3.6]);
}
function setVoltVisual(){
  const sl=OBJ.voltSlider; if(!sl) return; sl.position.z=S.volt==='230'?7.25:6.45;
  const t=ctex(256,90,(g)=>{g.fillStyle='#c62828';g.fillRect(0,0,256,90);g.fillStyle='#fff';g.font='900 64px Arial';g.textAlign='center';g.fillText(S.volt+'V',128,68)});
  OBJ.voltLabel.material.map=t;OBJ.voltLabel.material.needsUpdate=true;
}

/* ---------- motherboard ---------- */
let mbG;
function buildMB(){
  const g=mbG=reg('mb',new THREE.Group());scene.add(g);g.visible=false;
  g.position.copy(MB_MAT);g.rotation.x=-Math.PI/2;g.userData.drag='mbAsm';
  const pcb=mesh(new THREE.BoxGeometry(340*K,410*K,T),[MAT.pcb,MAT.pcb,MAT.pcb,MAT.pcb,MAT.board,MAT.pcb],g);pcb.position.set(170*K,-205*K,T/2);
  const bL=(x0,y0,x1,y1,z0,z1,mat,parent=g,r=0)=>bx(x0*K,-y0*K,T+z0,x1*K,-y1*K,T+z1,mat,parent,r);
  const at=(x,y)=>[x*K,-y*K];
  // rear I/O stack
  bx(-1.15,-.9,T,2.85,-11.4,T+3.9,MAT.black,g,.15);
  const port=(y,z,wy,wz,inner,tongue)=>{bx(-3.15,y-wy/2,T+z-wz/2,-1.1,y+wy/2,T+z+wz/2,MAT.steel,g);bx(-3.17,y-wy/2+.07,T+z-wz/2+.07,-3.1,y+wy/2-.07,T+z+wz/2-.07,inner||MAT.matte,g);if(tongue)bx(-3.2,y-.08,T+z-wz/2+.25,-2.4,y+.08,T+z+wz/2-.25,tongue,g)};
  const ps2=cyl(.5,2,MAT.purple,g,'x');ps2.position.set(-2.15,-1.6,T+3.2);const ps2b=mesh(new THREE.CylinderGeometry(.5,.5,2.02,24,1,false,0,Math.PI),MAT.green,g);ps2b.rotation.z=Math.PI/2;ps2b.position.set(-2.15,-1.6,T+3.2);
  new Zone('r-ps2',g,[-3.35,-1.6,T+3.2],[.5,1.3,1.3]);
  [[-3.0,1.2],[-3.0,2.9],[-4.4,1.2],[-4.4,2.9]].forEach(([y,z],k)=>{port(y,z,.75,1.45,MAT.matte,MAT.blue);new Zone('r-usb',g,[-3.35,y,T+z],[.5,.95,1.65],{i:k})});
  port(-5.9,2,.7,1.6);new Zone('r-onboard-video',g,[-3.35,-5.9,T+2],[.5,.9,1.8]);
  port(-7.4,2,1.4,1.65);bx(-3.2,-6.85,T+2.65,-3.1,-6.7,T+2.75,std({color:0x7cfc6a,emissive:0x2a7a20}),g);new Zone('r-lan',g,[-3.35,-7.4,T+2],[.5,1.6,1.85]);
  [[1.1,MAT.blue],[2.2,MAT.green],[3.3,std({color:0xf48fb1})]].forEach(([z,m])=>{const j=cyl(.36,2,m,g,'x');j.position.set(-2.15,-9.6,T+z);const h=cyl(.16,2.05,MAT.matte,g,'x');h.position.set(-2.16,-9.6,T+z)});
  // VRM heatsinks & caps
  finBlock(3.45,-3.75,4.8,-10.95,T,T+2.2,12,g,'y');finBlock(8.4,-1.8,14.85,-2.9,T,T+1.8,14,g,'x');
  [[82,60],[82,76],[82,92],[82,108],[82,124],[96,140],[226,250],[234,250],[60,300],[68,300]].forEach(([x,y])=>{const c=cyl(.32,.9,MAT.alu,g,'z',18);c.position.set(x*K,-y*K,T+.45)});
  // EPS 8-pin
  bL(58,8,92,26,0,1.1,MAT.black,g,.08);pins([...Array(8)].map((_,k)=>[(62+(k%4)*7.6)*K,-(12.5+Math.floor(k/4)*7)*K,T+.85]),.5,g,.3,MAT.matte);
  new Zone('eps',g,[75*K,-17*K,T+.8],[3,1.7,2]);
  // CPU socket
  const sock=new THREE.Group();g.add(sock);
  bL(116,56,194,134,0,.35,MAT.black,sock);
  const pinsPlane=mesh(new THREE.PlaneGeometry(58*K,58*K),texMat(ctex(256,256,(c)=>{c.fillStyle='#24272c';c.fillRect(0,0,256,256);c.fillStyle='#e2b950';for(let y=4;y<256;y+=8)for(let x=4;x<256;x+=8){c.beginPath();c.arc(x,y,1.8,0,7);c.fill()}}),{metalness:.6,roughness:.35}),sock,{cast:false});
  pinsPlane.position.set(155*K,-95*K,T+.36);
  const tri=mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(0,0),new THREE.Vector2(.85,0),new THREE.Vector2(0,.85)])),MAT.gold,sock,{cast:false});tri.position.set(118*K,-132*K,T+.37);
  const plateShape=new THREE.Shape();plateShape.moveTo(0,0);plateShape.lineTo(5.6,0);plateShape.lineTo(5.6,5.6);plateShape.lineTo(0,5.6);plateShape.lineTo(0,0);
  const ph=new THREE.Path();ph.moveTo(.65,.65);ph.lineTo(.65,4.95);ph.lineTo(4.95,4.95);ph.lineTo(4.95,.65);ph.lineTo(.65,.65);plateShape.holes.push(ph);
  const plateP=reg('platePivot',new THREE.Group());g.add(plateP);plateP.position.set(118*K,-132*K,T+.38);
  mesh(new THREE.ExtrudeGeometry(plateShape,{depth:.1,bevelEnabled:false}),MAT.steel,plateP);
  bL(203,53,212,59,0,.6,MAT.steel,g);
  const lev=new THREE.Group();g.add(lev);lev.position.set(207*K,-134*K,T+.5);const lp=reg('leverPivot',new THREE.Group());lev.add(lp);
  const bar=cyl(.09,5.7,MAT.chrome,lp,'y',12);bar.position.y=2.85;const knob=bx(-.2,5.6,-.15,.2,5.9,.25,MAT.black,lp);
  hitBox(lp,[0,2.9,.2],[1.2,6.2,1.2]);clickable(lev,'lever');
  new Zone('cpu',g,[155*K,-95*K,T+.9],[6.2,6.2,2]);
  // CPU
  const cpu=reg('cpuChip',new THREE.Group());g.add(cpu);cpu.visible=false;cpu.position.set(155*K,-95*K,T+.36);
  bx(-2.1,-2.1,0,2.1,2.1,.12,MAT.pcb,cpu);const ihs=mesh(new RoundedBoxGeometry(3.3,3.3,.3,2,.12),[0,1,2,3,4,5].map(k=>k===4?texMat(TEX.ihs,{metalness:.85,roughness:.3}):MAT.alu),cpu);ihs.position.z=.27;
  const ctri=mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(0,0),new THREE.Vector2(.6,0),new THREE.Vector2(0,.6)])),MAT.gold,cpu,{cast:false});ctri.position.set(-2.05,-2.05,.125);
  // thermal paste
  const paste=reg('paste',mesh(new THREE.SphereGeometry(.55,20,14),std({color:0xc4c8cd,roughness:.35}),g));paste.scale.set(1,1,.45);paste.position.set(155*K,-95*K,T+.8);paste.visible=false;
  // cooler
  const co=reg('cooler',new THREE.Group());g.add(co);co.visible=false;co.position.set(155*K,-95*K,T+.78);
  const core=cyl(1.4,2.2,MAT.copper,co,'z',32);core.position.z=1.1;
  const finG=new THREE.BoxGeometry(2.4,.07,2.2);const fins=new THREE.InstancedMesh(finG,MAT.alu,64);const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();
  for(let k=0;k<64;k++){const a=k/64*Math.PI*2;e.set(0,0,a+.25);q.setFromEuler(e);m4.compose(V3(Math.cos(a)*2.6,Math.sin(a)*2.6,1.1),q,V3(1,1,1));fins.setMatrixAt(k,m4)}fins.castShadow=true;co.add(fins);
  const frameS=new THREE.Shape();frameS.moveTo(-4.1,-4.1);frameS.lineTo(4.1,-4.1);frameS.lineTo(4.1,4.1);frameS.lineTo(-4.1,4.1);frameS.lineTo(-4.1,-4.1);
  const fhole=new THREE.Path();fhole.absarc(0,0,3.75,0,Math.PI*2,true);frameS.holes.push(fhole);
  const frame=mesh(new THREE.ExtrudeGeometry(frameS,{depth:.55,bevelEnabled:true,bevelSize:.12,bevelThickness:.1,bevelSegments:2}),MAT.black,co);frame.position.z=2.25;
  const fan=reg('cpuFan',new THREE.Group());co.add(fan);fan.position.z=2.55;
  for(let k=0;k<7;k++){const b=new THREE.Group();fan.add(b);b.rotation.z=k/7*Math.PI*2;const bl=mesh(new THREE.BoxGeometry(2.7,1.25,.05),MAT.blade,b);bl.position.x=2.15;bl.rotation.x=.45;bl.rotation.z=.18}
  const hub=cyl(1.05,.55,MAT.black,fan,'z',32);hub.position.z=.1;const hubT=mesh(new THREE.CircleGeometry(.85,32),texMat(TEX.hub),fan,{cast:false});hubT.position.z=.38;
  [[106,46],[204,46],[106,144],[204,144]].forEach(([x,y],i)=>{const pg=new THREE.Group();co.add(pg);pg.position.set(x*K-155*K,-y*K+95*K,0);
    const leg=cyl(.32,3.1,MAT.white,pg,'z',16);leg.position.z=.6;const cap=cyl(.55,.45,MAT.black,pg,'z',16);cap.position.z=2.55;const top=reg('retTop'+i,cyl(.45,.08,MAT.white.clone(),pg,'z',16));top.position.z=2.8;
    pg.position.z=.55;hitBox(pg,[0,0,1.5],[1.4,1.4,3.2]);clickable(pg,'ret-'+i)});
  const fw=reg('fanWire',new THREE.Group());g.add(fw);fw.visible=false;
  tube([[198*K,-60*K,T+2.6],[206*K,-46*K,T+2.4],[214*K,-32*K,T+1.3],[225*K,-27*K,T+.9]],.08,MAT.cable,fw,40);bx(216*K,-23*K,T+.6,234*K,-31*K,T+1.1,MAT.white,fw);
  // fan headers
  const hdr=(x,y,lab)=>{bL(x,y,x+20,y+9,0,.45,MAT.white,g);pins([0,1,2,3].map(k=>[(x+3+k*4.6)*K,-(y+4.5)*K,T+.5]),.6,g,.12)};
  hdr(215,22);hdr(8,168);
  new Zone('cpufan',g,[225*K,-26.5*K,T+.6],[2,1.4,1.4]);new Zone('sysfan',g,[18*K,-172.5*K,T+.6],[2,1.4,1.4]);
  // RAM slots
  for(let i=0;i<4;i++){const x=240+i*16;bL(x,30,x+9,212,0,.55,i%2?MAT.grey:MAT.black,g);bL(x+3.5,34,x+5.5,208,.55,.56,MAT.matte,g);bL(x+.5,148,x+8.5,152,.5,.62,MAT.gold,g);
    for(const [yy,name] of [[24,'latchT'],[212,'latchB']]){const l=reg(`${name}${i}`,bL(x-1,yy,x+10,yy+7,0,.9,MAT.white,g,.1));l.userData.base=l.rotation.clone()}
    const st=reg('ram-'+i,new THREE.Group());g.add(st);st.visible=false;st.position.set((x+4.5)*K,-121*K,T+.5);
    bx(-.06,-6.85,0,.06,6.85,3.1,MAT.pcb,st);for(const s of [-1,1])bx(s*.08,-6.7,.55,s*.2,6.7,3.0,std({color:0x1b1d21,roughness:.35,metalness:.7}),st);
    bx(-.21,-6.7,2.6,.21,6.7,3.0,MAT.red,st);
    new Zone('ram',g,[(x+4.5)*K,-121*K,T+1.6],[1.15,13.8,3],{i});}
  // ATX 24-pin
  bL(312,58,336,172,0,1.0,MAT.black,g,.08);pins([...Array(24)].map((_,k)=>[(318+(k%2)*11)*K,-(63+Math.floor(k/2)*9.3)*K,T+.75]),.55,g,.32,MAT.matte);
  new Zone('atx24',g,[324*K,-115*K,T+.8],[2.2,8.8,2]);
  // chipset heatsink, battery, M.2, SIO
  finBlock(255*K,-245*K,301*K,-291*K,T,T+.9,9,g,'y');
  const bat=cyl(.85,.32,MAT.chrome,g,'z',32);bat.position.set(160*K,-196*K,T+.2);
  bL(110,271,210,285,0,.35,MAT.alu,g,.08);bL(236,345,254,361,0,.15,MAT.black,g);bL(64,320,80,336,0,.15,MAT.black,g);
  // SATA ports (facing +x)
  [0,1].forEach(i=>{bL(300,300+i*16,332,312+i*16,0,.75,MAT.black,g,.05);bx(332*K-.02,-(302+i*16)*K,T+.15,332*K+.01,-(310+i*16)*K,T+.6,MAT.matte,g);new Zone('sata',g,[(328)*K,-(306+i*16)*K,T+.5],[1.8,1.2,1.4],{i})});
  // PCIe slots
  SLOTS.forEach((s,i)=>{const yc=s.y;if(s.kind==='x16'){bL(48,yc-5.5,s.x2+2,yc+5.5,0,.9,MAT.steel,g,.06);bL(50,yc-1.6,s.x2,yc+1.6,.9,.92,MAT.matte,g);bL(s.x2+1,yc-6,s.x2+9,yc+6,0,1.1,MAT.black,g,.1)}
    else{bL(50,yc-4.5,s.x2,yc+4.5,0,.85,MAT.black,g,.05);bL(52,yc-1.2,s.x2-2,yc+1.2,.85,.87,MAT.matte,g)}
    new Zone('slot',g,[((50+s.x2)/2)*K,-yc*K,T+1.2],[(s.x2-46)*K,1.3,2.2],{i,kind:s.kind})});
  // bottom headers
  const hdrPins=(x0,y0,cols,rows,pitch,skip=[])=>{const l=[];for(let c=0;c<cols;c++)for(let r=0;r<rows;r++){if(skip.some(([a,b])=>a===c&&b===r))continue;l.push([(x0+c*pitch)*K,-(y0+r*pitch)*K,T+.55])}return l};
  bL(20,386,56,400,0,.25,MAT.black,g);pins(hdrPins(23.5,389.5,5,2,7.5,[[3,1]]),.9,g,.17);
  bL(160,386,196,400,0,.25,MAT.black,g);pins(hdrPins(163.5,389.5,5,2,7.5,[[4,0]]),.9,g,.17);
  bL(213,388,239,398,0,.25,MAT.black,g);pins(hdrPins(216.5,393,4,1,6.3),.9,g,.17);
  bL(262,386,302,400,0,.25,MAT.black,g);pins(hdrPins(265.5,389.5,5,2,7.5,[[4,0]]),.9,g,.17);
  const fpz=(n,x,y,w,h)=>new Zone(n,g,[x*K,-y*K,T+.7],[w*K,h*K,1.3]);
  fpz('fp-hdd',269,389.5,14,6.5);fpz('fp-reset',284,389.5,14,6.5);fpz('fp-pled',269,397,14,6.5);fpz('fp-pwr',284,397,14,6.5);
  fpz('fp-spk',226,393,26,9);fpz('fp-usb',178,393,36,15);fpz('fp-audio',38,393,36,15);
  g.add(reg('cards',new THREE.Group()));
  // drag handle area for moving the whole board
  hitBox(g,[170*K,-205*K,T+.3],[340*K,410*K,1]).userData.dragHandle=true;
}
/* ---------- cards ---------- */
function slotLocal(i){return -SLOTS[i].y*K}
function installCard(id,i){
  S.slots[i]=id;S.lastSlot=i;zone1('slot',i).dataset.full='1';
  const y=slotLocal(i),g=reg('card-'+id,new THREE.Group());OBJ.cards.add(g);
  const gpu=id==='gpu';
  // bracket
  bx(-3.1,y+(gpu?-3.1:-.95),T+.4,-2.98,y+.95,T+12.4,MAT.steel,g);bx(-2.98,y+(gpu?-3.1:-.95),T+12.0,-1.9,y+.95,T+12.4,MAT.steel,g);
  if(gpu){
    bx(-2.9,y-.1,T+.9,16.2,y+.1,T+11.3,MAT.pcb,g);
    const sh=mesh(new RoundedBoxGeometry(18.6,2.9,10.8,3,.35),[MAT.black,MAT.black,MAT.black,MAT.black,texMat(TEX.gpu,{metalness:.4,roughness:.45}),MAT.black],g);sh.position.set(6.9,y-1.6,T+6.2);
    const fz=[];for(const fx of [2.3,11.4]){const f=new THREE.Group();g.add(f);f.position.set(fx,y-3.08,T+6.2);f.rotation.x=Math.PI/2;fz.push(f);
      for(let k=0;k<9;k++){const b=new THREE.Group();f.add(b);b.rotation.z=k/9*Math.PI*2;const bl=mesh(new THREE.BoxGeometry(1.8,.8,.04),MAT.blade,b);bl.position.x=1.6;bl.rotation.x=.5}cyl(.8,.3,MAT.black,f,'z')}
    OBJ.gpuFans=fz;
    bx(-2.9,y+.1,T+.9,16.2,y+.3,T+11.3,std({color:0x22252a,metalness:.7,roughness:.35}),g);
    bx(14.0,y+.3,T+10.6,15.7,y+1.2,T+11.6,MAT.black,g);
    new Zone('gpuPwr',g,[14.85,y+.75,T+11.4],[2.6,1.6,1.8]);
    // rear ports
    bx(-3.25,y-.75,T+2.0,-3.0,y-.1,T+3.6,MAT.steel,g);bx(-3.27,y-.68,T+2.1,-3.2,y-.17,T+3.5,MAT.matte,g);
    for(const z of [4.6,6.6])bx(-3.25,y-.75,T+z,-3.0,y-.15,T+z+1.4,MAT.matte,g);
    new Zone('r-gpu-video',g,[-3.4,y-.42,T+2.8],[.5,1.1,2.1]);
  }else{
    const len=id==='nic'?6:5.5;bx(-2.9,y-.08,T+.9,len,y+.08,T+7.2,id==='nic'?MAT.pcb:MAT.pcbBlue,g);
    bx(-2.9,y-.12,T+.7,len-1,y+.12,T+.95,MAT.gold,g);
    if(id==='nic'){bx(.6,y+.08,T+3.2,2.2,y+.35,T+4.8,MAT.black,g);bx(-2.9,y+.08,T+2.3,-1.0,y+1.2,T+4.0,MAT.steel,g);bx(-3.25,y+.15,T+2.45,-3.0,y+1.1,T+3.85,MAT.steel,g);bx(-3.27,y+.25,T+2.6,-3.2,y+1.0,T+3.7,MAT.matte,g);
      new Zone('r-nic',g,[-3.4,y+.62,T+3.15],[.5,1.3,1.8])}
    else{bx(.2,y+.08,T+2.4,3.6,y+.4,T+5.8,MAT.alu,g);for(const z of [2.8,6.2]){const s=cyl(.35,.9,MAT.gold,g,'x',16);s.position.set(-3.5,y+.3,T+z)}
      new Zone('r-wifi',g,[-3.55,y+.3,T+4.5],[.7,1.2,4.8])}
  }
  hide('cover-'+i);
  g.position.z=8;tweenTo(g,{pos:V3(0,0,0),dur:600});
}

/* ---------- drives ---------- */
function placeHdd(i){
  const b=BAYS35[i];S.hddY=b.y0;zones('bay35').forEach(z=>z.remove());
  const g=reg('hdd',new THREE.Group());caseG.add(g);
  const yc=b.y0+1.5;
  mesh(new RoundedBoxGeometry(12.6,2.6,10.1,2,.15),[MAT.alu,MAT.alu,texMat(TEX.hdd,{metalness:.7,roughness:.35}),MAT.alu,MAT.alu,MAT.alu],g).position.set(39.1,yc,8.1);
  bx(32.7,yc-.9,4.0,32.85,yc+.25,7.5,MAT.black,g);bx(32.7,yc-.9,8.0,32.85,yc+.25,9.2,MAT.black,g);
  new Zone('hddPwr',g,[32.4,yc-.3,5.75],[1,1.6,3.6]);new Zone('hddData',g,[32.4,yc-.3,8.6],[1,1.6,1.5]);
  g.position.x=10;tweenTo(g,{pos:V3(0,0,0),dur:600});
}
function placeOdd(){
  zones('bay525').forEach(z=>z.remove());
  const g=reg('odd',new THREE.Group());caseG.add(g);
  mesh(new THREE.BoxGeometry(16.1,3.6,14.5),[texMat(TEX.odd,{roughness:.5}),MAT.black,std({color:0x1d1f23,roughness:.35,metalness:.6,map:TEX.brush}),MAT.black,MAT.black,MAT.black],g).position.set(39.15,42.5,10.3);
  bx(31.0,41.4,4.0,31.15,42.6,7.0,MAT.black,g);bx(31.0,41.4,8.0,31.15,42.4,9.3,MAT.black,g);
  new Zone('oddPwr',g,[30.7,42,5.5],[1,1.8,3.4]);new Zone('oddData',g,[30.7,42,8.65],[1,1.8,1.6]);
  g.position.x=14;tweenTo(g,{pos:V3(0,0,0),dur:700});
}

/* ---------- cables ---------- */
const CABLES=[];
function addCable(pts,r,mat){const m=tube(pts,r,mat,scene,90);m.userData.cable=true;CABLES.push(m);return m}
function plug(c,s,mat=MAT.black,parent=scene){const m=bx(c[0]-s[0]/2,c[1]-s[1]/2,c[2]-s[2]/2,c[0]+s[0]/2,c[1]+s[1]/2,c[2]+s[2]/2,mat,parent,.08);CABLES.push(m);return m}
const mbW=(x,y,z=0)=>mbG.localToWorld(V3(x*K,-y*K,T+z));
const mbCaseW=(x,y,z=0)=>V3(MB_CASE.x+x*K,MB_CASE.y-y*K,MB_CASE.z+T+z);
const mbMatW=(x,y,z=0)=>V3(MB_MAT.x+x*K,MB_MAT.y+T+z,MB_MAT.z+y*K);
const mbWl=(v)=>mbG.localToWorld(v.clone());
function driveConn(name){const z=zone1(name);return z?z.world():V3(0,0,0)}

/* ---------- screws ---------- */
const SCREW_UP=V3(0,0,1);
function makeScrew(pos,axis,kind,id){
  const g=new THREE.Group();scene.add(g);g.position.copy(pos);
  g.quaternion.setFromUnitVectors(SCREW_UP,{x:V3(1,0,0),'-x':V3(-1,0,0),y:V3(0,1,0),z:V3(0,0,1)}[axis]);
  const head=new THREE.Group();g.add(head);
  if(kind==='standoff'){const h=cyl(.34,.65,MAT.brass,head,'z',6);h.position.z=.33;const hole=cyl(.15,.02,MAT.matte,head,'z',12);hole.position.z=.01;head.visible=false}
  else if(kind==='thumb'){const k=cyl(.75,.55,MAT.chrome,head,'z',18);k.position.z=.28}
  else{const h=cyl(.32,.16,MAT.chrome,head,'z',24);h.position.z=.08;const d=mesh(new THREE.SphereGeometry(.32,20,10,0,Math.PI*2,0,Math.PI/2),MAT.chrome,head);d.rotation.x=Math.PI/2;d.scale.set(1,.35,1);d.position.z=.16;
    bx(-.24,-.04,.17,.24,.04,.3,MAT.matte,head);bx(-.04,-.24,.17,.04,.24,.3,MAT.matte,head);}
  head.position.z=kind==='standoff'?0:.55;
  const halo=mesh(new THREE.RingGeometry(.55,.75,32),new THREE.MeshBasicMaterial({color:0xffca28,transparent:true,opacity:.85,side:THREE.DoubleSide,depthTest:false}),g,{cast:false});halo.position.z=.05;halo.renderOrder=25;
  hitBox(g,[0,0,.3],[1.6,1.6,1.4]);
  g.userData.screw={head,halo,kind};clickable(g,id);return g;
}
function makeDriver(){
  const d=new THREE.Group();scene.add(d);
  const h=cyl(.85,8,MAT.red,d,'z',20);h.position.z=13.6;const cap=cyl(.86,1,MAT.black,d,'z',20);cap.position.z=9.3;
  const sh=cyl(.2,9,MAT.chrome,d,'z',12);sh.position.z=4.6;const tip=mesh(new THREE.ConeGeometry(.2,.5,4),MAT.chrome,d);tip.rotation.x=-Math.PI/2;tip.position.z=.25;
  return d;
}
function driveAnim(pos,quat,turns=2.5){
  const d=makeDriver();d.quaternion.copy(quat);const ax=V3(0,0,1).applyQuaternion(quat);
  if(TECH){TECH.driving=performance.now()+700;reachTo(pos.clone().addScaledVector(ax,13.5),'R',900)}
  const at=off=>d.position.copy(pos).addScaledVector(ax,off);at(6);
  tween(650,k=>{const off=k<.25?6-(k/.25)*5.3:k<.8?.7-((k-.25)/.55)*.45:.25+((k-.8)/.2)*7;at(off);d.quaternion.copy(quat);
    if(k>=.25&&k<.8)d.rotateOnAxis(V3(0,0,1),((k-.25)/.55)*turns*Math.PI*2)},()=>scene.remove(d));
}
function needsDriver(st){return !!st&&(st.type==='screws'||!!st.needsDriver)}
function toggleDriver(force){
  const held=force!==undefined?force:S.tool!=='screwdriver';
  S.tool=held?'screwdriver':null;OBJ.sdDesk.visible=!held;$('#hTool').style.display=held?'block':'none';
  renderer.domElement.style.cursor=held?'crosshair':'';sfx('tick');
  if(held&&needsDriver(cur())) toast('🪛 Screwdriver in hand. Click the screws.','',1800);
  render();
}
function tightenScrew(g){
  driveAnim(g.position,g.quaternion);
  const {head,halo,kind}=g.userData.screw;halo.visible=false;
  if(kind==='standoff'){head.visible=true;head.scale.setScalar(.01);tween(300,k=>head.scale.setScalar(.01+k*.99));return}
  const z0=head.position.z;tween(380,k=>{head.position.z=z0*(1-k);head.rotation.z=k*Math.PI*3});
}
