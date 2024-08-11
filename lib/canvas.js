import { rand } from "./rand.js";

export class Draw {
  constructor(canvas,ctx){
    this.ctx = ctx
    this.canvas = canvas
  }
  setBackground(color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  rectRound(x, y, width, height, radius) {
    this.ctx.beginPath();   
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.arcTo(x, y, x + radius, y, radius);
    this.ctx.closePath();
    return this.ctx
  }
  fillRectRoundedBottom(x, y, width, height, radius){
    this.ctx.beginPath();   
    this.ctx.moveTo(x , y);
    this.ctx.lineTo(x + width, y);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
    this.ctx.closePath();
    this.ctx.fill();
  }
  circle(x, y, r, color) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fillStyle = color; // Color de relleno
    return this.ctx
  }
  setBackgroundRand( ){
    this.ctx.lineWidth = 2
    for (let index = 0; index < 500; index++) {
      this.ctx.strokeStyle = `hsla(0,100%,100%,${Math.random()})`
      this.ctx.strokeRect(
        rand(0,this.canvas.width),
        rand(0,this.canvas.height),
        rand(0,this.canvas.width/10),
        rand(0,this.canvas.height/10)
      )
    }
  }
}