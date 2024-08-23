import * as Constant from "../constants.js";
import { fetchAPI } from "../userManage/api.js";

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

const createRoomBtn = document.getElementById("createRoomBtn");
createRoomBtn.addEventListener('click', function() {
		const modal = new bootstrap.Modal(document.getElementById('createRoomModal'));
		const roomName = document.getElementById("room-name-input").value;

		if (roomName) {
			console.log(roomName);
			createRoomNameAPI(roomName);
			closeModal();
		}
document.getElementById('createRoomModal').addEventListener('hidden.bs.modal', function () {
			document.getElementById('room-name-input').value = ' ';
		})
})

async function createRoomNameAPI(roomName) {
	console.log("In createRoomAPI");
	try {
		const response = await fetchAPI("POST", Constant.API_CREATE_ROOM, {auth: true,});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		else
			console.log("suceess!");

	} catch (error) {
		console.error(error.message);
	}
}

