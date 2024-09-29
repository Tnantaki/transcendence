const BALL_RADIUS = 15
const BALL_COLOR = 'green'
const BALL_SPEED = 7
const BALL_SPEED_INCREASE = 2

export class Ball {
    constructor(canvas, ctx) {
        this.radius = BALL_RADIUS;
        this.canvas = canvas;
        this.ctx = ctx;
        this.color = BALL_COLOR;
        this.hit_ball = new Audio('/sounds/hit_ball.wav')
        this.reset();
    }

    update(leftScore, rightScore) {
        if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) {
            this.ySpeed = -this.ySpeed;
        }

        if (this.x - this.radius < 0) {
            rightScore.increment();
            this.reset()
        } else if (this.x + this.radius > this.canvas.width) {
            leftScore.increment();
            this.reset();
        }

        // console.log("x: ",this.x, "x_speed: ", this.xSpeed)
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.checkHasPassPaddle = true // add

        this.xSpeed = BALL_SPEED;

        let isLeft = Math.random(1) > .5;
        if (isLeft) {
            this.xSpeed = -this.xSpeed;
        }

        this.ySpeed = BALL_SPEED;
        
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
        if (this.checkHasPassPaddle && this.x - this.radius <= player.x + player.width) {
            if (this.isSameHeight(player)) {
                if (Math.sign(this.xSpeed) == 1)
                    this.xSpeed += BALL_SPEED_INCREASE;
                else if (Math.sign(this.xSpeed) == -1)
                    this.xSpeed -= BALL_SPEED_INCREASE;
                this.xSpeed = -this.xSpeed;
                this.hit_ball.play()
            } else {
                this.checkHasPassPaddle = false    
            }
        }
    }
        
    hitRightPaddle(ai) {
        if (this.checkHasPassPaddle && this.x + this.radius >= ai.x) {
            if (this.isSameHeight(ai)) {
                if (Math.sign(this.xSpeed) == 1)
                    this.xSpeed += BALL_SPEED_INCREASE;
                else if (Math.sign(this.xSpeed) == -1)
                    this.xSpeed -= BALL_SPEED_INCREASE;
                this.xSpeed = -this.xSpeed;
                this.hit_ball.play()
            } else {
                this.checkHasPassPaddle = false    
            }
        }
    }
            
    isSameHeight(player) {
        return ((this.y + this.radius >= player.y) && (this.y - this.radius  <= player.y + player.height));
    }
};