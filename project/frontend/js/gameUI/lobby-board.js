import { getRoomAPI, getRoomData } from "./room-api.js";

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

// ! all the rooms created still in the database (40+ of them)
async function getAllRooms() {
	try {
		const res = await getRoomAPI();
		return res;
	} catch (error) {
		console.error("Error cannot get rooms: ", error);
		return null;
	}
}


async function initRooms(boardObj)
{
	const	rooms = await getAllRooms(); //!change to getRoomAPI later

	// Scroll state
	let scrollY = 0;
	const lineHeight = 20;
	const visibleLines = 9;
	// console.log("vis: ", visibleLines)

	// Scrollbar properties 
	const scrollbarWidth = 10;
	const scrollbarPadding = 2;
	const scrollbarThumbMinHeight = 20;
	
	// console.log(rooms);
	if (rooms) {
		rooms.forEach((room, index) => {
			const yPos = boardObj.startY + lineHeight + (boardObj.padding + boardObj.space)  * index;
			const itemPos = Math.floor(scrollY / lineHeight) + index;
			if (itemPos < rooms.length && itemPos < visibleLines) {
				console.log(itemPos);
				ctx.fillText(room.name, boardObj.startX + boardObj.textPadding * 2.2, yPos);
				ctx.fillText(room.number_of_player + 1 + "/2", boardObj.maxWidth - 10 , yPos); //! temporary --> will create specific function later
			}
		});
	}

	// Draw scrollbar
	const scrollbarHeight = boardObj.height - 2 * scrollbarPadding;
	const scrollbarY = scrollbarPadding;
	const thumbHeight = Math.max(
		scrollbarThumbMinHeight, (visibleLines / rooms.length) * scrollbarHeight
	);

	// Calculate max scroll position
	const maxScroll = (rooms.length - visibleLines) * lineHeight;

	// Calculate thumb position ensureing it reaches the bottom
	const thumbY = scrollbarY + (scrollY / maxScroll) * (scrollbarHeight - thumbHeight);

	// console.log(boardObj.startX);
	// Draw scrollbar background
	ctx.beginPath();
	ctx.fillStyle = "#f0f0f0";
	ctx.roundRect((boardObj.startX + boardObj.maxWidth) - scrollbarWidth, 
		boardObj.startY, scrollbarWidth, boardObj.height + boardObj.padding * 2, 10
	);
	ctx.fill();

	// Draw scrollbar thumb
	ctx.beginPath();
	ctx.fillStyle = "#c0c0c0";
	ctx.roundRect((boardObj.startX + boardObj.maxWidth) - scrollbarWidth, 
		boardObj.startY, scrollbarWidth, thumbHeight, 10
	);
	ctx.fill();

	// original
	// if (rooms)
	// {
	// 	rooms.forEach((room, index) => {
	// 		const yPos = boardObj.startY + lineHeight + (boardObj.padding + boardObj.space)  * index;
	// 		ctx.fillText(room.name, boardObj.startX + boardObj.textPadding * 2.2, yPos);
	// 		ctx.fillText(room.number_of_player + 1 + "/2", boardObj.maxWidth - 10 , yPos); //! temporary --> will create specific function later
	// 	});
	// }
}

const BOARD_PADDING = canvas.width - 950;
export async function drawRoomDisplay()
{
	const	boardObj = {
		startX: BOARD_PADDING, startY: 125, padding: 30,
		height: 330, maxWidth: 450,
		headerPos: 77, textPadding: 40, space: 10,
	}

	// draw players board
	const	boardColor = "rgb(255, 255, 255, 0.2)";
	ctx.beginPath();
	ctx.fillStyle = boardColor;
	ctx.roundRect(boardObj.startX, boardObj.startY, boardObj.maxWidth, 
		boardObj.height + boardObj.padding * 2, 10);
	ctx.fill();

	ctx.font = "40px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "middle";
	ctx.fillText("Room", boardObj.startX + boardObj.padding * 3, boardObj.headerPos);
	ctx.fillText("Status", boardObj.maxWidth - 10, boardObj.headerPos);

	// draw room on the board
	ctx.font = "25px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "center";

	await initRooms(boardObj);

	ctx.closePath();
}

