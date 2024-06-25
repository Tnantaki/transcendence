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

        // this.hitPaddle(paddle);
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

    hasHitPlayer(player) {
        console.log(this.xSpeed);
        if (this.x - this.r <= player.x + player.width && this.x > player.x) {
            if (this.isSameHeight(player)) {
                console.log("Player  In loop");
                this.xSpeed = -this.xSpeed;
                console.log("hitpaddle: ", this.xSpeed);
            }
        }
    }
        
    hasHitAi(ai) {
        console.log("ai y in function: ", ai.y);
        console.log(this.xSpeed);
        if (this.x + this.r >= ai.x && this.x <= ai.x + ai.width) {
            if (this.isSameHeight(ai)) {
                console.log("AI In loop");
                this.xSpeed = -this.xSpeed;
                console.log("hitpaddle: ", this.xSpeed);
            }
        }
    }
            
    isSameHeight(player) {
        console.log("in same funct :)");
        return this.y >= player.y && this.y <= player.y + player.height
    }

};