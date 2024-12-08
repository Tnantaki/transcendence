import * as Constant from "../constants.js";
import { fetchAPI } from "../services/api.js";
import { checkGameMode, setGameMode, updateLobby } from "./lobby-menu.js";
import { loadPage } from "../router.js";
import { manageEvt } from "./utils.js";
import { joinWaitingRoom } from "./WaitingRoom.js";
import { connectTourSocket } from "./tourSocket.js";
import { evtBtns } from "./shared-resources.js";

export let cachedRooms = [];

let roomModal;
function initRoomModal() {
	roomModal = document.getElementById("createRoomModal");
}

function eraseInput() {
	if (!roomModal)
		initRoomModal();
		
	let input = document.getElementById('room-name-input');
	if (input)
		input.value = '';
}

let modal;
function closeModal() {
	if (modal)
		modal.hide();
	eraseInput();
}

function showModal() {
	if (!modal)
		modal = new bootstrap.Modal(document.getElementById('createRoomModal'));
	modal.show();
}

let createRoomBtn;
function initCreateRoomBtn() {
	createRoomBtn = document.getElementById("createRoomBtn");
}

const createEvt = (event) => postRoom(checkGameMode(), event);

function manageCreateRoomBtn(status, evt) {
	if (!status)
		createRoomBtn.addEventListener("click", evt);
	else
		createRoomBtn.removeEventListener("click", evt);
}

function postRoom(mode) {
	const roomName = document.getElementById("room-name-input").value;

	if (roomName.length > 10)
		return (alert("Room name must not exceed 10 characters!"));

	if (roomName) {
		if (mode == "online") {
			createRoomAPI(roomName)
				.then(res => {
					cachedRooms.length = 0;
					// updateLobby("online"); //! no need to update, just go the game. The update will take place after the player leave the match
					manageCreateRoomBtn(1, createEvt);
					closeModal();
					loadPage("/online?room_id=" + res.id);
				})
				.catch(error => {
					console.error("Error creating room: ", error);
				})
		}
		else {
			createTourRoomAPI(roomName)
				.then(res => {
					cachedRooms.length = 0;
					manageCreateRoomBtn(1, createEvt);
					closeModal();
					manageEvt(1, evtBtns.createBtn);
					manageEvt(1, evtBtns.backBtn);
					setGameMode("WaitingRoom");
					connectTourSocket(res, joinWaitingRoom)
					// updateLobby("tournament"); //! no need to update, just go the game. The update will take place after the player leave the match
				})
				.catch(error => {
					console.error("Error creating tournament: ", error);
				})
		}
	}
}

export function createRoom() {
	showModal();
	if (!createRoomBtn)
		initCreateRoomBtn();
	manageCreateRoomBtn(0, createEvt);
}

async function createRoomAPI(roomName) {
	try {
		const response = await fetchAPI("POST", Constant.API_ROOM, {
			auth: true,
			body: { name: roomName },
		});

		if (!response.ok) {
			const errorBody = await response.text();
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		else {
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
			const res = await response.json();
			return res;
		}
	} catch (error) {
		console.error("Cannot GET room: ", error.message);
		throw error;
	}
}

async function createTourRoomAPI(roomName) { 
	try {
		const response = await fetchAPI("POST", Constant.API_CREATE_TOUR, {
			auth: true,
			body: { name: roomName },
		});

		if (!response.ok) {
			const errorBody = await response.text();
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		else {
			const res = await response.json();
			return res;
		}
	} catch (error) {
		console.error("Cannot create room: ", error.message);
		throw error;
	}
}

export async function getTourRoomAPI() {
	try {
		const response = await fetchAPI("GET", Constant.API_GET_TOUR, { auth: true, });

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		else {
			const res = await response.json();
			return res;
		}
	} catch (error) {
		console.error("Cannot GET tournament: ", error.message);
		throw error;
	}
}



// ! all the rooms created still in the database (40+ of them)
export async function getAllRooms(mode) {

	if (cachedRooms.length > 0)
		return cachedRooms;

	try {
		const res = mode === "online" ? await getRoomAPI() : await getTourRoomAPI();
		if (res && Array.isArray(res))
			cachedRooms.length = 0;
			cachedRooms = res;
		return res;
	}
	catch (error) {
		console.log("Error cannot get rooms: ", error);
		return null;
	}
}

export function getRoomlength() {
	return cachedRooms.length;
}
