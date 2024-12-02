import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";
import { Score } from "./Score.js";
import { loadPage } from "../router.js";

const canvas = document.getElementById("gameArea");
canvas.style.backgroundColor = "#a3a3a3";
// canvas.width = 1280;
// canvas.height = 720;
let gameOffline = null;

// Handle Modal Winner
const modalWinnerObj = document.getElementById('winnerOfflineModal')
const modalWinner = new bootstrap.Modal(modalWinnerObj);
modalWinnerObj.querySelector('#restart').onclick = () => { 
  modalWinner.hide()
  if (gameOffline)
    gameOffline.restart() 
}

// Handle Modal Exit
const modalExitGameObj = document.getElementById('exitGameModal')
const modalExit = new bootstrap.Modal(modalExitGameObj);
modalExitGameObj.querySelector('#resume').onclick = () => { 
  modalExit.hide()
  if (gameOffline)
    gameOffline.startGame()
}
modalExitGameObj.querySelector('#submitExit').onclick = () => { 
  modalExit.hide()
  if (gameOffline) {
    gameOffline.clear()
  } 
  loadPage('/')
}

const ctx = canvas.getContext("2d");

export class GameOffline {
  constructor(canvas, ctx, mode) {
    this.canvas = canvas;
    this.canvas.width = 1280
    this.canvas.height = 720
    this.canvas.style.width = '70%';
    this.canvas.style.objectFit = 'contain';
    this.ctx = ctx;
    this.raf = null
    this.keyUp = null
    this.keyDown = null
    this.leftPaddle;
    this.rightPaddle;
    this.leftScore = new Score(canvas.width / 2 - 40, canvas, ctx);
    this.rightScore = new Score(canvas.width / 2 + 40, canvas, ctx);
    this.ball = new Ball(canvas, ctx);
    this.countdownInterval = null

    this.mode = mode
    this.setup()
  }

  setup() {
    if (this.mode === 2) {
      this.leftPaddle = new Paddle(26, this.canvas, this.ctx, 2);
      this.createTouchKey('player1')
      this.rightPaddle = new Paddle(this.canvas.width - 48, this.canvas, this.ctx, 1);
      this.createTouchKey('player2')
    } else {
      this.leftPaddle = new Paddle(26, this.canvas, this.ctx, 1);
      this.createTouchKey('player1')
      this.rightPaddle = new Paddle(this.canvas.width - 48, this.canvas, this.ctx, 0);
    }
    this.drawGame();
    // (function(){document.querySelector("body").requestFullscreen();})()
  }

  startGame = () => {
    this.screenCountDown()
  }

  gameLoop = () => {
    this.drawGame()
    this.raf = requestAnimationFrame(this.gameLoop);
    if (Score.isGameOver) {
      Score.isGameOver = false
      this.annouceWinner()
    }
  }

  restart = () => {
    this.leftScore.resetScore()
    this.rightScore.resetScore()
    this.drawGame()
    this.startGame()
  }

  stopGame = () => {
    cancelAnimationFrame(this.raf);
  }

  clear = () => {
    cancelAnimationFrame(this.raf);
    if (this.countdownInterval) clearInterval(this.countdownInterval)
    this.leftPaddle.delete()
    this.rightPaddle.delete()
    this.deleteTouchKey()
  }

  drawGame = () => {
    this.clearScreen();

    this.leftPaddle.display();
    this.leftPaddle.update();

    this.rightPaddle.display();
    this.rightPaddle.update();
    if (this.mode === 1) {
      this.rightPaddle.runAI(this.ball);
    }

    this.ball.update(this.leftScore, this.rightScore);
    this.ball.display();
    this.ball.hitLeftPaddle(this.leftPaddle);
    this.ball.hitRightPaddle(this.rightPaddle);

    this.drawCenLine();
    this.leftScore.display();
    this.rightScore.display();
  }

  clearScreen = () => {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#333";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCenLine = () => {
    this.ctx.strokeStyle = "white";
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  createTouchKey = (player) => {
    // create on the device that not have keyboard
    if (!!!window.navigator.keyboard) {
      const btnBlock = document.getElementById('btn-' + player);
      btnBlock.innerHTML =`
        <button id="${player}-keyUp" class="btn-key">↑</button>
        <button id="${player}-keyDown" class="btn-key">↓</button>
      `
      if (player === 'player1') {
        this.leftPaddle.setTouchKey(player)
      } else if (player === 'player2') {
        this.rightPaddle.setTouchKey(player)
      }
    }
  }

  showMessageMiddleScreen = (message) => {
    this.clearScreen();
    this.ctx.font = "60px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
  };

  screenCountDown = () => {
    let countdownValue = 2

    this.showMessageMiddleScreen(countdownValue.toString());
    this.countdownInterval = setInterval(() => {
      countdownValue--
      let msg = countdownValue === 0 ? "Start!" : countdownValue.toString();
      this.showMessageMiddleScreen(msg);
      if (countdownValue === -1) {
        clearInterval(this.countdownInterval)
        this.gameLoop()
      }
    }, 1000)
  }

  deleteTouchKey = () => {
    const btnPlayer1 = document.getElementById('btn-player1');
    const btnPlayer2 = document.getElementById('btn-player2');

    if (btnPlayer1) btnPlayer1.innerHTML = ''
    if (btnPlayer2) btnPlayer2.innerHTML = ''
  }

  annouceWinner = () => {
    this.stopGame()
    modalWinner.show();
    const winnerName = modalWinnerObj.querySelector('#winnerName');
    if (this.leftScore.score > this.rightScore.score) {
      winnerName.innerHTML = 'Player1'
    } else {
      if (this.mode === 2) {
        winnerName.innerHTML = 'Player2'
      } else {
        winnerName.innerHTML = 'BOT'
      }
    }
  }
}

let mode = window.location.pathname

if (mode === '/game-versus') {
  gameOffline = new GameOffline(canvas, ctx, 2);
} else {
  gameOffline = new GameOffline(canvas, ctx, 1);
}

gameOffline.startGame();

// Exit button
handlerExitBtn(document.getElementById('game-home-btn'))
function handlerExitBtn(homeBtn) {
  if (!homeBtn) return
  homeBtn.addEventListener('click', () => {
    if (gameOffline) gameOffline.clear()
    gameOffline = null
  })
}
