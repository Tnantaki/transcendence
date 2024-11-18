import { getLeaderboard } from "../services/gameService.js";

renderLearderboard(document.getElementById('leaderboard'), document.getElementById('player-list'))

async function renderLearderboard(leaderboardTop3, leaderboardTable) {
  const players = await getLeaderboard();
  if (!players) return

  console.log(players)
  renderLeaderboardTop3(leaderboardTop3, players)
  renderLeaderboardTable(leaderboardTable, players)
}

function renderLeaderboardTop3(leaderboardDOM, players) {
  for (let i = 0; i < 3; i++) {
    const player = leaderboardDOM.querySelector('#number' + (i + 1))
    let picture = player.querySelector('#picture')
    let name = player.querySelector('#name')

    if (i < players.length) {
      picture.src = "/api" + players[i].profile
      name.innerHTML = players[i].display_name
    }
  }
}

async function renderLeaderboardTable(leaderboardTable, players) {
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
        <p class="friend-name" data-bs-toggle="modal"
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
    leaderboardTable.appendChild(item);
  })
}
