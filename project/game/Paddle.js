const UP_ARROW = 38;
const DOWN_ARROW = 40;

export class Paddle {
    constructor(x, canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = x;
        this.y = this.canvas.height / 2;
        this.height = 80;
        this.width = 20;
        this.speed = 5;
        this.color = "green";

        this.isUp = false;
        this.isDown = false;
    }

    display() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y,  this.width, this.height);
        this.ctx.fill();
        this.ctx.closePath();
    };

    keyPressed(event) {
        event.preventDefault();
        if (event.keyCode == UP_ARROW) {
            this.isUp = true;
        } else if (event.keyCode == DOWN_ARROW) {
            this.isDown = true;
        }
    };

    keyReleased(event) {
        console.log("keyReleased");
        if (event.keyCode == UP_ARROW) {
            this.isUp = false;
        } else if (event.keyCode == DOWN_ARROW) {
            this.isDown = false;
        }
    };

    runAI(pos_ball) {
        let middlePaddle = this.y + this.height / 2;

        if (middlePaddle > pos_ball) {
            this.isUp = true;
            this.isDown = false;
        } else {
            this.isDown = true;
            this.isUp = false;
        }
    };

    up() {
		if (this.y > 0) {
			this.y = this.y - this.speed;
		}
	};

	down() {
		if (this.y < this.canvas.height - this.height) {
			this.y = this.y + this.speed;
		}
	};

    update() {
        if (this.isUp) {
            this.up();
        } else if (this.isDown) {
            this.down();
        }
    };
}