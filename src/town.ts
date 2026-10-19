import * as THREE from 'three';
import {buildNewtownPlaza,addNewtownTower,type Builder} from './plaza';

/** Reference-led neighborhood composition. All architecture and landscaping are original geometry. */
export function buildCoastalTown(b:Builder){
 const scene=b.scene;
 const plane=(x:number,z:number,w:number,d:number,color:string,y=.015)=>{const geometry=new THREE.PlaneGeometry(w,d);const uv=geometry.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*w/4,uv.getY(i)*d/4);const mesh=new THREE.Mesh(geometry,b.material(color));mesh.rotation.x=-Math.PI/2;mesh.position.set(x,y,z);mesh.receiveShadow=true;scene.add(mesh);return mesh};
 // Continuous terrain reaches the coastal horizon, with no display plinth or floating edges.
 plane(0,0,220,190,'#b7cba2',-.025);plane(0,-330,1000,470,'#7199af',-.08);
 const road=(x:number,z:number,w:number,d:number)=>{plane(x,z,w+1.5,d+1.5,'#d4cfbd',.025);plane(x,z,w,d,'#a6aaa4',.045)};
 road(0,21,130,9);road(28,-8,9,130);road(-66,-24,8,80);road(-10,-23,95,8);road(-7,0,100,8);road(0,-17,8,35);
 // Central roundabout and connecting avenues preserve the focal point of the supplied photograph.
 const ring=new THREE.Shape();ring.absarc(0,0,12.5,0,Math.PI*2,false);const hole=new THREE.Path();hole.absarc(0,0,7,0,Math.PI*2,true);ring.holes.push(hole);const ringGeometry=new THREE.ShapeGeometry(ring,80);ringGeometry.rotateX(-Math.PI/2);const roundabout=new THREE.Mesh(ringGeometry,b.material('#a6aaa4'));roundabout.position.y=.055;roundabout.receiveShadow=true;scene.add(roundabout);buildNewtownPlaza(b);
 // Long lane markings, junction crossings and pavement sections establish a believable scale.
 for(let x=-60;x<65;x+=5){b.box(x,.065,21,2,.018,.1,'#e5ddcc');if(Math.abs(x)>16&&x>-57&&x<43)b.box(x,.065,0,2,.018,.1,'#e5ddcc')}
 for(let z=-65;z<55;z+=5)b.box(28,.065,z,.1,.018,2,'#e5ddcc');
 for(const x of [18,38])for(let i=-3;i<=3;i++)b.box(x+i*.65,.07,21,.34,.02,6.5,'#eee8db');
 plane(-18,-7.2,19,3.2,'#eee8db',.08);plane(20,15.5,14,3,'#eee8db',.08);plane(-21,6,16,3,'#eee8db',.08);
 // The reference's mid-rise glass office forms the foreground business destination.
 addNewtownTower(b,-17,-14,16,10,8.5,'ABOUT STUDIO','#d8d4cd');
 b.box(-17,1.3,-8.5,17,.3,2,'#d9d4c6');b.box(-17,9.7,-14,12,.25,7,'#b9b9b0');
 // Broad podium and a cluster of tall residences, rather than identical towers around the fountain.
 b.box(-45,1.5,-34,34,3,14,'#d3c8b7');
 for(let i=0;i<4;i++)addNewtownTower(b,-58+i*9,-35,7.4,9,22+(i%2)*3.5,i===3?'SERVICES':'JOYNO','#d9c7b7');
 b.collider(-45,-34,34,14,3);b.sign('SERVICES DISTRICT',-31,2,-26.8,10,'#34473e','#f5f1e5');
 // An octagonal pavilion with a broad burgundy hipped roof echoes the reference's low landmark.
 const pavilion=new THREE.Group();pavilion.position.set(-25,0,10);scene.add(pavilion);
 const base=b.cylinder(0,.45,0,7.1,7.1,.9,'#d9d4c6',pavilion,8);
 b.cylinder(0,2,0,6.4,6.4,3.2,'#ede0c8',pavilion,8);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;const window=b.box(Math.sin(a)*5.93,2.2,Math.cos(a)*5.93,3.6,1.8,.08,'#ffd49b',pavilion);window.rotation.y=a;b.cylinder(Math.sin(a)*6.2,2.1,Math.cos(a)*6.2,.13,.13,3.4,'#eee8db',pavilion,8);}
 const roof=b.cylinder(0,4.7,0,2.9,7.2,2.6,'#68464e',pavilion,8);roof.rotation.y=Math.PI/8;const upper=b.cylinder(0,6.25,0,1.8,3.1,.6,'#76535a',pavilion,8);upper.rotation.y=Math.PI/8;
 for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8;const path=new THREE.CatmullRomCurve3([new THREE.Vector3(Math.sin(a)*7.15,3.4,Math.cos(a)*7.15),new THREE.Vector3(Math.sin(a)*2.9,6,Math.cos(a)*2.9)]);const edge=new THREE.Mesh(new THREE.TubeGeometry(path,1,.045,4,false),b.material('#b1968d'));pavilion.add(edge)}
 b.sign('PROJECT GALLERY',0,2.6,6.5,10,'#513e34','#f4e7ce',0,pavilion);b.collider(-25,10,12,12,6);
 // Low commercial buildings on the right complete the junction without copying third-party branding.
 const lowBuilding=(x:number,z:number,w:number,d:number,title:string)=>{b.box(x,2.1,z,w,4.2,d,'#e4dfd2');b.box(x,4.35,z,w+.5,.3,d+.5,'#c7c6b9');b.box(x,2,z+d/2+.04,w-.8,2.3,.08,'#64888b');b.box(x,1.1,z+d/2+.7,w+.4,.18,1.8,'#a69b83');b.sign(title,x,3.6,z+d/2+.2,w-.5,'#34473e','#f5f1e5');b.collider(x,z,w,d,4.5)};
 lowBuilding(16,-10,10,10,'PROCESS WORKSHOP');lowBuilding(19,10,8,6,'CONTACT HUB');
 b.box(40,1.8,5,12,3.6,10,'#e7ddc9');b.box(40,3.9,5,13,.3,11,'#f0e9dc');b.box(40,1.9,10.04,10,2.1,.08,'#ffd49b');
 // Parking lots include marked bays and parked cars at road scale.
 for(const [x,z,w,d]of [[-17,-35,22,7],[40,-13,14,18],[-15,32,32,12]]){plane(x,z,w,d,'#a6aaa4',.035);for(let i=0;i<Math.floor(w/2.7);i++){const px=x-w/2+i*2.7;b.box(px,.055,z, .06,.02,d*.75,'#e5ddcc');if(i%3!==0){const car=new THREE.Group();car.position.set(px+1.2,.1,z);scene.add(car);b.box(0,.4,0,1.45,.65,2.7,['#b4b9ba','#b68f7f','#424d54'][i%3],car);b.box(0,.95,-.1,1.25,.5,1.4,'#64888b',car);}}}
 // Street trees and palms form lines along sidewalks; irregular canopy clusters soften the blocks.
 const tree=(x:number,z:number,s=1)=>{b.cylinder(x,1.6*s,z,.14*s,.2*s,3.2*s,'#7c6b52');for(let i=0;i<4;i++){const a=i*2.4;const crown=new THREE.Mesh(new THREE.SphereGeometry(1.35*s,8,6),b.material(i%2?'#42613b':'#55734a'));crown.position.set(x+Math.sin(a)*.6*s,3.5*s+(i%2)*.5*s,z+Math.cos(a)*.6*s);crown.scale.y=.9;crown.castShadow=true;scene.add(crown)}};
 for(let i=-5;i<=7;i++){const x=i*7;if(Math.abs(x)>11)tree(x,27,.8+(i%3)*.08);if(i%2===0&&Math.abs(x)>12)b.palm(x,-6,.85);}
 for(let i=0;i<12;i++){const z=-67+i*7;if(z>3&&z<18)continue;tree(34,z,.8);if(i%3===0)b.palm(-30,z,.9)}
 for(const [x,z,s]of [[-9,-9,.9],[9,-7,1],[-13,8,.8],[9,10,.9],[-29,6,1.1],[-32,18,.9],[17,-11,1],[46,14,1.1],[-5,35,1.3],[-47,-11,1.2],[15,-44,1.2]])tree(x,z,s);
 // Open land, low neighboring houses and a thin distant settlement lead to the ocean horizon.
 for(let row=0;row<4;row++)for(let col=0;col<10;col++){const x=-55+col*11+(row%2)*4+Math.sin(col*3.7+row)*2,z=-60-row*9+Math.cos(col+row*2.1)*2;const w=3.5+(col%3)*1.2,d=4+(row%3),h=1.7+(col%4)*.55;b.box(x,h/2,z,w,h,d,['#c7ba9d','#d7c6b8','#aaa89b'][col%3]);const roof=b.cylinder(x,h+.5,z,.05,1,1.2,['#87766b','#a57968','#667574'][row%3],scene,4);roof.rotation.y=Math.PI/4;roof.scale.set(w/Math.sqrt(2)+.4,1,d/Math.sqrt(2)+.4);for(let j=-1;j<=1;j++)b.box(x+j*w*.24,h*.6,z+d/2+.035,.5,.65,.03,(row+col+j)%5===0?'#ffd49b':'#64888b');if((row+col)%7===0)tree(x+4,z-3,.65);}
 // Small development patches vary the foreground grass without a repeating display-board pattern.
 for(let i=0;i<8;i++){const x=Math.sin(i*2.399)*75,z=Math.cos(i*1.72)*45;if(Math.abs(x)<50&&z>-45&&z<45)continue;const patch=new THREE.Mesh(new THREE.CircleGeometry(4+i%5,12),b.material(i%2?'#83916a':'#899272'));patch.rotation.x=-Math.PI/2;patch.position.set(x,.002,z);scene.add(patch);}
 // Warm lamps use emissive surfaces and baked-looking pools instead of dozens of dynamic lights.
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=64;const ctx=glowCanvas.getContext('2d')!;const gradient=ctx.createRadialGradient(32,32,1,32,32,32);gradient.addColorStop(0,'rgba(255,185,80,.65)');gradient.addColorStop(1,'rgba(255,185,80,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);const glowTexture=new THREE.CanvasTexture(glowCanvas);const glowMaterial=new THREE.MeshBasicMaterial({map:glowTexture,transparent:true,depthWrite:false,toneMapped:false});
 for(let i=-5;i<=6;i++){const x=i*10;for(const z of [15,27]){b.cylinder(x,2.7,z,.055,.08,5.4,'#566267');b.box(x,5.45,z,.8,.1,.28,'#ffd49b');const glow=new THREE.Mesh(new THREE.PlaneGeometry(8,8),glowMaterial);glow.rotation.x=-Math.PI/2;glow.position.set(x,.09,z);glow.name='town-light-pool';scene.add(glow)}}
 // A sky gradient wraps the district; aerial haze joins land and sea in the distance.
 const skyGeometry=new THREE.SphereGeometry(900,32,16);const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,toneMapped:false,fog:false,vertexShader:`varying vec3 vDirection;void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`precision highp float;varying vec3 vDirection;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
 float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=noise(p)*a;p=p*2.02+vec2(17.3,8.1);a*=.5;}return v;}
 void main(){vec3 d=normalize(vDirection);float h=clamp(d.y*2.,0.,1.);vec3 color=mix(vec3(.89,.69,.73),vec3(.40,.43,.62),h);float clouds=smoothstep(.35,.65,fbm(d.xz*7./max(.3,d.y+.45)));clouds*=smoothstep(-.05,.08,d.y);color=mix(color,mix(vec3(.65,.57,.69),vec3(.91,.82,.82),h),clouds*.8);float sun=pow(max(dot(d,normalize(vec3(-.8,.17,-.5))),0.),32.);color+=vec3(.36,.17,.04)*sun;gl_FragColor=vec4(color,1.);}`});const sky=new THREE.Mesh(skyGeometry,skyMaterial);sky.name='coastal-sunset-sky';scene.add(sky);scene.fog=new THREE.Fog('#dfbcc7',160,650);
}
