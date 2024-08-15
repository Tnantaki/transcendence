import { getPongImg } from "./shared-resources.js";
import { btns, evtBtns } from "./shared-resources.js";
import { drawRoomDisplay } from "./online-board.js";
import * as Utils from "./utils.js";

// ########################################################
// #                       EXECUTION 					  #
// ########################################################

function execLobby(mode, img)
{
	console.log("start");
	if (mode == "online")
		Utils.initCanvas("Online Match", img);
	else
		Utils.initCanvas("Tournament", img);
	console.log("done created canvas");
	Utils.drawTextBtn(btns.createBtn);
	console.log("drawnCreateBtn");
	Utils.drawTextBtn(btns.backBtn);
	console.log("drawnBackBtn");
	drawRoomDisplay();
	console.log("drawnRoomDisplay");
	Utils.manageEvt(0, evtBtns.createBtn);
	Utils.manageEvt(0, evtBtns.backBtn);
	console.log("end");
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
	createLobby(mode);
}