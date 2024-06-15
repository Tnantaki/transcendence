// ########################################################
// #                       SETTING 					      #
// ########################################################

// image position
let imageX = 0;
let imageY = 0;

// start button setting 
const btnObj = {
	width: 150, height: 50, bg: "transparent",
	textColor: "white", font: "60px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Start", xPos: 70, yPos: 320
};

// back button setting 
const backBtnObj = {
	width: 90, height: 35, bg: "transparent",
	textColor: "white", font: "40px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Back", xPos: 90, yPos: 380
};

// references for button events
const startBtn = (event) => handleStartBtn(btnObj, event);
const backBtn = (event) => handleBackBtn(backBtnObj, event);


// ########################################################
// #                       EXECUTION 					  #
// ########################################################

function execTournament(players)
{
	initCanvas();
	drawTextBtn(btnObj);
	drawTextBtn(backBtnObj);
	drawPlayerList(players);
	initAddBtn();
	manageEvt(0, startBtn);
	manageEvt(0, backBtn);
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

function handleStartBtn(btnObj, event)
{
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	const btnX = imageX + btnObj.xPos;
	const btnY = imageY + btnObj.yPos;
	const btnWidth = btnObj.width;
	const btnHeight = btnObj.height;
	
	//! put game here
	if (x >= btnX && x <= btnX + btnWidth && y >= btnY && y <= btnY + btnHeight)
		console.log("Start");
}

function handleBackBtn(btnObj, event)
{
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	const btnX = imageX + btnObj.xPos;
	const btnY = imageY + btnObj.yPos;
	const btnWidth = btnObj.width;
	const btnHeight = btnObj.height;
	
	if (x >= btnX && x <= btnX + btnWidth && y >= btnY && y <= btnY + btnHeight)
	{
		manageEvt(1, startBtn);
		manageEvt(1, backBtn);
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