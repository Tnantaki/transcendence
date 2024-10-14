import * as constant from "../constants.js";
import { fetchAPI } from "../userManage/api.js";

fetchHistoryData()

async function fetchHistoryData() {
  try {
		// const response = await fetchAPI("GET", constant.API_GET_MATCH_HISTORY, { auth: true, });
		const response = await fetchAPI("GET", constant.API_FRIEND_LIST, { auth: true, });

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const matches = await response.json();
    console.log(matches)
    if (matches) {
      listHistory(matches)
    }
  } catch (error) {
		console.error(error.message);
  }
}

async function listHistory(matches) {
	const matchHistoryTable = document.getElementById('match-history-table');

  matches.forEach(match => {
    const item = document.createElement("li");
    item.classList.add("row", "table-list-item");
    item.innerHTML = `
			<div id="my-profile" class="col-1 player-item-picture">
				<img src="/api${match.profile}" alt="profile-picture">
			</div>
			<div class="col-2 player-item-content friend-name" data-bs-toggle="modal" data-bs-target="#profileModal"
				onclick="getProfileById('${match.id}')">${match.display_name}</div>
			<div class="col player-item-content">0 : 0</div>
			<div id="friend-profile" class="col-1 player-item-picture">
				<img src="/api${match.profile}" alt="profile-picture">
			</div>
			<div class="col-2 player-item-content friend-name" data-bs-toggle="modal" data-bs-target="#profileModal"
				onclick="getProfileById('${match.id}')">${match.display_name}</div>
			<div class="col-3 player-item-content">11/07/2024</div>
			<div class="table-item-background"></div>
    `
    matchHistoryTable.appendChild(item);
  })
}


// create table for match history
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


// window.getProfileById = getProfileById("asd");

// Mos Test Modal profile
// async function getFriendList() {
//   try {
//     const friendList = document.getElementById("friendList");
//     const response = await fetchAPI("GET", constant.MOCKUP_FRIENDLIST, {
//       auth: false,
//     }); // TODO: auth must be true

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const friendListValue = await response.json();

//     friendListValue.forEach(friend => {
//       const item = document.createElement("li");
//       item.classList.add("friend-list-item");
//       item.innerHTML = `
//         <div class="d-flex justify-content-center friend-item-picture ">
//           <img src="${friend.image}" alt="profile picture">
//         </div>
//         <div class="d-flex align-items-center friend-item-name">
//           <div class="online-status ms-0"></div>
//           <p class="font-bs-bold fs-xl friend-name" data-bs-toggle="modal" data-bs-target="#profileModal" 
//             onclick="getProfileById(${friend.id})">
//             ${friend.display_name}
//           </p>
//         </div>
//         <div class="friend-item-background"></div>
//       `
//       friendList.appendChild(item);
//     })
//   } catch (error) {
//     console.error(error.message);
//   }
// }

// getFriendList();