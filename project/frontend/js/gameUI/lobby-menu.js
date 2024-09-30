import { getPongImg } from "./shared-resources.js";
import { btns, evtBtns } from "./shared-resources.js";
import { drawRoomDisplay } from "./online-board.js";
import * as Utils from "./utils.js";

// ########################################################
// #                       EXECUTION 					  #
// ########################################################

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

function execLobby(mode, img)
{
	if (mode == "online")
		Utils.initCanvas("Online Match", img);
	else if (mode == "tournament")
		Utils.initCanvas("Tournament", img);
	Utils.drawTextBtn(btns.createBtn);
	Utils.drawTextBtn(btns.backBtn);
	drawRoomDisplay();
	Utils.manageEvt(0, evtBtns.createBtn);
	Utils.manageEvt(0, evtBtns.backBtn);
}

export function createLobby(mode)
{
	getPongImg().then(img => {
		execLobby(mode, img);
	}).catch(error => {
		console.error("Error cannot create a lobby: " + error);
	})
}

function updateLobby()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	createLobby();
}
