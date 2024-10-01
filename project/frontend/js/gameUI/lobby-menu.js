import { getPongImg } from "./shared-resources.js";
import { btns, evtBtns } from "./shared-resources.js";
import { drawRoomDisplay } from "./lobby-board.js";
import * as Utils from "./utils.js";

// ########################################################
// #                       EXECUTION 					  #
// ########################################################

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

function execLobby(mode, img) {
	console.log("execLobby");
	if (mode == "VERSUS" || mode == "online")
	{
		console.log("isLobbyOnline");
		Utils.initCanvas("Online Match", img);
	}
	else if (mode == "tournament")
		Utils.initCanvas("Tournament", img);
	Utils.drawTextBtn(btns.createBtn);
	Utils.drawTextBtn(btns.backBtn);
	drawRoomDisplay();
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
	console.log("mode: ", mode);
	createLobby(mode);
}
