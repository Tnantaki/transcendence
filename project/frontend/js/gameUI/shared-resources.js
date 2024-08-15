// button settings
const createBtnObj = {
	width: 300, height: 50, bg: "transparent",
	textColor: "white", font: "50px Irish Grover",
	textAlign: "center", textBaseline: "middle",
	text: "Create Room", xPos: 5, yPos: 320
};
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
	
