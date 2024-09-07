var PLAYER = {
  IDLE: 0,
  LEFT: 1,
  RIGHT: 2,
};

var KEY = {
  UP: 38,
  DOWN: 40,
  W: 87,
  S: 83,
};

const PaddleEvent = {
  UP: "UP",
  DOWN: "DOWN",
  IDLE: "IDLE",
};

export class PongGame {
  // Create a new game with a canvas, context, websocket, and player
  constructor() {
    // Canvas Tag
    this.canvas = undefined;
    // Canvas object
    this.ctx = undefined;
    this.wb_socket = undefined;

    this.player = PLAYER.IDLE;
    this.leftPaddle = undefined;
    this.rightPaddle = undefined;
    this.ball = undefined;

    this.hitInterval = 0;

    // Token for the websocket
    this.webSocketToken = undefined;
    this.webSocketSession = undefined;
    this.room_id = undefined;
    this.user_token = undefined;
    this.webSocketHostUrl = "ws://localhost:8000";

    // Game State
    this.isSetup = false;

    // Utility screen
    this.baseColor = "rgb(52, 49, 49)"; // Dark grey

    this.display_state = "CONNECTING";

    this.count_down_helper = 0;

    // Paddle Event utility
    this.latestLeftPaddleHit = Date.now();
    this.latestRightPaddleHit = Date.now();
  }

  // Set up board for the game
  setup = async () => {
    if (this.isSetup) {
      return;
    }
    this.getToken();
    this.isSetup = true;
    this.setCanvas();
    this.setPaddle();
    this.setScore();
    this.setBall();
    this.setKeyEvent();

    // Socket
    this.connectWebSocket();
  };

  setCanvas = () => {
    this.canvas = document.getElementById("gameArea");
    this.ctx = this.canvas.getContext("2d");
  };

  setPaddle = () => {
    let paddle_height = 100;
    let paddle_width = 10;
    let paddle_speed = 5;

    this.leftPaddle = {
      x: paddle_width,
      y: this.canvas.height / 2 - paddle_height / 2,
      height: paddle_height,
      width: paddle_width,
      speed: paddle_speed,
      color: "cyan",
      speedy: 0,
    };
    this.rightPaddle = {
      x: this.canvas.width - paddle_width * 2,
      y: this.canvas.height / 2 - paddle_height / 2,
      height: paddle_height,
      width: paddle_width,
      speed: paddle_speed,
      color: "cyan",
      speedy: 0,
    };
  };

  getPaddleCenter = (paddle) => {
    return paddle.y + paddle.height / 2;
  };

  // display paddle
  displayPaddle = () => {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.leftPaddle.color;
    this.ctx.fillRect(
      this.leftPaddle.x,
      this.leftPaddle.y,
      this.leftPaddle.width,
      this.leftPaddle.height
    );
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.fillStyle = this.rightPaddle.color;
    this.ctx.fillRect(
      this.rightPaddle.x,
      this.rightPaddle.y,
      this.rightPaddle.width,
      this.rightPaddle.height
    );
    this.ctx.fill();
    this.ctx.closePath();
  };

  // move paddle
  movePaddle = () => {
    if (this.leftPaddleEvent === "UP") {
      this.leftPaddle.y -= this.leftPaddle.speed;
    } else if (this.leftPaddleEvent === "DOWN") {
      this.leftPaddle.y += this.leftPaddle.speed;
    }

    if (this.rightPaddleEvent === "UP") {
      this.rightPaddle.y -= this.rightPaddle.speed;
    } else if (this.rightPaddleEvent === "DOWN") {
      this.rightPaddle.y += this.rightPaddle.speed;
    }
    this.leftPaddle.y = this.checkPaddleReachBoundary(this.leftPaddle);

    this.rightPaddle.y = this.checkPaddleReachBoundary(this.rightPaddle);
  };

  checkPaddleReachBoundary = (paddle) => {
    // Top
    if (paddle.y + 1 < 0) {
      paddle.y = 0;
    }
    // Bottom
    if (paddle.y - 1 + paddle.height > this.canvas.height) {
      paddle.y = this.canvas.height - paddle.height - 1;
    }
    return paddle.y;
  };

  // set key event
  setKeyEvent = () => {
    this.leftPaddleEvent = "idle";
    this.rightPaddleEvent = "idle";
    // this.setLeftPaddleKeyEvent();
    // this.setRightPaddleKeyEvent();
  };

  // set Paddle Event
  setLeftPaddleKeyEvent = () => {
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === KEY.W) {
        event.preventDefault();
        this.leftPaddleEvent = PaddleEvent.UP;
        this.leftPaddle.speedy = 1;
        this.sendPaddleSatate(1, this.leftPaddle);
      } else if (event.keyCode === KEY.S) {
        event.preventDefault();
        this.leftPaddleEvent = PaddleEvent.DOWN;
        this.leftPaddle.speedy = -1;
        this.sendPaddleSatate(-1, this.leftPaddle);
      }
    });
    document.addEventListener("keyup", (event) => {
      event.preventDefault();
      if (event.keyCode === KEY.W || event.keyCode === KEY.S) {
        event.preventDefault();
        this.leftPaddleEvent = PaddleEvent.IDLE;
        this.leftPaddle.speedy = 0;
        this.sendPaddleSatate(0, this.leftPaddle);
      }
    });
  };

  setRightPaddleKeyEvent = () => {
    document.addEventListener("keydown", (event) => {
      if (event.keyCode === KEY.UP) {
        event.preventDefault();
        this.rightPaddleEvent = PaddleEvent.UP;
        this.rightPaddle.speedy = 1;
        this.sendPaddleSatate(1, this.rightPaddle);
      } else if (event.keyCode === KEY.DOWN) {
        event.preventDefault();
        this.rightPaddleEvent = PaddleEvent.DOWN;
        this.rightPaddle.speedy = -1;
        this.sendPaddleSatate(-1, this.rightPaddle);
      }
    });
    document.addEventListener("keyup", (event) => {
      if (event.keyCode === KEY.UP || event.keyCode === KEY.DOWN) {
        event.preventDefault();
        this.rightPaddleEvent = PaddleEvent.IDLE;
        this.rightPaddle.speedy = 0;
        this.sendPaddleSatate(0, this.rightPaddle);
      }
    });
  };

  sendPaddleSatate = (speedy, paddle) => {
    let event = { "-1": "DOWN", "0": "IDLE", "1": "UP" };

    this.sendMessage({
      type: "CLIENT_MESSAGE",
      command: "MOVE_PADDLE",
      sender: this.webSocketToken,
      data: {
        paddle_speedy: speedy,
        as_player: this.player,
        paddle_event: event[speedy.toString()],
        paddle_position_y: paddle.y,
        paddle_posttion_x: paddle.x,
      },
    });
  };

  setScore = () => {
    this.leftScore = {
      x: this.canvas.width / 2 - 40,
      color: "white",
      score: 0,
    };
    this.rightScore = {
      x: this.canvas.width / 2 + 40,
      color: "white",
      score: 0,
    };
  };

  setLeftScore = () => {
    this.leftScore.score++;
    if (this.score > 5) {
      this.leftScore.color = "red";
    }
  };

  setRightScore = () => {
    this.rightScore.score++;
    if (this.score > 5) {
      this.rightScore.color = "red";
    }
  };

  // display score
  displayScore = () => {
    this.ctx.beginPath();
    this.ctx.font = "50px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = this.leftScore.color;
    this.ctx.fillText(this.leftScore.score, this.leftScore.x, 60);
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.font = "50px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = this.rightScore.color;
    this.ctx.fillText(this.rightScore.score, this.rightScore.x, 60);
    this.ctx.closePath();
  };

  setBall = () => {
    this.ball = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      radius: 10,
      xSpeed: 10,
      ySpeed: 0,
      color: "green",
      hitOffset: 1,
    };
  };

  // display ball
  displayBall = () => {
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.ball.color;
    this.ctx.fill();
    this.ctx.closePath();
  };

  calBallPos = () => {
    this.ball.x += this.ball.xSpeed;
    this.ball.y += this.ball.ySpeed;
  };

  checkBallHitPaddle = async () => {
    // Hit Paddle Left
    if (Date.now() - this.latestLeftPaddleHit > 10) {
      this.hitLeftPaddle();
      this.latestLeftPaddleHit = Date.now();
    }

    // Hit Paddle Right
    if (Date.now() - this.latestRightPaddleHit > 10) {
      this.hitRightPaddle();
      this.latestRightPaddleHit = Date.now();
    }
  };

  hitLeftPaddle = () => {
    if (
      this.ball.x - this.ball.radius <=
        this.leftPaddle.x + this.leftPaddle.width &&
      this.ball.y >= this.leftPaddle.y &&
      this.ball.y <= this.leftPaddle.y + this.leftPaddle.height
    ) {
      this.ball.xSpeed = -this.ball.xSpeed;
      this.ball.ySpeed +=
        this.ball.ySpeed == 0
          ? this.leftPaddle.speedy
          : this.ball.ySpeed * this.leftPaddle.speedy;
      this.hitInterval += 1;
    }
  };

  hitRightPaddle = () => {
    if (
      this.ball.x + this.ball.radius >= this.rightPaddle.x &&
      this.ball.y >= this.rightPaddle.y &&
      this.ball.y <= this.rightPaddle.y + this.rightPaddle.height
    ) {
      this.ball.xSpeed = -this.ball.xSpeed;
      this.ball.ySpeed +=
        this.ball.ySpeed == 0
          ? this.rightPaddle.speedy
          : this.rightPaddle.speedy * this.ball.ySpeed;
      this.hitInterval += 1;
    }
  };

  checkHitInterval = () => {
    if (this.hitInterval >= 6) {
      //   this.ball.xSpeed = (Math.abs(this.ball.xSpeed) + 1) * (this.ball.xSpeed / Math.abs(this.ball.xSpeed));
      this.ball.xSpeed = Math.ceil(this.ball.xSpeed);
      this.hitInterval = 0;
    }
  };

  checkBallHitBorder = () => {
    if (
      this.ball.y - this.ball.radius <= 0 ||
      this.ball.y + this.ball.radius >= this.canvas.height
    ) {
      this.ball.ySpeed = -this.ball.ySpeed;
    }
  };

  checkBallScore = () => {
    if (this.ball.x - this.ball.radius <= 0) {
      this.setRightScore();
      this.setBall();
    }

    if (this.ball.x + this.ball.radius >= this.canvas.width) {
      this.setLeftScore();
      this.setBall();
    }
  };

  ballHit = async () => {
    this.checkBallHitBorder();
    this.checkBallHitPaddle();
  };

  // display Background
  displayBackground = () => {
    this.screenClear();
    this.ctx.fillStyle = "rgb(52, 49, 49)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  displayCenterLine = () => {
    this.ctx.strokeStyle = "white";
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
    this.ctx.closePath();
  };

  // clear screen
  getToken = async () => {
    this.user_token = new URLSearchParams(window.location.search).get("token");
    this.room_id = new URLSearchParams(window.location.search).get("room_id");
    // this.room_id = TEMP_ROOM_ID;
  };

  gameloop = async () => {
    this.displayBackground();
    this.displayScore();
    this.displayCenterLine();
    this.displayPaddle();
    this.movePaddle();
    // Ball
    this.displayBall();
    // บอลชนกับ paddle
    await this.ballHit();
    // return ;
    this.checkHitInterval();
    // บอลเข้าประตู
    this.checkBallScore();
    // บอลเคลื่อนที่
    this.calBallPos();
  };

  //   SCREEN UTILITY
  screenClear = () => {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.baseColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  screenDisconnect = () => {
    this.showMessageMiddleScreen("Disconnected from the server");
  };

  screenYouWin = () => {
    this.showMessageMiddleScreen("You Win!");
  };

  screenYouLose = () => {
    this.showMessageMiddleScreen("You Lose!");
  };

  screenWaitingOtherPlayer = () => {
    let message =
      "Waiting for another player" + " .".repeat((Date.now() / 500) % 4);
    this.showMessageMiddleScreen(message);
  };

  screenConnecting = () => {
    this.showMessageMiddleScreen(
      "Connecting to the server" + " .".repeat((Date.now() / 500) % 4)
    );
  };

  showMessageMiddleScreen = (message) => {
    this.screenClear();
    this.ctx.font = "30px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
  };

  screenCountDown = () => {
    let message =
      this.count_down_helper == "0" ? "Start!" : this.count_down_helper;
    this.showMessageMiddleScreen(message);
  };

  //   replace canva with goback button <a href="index.html">Go Back</a>
  showGoBack = () => {
    let goBack = document.createElement("p");
    goBack.innerHTML =
      "<center><button type='button'><a href='index.html'>Go Back</a></button></center>";
    document.body.appendChild(goBack);
  };

  setDisplay = (case_id) => {
    switch (case_id) {
      case "CONNECTING":
        this.screenConnecting();
        break;
      case "CONNECTED":
        this.showMessageMiddleScreen("Connected to the server");
        break;
      case "WAITING_OTHER_PLAYER":
        this.screenWaitingOtherPlayer();
        break;
      case "DISCONNECT":
        this.screenDisconnect();
        break;
      case "WIN":
        this.screenYouWin();
        break;
      case "LOSE":
        this.screenYouLose();
        break;
      case "COUNTDOWN":
        this.screenCountDown();
        break;
      case "GAME":
        this.gameloop();
        break;
      default:
        this.showMessageMiddleScreen("Error unknown case: " + case_id);
        break;
    }
  };

  // WebSocket
  connectWebSocket = async () => {
    this.webSocketSession = new WebSocket(
      this.webSocketHostUrl +
        "/ws/pong/?" +
        "token=" +
        this.user_token +
        "&room_id=" +
        this.room_id
    );
    this.setDisplay("WAITING_OTHER_PLAYER");
    this.setWebSocketEvent();
  };

  webSocketEventOnClose = (event) => {
    this.display_state = "DISCONNECT";
    this.showGoBack();
  };

  webSocketEventOnMessage = (event) => {
    let data = JSON.parse(event.data);
    if (data.sender === "SERVER") {
      switch (data.command) {
        case "COUNTDOWN":
          this.count_down_helper = data.data.time;
          this.display_state = "COUNTDOWN";
          if (this.count_down_helper == "0") {
            this.display_state = "GAME";
          }
          break;
        case "ASSIGN_PLAYER":
          this.player = data.data.player;
          if (this.player === PLAYER.RIGHT) {
            this.setRightPaddleKeyEvent();
          }
          if (this.player === PLAYER.LEFT) {
            this.setLeftPaddleKeyEvent();
          }
          break;

          break;
        default:
          break;
      }
    }
    if (data.sender == "PLAYER") {
      switch (data.command) {
        case "MOVE_PADDLE":
          if (
            data.data.as_player == PLAYER.LEFT &&
            this.player == PLAYER.RIGHT
          ) {
            this.leftPaddle.speedy = data.data.paddle_speedy;
            this.leftPaddleEvent = data.data.paddle_event;
            if (data.data.paddle_eventthis == "IDLE") {
              this.leftPaddle.y = data.data.paddle_position_y;
            }
          }
          if (
            data.data.as_player == PLAYER.RIGHT &&
            this.player == PLAYER.LEFT
          ) {
            this.rightPaddle.speedy = data.data.paddle_speedy;
            this.rightPaddleEvent = data.data.paddle_event;
            if (data.data.paddle_event == "IDLE") {
              this.rightPaddle.y = data.data.paddle_position_y;
            }
          }
          break;
        default:
          console.log("Unknown command: ", data.command);
          break;
      }
    }
  };

  webSocketEventOnOpen = (event) => {
    this.display_state = "CONNECTED";
  };

  webSocketEventOnError = (event) => {
    console.log("Error: ", event);
  };

  setWebSocketEvent = () => {
    this.webSocketSession.onopen = this.webSocketEventOnOpen;
    this.webSocketSession.onclose = this.webSocketEventOnClose;
    this.webSocketSession.onmessage = this.webSocketEventOnMessage;
    this.webSocketSession.onerror = this.webSocketEventOnError;
  };

  sendMessage = (message) => {
    this.webSocketSession.send(JSON.stringify(message));
  };

  loop = async () => {
    await this.setup();

    this.setDisplay(this.display_state);

    requestAnimationFrame(this.loop.bind(this));
  };
}
