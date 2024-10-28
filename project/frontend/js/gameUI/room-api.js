import * as Constant from "../constants.js";
import { fetchAPI } from "../userManage/api.js";
import { checkGameMode, updateLobby } from "./lobby-menu.js";
import { loadPage } from "../router.js";

export let cachedRooms = [];

let roomModal;
function initRoomModal() {
	roomModal = document.getElementById("createRoomModal");
}

function eraseInput() {
	if (!roomModal)
		initRoomModal();
	roomModal.addEventListener('hidden.bs.modal', function () {
		document.getElementById('room-name-input').value = ' ';
	})
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

function execCreateRoomBtn(mode) {
	createRoomBtn.addEventListener('click', function () {
		const roomName = document.getElementById("room-name-input").value;
		if (roomName) {
			if (mode == "online") {
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
			else {
				createTourRoomAPI(roomName)
					.then(res => {
						cachedRooms.length = 0;
						updateLobby(res.game_type); // no need to update, just go the game. The update will take place after the player leave the match
						closeModal();
						// loadPage("/online?room_id=" + res.id);
					})
					.catch(error => {
						console.error("Error creating tournament: ", error);
					})
			}
		}
	})
}


export function createRoom(mode) {
	showModal();
	if (!createRoomBtn)
		initCreateRoomBtn();
	execCreateRoomBtn(mode);
}

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
		console.log("sendding url: ", Constant.API_ROOM);
		console.log(response);
        // Log the full response details for debugging
        // console.log("Response status:", response.status);
        // console.log("Response headers:", Object.fromEntries(response.headers.entries()));
        
        // Get the raw response text
        // const rawResponse = await response.text();
        // console.log("Raw response:", rawResponse.substring(0, 500)); // First 500 characters

		// console.log("content-type: ", response.headers.get("Content-Type"));

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		else {
			console.log("suceess! ", response.status);
			const res = await response.json();
			console.log("here: ", res);
			return res;
		}
	} catch (error) {
		console.error("Cannot GET room: ", error.message);
		throw error;
	}
}

async function createTourRoomAPI() { 
	try {
		const response = await fetchAPI("POST", Constant.API_CREATE_TOUR, {
			auth: true,
			body: { name: roomName },
		});
		// console.log("tournamenet: ", response);
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
// export async function getTourRoomAPI() {
//     try {
//         const response = await fetchAPI("GET", Constant.API_GET_TOUR, { auth: true });
        
//         // Log the full response details for debugging
//         console.log("Response status:", response.status);
//         console.log("Response headers:", Object.fromEntries(response.headers.entries()));
        
//         // Get the raw response text
//         const rawResponse = await response.text();
//         console.log("Raw response:", rawResponse.substring(0, 500)); // First 500 characters

//         // Try to determine what we received
//         const contentType = response.headers.get("content-type");
//         console.log("Content-Type:", contentType);

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         // If we got here and the content isn't JSON, throw an error
//         if (!contentType || !contentType.includes("application/json")) {
//             throw new Error(`Invalid content type: ${contentType}. Expected JSON.`);
//         }

//         // If it is JSON, parse it
//         const res = JSON.parse(rawResponse);
//         console.log("Parsed JSON:", res);
//         return res;
//     } catch (error) {
//         console.error("Cannot GET tournament:", error.message);
//         throw error;
//     }
// }

export async function getTourRoomAPI() {
	try {
		const response = await fetchAPI("GET", Constant.API_GET_TOUR, { auth: true, });
		// console.log(response.headers.get("content-type"));
		// console.log("sendding url: ", Constant.API_GET_TOUR);
		console.log(response);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		else {
			console.log("suceess! ", response.status);
			console.log();
			const res = await response.json();
			console.log("here: ", res);
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
		console.log("api: ", res);
		cachedRooms = res;
		return res;
	}
	catch (error) {
		console.log("Error cannot get rooms: ", error);
		return null;
	}
	// try {
	// 	let res;
	// 	if (checkGameMode() == "online")
	// 		res = await getRoomAPI();
	// 	else
	// 		res = await getTourRoomAPI();
	// 	cachedRooms = res;
	// 	return res;
	// } catch (error) {
	// 	console.error("Error cannot get rooms: ", error);
	// 	return null;
	// }

	// if (mode == "online") {
	// 	try {
	// 		const res = await getRoomAPI();
	// 		cachedRooms = res;
	// 		return res;
	// 	} catch (error) {
	// 		console.error("Error cannot get rooms: ", error);
	// 		return null;
	// 	}
	// }
	// else {
	// 	try {
	// 		const res = await getTourRoomAPI();
	// 		cachedRooms = res;
	// 		return res;
	// 	} catch (error) {
	// 		console.error("Error cannot get rooms: ", error);
	// 		return null;
	// 	}
	// }
}

export function getRoomlength() {
	return cachedRooms.length;
}
