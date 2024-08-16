import * as Constant from "../constants.js";
import { fetchAPI } from "../userManage/api.js";

export function showForm() {
	document.getElementById("room-name").style.display = "none";
}

export function closeForm() {
	document.getElementById("room-name").style.display = "none";
}

document.getElementById("room-form").addEventListener("submit", function (event) {
	event.preventDefault();
	const roomName = document.getElementById("room-name-input").value;
	if (roomName) {
		createRoomNameAPI(roomName);
		closeForm();
	}
})

async function createRoomNameAPI(roomName) {
	try {
		const response = await fetchAPI("POST", constants.API_CREATE_ROOM, {auth: true,});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

	} catch (error) {
		console.error(error.message);
	}
}