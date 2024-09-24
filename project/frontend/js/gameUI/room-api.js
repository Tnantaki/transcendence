import * as Constant from "../constants.js";
import { fetchAPI } from "../userManage/api.js";
import { addRoom } from "./lobby-menu.js";

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
		const roomName = document.getElementById("room-name-input").value;

		if (roomName) {
			const res = createRoomAPI(roomName);
			addRoom(res);
			closeModal();
		}
		document.getElementById('createRoomModal').addEventListener('hidden.bs.modal', function () {
			document.getElementById('room-name-input').value = ' ';
		})
})

async function createRoomAPI(roomName) {
	console.log("send request: ", roomName);
	try {
		const response = await fetchAPI("POST", Constant.API_CREATE_ROOM, {
			auth: true, 
			body: {name: roomName},
		});

		if (!response.ok) {
			const errorBody = await response.text();
			console.log("error body res: ", errorBody);
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		else
		{
			console.log("suceess! ", response.status);
			const res = await response.json();
			console.log(res);
			return res;
		}
	} catch (error) {
		console.error("Cannot create room: ", error.message);
	}
}
