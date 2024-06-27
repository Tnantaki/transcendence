export class Ball {
    constructor(canvas, ctx) {
        this.r = 10;
        this.canvas = canvas;
        this.ctx = ctx;
        this.color = "white";
        this.reset();
    }

    update() {
        if (this.y < this.radius || this.y > this.canvas.height - this.radius) {
            this.ySpeed = -this.ySpeed;
        }

        if (this.x < this.radius || this.x > this.canvas.width + this.radius) {
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
        console.log("leftpaddle: ", "(", player.x, ",", player.y, ")");
        console.log("this: ", "(", this.x, ",", this.y, ")");
        
        // if (this.x == player.x)  {
        //     console.log(`the ball hit at ${this.x}, where player: ${player.x}, rad: ${this.r}`);
        //     this.xSpeed = -this.xSpeed;
        //     debugger;
        //     // console.log("hit===============================");
        // }
        if (this.x - this.radius <= player.x + player.width) {
            if (this.isSameHeight(player)) {
                console.log("hitLeftPaddle");
                this.xSpeed = -this.xSpeed;
            }
        }
    }
        
    hitRightPaddle(ai) {
        console.log("rightpaddle: ", "(", ai.x, ",", ai.y, ")");
        console.log(this.xSpeed);
        // if (this.x == ai.x)  {
        //         this.xSpeed = -this.xSpeed;
        //     console.log("hit===============================");
        // }
        if (this.x + this.radius >= ai.x && this.x <= ai.x + ai.width) {
            if (this.isSameHeight(ai)) {
                console.log("hitLeftPaddle");
                this.xSpeed = -this.xSpeed;
            }
        }
    }
            
    isSameHeight(player) {
        return ((this.y >= player.y) && (this.y <= player.y + player.height));
    }

};