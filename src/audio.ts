// Original local instrumental soundtrack: no streaming or media downloads.
function soundtrack(context:AudioContext){
 const beat=.6,length=beat*32,rate=context.sampleRate;
 const buffer=context.createBuffer(1,Math.ceil(length*rate),rate),out=buffer.getChannelData(0);
 function note(start:number,duration:number,midi:number,volume:number,soft=false){
  const count=Math.floor(duration*rate),offset=Math.floor(start*rate),f=440*2**((midi-69)/12);
  for(let i=0;i<count;i++){
   const t=i/rate,envelope=Math.min(1,t/.015)*Math.min(1,(duration-t)/.08)*Math.exp(-t/(soft?1.3:.24)),phase=2*Math.PI*f*t;
   out[(offset+i)%out.length]+=volume*envelope*(Math.sin(phase)+.22*Math.sin(phase*2));
  }
 }
 const chords=[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,67]];
 const melody=[76,79,83,79,74,76,79,76,72,76,79,76,74,71,67,74];
 for(let bar=0;bar<8;bar++){
  const chord=chords[bar%4],start=bar*4*beat;
  for(const step of [0,1.5,2.5])for(const pitch of chord)note(start+step*beat,1.25,pitch,.035,true);
  for(let step=0;step<4;step++)note(start+step*beat,.36,chord[0]-24,.10,true);
  for(let step=0;step<4;step++)note(start+step*beat+.15,.42,melody[(bar*2+step)%melody.length],.085);
  for(let step=0;step<8;step++){
   const offset=Math.floor((start+step*beat/2)*rate);
   for(let i=0;i<Math.floor(.06*rate);i++)out[(offset+i)%out.length]+=.018*Math.sin(i*1.79)*Math.sin(i*.47)*Math.exp(-i/rate*65);
  }
 }
 return buffer;
}
export class AudioEngine {
 enabled=false;
 private context:AudioContext|undefined;
 private music:AudioBufferSourceNode|undefined;
 private master:GainNode|undefined;
 private oscillator:OscillatorNode|undefined;
 private engine:GainNode|undefined;
 async toggle(){
  if(this.enabled){this.enabled=false;this.master?.gain.setTargetAtTime(0,this.context!.currentTime,.025)}
  else{
   this.context??=new AudioContext();await this.context.resume();
   if(this.context.state!=='running')throw new Error('Audio could not start');
   if(!this.master){
    this.master=this.context.createGain();this.master.gain.value=0;this.master.connect(this.context.destination);
    this.music=this.context.createBufferSource();this.music.buffer=soundtrack(this.context);this.music.loop=true;this.music.connect(this.master);this.music.start();
    this.oscillator=this.context.createOscillator();this.oscillator.type='sine';this.oscillator.frequency.value=95;
    this.engine=this.context.createGain();this.engine.gain.value=0;this.oscillator.connect(this.engine).connect(this.master);this.oscillator.start();
   }
   this.master.gain.setTargetAtTime(.8,this.context.currentTime,.06);this.enabled=true;
  }
  try{localStorage.setItem('joyno-sound',String(this.enabled))}catch{}
  return this.enabled;
 }
 update(moving:boolean,paused:boolean){
  if(this.context&&this.engine&&this.oscillator){
   // Reading a panel pauses the vehicle, not the music.
   this.engine.gain.setTargetAtTime(this.enabled&&moving&&!paused ? .012 : 0,this.context.currentTime,.2);
   this.oscillator.frequency.setTargetAtTime(moving?125:95,this.context.currentTime,.3);
  }
 }
 pause(){void this.context?.suspend()}
 resume(){if(this.enabled)void this.context?.resume().catch(()=>{})}
 dispose(){this.enabled=false;this.music?.stop();this.oscillator?.stop();void this.context?.close()}
}
