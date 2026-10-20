import * as T from 'three';
import {SVGLoader} from 'three/addons/loaders/SVGLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {platforms} from './hero-icons';

// Give SVG stroke triangles closed front/back faces and boundary walls.
function solidStroke(flat:T.BufferGeometry,depth:number){
 const f=flat.index?flat.toNonIndexed():flat;const p=f.getAttribute('position'),out:number[]=[];
 const edges=new Map<string,{a:number[];b:number[];n:number}>();
 const key=(v:number[])=>v.slice(0,2).map(x=>x.toFixed(4)).join(',');
 const tri=(a:number[],b:number[],c:number[],z:number)=>out.push(a[0],a[1],z,b[0],b[1],z,c[0],c[1],z);
 for(let i=0;i<p.count;i+=3){const vs=[0,1,2].map(j=>[p.getX(i+j),p.getY(i+j)]);tri(vs[0],vs[1],vs[2],depth);tri(vs[2],vs[1],vs[0],0);for(let j=0;j<3;j++){const a=vs[j],b=vs[(j+1)%3],k=[key(a),key(b)].sort().join('|'),e=edges.get(k);if(e)e.n++;else edges.set(k,{a,b,n:1})}}
 for(const {a,b,n} of edges.values())if(n===1){out.push(a[0],a[1],0,b[0],b[1],0,b[0],b[1],depth,a[0],a[1],0,b[0],b[1],depth,a[0],a[1],depth)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(out,3));g.computeVertexNormals();flat.dispose();if(f!==flat)f.dispose();return g;
}
export function mountHeroScene(host:HTMLElement){
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setClearColor(0,0);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
 host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,100);camera.position.set(0,1,28);camera.lookAt(0,0,0);
 const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new T.HemisphereLight(0xffffff,0xa597bb,1.3));const key=new T.DirectionalLight(0xfff5ef,2.5);key.position.set(-6,9,12);scene.add(key);const rim=new T.DirectionalLight(0xd5c9ff,2);rim.position.set(9,4,-3);scene.add(rim);
 const materials:T.Material[]=[],geometries:T.BufferGeometry[]=[];
 const material=(color:string,metalness=.3)=>{const m=new T.MeshPhysicalMaterial({color,metalness,roughness:.25,clearcoat:1,clearcoatRoughness:.16,side:T.DoubleSide});materials.push(m);return m};
 const ribbonMat=material('#cfc8e7',.55),edgeMat=material('#77679e',.45);
 const curveY=(x:number)=>-5.1+.045*(x+.8)**2+.065*x;
 // A closed strip with real thickness, curved across both its length and width.
 const N=150,W=12,pos:number[]=[],uv:number[]=[],indices:number[]=[];
 for(let layer=0;layer<2;layer++)for(let i=0;i<=N;i++){const x=-17+34*i/N;for(let j=0;j<=W;j++){const v=j/W,z=(v-.5)*3.4;pos.push(x,curveY(x)+(v-.5)*3.2+Math.sin(v*Math.PI)*.25-layer*.12,z);uv.push(i/N*28,v)}}
 const row=W+1,slab=(N+1)*row;
 for(let l=0;l<2;l++)for(let i=0;i<N;i++)for(let j=0;j<W;j++){const a=l*slab+i*row+j,b=a+row;indices.push(a,b,a+1,b,b+1,a+1)}
 const ribbonG=new T.BufferGeometry();ribbonG.setAttribute('position',new T.Float32BufferAttribute(pos,3));ribbonG.setAttribute('uv',new T.Float32BufferAttribute(uv,2));ribbonG.setIndex(indices);ribbonG.computeVertexNormals();geometries.push(ribbonG);
 const texCanvas=document.createElement('canvas');texCanvas.width=128;texCanvas.height=128;const ctx=texCanvas.getContext('2d')!;ctx.fillStyle='#bfb6d6';ctx.fillRect(0,0,128,128);ctx.strokeStyle='#dcd5ec';ctx.lineWidth=1;for(let i=0;i<128;i+=4){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,128);ctx.stroke()}const texture=new T.CanvasTexture(texCanvas);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(1,1);texture.colorSpace=T.SRGBColorSpace;ribbonMat.map=texture;ribbonMat.bumpMap=texture;ribbonMat.bumpScale=.025;
 const ribbonGroup=new T.Group();scene.add(ribbonGroup);const ribbon=new T.Mesh(ribbonG,ribbonMat);ribbon.name='sculptural-ribbon';ribbonGroup.add(ribbon);
 for(const j of [0,W]){const strip:number[]=[],ix:number[]=[];for(let i=0;i<=N;i++){const a=(i*row+j)*3;strip.push(pos[a],pos[a+1],pos[a+2],pos[a],pos[a+1]-.12,pos[a+2]);if(i<N){const k=i*2;ix.push(k,k+1,k+2,k+1,k+3,k+2)}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(strip,3));g.setIndex(ix);g.computeVertexNormals();geometries.push(g);ribbonGroup.add(new T.Mesh(g,edgeMat))}
 const loader=new SVGLoader();
 const logos=platforms.map((platform,index)=>{
  const group=new T.Group();group.name=platform.name;
  const body=platform.icon.replaceAll('currentColor',platform.color).replaceAll('var(--disc-color)','#ffffff');
  const svg=loader.parse(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${platform.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`);
  for(const path of svg.paths){const style=path.userData!.style;const color=style.fill&&style.fill!=='none'?style.fill:style.stroke;const m=material(color||platform.color,index===4?.5:.22);
   if(style.fill&&style.fill!=='none')for(const shape of SVGLoader.createShapes(path)){const g=new T.ExtrudeGeometry(shape,{depth:4,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.55,bevelThickness:.5,curveSegments:10});geometries.push(g);group.add(new T.Mesh(g,m))}
   if(style.stroke&&style.stroke!=='none')for(const sub of path.subPaths){const flat=SVGLoader.pointsToStroke(sub.getPoints(28),style,8,.001);if(flat){const g=solidStroke(flat,4);geometries.push(g);group.add(new T.Mesh(g,m))}}
  }
  const bounds=new T.Box3().setFromObject(group),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3());for(const child of group.children)child.position.sub(center);
  group.scale.setScalar(2.25/Math.max(size.x,size.y));group.scale.y*=-1;scene.add(group);return group;
 });
 let mobile=false,visible=false,raf=0,time=0,last=0,disposed=false;const reduce=matchMedia('(prefers-reduced-motion:reduce)');
 function position(t:number){logos.forEach((logo,i)=>{const raw=((t/4.245-[0,.04,.12,.4,.44,.52,.75,.8,.9][i])%1+1)%1,phase=raw/.78;let x:number,y:number;
  if(phase<.26){const q=phase/.26;x=-12+q*1.2;y=9+(curveY(x)+1.8-9)*q*q}
  else{const q=(phase-.26)/.74;x=-10.8+q*27;y=curveY(x)+1.8}
  logo.position.set(x,y,Math.sin(phase*Math.PI*2+i)*1.25);logo.rotation.set(.25+Math.sin(phase*6+i)*.55,Math.sin(phase*8+i)*1.05,Math.sin(phase*6+i)*.45);
  logo.visible=raw>.01&&raw<.77;if(mobile){logo.position.x*=.6;}
 });}
 const baseScales=logos.map(o=>o.scale.clone());
 function draw(t:number){logos.forEach((o,i)=>o.scale.copy(baseScales[i]));position(t);if(mobile)logos.forEach((o,i)=>o.scale.copy(baseScales[i]).multiplyScalar(.72));renderer.render(scene,camera);host.dataset.frames=String(Number(host.dataset.frames||0)+1);}
 function frame(now:number){raf=0;if(disposed||!visible||document.hidden)return;if(last)time+=Math.min((now-last)/1000,.05);last=now;draw(reduce.matches?2.1:time);if(!reduce.matches)raf=requestAnimationFrame(frame)}
 function wake(){last=0;if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(frame)}
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;mobile=w<701;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(0,1,28);camera.lookAt(0,mobile?-1:0,0);camera.fov=35;camera.updateProjectionMatrix();ribbonGroup.scale.x=mobile?.6:1;ribbonGroup.position.y=0;draw(reduce.matches?2.1:time);wake()}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting)&&!host.closest('[hidden]');if(visible)wake();else{cancelAnimationFrame(raf);raf=0;last=0}});observer.observe(host);
 const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0}else wake()};document.addEventListener('visibilitychange',onVisibility);reduce.addEventListener('change',wake);
 renderer.domElement.addEventListener('webglcontextlost',onLost);function onLost(e:Event){e.preventDefault();cancelAnimationFrame(raf);raf=0;host.classList.remove('is-ready')}
 resize();host.classList.add('is-ready');host.dataset.logos=logos.map(l=>l.name).join(',');host.dataset.geometry='extruded';
 return()=>{disposed=true;cancelAnimationFrame(raf);resizeObserver.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',onVisibility);reduce.removeEventListener('change',wake);renderer.domElement.removeEventListener('webglcontextlost',onLost);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());texture.dispose();env.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();host.classList.remove('is-ready')};
}




