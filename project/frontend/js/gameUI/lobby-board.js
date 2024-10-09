import { getRoomAPI } from "./room-api.js";

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

const	BOARD_PADDING = canvas.width - 950;
const	boardObj = {
	startX: BOARD_PADDING, startY: 125, padding: 30,
	height: 330, width: 450,
	headerPos: 77, textPadding: 40, space: 10,
}

// ! all the rooms created still in the database (40+ of them)
let cachedRooms = null;
async function getAllRooms() {
	if (cachedRooms)
		return cachedRooms;

	try {
		const res = await getRoomAPI();
		cachedRooms = res;
		return res;
	} catch (error) {
		console.error("Error cannot get rooms: ", error);
		return null;
	}
}

function fillRoomName(room, xPos, yPos) {
	ctx.fillText(room.name, xPos, yPos);
	ctx.fillText(room.number_of_player + 1 + "/2", boardObj.width - 10, yPos);
}

function getBtnWidth(roomName) { 
	const txtWidth = ctx.measureText(roomName).width;
	const finalWidth =  Math.ceil(txtWidth);
	return finalWidth;
}

function getBtnHeight(roomName) {
	const font = "25px Irish Grover"
	const refFont = ctx.measureText(roomName);
	const txtHeight = refFont.actualBoundingBoxAscent + refFont.actualBoundingBoxDescent;
	const finalHeight = Math.ceil(txtHeight);
	return finalHeight;
}

function handleRoomBtn(xPos, yPos, event) {
	
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	const btnX = xPos;
	const btnY = yPos;

}

// Scroll state
let scrollY = 0;
const lineHeight = 20;
const visibleLines = 9;
// Scrollbar properties 
const scrollbarWidth = 10;
const scrollbarPadding = 2;
const scrollbarThumbMinHeight = 20;

// Room buttons
let hasEvent = false;
const   roomBtns = [];
async function initRooms(rooms) {
	const xPos = boardObj.startX + boardObj.textPadding * 2.2;
	const maxScroll = Math.max(0, (rooms.length - visibleLines) * lineHeight);
	scrollY = Math.max(0, Math.min(scrollY, maxScroll));
	if (rooms) {
		const startIndex = Math.floor(scrollY / lineHeight);
		for (let i = 0; i < visibleLines; i++) {
			const roomIndex = startIndex + i;
			if (roomIndex < rooms.length) {
				const room = rooms[roomIndex];
				const yPos = boardObj.startY + lineHeight + (boardObj.padding + boardObj.space) * i;
				fillRoomName(room, xPos, yPos);
				let tmpObj = {
					"name" : room.name,
					"width": getBtnWidth(room.name),
					"height": getBtnHeight(room.name),
					"yPos": yPos,
				};
				if (roomBtns.length < visibleLines)
					roomBtns.push(tmpObj);
				else
					roomBtns[i] = tmpObj
			}
		}
		if (!hasEvent) {
			
		}
	}

	const scrollbarHeight = boardObj.height + boardObj.padding * 2 - 2 * scrollbarPadding;
	const thumbHeight = Math.max(
		scrollbarThumbMinHeight,
		(visibleLines / rooms.length) * scrollbarHeight
	);

	const scrollableHeight = scrollbarHeight - thumbHeight;
	const thumbY = boardObj.startY + scrollbarPadding + (scrollY / maxScroll) * scrollableHeight;


	// Draw scrollbar background
	ctx.beginPath();
	ctx.fillStyle = "#f0f0f0";
	ctx.roundRect(
		(boardObj.startX + boardObj.width) - scrollbarWidth,
		boardObj.startY,
		scrollbarWidth,
		boardObj.height + boardObj.padding * 2,
		10
	);
	ctx.fill();

	// Draw scrollbar thumb
	ctx.beginPath();
	ctx.fillStyle = "#c0c0c0";
	ctx.roundRect(
		(boardObj.startX + boardObj.width) - scrollbarWidth,
		thumbY,
		scrollbarWidth,
		thumbHeight,
		10
	);
	ctx.fill();
}


export async function drawRoomDisplay() {
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
	ctx.fillText("Room", boardObj.startX + boardObj.padding * 3, boardObj.headerPos);
	ctx.fillText("Status", boardObj.width - 10, boardObj.headerPos);

	// Draw room on the board
	ctx.font = "25px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "center";

	const rooms = await getAllRooms();
	await initRooms(rooms);

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

function handleWheel(event) {
	event.preventDefault();
	const rooms = cachedRooms;
	const maxScroll = Math.max(0, (rooms.length - visibleLines) * lineHeight);
	scrollY += event.deltaY;
	scrollY = Math.max(0, Math.min(scrollY, maxScroll));
	drawRoomDisplay();
}

let isDragging = false;
let startY, startScrollY;

function handleMouseDown(event) {
	const x = event.clientX - canvas.getBoundingClientRect().left;
	const y = event.clientY - canvas.getBoundingClientRect().top;

	if (x > boardObj.startX + boardObj.width - scrollbarWidth &&
		x < boardObj.startX + boardObj.width &&
		y > boardObj.startY &&
		y < boardObj.startY + boardObj.height + boardObj.padding * 2) {
		isDragging = true;
		startY = y;
		startScrollY = scrollY;
	}
}

function handleMouseMove(event) {
	if (!isDragging) return;

	const y = event.clientY - canvas.getBoundingClientRect().top;
	const deltaY = y - startY;

	const rooms = cachedRooms;
	const maxScroll = Math.max(0, (rooms.length - visibleLines) * lineHeight);
	const scrollableHeight = boardObj.height + boardObj.padding * 2 - scrollbarThumbMinHeight;

	scrollY = startScrollY + (deltaY / scrollableHeight) * maxScroll;
	scrollY = Math.max(0, Math.min(scrollY, maxScroll));

	drawRoomDisplay();
}

function handleMouseUp() {
	isDragging = false;
}