import * as Constant from "../constants.js";
import { fetchAPI } from "../userManage/api.js";
import { updateLobby } from "./lobby-menu.js";
// import { addRoom } from "./lobby-board.js";

let modal;
export function showModal() {
	if (!modal)
		modal = new bootstrap.Modal(document.getElementById('createRoomModal'));
	modal.show();
}

export function closeModal() {
	if (modal)
		modal.hide();
}

let roomData = null;
function storeRoomData(room) {
	roomData = room;
}

export function getRoomData() {
	return roomData;
}


const createRoomBtn = document.getElementById("createRoomBtn");
createRoomBtn.addEventListener('click', function () {
	const roomName = document.getElementById("room-name-input").value;

	if (roomName) {
		createRoomAPI(roomName)
			.then(res => {
				updateLobby(res.game_type);
				closeModal();
			})
			.catch(error => {
				console.error("Error creating room: ", error);
			})
	}
})

document.getElementById('createRoomModal').addEventListener('hidden.bs.modal', function () {
	document.getElementById('room-name-input').value = '';
})

async function createRoomAPI(roomName) {
	try {
		const response = await fetchAPI("POST", Constant.API_ROOM, {
			auth: true,
			body: { name: roomName },
		});

		if (!response.ok) {
			const errorBody = await response.text();
			console.log("error body res: ", errorBody);
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		else {
			console.log("suceess! ", response.status);
			const res = await response.json();
			return res;
		}
	} catch (error) {
		console.error("Cannot create room: ", error.message);
		throw error;
	}
}


export async function getRoomAPI() {
	try {
		const response = await fetchAPI("GET", Constant.API_ROOM, { auth: true, });

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		else {
			console.log("suceess! ", response.status);
			const res = await response.json();
			// console.log("here: ", res);
			return res;
		}
	} catch (error) {
		console.error("Cannot GET room: ", error.message);
		throw error;
	}
}

