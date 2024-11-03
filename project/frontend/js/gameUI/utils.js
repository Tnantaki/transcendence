import { dictionary } from "./shared-resources.js";

let canvas;
let ctx;
let curLanguage;

function setCanvas() {
	canvas = document.getElementById("gameArea");
	if (canvas)
		ctx = canvas.getContext("2d");

	curLanguage = localStorage.getItem('currentLanguage') || 'en';
}

export function removeEvent(evt){
	canvas.removeEventListener("click", evt);
}

export function addEvent(evt) {
	canvas.addEventListener("click", evt);
}

export function manageEvt(status, evt)
{
	setCanvas();

	// 0 --> add event
	if (!status)
		addEvent(evt);
	else
		removeEvent(evt);
}

// image position
let imageX = 0;
let imageY = 0;
export function initCanvas(title, pongImg)
{
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw game's screen
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// write title
	const textY = 50;
	const textX = 768;
	ctx.font = "50px Irish Grover";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.fillStyle = "white";
	ctx.fillText(dictionary[curLanguage][title], textX, textY);

	// get text height
	const textHeight = ctx.measureText("m").width;

	const imgRatio = 300;
	imageX = textX - (imgRatio / 2);
	imageY = textY + textHeight + (100 / 2);
	ctx.drawImage(pongImg, imageX, imageY, imgRatio, imgRatio);
	ctx.closePath();	
}

export function getImgPosition() { 
	return {imageX, imageY};
}

// draw buttons that are text-based
export function drawTextBtn(btnObj)
{
	const {imageX, imageY} = getImgPosition();
	const x = imageX + btnObj.xPos;
	const y = imageY + btnObj.yPos;
	const btnWidth = btnObj.width;
	const btnHeight = btnObj.height;

	// draw button background
	ctx.beginPath();
	ctx.fillStyle = btnObj.bg;
	ctx.fillRect(x, y, btnWidth, btnHeight);
	ctx.closePath();

	// draw text on button
	ctx.fillStyle = btnObj.textColor;
	ctx.font = btnObj.font;
	ctx.textAlign = btnObj.textAlign;
	ctx.textBaseline = btnObj.textBaseline;
	ctx.fillText(dictionary[curLanguage][btnObj.text], x + btnWidth / 2, y + btnHeight / 2);
}