export class Ball {

    constructor(canvas, ctx) {
        this.radius = 20;
        this.canvas = canvas;
        this.ctx = ctx;
        this.color = "red";
        this.reset();
    }

    update() {

        if (this.y < this.radius || this.y > this.canvas.height - this.radius) {
            this.ySpeed = -this.ySpeed;
        }

        if (this.x < this.radius || this.x > this.canvas.width + this.radius) {
            this.reset();
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;

        this.xSpeed = 2;

        let isLeft = Math.random(1) > .5;
        if (isLeft) {
            this.xSpeed = -this.xSpeed;
        }

        this.ySpeed = 2;
    }

    display() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }
};