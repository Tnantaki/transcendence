import { getImgPosition, manageEvt } from "./utils.js";
import { createMenu } from "./main-menu.js";
import { scrollEvt, roomBtns, handleRoomBtn} from "./lobby-board.js";
import {cachedRooms, createRoom} from "./room-api.js";
import { checkGameMode } from "./lobby-menu.js";

let canvas;
let ctx;
function setCanvas() {
	canvas = document.getElementById("gameArea");
	if (canvas)
		ctx = canvas.getContext("2d");
}

// preload the img
let pongImg = null;
export function getPongImg() {
	if (!pongImg) {
		pongImg = new Image();
		pongImg.src = "js/gameUI/images/table-tennis.png";
	}
	return new Promise ((resolve, reject) => {
		if (pongImg.complete)
			resolve(pongImg);
		else {
			pongImg.onload = () => resolve(pongImg);
			pongImg.onerror = () => reject;
		}
	})
}

// button settings
const createBtnObj = {
	width: 300, height: 50, bg: "transparent",
	textColor: "white", font: "50px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Create Room", xPos: 5, yPos: 320
};
const startBtnObj = {
	width: 150, height: 50, bg: "transparent",
	textColor: "white", font: "60px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Start", xPos: 70, yPos: 320
};
const backBtnObj = {
	width: 90, height: 35, bg: "transparent",
	textColor: "white", font: "40px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Back", xPos: 90, yPos: 380
};

function handleCreateBtn(btnObj, event)
{
	setCanvas();

	const	rect = canvas.getBoundingClientRect();
	const	x = event.clientX - rect.left;
	const	y = event.clientY - rect.top;

	const	{imageX, imageY} = getImgPosition();
	const	btnX = imageX + btnObj.xPos;
	const	btnY = imageY + btnObj.yPos;
	const	btnWidth = btnObj.width;
	const	btnHeight = btnObj.height;

	if (x >= btnX && x <= btnX + btnWidth && y >= btnY && y <= btnY + btnHeight)
	{
		console.log("clicked create btn");
		createRoom(checkGameMode());
	}	
}

function handleBackBtn(btnObj, event)
{
	setCanvas();

	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	const	{imageX, imageY} = getImgPosition();
	const btnX = imageX + btnObj.xPos;
	const btnY = imageY + btnObj.yPos;
	const btnWidth = btnObj.width;
	const btnHeight = btnObj.height;
	
	if (x >= btnX && x <= btnX + btnWidth && y >= btnY && y <= btnY + btnHeight)
	{
		manageEvt(1, createBtn);
		manageEvt(1, startBtn);
		manageEvt(1, backBtn);
		if (roomBtns.length > 0) {
			roomBtns.length = 0;
			cachedRooms.length = 0;
			manageEvt(1, handleRoomBtn)
		}
		if (canvas.hasScrollListeners) {
			canvas.removeEventListener('wheel', scrollEvt.handleWheel);
			canvas.removeEventListener('mousedown', scrollEvt.handleMouseDown);
			canvas.removeEventListener('mousemove', scrollEvt.handleMouseMove);
			canvas.removeEventListener('mouseup', scrollEvt.handleMouseUp);
			canvas.removeEventListener('mouseleave', scrollEvt.handleMouseUp);
			canvas.hasScrollListeners = false;
		}
		createMenu();
		// manageEvt(1, handleAddPlayerBtn);
		// console.log("Back");
	}
}

// references for button events
const createBtn = (event) => handleCreateBtn(createBtnObj, event);
const startBtn = (event) => handleStartBtn(startBtnObj, event);
const backBtn = (event) => handleBackBtn(backBtnObj, event);

export const btns = {createBtn: createBtnObj, startBtn: startBtnObj, backBtn: backBtnObj};
export const evtBtns = {createBtn: createBtn, startBtn: startBtn, backBtn: backBtn};