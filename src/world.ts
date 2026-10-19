import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import RAPIER from '@dimforge/rapier3d-compat';
import {destinations, type Destination} from './content';
import {buildCoastalTown} from './town';
import {ArcadeHandling} from './handling';
import {CameraNavigation} from './camera-navigation';
import {surfaceTexture,outdoorEnvironment,realisticPalm} from './realism';

export type Quality='High'|'Light';
export class CreativeWorld {
 renderer:THREE.WebGLRenderer;scene=new THREE.Scene();camera:THREE.PerspectiveCamera;physics!:RAPIER.World;body!:RAPIER.RigidBody;
 car=new THREE.Group();wheels:THREE.Mesh[]=[];keys=new Set<string>();quality:Quality='High';exploring=false;paused=false;disposed=false;
 position={x:0,z:8};near:Destination|undefined;onNear:(d:Destination|undefined)=>void=()=>{};onFrame:()=>void=()=>{};
 private raf=0;private last=0;private accumulator=0;private handling=new ArcadeHandling();private previousAngle=Math.PI/2;private angle=Math.PI/2;private speed=0;private lastSafe={x:0,z:8};private lastMoving=0;private checkpointTime=0;
 private navigation:CameraNavigation;private environmentTarget:THREE.WebGLRenderTarget;private surfaceMaps=new Map<string,THREE.Texture>();private materials=new Map<string,THREE.MeshStandardMaterial>();private textures:THREE.Texture[]=[];private resizeObserver:ResizeObserver;private look=new THREE.Vector3(-13,0,0);private viewDistance=95;private targetViewDistance=95;private cameraOffset=new THREE.Vector3(18,16,65).normalize();private driveOffset=new THREE.Vector3(26,35,45).normalize();private aerialOffset=new THREE.Vector3(18,16,65).normalize();private temp=new THREE.Vector3();private reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;private previous=new THREE.Vector3();private current=new THREE.Vector3();
 stats={fps:0,calls:0,triangles:0};private frameCount=0;private frameTime=0;
 constructor(private host:HTMLElement){
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});this.renderer.setClearColor(0x000000,0);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1;host.append(this.renderer.domElement);this.environmentTarget=outdoorEnvironment(this.renderer);this.scene.environment=this.environmentTarget.texture;this.scene.environmentIntensity=.65;
  this.camera=new THREE.PerspectiveCamera(42,1,.1,1500);this.scene.add(new THREE.HemisphereLight(0xd3c8ee,0x817458,1.45));
  const sun=new THREE.DirectionalLight(0xffbc7b,3.5);sun.position.set(-65,75,45);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-85,right:85,top:75,bottom:-75,near:1,far:250});sun.shadow.normalBias=.04;sun.shadow.bias=-.0002;sun.shadow.radius=4;this.scene.add(sun);this.scene.add(sun.target);
  this.navigation=new CameraNavigation(this.host,this.camera,()=>this.viewDistance,()=>Boolean(this.body)&&!this.paused&&!this.disposed,()=>this.clearInput());
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
 }
 async init(){
  await RAPIER.init();if(this.disposed)return;this.physics=new RAPIER.World({x:0,y:-9.81,z:0});this.physics.timestep=1/60;
  const ground=this.physics.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0,-.6,0));this.physics.createCollider(RAPIER.ColliderDesc.cuboid(80,.6,75).setFriction(.8),ground);
  this.buildWorld();this.batchScenery();this.buildCar();this.body=this.physics.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0,.52,8).lockRotations().setLinearDamping(2).setCcdEnabled(true));this.physics.createCollider(RAPIER.ColliderDesc.roundCuboid(.52,.35,.92,.12).setFriction(0).setRestitution(.05).setMass(4),this.body);this.body.setRotation({x:0,y:Math.sin(this.angle/2),z:0,w:Math.cos(this.angle/2)},true);this.previous.set(0,.52,8);this.current.copy(this.previous);
  this.last=performance.now();this.raf=requestAnimationFrame(this.frame);
 }
 private surface(kind:'asphalt'|'stone'|'grass'|'water'){let texture=this.surfaceMaps.get(kind);if(!texture){texture=surfaceTexture(kind);this.surfaceMaps.set(kind,texture);this.textures.push(texture)}return texture}
 private material(color:string){let m=this.materials.get(color);if(!m){m=color==='#83b8bd'?new THREE.MeshPhysicalMaterial({color,roughness:.12,metalness:.12,clearcoat:1,clearcoatRoughness:.08,transparent:true,opacity:.93}):new THREE.MeshStandardMaterial({color,roughness:.72,metalness:0});
  if(color==='#a6aaa4'){m.color.set('#686d70');m.map=this.surface('asphalt');m.bumpMap=m.map;m.bumpScale=.035;m.roughness=.94;}
  if(['#b7cba2','#a3b48a'].includes(color)){m.map=this.surface('grass');m.bumpMap=m.map;m.bumpScale=.035;m.roughness=.97;}
  if(['#d4cfbd','#eee8db','#e1dbca','#d6d2c5','#c8c4b7','#d9d4c6'].includes(color)){m.map=this.surface('stone');m.bumpMap=m.map;m.bumpScale=.018;m.roughness=.8;}
  if(['#64888b','#7d9997','#435f58','#3d615b'].includes(color)){m.color.set(color==='#7d9997'?'#73929a':'#456c7a');m.metalness=.55;m.roughness=.16;m.envMapIntensity=1.5;}
  if(color==='#8a7658'){m.color.set('#806345');m.metalness=.85;m.roughness=.3;m.envMapIntensity=1.2;}
  if(color==='#83b8bd'){m.color.set('#5599a5');m.roughness=.13;m.metalness=.35;m.bumpMap=this.surface('water');m.bumpScale=.04;m.envMapIntensity=1.6;}
  if(color==='#ffd49b'){m.emissive.set('#ffb660');m.emissiveIntensity=1.4;m.roughness=.35;}
  if(color==='#7199af'){m.roughness=.28;m.metalness=.25;m.envMapIntensity=1.2;}
  if(color==='#b7dfdc'){m.color.set('#d2f2ed');m.roughness=.15;m.metalness=.15;}
  this.materials.set(color,m)}return m}
 private box(x:number,y:number,z:number,w:number,h:number,d:number,color:string,parent:THREE.Object3D=this.scene){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),this.material(color));mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh}
 private cylinder(x:number,y:number,z:number,r1:number,r2:number,h:number,color:string,parent:THREE.Object3D=this.scene,segments=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),this.material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 private roundShape(w:number,h:number,r:number){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s}
 private slab(w:number,d:number,r:number,y:number,h:number,color:string){const g=new THREE.ExtrudeGeometry(this.roundShape(w,d,r),{depth:h,bevelEnabled:false,curveSegments:8});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,this.material(color));m.position.y=y;m.receiveShadow=true;m.castShadow=true;this.scene.add(m);return m}
 private collider(x:number,z:number,w:number,d:number,h=4){const body=this.physics.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x,h/2,z));this.physics.createCollider(RAPIER.ColliderDesc.cuboid(w/2,h/2,d/2),body)}
 private sign(text:string,x:number,y:number,z:number,width=5,color='#283630',bg='#f8f4e8',rotation=0,parent:THREE.Object3D=this.scene){const c=document.createElement('canvas');c.width=768;c.height=160;const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,768,160);ctx.fillStyle=color;ctx.font='bold 62px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,84,730);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;this.textures.push(t);const m=new THREE.Mesh(new THREE.PlaneGeometry(width,width*160/768),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=rotation;parent.add(m);return m}
 private palm(x:number,z:number,scale=1){realisticPalm(this.scene,x,z,scale,this.material.bind(this))}
 private planter(x:number,z:number,s=1){this.cylinder(x,.25,z,.6*s,.5*s,.5,'#d6c9ad');for(let i=0;i<7;i++){const angle=i*2.399;const leaf=new THREE.Mesh(new THREE.SphereGeometry(.38*s,8,6),this.material(i%2?'#55734a':'#48653e'));leaf.position.set(x+Math.sin(angle)*.37*s,.65*s+(i%3)*.13*s,z+Math.cos(angle)*.37*s);leaf.scale.set(1,.85,1);leaf.castShadow=true;this.scene.add(leaf)}}
 private building(x:number,z:number,w:number,d:number,h:number,color:string,title:string){this.box(x,.2,z,w+.6,.4,d+.6,'#e9e4d5');this.box(x,h/2+.4,z,w,h,d,color);this.box(x,h+.5,z,w+.35,.22,d+.35,'#f5f0df');this.box(x,h*.5,z+d/2+.02,w*.7,h*.55,.08,'#435f58');for(let i=-1;i<=1;i++)this.box(x+i*w*.24,h*.5,z+d/2+.09,.07,h*.6,.1,'#e7deca');this.box(x,h*.13,z+d/2+.5,w+.2,.16,1.2,'#e1d5bc');this.sign(title,x,h+.9,z+d/2+.15,w*.9);this.collider(x,z,w+.2,d+.2,h);return h}
 private buildWorld(){
  const builders={scene:this.scene,box:this.box.bind(this),cylinder:this.cylinder.bind(this),material:this.material.bind(this),palm:this.palm.bind(this),sign:this.sign.bind(this),collider:this.collider.bind(this)};
  buildCoastalTown(builders);
  const fountain=this.physics.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0,.65,0));this.physics.createCollider(RAPIER.ColliderDesc.cylinder(.65,5.7),fountain);
  const markerOutline=new THREE.MeshBasicMaterial({color:'#153447',side:THREE.DoubleSide,toneMapped:false});
  const markerBright=new THREE.MeshBasicMaterial({color:'#00e5ff',side:THREE.DoubleSide,toneMapped:false});
  const outlineGeometry=new THREE.RingGeometry(1.95,2.5,64),markerGeometry=new THREE.RingGeometry(2.05,2.4,64);
  for(const d of destinations){
   const outline=new THREE.Mesh(outlineGeometry,markerOutline);outline.rotation.x=-Math.PI/2;outline.position.set(d.x,.15,d.z);this.scene.add(outline);
   const ring=new THREE.Mesh(markerGeometry,markerBright);ring.rotation.x=-Math.PI/2;ring.position.set(d.x,.165,d.z);this.scene.add(ring);
   this.sign(d.number,d.x,.38,d.z,1.3,'#153447','#00e5ff');
  }
 }
 private batchScenery(){
  this.scene.updateMatrixWorld(true);const groups=new Map<THREE.Material,{meshes:THREE.Mesh[];geometries:THREE.BufferGeometry[]}>();
  this.scene.traverse(o=>{if(o instanceof THREE.Mesh&&o.material instanceof THREE.MeshStandardMaterial){let group=groups.get(o.material);if(!group){group={meshes:[],geometries:[]};groups.set(o.material,group)}group.meshes.push(o);group.geometries.push(o.geometry.clone().applyMatrix4(o.matrixWorld))}});
  for(const [material,group]of groups){const geometry=mergeGeometries(group.geometries);if(geometry){const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;this.scene.add(mesh);group.meshes.forEach(m=>{m.removeFromParent();m.geometry.dispose()})}group.geometries.forEach(g=>g.dispose())}
 }
 private buildCar(){this.scene.add(this.car);this.box(0,.35,0,1.4,.7,2.5,'#f44a25',this.car);this.box(0,.92,-.2,1.32,.62,1.65,'#faf1db',this.car);this.box(0,.93,.65,1.15,.43,.04,'#3d615b',this.car);this.box(0,.94,-1.04,1.1,.4,.035,'#3d615b',this.car);this.box(-.67,.93,.32,.035,.42,.45,'#3d615b',this.car);this.box(.67,.93,.32,.035,.42,.45,'#3d615b',this.car);this.box(0,.12,1.3,1.3,.2,.15,'#f5ebd1',this.car);for(const x of [-.48,.48])this.box(x,.4,1.26,.25,.18,.05,'#ffe3a2',this.car);for(const x of [-.75,.75])for(const z of [-.77,.78]){const tire=this.cylinder(x,.08,z,.34,.34,.22,'#354039',this.car,12);tire.rotation.z=Math.PI/2;this.wheels.push(tire);const hub=this.cylinder(x*1.13,.08,z,.16,.16,.025,'#e8d8ba',this.car,12);hub.rotation.z=Math.PI/2}this.sign('JOYNO',-.715,.5,-.25,1.4,'#fff5df','#f44a25',-Math.PI/2,this.car);this.sign('JOYNO',.715,.5,-.25,1.4,'#fff5df','#f44a25',Math.PI/2,this.car);this.car.rotation.y=this.angle;}
 get cameraState(){return{zoom:this.navigation.zoom,pan:{x:this.navigation.pan.x,z:this.navigation.pan.z},dragging:this.navigation.dragging}}
 centerView(){this.navigation.center()}
 setQuality(q:Quality){this.quality=q;this.renderer.setPixelRatio(Math.min(devicePixelRatio,q==='Light'?1:1.75));this.renderer.shadowMap.enabled=q==='High';this.scene.traverse(o=>{if(o instanceof THREE.Mesh){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.needsUpdate=true)}});this.resize()}
 setExploring(value:boolean){if(value!==this.exploring)this.navigation.center();this.exploring=value;this.keys.clear();this.handling.stop();this.speed=0;this.resize()}
 reset(destination?:Destination){const p=destination?{x:destination.x,z:destination.z}:this.lastSafe;this.body.setTranslation({x:p.x,y:.52,z:p.z},true);this.body.setLinvel({x:0,y:0,z:0},true);this.body.setAngvel({x:0,y:0,z:0},true);this.previous.set(p.x,.52,p.z);this.current.copy(this.previous);this.navigation.center();this.handling.reset();this.angle=this.handling.angle;this.previousAngle=this.angle;this.body.setRotation({x:0,y:Math.sin(this.angle/2),z:0,w:Math.cos(this.angle/2)},true);this.speed=0;this.keys.clear();this.accumulator=0;this.lastSafe={...p};this.position={...p};}
 clearInput(){if(this.disposed)return;this.keys.clear();this.handling.stop();this.speed=0;if(this.body)this.body.setLinvel({x:0,y:this.body.linvel().y,z:0},true)}
 private resize(){const w=this.host.clientWidth,h=this.host.clientHeight;this.renderer.setSize(w,h);const aspect=w/h;let size=this.exploring?26:42;if(aspect<.8)size=this.exploring?30:58;this.camera.aspect=aspect;this.targetViewDistance=size/Math.tan(THREE.MathUtils.degToRad(this.camera.fov/2));this.camera.updateProjectionMatrix();}
 private fixedStep(){this.previous.copy(this.current);this.previousAngle=this.angle;
  if(!this.paused&&this.exploring){
   const actual=this.body.linvel();this.handling.reconcileCollision(actual.x,actual.z);
   this.handling.update({forward:this.keys.has('forward'),reverse:this.keys.has('reverse'),left:this.keys.has('left'),right:this.keys.has('right'),brake:this.keys.has('brake')},1/60);
   this.speed=this.handling.speed;this.angle=this.handling.angle;
   this.body.setRotation({x:0,y:Math.sin(this.angle/2),z:0,w:Math.cos(this.angle/2)},true);
   this.body.setLinvel({x:Math.sin(this.angle)*this.speed,y:actual.y,z:Math.cos(this.angle)*this.speed},true);
  }else{this.handling.stop();this.speed=0;this.body.setLinvel({x:0,y:this.body.linvel().y,z:0},true)}
  this.physics.step();const p=this.body.translation();this.current.set(p.x,p.y,p.z);if(Math.abs(p.x)>70||Math.abs(p.z)>60||p.y<-.5){this.reset();return}this.position.x=p.x;this.position.z=p.z;if(Math.hypot(this.body.linvel().x,this.body.linvel().z)>.1)this.lastMoving=performance.now();if(this.speed>3&&performance.now()-this.lastMoving>5000)this.reset();
  const near=destinations.filter(d=>Math.hypot(d.x-p.x,d.z-p.z)<3.7).sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z))[0];if(near?.id!==this.near?.id){this.near=near;this.onNear(near)}if(near&&performance.now()-this.checkpointTime>2000){this.lastSafe={x:near.x,z:near.z};this.checkpointTime=performance.now()}
 }
 private frame=(now:number)=>{if(this.disposed)return;this.raf=requestAnimationFrame(this.frame);const dt=Math.min((now-this.last)/1000,.1);this.last=now;if(document.hidden||this.host.clientWidth===0){this.accumulator=0;return}this.accumulator+=dt;let steps=0;while(this.accumulator>=1/60&&steps<5){this.fixedStep();this.accumulator-=1/60;steps++}if(steps===5)this.accumulator=0;this.car.position.lerpVectors(this.previous,this.current,this.accumulator*60);this.car.position.y+=.12;this.car.rotation.y=THREE.MathUtils.lerp(this.previousAngle,this.angle,this.accumulator*60);this.car.rotation.z=THREE.MathUtils.lerp(this.car.rotation.z,this.reduced?0:-this.handling.steering*this.speed*.006,1-Math.exp(-dt*10));for(const wheel of this.wheels)wheel.rotation.x+=this.speed*dt*2;
  if(this.exploring){this.temp.set(this.position.x+Math.sin(this.angle)*this.speed*.12,0,this.position.z+Math.cos(this.angle)*this.speed*.12)}else if(this.host.clientWidth/this.host.clientHeight<.8){this.temp.set(-10,0,-30)}else{this.temp.set(-14,0,-30)}this.navigation.update(dt,this.keys.has('forward')||this.keys.has('reverse'),this.reduced);this.temp.add(this.navigation.pan);this.look.lerp(this.temp,this.reduced?1:1-Math.exp(-dt*3));this.cameraOffset.lerp(this.exploring?this.driveOffset:this.aerialOffset,this.reduced?1:1-Math.exp(-dt*3));this.viewDistance+=(this.targetViewDistance*this.navigation.zoom-this.viewDistance)*(this.reduced?1:1-Math.exp(-dt*4));this.camera.position.copy(this.look).addScaledVector(this.cameraOffset,this.viewDistance);this.camera.lookAt(this.look);this.renderer.render(this.scene,this.camera);this.onFrame();this.frameTime+=dt;this.frameCount++;if(this.frameTime>1){this.stats={fps:Math.round(this.frameCount/this.frameTime),calls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles};this.frameTime=0;this.frameCount=0;}
 }
 dispose(){this.disposed=true;cancelAnimationFrame(this.raf);this.navigation.dispose();this.resizeObserver.disconnect();this.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if('map' in m&&m.map instanceof THREE.Texture)this.textures.push(m.map);m.dispose()})}});new Set(this.textures).forEach(t=>t.dispose());this.physics?.free();this.environmentTarget.dispose();this.renderer.dispose();this.renderer.domElement.remove()}
}
