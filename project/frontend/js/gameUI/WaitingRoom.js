import { getPongImg } from "./shared-resources.js";
import { btns, evtBtns } from "./shared-resources.js";
import * as Utils from "./utils.js";
import { boardObj, initPlayers } from "./lobby-board.js";
import { dictionary } from "./shared-resources.js";
// ########################################################
// #                       EXECUTION 					  #
// ########################################################



// let canvas;
// let ctx;
// let curLanguage;

// function setCanvas() {
// 	canvas = document.getElementById("gameArea");
// 	if (canvas)
// 		ctx = canvas.getContext("2d");

// 	curLanguage = localStorage.getItem('currentLanguage') || 'en';
// }

class WaitingRoom {
  constructor(canvas, ctx, curLanguage, roomName, owner) {
	this.canvas = canvas
	this.ctx = ctx
	this.curLanguage = curLanguage
    this.roomName = roomName
	this.owner = owner
	this.playersName = []

    // this.setWaitingRoom()
  }

	async drawPlayerBoard() {
		// setCanvas();

		// Clear the entire board area
		this.ctx.clearRect(boardObj.startX, boardObj.startY, boardObj.width, boardObj.height + boardObj.padding * 2);

		// Draw players board
		const boardColor = "rgba(255, 255, 255, 0.2)";
		this.ctx.beginPath();
		this.ctx.fillStyle = boardColor;
		this.ctx.roundRect(boardObj.startX, boardObj.startY, boardObj.width, 
			boardObj.height + boardObj.padding * 2, 10);
		this.ctx.fill();

		this.ctx.font = "40px Irish Grover";
		this.ctx.fillStyle = "white";
		this.ctx.textBaseline = "top";
		this.ctx.textAlign = "center";
		this.ctx.fillText(dictionary[this.curLanguage].player, boardObj.startX + boardObj.padding * 3, boardObj.headerPos);
		// this.ctx.fillText("Players" , boardObj.startX + boardObj.padding * 3, boardObj.headerPos);

		// Draw room on the board
		this.ctx.font = "25px Irish Grover";
		this.ctx.fillStyle = "white";
		this.ctx.textBaseline = "middle";
		this.ctx.textAlign = "center";

		console.log("hello");
		console.log(this.playersName.length);
		await initPlayers(this.playersName, this.ctx);

	}

	async execWaitingRoom(img) {
		Utils.initCanvas(this.roomName, "waitingRoom", img);
		Utils.drawTextBtn(btns.startBtn);
		Utils.drawTextBtn(btns.backBtn);
		await this.drawPlayerBoard(this.playersName);
		Utils.manageEvt(0, evtBtns.startBtn);
		Utils.manageEvt(0, evtBtns.backBtn);
	}

	createWaitingRoom() {
		getPongImg().then(img => {
			this.execWaitingRoom(img);
		}).catch(error => {
			console.error("Error cannot create a waiting room: " + error);
		})
	}

	updateOwner() {
		if (this.owner != this.playersName[0])
			this.owner = this.playersName[0];
		console.log("Owner: ", this.owner);
	}

	updateWaitingRoom(playersName) {
		console.log("updated waitingRoom");
		console.log(playersName)
		this.playersName = playersName;
		this.updateOwner();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.createWaitingRoom();
	}

	getNumPlayers() {
		return this.playersName.length;
	}

	getOwner() {
		return this.owner;
	}

}

let waitingRoom = null;

export function joinWaitingRoom(roomName, playersName) {
	const canvas = document.getElementById("gameArea");
	const ctx = canvas.getContext("2d");
	const curLanguage = localStorage.getItem('currentLanguage') || 'en';

	waitingRoom = new WaitingRoom(canvas, ctx, curLanguage, roomName, playersName[0]);
	waitingRoom.updateWaitingRoom(playersName);
}

export function isOwner(name) {
	console.log("who: ", waitingRoom.getOwner());
	if (waitingRoom.getOwner() == name)
		return true;
	return false;
}

export function fullWaitingRoom() {
	console.log("check full plauer");
	if (waitingRoom.getNumPlayers() == 4)
		return true;
	return false;
}