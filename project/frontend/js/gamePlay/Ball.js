export class Ball {
    constructor(canvas, ctx) {
        this.radius = 12;
        this.canvas = canvas;
        this.ctx = ctx;
        this.color = "green";
        this.reset();
    }

    update(leftScore, rightScore) {
        if (this.y < this.radius || this.y > this.canvas.height - this.radius) {
            this.ySpeed = -this.ySpeed;
        }

        if (this.x < this.radius) {
            leftScore.increment();
            this.reset()
        } else if (this.x > this.canvas.width + this.radius) {
            rightScore.increment();
            this.reset();
        }

        console.log("x: ",this.x, "x_speed: ", this.xSpeed)
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;

        this.xSpeed = 7;

        let isLeft = Math.random(1) > .5;
        if (isLeft) {
            this.xSpeed = -this.xSpeed;
        }

        this.ySpeed = 7;
        
        let isTop = Math.random(1) > .5;
        if (isTop) {
            this.ySpeed = -this.ySpeed;
        }
    }

    display() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    hitLeftPaddle(player) {

        if (this.x - this.radius <= player.x + player.width && this.x > player.x) {
            if (this.isSameHeight(player)) {
                if (Math.sign(this.xSpeed) == 1)
                    this.xSpeed++;
                else if (Math.sign(this.xSpeed) == -1)
                    this.xSpeed--;
                this.xSpeed = -this.xSpeed;
            }
        }
    }
        
    hitRightPaddle(ai) {

        if (this.x + this.radius >= ai.x && this.x <= ai.x + ai.width) {
            if (this.isSameHeight(ai)) {
                if (Math.sign(this.xSpeed) == 1)
                    this.xSpeed++;
                else if (Math.sign(this.xSpeed) == -1)
                    this.xSpeed--;
                this.xSpeed = -this.xSpeed;
            }
        }
    }
            
    isSameHeight(player) {
        return ((this.y >= player.y) && (this.y <= player.y + player.height));
    }

};