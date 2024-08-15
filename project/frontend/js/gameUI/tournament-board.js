// ########################################################
// #                       SETTING 					      #
// ########################################################

// image position
let imageX = 0;
let imageY = 0;

// ########################################################
// #                       EXECUTION 					  #
// ########################################################

function execTournament()
{
	initCanvas("Tournament");
	drawTextBtn(btnObj);
	drawTextBtn(backBtnObj);
	drawPlayerList();
	initAddBtn();
	manageEvt(0, startBtn);
	manageEvt(0, backBtn);
	manageEvt(0, handleAddPlayerBtn);
}

// pre-load the image
var pongImg = null;
var players = [{name: "Join The Tournament !"}];
function createTournament()
{
	if (!pongImg)
	{
		pongImg = new Image();
		pongImg.src = "js/gameUI/images/table-tennis.png";
		pongImg.onload = function() { // call the anonymous function when the image is loaded
			execTournament();
		};
	}
	else
		execTournament();
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
		// manageEvt(1, createBtn);
		// console.log("Back");
	}
}

function updateTour()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	createTournament();
}

	// console.log("x: " + x);
	// console.log("btnX: " + btnX);
	// console.log("btnX + wd: " + (btnX + btnWidth));
	// console.log("y: " + y);
	// console.log("btnY: " + btnY);
	// console.log("btnY + wd: " + (btnY + btnHeight));