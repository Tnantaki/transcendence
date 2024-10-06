import { loadPage } from "../router.js";
import { createLobby } from "./lobby-menu.js";
import * as Utils from "./utils.js";

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

// menu properties
const menuPos = 100;
const btnWidth = 200;
const btnHeight = 50;
const btnSpace = 20;
const btnArray = ["Single Player", "Versus", "Online", "Tournament", "Setting"]


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
		ctx.fillText(btn, x + btnWidth / 2, y + btnHeight / 2);

		y += btnHeight + btnSpace;
	}
}

function handleMenu(event) 
{
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	// Check if the click was inside the button
	let startX = (canvas.width - btnWidth) / 2;
	let startY = (menuPos + (btnArray.length * btnHeight + (btnArray.length - 1) * btnSpace)) / 2;
	let btnY = startY + 10;
	for (const btn of btnArray)
	{
		if (x >= startX && x <= startX + btnWidth && y >= btnY && y <= (btnY + btnHeight) - 20)
		{
			Utils.manageEvt(1, handleMenu);
			if (btn == "Single Player")
				loadPage('/game-single')
			else if (btn == "Versus")
				loadPage('/game-versus')
			else if (btn == "Online")
				createLobby("online");
			else if (btn == "Tournament")
				createTournament(players);
			else if (btn == "Setting")
				console.log("Setting");
			break;
		}
		btnY += btnHeight + btnSpace;
	}
}

export function createMenu()
{
	drawCanvas();
	drawBtn();
	Utils.manageEvt(0, handleMenu);
}

createMenu();

// debugger for btn
			// console.log(btn);
			// console.log("x: " + x);
			// console.log("startX: " + startX);
			// console.log("startX + btnWidth: " + (btnWidth + startX));
			// console.log(".");
			// console.log("y: " + y);
			// console.log("btnY: " + btnY);
			// console.log("btnY + btnHeight: " + (btnHeight + btnY));

// for load game online page
  // loadPage("/online?room_id=" + <id>);