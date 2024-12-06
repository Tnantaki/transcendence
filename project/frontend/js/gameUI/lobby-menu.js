import { getPongImg } from "./shared-resources.js";
import { btns, evtBtns } from "./shared-resources.js";
import { drawRoomDisplay } from "./lobby-board.js";
import * as Utils from "./utils.js";

// ########################################################
// #                       EXECUTION 					  #
// ########################################################

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");
let gameMode;

function initGameMode(mode) {
	gameMode = mode;
}

export function checkGameMode() {
	return gameMode;
}

export function setGameMode(mode) {
	gameMode = mode;
}

async function execLobby(mode, img) {
	initGameMode(mode);
	if (mode == "online")
		Utils.initCanvas("onlineMatch", mode, img);
	else if (mode == "tournament")
		Utils.initCanvas("tournament", mode, img);
	Utils.drawTextBtn(btns.createBtn);
	Utils.drawTextBtn(btns.backBtn);
	await drawRoomDisplay(mode);
	Utils.manageEvt(0, evtBtns.createBtn);
	Utils.manageEvt(0, evtBtns.backBtn);
}

export function createLobby(mode) {
	getPongImg().then(img => {
		execLobby(mode, img);
	}).catch(error => {
		console.error("Error cannot create a lobby: " + error);
	})
}

export function updateLobby(mode) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	createLobby(mode);
}
