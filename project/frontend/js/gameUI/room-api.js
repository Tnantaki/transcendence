import * as Constant from "../constants.js";
import { fetchAPI } from "../userManage/api.js";
import { updateLobby } from "./lobby-menu.js";
import { loadPage } from "../router.js";
// import { addRoom } from "./lobby-board.js";

export let cachedRooms = [];

let modal;
export function showModal() {
	if (!modal)
		modal = new bootstrap.Modal(document.getElementById('createRoomModal'));
	modal.show();
}

function closeModal() {
	if (modal)
		modal.hide();
}

const createRoomBtn = document.getElementById("createRoomBtn");
createRoomBtn.addEventListener('click', function () {
	const roomName = document.getElementById("room-name-input").value;

	if (roomName) {
		createRoomAPI(roomName)
			.then(res => {
				cachedRooms.length = 0;
				updateLobby(res.game_type); // no need to update, just go the game. The update will take place after the player leave the match
				closeModal();
				// loadPage("/online?room_id=" + res.id);
			})
			.catch(error => {
				console.error("Error creating room: ", error);
			})
	}
})

document.getElementById('createRoomModal').addEventListener('hidden.bs.modal', function () {
	document.getElementById('room-name-input').value = ' ';
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


// ! all the rooms created still in the database (40+ of them)
export async function getAllRooms() {
	if (cachedRooms.length > 0)
		return cachedRooms;
	console.log("not a cached room");
	try {
		const res = await getRoomAPI();
		cachedRooms = res;
		return res;
	} catch (error) {
		console.error("Error cannot get rooms: ", error);
		return null;
	}
}

export function getRoomlength() {
	return cachedRooms.length;
}