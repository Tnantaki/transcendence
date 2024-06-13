function removeEvent(evt){
	canvas.removeEventListener("click", evt);
	// console.log("remove main menu button");
}

function addEventToCanvas(evt) {
	canvas.addEventListener("click", evt);
}

function manageEvt(status, evt)
{
    // 0 --> add event
    if (!status)
        addEventToCanvas(evt);
    else
        removeEvent(evt);
}

// draw buttons that are text-based
function drawTextBtn(btnObj, xPos, yPos)
{
	const x = imageX + xPos;
	const y = imageY + yPos;
	const btnWidth = btnObj.width;
	const btnHeight = btnObj.height;

	// draw button background
	ctx.fillStyle = btnObj.bg;
	ctx.fillRect(x, y, btnWidth, btnHeight);

	// draw text on button
	ctx.fillStyle = btnObj.textColor;
	ctx.font = btnObj.font;
	ctx.textAlign = btnObj.textAlign;
	ctx.textBaseline = btnObj.textBaseline;
	ctx.fillText(btnObj.text, x + btnWidth / 2, y + btnHeight / 2);
}