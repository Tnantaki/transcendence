import { getRoomAPI } from "./room-api.js";

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

// ! all the rooms created still in the database (40+ of them)
// function getRooms() {
// 	getRoomAPI()
// 	 .then(res => {
// 		console.log("here: ", res);
// 	 })
// 	 .catch(error => {
// 		console.error("Error cannot get rooms: ", error);
// 	 })
// }

const BOARD_PADDING = canvas.width - 950;
export function drawRoomDisplay()
{
	const	startX = BOARD_PADDING;
	const	startY = 125;
	const	padding = 30;
	const	lineHeight = 330;
	const	maxWidth = 450;
	const	headerPos = 77;
	const	textPadding = 40;
	const	space = 10;

	// draw players board
	const	boardColor = "rgb(255, 255, 255, 0.2)";
	ctx.beginPath();
	ctx.fillStyle = boardColor;
	ctx.roundRect(startX, startY, maxWidth, lineHeight + padding * 2, 10);
	ctx.fill();

	ctx.font = "40px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "middle";
	ctx.fillText("Room", startX + padding * 3, headerPos);

	ctx.font = "40px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "middle";
	ctx.fillText("Status", maxWidth - 10, headerPos);

	// draw room on the board
	ctx.font = "25px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "center";
	// getRooms();
	// rooms.forEach((room, index) => {
	// 	const yPos = startY + (padding + space)  * index;
	// 	ctx.fillText(room.name, startX + textPadding * 2.2, yPos);
	// 	if (index == 0)
	// 		return ;
	// 	ctx.fillText("1/2", maxWidth - 10 , yPos); //! temporary --> will create specific function later
	// });
	ctx.closePath();
}

// function addRoom(newRoom)
// {
// 	rooms.push({name: newRoom});
// 	updateLobby();
// }
