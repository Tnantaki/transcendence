import * as Constant from "../constants.js";
import { fetchAPI } from "../userManage/api.js";

export function showModal() {
	$('#createRoomModal').modal('show');
}

export function closeModal() {
	$('#createRoomModal').modal('hide');
}

document.getElementById("room-form").addEventListener("submit", function (event) {
	event.preventDefault();
	const roomName = document.getElementById("room-name-input").value;
	if (roomName) {
		createRoomNameAPI(roomName);
	}

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

// make closeForm() global
window.closeForm = closeForm;