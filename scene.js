import * as THREE from 'three';

const host = document.querySelector('#experience');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x21172b, 0.035);
const camera = new THREE.PerspectiveCamera(38, innerWidth/innerHeight, 0.1, 100);
camera.position.set(0, 2.1, 12);
const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
host.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xcdb9e8, 1.6));
const key = new THREE.DirectionalLight(0xffead3, 3.2); key.position.set(-4,7,6); scene.add(key);
const lavender = new THREE.PointLight(0xb994ff, 28, 20); lavender.position.set(3,2,1); scene.add(lavender);
const goldLight = new THREE.PointLight(0xe6c58e, 18, 16); goldLight.position.set(-3,1,2); scene.add(goldLight);

const floorMat = new THREE.MeshStandardMaterial({color:0x2b2035, metalness:.7, roughness:.25});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(80,80), floorMat); floor.rotation.x=-Math.PI/2; floor.position.y=-1.65; scene.add(floor);
const platformMat = new THREE.MeshStandardMaterial({color:0xbba4d3, metalness:.55, roughness:.23, emissive:0x281238, emissiveIntensity:.5});
const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.5,.22,96), platformMat); platform.position.set(1,-1.43,0); scene.add(platform);
const platformRing = new THREE.Mesh(new THREE.TorusGeometry(2.32,.025,10,120), new THREE.MeshBasicMaterial({color:0xe9d5ff})); platformRing.rotation.x=Math.PI/2; platformRing.position.set(1,-1.29,0); scene.add(platformRing);

// Architectural arch ribs, creating a layered ceremonial hall.
const architecture = new THREE.Group(); scene.add(architecture);
for(let i=0;i<7;i++){
  const curve = new THREE.EllipseCurve(0,0,2.8+i*.48,4.1+i*.28,Math.PI,Math.PI*2,false,0);
  const pts = curve.getPoints(100).map(p=>new THREE.Vector3(p.x, p.y-0.3, -i*.85-1));
  const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),140,.035,8,false);
  const mat = new THREE.MeshStandardMaterial({color:i%2?0x8c6ba8:0xc9b1e4,metalness:.55,roughness:.28,emissive:0x392348,emissiveIntensity:.6});
  architecture.add(new THREE.Mesh(geo,mat));
}
for(let i=0;i<12;i++){
 const angle=i/12*Math.PI*2;
 const petal=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),new THREE.MeshStandardMaterial({color:i%2?0xbca0d9:0xe6d7f4,metalness:.3,roughness:.28,emissive:0x3d2454,emissiveIntensity:.45}));
 petal.scale.set(.22,.8,.17); petal.position.set(1+Math.cos(angle)*.85,-1.17,Math.sin(angle)*.85); petal.rotation.z=-Math.cos(angle)*.55; petal.rotation.x=Math.sin(angle)*.35; scene.add(petal);
}
// Procedural flowing ribbons: curved tubes animated in a slow breathing motion.
const ribbons=[];
for(let j=0;j<5;j++){
 const points=[];
 for(let k=0;k<=90;k++){const t=k/90; points.push(new THREE.Vector3(-4.3+t*8.3, .25+Math.sin(t*7+j*1.2)*.7 + j*.18, -1.3-j*.38 + Math.cos(t*5+j)*.42));}
 const curve=new THREE.CatmullRomCurve3(points);
 const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,180,.035+(j%2)*.018,8,false),new THREE.MeshStandardMaterial({color:[0xd9c3f0,0x9b79bf,0xe5d3ed,0xb99ad5,0xd1b2e7][j],metalness:.45,roughness:.2,emissive:0x372044,emissiveIntensity:.8}));
 scene.add(mesh); ribbons.push({mesh,curve,j});
}
// Abstract sculptural dancer silhouette, built from 3D primitives (replaceable by a detailed rigged model later).
const dancer=new THREE.Group(); dancer.position.set(1.15,-.95,.15); scene.add(dancer);
const skin=new THREE.MeshStandardMaterial({color:0xd7bba5,metalness:.12,roughness:.4});
const costume=new THREE.MeshStandardMaterial({color:0x9f78bf,metalness:.45,roughness:.22,emissive:0x321d49,emissiveIntensity:.5});
const gold=new THREE.MeshStandardMaterial({color:0xd8b875,metalness:.8,roughness:.22});
function capsule(a,b,r,mat){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=new THREE.Vector3().subVectors(B,A);const m=new THREE.Mesh(new THREE.CylinderGeometry(r*.72,r,d.length(),12),mat);m.position.copy(A).add(B).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());dancer.add(m);const s=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),mat);s.position.copy(A);dancer.add(s);return m;}
const torso=new THREE.Mesh(new THREE.SphereGeometry(.32,24,18),costume);torso.scale.set(.65,1.45,.48);torso.position.set(0,.35,0);dancer.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(.19,24,18),skin);head.position.set(.02,1.22,0);dancer.add(head);
const hair=new THREE.Mesh(new THREE.SphereGeometry(.21,20,16),new THREE.MeshStandardMaterial({color:0x211624,roughness:.7}));hair.scale.set(1,1.1,.9);hair.position.set(.02,1.28,-.025);dancer.add(hair);
capsule([-.17,.72,0],[-.5,1.02,0],.09,skin);
capsule([-.5,1.02,0],[-.85,1.34,.02],.075,skin);
capsule([.17,.72,0],[.45,.95,0],.09,skin);
capsule([.45,.95,0],[.72,1.26,0],.075,skin);
capsule([-.13,-.02,0],[-.26,-.48,.03],.12,costume);
capsule([-.26,-.48,.03],[-.5,-.92,.15],.09,skin);
capsule([.13,-.02,0],[.3,-.43,-.02],.12,costume);
capsule([.3,-.43,-.02],[.62,-.72,.15],.09,skin);
const sash=new THREE.Mesh(new THREE.TorusGeometry(.34,.035,8,40),gold);sash.position.set(0,.15,.02);sash.rotation.x=Math.PI/2;dancer.add(sash);
const halo=new THREE.Mesh(new THREE.TorusGeometry(.42,.018,8,60),new THREE.MeshBasicMaterial({color:0xe6cf9c}));halo.position.set(0,1.2,-.2);dancer.add(halo);

const particlesGeo=new THREE.BufferGeometry();const count=360;const positions=new Float32Array(count*3);
for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*14;positions[i*3+1]=(Math.random()-.5)*9;positions[i*3+2]=(Math.random()-.5)*9-1;}
particlesGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
const particles=new THREE.Points(particlesGeo,new THREE.PointsMaterial({color:0xe5d5fa,size:.025,transparent:true,opacity:.7}));scene.add(particles);

let pointerX=0,pointerY=0,targetX=0,targetY=0,scrollY=0;
addEventListener('pointermove',e=>{targetX=(e.clientX/innerWidth-.5)*2;targetY=(e.clientY/innerHeight-.5)*2;},{passive:true});
addEventListener('deviceorientation',e=>{if(e.gamma!==null){targetX=THREE.MathUtils.clamp(e.gamma/35,-1,1);targetY=THREE.MathUtils.clamp((e.beta-35)/45,-1,1)}},{passive:true});
addEventListener('scroll',()=>{scrollY=scrollY*.8+(scrollY*.2);},{passive:true});
let time=0;
function animate(){requestAnimationFrame(animate);time+=.008;pointerX+=(targetX-pointerX)*.025;pointerY+=(targetY-pointerY)*.025;
 camera.position.x=pointerX*.65;camera.position.y=2.1-pointerY*.28+Math.sin(time*.35)*.06;camera.lookAt(.1,.1,-1);
 architecture.rotation.y=pointerX*.035;
 dancer.rotation.y=Math.sin(time*.6)*.12+pointerX*.1;
 dancer.position.y=-.95+Math.sin(time*1.3)*.045;
 platformRing.rotation.z=time*.08;
 ribbons.forEach(({mesh,j})=>{mesh.position.y=Math.sin(time*.7+j)*.08;mesh.rotation.z=Math.sin(time*.25+j)*.025});
 particles.rotation.y=time*.012;particles.position.y=Math.sin(time*.25)*.08;
 renderer.render(scene,camera);
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));});
