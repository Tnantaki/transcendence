import { PongGame } from "./PongGame.js";

var Game = new PongGame();

requestAnimationFrame(Game.loop);