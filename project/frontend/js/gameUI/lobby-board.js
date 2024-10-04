import { getRoomAPI, getRoomData } from "./room-api.js";

const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

const	BOARD_PADDING = canvas.width - 950;
const	boardObj = {
	startX: BOARD_PADDING, startY: 125, padding: 30,
	height: 330, maxWidth: 450,
	headerPos: 77, textPadding: 40, space: 10,
}

// ! all the rooms created still in the database (40+ of them)
let cachedRoom = null;
async function getAllRooms() {
	if (cachedRoom)
		return cachedRoom;

	try {
		const res = await getRoomAPI();
		cachedRoom = res;
		return res;
	} catch (error) {
		console.error("Error cannot get rooms: ", error);
		return null;
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
async function initRooms(rooms)
{
	// const	rooms = await getAllRooms(); //!change to getRoomAPI later
	// Calculate max scroll position
	const maxScroll = Math.max(0, (rooms.length - visibleLines) * lineHeight);

	// Ensure scrollY is within bounds
	scrollY = Math.max(0, Math.min(scrollY, maxScroll));

	// console.log(rooms);
	if (rooms) {
		rooms.forEach((room, index) => {
			const itemPos = Math.floor(scrollY / lineHeight) + index;
			if (itemPos < rooms.length && index < visibleLines) {
				const yPos = boardObj.startY + lineHeight + (boardObj.padding + boardObj.space)  * index;
				ctx.fillText(room.name, boardObj.startX + boardObj.textPadding * 2.2, yPos);
				ctx.fillText(room.number_of_player + 1 + "/2", boardObj.maxWidth - 10 , yPos);
			}
		});
	}

	// Draw scrollbar
	const scrollbarHeight = boardObj.height - 2 * scrollbarPadding;
	const scrollbarY = boardObj.startY + scrollbarPadding;
	const thumbHeight = Math.max(
		scrollbarThumbMinHeight, (visibleLines / rooms.length) * scrollbarHeight
	);


	// Calculate thumb position ensureing it reaches the bottom
	const thumbY = scrollbarY + (scrollY / maxScroll) * (scrollbarHeight - thumbHeight);

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
}

export async function drawRoomDisplay()
{

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

	const rooms = await getAllRooms();
	await initRooms(rooms);

	// Add event listeners for scrolling
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

	ctx.closePath();
}

function handleWheel(event) {
    event.preventDefault();
    scrollY += event.deltaY;
    redraw();
}

let isDragging = false;
let startY, startScrollY;

function handleMouseDown(event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    if (x > boardObj.startX + boardObj.maxWidth - scrollbarWidth &&
        x < boardObj.startX + boardObj.maxWidth &&
        y > boardObj.startY &&
        y < boardObj.startY + boardObj.height) {
        isDragging = true;
        startY = y;
        startScrollY = scrollY;
    }
}

async function handleMouseMove(event) {
    if (!isDragging) return;

    const y = event.clientY - canvas.getBoundingClientRect().top;
    const deltaY = y - startY;
    const scrollableHeight = boardObj.height - 2 * scrollbarPadding;
    const rooms = await getAllRooms();
    const maxScroll = Math.max(0, (rooms.length - visibleLines) * lineHeight);

    scrollY = startScrollY + (deltaY / scrollableHeight) * maxScroll;
    redraw();
}

function handleMouseUp() {
    isDragging = false;
}

async function redraw() {
    // Clear the canvas (you might need to adjust this based on your setup)
    ctx.clearRect(boardObj.startX, boardObj.startY, boardObj.maxWidth, boardObj.height + boardObj.padding * 2);

    // Redraw the board background
    const boardColor = "rgb(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.fillStyle = boardColor;
    ctx.roundRect(boardObj.startX, boardObj.startY, boardObj.maxWidth, 
        boardObj.height + boardObj.padding * 2, 10);
    ctx.fill();

    // Redraw the rooms and scrollbar
    const rooms = await getAllRooms();
    await initRooms(rooms);
}

