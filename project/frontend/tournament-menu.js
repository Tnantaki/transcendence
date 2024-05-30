const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

function drawCompCanvas()
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

	// get text width
	const textHeight = ctx.measureText("m").width;

	// insert image
	pongImg = new Image();
	pongImg.src = "images/table-tennis.png";
	pongImg.onload = function() {
		const imgRatio = 300;
		const imageX = textX - (imgRatio / 2);
		const iamgeY = textY + textHeight + (100 / 2);
		ctx.drawImage(pongImg, imageX, iamgeY, imgRatio, imgRatio);
	};
}

drawCompCanvas();