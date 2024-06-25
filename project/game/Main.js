import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

let player;
let aiplayer;
let ball;

player = new Paddle(26, canvas, ctx);
aiplayer = new Paddle(canvas.width - 48, canvas, ctx);
ball = new Ball(canvas, ctx);

document.addEventListener("keydown", (event) => { player.keyPressed(event)} );
document.addEventListener("keyup", (event) => { player.keyReleased(event)} );

function drawGame() {
    console.log("drawgame");
    clearScreen();
    player.display();
    player.update();
    
    aiplayer.display();
    aiplayer.update();
    aiplayer.runAI(ball.y);

    console.log("ai y in main: ", aiplayer.y);
    ball.update();
    ball.display();

    ball.hasHitPlayer(player);
    ball.hasHitAi(aiplayer);
    requestAnimationFrame(drawGame);
}


function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

drawGame();