import * as THREE from 'three';

/** Small deterministic canvas maps: original, local and independent of image/CDN loading. */
export function surfaceTexture(kind:'asphalt'|'stone'|'grass'|'water',seed=17){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d')!;
 let state=seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};
 const pixels=ctx.createImageData(256,256);
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){const i=(y*256+x)*4;const n=random();let rgb:number[];
  if(kind==='asphalt'){const v=120+n*70;rgb=[v,v,v]}
  else if(kind==='grass')rgb=[85+n*42,110+n*48,65+n*28];
  else if(kind==='water'){const v=180+Math.sin(x*.19+Math.sin(y*.11))*20+Math.sin(y*.27)*15;rgb=[v,v,v]}
  else{const seam=x%64<2||y%64<2;const v=seam?156:225+n*24;rgb=[v,v,v-3]}
  pixels.data[i]=rgb[0];pixels.data[i+1]=rgb[1];pixels.data[i+2]=rgb[2];pixels.data[i+3]=255;
 }
 ctx.putImageData(pixels,0,0);const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.colorSpace=kind==='water'?THREE.NoColorSpace:THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}

export function outdoorEnvironment(renderer:THREE.WebGLRenderer){
 const sky=new THREE.Scene();const geometry=new THREE.SphereGeometry(50,32,16);const positions=geometry.attributes.position;const colors=[];const horizon=new THREE.Color('#e4bdca'),zenith=new THREE.Color('#9da1c6'),ground=new THREE.Color('#8e826b');
 for(let i=0;i<positions.count;i++){const y=positions.getY(i)/50;const color=horizon.clone().lerp(y>0?zenith:ground,Math.pow(Math.abs(y),.55));colors.push(color.r,color.g,color.b)}
 geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const material=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide});sky.add(new THREE.Mesh(geometry,material));
 const sun=new THREE.Mesh(new THREE.SphereGeometry(2,16,8),new THREE.MeshBasicMaterial({color:new THREE.Color(8,4.7,2.3)}));sun.position.set(-35,20,23);sky.add(sun);
 const generator=new THREE.PMREMGenerator(renderer);const target=generator.fromScene(sky,.06,.1,100);generator.dispose();geometry.dispose();material.dispose();sun.geometry.dispose();sun.material.dispose();return target;
}

export function realisticPalm(scene:THREE.Scene,x:number,z:number,scale:number,material:(color:string)=>THREE.MeshStandardMaterial){
 const group=new THREE.Group();group.position.set(x,0,z);group.scale.setScalar(scale);scene.add(group);
 const trunkCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(.08,1.6,0),new THREE.Vector3(.28,3.4,.04),new THREE.Vector3(.5,5.2,.1)]);
 const trunk=new THREE.Mesh(new THREE.TubeGeometry(trunkCurve,16,.15,9,false),material('#8e7a5b'));trunk.castShadow=true;group.add(trunk);
 for(let i=0;i<17;i++){const p=trunkCurve.getPoint(i/17);const ring=new THREE.Mesh(new THREE.TorusGeometry(.153,.012,3,9),material('#b09a78'));ring.rotation.x=Math.PI/2;ring.position.copy(p);group.add(ring)}
 const leaves=material('#3b683a');leaves.side=THREE.DoubleSide;leaves.roughness=.72;
 // Pinnate leaves follow arcing ribs, with individual tapered leaflets rather than solid cones.
 for(let i=0;i<9;i++){const angle=i*Math.PI*2/9+.15;const len=2.7+(i%3)*.24;
  const points=[];for(let j=0;j<=14;j++){const t=j/14;points.push(new THREE.Vector3(.5+Math.sin(angle)*len*t,5.2+Math.sin(t*Math.PI)*.7-t*t*1.25,.1+Math.cos(angle)*len*t));}
  const ribCurve=new THREE.CatmullRomCurve3(points);const rib=new THREE.Mesh(new THREE.TubeGeometry(ribCurve,14,.018,3,false),material('#6b8340'));group.add(rib);
  const vertices:number[]=[],uv:number[]=[],indices:number[]=[];
  for(let j=1;j<=13;j++){const t=j/14,p=points[j];for(const side of [-1,1]){const length=.72*Math.sin(t*Math.PI)*(.9+i%2*.1);const lateral=new THREE.Vector3(Math.cos(angle)*side,0,-Math.sin(angle)*side);const along=new THREE.Vector3(Math.sin(angle),0,Math.cos(angle));const tip=p.clone().addScaledVector(lateral,length).addScaledVector(along,.27);tip.y-=.25+t*.2;const start=vertices.length/3;const a=p.clone().addScaledVector(along,-.055),c=p.clone().addScaledVector(along,.055);vertices.push(a.x,a.y,a.z,tip.x,tip.y,tip.z,c.x,c.y,c.z);uv.push(0,0,.5,1,1,0);indices.push(start,start+1,start+2);}}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();const frond=new THREE.Mesh(geometry,leaves);frond.castShadow=true;group.add(frond);
 }
 for(let i=0;i<4;i++){const coconut=new THREE.Mesh(new THREE.SphereGeometry(.16,7,5),material('#746141'));coconut.position.set(.5+Math.cos(i*1.7)*.18,5.05,.1+Math.sin(i*1.7)*.18);group.add(coconut)}
}

/** Tapered curved body and organic fin silhouettes for an original bronze dolphin. */
export function realisticDolphin(scene:THREE.Scene,x:number,y:number,z:number,rotation:number,scale:number,material:THREE.Material){
 const group=new THREE.Group();group.position.set(x,y,z);group.rotation.set(.1,rotation,-.52);group.scale.setScalar(scale);scene.add(group);
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-1.65,-.3,0),new THREE.Vector3(-.85,-.05,0),new THREE.Vector3(0,.12,0),new THREE.Vector3(.75,.12,0),new THREE.Vector3(1.1,.04,0)]);
 const frames=curve.computeFrenetFrames(32,false);const vertices:number[]=[],indices:number[]=[],uv:number[]=[];
 for(let i=0;i<=32;i++){const t=i/32,center=curve.getPointAt(t);const radius=.04+.39*Math.pow(Math.sin(t*Math.PI),.8);for(let j=0;j<=14;j++){const a=j*Math.PI*2/14;const p=center.clone().addScaledVector(frames.normals[i],Math.cos(a)*radius*.85).addScaledVector(frames.binormals[i],Math.sin(a)*radius);vertices.push(p.x,p.y,p.z);uv.push(t,j/14);if(i<32&&j<14){const k=i*15+j;indices.push(k,k+15,k+1,k+1,k+15,k+16)}}}
 const bodyGeometry=new THREE.BufferGeometry();bodyGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));bodyGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));bodyGeometry.setIndex(indices);bodyGeometry.computeVertexNormals();const body=new THREE.Mesh(bodyGeometry,material);body.castShadow=true;group.add(body);
 const snout=new THREE.Mesh(new THREE.SphereGeometry(.16,12,8),material);snout.scale.set(2.1,.65,.7);snout.position.set(1.12,-.03,0);snout.castShadow=true;group.add(snout);
 function fin(points:number[][],position:THREE.Vector3,rotateX=0){const shape=new THREE.Shape();shape.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i+=3){if(points[i+2])shape.bezierCurveTo(points[i][0],points[i][1],points[i+1][0],points[i+1][1],points[i+2][0],points[i+2][1]);}const geometry=new THREE.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.025,bevelThickness:.02,curveSegments:5});const mesh=new THREE.Mesh(geometry,material);mesh.position.copy(position);mesh.rotation.x=rotateX;mesh.castShadow=true;group.add(mesh)}
 fin([[-.4,0],[-.2,.1],[-.12,.55],[.05,.65],[.08,.3],[.22,.12],[.35,0],[.1,-.04],[-.1,-.04],[-.4,0]],new THREE.Vector3(-.15,.35,0));
 for(const side of [-1,1])fin([[0,0],[-.2,-.1],[-.3,-.35],[-.6,-.65],[-.7,-.3],[-.4,-.03],[0,0]],new THREE.Vector3(.15,-.15,side*.28),side*1.0);
 for(const side of [-1,1])fin([[0,0],[-.2,.15],[-.4,.4],[-.55,.5],[-.45,.05],[-.2,-.1],[0,0]],new THREE.Vector3(-1.65,-.3,0),side*Math.PI/2);
}
