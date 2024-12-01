const GAME_POINT = 5

export class Score {
  static isGameOver = false

	constructor(x, canvas, ctx) {
  	this.x = x;
    this.canvas = canvas;
    this.ctx = ctx;
    this.color = "white";
  	this.score = 0;
  }
  
  display() {
    this.ctx.beginPath();
    this.ctx.font = '60px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(this.score, this.x, 60);
    this.ctx.closePath();
  }
  
  increment() {
  	this.score++;
    if (this.score === GAME_POINT) {
      Score.isGameOver = true
    }
  }

  resetScore() {
    this.score = 0
    Score.isGameOver = false
  }
}