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

// let roomData = [
// 	{
// 		"id": -1,
// 		"name": " ",
// 		"number_of_player": 0,
// 	},
// ]
// ! there should be 2 types of rooms. One for online and one for tournament
let onlineRooms = [];
let tourRooms = [];
function setRoomData(data) {
	rooms.push(data);
	console.log(rooms);
}

export function getRoomData() {
	return rooms;
}

export function addRoom(room) {
	// console.log()
	setRoomData(room);
	updateLobby();
}