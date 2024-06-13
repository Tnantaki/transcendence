
// #################### Setting ####################

// image position
let imageX = 0;
let imageY = 0;

// start buttom position (event)
const xPos = 70;
const yPos = 320;

// start button setting (design)
const strBtnWidth = 150;
const strBtnHeight = 50;
const btnObj = {
	width: strBtnWidth, height: strBtnHeight, bg: "transparent",
	textColor: "white", font: "60px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Start"
};

// back buttom position (event)
const xBack = 90;
const yBack = 380;

// back button setting (design)
const backBtnWidth = 90;
const backBtnHeight = 35;
const backBtnObj = {
	width: backBtnWidth, height: backBtnHeight, bg: "transparent",
	textColor: "white", font: "40px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Back"
};

// ######################## Execution #####################

function execTournament(players)
{
	initCanvas();
	drawTextBtn(btnObj, xPos, yPos);
	drawTextBtn(backBtnObj, xBack, yBack);
	drawPlayerList(players);
	initAddBtn();
	manageEvt(0, handleStartBtn);
	manageEvt(0, handleBackBtn);
	manageEvt(0, handleAddPlayerBtn);
}

// pre-load the image
let tmp = 0;
var players = [{name: "Join The Tournament !"}];
function createTournament(players)
{
	if (tmp == 0)
	{
		const pongImg = new Image();
		pongImg.src = "images/table-tennis.png";
		pongImg.onload = function() { // call the anonymous function when the image is loaded
			execTournament(players);
		};
		tmp = pongImg;
	}
	else
		execTournament(players);
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

function handleStartBtn()
{
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	const btnX = imageX + xPos;
	const btnY = imageY + yPos;
	const btnWidth = strBtnWidth;
	const btnHeight = strBtnHeight;
	
	//! put game here
	if (x >= btnX && x <= btnX + btnWidth && y >= btnY && y <= btnY + btnHeight)
		console.log("Start");
}

function handleBackBtn()
{
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	const btnX = imageX + xBack;
	const btnY = imageY + yBack;
	const btnWidth = backBtnWidth;
	const btnHeight = backBtnHeight;
	
	if (x >= btnX && x <= btnX + btnWidth && y >= btnY && y <= btnY + btnHeight)
	{
		manageEvt(1, handleStartBtn);
		manageEvt(1, handleBackBtn);
		manageEvt(1, handleAddPlayerBtn);
		createMenu();
		// console.log("Back");
	}
}

function drawNewCanvas(players)
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	createTournament(players);
}

	// console.log("x: " + x);
	// console.log("btnX: " + btnX);
	// console.log("btnX + wd: " + (btnX + btnWidth));
	// console.log("y: " + y);
	// console.log("btnY: " + btnY);
	// console.log("btnY + wd: " + (btnY + btnHeight));