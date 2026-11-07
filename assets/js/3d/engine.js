'use strict';
/* Device Lab | MIT License | Educational use only. See DISCLAIMER.md */
/* =================== 3D ENGINE =================== */
const K=0.075, T=0.16;                       // 2D layout unit -> cm, PCB thickness
const SLOTS=[{y:215,kind:'x1',x2:95},{y:250,kind:'x16',x2:220},{y:295,kind:'x1',x2:95},{y:335,kind:'x16',x2:220}];
const HOLES=[[12,12],[200,14],[328,12],[12,368],[200,368],[328,368]];
const BAYS35=[{y0:21.3,y1:24.3},{y0:17.6,y1:20.6},{y0:14.3,y1:17.3}];
const MB_CASE=new THREE.Vector3(4.5,35.55,0.7);
const MB_MAT=new THREE.Vector3(54,0.27,-3);
const REGIONS=[{name:'Singapore',v:'230'},{name:'the United Kingdom',v:'230'},{name:'Germany',v:'230'},{name:'the United States',v:'115'},{name:'Japan',v:'115'}];
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);

const host=$('#three');
let renderer;
try{ renderer=new THREE.WebGLRenderer({antialias:true}); }
catch(e){ host.innerHTML='<div class="empty" style="padding:40px">WebGL is not available in this browser, so the 3D bench can\'t start. Try Chrome, Edge or Firefox with hardware acceleration on, or open <a href="2d/index.html" style="color:#4fc3f7">the 2D version</a>.</div>'; throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
renderer.outputColorSpace=THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x111318);
scene.fog=new THREE.Fog(0x111318,170,320);
const pmrem=new THREE.PMREMGenerator(renderer);
scene.environment=pmrem.fromScene(new RoomEnvironment(),0.04).texture;
if('environmentIntensity' in scene) scene.environmentIntensity=.55;
const camera=new THREE.PerspectiveCamera(36,1,0.3,800);
camera.position.set(30,48,95);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true; controls.dampingFactor=.08; controls.minDistance=6; controls.maxDistance=170;
controls.maxPolarAngle=Math.PI*.49; controls.target.set(30,20,5);

scene.add(new THREE.HemisphereLight(0xdfe8ff,0x2a2018,.45));
const key=new THREE.DirectionalLight(0xfff3e2,2.2); key.position.set(55,95,85); key.castShadow=true;
key.shadow.mapSize.set(2048,2048); Object.assign(key.shadow.camera,{left:-75,right:75,top:75,bottom:-75,near:10,far:260}); key.shadow.bias=-.0004; key.shadow.normalBias=.03;
key.target.position.set(40,0,10); scene.add(key,key.target);
const fill=new THREE.DirectionalLight(0xb9d4ff,.7); fill.position.set(-60,40,40); scene.add(fill);
const inner=new THREE.PointLight(0xfff1e0,260,90,1.6);inner.position.set(26,38,34);scene.add(inner);
const lamp=new THREE.SpotLight(0xffd9a8,900,140,.6,.5,1.6); lamp.position.set(70,70,40); lamp.target.position.set(60,0,8); scene.add(lamp,lamp.target);

function resize(){const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);renderer.domElement.style.width=r.width+'px';renderer.domElement.style.height=r.height+'px';camera.aspect=r.width/Math.max(1,r.height);
  /* on narrow (portrait) screens keep the horizontal field of view, so step views still fit the shot */
  const A0=1.1, t=Math.tan(THREE.MathUtils.degToRad(18));
  camera.fov=camera.aspect<A0?THREE.MathUtils.radToDeg(2*Math.atan(t*A0/camera.aspect)):36;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(host); resize();

/* ---------- procedural textures ---------- */
function ctex(w,h,draw,o={}){
  const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);
  const t=new THREE.CanvasTexture(c); if(o.srgb!==false) t.colorSpace=THREE.SRGBColorSpace;
  t.anisotropy=renderer.capabilities.getMaxAnisotropy();
  if(o.repeat){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...o.repeat)}
  return t;
}
const rnd=(a,b)=>a+Math.random()*(b-a);
const TEX={};
TEX.wood=ctex(1024,1024,(g,w,h)=>{
  g.fillStyle='#4e3522';g.fillRect(0,0,w,h);
  for(let i=0;i<340;i++){const y=rnd(0,h),a=rnd(.05,.28),l=rnd(.4,2.8);
    g.strokeStyle=`rgba(${rnd(18,60)|0},${rnd(10,34)|0},${rnd(4,14)|0},${a})`;g.lineWidth=l;g.beginPath();g.moveTo(0,y);
    for(let x=0;x<=w;x+=24)g.lineTo(x,y+Math.sin(x/140+i*.7)*6+Math.sin(x/37+i)*1.5);g.stroke()}
  for(let i=0;i<9000;i++){g.fillStyle=`rgba(255,220,180,${rnd(0,.035)})`;g.fillRect(rnd(0,w),rnd(0,h),rnd(1,6),1)}
},{repeat:[4,3]});
TEX.vest=ctex(512,512,(g,w,h)=>{g.fillStyle='#24499c';g.fillRect(0,0,w,h);
  for(let i=0;i<9000;i++){g.fillStyle=`rgba(0,0,0,${rnd(0,.08)})`;g.fillRect(rnd(0,w),rnd(0,h),2,2)}
  g.strokeStyle='rgba(150,180,240,.35)';g.lineWidth=1.5;for(let k=0;k<=w;k+=32){g.beginPath();g.moveTo(k,0);g.lineTo(k,h);g.stroke();g.beginPath();g.moveTo(0,k);g.lineTo(w,k);g.stroke()}
},{repeat:[2,2]});
TEX.esd=ctex(256,256,(g)=>{g.clearRect(0,0,256,256);g.fillStyle='#ffd54f';g.beginPath();g.arc(128,128,118,0,7);g.fill();g.strokeStyle='#1a1a1a';g.lineWidth=10;g.beginPath();g.arc(128,128,96,Math.PI*.15,Math.PI*1.85);g.stroke();
  g.fillStyle='#1a1a1a';g.font='bold 62px Arial';g.textAlign='center';g.fillText('ESD',128,150)});
TEX.peg=ctex(1024,440,(g,w,h)=>{g.fillStyle='#b08a5e';g.fillRect(0,0,w,h);for(let i=0;i<6000;i++){g.fillStyle=`rgba(80,50,20,${rnd(0,.08)})`;g.fillRect(rnd(0,w),rnd(0,h),3,1)}
  g.fillStyle='#2b2118';for(let y=14;y<h;y+=26)for(let x=14;x<w;x+=26){g.beginPath();g.arc(x,y,3.6,0,7);g.fill()}});
TEX.brush=ctex(512,512,(g,w,h)=>{g.fillStyle='#b8b8b8';g.fillRect(0,0,w,h);
  for(let i=0;i<2600;i++){const v=rnd(140,255)|0;g.strokeStyle=`rgba(${v},${v},${v},.22)`;g.lineWidth=rnd(.3,1.2);const y=rnd(0,h),x=rnd(-200,w);g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd(80,400),y);g.stroke()}
},{repeat:[2,2]});
TEX.mat=ctex(1024,1024,(g,w,h)=>{g.fillStyle='#3a5d84';g.fillRect(0,0,w,h);
  for(let i=0;i<30000;i++){g.fillStyle=`rgba(0,0,0,${rnd(0,.08)})`;g.fillRect(rnd(0,w),rnd(0,h),2,2)}
  g.strokeStyle='rgba(170,200,235,.18)';g.lineWidth=2;for(let k=0;k<=w;k+=64){g.beginPath();g.moveTo(k,0);g.lineTo(k,h);g.stroke();g.beginPath();g.moveTo(0,k);g.lineTo(w,k);g.stroke()}
  g.strokeStyle='rgba(20,35,55,.7)';g.lineWidth=18;g.strokeRect(9,9,w-18,h-18);
  g.fillStyle='rgba(220,235,250,.55)';g.font='bold 34px Arial';g.fillText('ESD SAFE WORK SURFACE',40,h-40);
});
TEX.braid=ctex(64,64,(g,w,h)=>{g.fillStyle='#16181c';g.fillRect(0,0,w,h);g.strokeStyle='#3a3f47';g.lineWidth=5;
  for(let k=-64;k<128;k+=12){g.beginPath();g.moveTo(k,0);g.lineTo(k+64,64);g.stroke()}g.strokeStyle='#24272d';for(let k=-64;k<128;k+=12){g.beginPath();g.moveTo(k,64);g.lineTo(k+64,0);g.stroke()}
},{repeat:[30,1]});
TEX.mesh=ctex(256,256,(g,w,h)=>{g.fillStyle='#22262c';g.fillRect(0,0,w,h);g.fillStyle='#030304';
  for(let y=0,r=0;y<h+16;y+=11,r++)for(let x=(r%2)*6.5;x<w+16;x+=13){g.beginPath();g.arc(x,y,4.6,0,7);g.fill()}
},{repeat:[2,8]});
TEX.vents=ctex(128,256,(g,w,h)=>{g.fillStyle='#c9ced4';g.fillRect(0,0,w,h);g.fillStyle='#0a0b0d';for(let y=18;y<h-14;y+=22)g.fillRect(28,y,w-56,10)});
function honey(g,cx,cy,r){g.save();g.beginPath();g.arc(cx,cy,r,0,7);g.clip();g.fillStyle='#050505';g.fillRect(cx-r,cy-r,2*r,2*r);
  g.strokeStyle='#4a4f57';g.lineWidth=2.4;const s=9;for(let y=cy-r,row=0;y<cy+r+s;y+=s*1.5,row++)for(let x=cx-r+(row%2)*s*.87;x<cx+r+s;x+=s*1.73){g.beginPath();for(let k=0;k<6;k++){const a=Math.PI/3*k+Math.PI/6;g.lineTo(x+s*Math.cos(a),y+s*Math.sin(a))}g.closePath();g.stroke()}
  g.restore();g.strokeStyle='#6b727b';g.lineWidth=5;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke()}
TEX.psuRear=ctex(1024,560,(g,w,h)=>{g.fillStyle='#16181b';g.fillRect(0,0,w,h);
  for(let i=0;i<9000;i++){g.fillStyle=`rgba(255,255,255,${rnd(0,.03)})`;g.fillRect(rnd(0,w),rnd(0,h),2,2)}
  honey(g,744,270,230);g.fillStyle='#cfd8e3';g.font='bold 30px Arial';g.fillText('AC IN',138,96);g.fillText('I / O',400,96);
  [[30,30],[994,30],[30,530],[994,530]].forEach(([x,y])=>{g.fillStyle='#8a929c';g.beginPath();g.arc(x,y,12,0,7);g.fill()})});
TEX.psuLabel=ctex(1024,560,(g,w,h)=>{g.fillStyle='#16181b';g.fillRect(0,0,w,h);
  g.fillStyle='#eceff2';g.fillRect(120,70,620,380);g.fillStyle='#111';g.font='bold 54px Arial';g.fillText('ATX POWER SUPPLY',150,140);
  g.font='900 80px Arial';g.fillText('500W',150,230);g.font='bold 26px Arial';g.fillText('80 PLUS BRONZE',380,225);
  g.strokeStyle='#333';g.lineWidth=2;g.strokeRect(150,260,560,120);for(let k=1;k<3;k++){g.beginPath();g.moveTo(150,260+k*40);g.lineTo(710,260+k*40);g.stroke()}
  for(let k=1;k<6;k++){g.beginPath();g.moveTo(150+k*93,260);g.lineTo(150+k*93,380);g.stroke()}
  g.font='20px Arial';['DC OUT','+3.3V','+5V','+12V','−12V','+5VSB'].forEach((t,k)=>g.fillText(t,158+k*93,288));['MAX','20A','20A','40A','0.3A','2.5A'].forEach((t,k)=>g.fillText(t,158+k*93,328));
  g.fillText('AC INPUT 100-240V~ 50/60Hz',150,425);
  g.fillStyle='#0b0c0e';for(let y=110;y<470;y+=26)g.fillRect(800,y,170,12)});
TEX.hdd=ctex(1024,800,(g,w,h)=>{g.fillStyle='#c9ced4';g.fillRect(0,0,w,h);
  for(let i=0;i<1500;i++){const v=rnd(170,240)|0;g.strokeStyle=`rgba(${v},${v},${v},.3)`;g.beginPath();const y=rnd(0,h);g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
  g.fillStyle='#f4f5f7';g.fillRect(330,90,620,600);g.fillStyle='#111';g.font='bold 58px Arial';g.fillText('HARD DRIVE',370,180);g.font='bold 44px Arial';g.fillText('1 TB',370,240);
  g.font='28px Arial';g.fillStyle='#444';g.fillText('SATA 6Gb/s · 7200 RPM · 64MB',370,290);g.fillText('S/N: BB-7Q3K-2291',370,340);
  for(let k=0;k<70;k++){g.fillStyle='#111';g.fillRect(370+k*7.5,420,k%3?2.5:5,140)}
  g.fillStyle='#8a929c';[[60,60],[60,740],[270,60],[270,740]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,18,0,7);g.fill()})});
TEX.odd=ctex(1024,256,(g,w,h)=>{g.fillStyle='#141518';g.fillRect(0,0,w,h);g.fillStyle='#202227';g.fillRect(0,0,w,100);g.fillStyle='#0a0a0b';g.fillRect(20,96,w-40,6);
  g.fillStyle='#8a929c';g.font='bold 34px Arial';g.fillText('DVD-RW',60,190);g.fillStyle='#2a2d33';g.fillRect(860,150,110,40);g.fillStyle='#59e05a';g.beginPath();g.arc(830,170,7,0,7);g.fill()});
TEX.ihs=ctex(256,256,(g,w,h)=>{g.fillStyle='#c8cdd3';g.fillRect(0,0,w,h);for(let i=0;i<500;i++){const v=rnd(160,230)|0;g.strokeStyle=`rgba(${v},${v},${v},.4)`;g.beginPath();const y=rnd(0,h);g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
  g.fillStyle='rgba(80,86,94,.75)';g.font='bold 30px Arial';g.textAlign='center';g.fillText('CPU',128,110);g.font='18px Consolas';g.fillText('3.40GHZ  LGA',128,145);g.fillText('X9R2  SR0B',128,170)});
TEX.hub=ctex(256,256,(g,w,h)=>{g.fillStyle='#d7dbe0';g.fillRect(0,0,w,h);g.fillStyle='#3b4048';g.font='bold 40px Arial';g.textAlign='center';g.fillText('COOLER',128,120);g.font='24px Arial';g.fillText('12V  0.25A',128,160)});
TEX.gpu=ctex(1024,256,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#3d434c');gr.addColorStop(1,'#14161a');g.fillStyle=gr;g.fillRect(0,0,w,h);
  g.strokeStyle='#59616c';g.lineWidth=4;g.beginPath();g.moveTo(140,0);g.lineTo(220,120);g.lineTo(800,120);g.lineTo(880,0);g.stroke();
  g.fillStyle='#9aa3ad';g.font='bold 52px Arial';g.textAlign='center';g.fillText('G R A P H I C S',512,92);g.fillStyle='#4fc3f7';g.fillRect(220,190,580,10)});
TEX.io=ctex(256,512,(g,w,h)=>{g.fillStyle='#c4c9cf';g.fillRect(0,0,w,h);for(let i=0;i<600;i++){const v=rnd(170,240)|0;g.strokeStyle=`rgba(${v},${v},${v},.35)`;g.beginPath();const x=rnd(0,w);g.moveTo(x,0);g.lineTo(x,h);g.stroke()}});
TEX.board=ctex(1360,1640,(g)=>{
  g.scale(4,4);
  const gr=g.createLinearGradient(0,0,340,410);gr.addColorStop(0,'#1f5f3f');gr.addColorStop(1,'#11402a');g.fillStyle=gr;g.fillRect(0,0,340,410);
  for(let i=0;i<5000;i++){g.fillStyle=`rgba(0,0,0,${rnd(.02,.08)})`;g.fillRect(rnd(0,340),rnd(0,410),.4,.4)}
  g.strokeStyle='rgba(90,200,140,.22)';g.lineWidth=.55;
  const path=(pts)=>{g.beginPath();pts.forEach(([x,y],k)=>k?g.lineTo(x,y):g.moveTo(x,y));g.stroke()};
  for(let k=0;k<8;k++)path([[196,70+k*4],[228+k*2,70+k*4],[228+k*2,236+k*2],[300,236+k*2]]);
  for(let k=0;k<7;k++)path([[118+k*5,136],[118+k*5,190-k*3],[40,190-k*3]]);
  for(let k=0;k<6;k++)path([[230+k*4,300],[230+k*4,350+k*3],[320,350+k*3]]);
  for(let k=0;k<5;k++)path([[96,220+k*4],[230,220+k*4]]);
  for(let i=0;i<220;i++){g.fillStyle='rgba(200,170,90,.55)';g.beginPath();g.arc(rnd(40,330),rnd(20,400),.6,0,7);g.fill()}
  HOLES.forEach(([x,y])=>{g.fillStyle='#c9ced4';g.beginPath();g.arc(x,y,6,0,7);g.fill();g.fillStyle='#0b0d0f';g.beginPath();g.arc(x,y,3,0,7);g.fill()});
  [[106,46],[204,46],[106,144],[204,144]].forEach(([x,y])=>{g.fillStyle='#b9bfc6';g.beginPath();g.arc(x,y,4.6,0,7);g.fill();g.fillStyle='#050608';g.beginPath();g.arc(x,y,2.8,0,7);g.fill()});
  g.fillStyle='rgba(238,246,240,.85)';g.font='bold 5.5px Arial';
  const t=(s,x,y,f)=>{if(f)g.font=f;g.fillText(s,x,y)};
  t('ATX_12V',58,35);t('CPU_FAN',212,19);t('SYS_FAN',6,164);t('A1   A2   B1   B2',238,228);t('ATX_24P',306,184);t('SATA0',282,309);t('SATA1',282,325);t('BAT',176,190);
  SLOTS.forEach((s,i)=>t(`PCIE_${s.kind.toUpperCase()}_${i+1}`,s.x2+8,s.y+2));
  t('F_AUDIO',20,383);t('F_USB',160,383);t('SPK',214,385);t('F_PANEL',305,396);
  g.textAlign='center';g.font='bold 3.3px Arial';t('HDD_LED',269.2,380.6);t('RESET',284.2,380.6);t('PLED',269.2,408.6);t('PWR_SW',284.2,408.6);
  g.font='bold 4px Arial';g.fillStyle='#ffd54f';t('+',265.5,385.2);t('−',273,385.2);t('+',265.5,404.4);t('−',273,404.4);g.fillStyle='rgba(238,246,240,.85)';g.textAlign='left';
  g.font='bold 7px Arial';t('BENCH B75-ATX',30,236);g.font='4px Arial';t('REV 1.02',30,242);
  g.strokeStyle='rgba(238,246,240,.6)';g.lineWidth=.5;g.strokeRect(114,54,82,82);g.strokeRect(310,56,28,118);
});

/* ---------- materials ---------- */
const std=(o)=>new THREE.MeshStandardMaterial(o);
const MAT={
  wood:std({map:TEX.wood,roughness:.6,metalness:0}),
  casePaint:std({color:0x1d2025,roughness:.42,metalness:.6}),
  caseInner:std({color:0x2c3139,roughness:.55,metalness:.5}),
  steel:std({color:0xcfd4da,roughness:.3,metalness:.9,map:TEX.brush}),
  alu:std({color:0xe4e8ec,roughness:.26,metalness:.85,map:TEX.brush}),
  chrome:std({color:0xf4f6f8,roughness:.07,metalness:1}),
  gold:std({color:0xe6b94e,roughness:.22,metalness:1}),
  brass:std({color:0xc6973a,roughness:.3,metalness:1}),
  copper:std({color:0xc87a45,roughness:.28,metalness:1}),
  black:std({color:0x121316,roughness:.5,metalness:.05}),
  matte:std({color:0x0a0b0d,roughness:.85,metalness:0}),
  white:std({color:0xededed,roughness:.45}),
  grey:std({color:0x9aa2ac,roughness:.45}),
  pcb:std({color:0x174b31,roughness:.5,metalness:.1}),
  pcbBlue:std({color:0x15284a,roughness:.5,metalness:.1}),
  board:std({map:TEX.board,roughness:.5,metalness:.12}),
  red:std({color:0xc62828,roughness:.4}),
  sata:std({color:0xb3261e,roughness:.42}),
  blue:std({color:0x1e63c9,roughness:.4}),
  purple:std({color:0x6a3c8f,roughness:.5}),
  green:std({color:0x2e7d32,roughness:.5}),
  mat:std({map:TEX.mat,roughness:.92}),
  rubber:std({color:0x070708,roughness:.95}),
  braid:std({map:TEX.braid,roughness:.6}),
  cable:std({color:0x15171a,roughness:.5}),
  blade:std({color:0x1b1d21,roughness:.4,metalness:.1}),
  glass:new THREE.MeshPhysicalMaterial({color:0x9fb6cc,metalness:0,roughness:.03,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide,clearcoat:1,envMapIntensity:2.2}),
  ghost:new THREE.MeshBasicMaterial({color:0x4fc3f7,transparent:true,opacity:.12,depthWrite:false,side:THREE.DoubleSide}),
  strap:std({color:0x2a5ab8,roughness:.8}),
  led:std({color:0x222222,emissive:0x000000}),
};
const texMat=(t,o={})=>std({map:t,roughness:.5,metalness:.1,...o});

/* ---------- geometry helpers ---------- */
function mesh(geo,mat,parent,o={}){const m=new THREE.Mesh(geo,mat);m.castShadow=o.cast!==false;m.receiveShadow=true;parent&&parent.add(m);return m}
function bx(x0,y0,z0,x1,y1,z1,mat,parent,r=0){
  const w=Math.abs(x1-x0),h=Math.abs(y1-y0),d=Math.abs(z1-z0);
  const geo=r?new RoundedBoxGeometry(w,h,d,2,Math.max(.001,Math.min(r,w/2-.001,h/2-.001,d/2-.001))):new THREE.BoxGeometry(w,h,d);
  const m=mesh(geo,mat,parent);m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);return m;
}
function cyl(r,h,mat,parent,axis='y',seg=28,r2=r){const m=mesh(new THREE.CylinderGeometry(r,r2,h,seg),mat,parent);if(axis==='x')m.rotation.z=Math.PI/2;if(axis==='z')m.rotation.x=Math.PI/2;return m}
function tube(pts,r,mat,parent=scene,seg=64){const c=new THREE.CatmullRomCurve3(pts.map(p=>p.isVector3?p:V3(...p)));const m=mesh(new THREE.TubeGeometry(c,seg,r,10,false),mat,parent);return m}
function pins(list,h,parent,size=.16,mat=MAT.gold){const im=new THREE.InstancedMesh(new THREE.BoxGeometry(size,size,h),mat,list.length);const m4=new THREE.Matrix4();list.forEach(([x,y,z],k)=>{m4.makeTranslation(x,y,z);im.setMatrixAt(k,m4)});im.castShadow=true;parent.add(im);return im}
function finBlock(x0,y0,x1,y1,z0,z1,n,parent,dir='y'){
  const g=new THREE.Group();parent.add(g);bx(x0,y0,z0,x1,y1,z0+.15,MAT.alu,g);
  const W=Math.abs(x1-x0),H=Math.abs(y1-y0);const geo=dir==='y'?new THREE.BoxGeometry(W,H/n*.42,z1-z0-.15):new THREE.BoxGeometry(W/n*.42,H,z1-z0-.15);
  const im=new THREE.InstancedMesh(geo,MAT.alu,n);const m4=new THREE.Matrix4();const cx=(x0+x1)/2,cy=(y0+y1)/2,cz=(z0+.15+z1)/2;
  for(let k=0;k<n;k++){if(dir==='y')m4.makeTranslation(cx,Math.min(y0,y1)+(k+.5)*H/n,cz);else m4.makeTranslation(Math.min(x0,x1)+(k+.5)*W/n,cy,cz);im.setMatrixAt(k,m4)}
  im.castShadow=true;im.receiveShadow=true;g.add(im);return g;
}
const hitMat=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false});
function hitBox(parent,c,s){const m=new THREE.Mesh(new THREE.BoxGeometry(...s),hitMat);m.position.set(...c);m.userData.hit=true;parent.add(m);return m}
function label(text,pos,w=3.4){
  const t=ctex(512,112,(g)=>{g.fillStyle='rgba(8,12,18,.82)';g.beginPath();g.roundRect(4,4,504,104,22);g.fill();g.strokeStyle='rgba(79,195,247,.7)';g.lineWidth=4;g.stroke();
    g.fillStyle='#e6eef7';g.font='bold 54px Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(text,256,58)});
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:true,transparent:true}));s.scale.set(w,w*112/512,1);s.position.copy(pos);s.renderOrder=30;scene.add(s);return s;
}

/* ---------- registries ---------- */
const OBJ={}, CLICK=[], ZONES=[];
const reg=(id,o)=>(OBJ[id]=o,o);
function show(id){const o=OBJ[id];if(o)o.visible=true}
function hide(id){const o=OBJ[id];if(o)o.visible=false}
function isShown(o){while(o){if(!o.visible)return false;o=o.parent}return true}
function clickable(o,id){
  o.userData.click=id;
  o.traverse(m=>{if(m.isMesh&&!m.userData.hit&&!m.isInstancedMesh){m.material=Array.isArray(m.material)?m.material.map(x=>x.clone()):m.material.clone()}m.userData.clickRoot=o});
  CLICK.push(o); OBJ[id]=o; return o;
}
class Zone{
  constructor(name,parent,c,s,data={}){
    this.mesh=new THREE.Mesh(new THREE.BoxGeometry(...s),new THREE.MeshBasicMaterial({color:0x4fc3f7,transparent:true,opacity:0,depthWrite:false}));
    this.mesh.position.set(...c);this.mesh.userData.zone=this;this.mesh.renderOrder=20;parent.add(this.mesh);
    this.dataset={zone:name};for(const k in data)this.dataset[k]=String(data[k]);
    ZONES.push(this);
  }
  remove(){this.mesh.parent&&this.mesh.parent.remove(this.mesh);const i=ZONES.indexOf(this);if(i>=0)ZONES.splice(i,1)}
  world(){return this.mesh.getWorldPosition(V3(0,0,0))}
}
const zones=(name)=>ZONES.filter(z=>z.dataset.zone===name);
const zone1=(name,i)=>ZONES.find(z=>z.dataset.zone===name&&(i===undefined||z.dataset.i==String(i)));

/* ---------- tweens ---------- */
const TW=[];
const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
function tween(dur,fn,done,key){if(key){for(let i=TW.length-1;i>=0;i--)if(TW[i].key===key)TW.splice(i,1)}TW.push({t0:performance.now(),dur,fn,done,key});}
function flushTweens(){for(const t of TW.slice()){if(t.key==='cam')continue;const i=TW.indexOf(t);if(i>=0)TW.splice(i,1);t.fn(1);t.done&&t.done()}}
function tweenTo(o,{pos,rotX,rotY,rotZ,dur=500,arc=0,done}={}){
  const p0=o.position.clone(),r0=o.rotation.clone();
  tween(dur,k=>{if(pos){o.position.lerpVectors(p0,pos,k);o.position.y+=Math.sin(Math.PI*k)*arc}
    if(rotX!==undefined)o.rotation.x=r0.x+(rotX-r0.x)*k;if(rotY!==undefined)o.rotation.y=r0.y+(rotY-r0.y)*k;if(rotZ!==undefined)o.rotation.z=r0.z+(rotZ-r0.z)*k},done);
}
function dropIn(o,offset=V3(0,0,6),dur=550){const end=o.position.clone();o.position.add(offset);o.visible=true;tweenTo(o,{pos:end,dur})}
