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

function updateTour()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	createTournament();
}
