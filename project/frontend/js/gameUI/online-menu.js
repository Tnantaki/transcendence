import { getPongImg } from "./shared-resources.js";
import * as Utils from "./utils.js";

// ########################################################
// #                       SETTING 					      #
// ########################################################


const createBtn = (event) => handleCreateBtn(createBtnObj, event);

// ########################################################
// #                       EXECUTION 					  #
// ########################################################

function execLobby(img)
{
	console.log("start");
	if (rooms.type == "online")
		Utils.initCanvas("Online Match", img);
	else
		Utils.initCanvas("Tournament", img);
	console.log("done created canvas");
	Utils.drawTextBtn(createBtnObj);
	console.log("drawnCreateBtn");
	Utils.drawTextBtn(backBtnObj);
	console.log("drawnBackBtn");
	Utils.drawRoomDisplay();
	console.log("drawnRoomDisplay");
	Utils.manageEvt(0, createBtn);
	Utils.manageEvt(0, backBtn);
	console.log("end");
}

// pre-load the image
var rooms = [{
		name: "", 
		players: 1, //! add more players if one or more join the room
		status: true, 
		type: ""
}];

export function createLobby(type)
{
	rooms.type = type;
	getPongImg().then(img => {
		execLobby(img);
	}).catch(error => {
		console.error("Error cannot create a lobby: " + error);
	})
}

function updateLobby()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	createLobby(rooms.type);
}