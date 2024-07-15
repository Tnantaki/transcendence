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

function execLobby()
{
	if (rooms.type == "online")
		initCanvas("Online Match");
	else
		initCanvas("Tournament");
	drawTextBtn(createBtnObj);
	drawTextBtn(backBtnObj);
	drawRoomDisplay();
	manageEvt(0, createBtn);
	manageEvt(0, backBtn);
}

// pre-load the image
var rooms = [{
		name: "", 
		players: 1, //! add more players if one or more join the room
		status: true, 
		type: ""
}];

function createLobby(type)
{
	rooms.type = type;
	if (tmp == 0)
	{
		const pongImg = new Image();
		pongImg.src = "images/table-tennis.png";
		pongImg.onload = function() { // call the anonymous function when the image is loaded
			execLobby();
		};
		tmp = pongImg;
	}
	else
		execLobby();
}

function updateLobby()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	createLobby(rooms.type);
}