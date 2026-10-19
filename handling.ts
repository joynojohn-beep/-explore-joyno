export type DriveInput={forward:boolean;reverse:boolean;left:boolean;right:boolean;brake:boolean};
/** Predictable, time-based arcade controls. The physics body remains the collision owner. */
export class ArcadeHandling {
 speed=0;steering=0;angle=Math.PI/2;
 update(input:DriveInput,dt:number){
  const target=input.brake||input.forward===input.reverse?0:input.forward?6.5:-2.4;
  const reversing=target*this.speed<0;
  const acceleration=input.brake?16:reversing?10:target===0?8.5:target>0?5.2:3;
  const change=(target-this.speed)*(1-Math.exp(-dt*(target===0?12:4)));
  this.speed+=Math.max(-acceleration*dt,Math.min(acceleration*dt,change));
  if(target===0&&Math.abs(this.speed)<.035)this.speed=0;
  const steer=Number(input.left)-Number(input.right);
  this.steering+=(steer-this.steering)*(1-Math.exp(-dt*(steer===0?12:8)));
  const magnitude=Math.abs(this.speed);
  const turnRate=Math.min(magnitude/1.5,1)*(1.7-.4*Math.min(magnitude/6.5,1));
  if(magnitude>.06)this.angle+=this.steering*turnRate*Math.sign(this.speed)*dt;
 }
 stop(){this.speed=0;this.steering=0;}
 reset(){this.stop();this.angle=Math.PI/2;}
 reconcileCollision(x:number,z:number){const along=x*Math.sin(this.angle)+z*Math.cos(this.angle);if(Math.abs(this.speed)>1.5&&Math.abs(along)<Math.abs(this.speed)*.35)this.speed*=.55;}
}
