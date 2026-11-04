'use strict';
/* PC Lab Assembly | MIT License | Educational use only. See DISCLAIMER.md */
/* =================== TECHNICIAN =================== */
let TECH=null;
const UPV=V3(0,1,0);
function setLimb(m,a,b){const d=b.clone().sub(a);const L=d.length();m.position.copy(a).addScaledVector(d,.5);m.scale.set(1,Math.max(L,.01),1);m.quaternion.setFromUnitVectors(UPV,d.normalize())}
function solveArm(Sh,T,a,b,pole){
  const d0=T.clone().sub(Sh);const u=d0.clone().normalize();const d=Math.min(Math.max(d0.length(),Math.abs(a-b)+.5),a+b-.2);
  const x=(a*a-b*b+d*d)/(2*d),h=Math.sqrt(Math.max(0,a*a-x*x));
  const pp=pole.clone().addScaledVector(u,-pole.dot(u)).normalize();
  return [Sh.clone().addScaledVector(u,x).addScaledVector(pp,h),Sh.clone().addScaledVector(u,d)];
}
function buildTech(){
  const g=new THREE.Group();scene.add(g);
  const skin=std({color:0xc68e6e,roughness:.62}),shirt=std({color:0x5b626d,roughness:.88}),pants=std({color:0x262a33,roughness:.85}),hair=std({color:0x2a1d14,roughness:.8}),shoe=std({color:0x141518,roughness:.55}),dark=std({color:0x1a1110,roughness:.6});
  const X=62,Z=-42;
  for(const sd of [-1,1]){const l=mesh(new THREE.CylinderGeometry(7,6,86,18),pants,g);l.position.set(X+sd*9,-47,Z);bx(X+sd*9-5.5,-90,Z-6,X+sd*9+5.5,-85,Z+13,shoe,g,2)}
  const pel=mesh(new THREE.CapsuleGeometry(12,6,8,20),pants,g);pel.scale.set(1.4,1,.85);pel.position.set(X,-4,Z);
  bx(X-17,1,Z-11,X+17,4,Z+11,std({color:0x18191c,roughness:.5}),g,1.2);
  const torso=new THREE.Group();g.add(torso);torso.position.set(X,0,Z);
  const chest=mesh(new THREE.CapsuleGeometry(13,30,10,24),shirt,torso);chest.scale.set(1.45,1,.78);chest.position.y=30;
  const collar=mesh(new THREE.TorusGeometry(6.6,1.3,10,24),shirt,torso);collar.rotation.x=Math.PI/2;collar.position.y=58.5;
  const vest=new THREE.Group();torso.add(vest);vest.visible=false;
  const vm=mesh(new THREE.CapsuleGeometry(13.7,27,10,24),texMat(TEX.vest,{roughness:.8}),vest);vm.scale.set(1.48,1,.84);vm.position.y=28.5;
  bx(-.35,7,11.1,.35,49,11.7,MAT.chrome,vest);
  const logo=mesh(new THREE.PlaneGeometry(7,7),texMat(TEX.esd,{transparent:true}),vest,{cast:false});logo.position.set(9,41,11.2);logo.rotation.y=.28;
  const neck=cyl(5.4,9,skin,torso);neck.position.y=63;
  const head=new THREE.Group();torso.add(head);head.position.y=76;
  const hm=mesh(new THREE.SphereGeometry(10,32,24),skin,head);hm.scale.set(.86,1.08,.95);
  const hr=mesh(new THREE.SphereGeometry(10.5,32,16,0,Math.PI*2,0,Math.PI*.52),hair,head);hr.scale.set(.9,1.05,1);hr.position.set(0,1.4,-.8);hr.rotation.x=-.28;
  for(const sd of [-1,1]){
    const ear=mesh(new THREE.SphereGeometry(2,12,10),skin,head);ear.scale.set(.5,1,.8);ear.position.set(sd*8.5,0,0);
    const eye=mesh(new THREE.SphereGeometry(.85,12,10),dark,head);eye.position.set(sd*3.1,1.6,8.55);
    bx(sd*3.1-1.8,3.6,8.2,sd*3.1+1.8,4.3,8.9,hair,head);
    const lens=mesh(new RoundedBoxGeometry(5.6,3.9,.3,2,.6),new THREE.MeshPhysicalMaterial({color:0xd8ecff,transparent:true,opacity:.25,roughness:.05,clearcoat:1}),head,{cast:false});lens.position.set(sd*3.3,1.5,10.1);
    bx(sd*7.6,2.6,1,sd*7.9,3.1,9.9,MAT.black,head);
  }
  bx(-6.5,3.4,9.7,6.5,3.9,10.3,MAT.black,head);
  const nose=mesh(new THREE.SphereGeometry(1.3,12,10),skin,head);nose.scale.set(.8,1,1.25);nose.position.set(0,-1,9.4);
  bx(-2,-5.3,8.4,2,-4.8,8.8,std({color:0x8a4a3a,roughness:.6}),head);
  const arm={};
  for(const sd of ['R','L']){
    const up=mesh(new THREE.CylinderGeometry(4.3,5.2,1,18),shirt,g),fo=mesh(new THREE.CylinderGeometry(3.3,4.2,1,18),shirt,g);
    const js=mesh(new THREE.SphereGeometry(5.5,20,14),shirt,g),je=mesh(new THREE.SphereGeometry(4.3,18,12),shirt,g);
    const hand=new THREE.Group();g.add(hand);
    const palm=mesh(new RoundedBoxGeometry(6.6,8.5,2.8,3,1.1),skin,hand);palm.position.y=4.6;
    const fing=mesh(new RoundedBoxGeometry(6.2,5,2.3,3,1),skin,hand);fing.position.set(0,10.2,.6);fing.rotation.x=.45;
    const th=mesh(new THREE.CapsuleGeometry(1.1,3.2,6,10),skin,hand);th.position.set(sd==='R'?3.6:-3.6,4,1.4);th.rotation.z=sd==='R'?-.6:.6;
    const cuff=mesh(new THREE.CylinderGeometry(3.6,3.6,1.6,16),skin,hand);cuff.position.y=.3;
    arm[sd]={up,fo,js,je,hand};
  }
  const held=new THREE.Group();arm.R.hand.add(held);held.visible=false;held.position.set(0,6,2.2);
  cyl(.95,8,MAT.red,held,'y',18).position.y=0;cyl(.25,9,MAT.chrome,held,'y',10).position.y=8.5;
  const band=new THREE.Group();arm.L.hand.add(band);band.visible=false;
  const bt=mesh(new THREE.TorusGeometry(3.9,.85,12,32),MAT.strap,band);bt.rotation.x=Math.PI/2;bt.position.y=-1;
  bx(-1.4,-2.2,3.9,1.4,.2,5.4,MAT.chrome,band,.4);
  const coil=mesh(new THREE.BufferGeometry(),MAT.cable,scene,{cast:false});coil.visible=false;
  TECH={g,torso,chest,vest,head,arm,held,band,coil,
    sh:{R:V3(X-20,51,Z+1),L:V3(X+20,51,Z+1)},rest:{R:V3(46,2.6,-17),L:V3(78,2.6,-16)},
    cur:{R:V3(46,2.6,-17),L:V3(78,2.6,-16)},tgt:{R:V3(46,2.6,-17),L:V3(78,2.6,-16)},until:{R:0,L:0},driving:0,coilAt:null,coilT:0};
  new Zone('tech',scene,[X,30,Z],[42,64,26]);
}
function reachTo(p,hand,ms=1100){if(!TECH||!p)return;hand=hand||(p.x>58?'L':'R');TECH.tgt[hand].copy(p);TECH.until[hand]=performance.now()+ms}
function wearVest(){hide('vestHook');const v=TECH.vest;v.visible=true;v.scale.setScalar(1.25);tween(500,k=>v.scale.setScalar(1.25-.25*k))}
function updateTech(dt,now){
  const t=TECH;if(!t)return;
  const br=Math.sin(now/950);t.chest.scale.z=.78*(1+br*.012);t.vest.children[0]&&(t.vest.children[0].scale.z=.84*(1+br*.012));
  const hw=t.head.getWorldPosition(V3(0,0,0)),look=controls.target.clone().sub(hw);
  const yaw=Math.max(-.75,Math.min(.75,Math.atan2(look.x,look.z))),pitch=Math.max(-.15,Math.min(.65,Math.atan2(-look.y,Math.hypot(look.x,look.z))));
  const a=1-Math.exp(-dt*4);t.head.rotation.y+=(yaw-t.head.rotation.y)*a;t.head.rotation.x+=(pitch-t.head.rotation.x)*a;
  for(const sd of ['R','L']){
    if(now>t.until[sd])t.tgt[sd].copy(t.rest[sd]);
    t.cur[sd].lerp(t.tgt[sd],1-Math.exp(-dt*7));
    const pole=V3(sd==='R'?-.7:.7,-1,-.5);const [E,H]=solveArm(t.sh[sd],t.cur[sd],29,27,pole);
    const A=t.arm[sd];setLimb(A.up,t.sh[sd],E);setLimb(A.fo,E,H);A.js.position.copy(t.sh[sd]);A.je.position.copy(E);
    A.hand.position.copy(H);A.hand.quaternion.setFromUnitVectors(UPV,H.clone().sub(E).normalize());
  }
  t.held.visible=S.tool==='screwdriver'&&now>t.driving;
  t.band.visible=S.grounded;
  if(S.grounded){const w=t.arm.L.hand.getWorldPosition(V3(0,0,0));
    if(!t.coilAt||(w.distanceTo(t.coilAt)>.4&&now-t.coilT>90)){t.coilAt=w.clone();t.coilT=now;
      const a0=V3(83.5,.6,-5.2),mid=a0.clone().lerp(w,.5);mid.y=Math.min(a0.y,w.y)-1.5;const curve=new THREE.QuadraticBezierCurve3(a0,mid,w);
      const pts=[];const N=240;for(let k=0;k<=N;k++){const q=k/N,c=curve.getPoint(q),an=q*Math.PI*2*22;pts.push(V3(c.x+Math.cos(an)*.55,c.y+Math.sin(an)*.55,c.z+Math.cos(an)*.3))}
      t.coil.geometry.dispose();t.coil.geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),480,.1,6,false);t.coil.visible=true}}
}
