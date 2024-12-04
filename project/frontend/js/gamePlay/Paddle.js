const UP_ARROW = 38;
const DOWN_ARROW = 40;
const PADDLE_HEIGHT = 110
const PADDLE_WIDTH = 15
const PADDLE_SPEED = 15
const PADDLE_COLOR = "cyan"

const FREEZE_TIME_AI = 900 // freeze time after ai hit the ball (milisec)
const ACCURACY_AI = 0.3

export class Paddle {
  // mode 0: AI, 1: player1, 2: player2
  constructor(x, canvas, ctx, mode) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = x;
    this.y = (this.canvas.height / 2) - PADDLE_HEIGHT / 2;
    this.height = PADDLE_HEIGHT;
    this.width = PADDLE_WIDTH;
    this.speed = PADDLE_SPEED;
    this.color = PADDLE_COLOR;

    this.isUp = false;
    this.isDown = false;
    this.isFrozen = false // for AI

    this.keyUp = null
    this.keyDown = null
    this.mode = mode
    this.setup()
  }

  setup() {
    if (this.mode === 1) {
      this.keyUp = 'ArrowUp'
      this.keyDown = 'ArrowDown'
      document.addEventListener("keydown", this.keyPressed);
      document.addEventListener("keyup", this.keyReleased);
    }
    else if (this.mode === 2) {
      this.keyUp = 'w'
      this.keyDown = 's'
      document.addEventListener("keydown", this.keyPressed);
      document.addEventListener("keyup", this.keyReleased);
    }
  }

  delete() {
    if (this.mode) {
      document.removeEventListener('keydown', this.keyPressed);
      document.removeEventListener('keyup', this.keyReleased);
    }
  }

  display() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  keyPressed = (event) => {
    if (event.key === this.keyUp) {
      this.isUp = true;
    } else if (event.key === this.keyDown) {
      this.isDown = true;
    }
  };

  keyReleased = (event) => {
    if (event.key === this.keyUp) {
      this.isUp = false;
    } else if (event.key === this.keyDown) {
      this.isDown = false;
    }
  };

  // for smartphone button
  touchStart(isUpBtn) { // true when press up, false when press down
    if (isUpBtn) {
      this.isUp = true;
    } else {
      this.isDown = true;
    }
  };

  touchEnd(isUpBtn) {
    if (isUpBtn) {
      this.isUp = false;
    } else {
      this.isDown = false;
    }
  };

  runAI(ball) {
    if (this.isFrozen) return

    let middlePaddle = this.y + this.height / 2;
    if (ball.x + ball.radius >= this.x) {
      this.isFrozen = true
      setTimeout(() => {
        this.isFrozen = false
      }, FREEZE_TIME_AI)
      this.isUp = false
      this.isDown = false
      return
    }

    if (ball.y - middlePaddle > this.height * ACCURACY_AI) {
      this.isDown = true;
      this.isUp = false;
    } else {
      this.isUp = true;
      this.isDown = false;
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

  setTouchKey = (player) => {
      const touchKeyUp = document.getElementById(player + '-keyUp')
      const touchKeyDown = document.getElementById(player + '-keyDown')
      if (touchKeyUp) {
        touchKeyUp.addEventListener('touchstart', (event) => {
          event.preventDefault()
          this.touchStart(true)
        })
        touchKeyUp.addEventListener('touchend', (event) => {
          event.preventDefault()
          this.touchEnd(true)
        })
      }
      if (touchKeyDown) {
        touchKeyDown.addEventListener('touchstart', (event) => {
          event.preventDefault()
          this.touchStart(false)
        })
        touchKeyDown.addEventListener('touchend', (event) => {
          event.preventDefault()
          this.touchEnd(false)
        })
      }
  }
}
