import { loadPage } from "../router.js";
import { createLobby } from "./lobby-menu.js";
import { dictionary } from "./shared-resources.js";
import * as Utils from "./utils.js";

let canvas;
let ctx;
let curLanguage;

function setCanvas() {
	canvas = document.getElementById("gameArea");
	if (canvas)
		ctx = canvas.getContext("2d");

	curLanguage = localStorage.getItem('currentLanguage') || 'en';
}


// menu properties
const menuPos = 100;
const btnWidth = 200;
const btnHeight = 50;
const btnSpace = 20;
const btnArray = ["singlePlayer", "versus", "online", "tournament", "returnHome"];

function drawCanvas()
{
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw game's screen
	ctx.fillStyle = "#666";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// write title
	const titlePos = 50
	ctx.font = "128px Irish Grover";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.fillStyle = "white";
	ctx.fillText("Pong", (canvas.width / 2), titlePos);
}

function drawBtn()
{
	// find center for the buttons to be placed on the canvas
	const totalBtnsHeight = btnArray.length * btnHeight + (btnArray.length - 1) * btnSpace;
	const startX = (canvas.width - btnWidth) / 2;
	const startY = (menuPos + totalBtnsHeight) / 2;

	// draw each button
	let y = startY ;
	for (const btn of btnArray)
	{
		const x = startX;

		// draw buttons background
		ctx.fillStyle = "transparent";
		ctx.fillRect(x, y, btnWidth, btnHeight);

		// draw text on the btn
		ctx.fillStyle = "white";
		ctx.font = "30px Irish Grover";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		// ctx.fillText(btn, x + btnWidth / 2, y + btnHeight / 2);
		ctx.fillText(dictionary[curLanguage][btn], x + btnWidth / 2, y + btnHeight / 2);

		y += btnHeight + btnSpace;
	}
}

function handleMenu(event) 
{
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	// Check if the click was inside the butto
	let startX = (canvas.width - btnWidth) / 2;
	let startY = (menuPos + (btnArray.length * btnHeight + (btnArray.length - 1) * btnSpace)) / 2;
	let btnY = startY + 10;
	for (const btn of btnArray)
	{
		if (x >= startX && x <= startX + btnWidth && y >= btnY && y <= (btnY + btnHeight) - 20)
		{
			Utils.manageEvt(1, handleMenu);
			if (btn == "singlePlayer")
				loadPage('/game-single')
			else if (btn == "versus")
				loadPage('/game-versus')
			else if (btn == "online")
				createLobby("online");
			else if (btn == "tournament")
				createLobby("tournament");
			else if (btn == "returnHome")
				loadPage("/");
			break;
		}
		btnY += btnHeight + btnSpace;
	}
}

export function createMenu()
{
	let gameFont = new Promise((resolve, reject) => {
		document.fonts.load('1em "Irish Grover"')
			.then(() => {
				resolve();
		})
		.catch(reject);
	});
	gameFont.then(() => {
		setCanvas();
		drawCanvas();
		drawBtn();
		Utils.manageEvt(0, handleMenu);
	});
}

