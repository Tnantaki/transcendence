// function drawRoomStatus(maxWidth, yPos)
// {
// 	if (rooms.type == "online")
// 	{
		
// 	}
// 	// const onlineStatus = ["1/2", "2/2"];
// 	// const tourStatus = ["1/8", ]
// }

function drawRoomDisplay()
{
	const	startX = BOARD_PADDING;
	const	startY = 125;
	const	padding = 30;
	const	lineHeight = 330;
	const	maxWidth = 450;
	const	headerPos = 77;
	const	textPadding = 40;
	const	space = 10;

	// draw players board
	const	boardColor = "rgb(255, 255, 255, 0.2)";
	ctx.beginPath();
	ctx.fillStyle = boardColor;
	ctx.roundRect(startX, startY, maxWidth, lineHeight + padding * 2, 10);
	ctx.fill();

	ctx.font = "40px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "middle";
	ctx.fillText("Room", startX + padding * 3, headerPos);

	ctx.font = "40px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "middle";
	ctx.fillText("Status", maxWidth - 10, headerPos);

	// draw room on the board
	ctx.font = "25px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "center";
	rooms.forEach((room, index) => {
		const yPos = startY + (padding + space)  * index;
		ctx.fillText(room.name, startX + textPadding * 2.2, yPos);
		if (index == 0)
			return ;
		ctx.fillText("1/2", maxWidth - 10 , yPos); //! temporary --> will create specific function later
	});
	ctx.closePath();
}

function addRoom(newRoom)
{
	rooms.push({name: newRoom});
	updateLobby();
}

function handleCreateBtn(btnObj, event)
{
	const	rect = canvas.getBoundingClientRect();
	const	x = event.clientX - rect.left;
	const	y = event.clientY - rect.top;

	const	btnX = imageX + btnObj.xPos;
	const	btnY = imageY + btnObj.yPos;
	const	btnWidth = btnObj.width;
	const	btnHeight = btnObj.height;
	
	if (x >= btnX && x <= btnX + btnWidth && y >= btnY && y <= btnY + btnHeight)
	{
		const newRoom = prompt("Enter room name:");
		if (newRoom)
			addRoom(newRoom);
	}	
}
