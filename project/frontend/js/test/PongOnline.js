import * as constants from "../constants.js";

// import { PongGame } from "./pongOnlineScript.js";
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

  function getSearchParamsAsObject() {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }
  
  
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
      this.webSocketHostUrl = constants.WS_URL;
  
      // Game State
      this.isSetup = false;
  
      // Utility screen
      this.baseColor = "rgb(52, 49, 49)"; // Dark grey
      this.display_state = "CONNECTING";
      this.count_down_helper = 0;
  
      // Paddle Event utility
      this.latestLeftPaddleHit = Date.now();
      this.latestRightPaddleHit = Date.now();

      // END message
      this.endmessage = "";
      this.showGoBackState = true;
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
      if (this.room_id && this.user_token) {
        this.connectWebSocket();
      }
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
  
    setPaddlePosition = (paddle, x, y) => {
      paddle.x = x;
      paddle.y = y;
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
      this.setLeftPaddleKeyEvent();
      this.setRightPaddleKeyEvent();
    };
  
    // set Paddle Event
    setLeftPaddleKeyEvent = () => {
      document.addEventListener("keydown", (event) => {
        if (event.keyCode === KEY.W) {
          event.preventDefault();
          this.sendKeyEvent("PRESS", KEY.W);
        } else if (event.keyCode === KEY.S) {
          event.preventDefault();
          this.sendKeyEvent("PRESS", KEY.S);
        }
      });
      document.addEventListener("keyup", (event) => {
        event.preventDefault();
        if (event.keyCode === KEY.W) {
          event.preventDefault();
          this.sendKeyEvent("RELEASE", KEY.W);
        } else if (event.keyCode === KEY.S) {
          event.preventDefault();
          this.sendKeyEvent("RELEASE", KEY.S);
        }
      });
    };
  
    setRightPaddleKeyEvent = () => {
      document.addEventListener("keydown", (event) => {
        if (event.keyCode === KEY.UP) {
          event.preventDefault();
          this.sendKeyEvent("PRESS", KEY.UP);
        } else if (event.keyCode === KEY.DOWN) {
          event.preventDefault();
          this.sendKeyEvent("PRESS", KEY.DOWN);
        }
      });
      document.addEventListener("keyup", (event) => {
        if (event.keyCode === KEY.UP) {
          event.preventDefault();
          this.sendKeyEvent("RELEASE", KEY.UP);
        } else if (event.keyCode === KEY.DOWN) {
          event.preventDefault();
          this.sendKeyEvent("RELEASE", KEY.DOWN);
        }
      });
    };
  
    sendKeyEvent = (key, key_code) => {
      this.sendMessage({
        type: "CLIENT_MESSAGE",
        command: key,
        sender: this.webSocketToken,
        data: {
          key: key,
          key_code: key_code,
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
  
    setBallPosition = (x, y) => {
      this.ball.x = x;
      this.ball.y = y;
    };
  
    // display ball
    displayBall = () => {
      this.ctx.beginPath();
      this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.ball.color;
      this.ctx.fill();
      this.ctx.closePath();
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
      this.user_token = localStorage.getItem("token");
      const urlParams = new URLSearchParams(window.location.search);
      this.room_id = urlParams.get("room_id");
      

      if (!this.room_id) {
        return;
      }
      this.webSocketToken = this.user_token;
    };
  
    gameloop = async () => {
      if (this.display_state !=  "GAME"){
        return;
      }
      this.displayBackground();
      this.displayScore();
      this.displayCenterLine();
      this.displayPaddle();
      this.displayBall();
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

      if (this.showGoBackState == true) {
          goBack.innerHTML =
          "<center><button type='button'><a href='/'>Go Back</a></button></center>";
          document.body.appendChild(goBack);
          this.showGoBackState = false
      }
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
        case "GAME_FINISHED":
          // แก้ display เป็น นับถอยหลัง
          this.showMessageMiddleScreen(this.endmessage);
          // this.showGoBack()
          // wait 3 sec then redirect to /game or /tournament/:id/
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
          case "GAME_STATE":
            this.setBallPosition(
              data.data.ball_position.x,
              data.data.ball_position.y
            );
            this.leftPaddle.y = data.data.left_paddle.y;
            this.rightPaddle.y = data.data.right_paddle.y;
            break;
          case "UPDATE_SCORE":
            console.log("Update score", data.data);
            this.leftScore.score = data.data.left;
            this.rightScore.score = data.data.right;
            break;
          case "GAME_FINISHED":
            popupWinner(data.data.winner.name)
            this.endmessage = `${data.data.winner.name} WON`
            this.display_state = "GAME_FINISHED";
            break;
          default:
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
  

var Game = new PongGame();

requestAnimationFrame(Game.loop);

// Display Popup Finish Game
const modalWinnerObj = document.getElementById('winnerModal')
const modalWinner = new bootstrap.Modal(modalWinnerObj);
function popupWinner(winnerName) {
  modalWinner.show();

  const winner = modalWinnerObj.querySelector('#winnerName');
  winner.innerHTML = winnerName

  if (constants.CONTAINER.tourSocket) {
    const backBtn = modalWinnerObj.querySelector('#modalBackBtn')
    backBtn.addEventListener('click', () => {
      console.log('Draw canvas room tournament again')
    })
  }
}