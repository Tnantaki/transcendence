const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

export function removeEvent(evt){
	canvas.removeEventListener("click", evt);
	// console.log("remove main menu button");
}

export function addEvent(evt) {
	canvas.addEventListener("click", evt);
}

export function manageEvt(status, evt)
{
	// 0 --> add event
	if (!status)
		addEvent(evt);
	else
		removeEvent(evt);
}

export function initCanvas(title)
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
	ctx.fillText(title, textX, textY);

	// get text height
	const textHeight = ctx.measureText("m").width;

	const imgRatio = 300;
	imageX = textX - (imgRatio / 2);
	imageY = textY + textHeight + (100 / 2);
	ctx.drawImage(pongImg, imageX, imageY, imgRatio, imgRatio);
	ctx.closePath();	
	// console.log("canvas: " + imageX + " " + imageY)
}

// draw buttons that are text-based
export function drawTextBtn(btnObj)
{
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
	ctx.fillText(btnObj.text, x + btnWidth / 2, y + btnHeight / 2);
}