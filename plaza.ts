import * as THREE from 'three';
import {realisticDolphin} from './realism';

export type Builder={
 scene:THREE.Scene;
 box:(x:number,y:number,z:number,w:number,h:number,d:number,color:string,parent?:THREE.Object3D)=>THREE.Mesh;
 cylinder:(x:number,y:number,z:number,r1:number,r2:number,h:number,color:string,parent?:THREE.Object3D,segments?:number)=>THREE.Mesh;
 material:(color:string)=>THREE.MeshStandardMaterial;
 palm:(x:number,z:number,scale?:number)=>void;
 sign:(text:string,x:number,y:number,z:number,width?:number,color?:string,bg?:string,rotation?:number,parent?:THREE.Object3D)=>THREE.Mesh;
 collider:(x:number,z:number,w:number,d:number,h?:number)=>void;
};

/** Original miniature interpretation of Mactan Newtown's entrance landmark.
 * Reference photos inform the forms; no map tiles, photographs or third-party models are embedded.
 */
export function buildNewtownPlaza(b:Builder){
 const {scene}=b;
 const mesh=(geometry:THREE.BufferGeometry,color:string,x:number,y:number,z:number,parent:THREE.Object3D=scene)=>{const m=new THREE.Mesh(geometry,b.material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m};
 const disc=(radius:number,height:number,y:number,color:string)=>b.cylinder(0,y,0,radius,radius,height,color,scene,64);
 const bronze='#8a7658',stone='#e1dbca',water='#83b8bd';
 // Paved forecourt, low circular planter and a tiered turquoise fountain.
 disc(6.8,.13,.12,'#d4cfbd');disc(6.2,.16,.23,'#eee8db');disc(5.65,.26,.43,'#a3b48a');
 disc(3.7,.52,.58,stone);disc(3.45,.12,.86,water);disc(2.65,.22,.96,'#d6d2c5');disc(2.4,.11,1.1,water);
 disc(1.4,.8,1.48,'#c8c4b7');disc(1.6,.13,1.92,stone);disc(1.43,.08,2.01,water);
 for(let i=0;i<16;i++){const a=i*Math.PI*2/16;const r=3.1;const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(Math.sin(a)*r,.95,Math.cos(a)*r),new THREE.Vector3(Math.sin(a)*2.8,2.15,Math.cos(a)*2.8),new THREE.Vector3(Math.sin(a)*1.75,1.21,Math.cos(a)*1.75)]);const jet=mesh(new THREE.TubeGeometry(curve,12,.035,5,false),'#b7dfdc',0,0,0);jet.castShadow=false;}
 // Smooth tapered bodies and curved fins read as bronze dolphins at close range.
 realisticDolphin(scene,-.65,3.6,0,0,1.25,b.material(bronze));realisticDolphin(scene,1.05,2.8,.2,Math.PI,.8,b.material(bronze));
 for(const radius of [1.7,2.1,2.8,3.22]){const ring=mesh(new THREE.TorusGeometry(radius,.015,4,72),'#bbd8d4',0,1.18,0);ring.rotation.x=Math.PI/2;ring.castShadow=false;}
 for(let i=0;i<32;i++){const a=i*Math.PI*2/32;const joint=b.box(Math.sin(a)*6.25,.32,Math.cos(a)*6.25,.018,.018,1,'#a3a394');joint.rotation.y=a;}
 // Formal planted ring, purple ground cover and symmetrically paired palms.
 for(let i=0;i<32;i++){const a=i*Math.PI*2/32;const x=Math.sin(a)*5.15,z=Math.cos(a)*5.15;const hedge=mesh(new THREE.SphereGeometry(.49,12,8),i%3?'#48653e':'#776080',x,.68,z);hedge.scale.set(1.3,.7,1.3);}
 for(const x of [-4.3,4.3])b.palm(x,-1.3,1.12);
 // Signage belongs to the JOYNO portfolio; the location reference is a secondary plaque.
 b.box(0,.56,5.45,8.6,.65,.55,'#f5f1e5');b.sign('JOYNO MEDIA',0,1.03,5.76,8.4,'#34473e','#f5f1e5');
 b.sign('MACTAN NEWTOWN',0,.48,5.77,6.2,'#536456','#f5f1e5');
 // Curbs, zebra crossings and slim street lighting echo the Newtown boulevard.
 for(const z of [-9.5,9.5])for(let i=-3;i<=3;i++)b.box(i*.9,.105,z,.4,.035,2,'#f8f4e7');
 for(const [x,z]of [[-8,5],[8,-5],[-18,7],[18,-6]]){b.cylinder(x,2.3,z,.075,.09,4.6,'#5c7168');b.box(x+.35,4.6,z,.8,.12,.24,'#53685f');b.box(x+.55,4.51,z,.4,.035,.2,'#f9e7ab');}
 // Furniture sits at the edge of the paved plaza, clear of checkpoints.
 for(const [x,z,rotation]of [[-5.5,-6.3,0],[5.5,-6.3,0]]){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rotation;scene.add(g);b.box(0,.65,0,2.5,.18,.7,'#ac8e6c',g);b.box(0,1.02,-.32,2.5,.6,.12,'#ac8e6c',g);for(const leg of [-.9,.9])b.box(leg,.32,0,.13,.65,.6,'#5d6c61',g);}
}

export function addNewtownTower(b:Builder,x:number,z:number,w:number,d:number,h:number,title:string,color='#e3ded0'){
 b.box(x,.4,z,w+1,.8,d+.8,'#d9d4c6');b.box(x,h/2+.8,z,w,h,d,color);
 // Broad recessed glazing with a regular facade grid and white balcony bands.
 b.box(x,h/2+.8,z+d/2+.035,w-.7,h-1.2,.1,'#64888b');
 b.box(x+w/2+.035,h/2+.8,z,.1,h-1.2,d-.5,'#7d9997');
 const floors=Math.floor(h/1.2);
 // Recessed panes catch different amounts of sky; subtle variation avoids a flat facade.
 for(let floor=0;floor<floors;floor++)for(let col=0;col<5;col++){const px=x+(col-2)*(w-.8)/5,py=1.3+floor*h/(floors+1);const pane=b.box(px,py,z+d/2+.2,(w-.8)/5-.14,.8,.035,(floor+col)%3?'#64888b':'#7d9997');pane.receiveShadow=true;}

 for(let i=1;i<=floors;i++){const y=.8+i*h/(floors+1);b.box(x,y,z+d/2+.14,w+.15,.16,.35,'#eeeade');b.box(x+w/2+.1,y,z,.26,.16,d+.2,'#eeeade');}
 for(let i=-2;i<=2;i++)b.box(x+i*(w-.8)/5,h/2+.8,z+d/2+.15,.12,h-.7,.18,'#c7c8bd');
 b.box(x,h+1,z,w+.45,.25,d+.5,'#f6f0e1');
 const crown=b.box(x,h+1.45,z,w+.5,.16,d+.6,'#e4e5d8');crown.rotation.z=.08;
 b.sign(title,x,1.85,z+d/2+.37,w-.3,'#34473e','#f5f1e5');b.collider(x,z,w+.35,d+.35,h+1);
}
