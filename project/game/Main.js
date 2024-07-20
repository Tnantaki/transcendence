import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

let leftPaddle;
let rightPaddle;
let ball;

leftPaddle = new Paddle(26, canvas, ctx);
rightPaddle = new Paddle(canvas.width - 48, canvas, ctx);
ball = new Ball(canvas, ctx);

document.addEventListener("keydown", (event) => { leftPaddle.keyPressed(event)} );
document.addEventListener("keyup", (event) => { leftPaddle.keyReleased(event)} );

function drawGame() {
    clearScreen();

    leftPaddle.display();
    leftPaddle.update();

    rightPaddle.display();
    rightPaddle.update();
    rightPaddle.runAI(ball.y);

    ball.update();
    ball.display();
    ball.hitLeftPaddle(leftPaddle);
    ball.hitRightPaddle(rightPaddle);

    drawCenLine();
    requestAnimationFrame(drawGame);
}

function drawCenLine() {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.closePath();
}

function clearScreen() {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // tx.closePath();
}

drawGame();