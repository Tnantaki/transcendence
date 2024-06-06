const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

let imageX = 0;
let imageY = 0;

// pre-load the image
let pongImg = new Image();
pongImg.src = "images/table-tennis.png";
pongImg.onload = function() { // call the anonymous function when the image is loaded
	drawCanvas();
	drawStartBtn(imageX, imageY);
	drawPlayerList(players);
	drawAddBtn();
};

function drawCanvas()
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
	ctx.drawImage(pongImg, imageX, imageY, imgRatio, imgRatio);
	// console.log("canvas: " + imageX + " " + imageY)
}

// button setup
const btnWidth = 200;
const btnHeight = 50;

function drawStartBtn()
{
	const x = imageX + 50;
	const y = imageY + 350;

	// draw button background
	ctx.fillStyle = "white";
	ctx.fillRect(imageX + 50, imageY + 350, btnWidth, btnHeight);

	// draw text on button
	ctx.fillStyle = "red";
	ctx.font = "60px Irish Grover";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Start", x + btnWidth / 2, y + btnHeight / 2);
}

// listen to start button click


// create dynamic list view
let players = [{name: "Player 1"}];
function drawPlayerList(players)
{
	const startX = canvas.width - 950;
	const startY = 100;
	const padding = 30;
	const lineHeight = 40;
	const maxWidth = 450;


	// draw players board
	ctx.fillStyle = "rgb(255, 255, 255, 0.2)";
	ctx.roundRect(startX, startY, maxWidth, lineHeight * players.length + padding * 2, 10);
	ctx.fill();

	ctx.font = "40px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	ctx.fillText("Players", startX + 50, startY - 23);

	// write players' names
	ctx.font = "25px Irish Grover";
	ctx.fillStyle = "white";
	ctx.textBaseline = "top";
	players.forEach((player, index) => {
		const yPos = startY + padding + index * lineHeight;
		ctx.fillText(player.name, startX + padding + 40, yPos + 20);
	});
}

function drawNewCanvas()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawCanvas();
	drawPlayerList();
}

function addPlayer(name)
{
	players.push({name: name});
	drawNewCanvas(players);
}

function drawAddBtn()
{
	const btnX = canvas.width - 505;
	const btnY = 200;
	const btnRadius = 10;

	ctx.beginPath();
	ctx.arc(btnX, btnY, btnRadius, 0, 2 * Math.PI);
	ctx.fillStyle = "rgb(52, 65, 172)";
	ctx.fill();
	// ctx.strokeStyle = "white";
	// ctx.stroke();

	// draw + on btn
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.moveTo(btnX + 10, btnY);
	ctx.lineTo(btnX - 10, btnY);
	ctx.stroke();

	ctx.beginPath();
	ctx.linewidth = 2;
	ctx.strokeStyle = "white";
	ctx.moveTo(btnX, btnY - 10);
	ctx.lineTo(btnX, 210);
	ctx.stroke();
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

	const btnX = canvas.width - 505;
	const btnY = 200;
	const btnRadius = 10;

	if (isAddButton(btnX, btnY, btnRadius, x, y)) {
		const newName = prompt("Enter player name:");
		if (newName)
			addPlayer(newName);
	}
});