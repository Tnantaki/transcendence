import { getAllRooms, getRoomlength} from "./room-api.js";
import { manageEvt } from "./utils.js";
import { loadPage } from "../router.js";

let canvas;
let ctx;
function setCanvas() {
	canvas = document.getElementById("gameArea");
	if (canvas)
		ctx = canvas.getContext("2d");
}

function getBoardStartX() {
	setCanvas();
	return canvas.width - 950;
}

const	boardObj = {
	startX: getBoardStartX(), startY: 125, padding: 30,
	height: 330, width: 450,
	headerPos: 77, textPadding: 40, space: 10,
}

function fillRoomName(room, xPos, yPos) {
	ctx.fillText(room.name, xPos, yPos);
	ctx.fillText(room.number_of_player + 1 + "/2", boardObj.width - 10, yPos);
}

function getBtnWidth(roomName) { 
	ctx.font = "25px Irish Grover"
	const txtWidth = ctx.measureText(roomName).width;
	const finalWidth =  Math.ceil(txtWidth);
	return finalWidth;
}

function getBtnHeight(roomName) {
	ctx.font = "25px Irish Grover"
	const refFont = ctx.measureText(roomName);
	const txtHeight = refFont.actualBoundingBoxAscent + refFont.actualBoundingBoxDescent;
	const finalHeight = Math.ceil(txtHeight);
	return finalHeight;
}

export async function handleRoomBtn(xPos, roomBtns, event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	// console.log(roomBtns);
	for (let i = 0; i < roomBtns.length ; i++) { 
		const btnX = xPos - roomBtns[i].width / 2; // delete the left margin from the drawing function
		const btnY = roomBtns[i].yPos + roomBtns[i].height / 2; // delete the top margin
		if (x >= btnX && x <= btnX + roomBtns[i].width && 
			y >= btnY - roomBtns[i].height / 2 && y <= (btnY + roomBtns[i].height / 2)) {

			// for load game online page
			loadPage("/online?room_id=" + roomBtns[i].id);
			break;
		}
	}
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
export const   roomBtns = [];
async function initRooms(rooms) {
	const xPos = boardObj.startX + boardObj.textPadding * 2.2;
	const maxScroll = Math.max(0, (rooms.length - visibleLines) * lineHeight);
	scrollY = Math.max(0, Math.min(scrollY, maxScroll));
	if (rooms.length > 0) {
		const startIndex = Math.floor(scrollY / lineHeight);
		for (let i = 0; i < visibleLines; i++) {
			const roomIndex = startIndex + i;
			if (roomIndex < rooms.length) {
				const room = rooms[roomIndex];
				const yPos = boardObj.startY + lineHeight + (boardObj.padding + boardObj.space) * i;
				fillRoomName(room, xPos, yPos + 8);
				let tmpObj = {
					"name" : room.name,
					"id" : room.id,
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
			const roomBtn = (event) => handleRoomBtn(xPos, roomBtns, event);
			manageEvt(0, roomBtn);
			hasEvent = true;
		}
		// console.log(rooms);
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
	ctx.fillText("Room", boardObj.startX + boardObj.padding * 3, boardObj.headerPos);
	ctx.fillText("Status", boardObj.width - 10, boardObj.headerPos);

	// Draw room on the board
	ctx.font = "25px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";

	const rooms = await getAllRooms();
	rooms.sort((a,b) => a.id - b.id);
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
	const maxScroll = Math.max(0, (getRoomlength() - visibleLines) * lineHeight);
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

export const scrollEvt = {handleWheel, handleMouseDown, handleMouseMove, handleMouseUp};