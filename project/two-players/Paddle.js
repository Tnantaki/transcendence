export class Paddle {
    constructor(x, canvas, ctx, keyUp, keyDown) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = x;
        this.y = this.canvas.height / 2;
        this.height = 100;
        this.width = 20;
        this.speed = 12;
        this.keyUp = keyUp;
        this.keyDown = keyDown;
        this.color = "cyan";

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
        if (event.keyCode == this.keyUp) {
            this.isUp = true;
        } else if (event.keyCode == this.keyDown) {
            this.isDown = true;
        }
    };

    keyReleased(event) {
        console.log("keyReleased");
        if (event.keyCode == this.keyUp) {
            this.isUp = false;
        } else if (event.keyCode == this.keyDown) {
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