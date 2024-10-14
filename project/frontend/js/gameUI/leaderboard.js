import * as constant from "../constants.js";
import { fetchAPI } from "../userManage/api.js";

fetchData()

async function fetchData() {
  try {
		// const response = await fetchAPI("GET", constant.API_GET_LEADERBOARD, { auth: true, });
		const response = await fetchAPI("GET", constant.API_FRIEND_LIST, { auth: true, });

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const learderboardValue = await response.json();
    console.log(learderboardValue)
    if (learderboardValue) {
      listLeaderBoardProfile(learderboardValue)
      listPlayers(learderboardValue)
    }
  } catch (error) {
		console.error(error.message);
  }
}

function listLeaderBoardProfile(players) {
  const leaderboard = document.getElementById('leaderboard');

  for (let i = 0; i < 3; i++) {
    const player = leaderboard.querySelector('#number' + (i + 1))
    let picture = player.querySelector('#picture')
    let name = player.querySelector('#name')

    if (i < players.length) {
      picture.src = "/api" + players[i].profile
      name.innerHTML = players[i].display_name
    }
  }
}

async function listPlayers(players) {
  try {
    const playerList = document.getElementById('player-list');
    let rank = 1

    players.forEach(p => {
      const item = document.createElement("li");
      item.classList.add("row", "container-fluid", "player-list-item");
      item.innerHTML = `
        <div class="col-2 player-item-content">
          <p>${rank++}</p>
        </div>
        <div class="col player-item-content justify-content-start">
          <div class="col-4 ms-3 player-item-picture">
            <img src="/api${p.profile}" alt="profile-picture">
          </div>
          <p class="name-hover friend-name" data-bs-toggle="modal"
            data-bs-target="#profileModal" onclick="getProfileById('${p.id}')">
            ${p.display_name}
          </p>
        </div>
        <div class="col-2 player-item-content">
          <p>${p.wins}</p>
        </div>
        <div class="col-2 player-item-content">
          <p>${p.losses}</p>
        </div>
        <div class="col-2 player-item-content">
          <p>${p.score}</p>
        </div>
        <div class="player-item-background"></div>
      `
      playerList.appendChild(item);
    })
  } catch (error) {
		console.error(error.message);
  }
}
