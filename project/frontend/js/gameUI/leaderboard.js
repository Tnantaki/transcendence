import * as constant from "../constants.js";
import { fetchAPI } from "../userManage/api.js";

// get profile image from database
// async function getProfile() {
// 	try {
// 		const profile = document.getElementById("my-profile");
// 		const response = await fetchAPI("GET", constant.API_MY_PROFILE, { auth: true, });

// 		if (!response.ok) {
// 			throw new Error(`HTTP error! status: ${response.status}`);
// 		}
// 		const profileValue = await response.json();
// 		console.log("fetch profile success");
// 		// console.log("ID: " + profileValue["id"]);

// 		profile.querySelector("#profileImage").src = "/api" + profileValue["profile"];
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// }

async function getLeaderBoardProfile() {
  try {
		const leaderboard = document.getElementById('leaderboard');
    const num1 = leaderboard.querySelector('#number1')
    const num2 = leaderboard.querySelector('#number2')
    const num3 = leaderboard.querySelector('#number3')

    // :TODO fetch real api
    num1.querySelector('#picture').src = '/js/mock/joey.png'
    num1.querySelector('#name').innerHTML = 'Storm Breaker'

    num2.querySelector('#picture').src = '/js/mock/gideon.png'
    num2.querySelector('#name').innerHTML = 'Storm Breaker'

    num3.querySelector('#picture').src = '/js/mock/mystic.png'
    num3.querySelector('#name').innerHTML = 'Storm Breaker'
  } catch (error) {
		console.error(error.message);
  }
}

async function getPlayerListProfile() {
  try {
    const playerList = document.getElementById('player-list');

    const item = document.createElement("li");
    item.classList.add("row", "container-fluid", "player-item");
    item.innerHTML = `
      <div class="col-2">
        <p>#1</p>
      </div>
      <div class="d-flex justify-content-start col">
        <div class="position-relative d-flex ms-3 col-4">
          <img alt="profile-picture" class="player-img">
        </div>
        <p>name</p>
      </div>
      <div class="col-2">
        <p>25</p>
      </div>
      <div class="col-2">
        <p>5</p>
      </div>
      <div class="col-2">
        <p>30</p>
      </div>
    `
    playerList.appendChild(item);
  } catch (error) {
		console.error(error.message);
  }
}

getLeaderBoardProfile()
getPlayerListProfile()
getPlayerListProfile()
getPlayerListProfile()
getPlayerListProfile()
