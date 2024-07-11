// ########################################################
// #                       SETTING 					      #
// ########################################################

// button settings
const createBtnObj = {
	width: 300, height: 50, bg: "transparent",
	textColor: "white", font: "50px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Create Room", xPos: 5, yPos: 320
};

const createBtn = (event) => handleCreateBtn(createBtnObj, event);

// ########################################################
// #                       EXECUTION 					  #
// ########################################################

function execOnline()
{
	initCanvas("Online Match");
	drawTextBtn(createBtnObj);
	drawTextBtn(backBtnObj);
	drawRoomDisplay();
	manageEvt(0, createBtn);
	manageEvt(0, backBtn);
}

// pre-load the image
var rooms = [{name: "", players: 1, status: true}];
function createOnline()
{
	if (tmp == 0)
	{
		const pongImg = new Image();
		pongImg.src = "images/table-tennis.png";
		pongImg.onload = function() { // call the anonymous function when the image is loaded
			execOnline();
		};
		tmp = pongImg;
	}
	else
		execOnline();
}

function updateOnlineCanvas()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	createOnline();
}