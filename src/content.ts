import {clientEntries} from './clients.ts';
export type Destination = { id: string; name: string; short: string; x: number; z: number; color: string; number: string };
export const destinations: Destination[] = [
 { id:'home',name:'Welcome Plaza',short:'Start here',x:0,z:8,color:'#f44a25',number:'01' },
 { id:'about',name:'About Studio',short:'Meet JOYNO',x:-17,z:-7.5,color:'#e9b86a',number:'02' },
 { id:'work',name:'Project Gallery',short:'Ideas in action',x:-17,z:6,color:'#f44a25',number:'03' },
 { id:'services',name:'Services District',short:'What we do',x:-30,z:-24,color:'#7f9b83',number:'04' },
 { id:'process',name:'Process Workshop',short:'How we work',x:16,z:-2.5,color:'#c69cab',number:'05' },
 { id:'contact',name:'Contact Hub',short:'Let’s make something',x:20,z:15.5,color:'#7fa4ac',number:'06' },
];
export const company = {name:'JOYNO MEDIA',email:'gino@joynomedia.com',phone:'+639098109001',location:'Tower 1 Plaza Magellan, Lapu-Lapu City, Cebu, Philippines',website:'https://joynomedia.com/'};
export const services = [
 {title:'Brand identity',description:'Give your business a recognizable visual language, built around the people you want to reach.',icon:'✳'},
 {title:'Web development',description:'Turn your digital home into a clear, responsive experience that helps visitors take the next step.',icon:'↗'},
 {title:'Digital strategy',description:'Connect your channels, messaging and business goals with a considered marketing plan.',icon:'⌁'},
 {title:'Social media',description:'Build a consistent presence and meaningful connections with your community.',icon:'◎'},
 {title:'Content creation',description:'Tell your story through photography, video and creative content made for your channels.',icon:'▣'},
 {title:'SEO & analytics',description:'Improve discoverability and understand how people find and engage with your business.',icon:'⌕'},
];
export type Project={slug:string;title:string;client:string|null;category:string;summary:string;challenge:string;scope:string[];approach:string;deliverables:string[];outcomes:string;image:string|null;alt:string;url:string;status:string;directory?:boolean;links?:{label:string;url:string}[];};
export const projects:Project[]=[
 ...clientEntries.map(entry=>({slug:entry.slug,title:entry.name,client:entry.name,category:entry.group,summary:`Explore ${entry.name} online.`,challenge:'',scope:[],approach:'',deliverables:[],outcomes:'',image:null,alt:`Typographic profile artwork for ${entry.name}; not an official logo.`,url:entry.links.find(link=>link.label==='Website')?.url||'',status:entry.links.some(link=>link.label==='Website')?'Website & social profiles':'Social profiles',directory:true,links:entry.links})),
];
export const process=[{title:'Discover',description:'Understand your business, audience, goals and current digital challenges.'},{title:'Define',description:'Agree on the strategy, scope and creative direction.'},{title:'Create',description:'Build the design, content and digital experiences together.'},{title:'Refine',description:'Review, launch and learn from the work.'}];
