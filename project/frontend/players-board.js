const BUTTON_RADIUS = 10;
const BUTTON_SPACE = 40;
const BOARD_MARGIN = 505;

// create dynamic list view
var players = [{name: "Join The Tournament !"}];
function drawPlayerList(players)
{
	const startX = canvas.width - 950;
	const startY = 100;
	const padding = 30;
	const textPadding = 40;
	const lineHeight = 40;
	const maxWidth = 450;

	// draw players board
	const boardColor = "rgb(255, 255, 255, 0.2)";
	ctx.fillStyle = boardColor;
	ctx.roundRect(startX, startY, maxWidth, lineHeight * players.length + padding * 2, 10);
	ctx.fill();

	ctx.font = "40px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	// ctx.textAlign = "start";
	ctx.fillText("Players", startX + 50, startY - 23);

	// write players' names
	ctx.font = "25px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.textAlign = "start";
	players.forEach((player, index) => {
		const yPos = startY + padding + index * lineHeight;
		ctx.fillText(player.name, startX + textPadding, yPos + 20);
	});
}

function addPlayer(name)
{
	if (players.length >= 8)
		return (alert("Only 8 players can join the tournament!"));
	if (players.length == 1)
		players.pop();
	players.push({name: name});
	drawNewCanvas(players);
}

function drawCircle(x, y, radius, fillStyle)
{
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.fillStyle = fillStyle;
	ctx.fill();

	// highlight the button
	// ctx.strokeStyle = "white";
	// ctx.stroke();
}

function drawAddBtn(btnY)
{
	const btnX = canvas.width - BOARD_MARGIN;
	drawCircle(btnX, btnY, BUTTON_RADIUS, "rgb(52, 65, 172)");

	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.moveTo(btnX + BUTTON_RADIUS, btnY);
	ctx.lineTo(btnX - BUTTON_RADIUS, btnY);
	ctx.stroke();

	// vertical
	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.moveTo(btnX, btnY - BUTTON_RADIUS);
	ctx.lineTo(btnX, btnY + BUTTON_RADIUS);
	ctx.stroke();
}

function initAddBtn()
{
	let initBtnY = 200;
	if (players.length > 1)
		initBtnY += (players.length - 1) * BUTTON_SPACE;
	drawAddBtn(initBtnY);
}

function isAddButton(circleX, circleY, radius, clickX, clickY)
{
	const dx = circleX - clickX;
	const dy = circleY - clickY;
	const dis = Math.sqrt(dx * dx + dy * dy);
	return dis <= radius;
}

canvas.addEventListener("click", function(event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	const btnX = canvas.width - BOARD_MARGIN;
	let btnY = 200;
	if (players.length > 1)
		btnY += (players.length - 1) * BUTTON_SPACE;

	if (isAddButton(btnX, btnY, BUTTON_RADIUS, x, y)) {
		const newName = prompt("Enter player name:");
		if (newName)
			addPlayer(newName);
	}
});