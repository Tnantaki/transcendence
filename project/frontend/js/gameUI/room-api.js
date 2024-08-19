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

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('createRoomModal').addEventListener('click', function() {
		const roomName = document.getElementById("room-name-input").value;
		if (roomName) {
			createRoomNameAPI(roomName);
		}
		console.log("clicked");
	})

	// clear input when modal is hidden
	$('#createRoomModal').on('hidden.bs.modal', function() {
		document.getElementById('room-name-input').value = '';
	})
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