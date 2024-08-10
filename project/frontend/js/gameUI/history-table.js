import * as constant from "../constants.js";
import { fetchAPI } from "../userManage/api.js";

// get profile image from database
async function getProfile() {
	try {
		const profile = document.getElementById("my-profile");
		const response = await fetchAPI("GET", constant.API_MY_PROFILE, { auth: true, });

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const profileValue = await response.json();
		console.log("fetch profile success");
		// console.log("ID: " + profileValue["id"]);

		profile.querySelector("#profileImage").src = "/api" + profileValue["profile"];
	} catch (error) {
		console.error(error.message);
	}
}

async function getProfileById(id) {
	try {
		// console.log("try to fetch");
		const profile = document.getElementById("friend-profile");
		const response = await fetchAPI("GET", constant.API_USER_ID + "uJOlSFOuL-n3qPZk3nDqUmGG");
		// console.log("fetch:",response);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		// console.log("response ok");
		const profileValue = await response.json();
		// console.log("fetch friends' profiles success");

		profile.querySelector("#friendProfileImage").src = profileValue["image"]
			|| "./static/svg/default-user-picture.svg";
	} catch (error) {
		console.error(error.message);
	}
}


// create table for match history
const matchHistoryTable = document.getElementById('match-history-table');
// const numberOfMatches = 6;
// for (let i = 0; i < numberOfMatches; i++) {
// 	const matchRow = `
// 		<div class="row align-items-center mb-5">
// 			<div id="my-profile" class="col-1">
// 				<img id=profileImage alt="profile-picture" class="player-img profile-img-overlay">
// 			</div>
// 			<div class="col-2">player_name</div>
// 			<div class="col">0 : 0</div>
// 			<div id="friend-profile" class="col-1">
// 				<img id="friendProfileImage alt="profile-picture" class="player-img profile-img-overlay">
// 			</div>
// 			<div class="col-2">player2_name</div>
// 			<div class="col-3">11/07/2024</div>
// 			<div class="col">01:01</div>
// 		</div>
// 		`;
// 	matchHistoryTable.innerHTML += matchRow;
// }

// for (let i = 0; i < numberOfMatches; i++) {
// 	const matchRow = `
// 		<div class="row align-items-center mb-5 ">
// 			<div class="col-3"> <img id="profileImage" alt="profile-picture"> player_name${i + 1}</div>
// 			<div class="col">0 : 0</div>
// 			<div class="col-3">player2_name${i + 1}</div>
// 			<div class="col-3">11/07/2024</div>
// 			<div class="col">01:01</div>
// 		</div>
// 		`;
// 	matchHistoryTable.innerHTML += matchRow;
// }


// sample
const matchRow = `
	<div class="row align-items-center mb-5">
		<div id="my-profile" class="col-1">
			<img id=profileImage alt="profile-picture" class="player-img profile-img-overlay">
		</div>
		<div class="col-2">player_name</div>
		<div class="col">0 : 0</div>
		<div id="friend-profile" class="col-1">
			<img id="friendProfileImage alt="profile-picture" class="player-img profile-img-overlay">
		</div>
		<div class="col-2">player2_name</div>
		<div class="col-3">11/07/2024</div>
		<div class="col">01:01</div>
	</div>
	`;
matchHistoryTable.innerHTML += matchRow;

getProfile();
window.getProfileById = getProfileById("asd");