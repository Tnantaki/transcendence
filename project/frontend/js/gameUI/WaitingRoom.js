import { getPongImg } from "./shared-resources.js";
import { btns, evtBtns } from "./shared-resources.js";
import { drawRoomDisplay } from "./lobby-board.js";
import * as Utils from "./utils.js";
import { updateLobby } from "./lobby-menu.js";

// ########################################################
// #                       EXECUTION 					  #
// ########################################################

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

export const waitPlayers = ["one", "two"];

async function execWaitingRoom(room, img) {
    Utils.initCanvas(room.name, "waitingRoom", img);
    Utils.drawTextBtn(btns.startBtn);
    Utils.drawTextBtn(btns.backBtn);
    await drawRoomDisplay("waitingRoom");
    Utils.manageEvt(0, evtBtns.startBtn);
    Utils.manageEvt(0, evtBtns.backBtn);
}

let room_g = null;

export function createWaitingRoom(room) {
	if (!room_g)
		room_g = room;
	getPongImg().then(img => {
		execWaitingRoom(room_g, img);
	}).catch(error => {
		console.error("Error cannot create a waiting room: " + error);
	})
}

export function updateWaitingRoom(mode) {
	// console.log("updated lobby");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// console.log("mode: ", mode);
	createWaitingRoom(mode);
}