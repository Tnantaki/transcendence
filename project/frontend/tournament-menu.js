// const canvas = document.getElementById("gameArea");
// const ctx = canvas.getContext("2d");

// start buttom position
const xPos = 70;
const yPos = 350;

// image position
let imageX = 0;
let imageY = 0;

// button setting
const btnObj = {
	width: 150, height: 50, bg: "transparent",
	textColor: "white", font: "60px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Start"
};

// pre-load the image
let tmp = 0;
function createTournament(players)
{
	console.log("in create");
	// console.log(players[0].name);
	if (tmp == 0)
	{
		console.log("in if");
		const pongImg = new Image();
		pongImg.src = "images/table-tennis.png";
		pongImg.onload = function() { // call the anonymous function when the image is loaded
			initCanvas();
			drawTextBtn(btnObj);
			drawPlayerList(players);
			initAddBtn();
		};
		tmp = pongImg;
	}
	else
	{
		console.log("in else");
		// console.log(players);
		// console.log(players[1].name);
		initCanvas();
		drawTextBtn(btnObj);
		drawPlayerList(players);
		initAddBtn();
	}
}

function initCanvas()
{
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw game's screen
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// write title
	const textY = 50;
	const textX = 768;
	ctx.font = "50px Irish Grover";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.fillStyle = "white";
	ctx.fillText("Tournament", textX, textY);

	// get text height
	const textHeight = ctx.measureText("m").width;

	const imgRatio = 300;
	imageX = textX - (imgRatio / 2);
	imageY = textY + textHeight + (100 / 2);
	ctx.drawImage(tmp, imageX, imageY, imgRatio, imgRatio);
	// console.log("canvas: " + imageX + " " + imageY)
}

function drawTextBtn(btnObj)
{
	const x = imageX + xPos;
	const y = imageY + yPos;
	const btnWidth = btnObj.width;
	const btnHeight = btnObj.height;

	// draw button background
	ctx.fillStyle = btnObj.bg;
	ctx.fillRect(x, y, btnWidth, btnHeight);

	// draw text on button
	ctx.fillStyle = btnObj.textColor;
	ctx.font = btnObj.font;
	ctx.textAlign = btnObj.textAlign;
	ctx.textBaseline = btnObj.textBaseline;
	ctx.fillText(btnObj.text, x + btnWidth / 2, y + btnHeight / 2);
}

// function drawTextBtn()
// {
// 	const x = imageX + XPOS;
// 	const y = imageY + YPOS;
// 	const btnWidth = 150;
// 	const btnHeight = 50;

// 	// draw button background
// 	ctx.fillStyle = "transparent";
// 	ctx.fillRect(x, y, btnWidth, btnHeight);

// 	// draw text on button
// 	ctx.fillStyle = "white";
// 	ctx.font = "60px Irish Grover";
// 	ctx.textAlign = "center";
// 	ctx.textBaseline = "middle";
// 	ctx.fillText("Start", x + btnWidth / 2, y + btnHeight / 2);
// }

// listen to start button click
canvas.addEventListener("click", function(event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	const btnX = imageX + xPos;
	const btnY = imageY + yPos;
	const btnWidth = 150;
	const btnHeight = 50;
	
	if (x >= btnX && x <= btnX + btnWidth && y >= btnY && y <= btnY + btnHeight)
		console.log("Start");
});

function drawNewCanvas(players)
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	console.log("in new canvas");
	createTournament(players);
	// initCanvas();
	// drawPlayerList(players);
	// drawStartBtn(imageX, imageY);
	// initAddBtn();
}
