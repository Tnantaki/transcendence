import { getPongImg } from "./shared-resources.js";
import { btns, evtBtns } from "./shared-resources.js";
import { drawRoomDisplay } from "./lobby-board.js";
import * as Utils from "./utils.js";

// ########################################################
// #                       EXECUTION 					  #
// ########################################################

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

let roomInfo;

function initRoomInfo(room) {
	roomInfo = room;
}

export function getRoomName() {
	return roomInfo.name;
}

export async function drawWaitingRoom(mode) {
	setCanvas();

	// Clear the entire board area
	ctx.clearRect(boardObj.startX, boardObj.startY, boardObj.width, boardObj.height + boardObj.padding * 2);

	// Draw players board
	const boardColor = "rgba(255, 255, 255, 0.2)";
	ctx.beginPath();
	ctx.fillStyle = boardColor;
	ctx.roundRect(boardObj.startX, boardObj.startY, boardObj.width, 
		boardObj.height + boardObj.padding * 2, 10);
	ctx.fill();

	ctx.font = "40px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "center";
	ctx.fillText(dictionary[curLanguage].room, boardObj.startX + boardObj.padding * 3, boardObj.headerPos);
	ctx.fillText(dictionary[curLanguage].status, boardObj.width - 10, boardObj.headerPos);

	// Draw room on the board
	ctx.font = "25px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";

	const rooms = await getAllRooms(checkGameMode());
	if (rooms)
		rooms.sort((a,b) => a.id - b.id);
	await initRooms(rooms, mode);

	// Add event listeners for scrolling (only if they haven't been added before)
	if (!canvas.hasScrollListeners) {
		canvas.addEventListener('wheel', handleWheel);
		canvas.addEventListener('mousedown', handleMouseDown);
		canvas.addEventListener('mousemove', handleMouseMove);
		canvas.addEventListener('mouseup', handleMouseUp);
		canvas.addEventListener('mouseleave', handleMouseUp);
		canvas.hasScrollListeners = true;
	}
}

async function execWaitingRoom(room, img) {
    Utils.initCanvas(room.name, "waitingRoom", img);
    Utils.drawTextBtn(btns.startBtn);
    Utils.drawTextBtn(btns.backBtn);
    await drawRoomDisplay(mode);
    Utils.manageEvt(0, evtBtns.startBtn);
    Utils.manageEvt(0, evtBtns.backBtn);
}

export function createWaitingRoom(room) {
	getPongImg().then(img => {
		execWaitingRoom(room, img);
	}).catch(error => {
		console.error("Error cannot create a waiting room: " + error);
	})
}

// export function updateLobby(mode) {
// 	// console.log("updated lobby");
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	// console.log("mode: ", mode);
// 	createWaitingRoom();
// }
