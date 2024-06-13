// const canvas = document.getElementById("gameArea");
// const ctx = canvas.getContext("2d");

// start buttom position
const XPOS = 70;
const YPOS = 320;

// image position
// let imageX = 0;
// let imageY = 0;

// button settings
const createBtn = {
	width: 150, height: 50, bg: "transparent",
	textColor: "white", font: "60px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Create Room"
};

// pre-load the image
let pongImg = new Image();
pongImg.src = "images/table-tennis.png";
pongImg.onload = function() { // call the anonymous function when the image is loaded
	initCanvas();
    drawTextBtn(createBtn);
	// drawCreateBtn(imageX, imageY);
	// drawBackBtn(imageX, imageY);
};

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
	ctx.fillText("Online Match", textX, textY);

	// get text height
	const textHeight = ctx.measureText("m").width;

	const imgRatio = 300;
	imageX = textX - (imgRatio / 2);
	imageY = textY + textHeight + (100 / 2);
	ctx.drawImage(pongImg, imageX, imageY, imgRatio, imgRatio);
	// console.log("canvas: " + imageX + " " + imageY)
}

// function drawCreateBtn()
// {
// 	const x = imageX + XPOS;
// 	const y = imageY + YPOS;
// 	const btnWidth = 150;
// 	const btnHeight = 50;

// 	// draw button background
// 	ctx.fillStyle = "transparent";
// 	ctx.fillRect(x, y, btnWidth, btnHeight);

// 	// draw text on button
// 	ctx.fillStyle = "white";
// 	ctx.font = "40px Irish Grover";
// 	ctx.textAlign = "center";
// 	ctx.textBaseline = "middle";
// 	ctx.fillText("Create Room", x + btnWidth / 2, y + btnHeight / 2);
// }

// function drawBackBtn()
// {
// 	const x = imageX + XPOS;
// 	const y = imageY + YPOS + 50;
// 	const btnWidth = 150;
// 	const btnHeight = 50;

// 	// draw button background
// 	ctx.fillStyle = "transparent";
// 	ctx.fillRect(x, y, btnWidth, btnHeight);

// 	// draw text on button
// 	ctx.fillStyle = "white";
// 	ctx.font = "40px Irish Grover";
// 	ctx.textAlign = "center";
// 	ctx.textBaseline = "middle";
// 	ctx.fillText("Back", x + btnWidth / 2, y + btnHeight / 2);
// }