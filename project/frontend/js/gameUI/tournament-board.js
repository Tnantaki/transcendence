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
let pongImg = null;
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