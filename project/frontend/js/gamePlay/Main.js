import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";
import { Score } from "./Score.js";

const modalObj = document.getElementById('winnerOfflineModal')
// const canvas = document.getElementById("gameArea");
// canvas.style.backgroundColor = "#a3a3a3";
// canvas.width = 1280;
// canvas.height = 720;

// const ctx = canvas.getContext("2d");

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
    this.drawGame()
    this.raf = requestAnimationFrame(this.startGame);
    if (Score.isGameOver) {
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

  deleteTouchKey = () => {
    const btnPlayer1 = document.getElementById('btn-player1');
    const btnPlayer2 = document.getElementById('btn-player2');

    if (btnPlayer1) btnPlayer1.innerHTML = ''
    if (btnPlayer2) btnPlayer2.innerHTML = ''
  }

  annouceWinner = () => {
    this.stopGame()
    const modal = new bootstrap.Modal(modalObj);
    modal.show();
    const winnerName = modalObj.querySelector('#winnerName');
    modalObj.querySelector('#restart').onclick = () => { 
      modal.hide()
      this.restart() 
    }
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

// const gameOffline = new GameOffline(canvas, ctx, 1);
// gameOffline.startGame();

// setTimeout(()=> {
//   console.log('stop game')
//   gameOffline.stopGame()
// }, 5000)