// preload the img
let pongImg = null;
export function getPongImg() {
	if (!pongImg) {
		pongImg = new Image();
		pongImg.src = "js/gameUI/images/table-tennis.png";
	}
	return new Promise ((resolve, reject) => {
		if (pongImg.complete)
			resolve(pongImg);
		else {
			pongImg.onload = () => resolve(pongImg);
			pongImg.onerror = () => reject;
		}
	})
}

// button settings
const createBtnObj = {
	width: 300, height: 50, bg: "transparent",
	textColor: "white", font: "50px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Create Room", xPos: 5, yPos: 320
};
const startBtnObj = {
	width: 150, height: 50, bg: "transparent",
	textColor: "white", font: "60px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Start", xPos: 70, yPos: 320
};
const backBtnObj = {
	width: 90, height: 35, bg: "transparent",
	textColor: "white", font: "40px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Back", xPos: 90, yPos: 380
};
export const btns = {createBtn: createBtnObj, startBtn: startBtnObj, backBtn: backBtnObj};

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

// references for button events
const createBtn = (event) => handleCreateBtn(createBtnObj, event);
const startBtn = (event) => handleStartBtn(startBtnObj, event);
const backBtn = (event) => handleBackBtn(backBtnObj, event);
export const evtBtns = {createBtn: createBtn, startBtn: startBtn, backBtn: backBtn};